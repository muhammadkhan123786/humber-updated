// // components/reports/ReportChart.tsx
// "use client";

// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     color: string;
//   }[];
// }

// interface ReportChartProps {
//   data: ChartData;
// }

// export default function ReportChart({ data }: ReportChartProps) {
//   const chartData = data.labels.map((label, idx) => {
//     const point: any = { name: label };
//     data.datasets.forEach((dataset) => {
//       point[dataset.label] = dataset.data[idx];
//     });
//     return point;
//   });

//   const isBarChart = data.datasets.length === 1 || data.datasets[0]?.label === "Low Stock Items";

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       {isBarChart ? (
//         <BarChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//           <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
//           <YAxis stroke="#64748b" fontSize={12} />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "white",
//               border: "1px solid #e2e8f0",
//               borderRadius: "8px",
//               boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//             }}
//           />
//           <Legend />
//           {data.datasets.map((dataset, idx) => (
//             <Bar
//               key={idx}
//               dataKey={dataset.label}
//               fill={dataset.color}
//               radius={[4, 4, 0, 0]}
//             />
//           ))}
//         </BarChart>
//       ) : (
//         <LineChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//           <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
//           <YAxis stroke="#64748b" fontSize={12} />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "white",
//               border: "1px solid #e2e8f0",
//               borderRadius: "8px",
//               boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//             }}
//           />
//           <Legend />
//           {data.datasets.map((dataset, idx) => (
//             <Line
//               key={idx}
//               type="monotone"
//               dataKey={dataset.label}
//               stroke={dataset.color}
//               strokeWidth={2}
//               dot={{ fill: dataset.color, r: 4 }}
//             />
//           ))}
//         </LineChart>
//       )}
//     </ResponsiveContainer>
//   );
// }




// components/reports/ChartCard.tsx
"use client";

import { useState } from "react";
import { ChartData } from "../../types";

interface ChartCardProps {
  title: string;
  chartData: ChartData[];
  chartColors: string[];
  marginBottom?: number;
}

export function ChartCard({ title, chartData, chartColors, marginBottom = 20 }: ChartCardProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const chartKeys = Object.keys(chartData[0] || {}).filter((k) => k !== "name");
  const maxValue = Math.max(...chartData.flatMap((d) => chartKeys.map((k) => Number(d[k]))));

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "20px 24px",
        marginBottom,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        border: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" }}>
            {title}
          </h3>
          <p style={{ color: "#94a3b8", fontSize: 11, margin: 0 }}>6-month breakdown · Updated daily</p>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#94a3b8", marginRight: 4 }}>Chart type:</span>
          {["bar", "line"].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type as "bar" | "line")}
              style={{
                background: chartType === type ? "#eff6ff" : "transparent",
                color: chartType === type ? "#2563eb" : "#94a3b8",
                border: `1px solid ${chartType === type ? "#93c5fd" : "#e2e8f0"}`,
                borderRadius: 8,
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {type === "bar" ? "Bar" : "Line"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg width="100%" height="240" viewBox="0 0 800 240" preserveAspectRatio="none">
          {chartType === "bar" ? (
            // Bar Chart
            <>
              {chartData.map((item, idx) => {
                const barWidth = (780 / chartData.length) * 0.7;
                const barSpacing = (780 / chartData.length) * 0.3;
                const x = idx * (780 / chartData.length) + barSpacing / 2 + 10;
                
                return chartKeys.map((key, kidx) => {
                  const value = Number(item[key]);
                  const barHeight = (value / maxValue) * 160;
                  const y = 200 - barHeight;
                  const barX = x + (kidx * (barWidth / chartKeys.length));
                  const individualBarWidth = barWidth / chartKeys.length - 2;
                  
                  return (
                    <g key={`${idx}-${kidx}`}>
                      <rect
                        x={barX}
                        y={y}
                        width={individualBarWidth}
                        height={barHeight}
                        fill={chartColors[kidx % chartColors.length]}
                        rx={4}
                        ry={4}
                      />
                    </g>
                  );
                });
              })}
              {/* X-axis labels */}
              {chartData.map((item, idx) => {
                const x = idx * (780 / chartData.length) + (780 / chartData.length) / 2 + 10;
                return (
                  <text
                    key={idx}
                    x={x}
                    y="220"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#94a3b8"
                  >
                    {item.name}
                  </text>
                );
              })}
            </>
          ) : (
            // Line Chart
            <>
              {chartKeys.map((key, kidx) => {
                const points = chartData.map((item, idx) => {
                  const x = idx * (780 / (chartData.length - 1)) + 10;
                  const y = 200 - (Number(item[key]) / maxValue) * 160;
                  return `${x},${y}`;
                }).join(" ");
                
                return (
                  <g key={kidx}>
                    <polyline
                      points={points}
                      fill="none"
                      stroke={chartColors[kidx % chartColors.length]}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {chartData.map((item, idx) => {
                      const x = idx * (780 / (chartData.length - 1)) + 10;
                      const y = 200 - (Number(item[key]) / maxValue) * 160;
                      return (
                        <circle
                          key={`${kidx}-${idx}`}
                          cx={x}
                          cy={y}
                          r="4"
                          fill={chartColors[kidx % chartColors.length]}
                          stroke="#fff"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </g>
                );
              })}
              {/* X-axis labels */}
              {chartData.map((item, idx) => {
                const x = idx * (780 / (chartData.length - 1)) + 10;
                return (
                  <text
                    key={idx}
                    x={x}
                    y="220"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#94a3b8"
                  >
                    {item.name}
                  </text>
                );
              })}
            </>
          )}
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = 200 - ratio * 160;
            return (
              <g key={idx}>
                <line
                  x1="10"
                  y1={y}
                  x2="790"
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text x="5" y={y + 3} fontSize="9" fill="#94a3b8" textAnchor="end">
                  ${Math.round(maxValue * ratio).toLocaleString()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16 }}>
        {chartKeys.map((key, idx) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 10,
                height: 10,
                background: chartColors[idx % chartColors.length],
                borderRadius: chartType === "line" ? 10 : 2,
              }}
            />
            <span style={{ fontSize: 10, color: "#64748b" }}>{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}