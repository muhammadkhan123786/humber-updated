// data/categories.ts
import { Category, CategoryData } from "../types";

export const CATS: Record<string, Category> = {
  inventory: {
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
      { label: "Stock Summary", icon: "📊" },
      { label: "Low Stock", icon: "⚠️" },
      { label: "Valuation", icon: "💎" },
      { label: "Movement", icon: "🔄" },
    ],
    chartColors: ["#059669", "#34d399", "#6ee7b7"],
  },
  purchase: {
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
      { label: "Purchase Orders", icon: "📋" },
      { label: "Goods Received", icon: "📥" },
      { label: "Purchase Summary", icon: "📈" },
    ],
    chartColors: ["#2563eb", "#60a5fa", "#93c5fd"],
  },
  supplier: {
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
      { label: "Supplier History", icon: "📜" },
      { label: "Performance", icon: "⭐" },
      { label: "Price History", icon: "💲" },
    ],
    chartColors: ["#7c3aed", "#a78bfa", "#c4b5fd"],
  },
 

financial: {
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
    { label: "Inventory Value", icon: "💰" },      // Changed from "Cost Analysis"
    { label: "Purchase Expenses", icon: "📊" },    // Changed from "Profit & Loss"
    { label: "Stock Loss / Adjustment", icon: "📉" }, // Changed from "Budget vs Actual"
  ],
  chartColors: ["#d97706", "#f59e0b", "#fbbf24"],
},
};

// ============ INVENTORY DATA ============
// data/categories.ts - Updated INVENTORY_DATA section

