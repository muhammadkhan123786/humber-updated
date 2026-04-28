import { Category } from '../types/index';


// constants/modules.ts
// export interface ModuleTab {
//   label: string;
//   icon: string;
//   reportName: string; // matches backend endpoint after /module/
// }

// export interface ModuleConfig {
//   id: string;
//   title: string;
//   icon: string;
//   desc: string;
//   grad: string;
//   accent: string;
//   accentLight: string;
//   chartColors: string[];
//   tabs: ModuleTab[];
// }

// export const MODULES: Record<string, ModuleConfig> = {
//   inventory: {
//     id: "inventory",
//     title: "Inventory Reports",
//     icon: "📦",
//     desc: "Track stock levels, movements, and valuations",
//     grad: "linear-gradient(135deg,#064e3b 0%,#059669 55%,#34d399 100%)",
//     accent: "#059669",
//     accentLight: "#ecfdf5",
//     chartColors: ["#059669", "#34d399", "#6ee7b7"],
//     tabs: [
//       { label: "Stock Summary", icon: "📊", reportName: "stock-summary" },
//       { label: "Low Stock", icon: "⚠️", reportName: "low-stock" },
//       { label: "Valuation", icon: "💎", reportName: "valuation" },
//       { label: "Movement", icon: "🔄", reportName: "movement" },
//     ],
//   },
//   purchase: {
//     id: "purchase",
//     title: "Purchase Reports",
//     icon: "🛒",
//     desc: "Monitor purchase orders and procurement",
//     grad: "linear-gradient(135deg,#1e3a8a 0%,#2563eb 55%,#60a5fa 100%)",
//     accent: "#2563eb",
//     accentLight: "#eff6ff",
//     chartColors: ["#2563eb", "#60a5fa", "#93c5fd"],
//     tabs: [
//       { label: "Purchase Orders", icon: "📋", reportName: "purchase-orders" },
//       { label: "Goods Received", icon: "📥", reportName: "goods-received" },
//       { label: "Summary", icon: "📈", reportName: "summary" },
//     ],
//   },
//   supplier: {
//     id: "supplier",
//     title: "Supplier Reports",
//     icon: "🏢",
//     desc: "Evaluate supplier performance and pricing",
//     grad: "linear-gradient(135deg,#4c1d95 0%,#7c3aed 55%,#c084fc 100%)",
//     accent: "#7c3aed",
//     accentLight: "#f5f3ff",
//     chartColors: ["#7c3aed", "#a78bfa", "#c4b5fd"],
//     tabs: [
//       { label: "Supplier History", icon: "📜", reportName: "supplier-history" },
//       { label: "Performance", icon: "⭐", reportName: "performance" },
//       { label: "Price History", icon: "💲", reportName: "price-history" },
//     ],
//   },
//   financial: {
//     id: "financial",
//     title: "Financial Reports",
//     icon: "💰",
//     desc: "Analyze costs, margins, profitability",
//     grad: "linear-gradient(135deg,#78350f 0%,#d97706 55%,#fbbf24 100%)",
//     accent: "#d97706",
//     accentLight: "#fffbeb",
//     chartColors: ["#d97706", "#f59e0b", "#fbbf24"],
//     tabs: [
//       { label: "Cost Analysis", icon: "🔢", reportName: "cost-analysis" },
//       { label: "Profit & Loss", icon: "📊", reportName: "profit-loss" },
//       { label: "Budget vs Actual", icon: "🎯", reportName: "budget-vs-actual" },
//     ],
//   },
// };


