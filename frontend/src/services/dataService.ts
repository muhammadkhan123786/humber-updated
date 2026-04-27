// services/dataService.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export class DataService {
  private static instance: DataService;

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // ✅ Fetch report data
  async fetchReport(categoryId: string, filters?: Record<string, any>) {
    const response = await axios.get(`${API_BASE}/reports/${categoryId}`, {
      params: filters,
    });
    return response.data;
  }

  // ✅ Export file (CSV / Excel / PDF)
  async exportData(
  categoryId: string,
  format: "csv" | "excel" | "pdf",
  filters?: Record<string, any>,
  reportData?: { headers: string[], rows: any[], kpis?: any[] }  // Add this
): Promise<Blob> {
  const response = await axios.post(
    `${API_BASE}/reports/export`,
    {
      type: format,
      module: categoryId,
      reportName: `${categoryId}-report`,
      kpis: reportData?.kpis || [],
      headers: reportData?.headers || [],
      rows: reportData?.rows || [],
    },
    {
      responseType: "blob",
    }
  );
  return response.data;
}
}

export const dataService = DataService.getInstance();