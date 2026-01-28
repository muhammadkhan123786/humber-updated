export type ProductCondition = 'new' | 'refurbished' | 'used' | 'damaged';
export type ProductStatus = 'active' | 'inactive' | 'discontinued' | 'out-of-stock';

export interface IProduct {
  // Identification
  productName: string;
  sku: string;
  barcode?: string;
  brand?: string;
  manufacturer?: string;
  modelNumber?: string;
  
  // Categorization & Relations (Storing IDs)
  categoryPath: string[]; // Array of Category IDs
  finalCategoryId: string; 
  warehouseId?: string; 
  taxRateId?: string;
  
  // Content
  description: string;
  shortDescription?: string;
  keywords: string[];
  tags: string[];
  images: string[];
  
  // Pricing (Stored as numbers for calculation)
  costPrice: number;
  sellingPrice: number;
  retailPrice?: number;
  discountPercentage?: number;
  vatExempt: boolean;
  
  // Inventory
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint?: number;
  stockLocation?: string;
  binLocation?: string;
  
  // Specifications
  dimensions: {
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
  };
  color?: string;
  material?: string;
  
  // Dynamic Data (Attributes)
  dynamicFields: Record<string, any>;
  
  // Status & SEO
  condition: ProductCondition;
  status: ProductStatus;
  featured: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
}