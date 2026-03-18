"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Activity, TrendingUp } from "lucide-react";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const pieData = [
  { name: "Repair", value: 45, color: "#f59e0b" },
  { name: "Inventory", value: 32, color: "#3b82f6" },
  { name: "Service", value: 23, color: "#10b981" },
];

const barData = [
  { day: "Mon", repair: 12, inventory: 8, service: 5 },
  { day: "Tue", repair: 15, inventory: 10, service: 7 },
  { day: "Wed", repair: 10, inventory: 15, service: 6 },
  { day: "Thu", repair: 18, inventory: 12, service: 9 },
  { day: "Fri", repair: 14, inventory: 9, service: 8 },
  { day: "Sat", repair: 8, inventory: 6, service: 4 },
  { day: "Sun", repair: 6, inventory: 5, service: 3 },
];

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-sm text-xs font-medium">
        <p className="mb-2 text-slate-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.fill }} className="py-0.5">
            {entry.name} : {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardCharts: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6  h-fit">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 min-w-[350px]">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-blue-500 p-2 rounded-lg text-white">
            <Activity size={20} />
          </div>
          <h3 className="font-bold text-slate-800">Alerts by Category</h3>
        </div>

        <div className="h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-2 min-w-[350px]">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-emerald-500 p-2 rounded-lg text-white">
            <TrendingUp size={20} />
          </div>
          <h3 className="font-bold text-slate-800">Alert Trends Over Time</h3>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} />

              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                formatter={(value) => (
                  <span className="text-slate-600 text-sm font-medium">
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                )}
              />

              <Bar dataKey="repair" name="Repair" fill="#f59e0b" />
              <Bar dataKey="inventory" name="Inventory" fill="#3b82f6" />
              <Bar dataKey="service" name="Service" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
