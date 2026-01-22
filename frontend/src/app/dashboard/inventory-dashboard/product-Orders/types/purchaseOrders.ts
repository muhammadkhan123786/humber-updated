export interface PurchaseOrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  supplierContact: string;
  orderDate: Date;
  expectedDelivery: Date;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
}

export interface Supplier {
  id: string;
  legalBusinessName: string;
  email: string;
  phoneNumber: string;
}

export interface PurchaseOrderStats {
  totalOrders: number;
  pendingOrders: number;
  orderedCount: number;
  receivedCount: number;
}

export interface OrderFormData {
  supplier: string;
  supplierContact: string;
  expectedDelivery: string;
  notes: string;
}

export interface OrderItemForm {
  productName: string;
  sku: string;
  quantity: string;
  unitPrice: string;
}