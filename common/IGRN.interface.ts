export interface GoodsReceivedItem {
  purchaseOrderItemId: string;

  productName: string;
  sku: string;

  orderedQuantity: number;  

  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  damageQuantity: number;

  condition: 'good' | 'damaged' | 'expired' | 'other';
  notes?: string;
}

export interface IGoodsReceivedNote {
  id: string;

  grnNumber: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;

  supplierId: string;
  supplierName: string;

  receivedDate: Date;
  receivedBy: string;

  items: GoodsReceivedItem[];

  totalOrdered: number;
  totalReceived: number;
  totalAccepted: number;
  totalRejected: number;

  status: 'draft' | 'completed';
  notes?: string;
  signature?: string;

  createdAt: Date;
  updatedAt: Date;
}

