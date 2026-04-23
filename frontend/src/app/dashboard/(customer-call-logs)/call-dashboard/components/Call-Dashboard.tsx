'use client';

import { PhoneIncoming } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/form/CustomButton';
import { KPICard } from '../components/CallLog/KPICard';
import { AlertBanner } from '../components/CallLog/AlertBanner';
import { CallTrendChart } from '../components/CallLog/CallTrendChart';
import { CallTypePieChart } from '../components/CallLog/CallTypePieChart';
import { AgentPerformanceChart } from '../components/CallLog/AgentPerformanceChart';
import { RecentCallsTable } from '../components/CallLog/RecentCallsTable';
import { FollowUpsTable } from '../components/CallLog/FollowUpsTable';
import { useCallLogs } from '../hooks/useCallLogs';

const kpiConfigs = [
  { name: 'Total Calls Today', key: 'totalCallsToday', icon: PhoneIncoming, gradient: 'from-blue-500 via-indigo-500 to-purple-500', bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50', iconBg: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500', shadow: 'hover:shadow-blue-200' },
  { name: 'Missed Calls', key: 'missedCalls', icon: PhoneIncoming, gradient: 'from-red-500 via-rose-500 to-pink-500', bg: 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50', iconBg: 'bg-gradient-to-br from-red-500 via-rose-500 to-pink-500', shadow: 'hover:shadow-red-200' },
  { name: 'Pending Follow-Ups', key: 'pendingFollowUps', icon: PhoneIncoming, gradient: 'from-amber-500 via-orange-500 to-yellow-500', bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50', iconBg: 'bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500', shadow: 'hover:shadow-orange-200' },
  { name: 'Resolved Issues', key: 'resolvedIssues', icon: PhoneIncoming, gradient: 'from-green-500 via-emerald-500 to-teal-500', bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50', iconBg: 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500', shadow: 'hover:shadow-green-200' },
  { name: 'Avg Response Time', key: 'avgResponseTime', icon: PhoneIncoming, gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', bg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50', iconBg: 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500', shadow: 'hover:shadow-purple-200' },
  { name: 'Active Tickets', key: 'activeTickets', icon: PhoneIncoming, gradient: 'from-cyan-500 via-blue-500 to-indigo-500', bg: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50', iconBg: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500', shadow: 'hover:shadow-cyan-200' },
];

export default function CallLogDashboard() {
  const { stats, callTrend, callTypes, agentPerformance, recentCalls, followUps, loading } = useCallLogs();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Customer Call Log Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time call monitoring and customer support tracking</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg">
            <PhoneIncoming className="mr-2 h-4 w-4" />
            Log New Call
          </Button>
        </div>
      </motion.div>

      {/* Alert Banner */}
      <AlertBanner followUps={followUps} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiConfigs.map((config, index) => (
          <KPICard
            key={config.name}
            name={config.name}
            value={stats?.[config.key as keyof typeof stats] || 0}
            icon={config.icon}
            gradient={config.gradient}
            bg={config.bg}
            iconBg={config.iconBg}
            change={index === 0 ? '+12%' : index === 1 ? '-3%' : index === 2 ? '+5%' : index === 3 ? '+18%' : index === 4 ? '-8%' : '+10%'}
            shadow={config.shadow}
            index={index}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CallTrendChart data={callTrend} />
        <CallTypePieChart data={callTypes} />
      </div>

      {/* Agent Performance */}
      <AgentPerformanceChart data={agentPerformance} />

      {/* Recent Calls Table */}
      <RecentCallsTable calls={recentCalls} />

      {/* Follow-ups Table */}
      <FollowUpsTable followUps={followUps} />
    </div>
  );
}