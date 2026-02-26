import React from "react";
import {
  ArrowLeft,
  Download,
  Activity,
  CheckCircle2,
  XCircle,
  Lock,
  Search,
  LucideProps,
  ChevronDown,
} from "lucide-react";

type StatColor = "blue" | "emerald" | "orange" | "pink";

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactElement<LucideProps>;
  color: StatColor;
}

const LoginHistoryHeader: React.FC = () => {
  const stats: StatItem[] = [
    { label: "Total Logins", value: 5, icon: <Activity />, color: "blue" },
    { label: "Successful", value: 3, icon: <CheckCircle2 />, color: "emerald" },
    { label: "Failed Attempts", value: 1, icon: <XCircle />, color: "orange" },
    { label: "Locked Accounts", value: 1, icon: <Lock />, color: "pink" },
  ];
  const colorMap: Record<StatColor, string> = {
    blue: "bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 text-blue-700",
    emerald:
      "bg-gradient-to-br from-emerald-50 via-green-100 to-teal-50 text-emerald-700",
    orange:
      "bg-gradient-to-br from-orange-50 via-orange-100 to-red-50 text-orange-700",
    pink: "bg-gradient-to-br from-red-50 via-rose-100 to-pink-50 text-pink-700",
  };

  const iconBoxMap: Record<StatColor, string> = {
    blue: "bg-blue-600 shadow-blue-200",
    emerald: "bg-emerald-500 shadow-emerald-200",
    orange: "bg-orange-600 shadow-orange-200",
    pink: "bg-pink-600 shadow-pink-200",
  };

  return (
    <div className="p-8 bg-[#fbfaff]  font-sans">
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4">
          <button className="mt-2 text-gray-400 hover:text-gray-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-semibold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Login History
            </h1>
            <p className="text-gray-600  mt-1">
              Monitor authentication events and security logs
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 hover:text-white  transition-all">
          <Download size={16} /> Export Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${colorMap[stat.color]} p-6 rounded-2xl shadow-sm border border-white/50 transition-transform hover:scale-[1.02] duration-200`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg ${iconBoxMap[stat.color]}`}
            >
              {React.cloneElement(
                stat.icon as React.ReactElement<{ size: number }>,
                { size: 24 },
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-semibold bg-linear-to-r from-blue-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative grow">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by username or IP address..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-blue-600 focus:bg-white rounded-xl transition-all outline-none text-sm text-gray-700"
          />
        </div>

        <div className="relative group">
          <select className="appearance-none pl-6 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none hover:border-gray-300 transition-all cursor-pointer min-w-[140px]">
            <option>All Status</option>
            <option>Successful</option>
            <option>Failed</option>
            <option>Locked</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginHistoryHeader;
