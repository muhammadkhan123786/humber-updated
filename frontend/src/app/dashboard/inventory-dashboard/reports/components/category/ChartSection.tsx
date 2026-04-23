import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CustomTooltip } from '../../components/common/CustomTooltip';
import { Category } from '../../types';

interface ChartSectionProps {
  cat: Category;
  activeTab: number;
  chartData: any[];
  chartKeys: string[];
}

export function ChartSection({ cat, activeTab, chartData, chartKeys }: ChartSectionProps) {
  const [chartType, setChartType] = useState<"Bar" | "Line" | "Area">("Bar");
  const colors = cat.chartColors;
  
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 4, right: 8, left: -16, bottom: 0 },
    };
    
    if (chartType === "Area") {
      return (
        <AreaChart {...commonProps}>
          <defs>
            {chartKeys.map((k, i) => (
              <linearGradient key={k} id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[i]} stopOpacity={0.35} />
                <stop offset="95%" stopColor={colors[i]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          {chartKeys.map((k, i) => (
            <Area key={k} type="monotone" dataKey={k} stroke={colors[i]} strokeWidth={2.5} fill={`url(#g${i})`} />
          ))}
        </AreaChart>
      );
    }
    
    if (chartType === "Line") {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          {chartKeys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={colors[i]} strokeWidth={2.5} dot={{ r: 4, fill: colors[i] }} activeDot={{ r: 6 }} />
          ))}
        </LineChart>
      );
    }
    
    return (
      <BarChart {...commonProps} barGap={3} barCategoryGap="28%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
        {chartKeys.map((k, i) => (
          <Bar key={k} dataKey={k} fill={colors[i]} radius={[5, 5, 0, 0]} />
        ))}
      </BarChart>
    );
  };
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 mb-5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {cat.tabs[activeTab].icon} {cat.tabs[activeTab].label} — Trend Analysis
          </h3>
          <p className="text-slate-400 text-[11px]">6-month breakdown · Updated daily</p>
        </div>
        <div className="flex gap-1.5 items-center">
          <span className="text-[11px] text-slate-400 mr-1">Chart type:</span>
          {(["Bar", "Line", "Area"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200"
              style={{
                background: chartType === t ? cat.accentLight : "transparent",
                color: chartType === t ? cat.accent : "#94a3b8",
                border: `1px solid ${chartType === t ? cat.accentBorder : "#e2e8f0"}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}