export interface GoodsReturnNoteItem {
  id: string;
  productName: string;
  sku: string;
  receivedQuantity: number;
  returnQuantity: number;
  returnReason: 'damaged' | 'defective' | 'wrong-item' | 'excess' | 'quality-issue' | 'other';
  condition: string;
  unitPrice: number;
  totalPrice: number;
  notes: string;
}

export interface GoodsReturnNote {
  id: string;
  grnNumber: string;
  grnReference: string;
  returnNumber: string;
  supplier: string;
  returnDate: Date;
  returnedBy: string;
  status: 'pending' | 'approved' | 'in-transit' | 'completed' | 'rejected';
  returnReason: string;
  items: GoodsReturnNoteItem[];
  totalAmount: number;
  notes: string;
  createdAt: Date;
}

export interface GRNForReturn {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplier: string;
  receivedDate: Date;
  items: Array<{
    id: string;
    productName: string;
    sku: string;
    receivedQuantity: number;
    acceptedQuantity: number;
    unitPrice: number;
  }>;
}

export interface ReturningItem {
  id: string;
  productName: string;
  sku: string;
  receivedQuantity: number;
  returnQuantity: number;
  returnReason: 'damaged' | 'defective' | 'wrong-item' | 'excess' | 'quality-issue' | 'other';
  condition: string;
  notes: string;
  unitPrice: number;
}

export interface ReturnStats {
  totalReturns: number;
  pendingReturns: number;
  inTransitReturns: number;
  completedReturns: number;
  totalReturnValue: number;
}