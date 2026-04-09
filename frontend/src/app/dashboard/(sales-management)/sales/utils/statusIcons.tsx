import { Clock, Package, Truck, Check, AlertCircle } from 'lucide-react';
import { OrderStatus } from '../types/sales';

export const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'processing': return <Package className="h-4 w-4" />;
    case 'ready': return <Truck className="h-4 w-4" />;
    case 'delivered': return <Check className="h-4 w-4" />;
    case 'cancelled': return <AlertCircle className="h-4 w-4" />;
  }
};