'use client';

import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/form/CustomButton';
import { StatsCard } from '../components/CallRecording/StatsCard';
import { RecordingFilters } from '../components/CallRecording/RecordingFilters';
import { RecordingsTable } from '../components/CallRecording/RecordingsTable';
import { useCallRecordings } from '../hooks/useCallRecordings';
import { toast } from 'sonner';

export default function CallRecordingsPage() {
  const {
    recordings,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    downloadRecording,
    bulkDownload,
  } = useCallRecordings();

  const handlePlay = (recording: any) => {
    toast.info(`Playing recording for ${recording.customer.name}`);
    // TODO: Implement play functionality
  };

  const handleShare = (recording: any) => {
    toast.info(`Share recording ${recording.recordingId}`);
    // TODO: Implement share functionality
  };

  const handleBulkDownload = () => {
    const availableIds = recordings
      .filter(r => r.status === 'Available')
      .map(r => r._id);
    if (availableIds.length > 0) {
      bulkDownload(availableIds);
    } else {
      toast.error('No available recordings to download');
    }
  };

  const statsCards = [
    { label: 'Total Recordings', value: stats?.totalRecordings || 0, icon: Download, color: 'from-purple-500 to-pink-500' },
    { label: 'Today', value: stats?.todayRecordings || 0, icon: Download, color: 'from-blue-500 to-indigo-500' },
    { label: 'Processing', value: stats?.processingCount || 0, icon: Download, color: 'from-yellow-500 to-orange-500' },
    { label: 'Storage Used', value: stats?.storageUsed || '0 GB', icon: Download, color: 'from-green-500 to-emerald-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            Call Recordings
          </h1>
          <p className="text-gray-600 mt-1">Access and manage customer call recordings</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
            onClick={handleBulkDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Bulk Download
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      {/* Filters */}
      <RecordingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Recordings Table */}
      <RecordingsTable
        recordings={recordings}
        onPlay={handlePlay}
        onDownload={downloadRecording}
        onShare={handleShare}
      />
    </div>
  );
}