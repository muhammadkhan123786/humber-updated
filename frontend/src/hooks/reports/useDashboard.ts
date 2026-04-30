// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { getDashboardQuickStats, getDashboardCharts } from "@/services/reportsDashboardService";

export function useDashboard() {
  const quickStatsQuery = useQuery({
    queryKey: ["dashboard-quick-stats"],
    queryFn: getDashboardQuickStats,
    staleTime: 60_000,
  });

  const chartsQuery = useQuery({
    queryKey: ["dashboard-charts"],
    queryFn: getDashboardCharts,
    staleTime: 60_000,
  });

  const isLoading = quickStatsQuery.isLoading || chartsQuery.isLoading;
  const isError = quickStatsQuery.isError || chartsQuery.isError;

  return {
    quickStats: quickStatsQuery.data,
    pieData: chartsQuery.data?.pieData,
    monthlyChart: chartsQuery.data?.monthlyChart,
    isLoading,
    isError,
    refetch: () => {
      quickStatsQuery.refetch();
      chartsQuery.refetch();
    },
  };
}