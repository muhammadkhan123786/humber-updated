// services/reportService.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ReportFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  totalPages: number;
  kpis: Record<string, any>;
}

class ReportService {
  private static instance: ReportService;
  static getInstance() {
    if (!this.instance) this.instance = new ReportService();
    return this.instance;
  }

  async fetchReport<T = any>(
    module: string,      // "inventory", "purchase", "supplier", "financial"
    reportName: string,  // "stock-summary", "low-stock", etc.
    filters: ReportFilters = {}
  ): Promise<PaginatedResponse<T>> {
    const params = {
      search: filters.search || "",
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
    const { data } = await axios.get(
      `${API_BASE}/reports/${module}/${reportName}`,
      { params }
    );
    return data;
  }
}

export const reportService = ReportService.getInstance();