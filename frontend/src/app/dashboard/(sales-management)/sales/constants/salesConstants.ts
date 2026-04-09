import { Order, InventoryItem, CourierService } from '../types/sales';

export const SALES_SOURCES = [
  { value: 'all', label: 'All Sources', color: 'bg-gradient-to-r from-gray-500 to-gray-600', textColor: 'text-gray-700', bgHover: 'hover:bg-gray-50' },
  { value: 'ebay', label: 'eBay', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600', textColor: 'text-yellow-700', bgHover: 'hover:bg-yellow-50' },
  { value: 'amazon', label: 'Amazon', color: 'bg-gradient-to-r from-orange-400 to-orange-600', textColor: 'text-orange-700', bgHover: 'hover:bg-orange-50' },
  { value: 'tiktok', label: 'TikTok', color: 'bg-gradient-to-r from-pink-400 to-fuchsia-600', textColor: 'text-pink-700', bgHover: 'hover:bg-pink-50' },
  { value: 'shopify', label: 'Shopify Store', color: 'bg-gradient-to-r from-green-400 to-emerald-600', textColor: 'text-green-700', bgHover: 'hover:bg-green-50' },
  { value: 'mobile', label: 'Mobile App', color: 'bg-gradient-to-r from-blue-400 to-indigo-600', textColor: 'text-blue-700', bgHover: 'hover:bg-blue-50' },
];

export const DELIVERY_DRIVERS = [
  { id: '1', name: 'John Smith', vehicle: 'VAN-001', phone: '07700 900001', available: true },
  { id: '2', name: 'Sarah Johnson', vehicle: 'VAN-002', phone: '07700 900002', available: true },
  { id: '3', name: 'Mike Williams', vehicle: 'VAN-003', phone: '07700 900003', available: false },
  { id: '4', name: 'Emma Brown', vehicle: 'BIKE-001', phone: '07700 900004', available: true },
];

export const COURIER_SERVICES: CourierService[] = [
  { id: 'royal-mail', name: 'Royal Mail Tracked 48', price: 3.99, estimatedDays: '2-3 business days', trackingUrl: 'https://www.royalmail.com/track-your-item' },
  { id: 'royal-mail-24', name: 'Royal Mail Tracked 24', price: 5.99, estimatedDays: '1-2 business days', trackingUrl: 'https://www.royalmail.com/track-your-item' },
  { id: 'dpd', name: 'DPD Next Day', price: 6.99, estimatedDays: 'Next business day', trackingUrl: 'https://www.dpd.co.uk/apps/tracking' },
  { id: 'evri', name: 'Evri ParcelShop', price: 2.99, estimatedDays: '3-5 business days', trackingUrl: 'https://www.evri.com/track' },
  { id: 'fedex', name: 'FedEx Priority', price: 8.99, estimatedDays: '1-2 business days', trackingUrl: 'https://www.fedex.com/tracking' },
  { id: 'ups', name: 'UPS Standard', price: 7.99, estimatedDays: '2-3 business days', trackingUrl: 'https://www.ups.com/track' },
];

export const PACKAGE_SIZES = [
  { id: 'small', name: 'Small Box', dimensions: '30x30x30 cm', maxWeight: '2kg', price: 0 },
  { id: 'medium', name: 'Medium Box', dimensions: '40x40x40 cm', maxWeight: '5kg', price: 2 },
  { id: 'large', name: 'Large Box', dimensions: '50x50x50 cm', maxWeight: '10kg', price: 4 },
  { id: 'extra-large', name: 'Extra Large Box', dimensions: '60x60x60 cm', maxWeight: '15kg', price: 6 },
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'INV-001', name: 'Mobility Scooter Battery 12V', sku: 'BAT-12V-001', category: 'Batteries', price: 89.99, stock: 25 },
  { id: 'INV-002', name: 'Front Light Assembly', sku: 'LIGHT-F-001', category: 'Lights', price: 34.99, stock: 18 },
  { id: 'INV-003', name: 'Mobility Scooter Cover - Waterproof', sku: 'COV-WP-001', category: 'Accessories', price: 45.99, stock: 12 },
  { id: 'INV-004', name: 'Premium Mobility Scooter Seat Cushion', sku: 'CUSH-PR-001', category: 'Accessories', price: 29.99, stock: 30 },
  { id: 'INV-005', name: 'Rear View Mirror Set', sku: 'MIR-RV-001', category: 'Accessories', price: 19.99, stock: 22 },
  { id: 'INV-006', name: 'Mobility Scooter Tyre - 260x85', sku: 'TYRE-260-001', category: 'Tyres', price: 39.99, stock: 40 },
  { id: 'INV-007', name: 'Deluxe Mobility Scooter Basket', sku: 'BASK-DX-001', category: 'Accessories', price: 34.99, stock: 15 },
  { id: 'INV-008', name: 'Safety Flag with Pole', sku: 'FLAG-SF-001', category: 'Safety', price: 12.99, stock: 50 },
  { id: 'INV-009', name: 'Heavy Duty Mobility Scooter Charger', sku: 'CHG-HD-001', category: 'Chargers', price: 59.99, stock: 10 },
  { id: 'INV-010', name: 'LED Headlight Upgrade Kit', sku: 'LED-HK-001', category: 'Lights', price: 44.99, stock: 8 },
  { id: 'INV-011', name: 'Horn & Bell Combo', sku: 'HORN-BC-001', category: 'Safety', price: 15.99, stock: 35 },
  { id: 'INV-012', name: 'All-Weather Mobility Scooter Poncho', sku: 'PON-AW-001', category: 'Accessories', price: 39.99, stock: 20 },
  { id: 'INV-013', name: 'Rear Light Assembly - LED', sku: 'LIGHT-R-LED', category: 'Lights', price: 29.99, stock: 16 },
  { id: 'INV-014', name: 'Mobility Scooter Battery 24V', sku: 'BAT-24V-001', category: 'Batteries', price: 129.99, stock: 14 },
  { id: 'INV-015', name: 'Wheelchair Phone Holder', sku: 'HOLD-PH-001', category: 'Accessories', price: 24.99, stock: 28 },
  { id: 'INV-016', name: 'Mobility Scooter Cup Holder', sku: 'HOLD-CP-001', category: 'Accessories', price: 18.99, stock: 33 },
  { id: 'INV-017', name: 'Scooter Brake Cable', sku: 'CABL-BR-001', category: 'Parts', price: 14.99, stock: 45 },
  { id: 'INV-018', name: 'Mobility Scooter Key Switch', sku: 'SWITCH-K-001', category: 'Parts', price: 22.99, stock: 19 },
  { id: 'INV-019', name: 'Rain Cover for Basket', sku: 'COV-RB-001', category: 'Accessories', price: 16.99, stock: 24 },
  { id: 'INV-020', name: 'Mobility Scooter Lock & Chain', sku: 'LOCK-CH-001', category: 'Safety', price: 32.99, stock: 11 },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2026-001',
    source: 'ebay',
    customerName: 'James Anderson',
    customerEmail: 'james.a@email.com',
    customerPhone: '07700 900123',
    shippingAddress: {
      line1: '15 Victoria Street',
      city: 'Leeds',
      postcode: 'LS1 6AG',
      country: 'United Kingdom'
    },
    items: [
      { name: 'Mobility Scooter Battery 12V', quantity: 2, price: 89.99 },
      { name: 'Front Light Assembly', quantity: 1, price: 34.99 }
    ],
    totalAmount: 214.97,
    orderDate: '2026-01-10',
    status: 'pending'
  },
  {
    id: '2',
    orderNumber: 'ORD-2026-002',
    source: 'amazon',
    customerName: 'Patricia Wilson',
    customerEmail: 'p.wilson@email.com',
    customerPhone: '07700 900456',
    shippingAddress: {
      line1: '42 King Street',
      line2: 'Flat 3B',
      city: 'Manchester',
      postcode: 'M2 6AQ',
      country: 'United Kingdom'
    },
    items: [
      { name: 'Mobility Scooter Cover - Waterproof', quantity: 1, price: 45.99 }
    ],
    totalAmount: 45.99,
    orderDate: '2026-01-09',
    status: 'processing',
    driver: 'John Smith'
  },
  {
    id: '3',
    orderNumber: 'ORD-2026-003',
    source: 'tiktok',
    customerName: 'Robert Taylor',
    customerEmail: 'robert.t@email.com',
    customerPhone: '07700 900789',
    shippingAddress: {
      line1: '8 Church Lane',
      city: 'Birmingham',
      postcode: 'B3 2NP',
      country: 'United Kingdom'
    },
    items: [
      { name: 'Premium Mobility Scooter Seat Cushion', quantity: 1, price: 29.99 },
      { name: 'Rear View Mirror Set', quantity: 1, price: 19.99 }
    ],
    totalAmount: 49.98,
    orderDate: '2026-01-11',
    status: 'ready',
    driver: 'Sarah Johnson',
    trackingNumber: 'TRK-2026-003'
  },
  {
    id: '4',
    orderNumber: 'ORD-2026-004',
    source: 'shopify',
    customerName: 'Mary Davies',
    customerEmail: 'mary.d@email.com',
    customerPhone: '07700 900321',
    shippingAddress: {
      line1: '123 High Street',
      city: 'Liverpool',
      postcode: 'L1 9AX',
      country: 'United Kingdom'
    },
    items: [
      { name: 'Mobility Scooter Tyre - 260x85', quantity: 2, price: 39.99 }
    ],
    totalAmount: 79.98,
    orderDate: '2026-01-08',
    status: 'delivered',
    driver: 'Mike Williams',
    trackingNumber: 'TRK-2026-001'
  },
  {
    id: '5',
    orderNumber: 'ORD-2026-005',
    source: 'mobile',
    customerName: 'David Miller',
    customerEmail: 'd.miller@email.com',
    customerPhone: '07700 900654',
    shippingAddress: {
      line1: '67 Park Avenue',
      city: 'Bristol',
      postcode: 'BS1 5TH',
      country: 'United Kingdom'
    },
    items: [
      { name: 'Deluxe Mobility Scooter Basket', quantity: 1, price: 34.99 },
      { name: 'Safety Flag with Pole', quantity: 1, price: 12.99 }
    ],
    totalAmount: 47.98,
    orderDate: '2026-01-10',
    status: 'pending'
  },
  {
    id: '6',
    orderNumber: 'ORD-2026-006',
    source: 'ebay',
    customerName: 'Susan Moore',
    customerEmail: 's.moore@email.com',
    customerPhone: '07700 900987',
    shippingAddress: {
      line1: '91 Queen Street',
      line2: 'Apartment 12',
      city: 'Newcastle',
      postcode: 'NE1 8ED',
      country: 'United Kingdom'
    },
    items: [
      { name: 'Heavy Duty Mobility Scooter Charger', quantity: 1, price: 59.99 }
    ],
    totalAmount: 59.99,
    orderDate: '2026-01-11',
    status: 'processing',
    driver: 'Emma Brown'
  },
  {
    id: '7',
    orderNumber: 'ORD-2026-007',
    source: 'amazon',
    customerName: 'Thomas White',
    customerEmail: 't.white@email.com',
    customerPhone: '07700 900234',
    shippingAddress: {
      line1: '34 Market Square',
      city: 'Sheffield',
      postcode: 'S1 2HU',
      country: 'United Kingdom'
    },
    items: [
      { name: 'LED Headlight Upgrade Kit', quantity: 1, price: 44.99 },
      { name: 'Horn & Bell Combo', quantity: 1, price: 15.99 }
    ],
    totalAmount: 60.98,
    orderDate: '2026-01-09',
    status: 'ready',
    driver: 'John Smith',
    trackingNumber: 'TRK-2026-007'
  },
  {
    id: '8',
    orderNumber: 'ORD-2026-008',
    source: 'shopify',
    customerName: 'Jennifer Harris',
    customerEmail: 'j.harris@email.com',
    customerPhone: '07700 900567',
    shippingAddress: {
      line1: '56 Castle Road',
      city: 'Nottingham',
      postcode: 'NG1 6AA',
      country: 'United Kingdom'
    },
    items: [
      { name: 'All-Weather Mobility Scooter Poncho', quantity: 1, price: 39.99 }
    ],
    totalAmount: 39.99,
    orderDate: '2026-01-10',
    status: 'pending'
  }
];