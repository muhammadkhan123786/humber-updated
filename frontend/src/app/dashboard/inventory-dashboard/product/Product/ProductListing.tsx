// components/product/ProductListing.tsx
import { useState, useMemo } from 'react';
// import { Product, ProductStats } from '../components/Interface';
import { ProductStatistics } from './ProductStats';
import { CategoryFilters } from './CategoryFilters';
import { ProductCard } from './ProductCard';
import { useProductFilters } from '../../../../../hooks/useProductFilters';
import { CheckCircle, AlertCircle, Package } from "lucide-react"
import { Product, ProductStats } from '../types/product';

interface ProductListingProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
}

export const ProductListing = ({ 
  products, 
  onViewProduct, 
  onEditProduct 
}: ProductListingProps) => {
  const {
    searchTerm,
    selectedLevel1,
    selectedLevel2,
    selectedLevel3,
    selectedStatus,
    filteredProducts,
    categoriesLevel1,
    filteredLevel2,
    filteredLevel3,
    handleSearchChange,
    handleLevel1Change,
    handleLevel2Change,
    handleLevel3Change,
    handleStatusChange
  } = useProductFilters(products);

  const stats: ProductStats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    inStock: products.filter(p => p.stockStatus === 'in-stock').length,
    lowStock: products.filter(p => p.stockStatus === 'low-stock').length,
    outOfStock: products.filter(p => p.stockStatus === 'out-of-stock').length,
    featured: products.filter(p => p.featured).length
  }), [products]);

  const getStockBadge = (status: string) => {
    const variants: Record<string, { class: string; icon: any }> = {
      'in-stock': { 
        class: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white',
        icon: CheckCircle
      },
      'low-stock': { 
        class: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
        icon: AlertCircle
      },
      'out-of-stock': { 
        class: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
        icon: AlertCircle
      }
    };
    return variants[status] || variants['in-stock'];
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <ProductStatistics stats={stats} />

      {/* Filters */}
    <CategoryFilters
  searchTerm={searchTerm}
  onSearchChange={handleSearchChange}
  categoriesLevel1={categoriesLevel1}  
  categoriesLevel2={filteredLevel2} 
  categoriesLevel3={filteredLevel3}
   filteredLevel2={filteredLevel2}
  filteredLevel3={filteredLevel3}
  selectedLevel1={selectedLevel1}
  selectedLevel2={selectedLevel2}
  selectedLevel3={selectedLevel3}
  selectedStatus={selectedStatus}
  onLevel1Change={handleLevel1Change}
  onLevel2Change={handleLevel2Change}
  onLevel3Change={handleLevel3Change}
  onStatusChange={handleStatusChange}
/>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onView={onViewProduct}
              onEdit={onEditProduct}
              getStockBadge={getStockBadge}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};