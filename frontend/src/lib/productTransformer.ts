// utils/productTransformer.ts

interface ApiProduct {
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
  attributes: Array<{
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
  }>;
  ui_price: number;
  ui_totalStock: number;
  tags?: string[];
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

interface TransformedProduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  shortDescription: string;
  brand: string;
  modelNumber: string;
  barcode: string;
  categories: {
    level1: {
      id: string;
      name: string;
      level: number;
    };
    level2: {
      id: string;
      name: string;
      level: number;
      parentId: string;
    };
    level3: {
      id: string;
      name: string;
      level: number;
      parentId: string;
    };
  };
  price: number;
  costPrice: number;
  retailPrice: number;
  stockQuantity: number;
  stockStatus: string;
  manufacturer: string;
  warranty: string;
  imageUrl: string;
  images: string[];
  featured: boolean;
  status: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  reorderQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  tags: string[];
  keywords: string[];
  attributes: any[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Extract category ID from either string or populated object
 */
const getCategoryId = (category: string | { _id: string } | null | undefined): string => {
  if (!category) return "uncategorized";
  return typeof category === 'string' ? category : (category._id || "uncategorized");
};

/**
 * Extract category display name from either string or populated object
 * Looks for categoryName first, then name
 */
const getCategoryDisplayName = (
  category: string | { 
    _id: string; 
    categoryName?: string; 
    name?: string 
  } | null | undefined, 
  defaultName: string
): string => {
  if (!category) return defaultName;
  if (typeof category === 'string') return defaultName;
  
  // Try categoryName first, then name
  return category.categoryName || category.name || defaultName;
};

/**
 * Extract category level from category object
 */
const getCategoryLevel = (category: any): number => {
  if (!category || typeof category === 'string') return 1;
  return category.level || 1;
};

/**
 * Extract parent ID from category object
 */
const getCategoryParentId = (
  category: string | { _id: string; parentId?: string } | null | undefined, 
  fallback: string
): string => {
  if (!category || typeof category === 'string') return fallback;
  return category.parentId || fallback;
};

/**
 * Process category path - convert string IDs to objects if needed
 */
const processCategoryPath = (
  categoryPath: (string | { 
    _id: string; 
    categoryName?: string; 
    name?: string; 
    level?: number; 
    parentId?: string 
  })[]
): { 
  _id: string; 
  categoryName?: string; 
  name?: string; 
  level?: number; 
  parentId?: string 
}[] => {
  if (!categoryPath || !Array.isArray(categoryPath)) {
    return [];
  }
  
  return categoryPath.map(cat => {
    if (typeof cat === 'string') {
      return {
        _id: cat,
        categoryName: "Unknown Category",
        name: "Unknown Category"
      };
    }
    return cat;
  });
};

/**
 * Get the best category for a specific level
 */
const getCategoryForLevel = (
  categoryId: any,
  categoryPath: any[],
  targetLevel: number
): { id: string; name: string; level: number; parentId: string } => {
  // Find category at specific level from categoryPath
  const categoryInPath = categoryPath.find(cat => {
    const level = getCategoryLevel(cat);
    return level === targetLevel;
  });

  if (categoryInPath) {
    return {
      id: getCategoryId(categoryInPath),
      name: getCategoryDisplayName(categoryInPath, `Level ${targetLevel}`),
      level: targetLevel,
      parentId: getCategoryParentId(categoryInPath, "")
    };
  }

  // If not found in path, use the main category with appropriate level
  const fallbackCategory = categoryId || categoryPath[0] || null;
  return {
    id: getCategoryId(fallbackCategory),
    name: getCategoryDisplayName(fallbackCategory, `Level ${targetLevel}`),
    level: targetLevel,
    parentId: getCategoryParentId(fallbackCategory, "")
  };
};

/**
 * Transform API product to UI product format
 */
export const transformProduct = (apiProduct: ApiProduct): TransformedProduct => {
  // Get the first attribute (primary variant)
  const firstAttribute = apiProduct.attributes?.[0];
  const firstPricing = firstAttribute?.pricing?.[0];
  const stock = firstAttribute?.stock;

  // Process categories
  const processedCategoryPath = processCategoryPath(apiProduct.categoryPath || []);
  
  console.log('=== DEBUG CATEGORY TRANSFORMATION ===');
  console.log('Raw categoryId:', apiProduct.categoryId);
  console.log('Raw categoryPath:', apiProduct.categoryPath);
  console.log('Processed categoryPath:', processedCategoryPath);
  console.log('Type of categoryId:', typeof apiProduct.categoryId);

  // Get categories for each level
  const level1Category = getCategoryForLevel(apiProduct.categoryId, processedCategoryPath, 1);
  const level2Category = getCategoryForLevel(apiProduct.categoryId, processedCategoryPath, 2);
  const level3Category = getCategoryForLevel(apiProduct.categoryId, processedCategoryPath, 3);

  // Set parent relationships
  level2Category.parentId = level2Category.parentId || level1Category.id;
  level3Category.parentId = level3Category.parentId || level2Category.id;

  console.log('Transformed Categories:', {
    level1: level1Category,
    level2: level2Category,
    level3: level3Category
  });

  return {
    id: apiProduct._id,
    name: apiProduct.productName,
    sku: apiProduct.sku,
    description: apiProduct.description || apiProduct.shortDescription || '',
    shortDescription: apiProduct.shortDescription || '',
    brand: apiProduct.brand || '',
    manufacturer: apiProduct.manufacturer || '',
    modelNumber: apiProduct.modelNumber || '',
    barcode: apiProduct.barcode || '',
    categories: {
      level1: {
        id: level1Category.id,
        name: level1Category.name,
        level: level1Category.level
      },
      level2: {
        id: level2Category.id,
        name: level2Category.name,
        level: level2Category.level,
        parentId: level2Category.parentId
      },
      level3: {
        id: level3Category.id,
        name: level3Category.name,
        level: level3Category.level,
        parentId: level3Category.parentId
      }
    },
    price: apiProduct.ui_price || firstPricing?.sellingPrice || 0,
    costPrice: firstPricing?.costPrice || 0,
    retailPrice: firstPricing?.retailPrice || 0,
    stockQuantity: apiProduct.ui_totalStock || stock?.stockQuantity || 0,
    stockStatus: stock?.stockStatus || 'out-of-stock',
    warranty: firstAttribute?.warranty 
      ? `${firstAttribute.warranty.warrantyPeriod} ${firstAttribute.warranty.warrantyType}`
      : 'No warranty',
    imageUrl: apiProduct.images?.[0] || 'https://via.placeholder.com/400',
    images: apiProduct.images || [],
    featured: stock?.featured || false,
    status: apiProduct.isActive ? 'active' : 'inactive',
    onHand: stock?.onHand || 0,
    reserved: 0,
    available: stock?.onHand || 0,
    reorderLevel: stock?.reorderPoint || 0,
    reorderQuantity: 0,
    minStockLevel: stock?.minStockLevel || 0,
    maxStockLevel: stock?.maxStockLevel || 0,
    tags: apiProduct.tags || [],
    keywords: apiProduct.keywords || [],
    attributes: apiProduct.attributes || [],
    createdAt: apiProduct.createdAt,
    updatedAt: apiProduct.updatedAt
  };
};

/**
 * Alternative simpler transformation if you don't need hierarchy levels
 */
export const transformProductSimple = (apiProduct: ApiProduct): TransformedProduct => {
  const firstAttribute = apiProduct.attributes?.[0];
  const firstPricing = firstAttribute?.pricing?.[0];
  const stock = firstAttribute?.stock;

  // Get main category
  const mainCategory = apiProduct.categoryId || 
                      (apiProduct.categoryPath?.[0]) || 
                      null;

  // Use the same category for all levels (simplified)
  const categoryId = getCategoryId(mainCategory);
  const categoryName = getCategoryDisplayName(mainCategory, "Uncategorized");

  return {
    id: apiProduct._id,
    name: apiProduct.productName,
    sku: apiProduct.sku,
    description: apiProduct.description || apiProduct.shortDescription || '',
    shortDescription: apiProduct.shortDescription || '',
    brand: apiProduct.brand || '',
    manufacturer: apiProduct.manufacturer || '',
    modelNumber: apiProduct.modelNumber || '',
    barcode: apiProduct.barcode || '',
    categories: {
      level1: {
        id: categoryId,
        name: categoryName,
        level: 1
      },
      level2: {
        id: `${categoryId}-l2`,
        name: `${categoryName} - Subcategory`,
        level: 2,
        parentId: categoryId
      },
      level3: {
        id: `${categoryId}-l3`,
        name: `${categoryName} - All Products`,
        level: 3,
        parentId: `${categoryId}-l2`
      }
    },
    price: apiProduct.ui_price || firstPricing?.sellingPrice || 0,
    costPrice: firstPricing?.costPrice || 0,
    retailPrice: firstPricing?.retailPrice || 0,
    stockQuantity: apiProduct.ui_totalStock || stock?.stockQuantity || 0,
    stockStatus: stock?.stockStatus || 'out-of-stock',
    warranty: firstAttribute?.warranty 
      ? `${firstAttribute.warranty.warrantyPeriod} ${firstAttribute.warranty.warrantyType}`
      : 'No warranty',
    imageUrl: apiProduct.images?.[0] || 'https://via.placeholder.com/400',
    images: apiProduct.images || [],
    featured: stock?.featured || false,
    status: apiProduct.isActive ? 'active' : 'inactive',
    onHand: stock?.onHand || 0,
    reserved: 0,
    available: stock?.onHand || 0,
    reorderLevel: stock?.reorderPoint || 0,
    reorderQuantity: 0,
    minStockLevel: stock?.minStockLevel || 0,
    maxStockLevel: stock?.maxStockLevel || 0,
    tags: apiProduct.tags || [],
    keywords: apiProduct.keywords || [],
    attributes: apiProduct.attributes || [],
    createdAt: apiProduct.createdAt,
    updatedAt: apiProduct.updatedAt
  };
};

/**
 * Transform products response
 */
export const transformProductsResponse = (apiResponse: { data: ApiProduct[] }): TransformedProduct[] => {
  try {
    console.log('Transforming products response, count:', apiResponse.data?.length);
    const transformed = apiResponse.data.map(product => {
      try {
        return transformProduct(product);
      } catch (error) {
        console.error('Error transforming individual product:', error);
        console.log('Problematic product:', product);
        // Return a basic transformed product as fallback
        return {
          id: product._id,
          name: product.productName,
          sku: product.sku,
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          brand: product.brand || '',
          manufacturer: product.manufacturer || '',
          modelNumber: product.modelNumber || '',
          barcode: product.barcode || '',
          categories: {
            level1: { id: 'uncategorized', name: 'Uncategorized', level: 1 },
            level2: { id: 'general', name: 'General', level: 2, parentId: 'uncategorized' },
            level3: { id: 'all', name: 'All Products', level: 3, parentId: 'general' }
          },
          price: product.ui_price || 0,
          costPrice: 0,
          retailPrice: 0,
          stockQuantity: product.ui_totalStock || 0,
          stockStatus: 'out-of-stock',
          warranty: 'No warranty',
          imageUrl: product.images?.[0] || 'https://via.placeholder.com/400',
          images: product.images || [],
          featured: false,
          status: product.isActive ? 'active' : 'inactive',
          onHand: 0,
          reserved: 0,
          available: 0,
          reorderLevel: 0,
          reorderQuantity: 0,
          minStockLevel: 0,
          maxStockLevel: 0,
          tags: product.tags || [],
          keywords: product.keywords || [],
          attributes: product.attributes || [],
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        } as TransformedProduct;
      }
    });
    
    console.log('Successfully transformed products:', transformed.length);
    if (transformed.length > 0) {
      console.log('First transformed product categories:', transformed[0].categories);
    }
    
    return transformed;
  } catch (error) {
    console.error('Error in transformProductsResponse:', error);
    return [];
  }
};

/**
 * Helper function to extract all category IDs from products
 */
export const extractCategoryIdsFromProducts = (products: TransformedProduct[]): string[] => {
  const categoryIds = new Set<string>();
  
  products.forEach(product => {
    if (product.categories.level1.id && product.categories.level1.id !== 'uncategorized') {
      categoryIds.add(product.categories.level1.id);
    }
    if (product.categories.level2.id && product.categories.level2.id !== 'general') {
      categoryIds.add(product.categories.level2.id);
    }
    if (product.categories.level3.id && product.categories.level3.id !== 'all') {
      categoryIds.add(product.categories.level3.id);
    }
  });
  
  return Array.from(categoryIds);
};

/**
 * Update categories in transformed product with actual category names
 */
export const enrichProductCategories = (
  product: TransformedProduct,
  categoryMap: Record<string, { id: string; name: string; level: number }>
): TransformedProduct => {
  const enriched = { ...product };
  
  // Enrich level1
  if (categoryMap[product.categories.level1.id]) {
    enriched.categories.level1.name = categoryMap[product.categories.level1.id].name;
  }
  
  // Enrich level2
  if (categoryMap[product.categories.level2.id]) {
    enriched.categories.level2.name = categoryMap[product.categories.level2.id].name;
  }
  
  // Enrich level3
  if (categoryMap[product.categories.level3.id]) {
    enriched.categories.level3.name = categoryMap[product.categories.level3.id].name;
  }
  
  return enriched;
};