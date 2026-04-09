import { DeliveryDriver, DeliveryAssignment } from '../types/delivery';

export const DELIVERY_DRIVERS: DeliveryDriver[] = [
  { id: '1', name: 'John Smith', vehicle: 'VAN-001' },
  { id: '2', name: 'Sarah Johnson', vehicle: 'VAN-002' },
  { id: '3', name: 'Mike Williams', vehicle: 'VAN-003' },
  { id: '4', name: 'Emma Brown', vehicle: 'BIKE-001' },
];

export const mockAssignments: DeliveryAssignment[] = [
  {
    id: '1',
    driver: 'John Smith',
    vehicle: 'VAN-001',
    orderNumber: 'ORD-2026-002',
    customerName: 'Patricia Wilson',
    address: '42 King Street, Flat 3B, Manchester',
    postcode: 'M2 6AQ',
    phone: '07700 900456',
    items: 1,
    status: 'in-transit',
    assignedDate: '2026-01-10'
  },
  {
    id: '2',
    driver: 'Sarah Johnson',
    vehicle: 'VAN-002',
    orderNumber: 'ORD-2026-003',
    customerName: 'Robert Taylor',
    address: '8 Church Lane, Birmingham',
    postcode: 'B3 2NP',
    phone: '07700 900789',
    items: 2,
    status: 'assigned',
    assignedDate: '2026-01-11'
  },
  {
    id: '3',
    driver: 'Mike Williams',
    vehicle: 'VAN-003',
    orderNumber: 'ORD-2026-004',
    customerName: 'Mary Davies',
    address: '123 High Street, Liverpool',
    postcode: 'L1 9AX',
    phone: '07700 900321',
    items: 2,
    status: 'delivered',
    assignedDate: '2026-01-08',
    deliveryDate: '2026-01-09'
  },
  {
    id: '4',
    driver: 'Emma Brown',
    vehicle: 'BIKE-001',
    orderNumber: 'ORD-2026-006',
    customerName: 'Susan Moore',
    address: '91 Queen Street, Apartment 12, Newcastle',
    postcode: 'NE1 8ED',
    phone: '07700 900987',
    items: 1,
    status: 'in-transit',
    assignedDate: '2026-01-11'
  },
  {
    id: '5',
    driver: 'John Smith',
    vehicle: 'VAN-001',
    orderNumber: 'ORD-2026-007',
    customerName: 'Thomas White',
    address: '34 Market Square, Sheffield',
    postcode: 'S1 2HU',
    phone: '07700 900234',
    items: 2,
    status: 'assigned',
    assignedDate: '2026-01-10'
  }
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in-transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' }
];