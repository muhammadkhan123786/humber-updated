import { DeliveryAssignment, DeliveryDriver, FilterOptions } from '../types/delivery';
import { DELIVERY_DRIVERS, mockAssignments } from '../constants/deliveryConstants';

// For backend integration later
export const deliveryService = {
  // Get all assignments
  async getAssignments(filters?: FilterOptions): Promise<DeliveryAssignment[]> {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/delivery/assignments', {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(filters)
    // });
    // return response.json();
    
    // Mock implementation
    let filtered = [...mockAssignments];
    if (filters?.driver && filters.driver !== 'all') {
      filtered = filtered.filter(a => a.driver === filters.driver);
    }
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    return filtered;
  },

  // Get single assignment
  async getAssignmentById(id: string): Promise<DeliveryAssignment | null> {
    // TODO: Replace with actual API call
    return mockAssignments.find(a => a.id === id) || null;
  },

  // Update assignment status
  async updateAssignmentStatus(id: string, status: string): Promise<DeliveryAssignment> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/delivery/assignments/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status })
    // });
    // return response.json();
    
    const assignment = mockAssignments.find(a => a.id === id);
    if (!assignment) throw new Error('Assignment not found');
    return { ...assignment, status: status as any };
  },

  // Get all drivers
  async getDrivers(): Promise<DeliveryDriver[]> {
    // TODO: Replace with actual API call
    return DELIVERY_DRIVERS;
  },

  // Get stats for dashboard
  async getStats(): Promise<{ assigned: number; inTransit: number; delivered: number }> {
    // TODO: Replace with actual API call
    return {
      assigned: mockAssignments.filter(a => a.status === 'assigned').length,
      inTransit: mockAssignments.filter(a => a.status === 'in-transit').length,
      delivered: mockAssignments.filter(a => a.status === 'delivered').length
    };
  }
};