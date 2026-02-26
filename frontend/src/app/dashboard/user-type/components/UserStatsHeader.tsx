import React from "react";
import { Users, CheckCircle, UserPlus, ArrowLeft, Plus } from "lucide-react";

const UserStatsHeader = () => {
  const stats = [
    {
      label: "Total User Types",
      value: 6,
      icon: <Users className="w-6 h-6 text-white" />,
      iconBg: "bg-blue-600",
      cardBg: "bg-gradient-to-br from-indigo-50 via-indigo-100 to-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Active Types",
      value: 6,
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      iconBg: "bg-emerald-500",
      cardBg: "bg-gradient-to-br from-emerald-50 via-green-100 to-teal-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Total Users",
      value: 10,
      icon: <UserPlus className="w-6 h-6 text-white" />,
      iconBg: "bg-gradient-to-tr from-purple-600 to-pink-500",
      cardBg: "bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50",
      textColor: "text-purple-500",
    },
  ];

  return (
    <div className="p-2 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-semibold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              User Types
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Configure user type classifications and default settings
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md shadow-blue-200">
          <Plus size={18} />
          Create User Type
        </button>
      </div>
      <div className="grid grid-cols-1 my-2 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.cardBg} p-6 rounded-2xl border border-white/50 shadow-sm transition-transform hover:scale-[1.02]`}
          >
            <div
              className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg mb-4`}
            >
              {stat.icon}
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              {stat.label}
            </p>
            <p className={`text-4xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStatsHeader;
