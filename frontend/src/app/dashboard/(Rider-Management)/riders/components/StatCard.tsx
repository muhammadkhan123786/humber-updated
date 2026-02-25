import React from "react";
import { Users, CircleCheck, Clock, CheckCircle2 } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  bgColor,
  textColor,
}) => (
  <div
    className={`flex items-center justify-between p-5 rounded-3xl shadow-sm border border-white/50 ${bgColor}`}
  >
    <div>
      <p className="text-gray-600 text-xs font-medium mb-1">{label}</p>
      <span className={`text-3xl font-bold ${textColor}`}>{value}</span>
    </div>
    <div className={textColor}>{icon}</div>
  </div>
);

const StatsSection: React.FC = () => {
  const stats = [
    {
      label: "Total Riders",
      value: 6,
      icon: <Users size={32} />,
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      textColor: "text-blue-600",
    },
    {
      label: "Active Riders",
      value: 2,
      icon: <CircleCheck size={32} />,
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      textColor: "text-emerald-500",
    },
    {
      label: "Pending Approval",
      value: 1,
      icon: <Clock size={32} />,
      bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
      textColor: "text-orange-500",
    },
    {
      label: "Total Deliveries",
      value: 482,
      icon: <CheckCircle2 size={32} />,
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      textColor: "text-purple-500",
    },
  ];

  return (
    <div className="w-full py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsSection;
