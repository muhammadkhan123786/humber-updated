'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, X, Search, ChevronDown,
  Package, BarChart3, Layers,
} from 'lucide-react';

import { useDynamicMarketplace } from '../../../../../hooks/useMarketplaceDistribution';
import { useDynamicMarketplaces } from '../hooks/useDynamicMarketplaces';
import { Product } from '../types/product';
import ProductRow from './ProductRow';

// ── Types ──────────────────────────────────────────────────────────────────────

interface DynamicMarketplaceTabProps {
  products: Product[];
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function DynamicMarketplaceTab({ products }: DynamicMarketplaceTabProps) {

  // Filters, categories, filteredProducts — from existing hook
  const {
    filteredProducts,
    categories,
    filters,
  } = useDynamicMarketplace(products);

  // Connections, prices, qty state, listing — from new hook
  const {
    availableMarketplaces,
    marketplacePrices,
    quantities,
    marketplaceTotals,
    actions,
  } = useDynamicMarketplaces(products);

  const [showFilters, setShowFilters] = useState(true);

  const totalCols = 3 + availableMarketplaces.length + 2;

  // ── Empty state ────────────────────────────────────────────────────────────
  if (availableMarketplaces.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-lg">
        <Layers className="h-16 w-16 mx-auto text-gray-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">No Marketplaces Connected</h3>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
          Connect at least one marketplace from Settings, then add marketplace pricing
          to your products.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ────────────────────────────────────────────────────────── */}
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
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border
            hover:bg-gray-100 transition-colors"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
            showFilters ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      {/* ── Stats cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        2xl:grid-cols-6 gap-4">

        {/* Grand total */}
        <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.15 }}>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl
            shadow-lg p-6 text-white h-full">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/20 rounded-xl">
                <Package className="h-5 w-5" />
              </div>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">All</span>
            </div>
            <p className="text-3xl font-bold mt-4 tabular-nums">
              {marketplaceTotals.grandTotal}
            </p>
            <p className="text-sm opacity-90 mt-1">Total allocated</p>
          </div>
        </motion.div>

        {/* Per-marketplace */}
        {availableMarketplaces.map((mp, i) => {
          const total = marketplaceTotals.totals[mp.id] ?? 0;
          const pct   = marketplaceTotals.grandTotal > 0
            ? ((total / marketplaceTotals.grandTotal) * 100).toFixed(1) : '0.0';

          return (
            <motion.div
              key={mp.id}
              whileHover={{ scale: 1.02, y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
            >
              <div className={`${mp.bgColor} rounded-xl shadow-lg p-6 text-white h-full`}>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-white/20 rounded-xl w-9 h-9" />
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                    {pct}%
                  </span>
                </div>
                <p className="text-3xl font-bold mt-4 tabular-nums">{total}</p>
                <p className="text-sm opacity-90 mt-1 truncate">{mp.displayName}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            key="filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {filters.hasActiveFilters && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700
                    rounded-full text-xs">
                    Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4
                      text-gray-400" />
                    <input
                      type="text"
                      value={filters.searchTerm}
                      onChange={e => filters.setSearchTerm(e.target.value)}
                      placeholder="Name or SKU…"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                        text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                        transition-colors"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.selectedCategory}
                    onChange={e => filters.setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                      focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Marketplace */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marketplace
                  </label>
                  <select
                    value={filters.selectedMarketplace}
                    onChange={e => filters.setSelectedMarketplace(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                      focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Marketplaces</option>
                    {availableMarketplaces.map(mp => (
                      <option key={mp.id} value={mp.id}>{mp.displayName}</option>
                    ))}
                  </select>
                </div>

                {/* Stock status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Status
                  </label>
                  <select
                    value={filters.stockStatus}
                    onChange={e => filters.setStockStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                      focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock (&lt;10)</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Price range */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price (£)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={filters.priceRange.min || ''}
                    onChange={e => filters.setPriceRange((p: any) => ({
                      ...p, min: Number(e.target.value),
                    }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                      focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price (£)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={filters.priceRange.max === 999999 ? '' : filters.priceRange.max}
                    onChange={e => filters.setPriceRange((p: any) => ({
                      ...p, max: e.target.value ? Number(e.target.value) : 999999,
                    }))}
                    placeholder="No limit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                      focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Active filter summary */}
              {filters.hasActiveFilters && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-center
                  justify-between">
                  <span className="text-sm font-medium text-indigo-900">
                    Showing {filteredProducts.length} of {products.length} products
                  </span>
                  <button
                    onClick={filters.clearFilters}
                    className="flex items-center gap-1 px-3 py-1 bg-white rounded-lg text-sm
                      text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Products table ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-indigo-50 border-b-2
                border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">
                  Product
                </th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">
                  SKU
                </th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm">
                  Stock
                </th>

                {availableMarketplaces.map(mp => (
                  <th
                    key={mp.id}
                    className={`text-center p-4 font-semibold text-sm ${mp.textColor}`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span>{mp.displayName}</span>
                      <span className="text-xs font-normal text-gray-400">
                        price · qty
                      </span>
                    </div>
                  </th>
                ))}

                <th className="text-center p-4 font-semibold text-gray-700 text-sm">
                  Total
                </th>
                <th className="text-center p-4 font-semibold text-gray-700 text-sm">
                  Actions
                </th>
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
                    // onEquallyDistribute={actions.equallyDistribute}
                    onListProduct={actions.listProduct}
                  />
                ))
              )}
            </tbody>

            {/* Totals footer */}
            {filteredProducts.length > 0 && (
              <tfoot>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2
                  border-gray-200">
                  <td colSpan={3} className="p-4 font-bold text-gray-900 text-sm">
                    TOTALS ({filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''})
                  </td>
                  {availableMarketplaces.map(mp => (
                    <td key={`footer-${mp.id}`} className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1.5
                        rounded-lg font-bold text-sm tabular-nums ${mp.bgColor} text-white
                        shadow`}>
                        {marketplaceTotals.totals[mp.id] ?? 0}
                      </span>
                    </td>
                  ))}
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center px-4 py-1.5
                      rounded-lg font-bold text-sm tabular-nums bg-gradient-to-r
                      from-indigo-600 to-purple-600 text-white shadow-lg">
                      {marketplaceTotals.grandTotal}
                    </span>
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* No results (filters active) */}
        {filteredProducts.length === 0 && filters.hasActiveFilters && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
            <button
              onClick={filters.clearFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg
                hover:bg-indigo-700 text-sm transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}