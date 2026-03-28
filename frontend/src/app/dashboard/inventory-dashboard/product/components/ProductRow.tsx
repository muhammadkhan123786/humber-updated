'use client';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Minus, Shuffle, CheckCircle, XCircle,
  TrendingUp, Send, Loader2, AlertCircle,
} from 'lucide-react';
import Image from 'next/image';
import type { AvailableMarketplace, MarketplacePrice } from '../hooks/useDynamicMarketplaces';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ListResult {
  marketplaceId:   string;
  marketplaceName: string;
  success:         boolean;
  error?:          string;
}

interface ProductRowProps {
  product:               any;
  index:                 number;
  availableMarketplaces: AvailableMarketplace[];
  quantities:            Record<string, number>;
  marketplacePrices:     Record<string, MarketplacePrice | undefined>;
  onUpdateQuantity:      (productId: string, mpId: string, delta: number) => void;
  onSetQuantity:         (productId: string, mpId: string, value: number) => void;
 onEquallyDistribute: (productId: string, pricedMpIds: string[]) => void;
  onListProduct:         (productId: string, distributions: { mpId: string; qty: number }[]) => Promise<ListResult[]>;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProductRow({
  product,
  index,
  availableMarketplaces,
  quantities,
  marketplacePrices,
  onUpdateQuantity,
  onSetQuantity,
  onEquallyDistribute,
  onListProduct,
}: ProductRowProps) {
  const stock           = product.stockQuantity ?? 0;
  const safeQtys        = quantities ?? {};
  const totalAllocated  = Object.values(safeQtys).reduce((s, q) => s + q, 0);
  const isOverAllocated = totalAllocated > stock;

  const [listing,     setListing]     = useState(false);
  const [listResults, setListResults] = useState<ListResult[] | null>(null);

  const stockColor =
    stock === 0 ? 'text-red-600' : stock < 10 ? 'text-amber-600' : 'text-green-600';
  const stockLabel =
    stock === 0 ? 'Out of stock' : stock < 10 ? 'Low stock' : 'In stock';

  // ── List handler: only priced MPs with qty > 0 ────────────────────────────
  const handleList = useCallback(async () => {
    const distributions = availableMarketplaces
      .filter(mp => marketplacePrices?.[mp.id] && (safeQtys[mp.id] ?? 0) > 0)
      .map(mp => ({ mpId: mp.id, qty: safeQtys[mp.id] }));
    if (!distributions.length) return;
    setListing(true);
    setListResults(null);
    try {
      const results = await onListProduct(product.id, distributions);
      setListResults(results);
    } finally {
      setListing(false);
    }
  }, [availableMarketplaces, marketplacePrices, safeQtys, product.id, onListProduct]);

  // ── Split: only distribute to priced MPs ─────────────────────────────────
  const handleSplit = useCallback(() => {
    const pricedMps = availableMarketplaces.filter(mp => !!marketplacePrices?.[mp.id]);
    if (!pricedMps.length || stock === 0) return;
    const per       = Math.floor(stock / pricedMps.length);
    const remainder = stock % pricedMps.length;
    availableMarketplaces.forEach(mp => onSetQuantity(product.id, mp.id, 0));
    pricedMps.forEach((mp, i) => onSetQuantity(product.id, mp.id, per + (i < remainder ? 1 : 0)));
  }, [availableMarketplaces, marketplacePrices, stock, product.id, onSetQuantity]);

  const canList = availableMarketplaces.some(
    mp => marketplacePrices?.[mp.id] && (safeQtys[mp.id] ?? 0) > 0
  );

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-colors"
      >
        {/* Product */}
        <td className="p-4">
          <div className="flex items-center gap-3">
            {product.imageUrl && (
              <Image
                src={product.imageUrl} alt={product.name ?? ''}
                width={40} height={40}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div>
              <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
              {product.primaryCategory?.name && (
                <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full mt-0.5 inline-block">
                  {product.primaryCategory.name}
                </span>
              )}
            </div>
          </div>
        </td>

        {/* SKU */}
        <td className="p-4">
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
            {product.sku}
          </span>
        </td>

        {/* Stock */}
        <td className="p-4">
          <div className="flex flex-col gap-0.5">
            <span className={`font-bold text-base ${stockColor}`}>{stock}</span>
            <span className="text-xs text-gray-400">{stockLabel}</span>
            {totalAllocated > 0 && (
              <span className={`text-xs font-medium ${isOverAllocated ? 'text-red-500' : 'text-gray-400'}`}>
                {isOverAllocated
                  ? `${totalAllocated - stock} over limit`
                  : `${stock - totalAllocated} remaining`}
              </span>
            )}
          </div>
        </td>

        {/* Marketplace cells */}
        {availableMarketplaces.map(mp => {
          const price      = marketplacePrices?.[mp.id];
          const qty        = safeQtys[mp.id] ?? 0;
          const hasPrice   = !!price;
          const canInc     = totalAllocated < stock && hasPrice;
          const canDec     = qty > 0 && hasPrice;
          const margin     =
            hasPrice && price.costPrice && price.sellingPrice > 0
              ? (((price.sellingPrice - price.costPrice) / price.sellingPrice) * 100).toFixed(0)
              : null;

          return (
            <td key={`${product.id}-${mp.id}`} className="p-3">
              {hasPrice ? (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${mp.textColor}`}>
                      £{price.sellingPrice.toFixed(2)}
                    </span>
                    <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  {margin !== null && (
                    <div className="flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">{margin}%</span>
                    </div>
                  )}

                  {/* ✅ FIX 1: - [input] + with manual typing */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateQuantity(product.id, mp.id, -1)}
                      disabled={!canDec}
                      className="h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>

                    <input
                      type="number"
                      min={0}
                      max={stock}
                      value={qty === 0 ? '' : qty}
                      placeholder="0"
                      onChange={e => {
                        const raw = parseInt(e.target.value, 10);
                        const val = isNaN(raw) ? 0 : Math.max(0, Math.min(stock, raw));
                        onSetQuantity(product.id, mp.id, val);
                      }}
                      className={`h-9 w-14 text-center rounded-lg font-bold text-sm border
                        focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                        [&::-webkit-inner-spin-button]:appearance-none
                        ${qty > 0
                          ? `${mp.badgeBg} ${mp.textColor} border-transparent`
                          : 'bg-gray-100 text-gray-400 border-gray-200'
                        }
                        ${isOverAllocated && qty > 0 ? 'ring-2 ring-red-400' : ''}`}
                    />

                    <button
                      onClick={() => onUpdateQuantity(product.id, mp.id, 1)}
                      disabled={!canInc}
                      className="h-7 w-7 rounded-lg border flex items-center justify-center hover:bg-green-50 hover:text-green-600 hover:border-green-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                // ✅ FIX 2: no price = no controls at all, clean empty state
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <XCircle className="h-4 w-4 text-gray-300" />
                    <span className="text-xs text-gray-400">No price</span>
                  </div>
                </div>
              )}
            </td>
          );
        })}

        {/* Total */}
        <td className="p-4 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-sm ${
              isOverAllocated
                ? 'bg-red-100 text-red-700'
                : totalAllocated > 0
                ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {totalAllocated}
              {isOverAllocated && <AlertCircle className="h-3 w-3 ml-1" />}
            </span>
            {stock > 0 && (
              <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverAllocated ? 'bg-red-400' : 'bg-indigo-400'
                  }`}
                  style={{ width: `${Math.min(100, (totalAllocated / stock) * 100)}%` }}
                />
              </div>
            )}
          </div>
        </td>

        {/* Actions */}
        <td className="p-4">
          <div className="flex flex-col items-center gap-2">

            {/* Split — only priced marketplaces */}
            <button
              onClick={handleSplit}
              disabled={stock === 0}
              title="Split stock equally (only marketplaces with a price set)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-indigo-300 text-indigo-700 rounded-lg text-xs hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Shuffle className="h-3 w-3" />
              Split
            </button>

            {/* ✅ List Product button */}
            <button
              onClick={handleList}
              disabled={listing || !canList || isOverAllocated}
              title={
                !canList        ? 'Set qty on at least one priced marketplace' :
                isOverAllocated ? 'Total exceeds available stock' :
                'List product on selected marketplaces'
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                shadow-md hover:shadow-lg transition-all ${
                listing || !canList || isOverAllocated
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
              }`}
            >
              {listing
                ? <><Loader2 className="h-3 w-3 animate-spin" />Listing...</>
                : <><Send className="h-3 w-3" />List Product</>
              }
            </button>
          </div>
        </td>
      </motion.tr>

      {/* Listing results */}
      {listResults && listResults.length > 0 && (
        <tr className="bg-gray-50/80">
          <td colSpan={3 + availableMarketplaces.length + 2} className="px-6 py-3">
            <div className="flex flex-wrap gap-2">
              {listResults.map((r, i) => (
                <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  r.success
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {r.success
                    ? <CheckCircle className="h-3.5 w-3.5" />
                    : <AlertCircle className="h-3.5 w-3.5" />}
                  <span className="capitalize">{r.marketplaceName}</span>
                  <span className="opacity-70">{r.success ? '✓' : `✗ ${r.error ?? ''}`}</span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}