// export interface PurchaseOrderItem {
//   id: string;
//   productName: string;
//   sku: string;
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
// }

// export interface Supplier {
//   _id: string;
//   operationalInformation: {
//     orderContactName: string;
//     orderContactEmail: string;
//   };
// }


// export interface PurchaseOrder {
//   _id: string;
//   orderNumber: string;
//    supplier: string | Supplier;
//   orderContactEmail: string;
//   orderDate: Date;
//   expectedDelivery: Date;
//   status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
//   items: PurchaseOrderItem[];
//   subtotal: number;
//   tax: number;
//   total: number;
//   notes: string;
// }

// export interface Supplier {
//   id: string;
//   legalBusinessName: string;
//   email: string;
//   phoneNumber: string;
// }

// export interface PurchaseOrderStats {
//   totalOrders: number;
//   pendingOrders: number;
//   orderedCount: number;
//   receivedCount: number;
// }

// export interface OrderFormData {
//   supplier: string;
//   orderContactEmail: string;
//   expectedDelivery: string;
//   notes: string;
// }

// export interface OrderItemForm {
//   productName: string;
//   sku: string;
//   quantity: string;
//   unitPrice: string;
// }



// ============================================================================
// CORE TYPES (from backend/common interfaces)
// ============================================================================

import { IBaseEntity } from "../../../../../../../common/Base.Interface";

/**
 * Purchase Order Item - represents a single line item in an order
 */
export interface IPurchaseOrderItem {
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  orderContactEmail?: string;
  _id?: string;
}

/**
 * Purchase Order - main order entity
 * Generic TUserId allows flexibility for different user ID types
 */
export interface IPurchaseOrder<TUserId = string> extends IBaseEntity<TUserId> {
  orderNumber: string;
  supplier: string; // Can be ID reference to supplier
  orderDate: Date;
  expectedDelivery: Date;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  items: IPurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  orderContactEmail?: string;
}

/**
 * Supplier interface - matches backend structure
 */
export interface ISupplier {
  _id: string;
  legalBusinessName: string;
  email: string;
  phoneNumber: string;
  contactInformation: {
    contactInformation: string;
    emailAddress: string;
    primaryContactName: string
  };
}

// ============================================================================
// DTO TYPES (Data Transfer Objects - for API calls)
// ============================================================================

/**
 * DTO for creating a new purchase order
 */
export interface CreatePurchaseOrderDTO {
  orderNumber?: string; // Auto-generated if not provided
  supplier: string;
  expectedDelivery: Date | string;
  items: IPurchaseOrderItem[];
  notes?: string;
  userId?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * DTO for updating an existing purchase order
 */
export interface UpdatePurchaseOrderDTO {
  supplier?: string;
  expectedDelivery?: Date | string;
  status?: IPurchaseOrder['status'];
  items?: IPurchaseOrderItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  notes?: string;
  updatedBy?: string;
}

/**
 * Query filters for fetching purchase orders
 */
export interface PurchaseOrderFilters {
  userId?: string;
  status?: string;
  supplier?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  orderId?: string; // For filtering by specific order
}

// ============================================================================
// FRONTEND-SPECIFIC TYPES (for UI state management)
// ============================================================================

/**
 * Purchase order with populated supplier information
 * Used when displaying orders with full supplier details
 */
export interface IPurchaseOrderWithSupplier extends Omit<IPurchaseOrder, 'supplier'> {
  supplier: ISupplier; // Populated supplier object instead of just ID
}

/**
 * Type guard to check if supplier is populated
 */
export function isSupplierPopulated(
  order: IPurchaseOrder | IPurchaseOrderWithSupplier
): order is IPurchaseOrderWithSupplier {
  return typeof order.supplier === 'object' && order.supplier !== null;
}

/**
 * Statistics for purchase orders dashboard
 */
export interface PurchaseOrderStats {
  totalOrders: number;
  pendingOrders: number;
  orderedCount: number;
  receivedCount: number;
}

/**
 * Form data for creating/editing orders
 * Uses string values for form inputs (will be converted to proper types on submit)
 */
export interface OrderFormData {
  supplier: string;
  orderContactEmail: string;
  expectedDelivery: string; // ISO date string for input[type="date"]
  notes: string;
}

/**
 * Form data for adding new items to an order
 * Uses string values for form inputs
 */
export interface OrderItemForm {
  productName: string;
  sku: string;
  quantity: string; // String for input, converted to number on submit
  unitPrice: string; // String for input, converted to number on submit
}

// ============================================================================
// UTILITY TYPES (Flexible helpers)
// ============================================================================

/**
 * Partial order for updates - makes all fields optional except ID
 */
export type PartialPurchaseOrder = Partial<Omit<IPurchaseOrder, '_id'>> & {
  _id: string;
};

/**
 * Order status type - extracted for reuse
 */
export type OrderStatus = IPurchaseOrder['status'];

/**
 * Available order statuses as array (for dropdowns, filters)
 */
export const ORDER_STATUSES: OrderStatus[] = [
  'draft',
  'pending',
  'approved',
  'ordered',
  'received',
  'cancelled'
];

/**
 * Status display configuration
 */
export const STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  draft: {
    label: 'Draft',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100'
  },
  pending: {
    label: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100'
  },
  approved: {
    label: 'Approved',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100'
  },
  ordered: {
    label: 'Ordered',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100'
  },
  received: {
    label: 'Received',
    color: 'text-green-700',
    bgColor: 'bg-green-100'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-100'
  }
};

