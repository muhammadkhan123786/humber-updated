// hooks/useModuleReport.ts
import { useQuery } from "@tanstack/react-query";
import { reportService, ReportFilters } from "@/services/reportService";
import { useDebounce } from "./useDebounce";
import { useState, useEffect } from "react";

export function useModuleReport(
  module: string,
  reportName: string | null, // null means no active tab
  initialFilters?: Partial<ReportFilters>
) {
  const [filters, setFilters] = useState<ReportFilters>({
    search: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedStart = useDebounce(filters.startDate, 300);
  const debouncedEnd = useDebounce(filters.endDate, 300);

  // Reset page when search/date changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearch, debouncedStart, debouncedEnd]);

  const queryKey = [
    "module-report",
    module,
    reportName,
    debouncedSearch,
    debouncedStart,
    debouncedEnd,
    filters.page,
    filters.limit,
  ];

  const enabled = !!module && !!reportName;

  const query = useQuery({
    queryKey,
    queryFn: () =>
      reportService.fetchReport(module, reportName!, {
        search: debouncedSearch,
        startDate: debouncedStart,
        endDate: debouncedEnd,
        page: filters.page,
        limit: filters.limit,
      }),
    enabled,
    keepPreviousData: true,
    staleTime: 60_000,
    cacheTime: 5 * 60_000,
  });

  const updateFilter = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const setPage = (page: number) => setFilters(prev => ({ ...prev, page }));
  const setLimit = (limit: number) => setFilters(prev => ({ ...prev, limit, page: 1 }));

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    filters,
    updateFilter,
    setPage,
    setLimit,
    refetch: query.refetch,
  };
}