interface UsageStatCardProps {
  label: string;
  value: number | string;
  tone?: "default" | "positive" | "negative";
}

const UsageStatCard = ({
  label,
  value,
  tone = "default",
}: UsageStatCardProps) => {
  const valueClassName =
    tone === "positive"
      ? "text-sm font-semibold text-emerald-600"
      : tone === "negative"
        ? "text-sm font-semibold text-red-500"
        : "text-sm font-semibold text-gray-900";

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 text-center">
      <div className="text-[10px] font-medium text-gray-500 uppercase">
        {label}
      </div>
      <div className={valueClassName}>{value}</div>
    </div>
  );
};

export default UsageStatCard;
