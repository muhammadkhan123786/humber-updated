import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  PurchaseOrder, 
  PurchaseOrderStats, 
  OrderFormData, 
  OrderItemForm,
  PurchaseOrderItem 
} from '../app/dashboard/inventory-dashboard/product-Orders/types/purchaseOrders';
import { mockPurchaseOrders } from '../app/dashboard/inventory-dashboard/product-Orders/data/purchaseOrders';
import { suppliersList } from '../app/dashboard/inventory-dashboard/product-Orders/data/suppliers';

export const usePurchaseOrders = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    supplier: '',
    supplierContact: '',
    expectedDelivery: '',
    notes: ''
  });
  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [newItem, setNewItem] = useState<OrderItemForm>({
    productName: '',
    sku: '',
    quantity: '',
    unitPrice: ''
  });

  // Calculate statistics
  const stats: PurchaseOrderStats = useMemo(() => ({
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'approved').length,
    orderedCount: orders.filter(o => o.status === 'ordered').length,
    receivedCount: orders.filter(o => o.status === 'received').length
  }), [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  // Calculate order totals
  const calculateTotals = (items: PurchaseOrderItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.20; // 20% VAT
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // Add item to order
  const handleAddItem = () => {
    if (!newItem.productName || !newItem.sku || !newItem.quantity || !newItem.unitPrice) {
      toast.error('Please fill in all item fields');
      return;
    }

    const item: PurchaseOrderItem = {
      id: Date.now().toString(),
      productName: newItem.productName,
      sku: newItem.sku,
      quantity: parseInt(newItem.quantity),
      unitPrice: parseFloat(newItem.unitPrice),
      totalPrice: parseInt(newItem.quantity) * parseFloat(newItem.unitPrice)
    };

    setOrderItems(prev => [...prev, item]);
    setNewItem({ productName: '', sku: '', quantity: '', unitPrice: '' });
    toast.success('Item added to order');
  };

  // Remove item from order
  const handleRemoveItem = (id: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed');
  };

  // Save order
  const handleSaveOrder = () => {
    if (!orderForm.supplier || !orderForm.supplierContact || !orderForm.expectedDelivery) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Please add at least one item to the order');
      return;
    }

    const { subtotal, tax, total } = calculateTotals(orderItems);

    if (editingOrder) {
      setOrders(prev => prev.map(o =>
        o.id === editingOrder.id
          ? {
              ...o,
              supplier: orderForm.supplier,
              supplierContact: orderForm.supplierContact,
              expectedDelivery: new Date(orderForm.expectedDelivery),
              items: orderItems,
              subtotal,
              tax,
              total,
              notes: orderForm.notes
            }
          : o
      ));
      toast.success('Purchase order updated successfully!');
    } else {
      const newOrder: PurchaseOrder = {
        id: Date.now().toString(),
        orderNumber: `PO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
        supplier: orderForm.supplier,
        supplierContact: orderForm.supplierContact,
        orderDate: new Date(),
        expectedDelivery: new Date(orderForm.expectedDelivery),
        status: 'draft',
        items: orderItems,
        subtotal,
        tax,
        total,
        notes: orderForm.notes
      };
      setOrders(prev => [newOrder, ...prev]);
      toast.success('Purchase order created successfully!');
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setEditingOrder(null);
    setOrderForm({
      supplier: '',
      supplierContact: '',
      expectedDelivery: '',
      notes: ''
    });
    setOrderItems([]);
    setNewItem({ productName: '', sku: '', quantity: '', unitPrice: '' });
  };

  // Delete order
  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    toast.success('Purchase order deleted successfully!');
  };

  // Update order status
  const handleStatusChange = (orderId: string, newStatus: PurchaseOrder['status']) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
    toast.success(`Order status updated to ${newStatus}`);
  };

  // Edit order
  const handleEditOrder = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setOrderForm({
      supplier: order.supplier,
      supplierContact: order.supplierContact,
      expectedDelivery: order.expectedDelivery.toISOString().split('T')[0],
      notes: order.notes
    });
    setOrderItems([...order.items]);
  };

  // Available statuses
  const statuses = ['all', 'draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'];

  return {
    orders,
    filteredOrders,
    stats,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    editingOrder,
    orderForm,
    setOrderForm,
    orderItems,
    newItem,
    setNewItem,
    suppliers: suppliersList,
    statuses,
    handleAddItem,
    handleRemoveItem,
    handleSaveOrder,
    resetForm,
    handleDeleteOrder,
    handleStatusChange,
    handleEditOrder,
    calculateTotals
  };
};