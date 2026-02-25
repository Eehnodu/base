import { ReactNode } from "react";

interface UsageSectionProps {
  title: string;
  children: ReactNode;
}

const UsageSection = ({ title, children }: UsageSectionProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-semibold text-gray-500">{title}</div>
      {children}
    </div>
  );
};

export default UsageSection;