export const INVENTORY_DATA: Record<string, CategoryData> = {
  "Stock Summary": {
    kpis: [
      { label: "Total Products", value: "2,543", change: "+12%", up: true, icon: "📦", sparkline: [40, 55, 48, 70, 62, 85] },
      { label: "Available Stock", value: "48,291", change: "-3%", up: false, icon: "📊", sparkline: [50, 48, 52, 49, 47, 46] },
      { label: "Incoming Stock", value: "12,450", change: "+15%", up: true, icon: "📥", sparkline: [30, 35, 42, 38, 45, 52] },
      { label: "Outgoing Stock", value: "10,234", change: "+8%", up: false, icon: "📤", sparkline: [25, 28, 32, 35, 38, 42] },
      { label: "Total Inventory Value", value: "$842,500", change: "+8.3%", up: true, icon: "💰", sparkline: [50, 55, 58, 62, 65, 70] },
    ],
    chart: [
      { name: "Jan", "Opening Stock": 42500, "Purchased": 12500, "Sold": 11200, "Closing Stock": 43800 },
      { name: "Feb", "Opening Stock": 43800, "Purchased": 14200, "Sold": 12800, "Closing Stock": 45200 },
      { name: "Mar", "Opening Stock": 45200, "Purchased": 13800, "Sold": 12200, "Closing Stock": 46800 },
      { name: "Apr", "Opening Stock": 46800, "Purchased": 16500, "Sold": 15800, "Closing Stock": 47500 },
      { name: "May", "Opening Stock": 47500, "Purchased": 15800, "Sold": 15000, "Closing Stock": 48300 },
      { name: "Jun", "Opening Stock": 48300, "Purchased": 17200, "Sold": 16500, "Closing Stock": 49000 },
    ],
    headers: ["Product Name", "SKU / Product Code", "Category", "Opening Stock", "Purchased Qty", "Sold Qty", "Returned Qty", "Adjustment Qty", "Closing Stock", "Unit Cost", "Stock Value"],
    rows: [
      ["Wireless Mouse", "SKU-001", "Electronics", "350", "200", "100", "5", "0", "455", "$29.99", "$13,645.45"],
      ["Mechanical Keyboard", "SKU-002", "Electronics", "80", "100", "45", "2", "-5", "132", "$89.99", "$11,878.68"],
      ["USB-C Cable", "SKU-003", "Accessories", "1800", "500", "200", "10", "0", "2110", "$12.99", "$27,408.90"],
      ["Laptop Stand", "SKU-004", "Furniture", "60", "0", "15", "0", "0", "45", "$49.99", "$2,249.55"],
      ["Monitor 24\"", "SKU-005", "Electronics", "45", "50", "28", "0", "0", "67", "$199.99", "$13,399.33"],
      ["Desk Mat", "SKU-006", "Accessories", "200", "100", "66", "0", "0", "234", "$24.99", "$5,847.66"],
      ["Webcam HD", "SKU-007", "Electronics", "35", "0", "12", "0", "0", "23", "$79.99", "$1,839.77"],
      ["Noise Cancelling Headphones", "SKU-008", "Audio", "75", "50", "36", "0", "0", "89", "$149.99", "$13,349.11"],
    ],
  },
  "Low Stock": {
    kpis: [
      { label: "Low Stock Items", value: "47", change: "-2", up: true, icon: "⚠️", sparkline: [80, 75, 70, 65, 55, 47] },
      { label: "Critical Stock", value: "12", change: "+2", up: false, icon: "🚨", sparkline: [8, 9, 10, 11, 12, 14] },
      { label: "Out of Stock", value: "8", change: "+3", up: false, icon: "❌", sparkline: [3, 4, 5, 6, 7, 8] },
      { label: "Reorder Required", value: "35", change: "-1", up: true, icon: "🔄", sparkline: [42, 40, 38, 37, 36, 35] },
    ],
    chart: [
      { name: "Electronics", "Low Stock": 15, "Critical": 5 },
      { name: "Furniture", "Low Stock": 8, "Critical": 3 },
      { name: "Accessories", "Low Stock": 12, "Critical": 2 },
      { name: "Audio", "Low Stock": 7, "Critical": 1 },
      { name: "Networking", "Low Stock": 5, "Critical": 1 },
    ],
    headers: ["Product Name", "SKU", "Category", "Current Stock", "Minimum Stock Level", "Reorder Quantity", "Supplier", "Last Purchase Date", "Stock Status"],
    rows: [
      ["Laptop Stand", "SKU-004", "Furniture", "45", "50", "30", "Tech Supplies Co", "2024-01-10", "Critical"],
      ["Webcam HD", "SKU-007", "Electronics", "23", "30", "50", "CamTech Ltd", "2023-12-15", "Low"],
      ["HDMI Cable", "SKU-012", "Accessories", "78", "100", "200", "CableMaster", "2024-01-05", "Low"],
      ["Wireless Adapter", "SKU-018", "Networking", "15", "25", "40", "NetGear", "2023-12-20", "Critical"],
      ["USB Hub", "SKU-024", "Accessories", "32", "50", "60", "Tech Supplies Co", "2024-01-08", "Low"],
    ],
  },
  Valuation: {
    kpis: [
      { label: "Total Inventory Value", value: "$842,500", change: "+8.3%", up: true, icon: "💰", sparkline: [50, 55, 58, 62, 65, 70] },
      { label: "Average Product Cost", value: "$87.32", change: "+3.2%", up: true, icon: "📊", sparkline: [45, 48, 52, 55, 58, 62] },
      { label: "Highest Value Product", value: "Gaming Laptop", change: "$32,500", up: true, icon: "👑", sparkline: [40, 45, 50, 55, 58, 62] },
      { label: "Lowest Value Product", value: "USB Cable", change: "$12.99", up: false, icon: "⭐", sparkline: [30, 28, 26, 25, 24, 23] },
    ],
    chart: [
      { name: "Electronics", "Value": 425000 },
      { name: "Furniture", "Value": 125000 },
      { name: "Accessories", "Value": 185000 },
      { name: "Audio", "Value": 72500 },
      { name: "Networking", "Value": 35000 },
    ],
    headers: ["Product Name", "SKU", "Category", "Quantity On Hand", "Unit Cost", "Inventory Value", "Last Purchase Cost", "Average Cost", "Total Purchase Value"],
    rows: [
      ["Gaming Laptop", "SKU-050", "Electronics", "25", "$1,299.99", "$32,499.75", "$1,299.99", "$1,275.50", "$63,775.00"],
      ["Wireless Mouse", "SKU-001", "Electronics", "455", "$29.99", "$13,645.45", "$29.99", "$28.50", "$12,967.50"],
      ["Mechanical Keyboard", "SKU-002", "Electronics", "132", "$89.99", "$11,878.68", "$89.99", "$85.00", "$11,220.00"],
      ["Monitor 24\"", "SKU-005", "Electronics", "67", "$199.99", "$13,399.33", "$199.99", "$195.00", "$13,065.00"],
      ["USB-C Cable", "SKU-003", "Accessories", "2110", "$12.99", "$27,408.90", "$12.99", "$12.50", "$26,375.00"],
    ],
  },
  Movement: {
    kpis: [
      { label: "Total Movements", value: "2,847", change: "+18%", up: true, icon: "🔄", sparkline: [40, 45, 48, 52, 55, 60] },
      { label: "Total Stock In", value: "12,450", change: "+15%", up: true, icon: "📥", sparkline: [30, 35, 42, 38, 45, 52] },
      { label: "Total Stock Out", value: "10,234", change: "+8%", up: false, icon: "📤", sparkline: [25, 28, 32, 35, 38, 42] },
      { label: "Adjustments", value: "156", change: "-5%", up: true, icon: "⚙️", sparkline: [20, 22, 18, 15, 12, 10] },
    ],
    chart: [
      { name: "Jan", "Stock In": 12500, "Stock Out": 11200 },
      { name: "Feb", "Stock In": 14200, "Stock Out": 12800 },
      { name: "Mar", "Stock In": 13800, "Stock Out": 12200 },
      { name: "Apr", "Stock In": 16500, "Stock Out": 15800 },
      { name: "May", "Stock In": 15800, "Stock Out": 15000 },
      { name: "Jun", "Stock In": 17200, "Stock Out": 16500 },
    ],
    headers: ["Date", "Product Name", "SKU", "Movement Type", "Reference", "Opening Qty", "Quantity In", "Quantity Out", "Closing Qty", "Warehouse", "Performed By"],
    rows: [
      ["2024-01-15", "Wireless Mouse", "SKU-001", "Purchase", "PO-2024-001", "350", "200", "0", "550", "Main Warehouse", "John Smith"],
      ["2024-01-15", "Wireless Mouse", "SKU-001", "Sale", "SO-2024-089", "550", "0", "100", "450", "Main Warehouse", "Sarah Johnson"],
      ["2024-01-15", "USB-C Cable", "SKU-003", "Sale", "SO-2024-089", "2100", "0", "45", "2055", "Main Warehouse", "Sarah Johnson"],
      ["2024-01-14", "Mechanical Keyboard", "SKU-002", "Purchase", "PO-2024-002", "80", "100", "0", "180", "East Warehouse", "Mike Brown"],
      ["2024-01-14", "Mechanical Keyboard", "SKU-002", "Sale", "SO-2024-076", "180", "0", "45", "135", "East Warehouse", "Lisa Wong"],
      ["2024-01-14", "Monitor 24\"", "SKU-005", "Purchase", "PO-2024-003", "45", "50", "0", "95", "Main Warehouse", "John Smith"],
      ["2024-01-13", "Laptop Stand", "SKU-004", "Sale", "SO-2024-062", "60", "0", "15", "45", "Main Warehouse", "Sarah Johnson"],
      ["2024-01-13", "Webcam HD", "SKU-007", "Sale", "SO-2024-058", "35", "0", "12", "23", "Main Warehouse", "Lisa Wong"],
    ],
  },
};





