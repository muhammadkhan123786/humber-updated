// types/product.ts

/**
 * Category information for a single category level
 */
export interface CategoryInfo {
  id: string;
  name: string;
  level: number;
  parentId: string;
  lenght?: any;
}

/**
 * Product attributes/variants
 */
export interface ProductAttribute {
  sku: string;
  attributes: Record<string, any>;
  pricing: Array<{
    marketplaceName: string;
    costPrice: number;
    sellingPrice: number;
    retailPrice: number;
    discountPercentage: number;
    taxRate: number;
  }>;
  stock: {
    stockQuantity: number;
    stockStatus: string;
    onHand: number;
    reorderPoint: number;
    featured: boolean;
    minStockLevel: number;
    maxStockLevel: number;
  };
  warranty: {
    warrantyType: string;
    warrantyPeriod: string;
  };
}

/**
 * Base Product interface (used in listings, cards, tables)
 */
export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  description: string;
  shortDescription: string;
  brand: string;
  manufacturer: string;
  modelNumber: string;
  barcode: string;
  
  // Categories - dynamic array for n-th level support
  categories: CategoryInfo[];
  categoryPath: CategoryInfo[];
  primaryCategory: CategoryInfo;
  
  // Pricing
  price: number;
  costPrice: number;
  retailPrice: number;
  
  // Stock
  stockQuantity: number;
  stockStatus: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  reorderQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  
  // Media
  imageUrl: string;
  images: string[];
  
  // Status
  featured: boolean;
  status: string;
  
  // Additional info
  warranty: string;
  tags: string[];
  keywords: string[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  
  // Optional fields for UI
  rating?: number;
  totalReviews?: number;
  dimensions?: string;
  weight?: string;
  attributes?: any;
}

/**
 * Detailed Product interface (used in product details, edit forms)
 */
export interface Product extends ProductListItem {
  attributes: ProductAttribute[];
}

/**
 * API Product Response (from backend)
 */
export interface ApiProduct {
  _id: string;
  productName: string;
  sku: string;
  description: string;
  shortDescription: string;
  brand: string;
  manufacturer: string;
  modelNumber: string;
  barcode: string;
  isActive: boolean;
  isDeleted: boolean;
  images: string[];
  categoryId: string | { 
    _id: string; 
    categoryName?: string; 
    name?: string; 
    level?: number; 
    parentId?: string 
  };
  categoryPath: (string | { 
    _id: string; 
    categoryName?: string; 
    name?: string; 
    level?: number; 
    parentId?: string 
  })[];
  attributes: ProductAttribute[];
  ui_price: number;
  ui_totalStock: number;
  tags?: string[];
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Product Filter Options
 */
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  categoryLevel?: number;
  status?: string;
  featured?: boolean;
  stockStatus?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  manufacturer?: string;
  [key: string]: any;
}

/**
 * Product Statistics
 */
export interface ProductStatistics {
  total: number;
  activeCount: number;
  inactiveCount: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  featuredCount: number;
}

/**
 * Pagination Info
 */
export interface PaginationInfo {
  total: number;
  activeCount: number;
  inactiveCount: number;
  page: number;
  limit: number;
  totalPages?: number;
}