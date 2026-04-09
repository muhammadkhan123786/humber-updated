import { OrderStatus } from '../../types/sales';
import { Clock, Package, Truck, Check, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/form/Badge';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
  showText?: boolean;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ready': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
  }
};

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'processing': return <Package className="h-4 w-4" />;
    case 'ready': return <Truck className="h-4 w-4" />;
    case 'delivered': return <Check className="h-4 w-4" />;
    case 'cancelled': return <AlertCircle className="h-4 w-4" />;
  }
};

const formatStatusText = (status: OrderStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const OrderStatusBadge = ({ 
  status, 
  showIcon = true, 
  showText = true 
}: OrderStatusBadgeProps) => {
  return (
    <Badge className={`${getStatusColor(status)} flex items-center gap-1 w-fit`}>
      {showIcon && getStatusIcon(status)}
      {showText && formatStatusText(status)}
    </Badge>
  );
};