import React from "react";
import {
  Shield,
  Layout,
  Eye,
  Edit3,
  Search,
  Plus,
  ArrowLeft,
  Download,
} from "lucide-react";

const PermissionsManager: React.FC = () => {
  const stats = [
    {
      label: "Total Permissions",
      value: 15,
      icon: <Shield size={24} />,
      bg: "bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50",
      iconBg: "bg-indigo-600",
      textColor: "text-indigo-600",
    },
    {
      label: "Modules",
      value: 11,
      icon: <Layout size={24} />,
      bg: "bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50",
      iconBg: "bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      label: "View Permissions",
      value: 15,
      icon: <Eye size={24} />,
      bg: "bg-gradient-to-br from-emerald-50 via-green-100 to-teal-50",
      iconBg: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
    {
      label: "Write Permissions",
      value: 9,
      icon: <Edit3 size={24} />,
      bg: "bg-gradient-to-br from-orange-50 via-orange-100 to-red-50",
      iconBg: "bg-orange-500",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2 text-sm font-medium">
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-semibold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Permissions Manager
          </h1>
          <p className="text-gray-500">
            Configure module and form-level permissions
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 hover:text-white">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            <Plus size={16} />
            Add Permission
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bg} p-6 rounded-3xl shadow-sm border border-white/50 flex flex-col gap-4`}
          >
            <div
              className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center text-white shadow-lg`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search permissions by name, description, or module..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl
focus:outline-none
focus:border-blue-500
focus:ring-2 focus:ring-blue-500/20
transition-all duration-200"
          />
        </div>
        <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none cursor-pointer hover:border-purple-500">
          <option>All Modules</option>
          <option>Customer</option>
          <option>Dashboard</option>
          <option>Inventry</option>
          <option>Invoice</option>
          <option>Report</option>
          <option>Security</option>
          <option>Service Ticket</option>
          <option>System Setup</option>
          <option>System User</option>
          <option>Technicain</option>
        </select>
      </div>
    </div>
  );
};

export default PermissionsManager;
