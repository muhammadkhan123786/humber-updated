  import { useMemo } from "react";

  export function useMarketplaceQuantities(
    products: any[],
    marketplaces: any[]
  ) {

    return useMemo(() => {

      const quantities: any = {};

      products.forEach(product => {

        quantities[product.id] = {};

        marketplaces.forEach(mp => {
          quantities[product.id][mp.id] = 0;
        });

      });

      return quantities;

    }, [products, marketplaces]);

  }