export const CATEGORIES: Category[] = [
  {
    id: "inventory",
    title: "Inventory Reports",
    icon: "📦",
    desc: "Track stock levels, movements, and valuations across all warehouses.",
    grad: "linear-gradient(135deg,#064e3b 0%,#059669 55%,#34d399 100%)",
    gradLight: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
    accent: "#059669",
    accentLight: "#ecfdf5",
    accentBorder: "#6ee7b7",
    accentText: "#065f46",
    glow: "0 8px 32px rgba(5,150,105,0.25)",
    tabs: [
      { label: "Stock Summary", icon: "📊", reportName: "stock-summary" },
      { label: "Low Stock", icon: "⚠️", reportName: "low-stock" },
      { label: "Valuation", icon: "💎", reportName: "valuation" },
      { label: "Movement", icon: "🔄", reportName: "movement" },
    ],
    chartColors: ["#059669", "#34d399", "#6ee7b7"],
  },
  {
    id: "purchase",
    title: "Purchase Reports",
    icon: "🛒",
    desc: "Monitor purchase orders, goods received, and procurement analytics.",
    grad: "linear-gradient(135deg,#1e3a8a 0%,#2563eb 55%,#60a5fa 100%)",
    gradLight: "linear-gradient(135deg,#eff6ff,#dbeafe)",
    accent: "#2563eb",
    accentLight: "#eff6ff",
    accentBorder: "#93c5fd",
    accentText: "#1e40af",
    glow: "0 8px 32px rgba(37,99,235,0.25)",
    tabs: [
      { label: "Purchase Orders", icon: "📋", reportName: "purchase-orders" },
      { label: "Goods Received", icon: "📥", reportName: "goods-received" },
      { label: "Summary", icon: "📈", reportName: "summary" },
    ],
    chartColors: ["#2563eb", "#60a5fa", "#93c5fd"],
  },
  {
    id: "supplier",
    title: "Supplier Reports",
    icon: "🏢",
    desc: "Evaluate supplier performance, pricing history, and reliability metrics.",
    grad: "linear-gradient(135deg,#4c1d95 0%,#7c3aed 55%,#c084fc 100%)",
    gradLight: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
    accent: "#7c3aed",
    accentLight: "#f5f3ff",
    accentBorder: "#c4b5fd",
    accentText: "#4c1d95",
    glow: "0 8px 32px rgba(124,58,237,0.25)",
    tabs: [
      { label: "Supplier History", icon: "📜", reportName: "history" },
      { label: "Performance", icon: "⭐", reportName: "performance" },
      { label: "Price History", icon: "💲", reportName: "price-history" },
    ],
    chartColors: ["#7c3aed", "#a78bfa", "#c4b5fd"],
  },
  {
    id: "financial",
    title: "Financial Reports",
    icon: "💰",
    desc: "Analyze costs, margins, profitability, and financial summaries.",
    grad: "linear-gradient(135deg,#78350f 0%,#d97706 55%,#fbbf24 100%)",
    gradLight: "linear-gradient(135deg,#fffbeb,#fef3c7)",
    accent: "#d97706",
    accentLight: "#fffbeb",
    accentBorder: "#fcd34d",
    accentText: "#78350f",
    glow: "0 8px 32px rgba(217,119,6,0.25)",
    tabs: [
      { label: "Cost Analysis", icon: "🔢" },
      { label: "Profit & Loss", icon: "📊" },
      { label: "Budget vs Actual", icon: "🎯" },
    ],
    chartColors: ["#d97706", "#f59e0b", "#fbbf24"],
  },
];

// src/constants/categories.ts - Update just the QUICK_STATS section

export const QUICK_STATS = [
  { 
    label: "Inventory Value", 
    value: "$2.4M", 
    change: "+8.3%", 
    up: true, 
    icon: "📦", 
    color: "#059669", 
    bg: "linear-gradient(135deg, #059669 0%, #10b981 100%)" // Gradient instead of solid light color
  },
  { 
    label: "Pending POs", 
    value: "63", 
    change: "+3", 
    up: false, 
    icon: "🛒", 
    color: "#2563eb", 
    bg: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)" // Blue gradient
  },
  { 
    label: "Active Suppliers", 
    value: "284", 
    change: "+12", 
    up: true, 
    icon: "🏢", 
    color: "#7c3aed", 
    bg: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)" // Purple gradient
  },
  { 
    label: "Gross Margin", 
    value: "37.1%", 
    change: "+2.3%", 
    up: true, 
    icon: "💰", 
    color: "#d97706", 
    bg: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)" // Amber gradient
  },
  { 
    label: "Low Stock Alerts", 
    value: "142", 
    change: "−18", 
    up: true, 
    icon: "⚠️", 
    color: "#ef4444", 
    bg: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)" // Red gradient
  },
  { 
    label: "On-Time Delivery", 
    value: "94.3%", 
    change: "+2.1%", 
    up: true, 
    icon: "✅", 
    color: "#0891b2", 
    bg: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)" // Cyan gradient
  },
];

export const INFO_STATS = [
  { label: "Total Reports", value: "48", icon: "📊" },
  { label: "Active Alerts", value: "7", icon: "🔔" },
  { label: "Last Synced", value: "2 min ago", icon: "🕐" },
  { label: "Scheduled", value: "12", icon: "📅" },
  { label: "Users Online", value: "8", icon: "👥" },
];