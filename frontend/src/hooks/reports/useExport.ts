// // hooks/useReport.ts
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { dataService } from "@/services/dataService";
// import { toast } from "react-hot-toast";

// export const useReport = (categoryId: string, filters: any) => {
  
//   // ✅ Fetch Data
//   const reportQuery = useQuery({
//     queryKey: ["report", categoryId, filters],
//     queryFn: () => dataService.fetchReport(categoryId, filters),
//     enabled: !!categoryId,
//   });

//   // ✅ Export Mutation
//   const exportMutation = useMutation({
//     mutationFn: ({ format, reportData }: { format: "csv" | "excel" | "pdf", reportData?: any }) =>
//     dataService.exportData(categoryId, format, filters, reportData),

//     onSuccess: (blob, variables) => {
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${categoryId}-report.${variables.format}`;
//       a.click();

//       window.URL.revokeObjectURL(url);

//       toast.success(`${variables.format.toUpperCase()} downloaded`);
//     },

//     onError: () => {
//       toast.error("Export failed");
//     },
//   });

//   return {
//     data: reportQuery.data,
//     isLoading: reportQuery.isLoading,
//     exportFile: exportMutation.mutate,
//     isExporting: exportMutation.isPending,
//   };
// };

// hooks/useModuleReport.ts
// THE single hook for all report pages. Drop useReport.ts entirely.
import { useQuery, useMutation } from "@tanstack/react-query";
import { reportService, ReportFilters } from "@/services/reportService";
import { dataService } from "@/services/dataService";
import { useDebounce } from "./useDebounce";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export function useModuleReport(
  module: string,
  reportName: string | null,
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

  // Debounce to avoid hammering the API on every keystroke / date pick
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedStart  = useDebounce(filters.startDate, 400);
  const debouncedEnd    = useDebounce(filters.endDate, 400);

  // Reset to page 1 whenever any search param changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearch, debouncedStart, debouncedEnd]);

  // ── Data query ────────────────────────────────────────────────────────────
  const query = useQuery({
    queryKey: [
      "module-report",
      module,
      reportName,
      debouncedSearch,
      debouncedStart,
      debouncedEnd,
      filters.page,
      filters.limit,
    ],
    queryFn: () =>
      reportService.fetchReport(module, reportName!, {
        search:    debouncedSearch,
        startDate: debouncedStart,
        endDate:   debouncedEnd,
        page:      filters.page,
        limit:     filters.limit,
      }),
    enabled: !!module && !!reportName,
    // v5 replacement for keepPreviousData:true — shows previous data while new fetch is in flight
    placeholderData: (prev: any) => prev,
    staleTime: 60_000,
    gcTime:    5 * 60_000,   // v5 replacement for cacheTime
  });

  // ── Export mutation ───────────────────────────────────────────────────────
  // All three formats (csv / excel / pdf) go through the backend so the
  // professional PDF generator, KPI section, and company branding are applied.
  const exportMutation = useMutation({
    mutationFn: ({
      format,
      reportData,
    }: {
      format: "csv" | "excel" | "pdf";
      reportData: { headers: string[]; rows: any[][]; kpis?: any[] };
    }) => dataService.exportData(module, format, undefined, reportData),

    onSuccess: (blob, { format }) => {
      const url = window.URL.createObjectURL(blob);
      const a   = document.createElement("a");
      a.href     = url;
      a.download = `${module}-${reportName}-report.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} exported successfully`);
    },

    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? "Export failed. Please try again.";
      toast.error(msg);
    },
  });

  // ── Filter helpers ────────────────────────────────────────────────────────
  const setSearch = (search: string) =>
    setFilters(prev => ({ ...prev, search, page: 1 }));

  const setDateRange = (startDate: string, endDate: string) =>
    setFilters(prev => ({ ...prev, startDate, endDate, page: 1 }));

  const setPage  = (page: number)  => setFilters(prev => ({ ...prev, page }));
  const setLimit = (limit: number) => setFilters(prev => ({ ...prev, limit, page: 1 }));

  return {
    // data
    data:       query.data,
    isLoading:  query.isLoading,
    isFetching: query.isFetching,
    error:      query.error,
    // pagination info (comes from API response)
    total:      query.data?.total      ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    // filters
    filters,
    setSearch,
    setDateRange,
    setPage,
    setLimit,
    // export
    exportFile:  exportMutation.mutate,
    isExporting: exportMutation.isPending,
    // utility
    refetch: query.refetch,
  };
}