import React, { FC, ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  bgColor?: string;
  iconBg?: string;
  icon: ReactNode;
}

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  bgColor = "bg-white",
  iconBg = "bg-primary",
  icon,
}) => {
  return (
    <div className={`p-6 rounded-2xl shadow-sm ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 font-medium">{title}</p>
          <h2 className="text-4xl font-bold mt-4">{value}</h2>
          <p className="text-sm text-muted mt-2">{subtitle}</p>
        </div>

        <div className={`p-3 rounded-xl text-white ${iconBg}`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
