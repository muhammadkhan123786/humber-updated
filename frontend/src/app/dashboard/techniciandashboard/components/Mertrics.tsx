"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    Area,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const data = [
    { name: "Jan", value: 50 },
    { name: "Feb", value: 60 },
    { name: "Mar", value: 70 },
    { name: "Apr", value: 60 },
    { name: "May", value: 70 },
    { name: "Jun", value: 60 },
    { name: "Jul", value: 80 },
];

export default function Metrices() {
    return (
        <div className="bg-white px-2 py-4 mt-4">
            <div className="flex flex-col gap-16">
                {/* Header */}
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-black text-lg font-bold">Metrices</h1>
                        <p className="text-gray-400">Weekly Report</p>
                    </div>

                    <div className="text-right">
                        <h1 className="text-black text-lg font-bold">$50,000.00</h1>
                        <p className="text-orange-500 font-semibold">+10k</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            {/* Gradient */}
                            <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FE6B1D" stopOpacity={0.6} />
                                    <stop offset="100%" stopColor="#FE6B1D" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <XAxis
                                dataKey="name"
                                interval={0}
                                padding={{ left: 20, right: 20 }}
                                tickLine={false}
                                axisLine={false}
                            />

                            <YAxis
                                domain={[10, 80]}
                                ticks={[10, 20, 30, 40, 50, 60, 70, 80]}
                                interval={0}
                                tickLine={false}
                                axisLine={false}
                            />



                            <Tooltip />

                            {/* Gradient Area */}
                            <Area
                                type="monotone"
                                dataKey="value"
                                baseValue={10}
                                fill="url(#lineGradient)"
                                stroke="none"
                            />

                            {/* Line */}
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#FE6B1D"
                                strokeWidth={3}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
