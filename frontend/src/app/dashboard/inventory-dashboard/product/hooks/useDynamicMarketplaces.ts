import { useState, useMemo, useCallback, useEffect } from "react";
import { useMarketplaceConnections } from "./useMarketplaceConnections";

// -- Expanded Types --

export interface MarketplacePrice {
  sellingPrice: number;
  retailPrice: number;
  costPrice: number;
}

export interface ProductAttribute {
  pricing?: Array<{
    marketplaceId: string;
    sellingPrice?: number;
    retailPrice?: number;
    costPrice?: number;
  }>;
}

export interface Product {
  id: string;
  stockQuantity: number;
  attributes?: ProductAttribute[];
}

export interface AvailableMarketplace {
  id: string;
  displayName: string;
  bgColor: string;
  textColor: string;
  badgeBg: string;
}

export interface ListResult {
  marketplaceId: string;
  marketplaceName: string;
  success: boolean;
  error?: string;
}

export type QuantityMap = Record<string, Record<string, number>>;
export type PriceMap = Record<string, Record<string, MarketplacePrice>>;

// -- Logic --

const STYLES: Record<string, Pick<AvailableMarketplace, "bgColor" | "textColor" | "badgeBg">> = {
  woocommerce: { bgColor: "bg-purple-600", textColor: "text-purple-700", badgeBg: "bg-purple-100" },
  ebay: { bgColor: "bg-yellow-500", textColor: "text-yellow-700", badgeBg: "bg-yellow-100" },
  amazon: { bgColor: "bg-orange-500", textColor: "text-orange-700", badgeBg: "bg-orange-100" },
  shopify: { bgColor: "bg-green-600", textColor: "text-green-700", badgeBg: "bg-green-100" },
  etsy: { bgColor: "bg-red-500", textColor: "text-red-700", badgeBg: "bg-red-100" },
  tiktok: { bgColor: "bg-pink-500", textColor: "text-pink-700", badgeBg: "bg-pink-100" },
};

const DEFAULT_STYLE = { bgColor: "bg-gray-500", textColor: "text-gray-700", badgeBg: "bg-gray-100" };

const getUserId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || user._id || "";
  } catch { return ""; }
};

export function useDynamicMarketplaces(products: Product[]) {
  const userId = getUserId();
  const connections = useMarketplaceConnections(userId);

  const availableMarketplaces = useMemo<AvailableMarketplace[]>(() =>
    connections.map((conn: any) => ({
      id: conn._id,
      displayName: conn.type ?? "Marketplace",
      ...(STYLES[(conn.type ?? "").toLowerCase()] ?? DEFAULT_STYLE),
    })),
    [connections]
  );

  const marketplacePrices = useMemo<PriceMap>(() => {
    const map: PriceMap = {};
    const byId = new Map(connections.map((c: any) => [c._id, c]));

    products.forEach(product => {
      map[product.id] = {};
      product.attributes?.forEach(attr => {
        attr.pricing?.forEach(price => {
          const conn = byId.get(price.marketplaceId);
          if (conn) {
            map[product.id][conn._id] = {
              sellingPrice: price.sellingPrice ?? 0,
              retailPrice: price.retailPrice ?? 0,
              costPrice: price.costPrice ?? 0,
            };
          }
        });
      });
    });
    return map;
  }, [products, connections]);

  const [quantities, setQuantities] = useState<QuantityMap>({});

  // FIXED: Changed useMemo to useEffect for setting state
  useEffect(() => {
    setQuantities(prev => {
      const next: QuantityMap = {};
      products.forEach(p => {
        next[p.id] = {};
        availableMarketplaces.forEach(mp => {
          // Use optional chaining and nullish coalescing to avoid TS errors
          next[p.id][mp.id] = prev[p.id]?.[mp.id] ?? 0;
        });
      });
      return next;
    });
  }, [products, availableMarketplaces]);

  const updateQuantity = useCallback((productId: string, mpId: string, delta: number) => {
    setQuantities(prev => {
      const product = products.find(p => p.id === productId);
      const stock = product?.stockQuantity ?? 0;
      const current = prev[productId]?.[mpId] ?? 0;
      
      const totalOther = Object.entries(prev[productId] ?? {})
        .filter(([id]) => id !== mpId)
        .reduce((sum, [, q]) => sum + (q as number), 0);

      const max = stock - totalOther;
      const next = Math.min(max, Math.max(0, current + delta));
      return { 
        ...prev, 
        [productId]: { ...prev[productId], [mpId]: next } 
      };
    });
  }, [products]);

  const setQuantity = useCallback((productId: string, mpId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [mpId]: value },
    }));
  }, []);

  const equallyDistribute = useCallback((productId: string, pricedMpIds: string[]) => {
    const product = products.find(p => p.id === productId);
    if (!product || !pricedMpIds.length) return;

    const stock = product.stockQuantity;
    const per = Math.floor(stock / pricedMpIds.length);
    const remainder = stock % pricedMpIds.length;

    setQuantities(prev => {
      const updated: Record<string, number> = { ...(prev[productId] ?? {}) };
      availableMarketplaces.forEach(mp => { updated[mp.id] = 0; });
      pricedMpIds.forEach((id, i) => { 
        updated[id] = per + (i < remainder ? 1 : 0); 
      });
      return { ...prev, [productId]: updated };
    });
  }, [products, availableMarketplaces]);

  const listProduct = useCallback(async (
    productId: string,
    distributions: { mpId: string; qty: number }[]
  ): Promise<ListResult[]> => {
    const product = products.find(p => p.id === productId);
    if (!product) return [];

    return distributions.map(d => {
      const mp = availableMarketplaces.find(m => m.id === d.mpId);
      return {
        marketplaceId: d.mpId,
        marketplaceName: mp?.displayName ?? d.mpId,
        success: true,
      };
    });
  }, [products, availableMarketplaces]);

  const marketplaceTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    let grandTotal = 0;
    availableMarketplaces.forEach(mp => {
      const t = Object.values(quantities).reduce((sum, pq) => sum + (pq[mp.id] ?? 0), 0);
      totals[mp.id] = t;
      grandTotal += t;
    });
    return { totals, grandTotal };
  }, [quantities, availableMarketplaces]);

  return {
    availableMarketplaces,
    marketplacePrices,
    quantities,
    marketplaceTotals,
    actions: {
      updateQuantity,
      setQuantity,
      equallyDistribute,
      listProduct,
    },
  };
}