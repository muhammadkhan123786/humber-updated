// src/types/inventory.ts

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  warehouse: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  totalValue: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
  supplier: string;
}

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reference: string;
  notes: string;
}

export interface ValuationSummary {
  category: string;
  totalValue: number;
  totalQuantity: number;
  avgUnitPrice: number;
  percentageOfTotal: number;
}

export interface FilterOptions {
  search: string;
  category: string;
  warehouse: string;
  status: string;
  dateRange: { start: Date | null; end: Date | null };
  minValue?: number;
  maxValue?: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ExportFormat {
  type: 'csv' | 'excel' | 'pdf';
  filename: string;
}   