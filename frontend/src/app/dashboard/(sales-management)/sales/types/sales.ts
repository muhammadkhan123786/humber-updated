export type OrderStatus = 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
export type OrderSource = 'ebay' | 'amazon' | 'tiktok' | 'shopify' | 'mobile';

export interface Order {
  id: string;
  orderNumber: string;
  source: OrderSource;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderDate: string;
  status: OrderStatus;
  driver?: string;
  trackingNumber?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
}

export interface CourierService {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  trackingUrl?: string;
}

export interface ShippingLabelData {
  orderId: string;
  orderNumber: string;
  courierId: string;
  packageSize: string;
  weight: number;
  insurance: boolean;
  signatureRequired: boolean;
}