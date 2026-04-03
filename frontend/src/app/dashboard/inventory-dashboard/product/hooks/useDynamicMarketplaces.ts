import { useState, useMemo, useCallback } from "react";
import { useMarketplaceConnections } from "./useMarketplaceConnections";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AvailableMarketplace {
  id:          string;
  displayName: string;
  bgColor:     string;
  textColor:   string;
  badgeBg:     string;
}

export interface MarketplacePrice {
  sellingPrice: number;
  retailPrice:  number;
  costPrice:    number;
}

export interface ListResult {
  marketplaceId:   string;
  marketplaceName: string;
  success:         boolean;
  listingId?:      string;
  listingUrl?:     string;
  error?:          string;
}

export interface Distribution {
  mpId: string;
  qty:  number;
}

export type QuantityMap = Record<string, Record<string, number>>;
export type PriceMap    = Record<string, Record<string, MarketplacePrice>>;

// ── Marketplace display styles ─────────────────────────────────────────────────
// To add a new marketplace: add ONE entry here. Nothing else needs to change.

const STYLES: Record<string, Pick<AvailableMarketplace, "bgColor" | "textColor" | "badgeBg">> = {
  woocommerce: { bgColor: "bg-purple-600", textColor: "text-purple-700", badgeBg: "bg-purple-100" },
  ebay:        { bgColor: "bg-yellow-500", textColor: "text-yellow-700", badgeBg: "bg-yellow-100" },
  amazon:      { bgColor: "bg-orange-500", textColor: "text-orange-700", badgeBg: "bg-orange-100" },
  shopify:     { bgColor: "bg-green-600",  textColor: "text-green-700",  badgeBg: "bg-green-100"  },
  etsy:        { bgColor: "bg-red-500",    textColor: "text-red-700",    badgeBg: "bg-red-100"    },
  tiktok:      { bgColor: "bg-pink-500",   textColor: "text-pink-700",   badgeBg: "bg-pink-100"   },
  walmart:     { bgColor: "bg-blue-600",   textColor: "text-blue-700",   badgeBg: "bg-blue-100"   },
};
const DEFAULT_STYLE = { bgColor: "bg-gray-500", textColor: "text-gray-700", badgeBg: "bg-gray-100" };

// ── Helpers ────────────────────────────────────────────────────────────────────

const getUserId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || user._id || "";
  } catch { return ""; }
};

