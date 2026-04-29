// services/dashboardService.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getDashboardQuickStats = async () => {
  const response = await axios.get(`${API_BASE}/reports/dashboard/quick-stats`);
  return response.data; // should match QUICK_STATS array shape
};

export const getDashboardCharts = async () => {
  const response = await axios.get(`${API_BASE}/reports/dashboard/charts`);
  console.log("response", response)
  return response.data; // { pieData, monthlyChart }
};