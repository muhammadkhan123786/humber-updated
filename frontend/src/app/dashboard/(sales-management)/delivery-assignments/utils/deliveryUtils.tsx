import { Clock, Truck, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import { DeliveryStatus, DeliveryAssignment, DriverStats } from '../types/delivery';

export const getStatusColor = (status: DeliveryStatus): string => {
  switch (status) {
    case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in-transit': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'failed': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusIcon = (status: DeliveryStatus) => {
  switch (status) {
    case 'assigned': return <Clock className="h-4 w-4" />;
    case 'in-transit': return <Truck className="h-4 w-4" />;
    case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
    case 'failed': return <AlertCircle className="h-4 w-4" />;
    default: return <Package className="h-4 w-4" />;
  }
};

export const formatStatus = (status: DeliveryStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
};

export const getDriverStats = (assignments: DeliveryAssignment[], driverName: string): DriverStats => {
  const driverAssignments = assignments.filter(a => a.driver === driverName);
  return {
    total: driverAssignments.length,
    assigned: driverAssignments.filter(a => a.status === 'assigned').length,
    inTransit: driverAssignments.filter(a => a.status === 'in-transit').length,
    delivered: driverAssignments.filter(a => a.status === 'delivered').length
  };
};