import UsageSection from "@/component/admin/main/usageSection";
import UsageStatCard from "@/component/admin/main/usageStatCard";
import { LatencySeries, TrippleStat } from "@/container/admin/main";
import { formatLatencyMs } from "@/utils/format/number";

interface UsagePanelProps {
  latency: LatencySeries;
  tokenStats: TrippleStat;
  messageStats: TrippleStat;
  sessionDurationStats: TrippleStat;
  peakText: string;
  formatDuration: (seconds: number) => string;
}

const UsagePanel = ({
  latency,
  tokenStats,
  messageStats,
  sessionDurationStats,
  peakText,
  formatDuration,
}: UsagePanelProps) => {
  const latencyRows = latency.labels.map((label, idx) => ({
    label,
    avg: formatLatencyMs(latency.avg[idx], 1),
    min: formatLatencyMs(latency.min[idx], 1),
    max: formatLatencyMs(latency.max[idx], 1),
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col min-h-0 shadow-sm">
      <div className="mb-3">
        <div className="text-base font-semibold text-gray-900">요약 정보</div>
        <div className="text-xs text-gray-400">
          응답 시간, 토큰 사용량, 대화 횟수, 이용 시간
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
        {/* Latency stats */}
        <UsageSection title="응답 시간">
          <div className="space-y-3">
            {latencyRows.map((row) => (
              <div key={row.label} className="space-y-2">
                <div className="text-[11px] font-semibold text-gray-600">
                  {row.label}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <UsageStatCard label="평균" value={row.avg} />
                  <UsageStatCard label="최소" value={row.min} tone="positive" />
                  <UsageStatCard label="최대" value={row.max} tone="negative" />
                </div>
              </div>
            ))}
          </div>
        </UsageSection>

        {/* Token stats */}
        <UsageSection title="평균 토큰 사용량">
          <div className="grid grid-cols-3 gap-2">
            <UsageStatCard
              label="평균"
              value={tokenStats.avg.toLocaleString()}
            />
            <UsageStatCard
              label="최소"
              value={tokenStats.min.toLocaleString()}
              tone="positive"
            />
            <UsageStatCard
              label="최대"
              value={tokenStats.max.toLocaleString()}
              tone="negative"
            />
          </div>
        </UsageSection>

        {/* Messages per Log stats */}
        <UsageSection title="로그당 대화 횟수">
          <div className="grid grid-cols-3 gap-2">
            <UsageStatCard label="평균" value={messageStats.avg.toFixed(1)} />
            <UsageStatCard
              label="최소"
              value={String(messageStats.min)}
              tone="positive"
            />
            <UsageStatCard
              label="최대"
              value={String(messageStats.max)}
              tone="negative"
            />
          </div>
        </UsageSection>

        {/* Session duration stats */}
        <UsageSection title="평균 이용 시간">
          <div className="grid grid-cols-3 gap-2">
            <UsageStatCard
              label="평균"
              value={formatDuration(sessionDurationStats.avg)}
            />
            <UsageStatCard
              label="최소"
              value={formatDuration(sessionDurationStats.min)}
              tone="positive"
            />
            <UsageStatCard
              label="최대"
              value={formatDuration(sessionDurationStats.max)}
              tone="negative"
            />
          </div>
        </UsageSection>

        {/* Peak usage */}
        <UsageSection title="최빈 사용 시간">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
            <div className="text-xs text-gray-700 leading-relaxed">
              {peakText}
            </div>
          </div>
        </UsageSection>
      </div>
    </div>
  );
};

export default UsagePanel;
