// hooks/useReport.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { toast } from "react-hot-toast";

export const useReport = (categoryId: string, filters: any) => {
  
  // ✅ Fetch Data
  const reportQuery = useQuery({
    queryKey: ["report", categoryId, filters],
    queryFn: () => dataService.fetchReport(categoryId, filters),
    enabled: !!categoryId,
  });

  // ✅ Export Mutation
  const exportMutation = useMutation({
    mutationFn: ({ format, reportData }: { format: "csv" | "excel" | "pdf", reportData?: any }) =>
    dataService.exportData(categoryId, format, filters, reportData),

    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${categoryId}-report.${variables.format}`;
      a.click();

      window.URL.revokeObjectURL(url);

      toast.success(`${variables.format.toUpperCase()} downloaded`);
    },

    onError: () => {
      toast.error("Export failed");
    },
  });

  return {
    data: reportQuery.data,
    isLoading: reportQuery.isLoading,
    exportFile: exportMutation.mutate,
    isExporting: exportMutation.isPending,
  };
};