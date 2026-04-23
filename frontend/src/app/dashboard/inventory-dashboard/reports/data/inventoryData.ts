// // src/data/inventoryData.ts

// import { InventoryItem, StockMovement, ValuationSummary } from '../types/inventory';
// import { CategoryData } from '../types';

// // Comprehensive Inventory Items Data
// export const inventoryItems: InventoryItem[] = [
//   { id: '1', sku: 'SKU-001', productName: 'Dell XPS 13 Laptop', category: 'Electronics', warehouse: 'Main Warehouse', quantity: 245, reorderLevel: 50, unitPrice: 1500, totalValue: 367500, status: 'In Stock', lastUpdated: '2024-06-15', supplier: 'TechDistributors Inc.' },
//   { id: '2', sku: 'SKU-002', productName: 'Wireless Headset Pro', category: 'Electronics', warehouse: 'Main Warehouse', quantity: 1820, reorderLevel: 200, unitPrice: 100, totalValue: 182000, status: 'In Stock', lastUpdated: '2024-06-14', supplier: 'Electronics Hub' },
//   { id: '3', sku: 'SKU-003', productName: 'Ergonomic Chair', category: 'Furniture', warehouse: 'East Warehouse', quantity: 56, reorderLevel: 60, unitPrice: 500, totalValue: 28000, status: 'Low Stock', lastUpdated: '2024-06-13', supplier: 'Furniture World Ltd.' },
//   { id: '4', sku: 'SKU-004', productName: 'Standing Desk 60"', category: 'Furniture', warehouse: 'East Warehouse', quantity: 0, reorderLevel: 30, unitPrice: 450, totalValue: 0, status: 'Out of Stock', lastUpdated: '2024-06-10', supplier: 'Furniture World Ltd.' },
//   { id: '5', sku: 'SKU-005', productName: 'Monitor 27" 4K', category: 'Electronics', warehouse: 'Main Warehouse', quantity: 389, reorderLevel: 80, unitPrice: 800, totalValue: 311200, status: 'In Stock', lastUpdated: '2024-06-15', supplier: 'TechDistributors Inc.' },
//   { id: '6', sku: 'SKU-006', productName: 'Mechanical Keyboard', category: 'Accessories', warehouse: 'West Warehouse', quantity: 12, reorderLevel: 25, unitPrice: 150, totalValue: 1800, status: 'Low Stock', lastUpdated: '2024-06-12', supplier: 'Office Supplies Co.' },
//   { id: '7', sku: 'SKU-007', productName: 'USB-C Hub 7-in-1', category: 'Accessories', warehouse: 'West Warehouse', quantity: 640, reorderLevel: 100, unitPrice: 60, totalValue: 38400, status: 'In Stock', lastUpdated: '2024-06-14', supplier: 'Electronics Hub' },
//   { id: '8', sku: 'SKU-008', productName: 'Webcam 4K UHD', category: 'Electronics', warehouse: 'Main Warehouse', quantity: 0, reorderLevel: 40, unitPrice: 200, totalValue: 0, status: 'Out of Stock', lastUpdated: '2024-06-09', supplier: 'TechDistributors Inc.' },
//   { id: '9', sku: 'SKU-009', productName: 'Laptop Stand Aluminium', category: 'Accessories', warehouse: 'West Warehouse', quantity: 230, reorderLevel: 50, unitPrice: 75, totalValue: 17250, status: 'In Stock', lastUpdated: '2024-06-13', supplier: 'Office Supplies Co.' },
//   { id: '10', sku: 'SKU-010', productName: 'Bluetooth Mouse', category: 'Accessories', warehouse: 'West Warehouse', quantity: 8, reorderLevel: 20, unitPrice: 120, totalValue: 960, status: 'Low Stock', lastUpdated: '2024-06-11', supplier: 'Electronics Hub' },
//   { id: '11', sku: 'SKU-011', productName: 'Gaming Chair', category: 'Furniture', warehouse: 'East Warehouse', quantity: 34, reorderLevel: 40, unitPrice: 350, totalValue: 11900, status: 'Low Stock', lastUpdated: '2024-06-12', supplier: 'Furniture World Ltd.' },
//   { id: '12', sku: 'SKU-012', productName: 'SSD 1TB External', category: 'Electronics', warehouse: 'Main Warehouse', quantity: 567, reorderLevel: 100, unitPrice: 120, totalValue: 68040, status: 'In Stock', lastUpdated: '2024-06-14', supplier: 'TechDistributors Inc.' },
// ];

