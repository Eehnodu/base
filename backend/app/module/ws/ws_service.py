# app/module/ws/ws_service.py
from __future__ import annotations

import time
import json
import asyncio
import base64

from dataclasses import dataclass, field
from typing import Optional, Dict, Any
from fastapi import WebSocket, WebSocketDisconnect

from app.module.infra.gpt_service import GPTService
from app.module.infra.gpt import RoleType, MessageType, LatencyType, EndedReasonType

# socket connect status
@dataclass
class ConnState:
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    chatbot_id: Optional[int] = None
    log_id: Optional[int] = None
    sample_rate: int = 24000
    audio_buffer: bytearray = field(default_factory=bytearray)
    mode: str = "realtime"  # realtime / legacy

    rt_ws: Optional[Any] = None
    rt_task: Optional[asyncio.Task] = None

    stt_model: Optional[str] = None
    tts_model: Optional[str] = None
    response_model: Optional[str] = None
    realtime_model: Optional[str] = None

    stt_start: Optional[float] = None
    tts_start: Optional[float] = None

class WsService:
    def __init__(self, gpt_service: GPTService):
        self.gpt_service = gpt_service

    # common: calculate latency
    @staticmethod
    def _finish_latency(start: Optional[float]) -> tuple[Optional[int], Optional[float]]:
        if start is None:
            return None, None
        latency_ms = int((time.monotonic() - start) * 1000)
        return latency_ms, None

    # common: send websocket JSON 
    async def _send_json(self, websocket: WebSocket, payload: Dict[str, Any]) -> None:
        try:
            await websocket.send_text(json.dumps(payload, ensure_ascii=False))
        except Exception as e:
            print(f"Error in send_json: {e}")

    # common: extract delta text
    @staticmethod
    def _extract_delta_text(delta: Any) -> str:
        if isinstance(delta, dict):
            delta = delta.get("text", "")
        return (delta or "").strip()

    # ===================================
    # WebSocket entry point (create state + loop)
    # ===================================
    async def init_state(self, websocket: WebSocket) -> None:
        await websocket.accept()
        state = ConnState()

        # set user id
        state.user_id = websocket.user_id

        try:
            while True:
                msg = await websocket.receive()
                if msg["type"] == "websocket.disconnect":
                    break

                if msg["type"] == "websocket.receive":
                    data = msg.get("text") or msg.get("bytes")

                    # binary frame (audio)
                    if isinstance(data, (bytes, bytearray)):
                        await self.handle_binary_frame(data, state)
                        continue

                    # text frame (json)
                    try:
                        payload = json.loads(data)
                    except Exception:
                        continue

                    should_break = await self.route_ws_event(
                        payload,
                        websocket,
                        state,
                    )
                    if should_break:
                        break

        except WebSocketDisconnect:
            # abnormal end log update
            if state.session_id:
                try:
                    await self.gpt_service.update_log(
                        session_id=state.session_id,
                        ended_reason=EndedReasonType.ERROR,
                    )
                except Exception as e:
                    print(f"Error in update_log: {e}")
        finally:
            if state.session_id:
                try:
                    await self.gpt_service.clear_session(state.session_id)
                except Exception as e:
                    print(f"Error in clear_session: {e}")
            try:
                await websocket.close()
            except Exception:
                print("Error in close websocket")

    # ===================================
    # Binary frame processing (audio chunk)
    # ===================================
    async def handle_binary_frame(self, binary_data: bytes, state: ConnState) -> None:
        if not state.session_id:
            return

        # always buffer for STT in legacy mode
        state.audio_buffer.extend(binary_data)

        # send to OpenAI Realtime API only in realtime mode
        if getattr(state, "mode", "realtime") == "realtime":
            try:
                await self.gpt_service.realtime_send_pcm(state.session_id, binary_data)
            except Exception as e:
                print(f"Error in realtime_send_pcm: {e}")

    # ===================================
    # Text event routing
    # ===================================
    async def route_ws_event(
        self,
        payload: Dict[str, Any],
        websocket: WebSocket,
        state: ConnState,
    ) -> bool:
        if "session_id" in payload:
            sid = payload.get("session_id")
            if sid:
                state.session_id = sid

        msg_type = payload.get("type")

        if msg_type == "config":
            return await self._handle_config(payload, websocket, state)

        elif msg_type == "send":
            # only for legacy mode (buffer for STT+GPT)
            return await self._handle_send(payload, websocket, state)

        elif msg_type == "chat":
            return await self._handle_chat(payload, websocket, state)

        if msg_type == "disconnect":
            return await self._handle_disconnect(websocket, state)

        return False

    # ===================================
    # config event: initial settings (sampleRate, mode, etc.)
    # ===================================
    async def _handle_config(
        self,
        payload: Dict[str, Any],
        websocket: WebSocket,
        state: ConnState,
    ) -> bool:
        # set client sampleRate
        sample_rate = payload.get("sampleRate") or payload.get("clientSampleRate")
        if sample_rate:
            try:
                state.sample_rate = int(sample_rate)
            except Exception:
                state.sample_rate = 24000

        # mode sent from frontend (realtime / legacy)
        mode = payload.get("mode", "realtime")
        state.mode = mode

        chatbot_id = payload.get("chatbot_id") or 1
        state.chatbot_id = chatbot_id

        if state.session_id:
            try:
                # set session storage and base instruction
                await self.gpt_service.get_or_create_session_storage(state.session_id)
                await self.gpt_service.build_instruction(state.session_id, chatbot_id)

                # TODO get_current_models에서 get_chatbot_setting으로 수정
                current_models = await self.gpt_service.get_current_models()

                if mode == "realtime":
                    # store ConnState
                    state.realtime_model = current_models["realtime_model"]

                    # save log to DB
                    log = await self.gpt_service.create_or_get_log(
                        user_id=state.user_id,
                        session_id=state.session_id,
                        realtime_model=state.realtime_model,
                    )

                    state.log_id = log.id

                else:
                    # store ConnState
                    state.stt_model = current_models["stt_model"]
                    state.tts_model = current_models["tts_model"]
                    state.response_model = current_models["response_model"]

                    # save log to DB
                    log = await self.gpt_service.create_or_get_log(
                        user_id=state.user_id,
                        session_id=state.session_id,
                        stt_model=state.stt_model,
                        tts_model=state.tts_model,
                        response_model=state.response_model,
                    )
                    state.log_id = log.id

            except Exception as e:
                print(
                    f"Error in get_or_create_session_storage / create_or_get_log: {e}"
                )

            if mode == "realtime":
                # create realtime WebSocket and start receive loop
                try:
                    rt_ws = await self.gpt_service.create_realtime_socket(
                        state.session_id,
                        realtime_model=state.realtime_model,
                        stt_model=state.stt_model,
                    )
                    state.rt_ws = rt_ws
                    state.rt_task = asyncio.create_task(
                        self._realtime_receive_loop(
                            state.session_id,
                            rt_ws,
                            websocket,
                            state,
                        )
                    )
                    print(f"[{state.session_id}] Realtime mode started")
                except Exception as e:
                    print(f"Error in create_realtime_socket: {e}")

        return False

    # ===================================
    # chat event: send chat to GPT (+ save log/message/history)
    # ===================================
    async def _handle_chat(
        self,
        payload: Dict[str, Any],
        websocket: WebSocket,
        state: ConnState,
    ) -> bool:
        gpt_text = ""
        input_tokens = 0
        output_tokens = 0

        if not state.session_id:
            return False

        user_text = (payload.get("text") or "").strip()
        if not user_text:
            return False

        # 메시지 저장 (USER)
        if state.log_id is not None:
            try:
                await self.gpt_service.create_message(
                    log_id=state.log_id,
                    role=RoleType.USER,
                    message=user_text,
                    message_type=getattr(MessageType, "TEXT", MessageType.VOICE),
                    latency_ms=None,
                    latency_type=None,
                    tokens=0,
                )
            except Exception as e:
                print(f"Error in create_message (chat user): {e}")

        # 히스토리 저장 (USER)
        try:
            await self.gpt_service.append_history(
                state.session_id, user_text, role="user"
            )
        except Exception as e:
            print(f"Error in append_history (chat user): {e}")

        # 2) GPT 응답
        response_start = time.monotonic()

        try:
            gpt_text, input_tokens, output_tokens = await self.gpt_service.openai_response(
                session_id=state.session_id,
                text=user_text,
                gpt_model=state.response_model,
            )
            gpt_text = (gpt_text or "").strip()
        except Exception as e:
            print(f"Error in openai_response (chat): {e}")
            gpt_text = ""

        gpt_latency_ms = int((time.monotonic() - response_start) * 1000)

        if gpt_text:
            await self._send_json(
                websocket,
                {"type": "gpt_text", "text": gpt_text},
            )

            if state.log_id is not None:
                try:
                    tokens = int(input_tokens or 0) + int(output_tokens or 0)
                    await self.gpt_service.create_message(
                        log_id=state.log_id,
                        role=RoleType.AI,
                        message=gpt_text,
                        message_type=MessageType.TEXT,
                        latency_ms=gpt_latency_ms,
                        latency_type=LatencyType.RESPONSE,
                        tokens=tokens,
                    )

                except Exception as e:
                    print(f"Error in create_message (chat ai): {e}")

            # 히스토리 저장 (AI)
            try:
                await self.gpt_service.append_history(
                    state.session_id, gpt_text, role="assistant"
                )
            except Exception as e:
                print(f"Error in append_history (chat ai): {e}")

        return False

    # ===================================
    # legacy mode send processing (record once and then STT+GPT+TTS)
    # ===================================
    async def _handle_send(
        self,
        payload: Dict[str, Any],
        websocket: WebSocket,
        state: ConnState,
    ) -> bool:
        user_text = ""
        gpt_text = ""
        stt_latency_ms = None
        tts_latency_ms = None
        stt_tokens = 0
        response_tokens = 0
        tts_tokens = 0

        if not state.session_id:
            return False

        # pcm bytes (record entire)
        pcm_bytes = bytes(state.audio_buffer)

        # call STT
        state.stt_start = time.monotonic()
        try:
            user_text, stt_tokens = await self.gpt_service.openai_stt(
                pcm_bytes,
                sample_rate=state.sample_rate,
                stt_model=state.stt_model,
            )
            user_text = (user_text or "").strip()
            state.stt_tokens = stt_tokens
        except Exception as e:
            print(f"Error in openai_stt: {e}")
            user_text = ""

        stt_latency_ms, state.stt_start = self._finish_latency(state.stt_start)

        # send STT result text to client
        await self._send_json(
            websocket,
            {"type": "stt_text", "text": user_text},
        )

        # if user message is empty, exit here
        if not user_text:
            state.audio_buffer = bytearray()
            return False

        if state.log_id is not None:
            try:
                await self.gpt_service.create_message(
                    log_id=state.log_id,
                    role=RoleType.USER,
                    message=user_text,
                    message_type=MessageType.VOICE,
                    latency_ms=stt_latency_ms,
                    latency_type=LatencyType.STT,
                    tokens=stt_tokens,
                )
            except Exception as e:
                print(f"Error in create_message: {e}")

        # GPT response
        state.tts_start = time.monotonic()
        try:
            gpt_text, input_tokens, output_tokens = await self.gpt_service.openai_response(
                session_id=state.session_id,
                text=user_text,
                gpt_model=state.response_model,
            )
            response_tokens = input_tokens + output_tokens
            state.response_tokens = response_tokens
        except Exception as e:
            print(f"Error in openai_response: {e}")
            gpt_text = ""

        if gpt_text:
            # call TTS + send audio
            try:
                tts_bytes, tts_tokens = await self.gpt_service.openai_tts(gpt_text, tts_model=state.tts_model)
                if tts_bytes:
                    await websocket.send_bytes(tts_bytes)
            except Exception as e:
                print(f"Error in send_bytes: {e}")

            # send GPT text to client
            await self._send_json(
                websocket,
                {"type": "gpt_text", "text": gpt_text},
            )

            tts_latency_ms, state.tts_start = self._finish_latency(state.tts_start)

            if state.log_id is not None:
                try:
                    tokens = tts_tokens + response_tokens
                    await self.gpt_service.create_message(
                        log_id=state.log_id,
                        role=RoleType.AI,
                        message=gpt_text,
                        message_type=MessageType.VOICE,
                        latency_ms=tts_latency_ms,
                        latency_type=LatencyType.TTS,
                        tokens=tokens,
                    )
                except Exception as e:
                    print(f"Error in create_message: {e}")

        # save history (user, assistant)
        try:
            if user_text:
                await self.gpt_service.append_history(
                    state.session_id, user_text, role="user"
                )
            if gpt_text:
                await self.gpt_service.append_history(
                    state.session_id, gpt_text, role="assistant"
                )

        except Exception as e:
            print(f"Error in append_history: {e}")

        # initialize audio buffer
        state.audio_buffer = bytearray()
        return False

    # ===================================
    # Realtime receive loop (OpenAI -> Frontend)
    # ===================================
    async def _realtime_receive_loop(
        self,
        session_id: str,
        rt_ws: Any,
        frontend_ws: WebSocket,
        state: ConnState,
    ) -> None:
        gpt_text_buffer = ""
        audio_buffer = bytearray()
        user_text_buffer = ""
        user_text = ""
        gpt_text = ""
        stt_latency_ms = None
        tts_latency_ms = None
        stt_tokens = 0
        tts_tokens = 0

        try:
            async for raw in rt_ws:
                if isinstance(raw, (bytes, bytearray)):
                    continue

                try:
                    event = json.loads(raw)
                except Exception:
                    continue

                event_type = event.get("type")

                # 1. user realtime delta (partial STT) → send only to frontend
                if event_type == "conversation.item.input_audio_transcription.delta":
                    chunk = self._extract_delta_text(event.get("delta", ""))
                    if chunk:

                        if state.stt_start is None:
                            state.stt_start = time.monotonic()

                        user_text_buffer += chunk
                        await self._send_json(
                            frontend_ws,
                            {
                                "type": "stt_text",
                                "text": chunk,
                                "partial": True,
                            },
                        )

                # 2. user speech completed → send only to history
                elif (
                    event_type
                    == "conversation.item.input_audio_transcription.completed"
                ):
                    user_text = (event.get("transcript") or user_text_buffer).strip()

                    usage = event.get("usage") or {}
                    stt_tokens = int(usage.get("total_tokens") or 0)

                    stt_latency_ms, state.stt_start = self._finish_latency(
                        state.stt_start
                    )

                    if user_text:
                        try:
                            await self.gpt_service.append_history(
                                session_id, user_text, role="user"
                            )
                            await self.gpt_service.update_realtime_instruction(
                                session_id
                            )
                        except Exception as e:
                            print(
                                "Error in append_history / update_realtime_instruction: "
                                f"{e}"
                            )
                        if state.log_id is not None:
                            try:
                                await self.gpt_service.create_message(
                                    log_id=state.log_id,
                                    role=RoleType.USER,
                                    message=user_text,
                                    message_type=MessageType.VOICE,
                                    latency_ms=stt_latency_ms,
                                    latency_type=LatencyType.STT,
                                    tokens=stt_tokens,
                                )
                            except Exception as e:
                                print(f"Error in create_message: {e}")
                        user_text = ""
                    user_text_buffer = ""

                # 3. GPT realtime text delta (partial transcript)
                elif event_type == "response.output_audio_transcript.delta":
                    chunk = self._extract_delta_text(event.get("delta", ""))
                    if chunk:
                        gpt_text_buffer += chunk

                # 4. GPT response completed → send final text to frontend and save to history
                elif event_type == "response.output_audio_transcript.done":
                    gpt_text = (
                        event.get("transcript")
                        or event.get("text")
                        or gpt_text_buffer
                    ).strip()

                    if gpt_text:
                        await self._send_json(
                            frontend_ws,
                            {
                                "type": "gpt_text",
                                "text": gpt_text,
                                "partial": False,
                            },
                        )

                        try:
                            await self.gpt_service.append_history(
                                session_id, gpt_text, role="assistant"
                            )
                            await self.gpt_service.update_realtime_instruction(
                                session_id
                            )
                        except Exception as e:
                            print(
                                "Error in append_history / update_realtime_instruction: "
                                f"{e}"
                            )

                    gpt_text_buffer = ""

                # 5. audio delta → buffer
                elif event_type == "response.output_audio.delta":
                    delta = event.get("delta") or ""
                    if delta:
                        if state.tts_start is None:
                            state.tts_start = time.monotonic()
                        try:
                            audio_buffer.extend(base64.b64decode(delta))
                        except Exception as e:
                            print(f"Error in audio delta decode: {e}")

                # 6. audio completed → send to frontend
                elif event_type == "response.output_audio.done":
                    if audio_buffer:
                        try:
                            await frontend_ws.send_bytes(bytes(audio_buffer))
                        except Exception as e:
                            print(f"Error in send_bytes: {e}")
                        audio_buffer = bytearray()

                        tts_latency_ms, state.tts_start = self._finish_latency(
                            state.tts_start
                        )

                # 7. calculate tokens
                elif event_type == "response.done":
                    response_obj = event.get("response") or {}
                    usage = response_obj.get("usage") or {}
                    tts_tokens = int(usage.get("total_tokens") or 0)
                    if state.log_id is not None and gpt_text:
                        try:
                            await self.gpt_service.create_message(
                                log_id=state.log_id,
                                role=RoleType.AI,
                                message=gpt_text,
                                message_type=MessageType.VOICE,
                                latency_ms=tts_latency_ms,
                                latency_type=LatencyType.TTS,
                                tokens=tts_tokens,
                            )
                        except Exception as e:
                            print(f"Error in create_message: {e}")
                    tts_latency_ms = None
                    gpt_text = ""

        except Exception as e:
            print(f"Error in realtime_receive_loop: {e}")
        finally:
            try:
                await self.gpt_service.close_realtime_socket(session_id)
            except Exception as e:
                print(f"Error in close_realtime_socket: {e}")

    # ===================================
    # disconnect processing
    # ===================================
    async def _handle_disconnect(
        self,
        websocket: WebSocket,
        state: ConnState,
    ) -> bool:
        if state.session_id:
            try:
                await self.gpt_service.clear_session(state.session_id)
            except Exception as e:
                print(f"Error in clear_session: {e}")

            # realtime ws close
            try:
                if state.rt_ws:
                    state.rt_task.cancel()
                await self.gpt_service.close_realtime_socket(state.session_id)
            except Exception as e:
                print(f"Error in close_realtime_socket: {e}")

            # update_log
            try:
                await self.gpt_service.update_log(
                    session_id=state.session_id,
                    ended_reason=EndedReasonType.NORMAL,
                )
            except Exception as e:
                print(f"Error in update_log: {e}")

        try:
            await websocket.close()
        except Exception:
            pass

        return True
