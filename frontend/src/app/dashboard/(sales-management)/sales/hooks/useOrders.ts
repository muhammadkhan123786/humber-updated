import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types/sales';
import { orderService } from '../services/orderService';
import { toast } from 'sonner';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ source: 'all', search: '' });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders(filters);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateOrder = async (id: string, orderData: Partial<Order>) => {
    try {
      const updatedOrder = await orderService.updateOrder(id, orderData);
      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
      toast.success('Order updated successfully');
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    filters,
    setFilters,
    updateOrder,
    refreshOrders: fetchOrders
  };
};