// ============================================================================
// CONVERSION HELPERS (Transform between types)
// ============================================================================

/**
 * Convert form data to create DTO
 */
export function formDataToCreateDTO(
  formData: OrderFormData,
  items: IPurchaseOrderItem[],
  orderNumber?: string
): Partial<IPurchaseOrder> {
  return {
    orderNumber,
    supplier: formData.supplier,
    orderContactEmail: formData.orderContactEmail,
    expectedDelivery: new Date(formData.expectedDelivery),
    items,
    notes: formData.notes || undefined
  };
}

/**
 * Convert order item form to purchase order item
 */
export function itemFormToOrderItem(itemForm: OrderItemForm): IPurchaseOrderItem {
  const quantity = parseInt(itemForm.quantity);
  const unitPrice = parseFloat(itemForm.unitPrice);
  
  return {
    productName: itemForm.productName.trim(),
    sku: itemForm.sku.trim(),
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice
  };
}

/**
 * Convert purchase order to form data (for editing)
 */
export function orderToFormData(order: IPurchaseOrder | IPurchaseOrderWithSupplier): OrderFormData {
  return {
    supplier: isSupplierPopulated(order) ? order.supplier._id : order.supplier,
    orderContactEmail: order.orderContactEmail || '',
    expectedDelivery: new Date(order.expectedDelivery).toISOString().split('T')[0],
    notes: order.notes || ''
  };
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate order form data
 */
export function validateOrderForm(formData: OrderFormData): string[] {
  const errors: string[] = [];
  
  if (!formData.supplier) {
    errors.push('Supplier is required');
  }
  
  if (!formData.expectedDelivery) {
    errors.push('Expected delivery date is required');
  }
  
  return errors;
}

/**
 * Validate order items
 */
export function validateOrderItems(items: IPurchaseOrderItem[]): string[] {
  const errors: string[] = [];
  
  if (items.length === 0) {
    errors.push('At least one item is required');
  }
  
  items.forEach((item, index) => {
    if (!item.productName) {
      errors.push(`Item ${index + 1}: Product name is required`);
    }
    if (!item.sku) {
      errors.push(`Item ${index + 1}: SKU is required`);
    }
    if (item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
    }
    if (item.unitPrice <= 0) {
      errors.push(`Item ${index + 1}: Unit price must be greater than 0`);
    }
  });
  
  return errors;
}

/**
 * Validate item form before adding
 */
export function validateItemForm(itemForm: OrderItemForm): string | null {
  if (!itemForm.productName) return 'Product name is required';
  if (!itemForm.sku) return 'SKU is required';
  
  const quantity = parseInt(itemForm.quantity);
  if (isNaN(quantity) || quantity <= 0) {
    return 'Quantity must be a number greater than 0';
  }
  
  const unitPrice = parseFloat(itemForm.unitPrice);
  if (isNaN(unitPrice) || unitPrice <= 0) {
    return 'Unit price must be a number greater than 0';
  }
  
  return null; // No errors
}

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

/**
 * Calculate order totals
 */
export interface OrderTotals {
  subtotal: number;
  tax: number;
  total: number;
}

export function calculateOrderTotals(
  items: IPurchaseOrderItem[],
  taxRate: number = 0
): OrderTotals {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}