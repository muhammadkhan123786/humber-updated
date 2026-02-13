// // types/index.ts
// export interface PurchaseOrderItem {
//   id: string;
//   productName: string;
//   sku: string;
//   quantity: number;
//   receivedQuantity: number;
//   rejectedQuantity: number;
//   unitPrice: number;
//   totalPrice: number;
//   _id?: string;
// }

// export interface PurchaseOrder {
//   _id: string;
//   orderNumber: string;
//   supplierContact: string;
//   orderDate: Date;
//   expectedDelivery: Date;
//   status:
//     | "ordered"
//     | "received"
//     | "cancelled"
//     | "pending"
//     | "approved"
//     | "draft";
//   deliveryStatus: "not-delivered" | "partially-delivered" | "fully-delivered";
//   items: PurchaseOrderItem[];
//   subtotal: number;
//   tax: number;
//   total: number;
//   notes: string;
//   supplier: Supplier;
// }

// export interface GoodsReceivedNoteItem {
//   _id?: string;
//  purchaseOrderItemId?: string;
//   productName: string;
//   sku: string;
//   orderedQuantity: number;
//   receivedQuantity: number;
//   acceptedQuantity: number;
//   rejectedQuantity: number;
//   damageQuantity: number;
//   unitPrice: number;
//   condition: "good" | "damaged" | "defective";
//   notes: string;
// }

// interface Supplier {
//   _id: string;
//   contactInformation: {
//     primaryContactName: string;
//     email?: string;
//     phone?: string;
//   };
// }

// export interface GoodsReceivedNote {
//   _id: string;
//   grnNumber: string;
//   purchaseOrderId: PurchaseOrder;
//   supplier: string;
//   receivedDate: Date;
//   receivedBy: string;
//   items: GoodsReceivedNoteItem[];
//   totalOrdered: number;
//   totalReceived: number;
//   totalAccepted: number;
//   totalRejected: number;
//   status: "draft" | "completed" | "discrepancy";
//   notes: string;
//   signature?: string;
// }

// export interface ReceivingItem {
//   id: string;
//   productName: string;
//   sku: string;
//   orderedQuantity: number;
//   receivedQuantity: number;
//   acceptedQuantity: number;
//   rejectedQuantity: number;
//   damageQuantity: number;
//   condition: "good" | "damaged" | "defective";
//   notes: string;
//   unitPrice: number;
//   isManual?: boolean;
// }

// export interface NewProductForm {
//   productName: string;
//   sku: string;
//   orderedQuantity: string;
//   receivedQuantity: string;
//   unitPrice: string;
// }

// export interface GRNStats {
//   totalGRNs: number;
//   completedGRNs: number;
//   discrepancyGRNs: number;
//   totalItemsReceived: number;
// }



// types/goodsReceived.ts
export interface PurchaseOrderItem {
  _id: string;
  productName: string;
  sku: string;
  quantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Supplier {
  _id: string;
  contactInformation: {
    primaryContactName: string;
    email?: string;
    phone?: string;
  };
}

export interface PurchaseOrder {
  _id: string;
  orderNumber: string;
  supplierContact: string;
  orderDate: Date | string;
  expectedDelivery: Date | string;
  status: "ordered" | "received" | "cancelled" | "pending" | "approved" | "draft";
  deliveryStatus: "not-delivered" | "partially-delivered" | "fully-delivered";
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  supplier: Supplier;
}

export interface GoodsReceivedNoteItem {
  _id?: string;
  purchaseOrderItemId: string;
  productName: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  damageQuantity: number;
  unitPrice: number;
  condition: "good" | "damaged" | "defective";
  notes: string;
  status?: string
}

export interface GoodsReceivedNote {
  _id: string;
  grnNumber: string;
  purchaseOrderId: PurchaseOrder | string;
  supplier: string;
  receivedDate: Date | string;
  receivedBy: string;
  items: GoodsReceivedNoteItem[];
  totalOrdered: number;
  totalReceived: number;
  totalAccepted: number;
  totalRejected: number;
  status: "received"| "ordered";
  notes?: string;
  signature?: string;
  grnReference: string
  
}

export interface GRNStats {
  totalGRNs: number;
  completedGRNs: number;
  discrepancyGRNs?: number;
  totalItemsReceived: number;
}

export interface NewProductForm {
  purchaseOrderItemId?: string;
  productName: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitPrice: number;
  status: "received"| "ordered";
}