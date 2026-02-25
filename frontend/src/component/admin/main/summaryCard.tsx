interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  value: number | string;
  value2?: number | string;
  description: string;
}

const SummaryCard = ({
  title,
  icon,
  value,
  value2,
  description,
}: SummaryCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex flex-col justify-between shadow-sm">
      {/* Title + Icon */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-gray-500 tracking-wide">
          {title}
        </span>
        {icon}
      </div>

      <div className="flex items-baseline gap-2">
        {/* value */}
        <div className="text-3xl font-semibold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>

        {/* slash */}
        {value2 && (
          <div className="text-3xl font-semibold text-gray-900">/</div>
        )}

        {/* subValue */}
        {value2 && (
          <div className="text-3xl font-semibold text-gray-900">
            {typeof value2 === "number" ? value2.toLocaleString() : value2}
          </div>
        )}
      </div>

      {/* Description */}
      <span className="mt-1 text-xs text-gray-400">{description}</span>
    </div>
  );
};

export default SummaryCard;
