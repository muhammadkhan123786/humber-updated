import { List, Package, Globe, LucideIcon } from 'lucide-react';

export interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}
 export interface StockDetail {
  id: string;
  name: string;
  sku: string;
  image: string;
  status: 'Critical' | 'Healthy' | 'Low';
  lastUpdated: string;
  unitPrice: number;
  metrics: {
    onHand: number;
    reserved: number;
    reorderLevel: number;
    reorderQty: number;
    dangerLevel: number;
  };
}

export const steps: Step[] = [
  { id: 1, title: 'Products', icon: List },
  { id: 2, title: 'Inventory Management', icon: Package },
  { id: 3, title: 'Marketplace Distribution', icon: Globe },
];

// types.ts or inside your component file
export interface ProductItem {
  id: string;
  image: string;
  name: string;
  sku: string;
  categoryPath: string[];
  stockStatus: 'Healthy' | 'Low Stock' | 'Critical';
  inventory: { onHand: number; reserved: number; available: number; reorder: number };
  price: number;
  marketplaces: { ebay: boolean; amazon: boolean };
}

export const productData: ProductItem[] = [
  {
    id: '1',
    image: 'https://via.placeholder.com/40',
    name: 'Classic Cotton Shirt - Navy Blue',
    sku: 'CLO-MEN-SH-001',
    categoryPath: ['Clothing', 'Men', 'Shirts'],
    stockStatus: 'Healthy',
    inventory: { onHand: 45, reserved: 0, available: 45, reorder: 20 },
    price: 49.99,
    marketplaces: { ebay: true, amazon: true }
  },
  // Add more dummy items here...
];

export const mockStockData: StockDetail = {
  id: '1',
  name: 'MacBook Pro 16"',
  sku: 'ELEC-COMP-LAP-001',
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200',
  status: 'Critical',
  lastUpdated: '2026-01-08 14:30',
  unitPrice: 2799.99,
  metrics: {
    onHand: 3,
    reserved: 0,
    reorderLevel: 3,
    reorderQty: 8,
    dangerLevel: 5
  }
};

export const filters = [
    { id: "product", label: "Product", colorClass: "bg-blue-600 text-white border-blue-600" },
    { id: "critical", label: "Critical", colorClass: "bg-red-600 text-white border-red-600" },
    { id: "low", label: "Low Stock", colorClass: "bg-yellow-500 text-white border-yellow-500" },
    { id: "reorder", label: "Needs Reorder", colorClass: "bg-blue-600 text-white border-blue-600" },
  ];