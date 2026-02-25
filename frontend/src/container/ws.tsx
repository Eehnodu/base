import { useEffect, useRef, useState } from "react";
import { useAudioWs } from "../hooks/common/useAudioWs";
import { useRefreshToken } from "@/hooks/common/useAPI";

type LogType = "system" | "stt_text" | "gpt_text" | "chat_user";

interface LogItem {
  id: number;
  type: LogType;
  text: string;
  time: string;
}

const WsPage = () => {
  const refreshToken = useRefreshToken();

  // ----------------------------------
  // realtime 상태
  // ----------------------------------
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [isRealtimeRecording, setIsRealtimeRecording] = useState(false);
  const [realtimeLogs, setRealtimeLogs] = useState<LogItem[]>([]);
  const realtimeEndRef = useRef<HTMLDivElement | null>(null);
  const [realtimeChatInput, setRealtimeChatInput] = useState("");

  // ----------------------------------
  // legacy 상태
  // ----------------------------------
  const [legacyConnected, setLegacyConnected] = useState(false);
  const [isLegacyRecording, setIsLegacyRecording] = useState(false);
  const [legacyLogs, setLegacyLogs] = useState<LogItem[]>([]);
  const legacyEndRef = useRef<HTMLDivElement | null>(null);
  const [legacyChatInput, setLegacyChatInput] = useState("");

  // ----------------------------------
  // 공통 로그 유틸
  // ----------------------------------
  const pushLog = (
    setter: React.Dispatch<React.SetStateAction<LogItem[]>>,
    type: LogType,
    text: string
  ) =>
    setter((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type,
        text,
        time: new Date().toLocaleTimeString(),
      },
    ]);

  const addSttLog = (
    setter: React.Dispatch<React.SetStateAction<LogItem[]>>,
    text: string
  ) => {
    if (!text) return;

    setter((prev) => {
      if (prev.length === 0) {
        return [
          ...prev,
          {
            id: prev.length + 1,
            type: "stt_text",
            text,
            time: new Date().toLocaleTimeString(),
          },
        ];
      }

      const last = prev[prev.length - 1];

      if (last.type === "stt_text") {
        const updatedLast: LogItem = {
          ...last,
          text: last.text + text,
        };
        return [...prev.slice(0, -1), updatedLast];
      }

      return [
        ...prev,
        {
          id: prev.length + 1,
          type: "stt_text",
          text,
          time: new Date().toLocaleTimeString(),
        },
      ];
    });
  };

  // ----------------------------------
  // realtime 훅 (mode: "realtime")
  // ----------------------------------
  const realtimeWs = useAudioWs({
    mode: "realtime",
    onConnect: (sid) =>
      pushLog(
        setRealtimeLogs,
        "system",
        `Connected (realtime) | session=${sid}`
      ),
    onDisconnect: () =>
      pushLog(setRealtimeLogs, "system", "Disconnected (realtime)"),
    onSttText: (text) => {
      addSttLog(setRealtimeLogs, text);
    },
    onGptText: (text) => pushLog(setRealtimeLogs, "gpt_text", text),
    onTtsStart: () => pushLog(setRealtimeLogs, "system", "TTS start"),
    onTtsEnd: () => pushLog(setRealtimeLogs, "system", "TTS end"),
  });

  // ----------------------------------
  // legacy 훅 (mode: "legacy")
  // ----------------------------------
  const legacyWs = useAudioWs({
    mode: "legacy",
    onConnect: (sid) =>
      pushLog(setLegacyLogs, "system", `Connected (legacy) | session=${sid}`),
    onDisconnect: () =>
      pushLog(setLegacyLogs, "system", "Disconnected (legacy)"),
    onSttText: (text) => {
      addSttLog(setLegacyLogs, text);
    },
    onGptText: (text) => pushLog(setLegacyLogs, "gpt_text", text),
    onTtsStart: () => pushLog(setLegacyLogs, "system", "TTS start"),
    onTtsEnd: () => pushLog(setLegacyLogs, "system", "TTS end"),
  });

  // ----------------------------------
  // 자동 스크롤
  // ----------------------------------
  useEffect(() => {
    realtimeEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [realtimeLogs]);

  useEffect(() => {
    legacyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [legacyLogs]);

  // ----------------------------------
  // 버튼 핸들러 (realtime)
  // ----------------------------------
  const handleRealtimeConnect = async () => {
    if (!realtimeConnected) {
      await refreshToken();
      await realtimeWs.connect();
      setRealtimeConnected(true);
      return;
    }

    if (isRealtimeRecording) {
      try {
        await realtimeWs.stopRecording();
      } catch (e) {
        console.error("realtime stopRecording on disconnect:", e);
      }
    }
    await realtimeWs.disconnect();
    setRealtimeConnected(false);
    setIsRealtimeRecording(false);
  };

  const handleRealtimeMicClick = async () => {
    if (!realtimeConnected) return;

    if (!isRealtimeRecording) {
      try {
        await realtimeWs.startRecording();
        setIsRealtimeRecording(true);
      } catch (e) {
        console.error("realtime startRecording error:", e);
        setIsRealtimeRecording(false);
      }
      return;
    }

    try {
      await realtimeWs.stopRecording();
    } catch (e) {
      console.error("realtime stopRecording error:", e);
    } finally {
      setIsRealtimeRecording(false);
    }
  };

  // ✅ 채팅 전송 (realtime)
  const handleRealtimeSendChat = async () => {
    if (!realtimeConnected) return;

    const text = realtimeChatInput.trim();
    if (!text) return;

    pushLog(setRealtimeLogs, "chat_user", text);
    setRealtimeChatInput("");

    try {
      await realtimeWs.sendChat(text);
    } catch (e) {
      console.error("realtime sendChat error:", e);
      pushLog(setRealtimeLogs, "system", "chat send failed");
    }
  };

  // ----------------------------------
  // 버튼 핸들러 (legacy)
  // ----------------------------------
  const handleLegacyConnect = async () => {
    if (!legacyConnected) {
      await refreshToken();
      await legacyWs.connect();
      setLegacyConnected(true);
      return;
    }

    if (isLegacyRecording) {
      try {
        await legacyWs.stopRecording();
      } catch (e) {
        console.error("legacy stopRecording on disconnect:", e);
      }
    }
    await legacyWs.disconnect();
    setLegacyConnected(false);
    setIsLegacyRecording(false);
  };

  const handleLegacyMicClick = async () => {
    if (!legacyConnected) return;

    if (!isLegacyRecording) {
      try {
        await legacyWs.startRecording();
        setIsLegacyRecording(true);
      } catch (e) {
        console.error("legacy startRecording error:", e);
        setIsLegacyRecording(false);
      }
      return;
    }

    try {
      await legacyWs.stopRecording();
    } catch (e) {
      console.error("legacy stopRecording error:", e);
    } finally {
      setIsLegacyRecording(false);
    }
  };

  // ✅ 채팅 전송 (legacy)
  const handleLegacySendChat = async () => {
    if (!legacyConnected) return;

    const text = legacyChatInput.trim();
    if (!text) return;

    pushLog(setLegacyLogs, "chat_user", text);
    setLegacyChatInput("");

    try {
      await legacyWs.sendChat(text);
    } catch (e) {
      console.error("legacy sendChat error:", e);
      pushLog(setLegacyLogs, "system", "chat send failed");
    }
  };

  // ----------------------------------
  // 로그 렌더 함수
  // ----------------------------------
  const renderLogs = (
    logs: LogItem[],
    endRef: React.RefObject<HTMLDivElement | null>
  ) => (
    <div className="w-full h-[480px] overflow-auto bg-gray-50 border rounded-lg p-3 text-sm space-y-2">
      {logs.map((log) => {
        if (log.type === "system") {
          return (
            <div
              key={log.id}
              className="w-full flex justify-center text-[11px] text-gray-500"
            >
              <div className="px-3 py-1 rounded-full bg-gray-100">
                <span className="mr-2">{log.time}</span>
                <span>{log.text}</span>
              </div>
            </div>
          );
        }

        const isRight = log.type === "stt_text" || log.type === "chat_user";
        const alignClass = isRight ? "justify-end" : "justify-start";

        const bubbleColor =
          log.type === "stt_text"
            ? "bg-blue-100 text-blue-900"
            : log.type === "chat_user"
              ? "bg-emerald-100 text-emerald-900"
              : "bg-violet-100 text-violet-900";

        return (
          <div key={log.id} className={`flex ${alignClass}`}>
            <div className="max-w-[75%]">
              <div
                className={`px-3 py-2 rounded-2xl ${bubbleColor} break-words`}
              >
                {log.text}
              </div>
              <div className="mt-1 text-[10px] text-gray-400">{log.time}</div>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );

  const renderChatInput = (
    value: string,
    onChange: (v: string) => void,
    disabled: boolean,
    onSend: () => void
  ) => (
    <div className="mt-4 flex gap-2">
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend();
        }}
        placeholder={
          disabled ? "먼저 Connect 해주세요" : "메시지 입력 후 Enter"
        }
        className={`flex-1 px-3 py-2 border rounded-lg bg-white ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />
      <button
        disabled={disabled}
        onClick={onSend}
        className={`px-4 py-2 rounded-lg text-white ${
          disabled ? "bg-gray-400" : "bg-black hover:bg-gray-800"
        }`}
      >
        Send
      </button>
    </div>
  );

  // ----------------------------------
  // 렌더
  // ----------------------------------
  return (
    <div className="w-full min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 왼쪽: realtime */}
        <div className="w-full max-w-2xl bg-white shadow rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">실시간 (realtime)</h1>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleRealtimeConnect}
              className={`px-4 py-2 text-white rounded-lg ${
                realtimeConnected
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {realtimeConnected ? "Disconnect" : "Connect"}
            </button>

            <button
              disabled={!realtimeConnected}
              onClick={handleRealtimeMicClick}
              className={`px-4 py-2 text-white rounded-lg ${
                isRealtimeRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } ${!realtimeConnected ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isRealtimeRecording ? "Stop (mic off)" : "Start (mic on)"}
            </button>
          </div>

          {renderLogs(realtimeLogs, realtimeEndRef)}
          {renderChatInput(
            realtimeChatInput,
            setRealtimeChatInput,
            !realtimeConnected,
            handleRealtimeSendChat
          )}
        </div>

        {/* 오른쪽: legacy */}
        <div className="w-full max-w-2xl bg-white shadow rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">기존 (legacy)</h1>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleLegacyConnect}
              className={`px-4 py-2 text-white rounded-lg ${
                legacyConnected
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {legacyConnected ? "Disconnect" : "Connect"}
            </button>

            <button
              disabled={!legacyConnected}
              onClick={handleLegacyMicClick}
              className={`px-4 py-2 text-white rounded-lg ${
                isLegacyRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } ${!legacyConnected ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLegacyRecording ? "Stop & Send" : "Start Recording"}
            </button>
          </div>

          {renderLogs(legacyLogs, legacyEndRef)}
          {renderChatInput(
            legacyChatInput,
            setLegacyChatInput,
            !legacyConnected,
            handleLegacySendChat
          )}
        </div>
      </div>
    </div>
  );
};

export default WsPage;
