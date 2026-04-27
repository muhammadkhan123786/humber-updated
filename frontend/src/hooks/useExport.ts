// hooks/useExport.ts

import { useMutation } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { toast } from "react-hot-toast";

export const useExport = () => {
  return useMutation({
    mutationFn: ({
      payload,
      format,
      fileName,
    }: {
      payload: any;
      format: "pdf" | "excel" | "csv";
      fileName: string;
    }) => dataService.exportData(payload, format),

    onSuccess: (blob, variables) => {
      // ✅ Auto download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${variables.fileName}.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      toast.success(`${variables.format.toUpperCase()} downloaded`);
    },

    onError: (err: any) => {
      toast.error(err.message || "Export failed");
    },
  });
};