// hooks/useMarketplaceDistribution.ts
import { useState, useMemo, useCallback } from 'react';
import { Product } from '@/app/dashboard/inventory-dashboard/product/types/product';

export function useDynamicMarketplace(products: Product[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [listingStatus, setListingStatus] = useState('all');
  const [stockStatus, setStockStatus] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });

  const categories = useMemo(() => {
    const names = new Set(
      products
        .map((p) => p.primaryCategory?.name)
        .filter((n): n is string => Boolean(n))
    );
    return Array.from(names);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      // ✅ FIX: Match against primaryCategory.name instead of categoryId
      const matchesCategory =
        selectedCategory === 'all' ||
        product.primaryCategory?.name === selectedCategory;

      const matchesMarketplace = selectedMarketplace === 'all';

      const matchesStock =
        stockStatus === 'all' ||
        (stockStatus === 'in-stock' && (product.stockQuantity || 0) > 0) ||
        (stockStatus === 'low-stock' && (product.stockQuantity || 0) > 0 && (product.stockQuantity || 0) < 10) ||
        (stockStatus === 'out-of-stock' && (product.stockQuantity || 0) === 0);

      const matchesPrice =
        (product.price || 0) >= priceRange.min && (product.price || 0) <= priceRange.max;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMarketplace &&
        matchesStock &&
        matchesPrice
      );
    });
  }, [products, searchTerm, selectedCategory, selectedMarketplace, stockStatus, priceRange]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedMarketplace('all');
    setListingStatus('all');
    setStockStatus('all');
    setPriceRange({ min: 0, max: 999999 });
  }, []);

  const hasActiveFilters =
    !!searchTerm ||
    selectedCategory !== 'all' ||
    selectedMarketplace !== 'all' ||
    listingStatus !== 'all' ||
    stockStatus !== 'all' ||
    priceRange.min > 0 ||
    priceRange.max < 999999;

  return {
    filteredProducts,
    categories,
    filters: {
      searchTerm,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      selectedMarketplace,
      setSelectedMarketplace,
      listingStatus,
      setListingStatus,
      stockStatus,
      setStockStatus,
      priceRange,
      setPriceRange,
      hasActiveFilters,
      clearFilters,
    },
  };
}