// ============ PURCHASE DATA ============
// data/categories.ts - Updated PURCHASE_DATA section

export const PURCHASE_DATA: Record<string, CategoryData> = {
  "Purchase Orders": {
    kpis: [
      { label: "Total Purchase Orders", value: "1,247", change: "+18%", up: true, icon: "📋", sparkline: [55, 65, 58, 72, 68, 88] },
      { label: "Pending Purchase Orders", value: "63", change: "+3", up: false, icon: "⏳", sparkline: [40, 52, 45, 60, 55, 70] },
      { label: "Completed Purchase Orders", value: "1,124", change: "+15%", up: true, icon: "✅", sparkline: [50, 58, 62, 70, 68, 82] },
      { label: "Cancelled Purchase Orders", value: "60", change: "-2", up: true, icon: "❌", sparkline: [20, 25, 22, 28, 24, 22] },
      { label: "Total Purchase Value", value: "$5.8M", change: "+14.2%", up: true, icon: "💰", sparkline: [60, 68, 62, 78, 74, 92] },
    ],
    chart: [
      { name: "Jan", "Orders": 180, "Received": 165, "Pending": 15 },
      { name: "Feb", "Orders": 210, "Received": 195, "Pending": 15 },
      { name: "Mar", "Orders": 195, "Received": 180, "Pending": 15 },
      { name: "Apr", "Orders": 230, "Received": 218, "Pending": 12 },
      { name: "May", "Orders": 215, "Received": 200, "Pending": 15 },
      { name: "Jun", "Orders": 247, "Received": 230, "Pending": 17 },
    ],
    headers: ["PO Number", "Order Date", "Supplier Name", "Total Items", "Total Quantity", "Total Amount", "Received Quantity", "Pending Quantity", "Status", "Created By"],
    rows: [
      ["PO-2024-001", "2024-06-01", "TechDistributors Inc.", "15", "450", "$124,500", "450", "0", "Completed", "John Smith"],
      ["PO-2024-002", "2024-06-03", "Office Supplies Co.", "8", "320", "$18,200", "200", "120", "Partial", "Sarah Johnson"],
      ["PO-2024-003", "2024-06-05", "Furniture World Ltd.", "22", "180", "$67,800", "0", "180", "Pending", "Mike Brown"],
      ["PO-2024-004", "2024-06-07", "Electronics Hub", "45", "890", "$345,600", "890", "0", "Completed", "Lisa Wong"],
      ["PO-2024-005", "2024-06-10", "Global Parts LLC", "12", "240", "$89,100", "120", "120", "Partial", "John Smith"],
      ["PO-2024-006", "2024-06-12", "Prime Logistics", "6", "180", "$32,400", "0", "180", "Pending", "Sarah Johnson"],
      ["PO-2024-007", "2024-06-14", "TechDistributors Inc.", "28", "560", "$218,900", "0", "560", "Approved", "Mike Brown"],
      ["PO-2024-008", "2024-06-16", "Office Supplies Co.", "14", "420", "$42,600", "0", "420", "Pending", "Lisa Wong"],
      ["PO-2024-009", "2024-06-18", "Electronics Hub", "32", "640", "$276,800", "640", "0", "Completed", "John Smith"],
      ["PO-2024-010", "2024-06-20", "Furniture World Ltd.", "18", "210", "$94,500", "0", "210", "Approved", "Sarah Johnson"],
      ["PO-2024-011", "2024-06-22", "Global Parts LLC", "9", "360", "$156,200", "360", "0", "Completed", "Mike Brown"],
      ["PO-2024-012", "2024-06-24", "Prime Logistics", "5", "250", "$28,500", "250", "0", "Completed", "Lisa Wong"],
    ],
  },
  "Goods Received": {
    kpis: [
      { label: "Total GRNs", value: "1,124", change: "+15%", up: true, icon: "📥", sparkline: [50, 58, 62, 70, 68, 82] },
      { label: "Total Items Received", value: "24,850", change: "+12%", up: true, icon: "📦", sparkline: [45, 52, 58, 65, 62, 78] },
      { label: "Total Purchase Value Received", value: "$5.2M", change: "+13.5%", up: true, icon: "💰", sparkline: [55, 60, 58, 72, 68, 85] },
      { label: "Pending Deliveries", value: "123", change: "+8", up: false, icon: "⏳", sparkline: [40, 45, 52, 58, 55, 60] },
    ],
    chart: [
      { name: "Jan", "Received": 12500, "Pending": 3200 },
      { name: "Feb", "Received": 14200, "Pending": 2800 },
      { name: "Mar", "Received": 13800, "Pending": 3500 },
      { name: "Apr", "Received": 16500, "Pending": 2200 },
      { name: "May", "Received": 15800, "Pending": 3100 },
      { name: "Jun", "Received": 17200, "Pending": 2800 },
    ],
    headers: ["GRN Number", "GRN Date", "PO Number", "Supplier Name", "Product Name", "SKU", "Ordered Quantity", "Received Quantity", "Remaining Quantity", "Unit Cost", "Total Cost", "Warehouse", "Received By"],
    rows: [
      ["GRN-2024-001", "2024-06-02", "PO-2024-001", "TechDistributors Inc.", "Dell XPS Laptop", "SKU-001", "450", "450", "0", "$276.67", "$124,500", "Main Warehouse", "John Smith"],
      ["GRN-2024-002", "2024-06-04", "PO-2024-002", "Office Supplies Co.", "Printer Paper", "SKU-015", "320", "200", "120", "$56.25", "$11,250", "East Warehouse", "Sarah Johnson"],
      ["GRN-2024-003", "2024-06-06", "PO-2024-002", "Office Supplies Co.", "Pens Box", "SKU-016", "500", "500", "0", "$2.50", "$1,250", "East Warehouse", "Sarah Johnson"],
      ["GRN-2024-004", "2024-06-08", "PO-2024-004", "Electronics Hub", "Monitor 27\"", "SKU-005", "890", "890", "0", "$388.20", "$345,500", "Main Warehouse", "Lisa Wong"],
      ["GRN-2024-005", "2024-06-11", "PO-2024-005", "Global Parts LLC", "Circuit Boards", "SKU-028", "240", "120", "120", "$371.25", "$44,550", "West Warehouse", "Mike Brown"],
      ["GRN-2024-006", "2024-06-13", "PO-2024-005", "Global Parts LLC", "Resistors Pack", "SKU-029", "1000", "1000", "0", "$0.85", "$850", "West Warehouse", "Mike Brown"],
      ["GRN-2024-007", "2024-06-15", "PO-2024-006", "Prime Logistics", "Shipping Boxes", "SKU-045", "500", "500", "0", "$12.50", "$6,250", "Main Warehouse", "Sarah Johnson"],
      ["GRN-2024-008", "2024-06-19", "PO-2024-009", "Electronics Hub", "Gaming Laptop", "SKU-050", "640", "640", "0", "$432.50", "$276,800", "Main Warehouse", "John Smith"],
      ["GRN-2024-009", "2024-06-21", "PO-2024-011", "Global Parts LLC", "Power Supplies", "SKU-035", "360", "360", "0", "$433.89", "$156,200", "West Warehouse", "Mike Brown"],
      ["GRN-2024-010", "2024-06-23", "PO-2024-012", "Prime Logistics", "Packing Tape", "SKU-046", "1000", "1000", "0", "$4.50", "$4,500", "Main Warehouse", "Lisa Wong"],
      ["GRN-2024-011", "2024-06-25", "PO-2024-003", "Furniture World Ltd.", "Ergonomic Chair", "SKU-003", "60", "0", "60", "$466.67", "$0", "Main Warehouse", "Pending"],
      ["GRN-2024-012", "2024-06-26", "PO-2024-007", "TechDistributors Inc.", "Wireless Mouse", "SKU-001", "560", "0", "560", "$390.89", "$0", "Main Warehouse", "Pending"],
    ],
  },
  "Summary": {
    kpis: [
      { label: "Total Purchase Amount", value: "$5.8M", change: "+14.2%", up: true, icon: "💰", sparkline: [60, 68, 62, 78, 74, 92] },
      { label: "Total Purchase Orders", value: "1,247", change: "+18%", up: true, icon: "📋", sparkline: [55, 65, 58, 72, 68, 88] },
      { label: "Average Purchase Value", value: "$4,651", change: "-2.3%", up: false, icon: "📊", sparkline: [55, 58, 52, 48, 45, 42] },
      { label: "Top Supplier", value: "Electronics Hub", change: "$2.1M", up: true, icon: "🏆", sparkline: [40, 55, 60, 70, 75, 85] },
      { label: "Total Products Purchased", value: "28,450", change: "+11.8%", up: true, icon: "📦", sparkline: [45, 52, 58, 62, 65, 70] },
    ],
    chart: [
      { name: "Electronics", "Amount": 2100 },
      { name: "Furniture", "Amount": 890 },
      { name: "Office", "Amount": 320 },
      { name: "Industrial", "Amount": 1400 },
      { name: "Components", "Amount": 560 },
      { name: "Logistics", "Amount": 280 },
    ],
    headers: ["Supplier Name", "Total Orders", "Total Quantity Purchased", "Total Purchase Amount", "Average Order Value", "Last Purchase Date", "Top Product Purchased"],
    rows: [
      ["Electronics Hub", "198", "8,450", "$2.1M", "$10,606", "2024-06-18", "Gaming Laptop"],
      ["TechDistributors Inc.", "142", "5,620", "$1.2M", "$8,451", "2024-06-14", "Dell XPS Laptop"],
      ["Furniture World Ltd.", "64", "2,850", "$890K", "$13,906", "2024-06-05", "Ergonomic Chair"],
      ["Prime Logistics", "312", "5,240", "$780K", "$2,500", "2024-06-12", "Shipping Boxes"],
      ["Global Parts LLC", "45", "1,890", "$560K", "$12,444", "2024-06-10", "Circuit Boards"],
      ["Office Supplies Co.", "89", "3,240", "$320K", "$3,596", "2024-06-16", "Printer Paper"],
      ["Acme Manufacturing", "78", "4,160", "$1.4M", "$17,949", "2024-06-08", "Industrial Parts"],
    ],
  },
};



