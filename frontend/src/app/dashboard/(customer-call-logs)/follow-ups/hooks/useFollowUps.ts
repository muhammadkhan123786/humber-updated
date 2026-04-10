import { useState, useEffect, useCallback } from 'react';
import { followUpService } from '../services/followUpService';
import { FollowUp, FollowUpStats } from '../types/followUp';
import { toast } from 'sonner';

export const useFollowUps = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [stats, setStats] = useState<FollowUpStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [followUpsData, statsData] = await Promise.all([
        followUpService.getFollowUps({ 
          search: searchTerm, 
          status: selectedStatus, 
          priority: selectedPriority 
        }),
        followUpService.getStats(),
      ]);
      setFollowUps(followUpsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      toast.error('Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus, selectedPriority]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const completeFollowUp = async (id: string) => {
    try {
      await followUpService.completeFollowUp(id);
      toast.success('Follow-up completed successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to complete follow-up');
    }
  };

  const rescheduleFollowUp = async (id: string, newDate: string, newTime: string) => {
    try {
      await followUpService.rescheduleFollowUp(id, newDate, newTime);
      toast.success('Follow-up rescheduled successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to reschedule follow-up');
    }
  };

  return {
    followUps,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    completeFollowUp,
    rescheduleFollowUp,
    refreshData: fetchData,
  };
};