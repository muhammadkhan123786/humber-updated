import { Shield, CheckCircle2, Lock } from "lucide-react";

export default function SummaryStats() {
  const stats = [
    {
      label: "Total Roles",
      value: "7",
      icon: <Shield className="w-5 h-5 text-white" />,
      colorClass: "text-purple-600",
      bgGradient: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
      iconGradient: "bg-gradient-to-br from-purple-500 to-fuchsia-500",
    },
    {
      label: "Active Roles",
      value: "7",
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
      colorClass: "text-emerald-600",
      bgGradient: "bg-gradient-to-br from-emerald-50 to-teal-50",
      iconGradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
    {
      label: "Total Permissions",
      value: "15",
      icon: <Lock className="w-5 h-5 text-white" />,
      colorClass: "text-blue-600",
      bgGradient: "bg-gradient-to-br from-blue-50 to-indigo-50",
      iconGradient: "bg-gradient-to-br from-blue-500 to-indigo-500",
    },
  ];

  return (
    <div className="flex flex-wrap gap-6 w-full mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex-1 min-w-[280px] p-6 rounded-2xl shadow-sm border border-white/60 ${stat.bgGradient} flex flex-col gap-4 transition-transform hover:-translate-y-1`}
        >
          <div
            className={`w-10 h-10 rounded-xl ${stat.iconGradient} shadow-lg flex items-center justify-center`}
          >
            {stat.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              {stat.label}
            </span>
            <span className={`text-3xl font-bold ${stat.colorClass}`}>
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
