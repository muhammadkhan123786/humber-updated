// src/app/reports/page.tsx
'use client';

import CustomTable from '@/components/CustomTable';
import ProgressBar from '@/components/form/ProgressBar';
import { ChevronRight } from 'lucide-react';

interface AgingData {
  id: string;
  range: string;
  value: string;
  percentage: number;
  progressColor: string;
}

interface ReplenishmentItem {
  id: string;
  name: string;
  sku: string;
  image: string;
  stock: number;
  status: 'Low Stock' | 'Critical' | 'Out of Stock';
}

export default function ReportsPage() {
  // Inventory Aging Data
  const agingData: AgingData[] = [
    { id: '1', range: '0-30 Days', value: '£240k', percentage: 85, progressColor: '#10b981' },
    { id: '2', range: '0-30 Days', value: '£240k', percentage: 75, progressColor: '#3b82f6' },
    { id: '3', range: '0-30 Days', value: '£240k', percentage: 65, progressColor: '#f97316' },
    { id: '4', range: '0-30 Days', value: '£240k', percentage: 55, progressColor: '#1f2937' },
    { id: '5', range: '0-30 Days', value: '£240k', percentage: 50, progressColor: '#f97316' },
    { id: '6', range: '30-60 Days', value: '£340k', percentage: 45, progressColor: '#eab308' },
    { id: '7', range: '60-90 Days', value: '£240k', percentage: 35, progressColor: '#a855f7' },
  ];

  // Replenishment Alerts Data
  const replenishmentItems: ReplenishmentItem[] = [
    {
      id: '1',
      name: 'Humber X-200 Scooter',
      sku: 'SC-001',
      image: '/scooter.png',
      stock: 12,
      status: 'Low Stock',
    },
    {
      id: '2',
      name: 'Humber X-200 Scooter',
      sku: 'SC-001',
      image: '/scooter.png',
      stock: 5,
      status: 'Critical',
    },
    {
      id: '3',
      name: 'Humber X-200 Scooter',
      sku: 'SC-001',
      image: '/scooter.png',
      stock: 42,
      status: 'Low Stock',
    },
    {
      id: '4',
      name: 'Humber X-300 Scooter',
      sku: 'SC-001',
      image: '/scooter.png',
      stock: 65,
      status: 'Low Stock',
    },
    {
      id: '5',
      name: 'Humber X-200 Scooter',
      sku: 'SC-001',
      image: '/scooter.png',
      stock: 32,
      status: 'Low Stock',
    },
  ];

  const replenishmentColumns = [
    {
      header: 'Product',
      accessor: (item: ReplenishmentItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-slate-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {item.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.sku}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Stock',
      accessor: (item: ReplenishmentItem) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {item.stock}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (item: ReplenishmentItem) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            item.status === 'Critical'
              ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
              : 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: () => (
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          Reorder
        </button>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Aging Report */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inventory Aging Report
              </h2>
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {agingData.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.range}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={item.percentage}
                    max={100}
                    height={8}
                    borderRadius={4}
                    trackColor="rgb(229, 231, 235)"
                    progressColor={item.progressColor}
                    showLabel={false}
                    animationDuration={300}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Replenishment Alerts */}
          <div>
            <CustomTable
              title="Replenishment Alerts"
              data={replenishmentItems}
              columns={replenishmentColumns}
              headerAction={
                <button className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Full Report
                  <ChevronRight className="w-4 h-4" />
                </button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}