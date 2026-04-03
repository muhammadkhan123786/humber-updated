'use client';
import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Minus, Shuffle, CheckCircle, XCircle,
  TrendingUp, Send, Loader2, AlertCircle, ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import type {
  AvailableMarketplace,
  MarketplacePrice,
  ListResult,
  Distribution,
} from '../hooks/useDynamicMarketplaces';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProductRowProps {
  product:               any;
  index:                 number;
  availableMarketplaces: AvailableMarketplace[];
  quantities:            Record<string, number>;
  marketplacePrices:     Record<string, MarketplacePrice | undefined>;
  onUpdateQuantity:      (productId: string, mpId: string, delta: number) => void;
  onSetQuantity:         (productId: string, mpId: string, value: number) => void;
  // onEquallyDistribute:   any;
  onListProduct:         (productId: string, distributions: Distribution[]) => Promise<ListResult[]>;
}

// ── Component (memo — only re-renders when its own props change) ───────────────

const ProductRow = memo(function ProductRow({
  product,
  index,
  availableMarketplaces,
  quantities,
  marketplacePrices,
  onUpdateQuantity,
  onSetQuantity,
  // onEquallyDistribute,
  onListProduct,
}: ProductRowProps) {
  const stock           = product.stockQuantity ?? 0;
  const safeQtys        = quantities ?? {};
  const totalAllocated  = Object.values(safeQtys).reduce((s, q) => s + q, 0);
  const isOverAllocated = totalAllocated > stock;

  // Listing state
  const [listing,     setListing]     = useState(false);
  const [listResults, setListResults] = useState<ListResult[] | null>(null);

  // Stock status
  const stockColor =
    stock === 0 ? 'text-red-600' : stock < 10 ? 'text-amber-600' : 'text-green-600';
  const stockLabel =
    stock === 0 ? 'Out of stock' : stock < 10 ? 'Low stock' : 'In stock';

  // ── Split: only priced marketplaces receive stock ─────────────────────────
  const handleSplit = useCallback(() => {
    const pricedMps = availableMarketplaces.filter(mp => !!marketplacePrices?.[mp.id]);
    if (!pricedMps.length || stock === 0) return;

    const per       = Math.floor(stock / pricedMps.length);
    const remainder = stock % pricedMps.length;

    // Zero out all first
    availableMarketplaces.forEach(mp => onSetQuantity(product.id, mp.id, 0));
    // Then set priced ones
    pricedMps.forEach((mp, i) =>
      onSetQuantity(product.id, mp.id, per + (i < remainder ? 1 : 0))
    );
  }, [availableMarketplaces, marketplacePrices, stock, product.id, onSetQuantity]);

  // ── List: parallel fetch — only priced MPs with qty > 0 ───────────────────
  const handleList = useCallback(async () => {
    const distributions: Distribution[] = availableMarketplaces
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

  const canList = availableMarketplaces.some(
    mp => marketplacePrices?.[mp.id] && (safeQtys[mp.id] ?? 0) > 0
  );

  const listBtnTitle =
    !canList        ? 'Set quantity on at least one priced marketplace first' :
    isOverAllocated ? 'Total allocated exceeds available stock'                :
    listing         ? 'Listing in progress…'                                  :
    'List product on selected marketplaces';

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.25 }}
        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/30
          hover:to-purple-50/30 transition-colors duration-150"
      >
        {/* ── Product info ──────────────────────────────────────────────── */}
        <td className="p-4">
          <div className="flex items-center gap-3">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name ?? ''}
                width={40} height={40}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate max-w-[180px]">
                {product.name ?? product.productName}
              </p>
              {product.primaryCategory?.name && (
                <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700
                  rounded-full mt-0.5 inline-block">
                  {product.primaryCategory.name}
                </span>
              )}
            </div>
          </div>
        </td>

        {/* ── SKU ──────────────────────────────────────────────────────── */}
        <td className="p-4">
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600
            border border-gray-200">
            {product.sku}
          </span>
        </td>

        {/* ── Stock ────────────────────────────────────────────────────── */}
        <td className="p-4">
          <div className="flex flex-col gap-0.5">
            <span className={`font-bold text-base tabular-nums ${stockColor}`}>
              {stock}
            </span>
            <span className="text-xs text-gray-400">{stockLabel}</span>
            {totalAllocated > 0 && (
              <span className={`text-xs font-medium tabular-nums ${
                isOverAllocated ? 'text-red-500' : 'text-gray-400'
              }`}>
                {isOverAllocated
                  ? `${totalAllocated - stock} over`
                  : `${stock - totalAllocated} left`}
              </span>
            )}
          </div>
        </td>

        {/* ── Per-marketplace cells ─────────────────────────────────────── */}
        {availableMarketplaces.map(mp => {
          const price    = marketplacePrices?.[mp.id];
          const qty      = safeQtys[mp.id] ?? 0;
          const hasPrice = !!price;
          const canInc   = totalAllocated < stock && hasPrice;
          const canDec   = qty > 0 && hasPrice;

          const margin =
            hasPrice && price.costPrice > 0 && price.sellingPrice > 0
              ? (((price.sellingPrice - price.costPrice) / price.sellingPrice) * 100).toFixed(0)
              : null;

          return (
            <td key={`${product.id}-${mp.id}`} className="p-3">
              {hasPrice ? (
                <div className="flex flex-col items-center gap-1.5">

                  {/* Price + listed indicator */}
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-bold tabular-nums ${mp.textColor}`}>
                      £{price.sellingPrice.toFixed(2)}
                    </span>
                    <CheckCircle className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                  </div>

                  {/* Margin */}
                  {margin !== null && (
                    <div className="flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">{margin}%</span>
                    </div>
                  )}

                  {/* − [input] + */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateQuantity(product.id, mp.id, -1)}
                      disabled={!canDec}
                      aria-label="Decrease quantity"
                      className="h-7 w-7 rounded-lg border flex items-center justify-center
                        hover:bg-red-50 hover:text-red-600 hover:border-red-300
                        disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>

                    {/* Manual input — user can type directly */}
                    <input
                      type="number"
                      min={0}
                      max={stock}
                      value={qty === 0 ? '' : qty}
                      placeholder="0"
                      aria-label={`Quantity for ${mp.displayName}`}
                      onChange={e => {
                        const raw = parseInt(e.target.value, 10);
                        const val = isNaN(raw) ? 0 : Math.max(0, Math.min(stock, raw));
                        onSetQuantity(product.id, mp.id, val);
                      }}
                      className={`
                        h-9 w-14 text-center rounded-lg font-bold text-sm border
                        focus:outline-none focus:ring-2 focus:ring-indigo-400
                        transition-colors tabular-nums
                        [appearance:textfield]
                        [&::-webkit-outer-spin-button]:appearance-none
                        [&::-webkit-inner-spin-button]:appearance-none
                        ${qty > 0
                          ? `${mp.badgeBg} ${mp.textColor} border-transparent`
                          : 'bg-gray-100 text-gray-400 border-gray-200'
                        }
                        ${isOverAllocated && qty > 0 ? 'ring-2 ring-red-400' : ''}
                      `}
                    />

                    <button
                      onClick={() => onUpdateQuantity(product.id, mp.id, 1)}
                      disabled={!canInc}
                      aria-label="Increase quantity"
                      className="h-7 w-7 rounded-lg border flex items-center justify-center
                        hover:bg-green-50 hover:text-green-600 hover:border-green-300
                        disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                // No price set for this marketplace
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1 py-1">
                    <XCircle className="h-4 w-4 text-gray-300" />
                    <span className="text-xs text-gray-400">No price</span>
                  </div>
                </div>
              )}
            </td>
          );
        })}

        {/* ── Total + progress bar ──────────────────────────────────────── */}
        <td className="p-4 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <span className={`inline-flex items-center justify-center px-3 py-1.5
              rounded-lg font-bold text-sm tabular-nums ${
              isOverAllocated
                ? 'bg-red-100 text-red-700'
                : totalAllocated > 0
                ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {totalAllocated}
              {isOverAllocated && <AlertCircle className="h-3 w-3 ml-1 flex-shrink-0" />}
            </span>
            {/* Stock usage bar */}
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

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <td className="p-4">
          <div className="flex flex-col items-center gap-2">

            {/* Split — priced MPs only */}
            <button
              onClick={handleSplit}
              disabled={stock === 0}
              title="Split stock equally across marketplaces that have a price set"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-indigo-300
                text-indigo-700 rounded-lg text-xs hover:bg-indigo-50
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Shuffle className="h-3 w-3" />
              Split
            </button>

            {/* List Product */}
            <button
              onClick={handleList}
              disabled={listing || !canList || isOverAllocated}
              title={listBtnTitle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                font-semibold transition-all ${
                listing || !canList || isOverAllocated
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 \
hover:to-purple-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {listing
                ? <><Loader2 className="h-3 w-3 animate-spin" />Listing…</>
                : <><Send className="h-3 w-3" />List Product</>
              }
            </button>
          </div>
        </td>
      </motion.tr>

      {/* ── Results row ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {listResults && listResults.length > 0 && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50/80"
          >
            <td colSpan={3 + availableMarketplaces.length + 2} className="px-6 py-3">
              <div className="flex flex-wrap gap-2">
                {listResults.map((r, i) => (
                  <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    text-xs font-medium border ${
                    r.success
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {r.success
                      ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      : <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />}
                    <span className="capitalize">{r.marketplaceName}</span>
                    {r.success ? (
                      <>
                        <span className="opacity-60">✓</span>
                        {r.listingUrl && (
                          <a
                            href={r.listingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-1 underline flex items-center gap-0.5 opacity-70
                              hover:opacity-100"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </>
                    ) : (
                      <span className="opacity-70 truncate max-w-[160px]" title={r.error}>
                        ✗ {r.error}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
});

export default ProductRow;