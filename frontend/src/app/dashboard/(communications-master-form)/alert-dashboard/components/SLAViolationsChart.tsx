"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AlertCircle } from "lucide-react";

const slaData = [
  { name: "Week 1", violations: 5 },
  { name: "Week 2", violations: 8 },
  { name: "Week 3", violations: 3 },
  { name: "Week 4", violations: 6 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    fill?: string;
  }[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-sm text-xs">
        <p className="mb-2 text-slate-900 font-semibold">{label}</p>
        <p className="text-red-500 font-medium">
          violations : {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const SLAViolationsChart: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 w-full mt-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-pink-500 p-2 rounded-lg text-white shadow-sm">
          <AlertCircle size={18} />
        </div>
        <h3 className="font-bold text-slate-800 text-sm tracking-tight">
          SLA Violations
        </h3>
      </div>

      <div className="h-[245px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={slaData}
            margin={{ top: 5, right: 30, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              domain={[0, 8]}
              ticks={[0, 2, 4, 6, 8]}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span className="text-red-500 text-[10px] font-medium tracking-wide">
                  {value}
                </span>
              )}
            />

            <Line
              type="monotone"
              dataKey="violations"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#fff", stroke: "#ef4444", strokeWidth: 2 }}
              activeDot={{
                r: 5,
                stroke: "#ef4444",
                strokeWidth: 2,
                fill: "#fff",
              }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SLAViolationsChart;
