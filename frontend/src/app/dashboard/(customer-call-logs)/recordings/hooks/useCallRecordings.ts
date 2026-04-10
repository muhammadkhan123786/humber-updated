import { useState, useEffect, useCallback } from 'react';
import { callRecordingService } from '../services/callRecordingService';
import { CallRecording, RecordingStats } from '../types/callRecording';
import { toast } from 'sonner';

export const useCallRecordings = () => {
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [stats, setStats] = useState<RecordingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [recordingsData, statsData] = await Promise.all([
        callRecordingService.getRecordings({ search: searchTerm, status: selectedStatus }),
        callRecordingService.getStats(),
      ]);
      setRecordings(recordingsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load recordings');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const downloadRecording = async (id: string) => {
    try {
      await callRecordingService.downloadRecording(id);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download');
    }
  };

  const bulkDownload = async (ids: string[]) => {
    try {
      await callRecordingService.bulkDownload(ids);
      toast.success(`Downloading ${ids.length} recordings`);
    } catch (error) {
      toast.error('Failed to bulk download');
    }
  };

  return {
    recordings,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    downloadRecording,
    bulkDownload,
    refreshData: fetchData,
  };
};