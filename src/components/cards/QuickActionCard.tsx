import React, { FC, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
}

const QuickActionCard: FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="bg-primary text-white p-3 rounded-xl">{icon}</div>

        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted text-sm">{description}</p>
        </div>
      </div>

      <ArrowRight className="text-gray-400" />
    </div>
  );
};

export default QuickActionCard;
