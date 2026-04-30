// components/dashboard/DashboardCharts.tsx
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "../../components/common/CustomTooltip";

interface DashboardChartsProps {
  pieData: { name: string; value: number }[];
  monthlyChart: { name: string; Revenue: number; COGS: number }[];
}

export function DashboardCharts({ pieData, monthlyChart }: DashboardChartsProps) {
  const pieColors = ["#059669", "#eab308", "#ef4444"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-9">
      {/* Pie Chart */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Stock Status Overview</h3>
        <p className="text-slate-400 text-xs mb-4">Current inventory breakdown</p>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={pieColors[i]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: 10, color: "#fff", fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Revenue vs COGS (K$)</h3>
        <p className="text-slate-400 text-xs mb-4">Monthly financial performance</p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={monthlyChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gCOGS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={2} fill="url(#gRev)" />
            <Area type="monotone" dataKey="COGS" stroke="#d97706" strokeWidth={2} fill="url(#gCOGS)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}