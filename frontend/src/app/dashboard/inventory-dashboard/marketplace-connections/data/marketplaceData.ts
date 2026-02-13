// import { LucideIcon } from 'lucide-react';

// export interface FormData {
//   name: string;
//   type: string;
//   apiKey: string;
//   apiSecret: string;
//   shopUrl: string;
//   accessToken: string;
//   marketplaceId: string;
//   description: string;

//   [key: string]: string; // 🔥 FIX
// }
// export interface MarketplaceTemplate {
//   _id: string;
//   name: string;
//   code: string;
//   description: string;

//   icon: {
//     _id: string;
//     icon: string[];
//   };

//   color: {
//     _id: string;
//     colorName: string;
//     colorCode: string;
//   };

//   fields: string[];
//   isActive: boolean;
//   isDefault: boolean;
// }
// export interface IMarketplace {
//   _id: string;
//   marketplaceName: string;
//   name: string;
//  icons: {
//   _id: string;
//   icon: string;
//  }
//   fields: Array<any>;
// }
// export interface Marketplace {
//   id: string;
//   name: string;
//   type: string;
//   status: 'connected' | 'disconnected' | 'error';
//   apiKey?: string;
//   apiSecret?: string;
//   shopUrl?: string;
//   accessToken?: string;
//   lastSync?: Date;
//   totalSales?: number;
//   activeListings?: number;
//   color: string;
//   icon: string;
//   description: string;
//   pendingOrders?: number;
//   revenue24h?: number;
//   growth?: number;
// }

// // export interface MarketplaceTemplate {
// //   type: 'ebay' | 'amazon' | 'etsy' | 'shopify' | 'custom';
// //   name: string;
// //   color: string;
// //   icon: string;
// //   description: string;
// //   fields: string[];
// // }

// // export const MARKETPLACE_TEMPLATES: MarketplaceTemplate[] = [
// //   {
// //     type: 'ebay',
// //     name: 'eBay',
// //     color: 'from-yellow-400 via-yellow-500 to-orange-500',
// //     icon: '🛒',
// //     description: 'Connect to eBay marketplace',
// //     fields: ['apiKey', 'apiSecret', 'accessToken']
// //   },
// //   {
// //     type: 'amazon',
// //     name: 'Amazon',
// //     color: 'from-orange-400 via-orange-500 to-red-500',
// //     icon: '📦',
// //     description: 'Connect to Amazon Seller Central',
// //     fields: ['apiKey', 'apiSecret', 'marketplaceId']
// //   },
// //   {
// //     type: 'etsy',
// //     name: 'Etsy',
// //     color: 'from-orange-500 via-red-500 to-pink-500',
// //     icon: '🎨',
// //     description: 'Connect to Etsy marketplace',
// //     fields: ['apiKey', 'shopUrl']
// //   },
// //   {
// //     type: 'shopify',
// //     name: 'Shopify',
// //     color: 'from-green-400 via-emerald-500 to-teal-500',
// //     icon: '🏪',
// //     description: 'Connect to Shopify store',
// //     fields: ['shopUrl', 'accessToken']
// //   }
// // ];

// export const INITIAL_MARKETPLACES: Marketplace[] = [
//   {
//     id: '1',
//     name: 'eBay Store',
//     type: 'ebay',
//     status: 'connected',
//     apiKey: '••••••••••••••••',
//     apiSecret: '••••••••••••••••',
//     accessToken: '••••••••••••••••',
//     lastSync: new Date('2026-01-11T10:30:00'),
//     totalSales: 45230.50,
//     activeListings: 127,
//     pendingOrders: 8,
//     revenue24h: 1250.75,
//     growth: 12.5,
//     color: 'from-yellow-400 via-yellow-500 to-orange-500',
//     icon: '🛒',
//     description: 'Main eBay sales channel'
//   },
//   {
//     id: '2',
//     name: 'Amazon UK',
//     type: 'amazon',
//     status: 'connected',
//     apiKey: '••••••••••••••••',
//     apiSecret: '••••••••••••••••',
//     lastSync: new Date('2026-01-11T09:15:00'),
//     totalSales: 78450.25,
//     activeListings: 95,
//     pendingOrders: 15,
//     revenue24h: 2890.30,
//     growth: 8.3,
//     color: 'from-orange-400 via-orange-500 to-red-500',
//     icon: '📦',
//     description: 'Amazon Seller Central UK'
//   },
//   {
//     id: '3',
//     name: 'Etsy Shop',
//     type: 'etsy',
//     status: 'disconnected',
//     pendingOrders: 0,
//     revenue24h: 0,
//     growth: 0,
//     color: 'from-orange-500 via-red-500 to-pink-500',
//     icon: '🎨',
//     description: 'Handcrafted accessories store'
//   },
//   {
//     id: '4',
//     name: 'Humber Mobility Store',
//     type: 'shopify',
//     status: 'error',
//     shopUrl: 'humber-mobility.myshopify.com',
//     accessToken: '••••••••••••••••',
//     lastSync: new Date('2026-01-10T14:20:00'),
//     totalSales: 23100.00,
//     activeListings: 58,
//     pendingOrders: 3,
//     revenue24h: 450.00,
//     growth: -2.1,
//     color: 'from-green-400 via-emerald-500 to-teal-500',
//     icon: '🏪',
//     description: 'Main Shopify storefront'
//   }
// ];

// export interface FormData {
//   name: string;
//   type: string;
//   apiKey: string;
//   apiSecret: string;
//   shopUrl: string;
//   accessToken: string;
//   marketplaceId: string;
//   description: string;
// }

// export const initialFormData: FormData = {
//   name: '',
//   type: 'ebay',
//   apiKey: '',
//   apiSecret: '',
//   shopUrl: '',
//   accessToken: '',
//   marketplaceId: '',
//   description: ''
// };

// data/marketplaceData.ts

/* =========================
   BACKEND TEMPLATE TYPE
========================= */
export interface MarketplaceTemplate {
  _id: string;
  name: string;
  code: string;
  description: string;

  icon: {
    _id: string;
    icon: string[];
  };

  color: {
    _id: string;
    colorName: string;
    colorCode: string;
  };

  fields: string[];
  isActive: boolean;
  isDefault: boolean;
  id: string;
  status: any;
  type: any;
}

/* =========================
   CONNECTED MARKETPLACE
========================= */
export interface Marketplace {
  _id: string;
  id: string;
  name: string;
 type: {
    _id: string;
    icon?: {
      _id: string;
      icon: string;
    };
    color?: {
      _id: string;
      colorCode: string;
    };
  };
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  totalSales?: number;
  activeListings?: number;
  pendingOrders?: number;
  revenue24h?: number;
  growth?: number;
   icon: any;
  color: any;
  description: string;
  apiKey?: string;
  shopUrl?: string;
}

/* =========================
   FORM DATA
========================= */
export interface FormData {
  name: string;
  type: string;
  description: string;

  apiKey: string;
  apiSecret: string;
  shopUrl: string;
  accessToken: string;
  marketplaceId: string;

  // 🔥 REQUIRED for dynamic fields
  [key: string]: string;
}

/* =========================
   INITIAL FORM DATA
========================= */
export const initialFormData: FormData = {
  name: '',
  type: '',
  description: '',
  apiKey: '',
  apiSecret: '',
  shopUrl: '',
  accessToken: '',
  marketplaceId: '',
};