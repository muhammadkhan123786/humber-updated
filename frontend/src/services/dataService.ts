// services/dataService.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export class DataService {
  private static instance: DataService;
  static getInstance() {
    if (!this.instance) this.instance = new DataService();
    return this.instance;
  }

  // ✅ Fetch report data – now uses reportName in the URL path
  async fetchReport(categoryId: string, filters?: Record<string, any>) {
    const { reportName, ...restFilters } = filters || {};
    
    // Build URL: /api/reports/:categoryId/:reportName   or fallback to /api/reports/:categoryId
    let url = `${API_BASE}/reports/${categoryId}`;
    if (reportName) {
      url += `/${reportName}`;
    }
    
    const response = await axios.get(url, { params: restFilters });
    return response.data; // must be { rows, total, page, totalPages, kpis }
  }

  // Export remains unchanged
  async exportData(
    categoryId: string,
    format: "csv" | "excel" | "pdf",
    filters?: Record<string, any>,
    reportData?: { headers: string[]; rows: any[]; kpis?: any[] }
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
      { responseType: "blob" }
    );
    return response.data;
  }
}

export const dataService = DataService.getInstance();