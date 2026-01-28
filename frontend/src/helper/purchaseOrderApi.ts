import axios from "axios";
import { IPurchaseOrder, IPurchaseOrderItem } from "../../../common/IPurchase.order.interface";
import { ISupplier } from "@common/suppliers/ISuppliers.interface";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/purchase-orders`;
const API_URL1 = `${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers`;


interface PurchaseOrderResponse {
  data: IPurchaseOrder[];
  total: number;
  page: number;
  limit: number;
}

interface PurchaseOrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  supplier?: string;
}

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.id || user._id;
};

/**
 * Fetch all purchase orders with pagination and filters
 */
export const fetchOrders = async (
  page = 1,
  limit = 10,
  ): Promise<PurchaseOrderResponse> => {
  const params: any = {
    userId: getUserId(),
    page,
    limit,
  };



  const res = await axios.get(API_URL, {
    ...getAuthConfig(),
    params,
  });
  console.log("res", res);
  return res.data;
};

/**
 * Fetch single purchase order by ID
 */
export const fetchPurchaseOrderById = async (id: string): Promise<IPurchaseOrder> => {
  const res = await axios.get(`${API_URL}/${id}`, {
    ...getAuthConfig(),
    params: {
      userId: getUserId(),
    },
  });
  return res.data.data;
};

/**
 * Create new purchase order
 */
export const createPurchaseOrder = async (
  payload: Partial<IPurchaseOrder>
): Promise<IPurchaseOrder> => {
  const userId = getUserId();
  
  const completePayload = {
    ...payload,
    userId,
     orderDate: payload.orderDate || new Date(),
  };

  const res = await axios.post(API_URL, completePayload, getAuthConfig());
  return res.data.data;
};

/**
 * Update purchase order
 */
export const updatePurchaseOrder = async (
  id: string,
  payload: Partial<IPurchaseOrder>
): Promise<IPurchaseOrder> => {
  const completePayload = {
    ...payload,
    updatedBy: getUserId(),
  };

  const res = await axios.put(`${API_URL}/${id}`, completePayload, getAuthConfig());
  return res.data.data;
};

/**
 * Delete purchase order (soft delete)
 */
export const deletePurchaseOrder = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return res.data;
};

/**
 * Update purchase order status
 */
export const updatePurchaseOrderStatus = async (
  id: string,
  status: IPurchaseOrder['status']
): Promise<IPurchaseOrder> => {
  const res = await axios.patch(
    `${API_URL}/${id}/status`,
    { status },
    getAuthConfig()
  );
  return res.data.data;
};

/**
 * Generate next order number
 */
export const generateNextOrderNumber = async (): Promise<{ nextOrderNumber: string }> => {
  const res = await axios.get(`${API_URL}/next-order-number`, {
    ...getAuthConfig(),
    params: {
      userId: getUserId(),
    },
  });
  console.log("res", res.data);
  return res.data;
};

/**
 * Get purchase order statistics
 */
export const getPurchaseOrderStats = async (): Promise<{
  total: number;
  byStatus: Record<string, number>;
  totalAmount: number;
  pendingOrders: number;
}> => {
  const res = await axios.get(`${API_URL}/stats/dashboard`, {
    ...getAuthConfig(),
    params: {
      userId: getUserId(),
    },
  });
  return res.data;
};

/**
 * Export purchase orders to CSV/Excel
 */
// In your purchaseOrderApi.ts
export const exportPurchaseOrders = async (filters: PurchaseOrderFilters = {}): Promise<Blob> => {
  const { status, startDate, endDate, supplier } = filters;
  
  const params: any = {
    userId: getUserId(),
  };

  if (status) params.status = status;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (supplier) params.supplier = supplier;

  try {
    console.log('Exporting with params:', params);
    
    const res = await axios.get(`${API_URL}/export`, {
      ...getAuthConfig(),
      params,
      responseType: 'blob',
    });

    // Log response details
    console.log('Export response status:', res.status);
    console.log('Export response headers:', res.headers);
    console.log('Export response data type:', typeof res.data);
    console.log('Export response data size:', res.data.size);
    console.log('Export response content-type:', res.headers['content-type']);

    // Check if response is actually a blob
    if (!(res.data instanceof Blob)) {
      console.error('Response is not a Blob:', res.data);
      
      // If it's JSON (error), try to parse it
      if (typeof res.data === 'string' && res.data.startsWith('{')) {
        const errorData = JSON.parse(res.data);
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Export failed');
      }
      
      throw new Error('Invalid response format');
    }

    // Check if blob is empty
    if (res.data.size === 0) {
      throw new Error('Exported file is empty');
    }

    return res.data;
  } catch (error: any) {
    console.error("Error exporting purchase orders:", error);
    
    // More detailed error logging
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      console.error('Error response data:', error.response.data);
      
      // If error response is blob, convert to text
      if (error.response.data instanceof Blob) {
        const errorText = await error.response.data.text();
        console.error('Error blob content:', errorText);
      }
    }
    
    throw error;
  }
};

/**
 * Bulk update purchase orders
 */
export const bulkUpdatePurchaseOrders = async (
  ids: string[],
  updates: Partial<IPurchaseOrder>
): Promise<{ message: string; updatedCount: number }> => {
  const res = await axios.patch(
    `${API_URL}/bulk-update`,
    { ids, updates, updatedBy: getUserId() },
    getAuthConfig()
  );
  return res.data;
};

/**
 * Calculate purchase order totals (client-side helper)
 */
export const calculateOrderTotals = (items: IPurchaseOrderItem[], taxRate: number = 0) => {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.totalPrice || item.quantity * item.unitPrice;
    return sum + itemTotal;
  }, 0);
  
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

/**
 * Validate purchase order items
 */
export const validatePurchaseOrderItems = (items: IPurchaseOrderItem[]): string[] => {
  const errors: string[] = [];

  if (!items || items.length === 0) {
    errors.push("At least one item is required");
    return errors;
  }

  items.forEach((item, index) => {
    if (!item.productName?.trim()) {
      errors.push(`Item ${index + 1}: Product name is required`);
    }
    if (!item.sku?.trim()) {
      errors.push(`Item ${index + 1}: SKU is required`);
    }
    if (!item.quantity || item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
    }
    if (!item.unitPrice || item.unitPrice <= 0) {
      errors.push(`Item ${index + 1}: Unit price must be greater than 0`);
    }
  });

  return errors;
};



export const fetchSuppliers = async (
  page = 1,
  limit = 10,
  ): Promise<ISupplier> => {
  const params: any = {
    userId: getUserId(),
    page,
    limit,
  };

  const res = await axios.get(API_URL1, {
    ...getAuthConfig(),
    params,
  });
  console.log("supp", res);
  return res.data.data;
};