// types/product.ts

export interface Category {
  id: string;
  name: string;
  level: number;
  parentId?: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  description: string;
  categories: {
    level1?: { id: string; name: string; level?: number };
    level2?: { id: string; name: string; level?: number; parentId?: string };
    level3?: { id: string; name: string; level?: number; parentId?: string };
  };
  price: number;
  stockQuantity: number;
  stockStatus: string;
  status: string;
  featured: boolean;
  imageUrl?: string;
  manufacturer?: string;
  brand?: string;
  costPrice: number;
  rating?: number;
  totalReviews?: string;
  warranty?: string;
   onHand: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  reorderQuantity: number;
  weight?: string;
  dimensions?: string;
}


// inventory-dashboard/product/types/product.ts
export interface Product extends ProductListItem {
  price: number;
  costPrice: number;
  stockQuantity: number;
  weight: string;
  dimensions: string;

  onHand: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  reorderQuantity: number;
}


export interface ProductStats {
  total: number;
  active: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  featured: number;
}

export interface ProductFilterState {
  searchTerm: string;
  selectedLevel1: string;
  selectedLevel2: string;
  selectedLevel3: string;
  selectedStatus: string;
}

export interface MarketplaceProduct extends Product {
  marketplaceId?: string;
  marketplaceName?: string;
  marketplacePrice?: number;
  marketplaceStock?: number;
  marketplaceUrl?: string;
  syncStatus?: 'synced' | 'pending' | 'error';
  lastSynced?: Date;
}

export interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  weight: string;
  dimensions: string;
  manufacturer: string;
  warranty: string;
  rating: number;
  totalReviews: number;
  imageUrl?: string;
  featured: boolean;
  status: 'active' | 'inactive' | 'discontinued';
  onHand: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  reorderQuantity: number;
  categoryLevel1Id: string;
  categoryLevel2Id: string;
  categoryLevel3Id: string;
}

export interface CategoryTree {
  id: string;
  name: string;
  level: number;
  parentId?: string;
  children?: CategoryTree[];
}

export interface ProductExportOptions {
  format: 'csv' | 'excel' | 'json';
  includeImages: boolean;
  includeInventory: boolean;
  includeCategories: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ProductBulkOperation {
  ids: string[];
  action: 'activate' | 'deactivate' | 'delete' | 'export' | 'update-stock';
  data?: Record<string, any>;
}

export interface ProductHistoryEntry {
  id: string;
  productId: string;
  action: 'created' | 'updated' | 'deleted' | 'stock-adjusted';
  userId: string;
  userName: string;
  timestamp: Date;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  notes?: string;
}

export interface ProductAnalytics {
  productId: string;
  views: number;
  orders: number;
  revenue: number;
  avgRating: number;
  stockTurnover: number;
  last30Days: {
    views: number;
    orders: number;
    revenue: number;
  };
  comparison?: {
    previousPeriod: {
      orders: number;
      revenue: number;
    };
    percentageChange: number;
  };
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  alertType: 'low-stock' | 'out-of-stock' | 'reorder' | 'expiring';
  currentStock: number;
  threshold: number;
  status: 'pending' | 'acknowledged' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
  notes?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  attributes: Record<string, string>;
  imageUrl?: string;
  status: 'active' | 'inactive';
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProductAttachment {
  id: string;
  productId: string;
  name: string;
  type: 'manual' | 'specsheet' | 'warranty' | 'certificate' | 'image' | 'video';
  url: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ProductTag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface ProductSEO {
  productId: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
  canonicalUrl?: string;
}

// Constants
export const PRODUCT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'discontinued', label: 'Discontinued', color: 'red' }
] as const;

export const STOCK_STATUS_OPTIONS = [
  { value: 'in-stock', label: 'In Stock', color: 'green' },
  { value: 'low-stock', label: 'Low Stock', color: 'orange' },
  { value: 'out-of-stock', label: 'Out of Stock', color: 'red' }
] as const;

export const INVENTORY_ALERT_TYPES = {
  'low-stock': { label: 'Low Stock', color: 'orange', icon: 'AlertTriangle' },
  'out-of-stock': { label: 'Out of Stock', color: 'red', icon: 'AlertCircle' },
  'reorder': { label: 'Reorder Point', color: 'blue', icon: 'Package' },
  'expiring': { label: 'Expiring Soon', color: 'yellow', icon: 'Clock' }
} as const;

// Helper types
export type ProductStatus = Product['status'];
export type StockStatus = Product['stockStatus'];
export type AlertType = keyof typeof INVENTORY_ALERT_TYPES;

// Utility functions type signatures
export type ProductFilterFunction = (products: Product[], filters: ProductFilterState) => Product[];
export type ProductSortFunction = (products: Product[], field: keyof Product, direction: 'asc' | 'desc') => Product[];
export type ProductSearchFunction = (products: Product[], searchTerm: string) => Product[];

// API response types
export interface ApiProductResponse {
  success: boolean;
  data: Product | Product[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiProductError {
  success: false;
  error: string;
  code: string;
  details?: Record<string, any>;
}

export interface MarketplaceProduct extends Product {
  marketplaceId?: string;
  marketplaceName?: string;
  marketplacePrice?: number;
  marketplaceStock?: number;
  marketplaceUrl?: string;
  syncStatus?: 'synced' | 'pending' | 'error';
  lastSynced?: Date;
}