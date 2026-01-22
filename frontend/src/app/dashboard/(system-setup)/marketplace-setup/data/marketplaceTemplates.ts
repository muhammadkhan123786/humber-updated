export interface MarketplaceTemplate {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  icon: string;
  fields: string[];
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
}

export interface AvailableField {
  value: string;
  label: string;
}

export const DEFAULT_MARKETPLACES: MarketplaceTemplate[] = [
  {
    id: '1',
    name: 'eBay',
    code: 'ebay',
    description: 'Connect to eBay marketplace for online auctions and sales',
    color: 'from-yellow-400 to-yellow-600',
    icon: '🛒',
    fields: ['apiKey', 'apiSecret', 'accessToken'],
    isActive: true,
    isDefault: false,
    createdAt: new Date('2026-01-01')
  },
  {
    id: '2',
    name: 'Amazon',
    code: 'amazon',
    description: 'Connect to Amazon Seller Central for product listings',
    color: 'from-orange-400 to-orange-600',
    icon: '📦',
    fields: ['apiKey', 'apiSecret', 'marketplaceId'],
    isActive: true,
    isDefault: true,
    createdAt: new Date('2026-01-01')
  },
  {
    id: '3',
    name: 'Etsy',
    code: 'etsy',
    description: 'Connect to Etsy for handmade and vintage items',
    color: 'from-orange-500 to-red-500',
    icon: '🎨',
    fields: ['apiKey', 'shopUrl'],
    isActive: true,
    isDefault: false,
    createdAt: new Date('2026-01-01')
  },
  {
    id: '4',
    name: 'Shopify',
    code: 'shopify',
    description: 'Connect to your Shopify online store',
    color: 'from-green-400 to-emerald-600',
    icon: '🏪',
    fields: ['shopUrl', 'accessToken'],
    isActive: true,
    isDefault: false,
    createdAt: new Date('2026-01-01')
  },
  {
    id: '5',
    name: 'TikTok Shop',
    code: 'tiktok',
    description: 'Connect to TikTok Shop for social commerce',
    color: 'from-pink-400 to-rose-600',
    icon: '🎵',
    fields: ['apiKey', 'apiSecret', 'shopId'],
    isActive: false,
    isDefault: false,
    createdAt: new Date('2026-01-01')
  },
  {
    id: '6',
    name: 'Facebook Marketplace',
    code: 'facebook',
    description: 'Connect to Facebook Marketplace and Instagram Shopping',
    color: 'from-blue-500 to-indigo-600',
    icon: '👥',
    fields: ['accessToken', 'pageId'],
    isActive: false,
    isDefault: false,
    createdAt: new Date('2026-01-01')
  }
];

export const AVAILABLE_ICONS = ['🛒', '📦', '🎨', '🏪', '🎵', '👥', '💼', '🌐', '🛍️', '📱', '💳', '🚀'];

export const AVAILABLE_COLORS = [
  'from-yellow-400 to-yellow-600',
  'from-orange-400 to-orange-600',
  'from-red-400 to-red-600',
  'from-pink-400 to-pink-600',
  'from-purple-400 to-purple-600',
  'from-indigo-400 to-indigo-600',
  'from-blue-400 to-blue-600',
  'from-cyan-400 to-cyan-600',
  'from-teal-400 to-teal-600',
  'from-green-400 to-green-600',
  'from-lime-400 to-lime-600',
  'from-emerald-400 to-emerald-600'
];

export const AVAILABLE_FIELDS: AvailableField[] = [
  { value: 'apiKey', label: 'API Key' },
  { value: 'apiSecret', label: 'API Secret' },
  { value: 'accessToken', label: 'Access Token' },
  { value: 'shopUrl', label: 'Shop URL' },
  { value: 'marketplaceId', label: 'Marketplace ID' },
  { value: 'shopId', label: 'Shop ID' },
  { value: 'pageId', label: 'Page ID' },
  { value: 'clientId', label: 'Client ID' },
  { value: 'clientSecret', label: 'Client Secret' }
];

export const initialFormData = {
  name: '',
  code: '',
  description: '',
  color: AVAILABLE_COLORS[0],
  icon: AVAILABLE_ICONS[0],
  fields: [] as string[],
  isActive: true,
  isDefault: false
};

export type FormData = typeof initialFormData;