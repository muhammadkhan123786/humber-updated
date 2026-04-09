export type DeliveryStatus = 'assigned' | 'in-transit' | 'delivered' | 'failed';

export interface DeliveryAssignment {
  id: string;
  driver: string;
  vehicle: string;
  orderNumber: string;
  customerName: string;
  address: string;
  postcode: string;
  phone: string;
  items: number;
  status: DeliveryStatus;
  assignedDate: string;
  deliveryDate?: string;
  notes?: string;
}

export interface DeliveryDriver {
  id: string;
  name: string;
  vehicle: string;
}

export interface DriverStats {
  total: number;
  assigned: number;
  inTransit: number;
  delivered: number;
}

export interface FilterOptions {
  driver: string;
  status: string;
}