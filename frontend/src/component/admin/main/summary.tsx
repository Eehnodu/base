import {
  Clock3,
  Zap,
  Activity,
  MessageCircle,
  MessageSquare,
} from "lucide-react";
import SummaryCard from "@/component/admin/main/summaryCard";

interface SummaryProps {
  totalLogs: number;
  sttLatencyAvg: number | string;
  ttsLatencyAvg: number | string;
  tokenAvg: number;
  messageAvg: number;
  sessionDurationFormatted: string;
}

const Summary = ({
  totalLogs,
  sttLatencyAvg,
  ttsLatencyAvg,
  tokenAvg,
  messageAvg,
  sessionDurationFormatted,
}: SummaryProps) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      {/* Total Logs */}
      <SummaryCard
        title="누적 로그 수"
        icon={<MessageSquare size={16} className="text-orange-500" />}
        value={totalLogs}
        description="기간 내 총 호출 수"
      />

      {/* Avg Latency */}
      <SummaryCard
        title="평균 응답 시간(TTS/STT)"
        icon={<Clock3 size={16} className="text-blue-500" />}
        value={`${sttLatencyAvg}`}
        value2={`${ttsLatencyAvg}`}
        description="평균 응답 시간"
      />

      {/* Total Tokens (Avg) */}
      <SummaryCard
        title="평균 토큰 사용량"
        icon={<Zap size={16} className="text-yellow-400" />}
        value={tokenAvg}
        description="평균 토큰 사용량"
      />

      {/* Messages per Log */}
      <SummaryCard
        title="로그당 대화 횟수"
        icon={<MessageCircle size={16} className="text-purple-500" />}
        value={messageAvg.toFixed(1)}
        description="평균 대화 횟수"
      />

      {/* Avg Session Duration */}
      <SummaryCard
        title="평균 이용 시간"
        icon={<Activity size={16} className="text-blue-500" />}
        value={sessionDurationFormatted}
        description="세션당 평균 이용 시간"
      />
    </div>
  );
};

export default Summary;
