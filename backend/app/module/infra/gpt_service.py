# app/module/infra/gpt_service.py

from typing import Dict, Any, Optional
from openai import AsyncOpenAI
from app.core.config.settings import settings
from app.module.ws.audio_utils import convert_pcm_to_wav
import os
import tempfile
import websockets
import json
import base64
from app.module.infra.gpt_repository import GptRepository
from app.module.infra.gpt import EndedReasonType, RoleType, MessageType, LatencyType

# OpenAI 비동기 클라이언트
client = AsyncOpenAI(api_key=settings.openai_api_key)

# 세션별 instruction / history / summary 저장소 (in-memory)
SESSION_STORAGE: Dict[str, Dict[str, Any]] = {}

class GPTService:
    def __init__(self, gpt_repository: GptRepository):
        self.gpt_repository = gpt_repository
        # session_id -> Realtime WebSocket
        self._rt_sockets: dict[str, Any] = {}

    # ===================================
    # internal helpers (same behavior, only整理 duplicates)
    # ===================================
    @staticmethod
    def _history_to_lines(history: list[dict[str, Any]]) -> list[str]:
        lines: list[str] = []
        for msg in history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if not content:
                continue
            lines.append(f"{role}: {content}")
        return lines

    @staticmethod
    def _get_total_tokens(usage: Any, type: str) -> int:
        if usage is None:
            return 0
        return getattr(usage, f"{type}_tokens", 0) or 0

    @staticmethod
    def _safe_remove_file(path: Optional[str], label: str) -> None:
        if not path:
            return
        if not os.path.exists(path):
            return
        try:
            os.remove(path)
        except Exception as e:
            print(f"{label} 파일 삭제 중 오류: {e}")

    # ===================================
    # session management related
    # ===================================
    async def get_or_create_session_storage(self, session_id: str) -> None:
        if not session_id:
            return

        if session_id not in SESSION_STORAGE:
            SESSION_STORAGE[session_id] = {
                "instruction": "",
                "history": [],
                "summary": [],
                "vector_store_id": None,
            }

    # clear session storage
    async def clear_session(self, session_id: str) -> None:
        if not session_id:
            return
        SESSION_STORAGE.pop(session_id, None)

    # set base instruction (persona, etc.)
    async def build_instruction(self, session_id: str, chatbot_id: int) -> None:
        if not session_id:
            return

        chatbot = await self.gpt_repository.get_admin_chatbot_detail(chatbot_id)
        if not chatbot:
            return

        description = chatbot.description
        data_type = chatbot.data_type
        text_data = chatbot.text_data
        fall_back_type = chatbot.fallback_type
        fall_back_text = chatbot.fallback_text

        instruction = f"[지침]\n{description}"

        if data_type == "text":
            instruction += f"\n[학습 데이터]\n 해당 데이터를 활용하여 답해주세요.\n{text_data}"

        if fall_back_type:
            instruction += (
                "[데이터 찾기 실패시 아래 텍스트로만 답해주세요.]"
                f"{fall_back_text}"
            )
        else:
            instruction += (
                "[데이터 찾기 실패시 학습 데이터말고도 알고있는 지식을 활용하여 답해주세요.]"
                f"{fall_back_text}"
            )

        await self.get_or_create_session_storage(session_id)
        SESSION_STORAGE[session_id]["instruction"] = instruction

    # append message to history
    async def append_history(self, session_id: str, text: str, role: str) -> None:
        if not session_id:
            return

        await self.get_or_create_session_storage(session_id)

        SESSION_STORAGE[session_id]["history"].append(
            {
                "role": role,
                "content": text or "",
            }
        )

    # ===================================
    # summary related
    # ===================================
    async def summarize_text(self, session_id: str) -> str:
        if not session_id:
            return ""

        await self.get_or_create_session_storage(session_id)

        history = SESSION_STORAGE[session_id].get("history", [])
        if not history:
            return ""

        history_lines = self._history_to_lines(history)
        if not history_lines:
            return ""

        history_text = "\n".join(history_lines)

        resp = await client.responses.create(
            model="gpt-4o-mini",
            instructions=(
                "You are a summarization assistant.\n"
                "Summarize the following chat history between a user and an assistant.\n"
                "Return only the summary in Korean if the conversation is in Korean.\n"
                "Make it about 30 sentences, capturing important facts, requests, and decisions."
            ),
            input=history_text,
        )

        summary_text = resp.output_text

        SESSION_STORAGE[session_id]["summary"].append(summary_text)
        SESSION_STORAGE[session_id]["history"] = []

        return summary_text

    # ===================================
    # common instruction builder (legacy + realtime common use)
    # ===================================
    async def build_full_instruction(self, session_id: str) -> str:
        if not session_id:
            return ""

        await self.get_or_create_session_storage(session_id)
        storage = SESSION_STORAGE[session_id]

        base_instruction = storage.get("instruction", "")
        history = storage.get("history", [])
        summaries = storage.get("summary", [])

        # if history is too long, summarize and put into summary, then clear history
        if len(history) > 30:
            await self.summarize_text(session_id)
            storage = SESSION_STORAGE[session_id]
            history = storage.get("history", [])
            summaries = storage.get("summary", [])

        # summary block
        summary_block = ""
        if summaries:
            summary_block = "\n\n[Previous summaries]\n" + "\n".join(
                f"- {s}" for s in summaries
            )

        # recent history block
        history_block = ""
        if history:
            history_lines = self._history_to_lines(history)
            if history_lines:
                history_block = "\n\n[Recent history]\n" + "\n".join(history_lines)

        full_instruction = base_instruction + summary_block + history_block
        return full_instruction

    async def update_realtime_instruction(self, session_id: str) -> None:
        if not session_id:
            return

        ws = self._rt_sockets.get(session_id)
        if not ws:
            return

        full_instruction = await self.build_full_instruction(session_id)

        await ws.send(
            json.dumps(
                {
                    "type": "session.update",
                    "session": {
                        "instructions": full_instruction,
                    },
                }
            )
        )

    # ===================================
    # legacy text GPT call
    # ===================================
    async def openai_response(
        self,
        session_id: str,
        text: str,
        gpt_model: str | None = None,
    ) -> tuple[str, int, int]:
        if not session_id:
            return "", 0, 0

        storage = SESSION_STORAGE[session_id]
        vector_store_id = storage.get("vector_store_id", None)
        if vector_store_id:
            tools = [{
                "type": "file_search",
                "vector_store_ids": [vector_store_id],
                "max_num_results": 5
            }]
        else:
            tools = []

        # use common helper to include instruction + summary + history
        full_instruction = await self.build_full_instruction(session_id)

        resp = await client.responses.create(
            model=gpt_model or "gpt-4o-mini",
            instructions=full_instruction,
            tools=tools,
            input=text,
        )
        response_text = resp.output_text
        usage = getattr(resp, "usage", None)
        input_tokens = self._get_total_tokens(usage, "input")
        output_tokens = self._get_total_tokens(usage, "output")

        return response_text, input_tokens, output_tokens

    # ===================================
    # STT (convert PCM to WAV and then call Whisper)
    # ===================================
    async def openai_stt(
        self,
        pcm_bytes: bytes,
        sample_rate: int = 16000,
        stt_model: str | None = None,
    ) -> tuple[str, int]:
        if not pcm_bytes:
            return "", 0

        tmp_path: Optional[str] = None
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                tmp_path = tmp.name

            # convert PCM to WAV
            await convert_pcm_to_wav(tmp_path, pcm_bytes, sample_rate)

            with open(tmp_path, "rb") as f:
                resp = await client.audio.transcriptions.create(
                    model=stt_model or "gpt-4o-mini-transcribe",
                    file=f,
                )

            text = (getattr(resp, "text", "") or "").strip()

            # extract total_tokens
            usage = getattr(resp, "usage", None)
            tokens = self._get_total_tokens(usage, "total")

            return text, tokens

        except Exception as e:
            print(f"Error in openai_stt: {e}")
            return "", 0

        finally:
            self._safe_remove_file(tmp_path, "WAV")

    # ===================================
    # TTS (text to audio MP3)
    # ===================================
    async def openai_tts(
        self,
        text: str,
        voice_id: str | None = None,
        tts_model: str | None = None,
    ) -> tuple[bytes, int]:
        text = (text or "").strip()
        if not text:
            return b"", 0

        tmp_path: Optional[str] = None
        tts_tokens = 0

        try:
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
                tmp_path = tmp.name

            async with client.audio.speech.with_streaming_response.create(
                model=tts_model or "gpt-4o-mini-tts",
                voice=voice_id or "coral",
                input=text,
            ) as response:
                # stream audio file to file
                await response.stream_to_file(tmp_path)

                usage = getattr(response, "usage", None)
                tts_tokens = self._get_total_tokens(usage, "total")

            with open(tmp_path, "rb") as f:
                audio_bytes = f.read()

            return audio_bytes, tts_tokens

        except Exception as e:
            print(f"Error in openai_tts: {e}")
            return b"", 0

        finally:
            self._safe_remove_file(tmp_path, "TTS mp3")

    # ===================================
    # Realtime API related
    # ===================================
    async def create_realtime_socket(self, session_id: str, realtime_model: str | None = None, stt_model: str | None = None) -> Any:
        if not session_id:
            raise ValueError("session_id is required")

        # if socket already exists, reuse it
        if session_id in self._rt_sockets:
            return self._rt_sockets[session_id]

        # GA Realtime endpoint
        url = f"wss://api.openai.com/v1/realtime?model={realtime_model or 'gpt-4o-mini-realtime-preview'}"

        ws = await websockets.connect(
            url,
            additional_headers=[
                ("Authorization", f"Bearer {settings.openai_api_key}"),
            ],
            subprotocols=["realtime"],
        )

        # ensure session storage
        await self.get_or_create_session_storage(session_id)

        # if base instruction is not set, set it
        if not SESSION_STORAGE[session_id].get("instruction"):
            await self.build_instruction(session_id)

        # include summary + history full instruction
        full_instruction = await self.build_full_instruction(session_id)

        # GA style session.update
        await ws.send(
            json.dumps(
                {
                    "type": "session.update",
                    "session": {
                        "type": "realtime",
                        "model": realtime_model or "gpt-4o-mini-realtime-preview",
                        "instructions": full_instruction,
                        # audio settings
                        "audio": {
                            "input": {
                                "format": {
                                    "type": "audio/pcm",
                                    "rate": 24000,
                                },
                                "transcription": {
                                    "model": stt_model or "gpt-4o-mini-transcribe",
                                },
                                "turn_detection": {
                                    "type": "server_vad",
                                    # "threshold": 0.5,
                                    # "prefix_padding_ms": 300,
                                    # "silence_duration_ms": 500,
                                },
                            },
                            "output": {
                                "format": {
                                    "type": "audio/pcm",
                                    "rate": 24000,
                                },
                                "voice": "alloy",
                            },
                        },
                    },
                }
            )
        )

        self._rt_sockets[session_id] = ws
        return ws

    async def realtime_send_pcm(
        self,
        session_id: str,
        pcm_chunk: bytes,
    ) -> None:
        if not pcm_chunk:
            return

        ws = self._rt_sockets.get(session_id)
        if not ws:
            # if needed, call create_realtime_socket(session_id) here
            return

        b64 = base64.b64encode(pcm_chunk).decode("ascii")

        await ws.send(
            json.dumps(
                {
                    "type": "input_audio_buffer.append",
                    "audio": b64,
                }
            )
        )
        # server_vad mode, commit event is handled by server

    async def close_realtime_socket(self, session_id: str) -> None:
        ws = self._rt_sockets.pop(session_id, None)
        if ws:
            try:
                await ws.close()
            except Exception:
                pass

    # ==================================
    # REPO logic
    # ==================================
    async def get_current_models(self) -> dict:
        # TODO: 추후 DB에서 조회
        return {
            "stt_model": "gpt-4o-mini-transcribe",
            "tts_model": "gpt-4o-mini-tts",
            "response_model": "gpt-4o-mini",
            "realtime_model": "gpt-4o-mini-realtime-preview",
        }

    async def get_chatbot_setting(self, chatbot_id: int) -> dict:
        chatbot = await self.gpt_repository.get_admin_chatbot_detail(chatbot_id)

        return {
            "vector_store_id": chatbot.vector_store_id,
        }

    async def create_or_get_log(
        self,
        user_id: int,
        session_id: str,
        stt_model: str | None = None,
        tts_model: str | None = None,
        response_model: str | None = None,
        realtime_model: str | None = None,
    ):
        return await self.gpt_repository.create_or_get_log(
            user_id,
            session_id,
            stt_model,
            tts_model,
            response_model,
            realtime_model,
        )

    async def update_log(self, session_id: str, ended_reason: EndedReasonType):
        await self.gpt_repository.update_log(session_id, ended_reason)

    async def create_message(
        self,
        log_id: int,
        role: RoleType,
        message: str,
        message_type: MessageType,
        latency_ms: int | None = None,
        latency_type: LatencyType | None = None,
        tokens: int | None = None,
    ):
        return await self.gpt_repository.create_message(
            log_id,
            role,
            message,
            message_type,
            latency_ms,
            latency_type,
            tokens,
        )
