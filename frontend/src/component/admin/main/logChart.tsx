import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler
);

interface LogChartProps {
  data: {
    labels: string[];
    datasets: any[];
  };
}

const LogChart = ({ data }: LogChartProps) => {
  return (
    <div className="h-full bg-white rounded-2xl border border-gray-200 p-5 col-span-2 flex flex-col min-h-0 shadow-sm">
      <div className="mb-3">
        <div className="text-base font-semibold text-gray-900">로그 빈도</div>
        <div className="text-xs text-gray-400">기간 내 호출 수</div>
      </div>

      <div className="flex-1 min-h-0">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                ticks: { font: { size: 11 }, color: "#9ca3af" },
                grid: { display: false },
                border: { display: false },
              },
              y: {
                ticks: { font: { size: 11 }, color: "#9ca3af" },
                grid: { color: "#e5e7eb" },
                border: { display: false },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default LogChart;
