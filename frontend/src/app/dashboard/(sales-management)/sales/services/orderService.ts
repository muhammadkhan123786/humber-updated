import { Order, ShippingLabelData } from '../types/sales';
import { mockOrders, COURIER_SERVICES } from '../constants/salesConstants';

export const orderService = {
  // Get all orders with filters
  async getOrders(filters?: { source?: string; search?: string }): Promise<Order[]> {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/orders', {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(filters)
    // });
    // return response.json();
    
    let filtered = [...mockOrders];
    if (filters?.source && filters.source !== 'all') {
      filtered = filtered.filter(o => o.source === filters.source);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(o => 
        o.orderNumber.toLowerCase().includes(search) ||
        o.customerName.toLowerCase().includes(search) ||
        o.customerEmail.toLowerCase().includes(search)
      );
    }
    return filtered;
  },

  // Get single order
  async getOrderById(id: string): Promise<Order | null> {
    // TODO: Replace with actual API call
    return mockOrders.find(o => o.id === id) || null;
  },

  // Update order
  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/orders/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // });
    // return response.json();
    
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return { ...order, ...orderData };
  },

  // Generate shipping label
  async generateShippingLabel(data: ShippingLabelData): Promise<{ labelUrl: string; trackingNumber: string }> {
    // TODO: Replace with actual API call to courier service
    // const response = await fetch('/api/shipping/generate-label', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();
    
    // Mock response
    return {
      labelUrl: `/api/labels/${data.orderNumber}.pdf`,
      trackingNumber: `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  },

  // Get courier services
  async getCourierServices(): Promise<typeof COURIER_SERVICES> {
    // TODO: Replace with actual API call
    return COURIER_SERVICES;
  }
};