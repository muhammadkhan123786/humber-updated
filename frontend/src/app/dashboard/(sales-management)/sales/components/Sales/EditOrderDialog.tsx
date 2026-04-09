import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, BoxSelect, ListPlus, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/form/Dialog';
import { Button } from '@/components/form/CustomButton';
import { Input } from '@/components/form/Input';
import { Label } from '@/components/form/Label';
import { Textarea } from '@/components/form/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/form/Select';
import { Badge } from '@/components/form/Badge';
import { Order, OrderStatus, InventoryItem } from '../../types/sales';
import { DELIVERY_DRIVERS, INVENTORY_ITEMS } from '../../constants/salesConstants';

interface EditOrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (orderId: string, status: OrderStatus, driver: string, items: any[]) => void;
}

export const EditOrderDialog = ({ open, onClose, order, onSave }: EditOrderDialogProps) => {
  const [editStatus, setEditStatus] = useState<OrderStatus>('pending');
  const [editDriver, setEditDriver] = useState('');
  const [editItems, setEditItems] = useState<any>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [returnReason, setReturnReason] = useState('');
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);
  const [inventoryQuantity, setInventoryQuantity] = useState(1);

  const categories = ['all', ...Array.from(new Set(INVENTORY_ITEMS.map(item => item.category)))];

  const addItemToOrder = () => {
    if (newItemName && newItemQuantity > 0 && newItemPrice >= 0) {
      setEditItems([...editItems, { name: newItemName, quantity: newItemQuantity, price: newItemPrice }]);
      setNewItemName('');
      setNewItemQuantity(1);
      setNewItemPrice(0);
    }
  };

  const removeItemFromOrder = (index: number) => {
    const newItems = editItems.filter((_ : any, i: any) => i !== index);
    setEditItems(newItems);
  };

  const addItemFromInventory = () => {
    if (selectedInventoryItem && inventoryQuantity > 0) {
      setEditItems([...editItems, { 
        name: selectedInventoryItem.name, 
        quantity: inventoryQuantity, 
        price: selectedInventoryItem.price 
      }]);
      setSelectedInventoryItem(null);
      setInventoryQuantity(1);
    }
  };

  const handleSave = () => {
    if (order) {
      onSave(order.id, editStatus, editDriver, editItems);
      onClose();
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>
            Edit order {order.orderNumber}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Order Details:</p>
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-sm text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
            <p className="text-sm text-gray-700 mt-2">{order.items.length} item(s)</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select value={editStatus} >
              <SelectTrigger>
                <SelectValue placeholder="Choose a status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="ready">Ready to Ship</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Driver</label>
            <Select value={editDriver} onValueChange={setEditDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a driver..." />
              </SelectTrigger>
              <SelectContent>
                {DELIVERY_DRIVERS.map((driver) => (
                  <SelectItem key={driver.id} value={driver.name}>
                    {driver.name} - {driver.vehicle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
            <div className="space-y-2">
              {editItems.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                  <span className="text-gray-700">{item.quantity}x {item.name}</span>
                  <Button size="sm" variant="outline" onClick={() => removeItemFromOrder(index)} className="gap-1">
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Item from Inventory */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <BoxSelect className="h-4 w-4" />
              Add Item from Inventory
            </label>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-600 mb-1">Select Item</Label>
                <Select 
                  value={selectedInventoryItem?.id || ''} 
                  onValueChange={(value) => {
                    const item = INVENTORY_ITEMS.find(i => i.id === value);
                    setSelectedInventoryItem(item || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose item from inventory..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'all').map((category) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
                          {category}
                        </div>
                        {INVENTORY_ITEMS.filter(item => item.category === category).map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - £{item.price.toFixed(2)} (Stock: {item.stock})
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedInventoryItem && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{selectedInventoryItem.name}</p>
                      <p className="text-sm text-gray-600">SKU: {selectedInventoryItem.sku}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          £{selectedInventoryItem.price.toFixed(2)}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Stock: {selectedInventoryItem.stock}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedInventoryItem(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-gray-600 mb-1">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        max={selectedInventoryItem.stock}
                        value={inventoryQuantity}
                        onChange={(e) => setInventoryQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full"
                      />
                    </div>
                    <Button onClick={addItemFromInventory} className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500">
                      <Plus className="h-4 w-4" />
                      Add to Order
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Manual Item Entry */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <ListPlus className="h-4 w-4" />
              Add Custom Item
            </label>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label className="text-xs text-gray-600 mb-1">Item Name</Label>
                <Input type="text" placeholder="Item name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
              </div>
              <div className="w-24">
                <Label className="text-xs text-gray-600 mb-1">Qty</Label>
                <Input type="number" min="1" placeholder="Qty" value={newItemQuantity} onChange={(e) => setNewItemQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
              <div className="w-28">
                <Label className="text-xs text-gray-600 mb-1">Price (£)</Label>
                <Input type="number" min="0" step="0.01" placeholder="Price" value={newItemPrice} onChange={(e) => setNewItemPrice(Math.max(0, parseFloat(e.target.value) || 0))} />
              </div>
              <Button size="sm" variant="outline" onClick={addItemToOrder} className="gap-1" disabled={!newItemName || newItemQuantity <= 0 || newItemPrice < 0}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
              <span className="text-lg font-semibold text-gray-900">Order Total</span>
              <span className="text-2xl font-bold text-indigo-600">
                £{editItems.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>
          </div>

          {editStatus === 'cancelled' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return Reason</label>
              <Textarea
                placeholder="Enter the reason for cancellation..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};