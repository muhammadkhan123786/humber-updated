import { IBaseEntity } from "./Base.Interface";

export interface IPurchaseOrderItem {
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IPurchaseOrder<TUserId = string> extends IBaseEntity<TUserId> {
  orderNumber: string;
  supplier: string;
  supplierContact: string;
  orderDate: Date;
  expectedDelivery: Date;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  items: IPurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}
