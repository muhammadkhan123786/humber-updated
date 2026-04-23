import { CategoryData } from '../types';

export const purchaseData: CategoryData = {
  kpis: [
    { label: "Total POs", value: "1,247", change: "+18%", up: true, icon: "📋", sparkline: [55, 65, 58, 72, 68, 88] },
    { label: "PO Value", value: "$5.8M", change: "+14.2%", up: true, icon: "💵", sparkline: [60, 68, 62, 78, 74, 92] },
    { label: "Pending Approval", value: "63", change: "+3 new", up: false, icon: "⏳", sparkline: [40, 52, 45, 60, 55, 70] },
    { label: "Overdue POs", value: "17", change: "+3 vs last", up: false, icon: "🚨", sparkline: [20, 28, 35, 22, 38, 45] },
  ],
  chart: [
    { name: "Jan", "Orders": 180, "Received": 165, "Pending": 15 },
    { name: "Feb", "Orders": 210, "Received": 195, "Pending": 15 },
    { name: "Mar", "Orders": 195, "Received": 180, "Pending": 15 },
    { name: "Apr", "Orders": 230, "Received": 218, "Pending": 12 },
    { name: "May", "Orders": 215, "Received": 200, "Pending": 15 },
    { name: "Jun", "Orders": 247, "Received": 230, "Pending": 17 },
  ],
  headers: ["PO ID", "Supplier", "Date", "Items", "Value", "Status"],
  rows: [
    ["PO-2024-001", "TechDistributors Inc.", "2024-06-01", "15", "$124,500", "Received"],
    ["PO-2024-002", "Office Supplies Co.", "2024-06-05", "8", "$18,200", "Pending"],
    ["PO-2024-003", "Furniture World Ltd.", "2024-06-08", "22", "$67,800", "Partial"],
    ["PO-2024-004", "Electronics Hub", "2024-06-10", "45", "$345,600", "Received"],
    ["PO-2024-005", "Global Parts LLC", "2024-06-12", "12", "$89,100", "Overdue"],
    ["PO-2024-006", "Prime Logistics", "2024-06-15", "6", "$32,400", "Pending"],
    ["PO-2024-007", "TechDistributors Inc.", "2024-06-18", "28", "$218,900", "Approved"],
    ["PO-2024-008", "Office Supplies Co.", "2024-06-20", "14", "$42,600", "Pending"],
  ],
};