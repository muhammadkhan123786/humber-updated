// // src/hooks/useInventoryData.ts

// import { useState, useMemo } from 'react';
// import { inventoryItems, stockMovements, valuationSummary } from '../data/inventoryData';
// import { FilterOptions, InventoryItem } from '../types/inventory';

// export function useInventoryData() {
//   const [filters, setFilters] = useState<FilterOptions>({
//     search: '',
//     category: 'All',
//     warehouse: 'All',
//     status: 'All',
//     dateRange: { start: null, end: null },
//     sortBy: 'productName',
//     sortOrder: 'asc',
//   });

//   const filteredItems = useMemo(() => {
//     let filtered = [...inventoryItems];

//     // Search filter
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filtered = filtered.filter(item =>
//         item.productName.toLowerCase().includes(searchLower) ||
//         item.sku.toLowerCase().includes(searchLower) ||
//         item.supplier.toLowerCase().includes(searchLower)
//       );
//     }

//     // Category filter
//     if (filters.category !== 'All') {
//       filtered = filtered.filter(item => item.category === filters.category);
//     }

//     // Warehouse filter
//     if (filters.warehouse !== 'All') {
//       filtered = filtered.filter(item => item.warehouse === filters.warehouse);
//     }

//     // Status filter
//     if (filters.status !== 'All') {
//       filtered = filtered.filter(item => item.status === filters.status);
//     }

//     // Value range filter
//     if (filters.minValue) {
//       filtered = filtered.filter(item => item.totalValue >= filters.minValue!);
//     }
//     if (filters.maxValue) {
//       filtered = filtered.filter(item => item.totalValue <= filters.maxValue!);
//     }

//     // Sorting
//     filtered.sort((a, b) => {
//       const aVal = a[filters.sortBy as keyof InventoryItem];
//       const bVal = b[filters.sortBy as keyof InventoryItem];
      
//       if (typeof aVal === 'string' && typeof bVal === 'string') {
//         return filters.sortOrder === 'asc'
//           ? aVal.localeCompare(bVal)
//           : bVal.localeCompare(aVal);
//       }
      
//       if (typeof aVal === 'number' && typeof bVal === 'number') {
//         return filters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
//       }
      
//       return 0;
//     });

//     return filtered;
//   }, [filters]);

//   const lowStockItems = useMemo(() => {
//     return inventoryItems.filter(item => item.status === 'Low Stock');
//   }, []);

//   const outOfStockItems = useMemo(() => {
//     return inventoryItems.filter(item => item.status === 'Out of Stock');
//   }, []);

//   const totalInventoryValue = useMemo(() => {
//     return inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
//   }, []);

//   const updateFilter = (key: keyof FilterOptions, value: any) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       search: '',
//       category: 'All',
//       warehouse: 'All',
//       status: 'All',
//       dateRange: { start: null, end: null },
//       sortBy: 'productName',
//       sortOrder: 'asc',
//     });
//   };

//   return {
//     inventoryItems: filteredItems,
//     allItems: inventoryItems,
//     stockMovements,
//     valuationSummary,
//     lowStockItems,
//     outOfStockItems,
//     totalInventoryValue,
//     filters,
//     updateFilter,
//     resetFilters,
//   };
// }