// data/categories.ts - Updated SUPPLIER_DATA and FINANCIAL_DATA sections

// ============ SUPPLIER DATA ============
export const SUPPLIER_DATA: Record<string, CategoryData> = {
  "Supplier History": {
    kpis: [
      { label: "Total Suppliers", value: "284", change: "+12", up: true, icon: "🏢", sparkline: [60, 65, 68, 72, 75, 82] },
      { label: "Total Purchases", value: "1,247", change: "+18%", up: true, icon: "📋", sparkline: [55, 65, 58, 72, 68, 88] },
      { label: "Total Purchase Value", value: "$5.8M", change: "+14.2%", up: true, icon: "💰", sparkline: [60, 68, 62, 78, 74, 92] },
      { label: "Total Goods Received", value: "24,850", change: "+12%", up: true, icon: "📦", sparkline: [45, 52, 58, 65, 62, 78] },
      { label: "Total Returns to Suppliers", value: "1,245", change: "-5%", up: true, icon: "🔄", sparkline: [30, 28, 25, 22, 20, 18] },
    ],
    chart: [
      { name: "TechDist", "Orders": 142, "Received": 138, "Returns": 4 },
      { name: "OfficeSupply", "Orders": 89, "Received": 76, "Returns": 13 },
      { name: "FurniWorld", "Orders": 64, "Received": 58, "Returns": 6 },
      { name: "ElecHub", "Orders": 198, "Received": 192, "Returns": 6 },
      { name: "GlobalParts", "Orders": 45, "Received": 38, "Returns": 7 },
    ],
    headers: ["Supplier Name", "PO Number", "GRN Number", "Product Name", "SKU", "Ordered Quantity", "Received Quantity", "Returned Quantity", "Unit Cost", "Total Amount", "Order Date", "Delivery Date"],
    rows: [
      ["TechDistributors Inc.", "PO-2024-001", "GRN-2024-001", "Dell XPS Laptop", "SKU-001", "450", "450", "0", "$276.67", "$124,500", "2024-06-01", "2024-06-02"],
      ["TechDistributors Inc.", "PO-2024-007", "GRN-2024-012", "Wireless Mouse", "SKU-002", "560", "0", "0", "$390.89", "$218,900", "2024-06-14", "Pending"],
      ["Office Supplies Co.", "PO-2024-002", "GRN-2024-002", "Printer Paper", "SKU-015", "320", "200", "0", "$56.25", "$11,250", "2024-06-03", "2024-06-04"],
      ["Office Supplies Co.", "PO-2024-008", "GRN-2024-011", "Pens Box", "SKU-016", "420", "0", "0", "$101.43", "$42,600", "2024-06-16", "Pending"],
      ["Electronics Hub", "PO-2024-004", "GRN-2024-004", "Monitor 27\"", "SKU-005", "890", "890", "0", "$388.20", "$345,500", "2024-06-07", "2024-06-08"],
      ["Electronics Hub", "PO-2024-009", "GRN-2024-008", "Gaming Laptop", "SKU-050", "640", "640", "0", "$432.50", "$276,800", "2024-06-18", "2024-06-19"],
      ["Furniture World Ltd.", "PO-2024-003", "GRN-2024-011", "Ergonomic Chair", "SKU-003", "180", "0", "0", "$376.67", "$67,800", "2024-06-05", "Pending"],
      ["Furniture World Ltd.", "PO-2024-010", "GRN-2024-013", "Standing Desk", "SKU-004", "210", "0", "0", "$450.00", "$94,500", "2024-06-20", "Pending"],
      ["Global Parts LLC", "PO-2024-005", "GRN-2024-005", "Circuit Boards", "SKU-028", "240", "120", "15", "$371.25", "$44,550", "2024-06-10", "2024-06-11"],
      ["Global Parts LLC", "PO-2024-011", "GRN-2024-009", "Power Supplies", "SKU-035", "360", "360", "0", "$433.89", "$156,200", "2024-06-22", "2024-06-23"],
      ["Prime Logistics", "PO-2024-006", "GRN-2024-007", "Shipping Boxes", "SKU-045", "180", "180", "0", "$180.00", "$32,400", "2024-06-12", "2024-06-15"],
      ["Prime Logistics", "PO-2024-012", "GRN-2024-010", "Packing Tape", "SKU-046", "250", "250", "0", "$114.00", "$28,500", "2024-06-24", "2024-06-25"],
    ],
  },
  "Performance": {
    kpis: [
      { label: "Total Active Suppliers", value: "284", change: "+12", up: true, icon: "🏢", sparkline: [60, 65, 68, 72, 75, 82] },
      { label: "On-Time Deliveries", value: "1,124", change: "+15%", up: true, icon: "✅", sparkline: [50, 58, 62, 70, 68, 82] },
      { label: "Late Deliveries", value: "123", change: "+8", up: false, icon: "⚠️", sparkline: [40, 45, 52, 58, 55, 60] },
      { label: "Average Delivery Time", value: "4.8d", change: "-0.6d", up: true, icon: "⚡", sparkline: [80, 72, 68, 62, 58, 52] },
      { label: "Supplier Rating Score", value: "4.6/5", change: "+0.2", up: true, icon: "⭐", sparkline: [65, 68, 72, 76, 80, 84] },
    ],
    chart: [
      { name: "TechDist", "On-Time": 98, "Late": 2 },
      { name: "OfficeSupply", "On-Time": 85, "Late": 15 },
      { name: "FurniWorld", "On-Time": 92, "Late": 8 },
      { name: "ElecHub", "On-Time": 96, "Late": 4 },
      { name: "GlobalParts", "On-Time": 75, "Late": 25 },
      { name: "PrimeLogi", "On-Time": 98, "Late": 2 },
    ],
    headers: ["Supplier Name", "Total Orders", "Total Delivered", "Late Deliveries", "On-Time Deliveries", "Average Delivery Days", "Total Purchase Value", "Returned Items", "Supplier Rating"],
    rows: [
      ["Electronics Hub", "198", "192", "6", "192", "3.2d", "$2.1M", "18", "4.9/5"],
      ["TechDistributors Inc.", "142", "138", "4", "138", "3.5d", "$1.2M", "12", "4.8/5"],
      ["Prime Logistics", "312", "305", "7", "305", "2.8d", "$780K", "8", "4.7/5"],
      ["Furniture World Ltd.", "64", "58", "6", "58", "5.8d", "$890K", "24", "4.2/5"],
      ["Office Supplies Co.", "89", "76", "13", "76", "6.2d", "$320K", "32", "3.9/5"],
      ["Global Parts LLC", "45", "38", "7", "38", "7.5d", "$560K", "28", "3.7/5"],
    ],
  },
  "Price History": {
    kpis: [
      { label: "Total Products Tracked", value: "2,543", change: "+18%", up: true, icon: "📦", sparkline: [55, 65, 58, 72, 68, 88] },
      { label: "Average Purchase Price", value: "$187", change: "+3.2%", up: false, icon: "💰", sparkline: [55, 58, 60, 62, 65, 70] },
      { label: "Highest Price Paid", value: "$1,299", change: "+2%", up: false, icon: "📈", sparkline: [50, 52, 55, 54, 56, 58] },
      { label: "Lowest Price Paid", value: "$12.99", change: "-5%", up: true, icon: "📉", sparkline: [60, 58, 55, 52, 50, 48] },
      { label: "Price Change %", value: "+3.2%", change: "+0.5%", up: false, icon: "🔄", sparkline: [45, 48, 52, 55, 58, 62] },
    ],
    chart: [
      { name: "Jan", "Laptop": 1250, "Monitor": 450, "Keyboard": 89, "Mouse": 35 },
      { name: "Feb", "Laptop": 1240, "Monitor": 445, "Keyboard": 87, "Mouse": 34 },
      { name: "Mar", "Laptop": 1220, "Monitor": 435, "Keyboard": 85, "Mouse": 33 },
      { name: "Apr", "Laptop": 1200, "Monitor": 425, "Keyboard": 84, "Mouse": 32 },
      { name: "May", "Laptop": 1190, "Monitor": 420, "Keyboard": 83, "Mouse": 31 },
      { name: "Jun", "Laptop": 1180, "Monitor": 415, "Keyboard": 82, "Mouse": 30 },
    ],
    headers: ["Product Name", "SKU", "Supplier", "Purchase Date", "Previous Price", "Current Price", "Price Difference", "Purchase Quantity", "PO Number"],
    rows: [
      ["Gaming Laptop", "SKU-050", "Electronics Hub", "2024-06-18", "$1,299", "$1,199", "-$100 (-7.7%)", "640", "PO-2024-009"],
      ["Dell XPS Laptop", "SKU-001", "TechDistributors Inc.", "2024-06-01", "$1,099", "$1,049", "-$50 (-4.5%)", "450", "PO-2024-001"],
      ["Monitor 27\"", "SKU-005", "Electronics Hub", "2024-06-07", "$399", "$389", "-$10 (-2.5%)", "890", "PO-2024-004"],
      ["Wireless Mouse", "SKU-002", "TechDistributors Inc.", "2024-06-14", "$29.99", "$28.99", "-$1.00 (-3.3%)", "560", "PO-2024-007"],
      ["Mechanical Keyboard", "SKU-003", "Electronics Hub", "2024-06-18", "$89.99", "$84.99", "-$5.00 (-5.6%)", "320", "PO-2024-009"],
      ["Printer Paper", "SKU-015", "Office Supplies Co.", "2024-06-03", "$56.25", "$54.50", "-$1.75 (-3.1%)", "200", "PO-2024-002"],
      ["Ergonomic Chair", "SKU-020", "Furniture World Ltd.", "2024-06-05", "$467", "$445", "-$22 (-4.7%)", "180", "PO-2024-003"],
      ["USB-C Cable", "SKU-008", "Global Parts LLC", "2024-06-10", "$12.99", "$11.99", "-$1.00 (-7.7%)", "240", "PO-2024-005"],
    ],
  },
};

