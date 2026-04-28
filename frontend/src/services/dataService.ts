// // services/dataService.ts
// import axios from "axios";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// export class DataService {
//   private static instance: DataService;
//   static getInstance() {
//     if (!this.instance) this.instance = new DataService();
//     return this.instance;
//   }

//   // ✅ Fetch report data – now uses reportName in the URL path
//   async fetchReport(categoryId: string, filters?: Record<string, any>) {
//     const { reportName, ...restFilters } = filters || {};
    
//     // Build URL: /api/reports/:categoryId/:reportName   or fallback to /api/reports/:categoryId
//     let url = `${API_BASE}/reports/${categoryId}`;
//     if (reportName) {
//       url += `/${reportName}`;
//     }
    
//     const response = await axios.get(url, { params: restFilters });
//     return response.data; // must be { rows, total, page, totalPages, kpis }
//   }

//   // Export remains unchanged
//   async exportData(
//     categoryId: string,
//     format: "csv" | "excel" | "pdf",
//     filters?: Record<string, any>,
//     reportData?: { headers: string[]; rows: any[]; kpis?: any[] }
//   ): Promise<Blob> {
//     const response = await axios.post(
//       `${API_BASE}/reports/export`,
//       {
//         type: format,
//         module: categoryId,
//         reportName: `${categoryId}-report`,
//         kpis: reportData?.kpis || [],
//         headers: reportData?.headers || [],
//         rows: reportData?.rows || [],
//       },
//       { responseType: "blob" }
//     );
//     return response.data;
//   }
// }

// export const dataService = DataService.getInstance();



// services/dataService.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export class DataService {
  private static instance: DataService;

  static getInstance(): DataService {
    if (!DataService.instance) DataService.instance = new DataService();
    return DataService.instance;
  }

  // ── Fetch report rows + KPIs ─────────────────────────────────────────────
  // URL: GET /api/reports/:categoryId/:reportName?search=&startDate=&endDate=&page=&limit=
  async fetchReport(categoryId: string, filters?: Record<string, any>) {
    const { reportName, ...queryParams } = filters ?? {};

    let url = `${API_BASE}/reports/${categoryId}`;
    if (reportName) url += `/${reportName}`;

    // Strip empty strings so the backend doesn't receive blank params
    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([, v]) => v !== "" && v != null)
    );

    const response = await axios.get(url, { params: cleanParams });
    return response.data; // { rows, total, page, totalPages, kpis }
  }

  // ── Export file ──────────────────────────────────────────────────────────
  // URL: POST /api/reports/export   ← MUST be POST (reads req.body)
  // Bug fix: was previously called with axios.get in some branches
  async exportData(
    categoryId: string,
    format: "csv" | "excel" | "pdf",
    _filters?: Record<string, any>,  // unused — backend derives data from reportData
    reportData?: { headers: string[]; rows: any[][]; kpis?: any[] }
  ): Promise<Blob> {
    const response = await axios.post(
      `${API_BASE}/reports/export`,
      {
        type:       format,
        module:     categoryId,
        reportName: `${categoryId} Report`,
        kpis:       reportData?.kpis   ?? [],
        headers:    reportData?.headers ?? [],
        rows:       reportData?.rows    ?? [],
      },
      { responseType: "blob" }
    );
    return response.data;
  }
}

export const dataService = DataService.getInstance();