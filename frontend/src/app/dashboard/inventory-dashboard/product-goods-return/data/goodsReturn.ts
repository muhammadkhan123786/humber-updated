import { GoodsReturnNote, GRNForReturn } from '../types/goodsReturn';

export const mockAvailableGRNs: GRNForReturn[] = [
  {
    id: '1',
    grnNumber: 'GRN-2024-001',
    poNumber: 'PO-2024-001',
    supplier: 'Pride Mobility Supplies Ltd',
    receivedDate: new Date('2024-01-25'),
    items: [
      {
        id: '1',
        productName: 'Pride Victory 10 3-Wheel',
        sku: 'PV10-3W-001',
        receivedQuantity: 5,
        acceptedQuantity: 4,
        unitPrice: 1299.99
      },
      {
        id: '2',
        productName: 'Battery 12V 35Ah AGM',
        sku: 'BAT-12V35-003',
        receivedQuantity: 20,
        acceptedQuantity: 18,
        unitPrice: 75.00
      }
    ]
  },
  {
    id: '2',
    grnNumber: 'GRN-2024-002',
    poNumber: 'PO-2024-002',
    supplier: 'Drive Medical Distribution',
    receivedDate: new Date('2024-01-28'),
    items: [
      {
        id: '3',
        productName: 'Drive Medical Scout Compact',
        sku: 'DM-SC-002',
        receivedQuantity: 3,
        acceptedQuantity: 2,
        unitPrice: 799.99
      },
      {
        id: '4',
        productName: 'Charger 24V 5A',
        sku: 'CHG-24V5-006',
        receivedQuantity: 10,
        acceptedQuantity: 9,
        unitPrice: 59.99
      }
    ]
  }
];

export const mockGoodsReturnNotes: GoodsReturnNote[] = [
  {
    id: '1',
    grnNumber: 'GRN-2024-001',
    grnReference: 'GRN-2024-001 / PO-2024-001',
    returnNumber: 'GRTN-2024-001',
    supplier: 'Pride Mobility Supplies Ltd',
    returnDate: new Date('2024-01-26'),
    returnedBy: 'John Smith',
    status: 'approved',
    returnReason: 'Damaged goods received',
    items: [
      {
        id: '1',
        productName: 'Pride Victory 10 3-Wheel',
        sku: 'PV10-3W-001',
        receivedQuantity: 5,
        returnQuantity: 1,
        returnReason: 'damaged',
        condition: 'Damaged during shipping - scratched body',
        unitPrice: 1299.99,
        totalPrice: 1299.99,
        notes: 'Unit #3 has significant scratches on the front panel'
      }
    ],
    totalAmount: 1299.99,
    notes: 'Arrange pickup with supplier',
    createdAt: new Date('2024-01-26')
  },
  {
    id: '2',
    grnNumber: 'GRN-2024-002',
    grnReference: 'GRN-2024-002 / PO-2024-002',
    returnNumber: 'GRTN-2024-002',
    supplier: 'Drive Medical Distribution',
    returnDate: new Date('2024-01-29'),
    returnedBy: 'Sarah Johnson',
    status: 'in-transit',
    returnReason: 'Quality issues detected',
    items: [
      {
        id: '2',
        productName: 'Drive Medical Scout Compact',
        sku: 'DM-SC-002',
        receivedQuantity: 3,
        returnQuantity: 1,
        returnReason: 'defective',
        condition: 'Motor not functioning properly',
        unitPrice: 799.99,
        totalPrice: 799.99,
        notes: 'Motor makes unusual noise and stops intermittently'
      },
      {
        id: '3',
        productName: 'Charger 24V 5A',
        sku: 'CHG-24V5-006',
        receivedQuantity: 10,
        returnQuantity: 1,
        returnReason: 'defective',
        condition: 'Does not charge',
        unitPrice: 59.99,
        totalPrice: 59.99,
        notes: 'LED indicator not working, no output voltage'
      }
    ],
    totalAmount: 859.98,
    notes: 'Supplier notified, RMA number pending',
    createdAt: new Date('2024-01-29')
  }
];