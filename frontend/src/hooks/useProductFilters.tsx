// hooks/useProductFilters.ts - UPDATED VERSION
"use client";
import { useState, useMemo, useCallback } from 'react';
import { DatabaseCategory } from './useCategory';
import { ProductListItem } from "../app/dashboard/inventory-dashboard/product/types/product"
// interface Product {
//   id: string;
//   name: string;
//   categories: {
//     level1?: { id: string; name: string; level: number };
//     level2?: { id: string; name: string; level: number; parentId: string };
//     level3?: { id: string; name: string; level: number; parentId: string };
//   };
//   status: string;
//   stockStatus: string;
//   featured: boolean;
//   [key: string]: any;
// }

interface UseProductFiltersProps {
  products: ProductListItem[];
  categories: DatabaseCategory[];
}

export const useProductFilters = ({ 
  products = [], 
  categories = [] 
}: UseProductFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // ✅ Build hierarchical categories for dropdown
  const buildCategoryOptions = useCallback(() => {
    const options: { value: string; label: string; level: number }[] = [
      { value: 'all', label: 'All Categories', level: 0 }
    ];

    // Helper function to add category and its children recursively
    const addCategoryWithChildren = (category: DatabaseCategory, level: number = 1) => {
      // Add current category
      const prefix = '─'.repeat(level - 1) + (level > 1 ? ' ' : '');
      options.push({
        value: category._id,
        label: `${prefix}${category.categoryName}`,
        level
      });

      // Find and add children
      const children = categories.filter(cat => cat.parentId === category._id);
      children.forEach(child => {
        addCategoryWithChildren(child, level + 1);
      });
    };

    // Start with root categories (no parent)
    const rootCategories = categories.filter(cat => !cat.parentId);
    rootCategories.forEach(root => {
      addCategoryWithChildren(root, 1);
    });

    return options;
  }, [categories]);

  // ✅ Get product category IDs (simplified version)
  const getProductCategoryIds = useCallback((product: ProductListItem): string[] => {
    const ids = new Set<string>();
    
    // Check if product has categories in the old structure
    if (product.categories?.level1?.id) {
      ids.add(product.categories.level1.id);
    }
    if (product.categories?.level2?.id) {
      ids.add(product.categories.level2.id);
    }
    if (product.categories?.level3?.id) {
      ids.add(product.categories.level3.id);
    }

    return Array.from(ids);
  }, []);

  // ✅ Get all descendants of a category
  const getDescendantCategoryIds = useCallback((categoryId: string): string[] => {
    const descendants = new Set<string>([categoryId]);
    
    const findChildren = (parentId: string) => {
      const children = categories.filter(cat => cat.parentId === parentId);
      children.forEach(child => {
        descendants.add(child._id);
        findChildren(child._id);
      });
    };
    
    findChildren(categoryId);
    return Array.from(descendants);
  }, [categories]);

  // ✅ Filter products
  const filteredProducts = useMemo(() => {
    console.log('🔍 Filtering products:', { 
      total: products.length, 
      searchTerm, 
      selectedCategory,
      categoriesCount: categories.length 
    });

    return products.filter((product) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        (product.name?.toLowerCase() || '').includes(searchLower) ||
        (product.sku?.toLowerCase() || '').includes(searchLower) ||
        (product.manufacturer?.toLowerCase() || '').includes(searchLower) ||
        (product.brand?.toLowerCase() || '').includes(searchLower);

      // Category filter
      let matchesCategory = true;
      if (selectedCategory !== 'all' && categories.length > 0) {
        // Get all product category IDs
        const productCategoryIds = getProductCategoryIds(product);
        
        // If product has no categories and a category is selected, hide it
        if (productCategoryIds.length === 0) {
          matchesCategory = false;
        } else {
          // Get all descendant IDs of selected category
          const descendantIds = getDescendantCategoryIds(selectedCategory);
          
          // Check if any product category matches the selected category or its descendants
          matchesCategory = productCategoryIds.some(id => descendantIds.includes(id));
        }
      }

      // Status filter
      const matchesStatus = selectedStatus === 'all' || 
        product.status === selectedStatus;

      // Stock status filter
      const matchesStockStatus = selectedStockStatus === 'all' || 
        product.stockStatus === selectedStockStatus;

      // Featured filter
      const matchesFeatured = !showFeaturedOnly || product.featured === true;

      return matchesSearch && matchesCategory && matchesStatus && matchesStockStatus && matchesFeatured;
    });
  }, [
    products, 
    searchTerm, 
    selectedCategory, 
    selectedStatus,
    selectedStockStatus,
    showFeaturedOnly,
    categories,
    getProductCategoryIds,
    getDescendantCategoryIds
  ]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
  }, []);

  const handleStockStatusChange = useCallback((value: string) => {
    setSelectedStockStatus(value);
  }, []);

  const handleFeaturedToggle = useCallback(() => {
    setShowFeaturedOnly(prev => !prev);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedStockStatus('all');
    setShowFeaturedOnly(false);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' ||
           selectedCategory !== 'all' ||
           selectedStatus !== 'all' ||
           selectedStockStatus !== 'all' ||
           showFeaturedOnly;
  }, [searchTerm, selectedCategory, selectedStatus, selectedStockStatus, showFeaturedOnly]);

  return {
    // Filter values
    searchTerm,
    selectedCategory,
    selectedStatus,
    selectedStockStatus,
    showFeaturedOnly,

    // Filtered data
    filteredProducts,

    // Category options for dropdown
    categoryOptions: buildCategoryOptions(),

    // Handlers
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handleStockStatusChange,
    handleFeaturedToggle,
    resetFilters,
    hasActiveFilters
  };
};