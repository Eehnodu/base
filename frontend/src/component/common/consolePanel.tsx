import { useState, useEffect } from "react";

const ConsolePanel = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;

    console.log = (...args) => {
      originalLog(...args);
      setLogs((prev) => [...prev, args.join(" ")]);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  return (
    <div
      className="fixed left-1/2 top-1/2 w-[80%] max-w-[600px]
                 -translate-x-1/2 -translate-y-1/2
                 bg-black/70 text-green-300 p-4 rounded-lg z-[9999]
                 border border-green-500"
    >
      <div className="font-bold mb-2 text-sm text-green-400">Console Log</div>

      {/* 4줄 정도 보이는 영역 + 스크롤 */}
      <div className="overflow-y-auto max-h-[100px] pr-1 space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className="text-xs whitespace-pre-wrap">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsolePanel;
