export interface GoodsReceivedNoteItem {
  id: string;
  purchaseOrderItemId: string;
  productName: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  damageQuantity: number;
  unitPrice: number;
  condition: 'good' | 'damaged' | 'defective';
  notes: string;
}

export interface GoodsReceivedNote {
  id: string;
  grnNumber: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  supplier: string;
  receivedDate: Date;
  receivedBy: string;
  items: GoodsReceivedNoteItem[];
  totalOrdered: number;
  totalReceived: number;
  totalAccepted: number;
  totalRejected: number;
  status: 'draft' | 'completed' | 'discrepancy';
  notes: string;
  signature?: string;
}

export interface ReceivingItem {
  id: string;
  productName: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  damageQuantity: number;
  condition: 'good' | 'damaged' | 'defective';
  notes: string;
  unitPrice: number;
  isManual?: boolean;
}

export interface NewProductForm {
  productName: string;
  sku: string;
  orderedQuantity: string;
  receivedQuantity: string;
  unitPrice: string;
}

export interface GRNStats {
  totalGRNs: number;
  completedGRNs: number;
  discrepancyGRNs: number;
  totalItemsReceived: number;
}