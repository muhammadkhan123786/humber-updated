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

export interface GoodsReturnNote {
  _id: string;

  // New & old naming support
  grtnNumber?: string;
  returnNumber?: string;

  grnNumber?: string;
  grnId?: {
    _id: string;
    grnNumber?: string;
    purchaseOrderId?: {
      _id: string;
      supplier?: {
        contactInformation?: {
          primaryContactName?: string;
        };
      };
    };
  };

  supplier?: string;

  returnDate: Date;
  returnedBy: string;

  status: 'pending' | 'approved' | 'in-transit' | 'completed' | 'rejected';

  returnReason: string;
  items: {
    returnQty: number;
    totalAmount: number;
    status?: string;
    itemsNotes?: string;
  }[];

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
