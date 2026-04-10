// services/MarketplaceServiceFactory.ts

import { BaseMarketplaceService } from "./BaseMarketplaceService";
import { EbayService } from "../marketplace-Services/marketplace/EbayService";
import { ShopifyService } from "../marketplace-Services/marketplace/ShopifyService";
import { WooCommerceService } from "./marketplace/WooCommerceService";
import { EtsyService } from "./marketplace/EtsyOAuthService";
import { TikTokService } from "./marketplace/TikTokService"; 

export class MarketplaceServiceFactory {
  static createService(connection: any): BaseMarketplaceService {
    switch (connection.type) {
      case "ebay":
        return new EbayService(connection);

      case "shopify":
        return new ShopifyService(connection);
        
      case "woocommerce":
        return new WooCommerceService(connection);

      case "etsy":
        return new EtsyService(connection);

      case "tiktok":
        return new TikTokService(connection); 

      default:
        throw new Error(`Unsupported marketplace type: ${connection.type}`);
    }
  }
}