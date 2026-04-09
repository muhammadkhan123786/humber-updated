"use client"
import { useState } from 'react';
import { toast } from 'sonner';
import { Header } from './Sales/Header';
import { Filters } from './Sales/Filters';
import { OrderTable } from './Sales/OrderTable';
import { OrderCard } from './Sales/OrderCard';
import { EditOrderDialog } from './Sales/EditOrderDialog';
import { AssignDriverDialog } from './Sales/AssignDriverDialog';
import CourierLabelDialog from './Sales/CourierLabelDialog';
import { Order, OrderStatus } from '../types/sales';
import { mockOrders } from '../constants/salesConstants';

export default function SalesManagement() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showLabelDialog, setShowLabelDialog] = useState(false);
  const [showDriverDialog, setShowDriverDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const filteredOrders = orders.filter(order => {
    const matchesSource = selectedSource === 'all' || order.source === selectedSource;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const handleGenerateLabel = (order: Order) => {
    setSelectedOrder(order);
    setShowLabelDialog(true);
  };

  const handleAssignDriver = (order: Order) => {
    setSelectedOrder(order);
    setShowDriverDialog(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowEditDialog(true);
  };

  const handleAssignDriverConfirm = () => {
    if (selectedOrder && selectedDriver) {
      const updatedOrders = orders.map(order => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            driver: selectedDriver,
            trackingNumber: `TRK-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
          };
        }
        return order;
      });
      setOrders(updatedOrders);
      toast.success(`Driver ${selectedDriver} assigned to order ${selectedOrder.orderNumber}`);
      setShowDriverDialog(false);
      setSelectedOrder(null);
      setSelectedDriver('');
    }
  };

  const handleEditOrderSave = (orderId: string, status: OrderStatus, driver: string, items: any[]) => {
    const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          driver,
          items,
          totalAmount: newTotal
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    toast.success(`Order updated successfully!`);
    setShowEditDialog(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <Header orders={orders} />
      
      <Filters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="text-sm text-gray-600">
        Showing {filteredOrders.length} of {mockOrders.length} orders
      </div>

      {viewMode === 'table' ? (
        <OrderTable
          orders={filteredOrders}
          onGenerateLabel={handleGenerateLabel}
          onAssignDriver={handleAssignDriver}
          onEditOrder={handleEditOrder}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              index={index}
              onGenerateLabel={handleGenerateLabel}
              onAssignDriver={handleAssignDriver}
              onEditOrder={handleEditOrder}
            />
          ))}
        </div>
      )}

      {selectedOrder && (
        <CourierLabelDialog
          open={showLabelDialog}
          onClose={() => {
            setShowLabelDialog(false);
            setSelectedOrder(null);
          }}
          order={{
            id: selectedOrder.id,
            orderNumber: selectedOrder.orderNumber,
            customer: {
              name: selectedOrder.customerName,
              email: selectedOrder.customerEmail,
              phone: selectedOrder.customerPhone,
              address: selectedOrder.shippingAddress.line1 + (selectedOrder.shippingAddress.line2 ? ', ' + selectedOrder.shippingAddress.line2 : ''),
              city: selectedOrder.shippingAddress.city,
              postcode: selectedOrder.shippingAddress.postcode,
            },
            items: selectedOrder.items,
            total: selectedOrder.totalAmount,
          }}
        />
      )}

      <AssignDriverDialog
        open={showDriverDialog}
        onClose={() => setShowDriverDialog(false)}
        order={selectedOrder}
        selectedDriver={selectedDriver}
        onDriverSelect={setSelectedDriver}
        onAssign={handleAssignDriverConfirm}
      />

      <EditOrderDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        order={selectedOrder}
        onSave={handleEditOrderSave}
      />
    </div>
  );
}