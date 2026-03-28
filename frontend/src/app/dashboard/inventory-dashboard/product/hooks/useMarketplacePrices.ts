import { useMemo } from "react";

export function useMarketplacePrices(products: any[], connections: any[]) {
  return useMemo(() => {
    const priceMap: Record<string, Record<string, {
      sellingPrice: number;
      retailPrice:  number;
      costPrice:    number;
    }>> = {};

    // connections hasn't loaded yet — return empty map, will re-run when it loads
    if (!connections.length) return priceMap;

    // Build a quick lookup: connectionId → connection
    const connectionById = new Map(
      connections.map(c => [c._id, c])
    );

    products.forEach(product => {
      priceMap[product.id] = {};

      // Data lives in product.attributes[].pricing[]
      product.attributes?.forEach((attr: any) => {
        attr.pricing?.forEach((price: any) => {

          // ✅ FIX: match directly by ID — no name normalization needed
          // price.marketplaceId === connection._id
          const connection = connectionById.get(price.marketplaceId);

          if (connection) {
            priceMap[product.id][connection._id] = {
              sellingPrice: price.sellingPrice ?? 0,
              retailPrice:  price.retailPrice  ?? 0,
              costPrice:    price.costPrice    ?? 0,
            };
          }
        });
      });
    });

    return priceMap;
  }, [products, connections]); // re-runs when connections finally loads
}