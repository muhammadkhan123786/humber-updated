import { useState, useEffect, useCallback } from 'react';
import { callLogService } from '../services/callLogService';
import { CallLog, FollowUpReminder, DashboardStats, CallTrendData, CallTypeData, AgentPerformance } from '../types/callLog';
import { toast } from 'sonner';

export const useCallLogs = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [callTrend, setCallTrend] = useState<CallTrendData[]>([]);
  const [callTypes, setCallTypes] = useState<CallTypeData[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, trendData, typesData, performanceData, callsData, followUpsData] = await Promise.all([
        callLogService.getStats(),
        callLogService.getCallTrend(),
        callLogService.getCallTypeDistribution(),
        callLogService.getAgentPerformance(),
        callLogService.getRecentCalls(),
        callLogService.getFollowUpReminders(),
      ]);

      setStats(statsData);
      setCallTrend(trendData);
      setCallTypes(typesData);
      setAgentPerformance(performanceData);
      setRecentCalls(callsData);
      setFollowUps(followUpsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    callTrend,
    callTypes,
    agentPerformance,
    recentCalls,
    followUps,
    loading,
    refreshData: fetchDashboardData,
  };
};