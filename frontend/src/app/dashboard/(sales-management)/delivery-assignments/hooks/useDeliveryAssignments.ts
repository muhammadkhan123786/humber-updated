import { useState, useEffect, useCallback } from 'react';
import { DeliveryAssignment, FilterOptions } from '../types/delivery';
import { deliveryService } from '../services/deliveryService';
import { toast } from 'sonner';

export const useDeliveryAssignments = () => {
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({ driver: 'all', status: 'all' });
  const [stats, setStats] = useState({ assigned: 0, inTransit: 0, delivered: 0 });

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await deliveryService.getAssignments(filters);
      setAssignments(data);
      const statsData = await deliveryService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateAssignmentStatus = async (id: string, status: string) => {
    try {
      await deliveryService.updateAssignmentStatus(id, status);
      await fetchAssignments(); // Refresh data
      toast.success('Assignment status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return {
    assignments,
    loading,
    filters,
    setFilters,
    stats,
    updateAssignmentStatus,
    refreshAssignments: fetchAssignments
  };
};