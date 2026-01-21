'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PurchaseOrdersHeader } from './PurchaseOrdersHeader';
import { PurchaseOrdersStats } from './PurchaseOrdersStats';
import { PurchaseOrdersFilters } from './PurchaseOrdersFilters';
import { PurchaseOrdersTable } from './PurchaseOrdersTable';
import { PurchaseOrderForm } from './PurchaseOrderForm';
import { ViewOrderDialog } from './ViewOrderDialog';
import { DeleteOrderDialog } from './DeleteOrderDialog';
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders';
import { PurchaseOrder } from '../types/purchaseOrders';
import { toast } from 'sonner';

export default function PurchaseOrdersPage() {
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<PurchaseOrder | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const {
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
    suppliers,
    statuses,
    handleAddItem,
    handleRemoveItem,
    handleSaveOrder,
    resetForm,
    handleDeleteOrder,
    handleStatusChange,
    handleEditOrder,
    calculateTotals
  } = usePurchaseOrders();

  const handleOpenCreateOrder = () => {
    resetForm();
    setIsOrderDialogOpen(true);
  };

  const handleOpenEditOrder = (order: PurchaseOrder) => {
    handleEditOrder(order);
    setIsOrderDialogOpen(true);
  };

  const handleOpenViewOrder = (order: PurchaseOrder) => {
    setViewingOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleOpenDeleteOrder = (orderId: string) => {
    setDeletingOrderId(orderId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingOrderId) {
      handleDeleteOrder(deletingOrderId);
      toast.success('Purchase order deleted successfully!');
      setIsDeleteDialogOpen(false);
      setDeletingOrderId(null);
    }
  };

  const handleSaveOrderAndClose = () => {
    handleSaveOrder();
    setIsOrderDialogOpen(false);
  };

  const handleCloseOrderDialog = () => {
    setIsOrderDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6 relative p-4 md:p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-3xl"
        />
      </div>

      <PurchaseOrdersHeader onCreateOrder={handleOpenCreateOrder} />
      
      <PurchaseOrdersStats stats={stats} />
      
      <PurchaseOrdersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        statuses={statuses}
      />
      
      <PurchaseOrdersTable
        orders={filteredOrders}
        onView={handleOpenViewOrder}
        onEdit={handleOpenEditOrder}
        onDelete={handleOpenDeleteOrder}
        onStatusChange={handleStatusChange}
      />

      {/* Dialogs */}
      <PurchaseOrderForm
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        editingOrder={editingOrder}
        orderForm={orderForm}
        onOrderFormChange={setOrderForm}
        orderItems={orderItems}
        newItem={newItem}
        onNewItemChange={setNewItem}
        suppliers={suppliers}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onSaveOrder={handleSaveOrderAndClose}
        onCancel={handleCloseOrderDialog}
        calculateTotals={calculateTotals}
      />

      <ViewOrderDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        order={viewingOrder}
      />

      <DeleteOrderDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}