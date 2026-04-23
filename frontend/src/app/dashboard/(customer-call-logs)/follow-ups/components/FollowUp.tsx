'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell } from 'lucide-react';
import { Button } from '@/components/form/CustomButton';
import { FollowUpStatsCard } from '../components/FollowUp/FollowUpStatsCard';
import { UrgentAlertBanner } from '../components/FollowUp/UrgentAlertBanner';
import { FollowUpFilters } from '../components/FollowUp/FollowUpFilters';
import { FollowUpsTable } from '../components/FollowUp/FollowUpsTable';
import { useFollowUps } from '../hooks/useFollowUps';
import { toast } from 'sonner';

export default function FollowUpsPage() {
  const {
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
  } = useFollowUps();

  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleReschedule = (followUp: any) => {
    setSelectedFollowUp(followUp);
    setNewDate(followUp.followUpDate);
    setNewTime(followUp.dueTime);
    setIsRescheduleDialogOpen(true);
  };

  const handleConfirmReschedule = async () => {
    if (selectedFollowUp && newDate && newTime) {
      await rescheduleFollowUp(selectedFollowUp._id, newDate, newTime);
      setIsRescheduleDialogOpen(false);
      setSelectedFollowUp(null);
    }
  };

  const statsCards = [
    { label: 'Pending Follow-Ups', value: stats?.pendingCount || 0, icon: Bell, color: 'from-yellow-500 to-orange-500', bg: 'from-yellow-50 to-orange-50' },
    { label: 'Due Today', value: stats?.dueTodayCount || 0, icon: Bell, color: 'from-red-500 to-pink-500', bg: 'from-red-50 to-pink-50' },
    { label: 'Overdue', value: stats?.overdueCount || 0, icon: Bell, color: 'from-rose-500 to-red-500', bg: 'from-rose-50 to-red-50' },
    { label: 'Completed', value: stats?.completedCount || 0, icon: Bell, color: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            Follow-Up Management
          </h1>
          <p className="text-gray-600 mt-1">Track and manage customer follow-up activities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
            <Bell className="mr-2 h-4 w-4" />
            Reminders
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Follow-Up
          </Button>
        </div>
      </motion.div>

      {/* Urgent Alert Banner */}
      <UrgentAlertBanner followUps={followUps} />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <FollowUpStatsCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            bg={stat.bg}
            index={index}
          />
        ))}
      </div>

      {/* Filters */}
      <FollowUpFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
      />

      {/* Follow-Ups Table */}
      <FollowUpsTable
        followUps={followUps}
        onComplete={completeFollowUp}
        onReschedule={handleReschedule}
      />

      {/* Reschedule Dialog - Simple implementation */}
      {isRescheduleDialogOpen && selectedFollowUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Reschedule Follow-Up</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmReschedule} className="bg-orange-600 text-white">
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}