// ============ FINANCIAL DATA ============
// data/categories.ts - Update FINANCIAL_DATA keys to match tabs

// export const FINANCIAL_DATA: Record<string, CategoryData> = {
//   "Cost Analysis": {  // This will show as "Cost Analysis" tab but with Inventory Value data
//     kpis: [
//       { label: "Total Inventory Value", value: "$842,500", change: "+8.3%", up: true, icon: "💰", sparkline: [50, 60, 55, 75, 70, 88] },
//       { label: "Total Products in Stock", value: "2,543", change: "+12%", up: true, icon: "📦", sparkline: [40, 55, 48, 70, 62, 85] },
//       { label: "Average Product Cost", value: "$87.32", change: "+3.2%", up: false, icon: "📊", sparkline: [55, 58, 60, 62, 65, 70] },
//       { label: "Highest Value Product", value: "Gaming Laptop", change: "$32,500", up: true, icon: "👑", sparkline: [40, 45, 50, 55, 58, 62] },
//     ],
//     chart: [
//       { name: "Electronics", "Value": 425000 },
//       { name: "Furniture", "Value": 125000 },
//       { name: "Accessories", "Value": 185000 },
//       { name: "Audio", "Value": 72500 },
//       { name: "Networking", "Value": 35000 },
//     ],
//     headers: ["Product Name", "SKU", "Category", "Current Stock", "Unit Cost", "Stock Value", "Warehouse"],
//     rows: [
//       ["Gaming Laptop", "SKU-050", "Electronics", "25", "$1,299.99", "$32,499.75", "Main Warehouse"],
//       ["Dell XPS Laptop", "SKU-001", "Electronics", "245", "$1,049.00", "$257,005.00", "Main Warehouse"],
//       ["Monitor 27\"", "SKU-005", "Electronics", "389", "$389.00", "$151,321.00", "Main Warehouse"],
//       ["Wireless Mouse", "SKU-002", "Electronics", "1,820", "$28.99", "$52,761.80", "East Warehouse"],
//       ["Mechanical Keyboard", "SKU-003", "Accessories", "132", "$84.99", "$11,218.68", "East Warehouse"],
//       ["USB-C Cable", "SKU-008", "Accessories", "2,110", "$11.99", "$25,298.90", "West Warehouse"],
//       ["Ergonomic Chair", "SKU-020", "Furniture", "56", "$445.00", "$24,920.00", "Main Warehouse"],
//       ["Standing Desk", "SKU-004", "Furniture", "45", "$450.00", "$20,250.00", "Main Warehouse"],
//       ["Printer Paper", "SKU-015", "Stationery", "200", "$54.50", "$10,900.00", "East Warehouse"],
//     ],
//   },
//   "Profit & Loss": {  // This will show as "Profit & Loss" tab but with Purchase Expenses data
//     kpis: [
//       { label: "Total Purchase Cost", value: "$5.8M", change: "+14.2%", up: false, icon: "💰", sparkline: [60, 68, 62, 78, 74, 92] },
//       { label: "Total Purchase Orders", value: "1,247", change: "+18%", up: false, icon: "📋", sparkline: [55, 65, 58, 72, 68, 88] },
//       { label: "Average Purchase Value", value: "$4,651", change: "-2.3%", up: true, icon: "📊", sparkline: [55, 58, 52, 48, 45, 42] },
//       { label: "Highest Purchase Month", value: "April", change: "$2.35M", up: false, icon: "📈", sparkline: [40, 55, 60, 70, 75, 85] },
//     ],
//     chart: [
//       { name: "Jan", "Amount": 1800 },
//       { name: "Feb", "Amount": 1950 },
//       { name: "Mar", "Amount": 2100 },
//       { name: "Apr", "Amount": 2350 },
//       { name: "May", "Amount": 2180 },
//       { name: "Jun", "Amount": 2020 },
//     ],
//     headers: ["Purchase Date", "PO Number", "Supplier", "Product", "Quantity", "Unit Cost", "Total Cost", "Warehouse"],
//     rows: [
//       ["2024-06-01", "PO-2024-001", "TechDistributors Inc.", "Dell XPS Laptop", "450", "$276.67", "$124,500", "Main Warehouse"],
//       ["2024-06-03", "PO-2024-002", "Office Supplies Co.", "Printer Paper", "320", "$56.25", "$18,000", "East Warehouse"],
//       ["2024-06-05", "PO-2024-003", "Furniture World Ltd.", "Ergonomic Chair", "180", "$376.67", "$67,800", "Main Warehouse"],
//       ["2024-06-07", "PO-2024-004", "Electronics Hub", "Monitor 27\"", "890", "$388.20", "$345,500", "Main Warehouse"],
//       ["2024-06-10", "PO-2024-005", "Global Parts LLC", "Circuit Boards", "240", "$371.25", "$89,100", "West Warehouse"],
//       ["2024-06-12", "PO-2024-006", "Prime Logistics", "Shipping Boxes", "180", "$180.00", "$32,400", "Main Warehouse"],
//       ["2024-06-14", "PO-2024-007", "TechDistributors Inc.", "Wireless Mouse", "560", "$390.89", "$218,900", "East Warehouse"],
//       ["2024-06-16", "PO-2024-008", "Office Supplies Co.", "Pens Box", "420", "$101.43", "$42,600", "East Warehouse"],
//       ["2024-06-18", "PO-2024-009", "Electronics Hub", "Gaming Laptop", "640", "$432.50", "$276,800", "Main Warehouse"],
//       ["2024-06-20", "PO-2024-010", "Furniture World Ltd.", "Standing Desk", "210", "$450.00", "$94,500", "Main Warehouse"],
//       ["2024-06-22", "PO-2024-011", "Global Parts LLC", "Power Supplies", "360", "$433.89", "$156,200", "West Warehouse"],
//       ["2024-06-24", "PO-2024-012", "Prime Logistics", "Packing Tape", "250", "$114.00", "$28,500", "Main Warehouse"],
//     ],
//   },
//   "Budget vs Actual": {  // This will show as "Budget vs Actual" tab but with Stock Loss data
//     kpis: [
//       { label: "Total Adjustments", value: "156", change: "-5%", up: true, icon: "🔄", sparkline: [20, 22, 18, 15, 12, 10] },
//       { label: "Total Lost Stock", value: "2,450", change: "-12%", up: true, icon: "⚠️", sparkline: [30, 28, 25, 22, 20, 18] },
//       { label: "Adjustment Value", value: "$24,500", change: "-8%", up: true, icon: "💰", sparkline: [25, 24, 22, 20, 18, 16] },
//       { label: "Most Adjusted Product", value: "USB-C Cable", change: "24 adjustments", up: false, icon: "📦", sparkline: [15, 18, 20, 22, 24, 26] },
//     ],
//     chart: [
//       { name: "Jan", "Loss": 450, "Damage": 320, "Correction": 180 },
//       { name: "Feb", "Loss": 380, "Damage": 290, "Correction": 150 },
//       { name: "Mar", "Loss": 520, "Damage": 380, "Correction": 200 },
//       { name: "Apr", "Loss": 310, "Damage": 260, "Correction": 120 },
//       { name: "May", "Loss": 280, "Damage": 240, "Correction": 100 },
//       { name: "Jun", "Loss": 250, "Damage": 210, "Correction": 90 },
//     ],
//     headers: ["Adjustment ID", "Date", "Product", "SKU", "Adjustment Type", "Quantity Changed", "Previous Stock", "New Stock", "Reason", "Adjusted By"],
//     rows: [
//       ["ADJ-001", "2024-06-15", "USB-C Cable", "SKU-008", "Damage", "-50", "2,110", "2,060", "Damaged in transit", "John Smith"],
//       ["ADJ-002", "2024-06-14", "Wireless Mouse", "SKU-002", "Correction", "+25", "1,820", "1,845", "Inventory count correction", "Sarah Johnson"],
//       ["ADJ-003", "2024-06-12", "Ergonomic Chair", "SKU-020", "Loss", "-5", "56", "51", "Missing during audit", "Mike Brown"],
//       ["ADJ-004", "2024-06-10", "Monitor 27\"", "SKU-005", "Damage", "-8", "389", "381", "Screen cracked", "Lisa Wong"],
//       ["ADJ-005", "2024-06-08", "Printer Paper", "SKU-015", "Loss", "-20", "200", "180", "Water damage", "John Smith"],
//       ["ADJ-006", "2024-06-05", "Mechanical Keyboard", "SKU-003", "Correction", "-12", "132", "120", "Return to supplier", "Sarah Johnson"],
//       ["ADJ-007", "2024-06-03", "Gaming Laptop", "SKU-050", "Damage", "-2", "25", "23", "Physical damage", "Mike Brown"],
//       ["ADJ-008", "2024-06-01", "Standing Desk", "SKU-004", "Correction", "+10", "45", "55", "Found in warehouse B", "Lisa Wong"],
//     ],
//   },
// };