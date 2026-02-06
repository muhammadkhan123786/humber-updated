// hooks/useProducts.ts
"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { transformProductsResponse, transformProduct } from "../lib/productTransformer"
 import { ProductListItem } from '@/app/dashboard/inventory-dashboard/product/types/product';

// interface Product {
//   id: string;
//   name: string;
//   sku: string;
//   description: string;
//   categories: {
//     level1: { id: string; name: string; level: number };
//     level2: { id: string; name: string; level: number; parentId: string };
//     level3: { id: string; name: string; level: number; parentId: string };
//   };
//   price: number;
//   stockQuantity: number;
//   stockStatus: string;
//   status: string;
//   featured: boolean;
//   imageUrl: string;
//   [key: string]: any;
// }

interface Statistics {
  total: number;
  activeCount: number;
  inactiveCount: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  featuredCount: number;
}

interface UseProductsOptions {
  autoFetch?: boolean;
  initialPage?: number;
  initialLimit?: number;
  initialFilters?: Record<string, any>;
}

interface ProductFilters {
  search?: string;
  categoryId?: string;
  level1CategoryId?: string;
  level2CategoryId?: string;
  level3CategoryId?: string;
  status?: string;
  featured?: boolean;
  stockStatus?: string;
  [key: string]: any;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`;

const getAuthConfig = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return { headers: { Authorization: `Bearer ${token}` } };
};

const getUserId = () => {
  if (typeof window === "undefined") return "";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.id || user._id;
};

export const useProducts = (options: UseProductsOptions = {}) => {
  const {
    autoFetch = true,
    initialPage = 1,
    initialLimit = 10,
    initialFilters = {}
  } = options;

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    activeCount: 0,
    inactiveCount: 0,
    page: initialPage,
    limit: initialLimit
  });
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  /**
   * Build query params from filters
   */
  const buildQueryParams = useCallback((
    currentFilters: ProductFilters,
    page: number,
    limit: number
  ): Record<string, any> => {
    const params: Record<string, any> = {
      userId: getUserId(),
      page,
      limit,
      includeStats: 'true'
    };

    // Add filters
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });

    return params;
  }, []);

  /**
   * Fetch products from API
   */
  const fetchProducts = useCallback(async (
    page = pagination.page,
    limit = pagination.limit,
    currentFilters = filters
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQueryParams(currentFilters, page, limit);

      const response = await axios.get(API_URL, {
        ...getAuthConfig(),
        params
      });

        console.log('API Response:', response.data);
    console.log('Response structure:', response.data.data);
    console.log('Response success:', response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch products');
      }

      // Transform products
      const transformedProducts = transformProductsResponse(response.data);
 console.log('Transformed products:', transformedProducts);
      setProducts(transformedProducts);
      setStatistics(response.data.statistics || null);
      setPagination({
        total: response.data.total || 0,
        activeCount: response.data.activeCount || 0,
        inactiveCount: response.data.inactiveCount || 0,
        page: response.data.page || page,
        limit: response.data.limit || limit
      });

      return { success: true, data: transformedProducts };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching products:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams, filters, pagination.page, pagination.limit]);

  /**
   * Create a new product
   */
  const createProduct = useCallback(async (productData: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(API_URL, productData, getAuthConfig());

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create product');
      }

      // Refresh the list
      await fetchProducts();

      return { success: true, data: response.data.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  /**
   * Update a product
   */
  const updateProduct = useCallback(async (id: string, productData: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(`${API_URL}/${id}`, productData, getAuthConfig());

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update product');
      }

      // Update the product in the list
      setProducts(prev => 
        prev.map(p => p.id === id ? transformProduct(response.data.data) : p)
      );

      return { success: true, data: response.data.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a product
   */
  const deleteProduct = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete product');
      }

      // Remove from list
      setProducts(prev => prev.filter(p => p.id !== id));

      // Update pagination
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }));

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a single product by ID
   */
  const getProductById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/${id}`, {
        ...getAuthConfig(),
        params: { populate: 'categoryId' }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch product');
      }

      return { success: true, data: transformProduct(response.data.data) };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update filters and refetch
   */
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchProducts(1, pagination.limit, updatedFilters);
  }, [filters, pagination.limit, fetchProducts]);

  /**
   * Search by category levels
   */
  const searchByCategory = useCallback((level1Id?: string, level2Id?: string, level3Id?: string) => {
    const categoryFilters: ProductFilters = {};
    
    if (level1Id) categoryFilters.level1CategoryId = level1Id;
    if (level2Id) categoryFilters.level2CategoryId = level2Id;
    if (level3Id) categoryFilters.level3CategoryId = level3Id;

    updateFilters(categoryFilters);
  }, [updateFilters]);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    setFilters({});
    fetchProducts(1, pagination.limit, {});
  }, [fetchProducts, pagination.limit]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page: number) => {
    fetchProducts(page, pagination.limit, filters);
  }, [fetchProducts, pagination.limit, filters]);

  /**
   * Change page size
   */
  const changePageSize = useCallback((limit: number) => {
    fetchProducts(1, limit, filters);
  }, [fetchProducts, filters]);

  /**
   * Refetch current page
   */
  const refetch = useCallback(() => {
    fetchProducts(pagination.page, pagination.limit, filters);
  }, [fetchProducts, pagination.page, pagination.limit, filters]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Data
    products,
    loading,
    error,
    statistics,
    pagination,
    filters,

    // CRUD operations
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,

    // Filter operations
    updateFilters,
    searchByCategory,
    resetFilters,

    // Pagination
    goToPage,
    changePageSize,
    refetch,
    fetchProducts
  };
};