// import { useQuery, useMutation } from "@tanstack/react-query";
// import { reportService, ReportFilters } from "@/services/reportService";
// import { dataService } from "@/services/dataService";
// import { useDebounce } from "./useDebounce";
// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";

// export function useModuleReport(
//   module: string,
//   reportName: string | null,
//   initialFilters?: Partial<ReportFilters>
// ) {
//   const [filters, setFilters] = useState<ReportFilters>({
//     search: "",
//     startDate: "",
//     endDate: "",
//     page: 1,
//     limit: 10,
//     ...initialFilters,
//   });

//   // Debounce to avoid hammering the API on every keystroke / date pick
//   const debouncedSearch = useDebounce(filters.search, 500);
//   const debouncedStart  = useDebounce(filters.startDate, 400);
//   const debouncedEnd    = useDebounce(filters.endDate, 400);

//   // Reset to page 1 whenever any search param changes
//   useEffect(() => {
//     setFilters(prev => ({ ...prev, page: 1 }));
//   }, [debouncedSearch, debouncedStart, debouncedEnd]);

//   // ── Data query ────────────────────────────────────────────────────────────
//   const query = useQuery({
//     queryKey: [
//       "module-report",
//       module,
//       reportName,
//       debouncedSearch,
//       debouncedStart,
//       debouncedEnd,
//       filters.page,
//       filters.limit,
//     ],
//     queryFn: () =>
//       reportService.fetchReport(module, reportName!, {
//         search:    debouncedSearch,
//         startDate: debouncedStart,
//         endDate:   debouncedEnd,
//         page:      filters.page,
//         limit:     filters.limit,
//       }),
//     enabled: !!module && !!reportName,
//     // v5 replacement for keepPreviousData:true — shows previous data while new fetch is in flight
//     placeholderData: (prev: any) => prev,
//     staleTime: 60_000,
//     gcTime:    5 * 60_000,   // v5 replacement for cacheTime
//   });

//   // ── Export mutation ───────────────────────────────────────────────────────
//   // All three formats (csv / excel / pdf) go through the backend so the
//   // professional PDF generator, KPI section, and company branding are applied.
//   const exportMutation = useMutation({
//     mutationFn: ({
//       format,
//       reportData,
//     }: {
//       format: "csv" | "excel" | "pdf";
//       reportData: { headers: string[]; rows: any[][]; kpis?: any[] };
//     }) => dataService.exportData(module, format, undefined, reportData),

//     onSuccess: (blob, { format }) => {
//       const url = window.URL.createObjectURL(blob);
//       const a   = document.createElement("a");
//       a.href     = url;
//       a.download = `${module}-${reportName}-report.${format}`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//       toast.success(`${format.toUpperCase()} exported successfully`);
//     },

//     onError: (error: any) => {
//       const msg = error?.response?.data?.message ?? "Export failed. Please try again.";
//       toast.error(msg);
//     },
//   });

//   // ── Filter helpers ────────────────────────────────────────────────────────
//   const setSearch = (search: string) =>
//     setFilters(prev => ({ ...prev, search, page: 1 }));

//   const setDateRange = (startDate: string, endDate: string) =>
//     setFilters(prev => ({ ...prev, startDate, endDate, page: 1 }));

//   const setPage  = (page: number)  => setFilters(prev => ({ ...prev, page }));
//   const setLimit = (limit: number) => setFilters(prev => ({ ...prev, limit, page: 1 }));

//   return {
//     // data
//     data:       query.data,
//     isLoading:  query.isLoading,
//     isFetching: query.isFetching,
//     error:      query.error,
//     // pagination info (comes from API response)
//     total:      query.data?.total      ?? 0,
//     totalPages: query.data?.totalPages ?? 1,
//     // filters
//     filters,
//     setSearch,
//     setDateRange,
//     setPage,
//     setLimit,
//     // export
//     exportFile:  exportMutation.mutate,
//     isExporting: exportMutation.isPending,
//     // utility
//     refetch: query.refetch,
//   };
// }







import { useQuery, useMutation } from "@tanstack/react-query";
import { reportService, ReportFilters } from "@/services/reportService";
import { dataService } from "@/services/dataService";
import { useDebounce } from "./useDebounce";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

export function useModuleReport(
  module: string,
  reportName: string | null,
  initialFilters?: Partial<ReportFilters>
) {
  // Base filters (global search, date, pagination)
  const [filters, setFilters] = useState<ReportFilters>({
    search: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  // NEW: columnFilters = { productName: "abc", sku: "123", ... }
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Debounce search & date range (as before)
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedStart  = useDebounce(filters.startDate, 400);
  const debouncedEnd    = useDebounce(filters.endDate, 400);

  // NEW: debounce columnFilters because we don't want to call API on every keystroke
  const debouncedColumnFilters = useDebounce(columnFilters, 500);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearch, debouncedStart, debouncedEnd, debouncedColumnFilters]);

  // ── Data query ────────────────────────────────────────────────────────────
  const query = useQuery({
    queryKey: [
      "module-report",
      module,
      reportName,
      debouncedSearch,
      debouncedStart,
      debouncedEnd,
      debouncedColumnFilters,       // 👈 columnFilters added to cache key
      filters.page,
      filters.limit,
    ],
    queryFn: () =>
      reportService.fetchReport(module, reportName!, {
        search:         debouncedSearch,
        startDate:      debouncedStart,
        endDate:        debouncedEnd,
        page:           filters.page,
        limit:          filters.limit,
        columnFilters:  debouncedColumnFilters,   // 👈 send to API
        // If you also need a dedicated global searchField, add it here
        searchField:    "productName",            // example: global search on productName
      }),
    enabled: !!module && !!reportName,
    placeholderData: (prev: any) => prev,
    staleTime: 60_000,
    gcTime:    5 * 60_000,
  });

  // ── Export mutation (unchanged) ───────────────────────────────────────────
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

  // NEW: Update a single column filter (e.g., when user types in a column's search box)
  const setColumnFilter = useCallback((column: string, value: string) => {
    setColumnFilters(prev => {
      if (value === "") {
        const { [column]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [column]: value };
    });
  }, []);

  // Optional: clear all column filters at once
  const clearColumnFilters = useCallback(() => {
    setColumnFilters({});
  }, []);

  return {
    // data
    data:       query.data,
    isLoading:  query.isLoading,
    isFetching: query.isFetching,
    error:      query.error,
    total:      query.data?.total      ?? 0,
    totalPages: query.data?.totalPages ?? 1,

    // filters state & setters
    filters,
    setSearch,
    setDateRange,
    setPage,
    setLimit,

    // NEW: column filters
    columnFilters,
    setColumnFilter,
    clearColumnFilters,

    // export
    exportFile:  exportMutation.mutate,
    isExporting: exportMutation.isPending,

    refetch: query.refetch,
  };
}