const getAuthToken = (): string => {
  if (typeof window === "undefined") return "";
  try { return localStorage.getItem("token") || ""; }
  catch { return ""; }
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDynamicMarketplaces(products: any[]) {
  const userId      = getUserId();
  const connections = useMarketplaceConnections(userId);

  // ── 1. Derive available marketplaces from connected accounts ───────────────
  const availableMarketplaces = useMemo<AvailableMarketplace[]>(() =>
    connections.map(conn => ({
      id:          conn._id,
      displayName: conn.type ?? "Marketplace",
      ...(STYLES[(conn.type ?? "").toLowerCase()] ?? DEFAULT_STYLE),
    })),
  [connections]);

  // ── 2. Build price map — match by ID, never by name ───────────────────────
  //    Path: product.attributes[].pricing[].marketplaceId
  const marketplacePrices = useMemo<PriceMap>(() => {
    if (!connections.length) return {};

    const byId = new Map(connections.map(c => [c._id, c]));
    const map: PriceMap = {};

    products.forEach(product => {
      map[product.id] = {};
      (product.attributes ?? []).forEach((attr: any) => {
        (attr.pricing ?? []).forEach((price: any) => {
          const conn = byId.get(price.marketplaceId);
          if (conn && !map[product.id][conn._id]) {
            map[product.id][conn._id] = {
              sellingPrice: price.sellingPrice ?? 0,
              retailPrice:  price.retailPrice  ?? 0,
              costPrice:    price.costPrice    ?? 0,
            };
          }
        });
      });
    });

    return map;
  }, [products, connections]);

  // ── 3. Quantity state — starts at 0, user fills manually or via split ──────
  const [quantities, setQuantities] = useState<QuantityMap>({});

  useMemo(() => {
    setQuantities(prev => {
      const next: QuantityMap = {};
      products.forEach(p => {
        next[p.id] = {};
        availableMarketplaces.forEach(mp => {
          next[p.id][mp.id] = prev[p.id]?.[mp.id] ?? 0;
        });
      });
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length, availableMarketplaces.length]);

  // ── Quantity actions ───────────────────────────────────────────────────────

  /** +1 / -1 with stock cap enforcement */
  const updateQuantity = useCallback((productId: string, mpId: string, delta: number) => {
    setQuantities(prev => {
      const product    = products.find(p => p.id === productId);
      const stock      = product?.stockQuantity ?? 0;
      const current    = prev[productId]?.[mpId] ?? 0;
      const totalOther = Object.entries(prev[productId] ?? {})
        .filter(([id]) => id !== mpId)
        .reduce((sum, [, q]) => sum + q, 0);
      const next = Math.min(stock - totalOther, Math.max(0, current + delta));
      return { ...prev, [productId]: { ...prev[productId], [mpId]: next } };
    });
  }, [products]);

  /** Direct set — used by the manual input field */
  const setQuantity = useCallback((productId: string, mpId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [mpId]: value },
    }));
  }, []);

  /** Reset all quantities for a product to zero */
  const resetQuantities = useCallback((productId: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Object.fromEntries(availableMarketplaces.map(mp => [mp.id, 0])),
    }));
  }, [availableMarketplaces]);

  // ── List product — parallel across all selected marketplaces ──────────────
  //
  //  Uses Promise.allSettled so a failure on eBay does NOT block Shopify.
  //  Each request: POST /marketplace/:connectionId/list-products
  //  Backend factory pattern handles the rest — frontend stays marketplace-agnostic.
  //
  const listProduct = useCallback(async (
    productId: string,
    distributions: Distribution[],
  ): Promise<ListResult[]> => {
    const product = products.find(p => p.id === productId);
    if (!product || !distributions.length) return [];

    const token = getAuthToken();

    // All marketplace requests fire in parallel
    const settled = await Promise.allSettled(
      distributions.map(async ({ mpId, qty }) => {
        const mp    = availableMarketplaces.find(m => m.id === mpId);
        const price = marketplacePrices[productId]?.[mpId];

        // Payload — backend service maps these fields to marketplace-specific format
        const payload = {
          // Product identity
          sku:              product.sku,
          name:             product.name         ?? product.productName ?? "",
          description:      product.description  ?? "",
          shortDescription: product.shortDescription ?? "",

          // Qty being listed on this marketplace
          quantity: qty,

          // Pricing from variant data
          sellingPrice: price?.sellingPrice ?? 0,
          retailPrice:  price?.retailPrice  ?? 0,
          costPrice:    price?.costPrice    ?? 0,

          // Category
          categoryId:   product.primaryCategory?.id   ?? product.categoryId   ?? "",
          categoryName: product.primaryCategory?.name ?? "",

          // Images — send array, service picks what it needs
          images: product.images ?? (product.imageUrl ? [product.imageUrl] : []),

          // Full attributes for marketplace-specific field mapping
          attributes: product.attributes ?? [],

          // Internal refs
          productId,
          userId,
        };

        const res = await fetch(`${BASE_URL}/marketplace/${mpId}/list-products`, {
          method:  "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({
          success: false,
          message: "Invalid server response",
        }));

        if (!res.ok || !data.success) {
          throw {
            marketplaceId:   mpId,
            marketplaceName: mp?.displayName ?? mpId,
            error:           data.message ?? `HTTP ${res.status}`,
          };
        }

        return {
          marketplaceId:   mpId,
          marketplaceName: mp?.displayName ?? mpId,
          success:         true,
          listingId:       data.data?.listingId   ?? data.data?.id,
          listingUrl:      data.data?.listingUrl  ?? data.data?.url,
        } as ListResult;
      })
    );

    // Normalise allSettled — fulfilled = success, rejected = failure
    return settled.map((result, i) => {
      const mp = availableMarketplaces.find(m => m.id === distributions[i].mpId);
      if (result.status === "fulfilled") return result.value;
      const reason = result.reason as any;
      return {
        marketplaceId:   distributions[i].mpId,
        marketplaceName: reason?.marketplaceName ?? mp?.displayName ?? distributions[i].mpId,
        success:         false,
        error:           reason?.error ?? reason?.message ?? "Unknown error",
      };
    });
  }, [products, availableMarketplaces, marketplacePrices, userId]);

  // ── Totals for stats cards ─────────────────────────────────────────────────
  const marketplaceTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    let grandTotal = 0;
    availableMarketplaces.forEach(mp => {
      const t = Object.values(quantities).reduce((s, pq) => s + (pq[mp.id] ?? 0), 0);
      totals[mp.id] = t;
      grandTotal   += t;
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
      resetQuantities,
      listProduct,
    },
  };
}