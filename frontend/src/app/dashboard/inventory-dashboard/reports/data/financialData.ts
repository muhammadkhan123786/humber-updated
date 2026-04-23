import { CategoryData } from '../types';

export const financialData: CategoryData = {
  kpis: [
    { label: "Total Revenue", value: "$12.4M", change: "+22.5%", up: true, icon: "📈", sparkline: [50, 58, 65, 72, 80, 90] },
    { label: "COGS", value: "$7.8M", change: "+18.1%", up: false, icon: "💼", sparkline: [45, 52, 60, 65, 72, 82] },
    { label: "Gross Margin", value: "37.1%", change: "+2.3%", up: true, icon: "💹", sparkline: [55, 58, 60, 62, 65, 70] },
    { label: "Inventory Turnover", value: "5.2x", change: "+0.8x", up: true, icon: "🔃", sparkline: [40, 45, 48, 52, 56, 62] },
  ],
  chart: [
    { name: "Jan", "Revenue": 1800, "COGS": 1100, "Profit": 700 },
    { name: "Feb", "Revenue": 1950, "COGS": 1220, "Profit": 730 },
    { name: "Mar", "Revenue": 2100, "COGS": 1350, "Profit": 750 },
    { name: "Apr", "Revenue": 2350, "COGS": 1480, "Profit": 870 },
    { name: "May", "Revenue": 2180, "COGS": 1360, "Profit": 820 },
    { name: "Jun", "Revenue": 2020, "COGS": 1290, "Profit": 730 },
  ],
  headers: ["ID", "Category", "Revenue", "COGS", "Gross Margin", "Turnover"],
  rows: [
    ["FIN-001", "Electronics", "$5.8M", "$3.6M", "37.9%", "6.2×"],
    ["FIN-002", "Furniture", "$2.4M", "$1.7M", "29.2%", "3.8×"],
    ["FIN-003", "Accessories", "$1.8M", "$1.1M", "38.9%", "8.4×"],
    ["FIN-004", "Stationery", "$890K", "$560K", "37.1%", "9.2×"],
    ["FIN-005", "Components", "$1.2M", "$810K", "32.5%", "4.7×"],
    ["FIN-006", "Shipping", "$310K", "$230K", "25.8%", "N/A"],
  ],
};