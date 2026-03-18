import React from "react";
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Wrench,
} from "lucide-react";
import DashboardCharts from "./DashboardCharts";
import SLAViolationsChart from "./SLAViolationsChart";
import RecentAlerts from "./RecentAlerts";

const AlertDashboard = () => {
  const stats = [
    {
      label: "Active Alerts",
      value: "47",
      trend: "+12%",
      isPositive: true,
      icon: <Bell className="text-white size-6" />,
      iconBg: "bg-gradient-to-br from-orange-500 to-pink-500",
      containerStyle:
        "text-card-foreground flex flex-col gap-6 p-6 rounded-xl border-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 hover:shadow-orange-200 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer",
    },
    {
      label: "Pending Acknowledgements",
      value: "23",
      trend: "+8%",
      isPositive: true,
      icon: <Clock className="text-white size-6" />,
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      containerStyle:
        "text-card-foreground flex flex-col gap-6 p-6 rounded-xl border-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 hover:shadow-amber-200 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer",
    },
    {
      label: "Escalated Alerts",
      value: "9",
      trend: "-5%",
      isPositive: false,
      icon: <AlertTriangle className="text-white size-6" />,
      iconBg: "bg-gradient-to-br from-red-500 to-rose-500",
      containerStyle:
        "text-card-foreground flex flex-col gap-6 p-6 rounded-xl border-0 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 hover:shadow-red-200 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer",
    },
    {
      label: "Resolved Alerts",
      value: "156",
      trend: "+23%",
      isPositive: true,
      icon: <CheckCircle className="text-white size-6" />,
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
      containerStyle:
        "text-card-foreground flex flex-col gap-6 p-6 rounded-xl border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 hover:shadow-green-200 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer",
    },
    {
      label: "Low Stock Alerts",
      value: "14",
      trend: "+6%",
      isPositive: true,
      icon: <Package className="text-white size-6" />,
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
      containerStyle:
        "text-card-foreground flex flex-col gap-6 p-6 rounded-xl border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 hover:shadow-blue-200 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer",
    },
    {
      label: "Overdue Repair Jobs",
      value: "7",
      trend: "-3%",
      isPositive: false,
      icon: <Wrench className="text-white size-6" />,
      iconBg: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
      containerStyle:
        "text-card-foreground flex flex-col gap-6 p-6 rounded-xl border-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 hover:shadow-purple-200 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer",
    },
  ];

  return (
    <div className="p-8  min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            Alert Management Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time monitoring and alert tracking system
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 bg-linear-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white shadow-lg">
          <Bell className="size-4" />
          View All Alerts
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={stat.containerStyle}>
            <div className="flex items-start justify-between">
              <div
                className={`${stat.iconBg} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-white/60 text-slate-600 shadow-sm border border-white/50">
                {stat.trend}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-slate-600 leading-tight h-10">
                {stat.label}
              </p>
              <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {stat.value}
              </h2>
            </div>
          </div>
        ))}
      </div>
      <div className="my-7">
        <DashboardCharts />
      </div>
      <div className="my-7">
        <SLAViolationsChart />
      </div>
      <div className="my-7">
        <RecentAlerts />
      </div>
    </div>
  );
};

export default AlertDashboard;
