'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search, ChevronDown, Package, BarChart3, Layers } from 'lucide-react';

import { useDynamicMarketplace } from '../../../../../hooks/useMarketplaceDistribution';
import { useDynamicMarketplaces } from '../hooks/useDynamicMarketplaces';
import { Product } from '../types/product';
import ProductRow from './ProductRow';

interface DynamicMarketplaceTabProps {
  products: Product[];
}

export default function DynamicMarketplaceTab({ products }: DynamicMarketplaceTabProps) {
  const { filteredProducts, categories, filters } = useDynamicMarketplace(products);

  const {
    availableMarketplaces,
    marketplacePrices,
    quantities,
    marketplaceTotals,
    actions,
  } = useDynamicMarketplaces(products);

  const [showFilters, setShowFilters] = useState(true);
  const totalCols = 3 + availableMarketplaces.length + 2;

  if (availableMarketplaces.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-lg">
        <Layers className="h-16 w-16 mx-auto text-gray-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">No Marketplaces Connected</h3>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
          Connect at least one marketplace from Settings, then add marketplace pricing to your products.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            Marketplace Distribution
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {availableMarketplaces.length} marketplace(s) · {products.length} product(s)
          </p>
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        <motion.div whileHover={{ scale: 1.02, y: -4 }}>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/20 rounded-xl"><Package className="h-5 w-5" /></div>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">All</span>
            </div>
            <p className="text-3xl font-bold mt-4">{marketplaceTotals.grandTotal}</p>
            <p className="text-sm opacity-90 mt-1">Total allocated</p>
          </div>
        </motion.div>

        {availableMarketplaces.map((mp, i) => {
          const total = marketplaceTotals.totals[mp.id] ?? 0;
          const pct   = marketplaceTotals.grandTotal > 0
            ? ((total / marketplaceTotals.grandTotal) * 100).toFixed(1) : '0.0';
          return (
            <motion.div key={mp.id} whileHover={{ scale: 1.02, y: -4 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <div className={`${mp.bgColor} rounded-xl shadow-lg p-6 text-white`}>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-white/20 rounded-xl" />
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">{pct}%</span>
                </div>
                <p className="text-3xl font-bold mt-4">{total}</p>
                <p className="text-sm opacity-90 mt-1">{mp.displayName}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div key="filters"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {filters.hasActiveFilters && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">Active</span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" value={filters.searchTerm}
                      onChange={e => filters.setSearchTerm(e.target.value)}
                      placeholder="Name or SKU..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={filters.selectedCategory} onChange={e => filters.setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="all">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace</label>
                  <select value={filters.selectedMarketplace} onChange={e => filters.setSelectedMarketplace(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="all">All Marketplaces</option>
                    {availableMarketplaces.map(mp => <option key={mp.id} value={mp.id}>{mp.displayName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                  <select value={filters.stockStatus} onChange={e => filters.setStockStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="all">All</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock (&lt;10)</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (£)</label>
                  <input type="number" value={filters.priceRange.min || ''}
                    onChange={e => filters.setPriceRange((p: any) => ({ ...p, min: Number(e.target.value) }))}
                    placeholder="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (£)</label>
                  <input type="number" value={filters.priceRange.max === 999999 ? '' : filters.priceRange.max}
                    onChange={e => filters.setPriceRange((p: any) => ({ ...p, max: e.target.value ? Number(e.target.value) : 999999 }))}
                    placeholder="No limit" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              {filters.hasActiveFilters && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-900">
                    Showing {filteredProducts.length} of {products.length} products
                  </span>
                  <button onClick={filters.clearFilters}
                    className="flex items-center gap-1 px-3 py-1 bg-white rounded-lg text-sm text-red-600 hover:bg-red-50 border border-red-200">
                    <X className="h-3 w-3" /> Clear all
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-indigo-50 border-b-2 border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">Product</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">SKU</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">Stock</th>
                {availableMarketplaces.map(mp => (
                  <th key={mp.id} className={`text-center p-4 font-semibold text-sm ${mp.textColor}`}>
                    <div className="flex flex-col items-center gap-0.5">
                      <span>{mp.displayName}</span>
                      <span className="text-xs font-normal text-gray-400">price · qty</span>
                    </div>
                  </th>
                ))}
                <th className="text-center p-4 font-semibold text-gray-700 text-sm">Total</th>
                <th className="text-center p-4 font-semibold text-gray-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={totalCols} className="py-16 text-center text-gray-400">
                    <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No products match your filters</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    index={index}
                    availableMarketplaces={availableMarketplaces}
                    quantities={quantities[product.id] ?? {}}
                    marketplacePrices={marketplacePrices[product.id] ?? {}}
                    onUpdateQuantity={actions.updateQuantity}
                    onSetQuantity={actions.setQuantity}
                    onEquallyDistribute={actions.equallyDistribute}
                    onListProduct={actions.listProduct}
                  />
                ))
              )}
            </tbody>
            {filteredProducts.length > 0 && (
              <tfoot>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2 border-gray-200">
                  <td colSpan={3} className="p-4 font-bold text-gray-900 text-sm">
                    TOTALS ({filteredProducts.length} products)
                  </td>
                  {availableMarketplaces.map(mp => (
                    <td key={`footer-${mp.id}`} className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-sm ${mp.bgColor} text-white shadow`}>
                        {marketplaceTotals.totals[mp.id] ?? 0}
                      </span>
                    </td>
                  ))}
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                      {marketplaceTotals.grandTotal}
                    </span>
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        {filteredProducts.length === 0 && filters.hasActiveFilters && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
            <button onClick={filters.clearFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// 'use client';
// ─────────────────────────────────────────────────────────────────────────────
// DynamicMarketplaceTab.tsx
// Fully dynamic — driven by real marketplace connections from backend.
// Supports single product with multiple marketplace listings
// ─────────────────────────────────────────────────────────────────────────────

// 'use client';

// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Filter, X, Search, Shuffle, Plus, Minus, ChevronDown,
//   Package, BarChart3, Layers, CheckCircle, AlertCircle,
//   AlertTriangle, Loader2, Store, ExternalLink,
// } from 'lucide-react';

// import { useDynamicMarketplace } from '../../../../../hooks/useMarketplaceDistribution';
// import { Product } from '../types/product';
// import Image from 'next/image';

// interface DynamicMarketplaceTabProps {
//   products: Product[];
// }

// export default function DynamicMarketplaceTab({ products }: DynamicMarketplaceTabProps) {
//   const {
//     availableMarketplaces,
//     quantities,
//     filteredProducts,
//     categories,
//     marketplaceTotals,
//     connectionsLoading,
//     distributeStatus,
//     getProductListings,
//     filters,
//     actions,
//   } = useDynamicMarketplace(products);

//   const [showFilters, setShowFilters] = useState(true);
//   const [expandedProducts, setExpandedProducts] = useState<string[]>([]);

//   const toggleProductExpand = (productId: string) => {
//     setExpandedProducts(prev =>
//       prev.includes(productId)
//         ? prev.filter(id => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   if (connectionsLoading) {
//     return (
//       <div className="flex items-center justify-center py-16">
//         <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//         <span className="ml-3 text-gray-600">Loading marketplace connections...</span>
//       </div>
//     );
//   }

//   if (!availableMarketplaces.length) {
//     return (
//       <div className="text-center py-16 bg-white rounded-xl shadow-lg">
//         <Layers className="h-16 w-16 mx-auto text-gray-300" />
//         <h3 className="mt-4 text-xl font-semibold text-gray-900">No Connected Marketplaces</h3>
//         <p className="text-gray-500 mt-2 max-w-sm mx-auto">
//           Connect at least one marketplace from Settings before distributing products.
//         </p>
//       </div>
//     );
//   }

//   const totalCols = 3 + availableMarketplaces.length + 2;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <BarChart3 className="h-6 w-6 text-indigo-600" />
//               Marketplace Distribution
//             </h1>
//             <p className="text-gray-500 mt-1 text-sm">
//               {availableMarketplaces.length} connected · {products.length} products
//             </p>
//           </div>
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border hover:bg-gray-100"
//           >
//             <Filter className="h-4 w-4" />
//             {showFilters ? 'Hide' : 'Show'} Filters
//             <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//           </button>
//         </div>

//         {/* Info Box */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
//           <p className="font-medium mb-2">📦 How Distribution Works:</p>
//           <ul className="list-disc list-inside space-y-1">
//             <li>Set quantities for each marketplace using + / - buttons</li>
//             <li>Click <span className="font-semibold">&quot;Distribute&quot;</span> to list products on marketplaces</li>
//             <li>After distribution, quantities will be <span className="font-semibold">deducted from your main stock</span></li>
//             <li>Each marketplace gets its own allocated quantity</li>
//             <li>Use <span className="font-semibold">&quot;Split&quot;</span> to divide total quantity equally across all marketplaces</li>
//           </ul>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
//         {/* Total Stock */}
//         <motion.div key="total-stats" whileHover={{ scale: 1.02 }}>
//           <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
//             <div className="flex justify-between items-start">
//               <Package className="h-6 w-6 opacity-90" />
//               <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Total</span>
//             </div>
//             <p className="text-3xl font-bold mt-4">{marketplaceTotals.grandTotal}</p>
//             <p className="text-sm opacity-90">Units to Distribute</p>
//           </div>
//         </motion.div>

//         {/* Marketplace Cards */}
//         {availableMarketplaces.map((mp, i) => {
//           const total = marketplaceTotals.totals[mp.id] ?? 0;
//           const percentage = marketplaceTotals.grandTotal > 0
//             ? ((total / marketplaceTotals.grandTotal) * 100).toFixed(1)
//             : '0';
//           const Icon = mp.icon;

//           return (
//             <motion.div
//               key={mp.id}
//               whileHover={{ scale: 1.02 }}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.05 }}
//             >
//               <div className={`${mp.bgColor} rounded-xl shadow-lg p-6 text-white`}>
//                 <div className="flex justify-between items-start">
//                   <Icon className="h-6 w-6 opacity-90" />
//                   <span className="px-2 py-1 bg-white/20 rounded-full text-xs">{percentage}%</span>
//                 </div>
//                 <p className="text-3xl font-bold mt-4">{total}</p>
//                 <p className="text-sm opacity-90">{mp.displayName}</p>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Filters */}
//       <AnimatePresence>
//         {showFilters && (
//           <motion.div
//             key="filters-panel"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="overflow-hidden"
//           >
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <Filter className="h-5 w-5 text-indigo-600" />
//                 <h3 className="font-semibold text-gray-900">Filters</h3>
//                 {filters.hasActiveFilters && (
//                   <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
//                     Active
//                   </span>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {/* Search */}
//                 <div key="filter-search">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="text"
//                       value={filters.searchTerm}
//                       onChange={(e) => filters.setFilter('searchTerm', e.target.value)}
//                       placeholder="Product name or SKU..."
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>
//                 </div>

//                 {/* Category */}
//                 <div key="filter-category">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                   <select
//                     value={filters.selectedCategory}
//                     onChange={(e) => filters.setFilter('selectedCategory', e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="all">All Categories</option>
//                     {categories.map(cat => (
//                       <option key={cat} value={cat}>{cat}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Marketplace */}
//                 <div key="filter-marketplace">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace</label>
//                   <select
//                     value={filters.selectedMarketplace}
//                     onChange={(e) => filters.setFilter('selectedMarketplace', e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="all">All Marketplaces</option>
//                     {availableMarketplaces.map(mp => (
//                       <option key={mp.id} value={mp.id}>{mp.displayName}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Stock Status */}
//                 <div key="filter-stock">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
//                   <select
//                     value={filters.stockStatus}
//                     onChange={(e) => filters.setFilter('stockStatus', e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="all">All</option>
//                     <option value="in-stock">In Stock</option>
//                     <option value="low-stock">Low Stock (&lt;10)</option>
//                     <option value="out-of-stock">Out of Stock</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Price Range */}
//               <div className="mt-4 grid grid-cols-2 gap-4" key="filter-price">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (£)</label>
//                   <input
//                     type="number"
//                     min={0}
//                     value={filters.priceRange.min || ''}
//                     onChange={(e) => filters.setFilter('priceRange', {
//                       ...filters.priceRange,
//                       min: e.target.value ? Number(e.target.value) : 0
//                     })}
//                     className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
//                     placeholder="0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (£)</label>
//                   <input
//                     type="number"
//                     min={0}
//                     value={filters.priceRange.max === 999999 ? '' : filters.priceRange.max}
//                     onChange={(e) => filters.setFilter('priceRange', {
//                       ...filters.priceRange,
//                       max: e.target.value ? Number(e.target.value) : 999999
//                     })}
//                     className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
//                     placeholder="No limit"
//                   />
//                 </div>
//               </div>

//               {/* Active Filters */}
//               {filters.hasActiveFilters && (
//                 <div key="active-filters" className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
//                   <span className="text-sm font-medium text-indigo-900">
//                     {filteredProducts.length} of {products.length} products shown
//                   </span>
//                   <button
//                     onClick={filters.clearFilters}
//                     className="flex items-center gap-1 px-3 py-1 bg-white rounded-lg text-sm text-red-600 hover:bg-red-50 border border-red-200"
//                   >
//                     <X className="h-3 w-3" />
//                     Clear All
//                   </button>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Products Table */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gradient-to-r from-gray-50 to-indigo-50 border-b-2 border-gray-200">
//                 <th className="text-left p-4 font-semibold text-gray-700 text-sm">Product</th>
//                 <th className="text-left p-4 font-semibold text-gray-700 text-sm">SKU</th>
//                 <th className="text-left p-4 font-semibold text-gray-700 text-sm">Stock</th>
//                 {availableMarketplaces.map((mp) => (
//                   <th key={mp.id} className={`text-center p-4 font-semibold text-sm ${mp.textColor}`}>
//                     <div className="flex items-center justify-center gap-1">
//                       <mp.icon className="h-4 w-4" />
//                       <span>{mp.displayName}</span>
//                     </div>
//                   </th>
//                 ))}
//                 <th className="text-center p-4 font-semibold text-gray-700 text-sm">Total</th>
//                 <th className="text-center p-4 font-semibold text-gray-700 text-sm">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredProducts.length === 0 ? (
//                 <tr key="no-products">
//                   <td colSpan={totalCols} className="py-16 text-center text-gray-400">
//                     <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
//                     <p className="font-medium">No products match your filters</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredProducts.map((product, index) => {
//                   const productQtys = quantities[product._id] ?? {};
//                   const totalSelected = Object.values(productQtys).reduce((s, q) => s + q, 0);
//                   const availableStock = product.stockQuantity || 0;
//                   const status = distributeStatus[product._id];
//                   const isDistributing = status?.status === 'loading';
//                   const existingListings = getProductListings(product._id);
//                   const hasListings = existingListings.length > 0;
//                   const isExpanded = expandedProducts.includes(product._id);

//                   // ✅ FIX: Use React.Fragment with key instead of shorthand <>
//                   return (
//                     <React.Fragment key={index}>

//                       {/* Main Product Row */}
//                       <motion.tr
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
//                           hasListings ? 'cursor-pointer' : ''
//                         }`}
//                         onClick={() => hasListings && toggleProductExpand(product._id)}
//                       >
//                         {/* Product Info */}
//                         <td className="p-4">
//                           <div className="flex items-center gap-3">
//                             {product.images?.[0] && (
//                               <Image
//                                 src={product.images[0]}
//                                 alt={product.productName}
//                                 width={40}
//                                 height={40}
//                                 className="w-10 h-10 rounded-lg object-cover"
//                                 onError={(e) => {
//                                   (e.target as HTMLImageElement).style.display = 'none';
//                                 }}
//                               />
//                             )}
//                             <div>
//                               <p className="font-semibold text-gray-900 text-sm">{product.productName}</p>
//                               {product.categoryPath?.length > 0 && (
//                                 <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full mt-1 inline-block">
//                                   {product.categoryPath[product.categoryPath.length - 1]?.name}
//                                 </span>
//                               )}
//                               {hasListings && (
//                                 <span className="text-xs text-green-600 mt-1 block">
//                                   {existingListings.length} existing listing(s)
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </td>

//                         {/* SKU */}
//                         <td className="p-4">
//                           <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
//                             {product.sku}
//                           </span>
//                         </td>

//                         {/* Available Stock */}
//                         <td className="p-4">
//                           <div className="flex flex-col">
//                             <span className={`font-semibold text-sm ${
//                               availableStock === 0 ? 'text-red-600' :
//                               availableStock < 10 ? 'text-amber-600' : 'text-green-600'
//                             }`}>
//                               {availableStock}
//                             </span>
//                           </div>
//                         </td>

//                         {/* Marketplace Quantities */}
//                         {availableMarketplaces.map((mp) => {
//                           const quantity = productQtys[mp.id] ?? 0;
//                           const maxReached = quantity >= availableStock;

//                           return (
//                             <td key={`${product._id}-${mp.id}`} className="p-4">
//                               <div className="flex flex-col items-center gap-1">
//                                 <div className="flex items-center gap-1">
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       actions.updateQuantity(product._id, mp.id, -1);
//                                     }}
//                                     disabled={quantity === 0 || isDistributing}
//                                     className="h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
//                                   >
//                                     <Minus className="h-3 w-3" />
//                                   </button>

//                                   <span className={`h-9 w-12 flex items-center justify-center rounded-lg font-bold text-sm ${
//                                     quantity > 0
//                                       ? `${mp.badgeBg} ${mp.textColor}`
//                                       : 'bg-gray-100 text-gray-400'
//                                   }`}>
//                                     {quantity}
//                                   </span>

//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       actions.updateQuantity(product._id, mp.id, 1);
//                                     }}
//                                     disabled={maxReached || isDistributing}
//                                     className="h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-green-50 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed"
//                                   >
//                                     <Plus className="h-3 w-3" />
//                                   </button>
//                                 </div>
//                               </div>
//                             </td>
//                           );
//                         })}

//                         {/* Total Selected */}
//                         <td className="p-4 text-center">
//                           <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-sm ${
//                             totalSelected > availableStock
//                               ? 'bg-red-100 text-red-700'
//                               : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
//                           }`}>
//                             {totalSelected}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td className="p-4">
//                           <div className="flex flex-col items-center gap-2">
//                             {/* Split Button */}
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 actions.equallyDistribute(product._id);
//                               }}
//                               disabled={isDistributing || availableStock === 0}
//                               className="inline-flex items-center gap-1 px-3 py-1.5 border border-indigo-300 text-indigo-700 rounded-lg text-xs hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                             >
//                               <Shuffle className="h-3 w-3" />
//                               Split
//                             </button>

//                             {/* Distribute Button */}
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 actions.distribute(product._id);
//                               }}
//                               disabled={isDistributing || totalSelected === 0 || totalSelected > availableStock}
//                               className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all ${
//                                 totalSelected > availableStock
//                                   ? 'bg-gray-400 cursor-not-allowed'
//                                   : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
//                               }`}
//                             >
//                               {isDistributing ? (
//                                 <>
//                                   <Loader2 className="h-3 w-3 animate-spin" />
//                                   Distributing...
//                                 </>
//                               ) : (
//                                 <>
//                                   <BarChart3 className="h-3 w-3" />
//                                   {hasListings ? 'Update' : 'Distribute'}
//                                 </>
//                               )}
//                             </button>

//                             {/* Status Badge */}
//                             {status && status.status !== 'idle' && (
//                               <div className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${
//                                 status.status === 'success' ? 'bg-green-100 text-green-700' :
//                                 status.status === 'partial' ? 'bg-amber-100 text-amber-700' :
//                                 status.status === 'error' ? 'bg-red-100 text-red-700' :
//                                 'bg-blue-100 text-blue-700'
//                               }`}>
//                                 {status.status === 'success' && <CheckCircle className="h-3 w-3" />}
//                                 {status.status === 'partial' && <AlertTriangle className="h-3 w-3" />}
//                                 {status.status === 'error' && <AlertCircle className="h-3 w-3" />}
//                                 {status.status === 'loading' && <Loader2 className="h-3 w-3 animate-spin" />}
//                                 <span>{status.message || status.status}</span>
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                       </motion.tr>

//                       {/* Results Row */}
//                       {status?.results && status.results.length > 0 && (
//                         <tr className="bg-gray-50">
//                           <td colSpan={totalCols} className="px-4 pb-3">
//                             <div className="flex flex-wrap gap-2 mt-2">
//                               {status.results.map((result, idx) => (
//                                 <div
//                                   key={`${product._id}-result-${idx}`}
//                                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
//                                     result.success
//                                       ? 'bg-green-50 border-green-200 text-green-800'
//                                       : 'bg-red-50 border-red-200 text-red-800'
//                                   }`}
//                                 >
//                                   {result.success ? (
//                                     <CheckCircle className="h-3.5 w-3.5" />
//                                   ) : (
//                                     <AlertCircle className="h-3.5 w-3.5" />
//                                   )}
//                                   <span className="capitalize">{result.marketplaceName}</span>
//                                   {result.success ? (
//                                     <span className="opacity-75 ml-1">✓</span>
//                                   ) : (
//                                     <span className="opacity-75 ml-1" title={result.error}>✗</span>
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                           </td>
//                         </tr>
//                       )}

//                       {/* Expanded Listings */}
//                       {isExpanded && existingListings.map((listing, idx) => (
//                         <motion.tr
//                           key={`${product._id}-listing-${idx}`}
//                           initial={{ opacity: 0, y: -10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="bg-gray-50/50 border-b border-gray-100"
//                         >
//                           <td className="p-4 pl-12">
//                             <div className="flex items-center gap-2">
//                               <Store className="h-4 w-4 text-gray-400" />
//                               <span className="text-sm font-medium text-gray-700">
//                                 {listing.marketplaceName} Listing
//                               </span>
//                             </div>
//                           </td>
//                           <td colSpan={2} className="p-4">
//                             <div className="text-sm text-gray-600">
//                               {listing.listingId && <div>ID: {listing.listingId}</div>}
//                             </div>
//                           </td>
//                           <td colSpan={availableMarketplaces.length} className="p-4">
//                             <div className="flex items-center gap-4 text-sm">
//                               {listing.quantity && (
//                                 <span className="text-gray-600">
//                                   Listed: {listing.quantity}
//                                 </span>
//                               )}
//                               {listing.status && (
//                                 <span className="text-gray-600">
//                                   Status: {listing.status}
//                                 </span>
//                               )}
//                               {listing.listingUrl && (
//                                 <a
//                                   href={listing.listingUrl}
//                                   target="_blank"
//                                   rel="noreferrer"
//                                   className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
//                                 >
//                                   View <ExternalLink className="h-3 w-3" />
//                                 </a>
//                               )}
//                             </div>
//                           </td>
//                           <td></td>
//                         </motion.tr>
//                       ))}

//                     </React.Fragment>
//                   );
//                 })
//               )}
//             </tbody>

//             {/* Footer */}
//             {filteredProducts.length > 0 && (
//               <tfoot>
//                 <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2 border-gray-200">
//                   <td colSpan={3} className="p-4 font-bold text-gray-900 text-sm">
//                     TOTALS ({filteredProducts.length} products)
//                   </td>
//                   {availableMarketplaces.map((mp) => (
//                     <td key={`footer-${mp.id}`} className="p-4 text-center">
//                       <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-sm ${mp.bgColor} text-white shadow`}>
//                         {marketplaceTotals.totals[mp.id] ?? 0}
//                       </span>
//                     </td>
//                   ))}
//                   <td className="p-4 text-center">
//                     <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
//                       {marketplaceTotals.grandTotal}
//                     </span>
//                   </td>
//                   <td />
//                 </tr>
//               </tfoot>
//             )}
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }