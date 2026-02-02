// // import { useState, useMemo, useEffect } from 'react';
// // import { toast } from 'sonner';
// // import { 
// //   PurchaseOrder, 
// //   PurchaseOrderStats, 
// //   OrderFormData, 
// //   OrderItemForm,
// //   PurchaseOrderItem 
// // } from '../app/dashboard/inventory-dashboard/product-Orders/types/purchaseOrders';
// // import axios from "axios";
// // import { IPurchaseOrder, IPurchaseOrderItem } from "../../../common/IPurchase.order.interface";

// // import { suppliersList } from '../app/dashboard/inventory-dashboard/product-Orders/data/suppliers';

// // export const usePurchaseOrders = () => {
// //   const [orders, setOrders] = useState<IPurchaseOrder[]>();
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [selectedStatus, setSelectedStatus] = useState('all');
// //   const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
// //   const [orderForm, setOrderForm] = useState<OrderFormData>({
// //     supplier: '',
// //     supplierContact: '',
// //     expectedDelivery: '',
// //     notes: ''
// //   });
// //   const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([]);
// //   const [newItem, setNewItem] = useState<OrderItemForm>({
// //     productName: '',
// //     sku: '',
// //     quantity: '',
// //     unitPrice: ''
// //   });

// //   const [loading, setLoading] = useState(true);


  
// //       const fetchOrdersData = async () => {
// //         try {
// //           setLoading(true);
// //           const data = await fetchOrders();
// //           setOrders(data?.data || []);
// //         } catch (error) {
// //           console.error("Failed to load attributes", error);
// //         } finally {
// //           setLoading(false);
// //         }
// //       };
  
// //         useEffect(() => {
// //           fetchOrdersData();
// //         }, []);
  
// //   // Calculate statistics
// //   const stats: PurchaseOrderStats = useMemo(() => ({
// //     totalOrders: orders?.length,
// //     pendingOrders: orders?.filter(o => o.status === 'pending' || o.status === 'approved').length,
// //     orderedCount: orders?.filter(o => o.status === 'ordered').length,
// //     receivedCount: orders?.filter(o => o.status === 'received').length
// //   }), [orders]);

// //   // Filter orders
// //   const filteredOrders = useMemo(() => {
// //     return orders?.filter(order => {
// //       const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                            order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
// //       const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
// //       return matchesSearch && matchesStatus;
// //     });
// //   }, [orders, searchTerm, selectedStatus]);

// //   // Calculate order totals
// //   const calculateTotals = (items: PurchaseOrderItem[]) => {
// //     const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
// //     const tax = subtotal * 0.20; // 20% VAT
// //     const total = subtotal + tax;
// //     return { subtotal, tax, total };
// //   };

// //   // Add item to order
// //   const handleAddItem = () => {
// //     if (!newItem.productName || !newItem.sku || !newItem.quantity || !newItem.unitPrice) {
// //       toast.error('Please fill in all item fields');
// //       return;
// //     }

// //     const item: PurchaseOrderItem = {
// //       id: Date.now().toString(),
// //       productName: newItem.productName,
// //       sku: newItem.sku,
// //       quantity: parseInt(newItem.quantity),
// //       unitPrice: parseFloat(newItem.unitPrice),
// //       totalPrice: parseInt(newItem.quantity) * parseFloat(newItem.unitPrice)
// //     };

// //     setOrderItems(prev => [...prev, item]);
// //     setNewItem({ productName: '', sku: '', quantity: '', unitPrice: '' });
// //     toast.success('Item added to order');
// //   };

// //   // Remove item from order
// //   const handleRemoveItem = (id: string) => {
// //     setOrderItems(prev => prev.filter(item => item.id !== id));
// //     toast.success('Item removed');
// //   };

// //   // Save order
// //   const handleSaveOrder = async() => {
// //     if (!orderForm.supplier || !orderForm.supplierContact || !orderForm.expectedDelivery) {
// //       toast.error('Please fill in all required fields');
// //       return;
// //     }

// //     if (orderItems.length === 0) {
// //       toast.error('Please add at least one item to the order');
// //       return;
// //     }

// //     const { subtotal, tax, total } = calculateTotals(orderItems);

// //     if (editingOrder) {
// //       setOrders(prev => prev.map(o =>
// //         o.id === editingOrder.id
// //           ? {
// //               ...o,
// //               supplier: orderForm.supplier,
// //               supplierContact: orderForm.supplierContact,
// //               expectedDelivery: new Date(orderForm.expectedDelivery),
// //               items: orderItems,
// //               subtotal,
// //               tax,
// //               total,
// //               notes: orderForm.notes
// //             }
// //           : o
// //       ));
// //       toast.success('Purchase order updated successfully!');
// //     } else {
// //       const newOrder: IPurchaseOrder = {
// //         orderNumber: `PO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
// //         supplier: orderForm.supplier,
// //         supplierContact: orderForm.supplierContact,
// //         orderDate: new Date(),
// //         expectedDelivery: new Date(orderForm.expectedDelivery),
// //         status: 'draft',
// //         items: orderItems,
// //         subtotal,
// //         tax,
// //         total,
// //         notes: orderForm.notes
// //       };
// // const res =    await createPurchaseOrder(newOrder);
// // console.log("res", res);
// //       // setOrders(prev => [newOrder, ...prev]);
// //       toast.success('Purchase order created successfully!');
// //     }

// //     resetForm();
// //   };

// //   // Reset form
// //   const resetForm = () => {
// //     setEditingOrder(null);
// //     setOrderForm({
// //       supplier: '',
// //       supplierContact: '',
// //       expectedDelivery: '',
// //       notes: ''
// //     });
// //     setOrderItems([]);
// //     setNewItem({ productName: '', sku: '', quantity: '', unitPrice: '' });
// //   };

// //   // Delete order
// //   const handleDeleteOrder = (id: string) => {
// //     setOrders(prev => prev.filter(o => o.id !== id));
// //     toast.success('Purchase order deleted successfully!');
// //   };

// //   // Update order status
// //   const handleStatusChange = (orderId: string, newStatus: PurchaseOrder['status']) => {
// //     setOrders(prev => prev.map(o =>
// //       o.id === orderId ? { ...o, status: newStatus } : o
// //     ));
// //     toast.success(`Order status updated to ${newStatus}`);
// //   };

// //   // Edit order
// //   const handleEditOrder = (order: PurchaseOrder) => {
// //     setEditingOrder(order);
// //     setOrderForm({
// //       supplier: order.supplier,
// //       supplierContact: order.supplierContact,
// //       expectedDelivery: order.expectedDelivery.toISOString().split('T')[0],
// //       notes: order.notes
// //     });
// //     setOrderItems([...order.items]);
// //   };

// //   // Available statuses
// //   const statuses = ['all', 'draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'];

// //   return {
// //     orders,
// //     filteredOrders,
// //     stats,
// //     searchTerm,
// //     setSearchTerm,
// //     selectedStatus,
// //     setSelectedStatus,
// //     editingOrder,
// //     orderForm,
// //     setOrderForm,
// //     orderItems,
// //     newItem,
// //     setNewItem,
// //     suppliers: suppliersList,
// //     statuses,
// //     handleAddItem,
// //     handleRemoveItem,
// //     handleSaveOrder,
// //     resetForm,
// //     handleDeleteOrder,
// //     handleStatusChange,
// //     handleEditOrder,
// //     calculateTotals
// //   };
// // };






// // // Backend route ke mutabiq API URL
// // const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/purchase-orders`;

// // interface PurchaseOrderResponse {
// //   data: IPurchaseOrder[];
// //   total: number;
// //   page: number;
// //   limit: number;
// // }

// // const getAuthConfig = () => {
// //   const token = localStorage.getItem("token");
// //   return {
// //     headers: { Authorization: `Bearer ${token}` },
// //   };
// // };

// // const getUserId = () => {
// //   const user = JSON.parse(localStorage.getItem("user") || "{}");
// //   return user.id || user._id;
// // };




// // export const fetchOrders = async (
// //   page = 1,
// //   limit = 10,
// //   search = "",  
// // ): Promise<PurchaseOrderResponse> => {
// //    const res = await axios.get(API_URL, {
// //     ...getAuthConfig(),
// //     params: {
// //       userId: getUserId(),
// //       page,
// //       limit,
// //       search,
      
// //     },
// //     paramsSerializer: params =>
// //       new URLSearchParams(params as any).toString(),
// //   });
// //   return res.data;
// // };



// // /**
// //  * Single purchase order fetch karne ke liye by ID
// //  */
// // export const fetchPurchaseOrderById = async (id: string): Promise<IPurchaseOrder> => {
// //   try {
// //     const res = await axios.get(API_URL, {
// //       ...getAuthConfig(),
// //       params: {
// //         userId: getUserId(),
// //       },
// //     });
// //     return res.data;
// //   } catch (error) {
// //     console.error(`Error fetching purchase order ${id}:`, error);
// //     throw error;
// //   }
// // };

// // /**
// //  * Naya purchase order create karne ke liye
// //  */
// // // export const createPurchaseOrder = async (
// // //   payload: IPurchaseOrder
// // // ): Promise<IPurchaseOrder> => {
// // //   try {
// // //     const userId = getUserId();
// // //     const completePayload = {
// // //       ...payload,
// // //       createdBy: userId,
// // //       updatedBy: userId,
// // //       orderDate: new Date().toISOString(),
// // //     };

// // //     const res = await axios.post(API_URL, completePayload, getAuthConfig());
// // //     return res.data;
// // //   } catch (error) {
// // //     console.error("Error creating purchase order:", error);
// // //     throw error;
// // //   }
// // // };

// // export const createPurchaseOrder = async (
// //   payload: Partial<IPurchaseOrder>
// // ): Promise<IPurchaseOrder> => {
// //   const res = await axios.post(API_URL, payload, getAuthConfig());
 
// //   return res.data;
// // };
// // /**
// //  * Purchase order update karne ke liye
// //  */
// // // export const updatePurchaseOrder = async (
// // //   id: string,
// // //   payload: UpdatePurchaseOrderDTO
// // // ): Promise<IPurchaseOrder> => {
// // //   try {
// // //     const completePayload = {
// // //       ...payload,
// // //       updatedBy: getUserId(),
// // //     };

// // //     const res = await axios.put(
// // //       `${API_URL}/${id}`,
// // //       completePayload,
// // //       getAuthConfig()
// // //     );
// // //     return res.data;
// // //   } catch (error) {
// // //     console.error(`Error updating purchase order ${id}:`, error);
// // //     throw error;
// // //   }
// // // };

// // /**
// //  * Purchase order delete karne ke liye
// //  */
// // export const deletePurchaseOrder = async (id: string): Promise<{ message: string }> => {
// //   try {
// //     const res = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
// //     return res.data;
// //   } catch (error) {
// //     console.error(`Error deleting purchase order ${id}:`, error);
// //     throw error;
// //   }
// // };

// // /**
// //  * Purchase order status update karne ke liye
// //  */
// // export const updatePurchaseOrderStatus = async (
// //   id: string,
// //   status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled'
// // ): Promise<IPurchaseOrder> => {
// //   try {
// //     const res = await axios.patch(
// //       `${API_URL}/${id}/status`,
// //       { status },
// //       getAuthConfig()
// //     );
// //     return res.data;
// //   } catch (error) {
// //     console.error(`Error updating purchase order status ${id}:`, error);
// //     throw error;
// //   }
// // };

// // /**
// //  * Generate next order number ke liye
// //  */
// // export const generateNextOrderNumber = async (): Promise<{ nextOrderNumber: string }> => {
// //   try {
// //     const res = await axios.get(`${API_URL}/next-order-number`, getAuthConfig());
// //     return res.data;
// //   } catch (error) {
// //     console.error("Error generating next order number:", error);
// //     throw error;
// //   }
// // };

// // /**
// //  * Purchase order summary/statistics fetch karne ke liye
// //  */
// // export const getPurchaseOrderStats = async (): Promise<{
// //   total: number;
// //   byStatus: Record<string, number>;
// //   totalAmount: number;
// //   pendingOrders: number;
// // }> => {
// //   try {
// //     const res = await axios.get(`${API_URL}/stats/dashboard`, {
// //       ...getAuthConfig(),
// //       params: {
// //         userId: getUserId(),
// //       },
// //     });
// //     return res.data;
// //   } catch (error) {
// //     console.error("Error fetching purchase order stats:", error);
// //     throw error;
// //   }
// // };

// // /**
// //  * Export purchase orders to CSV/Excel ke liye
// //  */
// // export const exportPurchaseOrders = async (filters: PurchaseOrderFilters = {}): Promise<Blob> => {
// //   try {
// //     const { status, startDate, endDate } = filters;
    
// //     const params: any = {
// //       userId: getUserId(),
// //     };

// //     if (status) params.status = status;
// //     if (startDate) params.startDate = startDate;
// //     if (endDate) params.endDate = endDate;

// //     const res = await axios.get(`${API_URL}/export`, {
// //       ...getAuthConfig(),
// //       params,
// //       responseType: 'blob',
// //     });
// //     return res.data;
// //   } catch (error) {
// //     console.error("Error exporting purchase orders:", error);
// //     throw error;
// //   }
// // };

// // /**
// //  * Bulk update purchase orders ke liye
// //  */
// // export const bulkUpdatePurchaseOrders = async (
// //   ids: string[],
// //   updates: Partial<UpdatePurchaseOrderDTO>
// // ): Promise<{ message: string; updatedCount: number }> => {
// //   try {
// //     const res = await axios.patch(
// //       `${API_URL}/bulk-update`,
// //       { ids, updates },
// //       getAuthConfig()
// //     );
// //     return res.data;
// //   } catch (error) {
// //     console.error("Error bulk updating purchase orders:", error);
// //     throw error;
// //   }
// // };

// // /**
// //  * Calculate purchase order totals ke liye (client-side)
// //  */
// // export const calculateOrderTotals = (items: IPurchaseOrderItem[], taxRate: number = 0) => {
// //   const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || item.quantity * item.unitPrice), 0);
// //   const tax = subtotal * (taxRate / 100);
// //   const total = subtotal + tax;

// //   return {
// //     subtotal: Math.round(subtotal * 100) / 100,
// //     tax: Math.round(tax * 100) / 100,
// //     total: Math.round(total * 100) / 100,
// //   };
// // };

// // /**
// //  * Validate purchase order items ke liye
// //  */
// // export const validatePurchaseOrderItems = (items: IPurchaseOrderItem[]): string[] => {
// //   const errors: string[] = [];

// //   if (!items || items.length === 0) {
// //     errors.push("At least one item is required");
// //     return errors;
// //   }

// //   items.forEach((item, index) => {
// //     if (!item.productName?.trim()) {
// //       errors.push(`Item ${index + 1}: Product name is required`);
// //     }
// //     if (!item.sku?.trim()) {
// //       errors.push(`Item ${index + 1}: SKU is required`);
// //     }
// //     if (!item.quantity || item.quantity <= 0) {
// //       errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
// //     }
// //     if (!item.unitPrice || item.unitPrice <= 0) {
// //       errors.push(`Item ${index + 1}: Unit price must be greater than 0`);
// //     }
// //   });

// //   return errors;
// // };







// 'use client'

// import { useState, useMemo, useEffect } from 'react';
// import { toast } from 'sonner';
// import { 
//   PurchaseOrderStats, 
//   OrderFormData, 
//   OrderItemForm,
// } from '../app/dashboard/inventory-dashboard/product-Orders/types/purchaseOrders';
// import { IPurchaseOrder, IPurchaseOrderItem } from "../../../common/IPurchase.order.interface";
// // import { suppliersList } from '../app/dashboard/inventory-dashboard/product-Orders/data/suppliers';
// import * as PurchaseOrderAPI from '../helper/purchaseOrderApi';
// import { ISupplier } from '@common/suppliers/ISuppliers.interface';

// export const usePurchaseOrders = () => {
//   const [orders, setOrders] = useState<IPurchaseOrder[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [editingOrder, setEditingOrder] = useState<IPurchaseOrder | null>(null);
//   const [orderForm, setOrderForm] = useState<OrderFormData>({
//     supplier: '',
//     orderContactEmail: '',
//     expectedDelivery: '',
//     notes: ''
//   });
//   const [orderItems, setOrderItems] = useState<IPurchaseOrderItem[]>([]);
//   const [newItem, setNewItem] = useState<OrderItemForm>({
//     productName: '',
//     sku: '',
//     quantity: '',
//     unitPrice: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [orderNumber, setOrderNumber] = useState<string>("");
//   const [loadingOrderNumber, setLoadingOrderNumber] = useState(false);

//   const [suppliersList, setSupplierList] = useState<ISupplier>([]);


//   // Fetch orders from backend
//   const fetchOrdersData = async () => {
//     try {
//       setLoading(true);
//       const statusFilter = selectedStatus !== 'all' ? selectedStatus : undefined;
//       const response = await PurchaseOrderAPI.fetchOrders(page, limit);
//       setOrders(response.data || []);
//       setTotal(response.total || 0);
//     } catch (error) {
//       console.error("Failed to load orders", error);
//       toast.error('Failed to load purchase orders');
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   useEffect( () => {
//      const fetchSuppliers = async () => {
//    try {
//      const res = await PurchaseOrderAPI.fetchSuppliers();
//      setSupplierList(res)
//     console.log("supp", res)
//    } catch (error) {
//     console.log("Error in fetching in Supplier", error)
//    }
//   }
//   fetchSuppliers();
//   }, [])

//   //  fetch Auto Number
//   useEffect(() => {
//   const fetchOrderNumber = async () => {
//     try {
//       setLoadingOrderNumber(true);
//       const { nextOrderNumber } = await PurchaseOrderAPI.generateNextOrderNumber();
//       setOrderNumber(nextOrderNumber);
//     } catch (err) {
//       console.error("Failed to generate order number", err);
//     } finally {
//       setLoadingOrderNumber(false);
//     }
//   };

//   fetchOrderNumber();
// }, []);


//   useEffect(() => {
//     fetchOrdersData();
    
//   }, [page, searchTerm, selectedStatus]);

//   // Calculate statistics
//   const stats: PurchaseOrderStats = useMemo(() => ({
//     totalOrders: orders?.length || 0,
//     pendingOrders: orders?.filter(o => o.status === 'pending' || o.status === 'approved').length || 0,
//     orderedCount: orders?.filter(o => o.status === 'ordered').length || 0,
//     receivedCount: orders?.filter(o => o.status === 'received').length || 0
//   }), [orders]);

//   // Filter orders (client-side for immediate feedback)
//   const filteredOrders = useMemo(() => {
//     return orders;
//   }, [orders]);

//   // Calculate order totals
//   const calculateTotals = (items: IPurchaseOrderItem[]) => {
//     const result = PurchaseOrderAPI.calculateOrderTotals(items, 20);
//     return result;
//   };

//   // Add item to order
//   const handleAddItem = () => {
//     if (!newItem.productName || !newItem.sku || !newItem.quantity || !newItem.unitPrice) {
//       toast.error('Please fill in all item fields');
//       return;
//     }

//     const quantity = parseInt(newItem.quantity);
//     const unitPrice = parseFloat(newItem.unitPrice);

//     if (quantity <= 0) {
//       toast.error('Quantity must be greater than 0');
//       return;
//     }

//     if (unitPrice <= 0) {
//       toast.error('Unit price must be greater than 0');
//       return;
//     }

//     const item: IPurchaseOrderItem = {
//       productName: newItem.productName.trim(),
//       sku: newItem.sku.trim(),
//       quantity: quantity,
//       unitPrice: unitPrice,
//       totalPrice: quantity * unitPrice
//     };

//     setOrderItems(prev => [...prev, item]);
//     setNewItem({ productName: '', sku: '', quantity: '', unitPrice: '' });
//     toast.success('Item added to order');
//   };

//   // Remove item from order (by index since IPurchaseOrderItem doesn't have id)
//   const handleRemoveItem = (index: number) => {
//     setOrderItems(prev => prev.filter((_, i) => i !== index));
//     toast.success('Item removed');
//   };


//   // Save order (create or update)
//   const handleSaveOrder = async () => {
//     if (!orderForm.supplier || !orderForm.expectedDelivery) {
//       toast.error('Please fill in all required fields');
//       return false;
//     }

//     if (orderItems.length === 0) {
//       toast.error('Please add at least one item to the order');
//       return false;
//     }

//     // Validate items
//     const validationErrors = PurchaseOrderAPI.validatePurchaseOrderItems(orderItems);
//     if (validationErrors.length > 0) {
//       toast.error(validationErrors[0]);
//       return false;
//     }
//     const { subtotal, tax, total } = calculateTotals(orderItems);

//     try {
//       setLoading(true);

//       if (editingOrder && editingOrder._id) {
//         // Update existing order
//         const updatePayload: Partial<IPurchaseOrder> = {
//           supplier: orderForm.supplier,          
//           expectedDelivery: new Date(orderForm.expectedDelivery),
//           items: orderItems,
//           subtotal,
//           tax,
//           total,
//           notes: orderForm.notes
//         };

//         await PurchaseOrderAPI.updatePurchaseOrder(editingOrder._id, updatePayload);
//         toast.success('Purchase order updated successfully!');
//       } else {
//         // Create new order
//         const newOrder: Partial<IPurchaseOrder> = {
//           orderNumber: orderNumber,
//            supplier: orderForm.supplier,
//           expectedDelivery: new Date(orderForm.expectedDelivery),
//           status: 'draft',
//           items: orderItems,
//           subtotal,
//           tax,
//           total,
//           notes: orderForm.notes
//         };

//         await PurchaseOrderAPI.createPurchaseOrder(newOrder);
//         toast.success('Purchase order created successfully!');
//       }

//       resetForm();
//       await fetchOrdersData(); // Refresh list
//       return true; // Success
//     } catch (error: any) {
//       console.error('Error saving order:', error);
//       toast.error(error.response?.data?.message || 'Failed to save purchase order');
//       return false; // Failure
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setEditingOrder(null);
//     setOrderForm({
//       supplier: '',
//       orderContactEmail: '',
//       expectedDelivery: '',
//       notes: ''
//     });
//     setOrderItems([]);
//     setNewItem({ productName: '', sku: '', quantity: '', unitPrice: '' });
//   };

//   // Delete order
//   const handleDeleteOrder = async (id: string) => {
//     try {
//       setLoading(true);
//       console.log("id", id);
//       await PurchaseOrderAPI.deletePurchaseOrder(id);
//       toast.success('Purchase order deleted successfully!');
//       await fetchOrdersData(); // Refresh list
//     } catch (error: any) {
//       console.error('Error deleting order:', error);
//       toast.error(error.response?.data?.message || 'Failed to delete purchase order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update order status
//   const handleStatusChange = async (orderId: string, newStatus: IPurchaseOrder['status']) => {
//     try {
//       setLoading(true);
//       await PurchaseOrderAPI.updatePurchaseOrderStatus(orderId, newStatus);
//       toast.success(`Order status updated to ${newStatus}`);
//       await fetchOrdersData(); // Refresh list
//     } catch (error: any) {
//       console.error('Error updating status:', error);
//       toast.error(error.response?.data?.message || 'Failed to update order status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Edit order
//   const handleEditOrder = (order: IPurchaseOrder) => {
//     setEditingOrder(order);
//     setOrderForm({
//       supplier: order.supplier,
//       orderContactEmail: order.orderContactEmail,
//       expectedDelivery: new Date(order.expectedDelivery).toISOString().split('T')[0],
//       notes: order.notes || ''
//     });
//     setOrderItems([...order.items]);
//   };

// const handleExportSingleOrder = async (order: IPurchaseOrder) => {
//   try {
//     setLoading(true);
//     // Use the order ID to filter
//     const filters = {
//       orderId: order._id,
//       status: order.status,
//     };
    
//     const blob = await PurchaseOrderAPI.exportPurchaseOrders(filters);
//     console.log("blob", blob)
//     // Create download link
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Purchase-Order-${order.orderNumber}.pdf`;
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
    
//     toast.success(`Order ${order.orderNumber} exported successfully`);
//     return true;
//   } catch (error: any) {
//     console.error('Error exporting order:', error);
//     toast.error('Failed to export order');
//     return false;
//   } finally {
//     setLoading(false);
//   }
// };
//   // Available statuses
//   const statuses = ['all', 'draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'];

//   return {
//     orders,
//     filteredOrders,
//     stats,
//     searchTerm,
//     setSearchTerm,
//     selectedStatus,
//     setSelectedStatus,
//     editingOrder,
//     orderForm,
//     setOrderForm,
//     orderItems,
//     newItem,
//     setNewItem,
//     suppliers: suppliersList,
//     statuses,
//     loading,
//     page,
//     setPage,
//     limit,
//     total,
//     handleAddItem,
//     handleRemoveItem,
//     handleSaveOrder,
//     resetForm,
//     handleDeleteOrder,
//     handleStatusChange,
//     handleEditOrder,
//     calculateTotals,
//     refreshOrders: fetchOrdersData,
//     orderNumber,
//     handleExportSingleOrder,
//   };
// };




'use client'

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  IPurchaseOrder,
  IPurchaseOrderItem,
  IPurchaseOrderWithSupplier,
  ISupplier,
  PurchaseOrderStats,
  OrderFormData,
  OrderItemForm,
  OrderStatus,
  PurchaseOrderFilters,
  validateOrderForm,
  validateItemForm,
  itemFormToOrderItem,
  orderToFormData,
  calculateOrderTotals,
  formDataToCreateDTO
} from '../app/dashboard/inventory-dashboard/product-Orders/types/purchaseOrders';
import * as PurchaseOrderAPI from '../helper/purchaseOrderApi';

export const usePurchaseOrders = () => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [orders, setOrders] = useState<IPurchaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingOrder, setEditingOrder] = useState<IPurchaseOrder | null>(null);
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    supplier: '',
    orderContactEmail: '',
    expectedDelivery: '',
    notes: ''
  });
  const [orderItems, setOrderItems] = useState<IPurchaseOrderItem[]>([]);
  const [newItem, setNewItem] = useState<OrderItemForm>({
    productName: '',
    sku: '',
    quantity: '',
    unitPrice: ''
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [loadingOrderNumber, setLoadingOrderNumber] = useState(false);
const [suppliersList, setSupplierList] = useState<ISupplier[]>([]);

  // ============================================================================
  // FETCH OPERATIONS
  // ============================================================================

  /**
   * Fetch orders from backend
   */
  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const statusFilter = selectedStatus !== 'all' ? selectedStatus : undefined;
      const response = await PurchaseOrderAPI.fetchOrders(page, limit);
      setOrders(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error("Failed to load orders", error);
      toast.error('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch suppliers from backend
   */
  const fetchSuppliers = async () => {
    try {
      const res = await PurchaseOrderAPI.fetchSuppliers();
      setSupplierList(res);
      console.log("Suppliers:", res);
    } catch (error) {
      console.log("Error in fetching suppliers", error);
      toast.error('Failed to load suppliers');
    }
  };

  /**
   * Fetch next order number
   */
  const fetchOrderNumber = async () => {
    try {
      setLoadingOrderNumber(true);
      const { nextOrderNumber } = await PurchaseOrderAPI.generateNextOrderNumber();
      setOrderNumber(nextOrderNumber);
    } catch (err) {
      console.error("Failed to generate order number", err);
      toast.error('Failed to generate order number');
    } finally {
      setLoadingOrderNumber(false);
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchSuppliers();
    fetchOrderNumber();
  }, []);

  useEffect(() => {
    fetchOrdersData();
  }, [page, searchTerm, selectedStatus]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  /**
   * Calculate statistics from orders
   */
  const stats: PurchaseOrderStats = useMemo(() => ({
    totalOrders: orders?.length || 0,
    pendingOrders: orders?.filter(o => o.status === 'pending' || o.status === 'approved').length || 0,
    orderedCount: orders?.filter(o => o.status === 'ordered').length || 0,
    receivedCount: orders?.filter(o => o.status === 'received').length || 0
  }), [orders]);

  /**
   * Filter orders (client-side for immediate feedback)
   */
  const filteredOrders = useMemo(() => {
    return orders;
  }, [orders]);

  // ============================================================================
  // ITEM MANAGEMENT
  // ============================================================================

  /**
   * Add item to order
   */
  const handleAddItem = () => {
    // Validate item form
    const validationError = validateItemForm(newItem);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Convert form data to order item
    const item = itemFormToOrderItem(newItem);
    
    setOrderItems(prev => [...prev, item]);
    setNewItem({ productName: '', sku: '', quantity: '', unitPrice: '' });
    toast.success('Item added to order');
  };

  /**
   * Remove item from order by index
   */
  const handleRemoveItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
    toast.success('Item removed');
  };

  // ============================================================================
  // ORDER CRUD OPERATIONS
  // ============================================================================

  /**
   * Save order (create or update)
   */
  const handleSaveOrder = async (): Promise<boolean> => {
    // Validate form
    const formErrors = validateOrderForm(orderForm);
    if (formErrors.length > 0) {
      toast.error(formErrors[0]);
      return false;
    }

    if (orderItems.length === 0) {
      toast.error('Please add at least one item to the order');
      return false;
    }

    const { subtotal, tax, total } = calculateOrderTotals(orderItems, 20);

    try {
      setLoading(true);

      if (editingOrder?._id) {
        // Update existing order
        const updatePayload: Partial<IPurchaseOrder> = {
          supplier: orderForm.supplier,
          orderContactEmail: orderForm.orderContactEmail,
          expectedDelivery: new Date(orderForm.expectedDelivery),
          items: orderItems,
          subtotal,
          tax,
          total,
          notes: orderForm.notes
        };

        await PurchaseOrderAPI.updatePurchaseOrder(editingOrder._id, updatePayload);
        toast.success('Purchase order updated successfully!');
      } else {
        // Create new order
        const newOrder = formDataToCreateDTO(orderForm, orderItems, orderNumber);
        newOrder.status = 'draft';
        newOrder.subtotal = subtotal;
        newOrder.tax = tax;
        newOrder.total = total;

        await PurchaseOrderAPI.createPurchaseOrder(newOrder);
        toast.success('Purchase order created successfully!');
      }

      resetForm();
      await fetchOrdersData();
      await fetchOrderNumber(); // Get new order number for next order
      return true;
    } catch (error: any) {
      console.error('Error saving order:', error);
      toast.error(error.response?.data?.message || 'Failed to save purchase order');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete order
   */
  const handleDeleteOrder = async (id: string | null | undefined) => {
    if (!id) {
      toast.error('Invalid order ID');
      return;
    }

    try {
      setLoading(true);
      await PurchaseOrderAPI.deletePurchaseOrder(id);
      toast.success('Purchase order deleted successfully!');
      await fetchOrdersData();
    } catch (error: any) {
      console.error('Error deleting order:', error);
      toast.error(error.response?.data?.message || 'Failed to delete purchase order');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update order status
   */
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setLoading(true);
      await PurchaseOrderAPI.updatePurchaseOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      await fetchOrdersData();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Edit order - populate form with order data
   */
  const handleEditOrder = (order: IPurchaseOrder) => {
    setEditingOrder(order);
    setOrderForm(orderToFormData(order));
    setOrderItems([...order.items]);
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setEditingOrder(null);
    setOrderForm({
      supplier: '',
      orderContactEmail: '',
      expectedDelivery: '',
      notes: ''
    });
    setOrderItems([]);
    setNewItem({ productName: '', sku: '', quantity: '', unitPrice: '' });
  };

  // ============================================================================
  // EXPORT FUNCTIONALITY
  // ============================================================================

  /**
   * Export single order as PDF
   */
  const handleExportSingleOrder = async (order: IPurchaseOrder): Promise<boolean> => {
    try {
      setLoading(true);
      
      const filters: PurchaseOrderFilters = {
        orderId: order._id,
        status: order.status,
      };
      
      const blob = await PurchaseOrderAPI.exportPurchaseOrders(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Purchase-Order-${order.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Order ${order.orderNumber} exported successfully`);
      return true;
    } catch (error: any) {
      console.error('Error exporting order:', error);
      toast.error('Failed to export order');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // RETURN API
  // ============================================================================

  const statuses = ['all', 'draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'];

  return {
    // Data
    orders,
    filteredOrders,
    stats,
    suppliers: suppliersList,
    statuses,
    
    // Loading states
    loading,
    loadingOrderNumber,
    
    // Pagination
    page,
    setPage,
    limit,
    total,
    
    // Filters
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    
    // Form state
    editingOrder,
    orderForm,
    setOrderForm,
    orderItems,
    newItem,
    setNewItem,
    orderNumber,
    
    // Actions
    handleAddItem,
    handleRemoveItem,
    handleSaveOrder,
    resetForm,
    handleDeleteOrder,
    handleStatusChange,
    handleEditOrder,
    calculateTotals: calculateOrderTotals,
    refreshOrders: fetchOrdersData,
    handleExportSingleOrder,
  };
};



