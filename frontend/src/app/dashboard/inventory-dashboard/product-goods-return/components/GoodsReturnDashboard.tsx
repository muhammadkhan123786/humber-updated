'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GoodsReturnHeader } from './GoodsReturnHeader';
import { GoodsReturnStats } from './GoodsReturnStats';
import { GoodsReturnFilters } from './GoodsReturnFilters';
import { GoodsReturnGridView } from './GoodsReturnGridView';
import { GoodsReturnTableView } from './GoodsReturnTableView';
import { CreateReturnDialog } from './CreateReturnDialog';
import { ViewReturnDialog } from './ViewReturnDialog';
import { useGoodsReturn } from '@/hooks/useGoodsReturn';
import { GoodsReturnNote } from '../types/goodsReturn';
import { toast } from 'sonner';

export default function GoodsReturnPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingReturn, setViewingReturn] = useState<GoodsReturnNote | null>(null);

  const {
    filteredReturns,
    stats,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    setViewMode,
    selectedGRN,
    returnedBy,
    setReturnedBy,
    returnReason,
    setReturnReason,
    returnNotes,
    setReturnNotes,
    returningItems,
    availableGRNs,
    statuses,
    // ✅ NEW: Return date state and setter
    returnDate,
    setReturnDate,
    handleGRNSelection,
    handleUpdateItemReturn,
    handleCreateReturn,
    resetForm,
    handleExportReturn,
  } = useGoodsReturn();

  const handleOpenCreateReturn = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleOpenViewReturn = (grtn: GoodsReturnNote) => {
    setViewingReturn(grtn);
    setIsViewDialogOpen(true);
  };

  const handleDownloadReturn = (grtn: GoodsReturnNote) => {
    handleExportReturn(grtn)
    // In a real app, this would download the return note as PDF
    toast.info(`Downloading Return Note: ${grtn.returnNumber}`);
  };

  const handleCreateAndClose = () => {
    handleCreateReturn();
    setIsCreateDialogOpen(false);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6 relative p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-red-400 via-orange-400 to-amber-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 rounded-full blur-3xl"
        />
      </div>

      <GoodsReturnHeader onCreateReturn={handleOpenCreateReturn} />
      
      <GoodsReturnStats stats={stats} />
      
      <GoodsReturnFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statuses={statuses}
      />

      {viewMode === 'grid' ? (
        <GoodsReturnGridView
          returns={filteredReturns}
          onView={handleOpenViewReturn}
          onDownload={handleDownloadReturn}
        />
      ) : (
        <GoodsReturnTableView
          returns={filteredReturns}
          onView={handleOpenViewReturn}
          onDownload={handleDownloadReturn}
        />
      )}

      {/* Dialogs */}
      <CreateReturnDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        selectedGRN={selectedGRN}
        onSelectGRN={handleGRNSelection}
        returnedBy={returnedBy}
        onReturnedByChange={setReturnedBy}
        returnReason={returnReason}
        onReturnReasonChange={setReturnReason}
        returnNotes={returnNotes}
        onReturnNotesChange={setReturnNotes}
        returningItems={returningItems}
        onUpdateItem={handleUpdateItemReturn}
        availableGRNs={availableGRNs}
        onCreateReturn={handleCreateAndClose}
        onCancel={handleCloseCreateDialog}
        // ✅ NEW: Pass return date props
        returnDate={returnDate}
        onReturnDateChange={setReturnDate}
      />

      <ViewReturnDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        grtn={viewingReturn}
        onDownload={handleDownloadReturn}
      />
    </div>
  );
}