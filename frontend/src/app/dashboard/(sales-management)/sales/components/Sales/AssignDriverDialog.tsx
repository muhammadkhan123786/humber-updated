import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/form/Dialog';
import { Button } from '@/components/form/CustomButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/form/Select';
import { Truck } from 'lucide-react';
import { Order } from '../../types/sales';
import { DELIVERY_DRIVERS } from '../../constants/salesConstants';

interface AssignDriverDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  selectedDriver: string;
  onDriverSelect: (driver: string) => void;
  onAssign: () => void;
}

export const AssignDriverDialog = ({ 
  open, 
  onClose, 
  order, 
  selectedDriver, 
  onDriverSelect, 
  onAssign 
}: AssignDriverDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Delivery Driver</DialogTitle>
          <DialogDescription>
            Assign a driver to deliver order {order.orderNumber}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Driver</label>
            <Select value={selectedDriver} onValueChange={onDriverSelect}>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onAssign} disabled={!selectedDriver} className="gap-2">
            <Truck className="h-4 w-4" />
            Assign Driver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};