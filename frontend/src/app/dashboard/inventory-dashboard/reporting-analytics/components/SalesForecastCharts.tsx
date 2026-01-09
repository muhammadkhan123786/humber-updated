import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// Define types for our data


interface ForecastDataItem {
  week: string;
  value: number;
}

interface ChannelDataItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
  [key: string]: string | number;
}


// Sales vs Inventory Forecast Data
const forecastData: ForecastDataItem[] = [
  { week: 'Week 1', value: 8000 },
  { week: 'Week 2', value: 9500 },
  { week: 'Week 3', value: 8200 },
  { week: 'Week 4', value: 10200 },
  { week: 'Week 5', value: 9000 },
  { week: 'Week 6', value: 11000 },
  { week: 'Week 7', value: 9800 },
  { week: 'Week 8', value: 10500 },
  { week: 'Week 9', value: 9200 },
  { week: 'Week 10', value: 11500 },
  { week: 'Week 11', value: 10800 },
  { week: 'Week 12', value: 12450 },
];

// Channel Split Data
const channelData: ChannelDataItem[] = [
  { name: 'Online Store', value: 22500, percentage: 50, color: '#f97316' },
  { name: 'Retail partners', value: 11250, percentage: 25, color: '#9ca3af' },
  { name: 'Wholesale (B2B)', value: 11250, percentage: 25, color: '#1f2937' },
];

// Define proper types for Tooltip props
interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  active?: boolean;
  payload?: Array<{
    payload: ForecastDataItem;
    value: number;
  }>;
}

// Custom Tooltip for Area Chart
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {payload[0].payload.week}
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {payload[0].value.toLocaleString()} units
        </p>
      </div>
    );
  }
  return null;
};

// Define types for Legend payload
interface LegendPayload {
  value: string;
  color: string;
  payload: {
    percentage: number;
  };
}

interface CustomLegendProps {
  payload?: LegendPayload[];
}

// Custom Legend - Fixed to show correct data
const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {entry.value} {entry.payload.percentage}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default function SalesForecastCharts() {
  const totalUnits = 12450;

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales VS Inventory Forecast Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Sales VS Inventory Forecast
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Projected demand for the next 90 days based on historical trends
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {totalUnits.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-orange-500 dark:text-blue-400">
                Units Projected
              </p>
            </div>

            {/* Area Chart */}
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={forecastData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-white/10" />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-gray-500 dark:text-gray-400"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-gray-500 dark:text-gray-400"
                  tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Current Week Indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-px h-4 bg-gray-300 dark:bg-slate-700" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Current week indicator
              </p>
            </div>
          </div>

          {/* Channel Split Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Channel Split
              </h3>
            </div>

            {/* Donut Chart */}
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                  <tspan x="50%" dy="-0.5em" className="text-2xl font-bold fill-gray-900 dark:fill-white">
                    45k
                  </tspan>
                  <tspan x="50%" dy="1.5em" className="text-sm fill-gray-500 dark:fill-gray-400">
                    Total units
                  </tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="space-y-3 mt-6">
              {channelData.map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: channel.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {channel.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {channel.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Integration Example */}
        {/* <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            📘 API Integration Ready
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-400 mb-3">
            This component is ready to receive data from your API. Simply replace the static data arrays with your API response.
          </p>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3 font-mono text-xs">
            <p className="text-gray-600 dark:text-gray-400">// Example API usage:</p>
            <p className="text-green-600 dark:text-green-400">const forecastData = await fetch(&apos;/api/forecast&apos;).then(r =&gt; r.json())</p>
            <p className="text-green-600 dark:text-green-400">const channelData = await fetch(&apos;/api/channels&apos;).then(r =&gt; r.json())</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}