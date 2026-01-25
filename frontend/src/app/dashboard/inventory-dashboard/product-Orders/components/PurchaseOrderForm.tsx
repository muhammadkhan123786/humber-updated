'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/form/Dialog';
import { Button } from '@/components/form/CustomButton';
import { Input } from '@/components/form/Input';
import { Label } from '@/components/form/Label';
import { Textarea } from '@/components/form/Textarea';
import { IPurchaseOrder, IPurchaseOrderItem } from '../../../../../../../common/IPurchase.order.interface';
import { OrderFormData, OrderItemForm, Supplier } from '../types/purchaseOrders';
import { Plus, Trash2, Building2, Truck, Box } from 'lucide-react';

interface PurchaseOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingOrder: IPurchaseOrder | null;
  orderForm: OrderFormData;
  onOrderFormChange: (data: OrderFormData) => void;
  orderItems: IPurchaseOrderItem[];
  newItem: OrderItemForm;
  onNewItemChange: (data: OrderItemForm) => void;
  suppliers: Supplier[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void; // Changed from id to index
  onSaveOrder: () => Promise<boolean>; // Changed to return promise
  onCancel: () => void;
  orderNumber: string
  calculateTotals: (items: IPurchaseOrderItem[]) => { subtotal: number; tax: number; total: number };
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  open,
  onOpenChange,
  editingOrder,
  orderForm,
  onOrderFormChange,
  orderItems,
  newItem,
  onNewItemChange,
  suppliers,
  onAddItem,
  onRemoveItem,
  onSaveOrder,
  onCancel,
  calculateTotals,
  orderNumber,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSupplierChange = (supplierName: string) => {
    const selectedSupplier = suppliers.find(s => s.legalBusinessName === supplierName);
    
    onOrderFormChange({ 
      ...orderForm, 
      supplier: supplierName,
      supplierContact: selectedSupplier?.email || ''
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSaveOrder();
    setIsSaving(false);
    
    if (success) {
      onOpenChange(false); // Close dialog only on success
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {editingOrder ? 'Edit Purchase Order' : 'Create Purchase Order'}
          </DialogTitle>
          <DialogDescription>
            {editingOrder ? 'Update purchase order details' : 'Fill in the details to create a new purchase order'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Information Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg border-2 border-indigo-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Purchase Order Number</Label>
                <p className="text-xl font-bold text-gray-900 font-mono bg-white px-3 py-2 rounded border border-indigo-200">
                  {editingOrder ? editingOrder.orderNumber : orderNumber}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Order Date</Label>
                <p className="text-xl font-bold text-gray-900 bg-white px-3 py-2 rounded border border-indigo-200">
                  {editingOrder ? new Date(editingOrder.orderDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
              Supplier Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier Name *</Label>
                <select
                  id="supplier"
                  value={orderForm.supplier}
                  onChange={(e) => handleSupplierChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border-2 border-emerald-100 hover:border-emerald-300 focus:border-emerald-400 focus:outline-none transition-colors"
                  disabled={isSaving}
                >
                  <option value="">Select a supplier...</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.legalBusinessName}>
                      {supplier.legalBusinessName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierContact">Contact Email *</Label>
                <Input
                  id="supplierContact"
                  type="email"
                  value={orderForm.supplierContact}
                  onChange={(e) => onOrderFormChange({ ...orderForm, supplierContact: e.target.value })}
                  placeholder="supplier@email.com"
                  className="border-2 border-emerald-100 hover:border-emerald-300 focus:border-emerald-400"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Truck className="h-5 w-5 text-teal-600" />
              Delivery Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedDelivery">Expected Delivery Date *</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={orderForm.expectedDelivery}
                  onChange={(e) => onOrderFormChange({ ...orderForm, expectedDelivery: e.target.value })}
                  className="border-2 border-teal-100 hover:border-teal-300 focus:border-teal-400"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={orderForm.notes}
                  onChange={(e) => onOrderFormChange({ ...orderForm, notes: e.target.value })}
                  placeholder="Additional notes..."
                  className="border-2 border-teal-100 hover:border-teal-300 focus:border-teal-400"
                  rows={3}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Box className="h-5 w-5 text-indigo-600" />
              Order Items
            </h3>

            {/* Add Item Form */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-100">
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-2">
                  <Input
                    placeholder="Product Name"
                    value={newItem.productName}
                    onChange={(e) => onNewItemChange({ ...newItem, productName: e.target.value })}
                    className="h-10"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Input
                    placeholder="SKU"
                    value={newItem.sku}
                    onChange={(e) => onNewItemChange({ ...newItem, sku: e.target.value })}
                    className="h-10"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => onNewItemChange({ ...newItem, quantity: e.target.value })}
                    className="h-10"
                    min="1"
                    disabled={isSaving}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newItem.unitPrice}
                    onChange={(e) => onNewItemChange({ ...newItem, unitPrice: e.target.value })}
                    className="h-10"
                    min="0"
                    disabled={isSaving}
                  />
                  <Button 
                    onClick={onAddItem} 
                    size="sm" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    disabled={isSaving}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Items List */}
            {orderItems.length > 0 ? (
              <div className="border-2 border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Product</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">SKU</th>
                      <th className="text-center p-3 text-sm font-semibold text-gray-700">Qty</th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">Unit Price</th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">Total</th>
                      <th className="text-center p-3 text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="p-3 text-sm">{item.productName}</td>
                        <td className="p-3 text-sm font-mono text-gray-600">{item.sku}</td>
                        <td className="p-3 text-sm text-center">{item.quantity}</td>
                        <td className="p-3 text-sm text-right">£{item.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-sm text-right font-semibold">£{item.totalPrice.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveItem(index)}
                            className="hover:bg-red-50 hover:text-red-600"
                            disabled={isSaving}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                No items added yet. Add items using the form above.
              </div>
            )}

            {/* Totals */}
            {orderItems.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border-2 border-emerald-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">£{calculateTotals(orderItems).subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (20%):</span>
                    <span className="font-semibold">£{calculateTotals(orderItems).tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg border-t-2 border-emerald-200 pt-2">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-emerald-600">£{calculateTotals(orderItems).total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSaving}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            disabled={isSaving || orderItems.length === 0}
            type="button"
          >
            {isSaving ? 'Saving...' : (editingOrder ? 'Update Order' : 'Create Order')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};