// // Stock Movement Data
// export const stockMovements: StockMovement[] = [
//   { id: 'MOV-001', date: '2024-06-01', productId: '1', productName: 'Dell XPS 13 Laptop', type: 'OUT', quantity: 5, reference: 'ORD-1001', notes: 'Customer order' },
//   { id: 'MOV-002', date: '2024-06-02', productId: '2', productName: 'Wireless Headset Pro', type: 'IN', quantity: 200, reference: 'PO-2024-001', notes: 'New shipment received' },
//   { id: 'MOV-003', date: '2024-06-03', productId: '3', productName: 'Ergonomic Chair', type: 'OUT', quantity: 8, reference: 'ORD-1002', notes: 'Customer order' },
//   { id: 'MOV-004', date: '2024-06-04', productId: '5', productName: 'Monitor 27" 4K', type: 'ADJUSTMENT', quantity: -2, reference: 'ADJ-001', notes: 'Damaged items write-off' },
//   { id: 'MOV-005', date: '2024-06-05', productId: '7', productName: 'USB-C Hub 7-in-1', type: 'OUT', quantity: 45, reference: 'ORD-1003', notes: 'Customer order' },
//   { id: 'MOV-006', date: '2024-06-06', productId: '9', productName: 'Laptop Stand Aluminium', type: 'IN', quantity: 100, reference: 'PO-2024-002', notes: 'New shipment received' },
//   { id: 'MOV-007', date: '2024-06-07', productId: '1', productName: 'Dell XPS 13 Laptop', type: 'IN', quantity: 30, reference: 'PO-2024-003', notes: 'Restock' },
//   { id: 'MOV-008', date: '2024-06-08', productId: '10', productName: 'Bluetooth Mouse', type: 'OUT', quantity: 15, reference: 'ORD-1004', notes: 'Customer order' },
//   { id: 'MOV-009', date: '2024-06-09', productId: '12', productName: 'SSD 1TB External', type: 'IN', quantity: 200, reference: 'PO-2024-004', notes: 'New shipment received' },
//   { id: 'MOV-010', date: '2024-06-10', productId: '4', productName: 'Standing Desk 60"', type: 'OUT', quantity: 2, reference: 'ORD-1005', notes: 'Customer order' },
// ];

// // Valuation by Category
// export const valuationSummary: ValuationSummary[] = [
//   { category: 'Electronics', totalValue: 728740, totalQuantity: 3021, avgUnitPrice: 241.2, percentageOfTotal: 58.2 },
//   { category: 'Accessories', totalValue: 58410, totalQuantity: 890, avgUnitPrice: 65.6, percentageOfTotal: 4.7 },
//   { category: 'Furniture', totalValue: 39900, totalQuantity: 90, avgUnitPrice: 443.3, percentageOfTotal: 3.2 },
// ];

// // Chart Data for Stock Summary
// export const stockSummaryChartData = [
//   { month: 'Jan', 'In Stock': 4200, 'Low Stock': 320, 'Out of Stock': 45, 'Total': 4565 },
//   { month: 'Feb', 'In Stock': 4350, 'Low Stock': 290, 'Out of Stock': 38, 'Total': 4678 },
//   { month: 'Mar', 'In Stock': 4100, 'Low Stock': 380, 'Out of Stock': 52, 'Total': 4532 },
//   { month: 'Apr', 'In Stock': 4580, 'Low Stock': 260, 'Out of Stock': 30, 'Total': 4870 },
//   { month: 'May', 'In Stock': 4720, 'Low Stock': 240, 'Out of Stock': 28, 'Total': 4988 },
//   { month: 'Jun', 'In Stock': 4829, 'Low Stock': 210, 'Out of Stock': 38, 'Total': 5077 },
// ];

// // Chart Data for Movement
// export const movementChartData = [
//   { month: 'Jan', 'IN': 1250, 'OUT': 980, 'Adjustments': 45 },
//   { month: 'Feb', 'IN': 1450, 'OUT': 1120, 'Adjustments': 32 },
//   { month: 'Mar', 'IN': 1320, 'OUT': 1250, 'Adjustments': 28 },
//   { month: 'Apr', 'IN': 1680, 'OUT': 1350, 'Adjustments': 41 },
//   { month: 'May', 'IN': 1590, 'OUT': 1420, 'Adjustments': 35 },
//   { month: 'Jun', 'IN': 1820, 'OUT': 1580, 'Adjustments': 38 },
// ];

// // KPI Data
// export const inventoryKpis = [
//   { label: "Total SKUs", value: "4,829", change: "+12%", up: true, icon: "📦", sparkline: [40, 55, 48, 70, 62, 85] },
//   { label: "Stock Value", value: "$2.4M", change: "+8.3%", up: true, icon: "💎", sparkline: [50, 60, 55, 75, 70, 88] },
//   { label: "Out of Stock", value: "38", change: "+5 items", up: false, icon: "⚠️", sparkline: [30, 45, 52, 35, 48, 60] },
//   { label: "Low Stock Items", value: "142", change: "−18 vs last", up: true, icon: "🔄", sparkline: [80, 70, 65, 58, 50, 42] },
//   { label: "Inventory Turnover", value: "5.2x", change: "+0.8x", up: true, icon: "🔄", sparkline: [40, 45, 48, 52, 56, 62] },
//   { label: "Avg. Lead Time", value: "6.2d", change: "−0.8 days", up: true, icon: "⏱️", sparkline: [80, 72, 68, 62, 58, 52] },
// ];

// // Categories for filtering
// export const categories = ['All', 'Electronics', 'Furniture', 'Accessories'];
// export const warehouses = ['All', 'Main Warehouse', 'East Warehouse', 'West Warehouse'];
// export const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

// // Create the inventoryData object that matches CategoryData type
// export const inventoryData: CategoryData = {
//   kpis: inventoryKpis,
//   chart: stockSummaryChartData,
//   headers: ['SKU', 'Product Name', 'Category', 'Warehouse', 'Quantity', 'Unit Price', 'Total Value', 'Status', 'Last Updated'],
//   rows: inventoryItems.map(item => [
//     item.sku,
//     item.productName,
//     item.category,
//     item.warehouse,
//     item.quantity.toString(),
//     `$${item.unitPrice.toLocaleString()}`,
//     `$${item.totalValue.toLocaleString()}`,
//     item.status,
//     item.lastUpdated,
//   ]),
// };