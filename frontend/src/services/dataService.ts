// services/dataService.ts

export class DataService {
  private static instance: DataService;

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

  // ✅ Fetch report (for table UI)
  async fetchReport(categoryId: string, filters?: Record<string, any>) {
    const queryParams = new URLSearchParams(filters || {}).toString();

    const res = await fetch(
      `${this.BASE_URL}/reports/${categoryId}?${queryParams}`
    );

    if (!res.ok) throw new Error("Failed to fetch report");

    return res.json();
  }

  // ✅ Export (PDF / Excel / CSV)
  async exportData(
    payload: any,
    format: "pdf" | "excel" | "csv"
  ): Promise<Blob> {
    const res = await fetch(
      `${this.BASE_URL}/reports/export`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          type: format, // 👈 important
        }),
      }
    );

    if (!res.ok) throw new Error("Export failed");

    return res.blob(); // 👈 VERY IMPORTANT
  }
}

export const dataService = DataService.getInstance();