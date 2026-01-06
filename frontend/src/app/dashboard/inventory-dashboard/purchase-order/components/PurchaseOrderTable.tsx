// src/app/purchase-order/page.tsx
'use client';

import CustomTable from '@/components/CustomTable';
import DropdownMenu from '@/components/form/DropdownMenu';
import { Printer, Save, ChevronDown, ChevronRight , Check } from 'lucide-react';
import Button from '@/components/Button';

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  image: string;
  ordered: number;
  batchNumber: string;
  expiryDate: string;
  receivedDate: string;
  receivedStatus: 'Match' | 'Mismatch';
  location: string;
  units: number;
}

export default function PurchaseOrderPage() {
  const products: ProductItem[] = [
    {
      id: '1',
      name: 'Micro Scooter Schweiz',
      sku: 'SKU: ECU-8R4-X2',
      image: '/scooter.png',
      ordered: 50,
      batchNumber: 'B-9921',
      expiryDate: 'Dec13,2025',
      receivedDate: 'Dec13,2025',
      receivedStatus: 'Match',
      location: 'Zone A - Shelf6',
      units: 50,
    },
    {
      id: '2',
      name: 'Micro Scooter Schweiz',
      sku: 'SKU: ECU-8R4-X2',
      image: '/scooter.png',
      ordered: 50,
      batchNumber: 'B-9921',
      expiryDate: 'Dec13,2025',
      receivedDate: 'Dec13,2025',
      receivedStatus: 'Match',
      location: 'Zone A - Shelf6',
      units: 50,
    },
    {
      id: '3',
      name: 'Micro Scooter Schweiz',
      sku: 'SKU: ECU-8R4-X2',
      image: '/scooter.png',
      ordered: 50,
      batchNumber: 'B-9921',
      expiryDate: 'Dec13,2025',
      receivedDate: 'Dec13,2025',
      receivedStatus: 'Match',
      location: 'Zone A - Shelf6',
      units: 50,
    },
    {
      id: '4',
      name: 'Micro Scooter Schweiz',
      sku: 'SKU: ECU-8R4-X2',
      image: '/scooter.png',
      ordered: 50,
      batchNumber: 'B-9921',
      expiryDate: 'Dec13,2025',
      receivedDate: 'Dec13,2025',
      receivedStatus: 'Match',
      location: 'Zone A - Shelf6',
      units: 50,
    },
  ];

  const handleEdit = (product: ProductItem) => {
    console.log('Edit product:', product);
  };

  const handleDelete = (product: ProductItem) => {
    console.log('Delete product:', product);
  };

  const columns = [
    {
      header: 'Product Details',
      accessor: (item: ProductItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-slate-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {item.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {item.sku}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Ordered',
      accessor: (item: ProductItem) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {item.ordered}
        </span>
      ),
    },
    {
      header: 'Batch Number',
      accessor: (item: ProductItem) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {item.batchNumber}
        </span>
      ),
    },
    {
      header: 'Expiry Date',
      accessor: (item: ProductItem) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {item.expiryDate}
        </span>
      ),
    },
    {
      header: 'Received',
      accessor: (item: ProductItem) => (
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {item.receivedDate}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Check className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400">
              {item.receivedStatus}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: (item: ProductItem) => (
        <button className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          {item.location}
          <ChevronDown className="w-4 h-4" />
        </button>
      ),
    },
    {
      header: 'Units',
      accessor: (item: ProductItem) => (
        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
          {item.units}
        </span>
      ),
    },
    {
      header: '',
      accessor: (item: ProductItem) => (
        <DropdownMenu
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDelete(item)}
        />
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <CustomTable
          title="Purchase Order Details"
          data={products}
          columns={columns}
          headerAction={
            <div className="flex items-center gap-3">
              {/* <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                <Printer className="w-4 h-4" />
                Print Labels
              </button> */}
              <Button icon={Printer} className='bg-[#FFFFFF]'>
                Print Labels
              </Button>
               <Button icon={Save}>
               Save Draft
              </Button>
               <Button icon={ChevronRight} iconPosition="right">
  View All
</Button>
            </div>
          }
        />

        {/* Footer Section */}
        <div className="mt-6 flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/10 p-5">
          <div className="flex items-center gap-8">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Received
              </span>
              <span className="ml-2 text-lg font-semibold text-orange-500 dark:text-blue-400">
                60
              </span>
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                / 200
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Discrepancies
              </span>
              <span className="ml-2 text-lg font-semibold text-orange-500 dark:text-blue-400">
                10
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors shadow-sm">
              Complete Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}