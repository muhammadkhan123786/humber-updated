import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/form/Dialog';
import { Button } from '@/components/form/CustomButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/form/Select';
import { Truck, Loader2, AlertCircle } from 'lucide-react';
import { Order } from '../../types/sales';
import { useFormActions } from '@/hooks/useFormActions';

interface Rider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: 'VAN' | 'BIKE' | 'CAR';
  status: 'APPROVED' | 'ACTIVE';
}

interface AssignDriverDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  selectedDriverId: string;  // Changed from selectedDriver to selectedDriverId
  onDriverSelect: (driverId: string) => void;  // Now receives ID instead of name
  onAssign: () => void;
}

export const AssignDriverDialog = ({ 
  open, 
  onClose, 
  order, 
  selectedDriverId, 
  onDriverSelect, 
  onAssign 
}: AssignDriverDialogProps) => {

  const { 
    data: riders, 
    isLoading, 
    isError,
     
  } = useFormActions<Rider>(
    '/riders/available',  // ✅ Correct endpoint for available drivers
    'available-riders',    // ✅ Different query key
    'Rider',
    1,
    '',
    open
  );

  console.log("API Response:", riders);

  // Extract riders array from response
  const availableRiders = Array.isArray(riders) ? riders : (riders as any)?.data || [];

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-indigo-600" />
            Assign Delivery Driver
          </DialogTitle>
          <DialogDescription>
            Assign a driver to deliver order {order.orderNumber}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Order Details */}
          <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-4 border border-indigo-100">
            <p className="text-sm font-medium text-gray-900 mb-2">Order Details:</p>
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-sm text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
            <p className="text-sm text-gray-700 mt-2">{order.items.length} item(s)</p>
          </div>
          
          {/* Driver Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Driver
            </label>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                <span className="ml-2 text-sm text-gray-600">Loading drivers...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-6 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 text-sm">Failed to load drivers</p>
                
              </div>
            ) : availableRiders.length === 0 ? (
              <div className="text-center py-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <Truck className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-yellow-700 font-medium">No drivers available</p>
                <p className="text-sm text-yellow-600 mt-1">
                  Please add ACTIVE or APPROVED drivers first
                </p>
              </div>
            ) : (
              <Select value={selectedDriverId} onValueChange={onDriverSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a driver..." />
                </SelectTrigger>
                <SelectContent>
                  {availableRiders.map((driver: Rider) => (
                    <SelectItem key={driver._id} value={driver._id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{driver.name}</span>
                        <span className="text-xs text-gray-500">
                          {driver.vehicleNumber} • {driver.phone}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Show selected driver info */}
            {selectedDriverId && !isLoading && availableRiders.length > 0 && (
              <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-700">
                  ✅ Driver selected: {availableRiders.find((d: Rider) => d._id === selectedDriverId)?.name}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onAssign} 
            disabled={!selectedDriverId || isLoading}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            <Truck className="h-4 w-4" />
            Assign Driver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};