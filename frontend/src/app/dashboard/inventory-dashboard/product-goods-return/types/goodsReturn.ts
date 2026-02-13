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
  _id?: string;
}

export interface PurchaseOrderItem {
  _id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;

}

export interface GRNItem {
  receivedQuantity: number;
  acceptedQuantity?: number;
  rejectedQuantity?: number;
  damageQuantity?: number;
  unitPrice: number;
  condition?: string;
  notes?: string;
}

export interface GRN {
  _id: string;
  grnNumber?: string;
  purchaseOrderId?: PurchaseOrder;
  items: GRNItem[];
}

export interface ReturnItem {
  returnQty: number;
  totalAmount: number;
  status?: any;
  itemsNotes?: string;
}

export interface PurchaseOrder {
  _id: string;
  supplier?: {
    contactInformation?: {
      primaryContactName?: string;
    };
  };
  orderNumber?: string;
  items: PurchaseOrderItem[];
}


export interface GoodsReturnNote {
  _id: string;
  grtnNumber?: string;
  returnNumber?: string;

  grnNumber?: string;
  grnId?: GRN;

  supplier?: string;

  returnDate: Date;
  returnedBy: string;

  status: 'pending' | 'approved' | 'in-transit' | 'completed' | 'rejected';
  returnReason: string;

  items: ReturnItem[];
  totalAmount?: number;
  notes?: string;

  createdAt: Date;
}

export interface GRNForReturn {
  id: string;
  grnNumber: string;
  poNumber: string;
   purchaseOrderId?: {
    supplier?: {
      contactInformation?: {
        primaryContactName?: string;
      };
    };
  };
  createdAt: Date;
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
  _id: string;
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


export interface CreateGoodsReturnItemDto {
  returnQty: number;
  totalAmount: number;
  itemsNotes?: string;
}

export interface CreateGoodsReturnDto {
  grnId: string;
  returnedBy: string;
  returnReason: string;
  notes?: string;
  items: CreateGoodsReturnItemDto[];
  returnDate: Date;
  grtnNumber: string;
}
