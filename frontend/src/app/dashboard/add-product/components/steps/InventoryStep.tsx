// import { motion } from 'framer-motion';
// import { Input } from '@/components/form/Input';
// import { PackageCheck, Info } from 'lucide-react';
// import { WAREHOUSE_OPTIONS, STATUS_OPTIONS, CONDITION_OPTIONS } from '../../data/productData';

// interface InventoryStepProps {
//   formData: {
//     stockQuantity: string;
//     minStockLevel: string;
//     maxStockLevel: string;
//     reorderPoint: string;
//     stockLocation: string;
//     warehouse: string;
//     binLocation: string;
//     status: string;
//     condition: string;
//     featured: boolean;
//   };
//   onInputChange: (field: string, value: any) => void;
// }

// export function InventoryStep({ formData, onInputChange }: InventoryStepProps) {
//   const stockQuantity = parseInt(formData.stockQuantity) || 0;
//   const minStockLevel = parseInt(formData.minStockLevel) || 0;
//   const isLowStock = minStockLevel > 0 && stockQuantity < minStockLevel;

//   return (
//     <div className="space-y-6">
//       {/* Stock Quantity & Location */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//             <PackageCheck className="h-4 w-4 text-orange-600" />
//             Stock Quantity <span className="text-red-500">*</span>
//           </label>
//           <Input
//             type="number"
//             value={formData.stockQuantity}
//             onChange={(e) => onInputChange('stockQuantity', e.target.value)}
//             placeholder="0"
//             className="border-2 border-orange-200 focus:border-orange-500"
//           />
//           <p className="text-xs text-gray-500 mt-1">Current available stock</p>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Stock Location
//           </label>
//           <Input
//             value={formData.stockLocation}
//             onChange={(e) => onInputChange('stockLocation', e.target.value)}
//             placeholder="e.g., Warehouse A, Shelf B3"
//             className="border-2 border-amber-200 focus:border-amber-500"
//           />
//           <p className="text-xs text-gray-500 mt-1">Physical location in facility</p>
//         </div>
//       </div>

//       {/* Warehouse & Bin Location */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Warehouse
//           </label>
//           <select
//             value={formData.warehouse}
//             onChange={(e) => onInputChange('warehouse', e.target.value)}
//             className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
//           >
//             {WAREHOUSE_OPTIONS.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Bin Location
//           </label>
//           <Input
//             value={formData.binLocation}
//             onChange={(e) => onInputChange('binLocation', e.target.value)}
//             placeholder="e.g., A-12-03"
//             className="border-2 border-yellow-200 focus:border-yellow-500"
//           />
//           <p className="text-xs text-gray-500 mt-1">Specific bin/location code</p>
//         </div>
//       </div>

//       {/* Min, Max, Reorder Point */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Minimum Stock Level
//           </label>
//           <Input
//             type="number"
//             value={formData.minStockLevel}
//             onChange={(e) => onInputChange('minStockLevel', e.target.value)}
//             placeholder="0"
//             className="border-2 border-red-200 focus:border-red-500"
//           />
//           <p className="text-xs text-gray-500 mt-1">Alert when stock falls below</p>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Maximum Stock Level
//           </label>
//           <Input
//             type="number"
//             value={formData.maxStockLevel}
//             onChange={(e) => onInputChange('maxStockLevel', e.target.value)}
//             placeholder="0"
//             className="border-2 border-green-200 focus:border-green-500"
//           />
//           <p className="text-xs text-gray-500 mt-1">Maximum capacity to hold</p>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Reorder Point
//           </label>
//           <Input
//             type="number"
//             value={formData.reorderPoint}
//             onChange={(e) => onInputChange('reorderPoint', e.target.value)}
//             placeholder="0"
//             className="border-2 border-amber-200 focus:border-amber-500"
//           />
//           <p className="text-xs text-gray-500 mt-1">Trigger automatic reordering</p>
//         </div>
//       </div>

//       {/* Product Status & Condition */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Product Status
//           </label>
//           <select
//             value={formData.status}
//             onChange={(e) => onInputChange('status', e.target.value)}
//             className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
//           >
//             {STATUS_OPTIONS.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Condition
//           </label>
//           <select
//             value={formData.condition}
//             onChange={(e) => onInputChange('condition', e.target.value)}
//             className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
//           >
//             {CONDITION_OPTIONS.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-3 pt-8">
//           <input
//             type="checkbox"
//             id="featured"
//             checked={formData.featured}
//             onChange={(e) => onInputChange('featured', e.target.checked)}
//             className="h-5 w-5 rounded border-2 border-orange-300 text-orange-600 focus:ring-2 focus:ring-orange-200"
//           />
//           <label htmlFor="featured" className="text-sm font-semibold text-gray-700 cursor-pointer">
//             Featured Product
//           </label>
//         </div>
//       </div>

//       {/* Stock Status Card */}
//       {stockQuantity > 0 && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="p-6 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border-2 border-orange-300"
//         >
//           <h3 className="text-lg font-bold text-orange-900 mb-4">Stock Status</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div>
//               <p className="text-xs text-gray-600">Current Stock</p>
//               <p className="text-2xl font-bold text-gray-900">{stockQuantity}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-600">Min Level</p>
//               <p className="text-2xl font-bold text-red-700">{formData.minStockLevel || '—'}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-600">Max Level</p>
//               <p className="text-2xl font-bold text-green-700">{formData.maxStockLevel || '—'}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-600">Reorder Point</p>
//               <p className="text-2xl font-bold text-amber-700">{formData.reorderPoint || '—'}</p>
//             </div>
//           </div>
//           {isLowStock && (
//             <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
//               <p className="text-sm font-semibold text-red-800">⚠️ Stock level is below minimum threshold!</p>
//             </div>
//           )}
//         </motion.div>
//       )}

//       {/* Info Box */}
//       <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
//         <div className="flex items-start gap-3">
//           <Info className="h-5 w-5 text-blue-600 mt-0.5" />
//           <div className="text-sm text-gray-700">
//             <p className="font-semibold mb-1">Inventory Tips:</p>
//             <ul className="list-disc list-inside space-y-1">
//               <li>Set reorder points to automate purchase orders</li>
//               <li>Use bin locations for efficient warehouse picking</li>
//               <li>Monitor min/max levels to optimize stock holding</li>
//               <li>Featured products appear prominently on your storefront</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { motion } from 'framer-motion';
import { Input } from '@/components/form/Input';
import { PackageCheck, Info, Warehouse, Package, Shield, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";

interface InventoryStepProps {
  formData: {
    stockQuantity: string;
    minStockLevel: string;
    maxStockLevel: string;
    reorderPoint: string;
    stockLocation: string;
    warehouseId: string;
    binLocation: string;
    productStatusId: string;
    conditionId: string;
    warehouseStatusId: string;
    featured: boolean;
    safetyStock?: string;
    leadTimeDays?: string;
    lastStockCheck?: string;
  };
  onInputChange: (field: string, value: any) => void;
  
  // Dropdown data from your service
  warehouses: { value: string; label: string; code?: string }[];
  warehouseStatus: { value: string; label: string; description?: string }[];
  productStatus: { value: string; label: string }[];
  conditions: { value: string; label: string }[];
}

export function InventoryStep({ 
  formData, 
  onInputChange,
  warehouses,
  warehouseStatus,
  productStatus,
  conditions
}: InventoryStepProps) {
  const stockQuantity = parseInt(formData.stockQuantity) || 0;
  const minStockLevel = parseInt(formData.minStockLevel) || 0;
  const maxStockLevel = parseInt(formData.maxStockLevel) || 0;
  const reorderPoint = parseInt(formData.reorderPoint) || 0;
  
  // Find selected dropdown values
  const selectedWarehouse = warehouses?.find(w => w.value === formData.warehouseId);
  const selectedWarehouseStatus = warehouseStatus?.find(ws => ws.value === formData.warehouseStatusId);
  const selectedProductStatus = productStatus?.find(ps => ps.value === formData.productStatusId);
  const selectedCondition = conditions?.find(c => c.value === formData.conditionId);
  
  // Stock status calculations
  const isLowStock = minStockLevel > 0 && stockQuantity < minStockLevel;
  const isCriticalStock = reorderPoint > 0 && stockQuantity <= reorderPoint;
  const isOverstocked = maxStockLevel > 0 && stockQuantity > maxStockLevel;
  const isOptimalStock = stockQuantity >= minStockLevel && stockQuantity <= maxStockLevel;

  // Get stock status color and icon
  const getStockStatus = () => {
    if (stockQuantity === 0) {
      return { label: 'Out of Stock', color: 'from-red-500 to-rose-600', icon: AlertTriangle };
    }
    if (isCriticalStock) {
      return { label: 'Critical', color: 'from-red-500 to-orange-600', icon: AlertTriangle };
    }
    if (isLowStock) {
      return { label: 'Low Stock', color: 'from-orange-500 to-amber-600', icon: TrendingDown };
    }
    if (isOverstocked) {
      return { label: 'Overstocked', color: 'from-purple-500 to-pink-600', icon: TrendingUp };
    }
    if (isOptimalStock) {
      return { label: 'Optimal', color: 'from-green-500 to-emerald-600', icon: PackageCheck };
    }
    return { label: 'Normal', color: 'from-blue-500 to-cyan-600', icon: Package };
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  // Calculate stock utilization percentage
  const stockUtilization = maxStockLevel > 0 
    ? Math.min((stockQuantity / maxStockLevel) * 100, 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Header with Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-orange-600" />
            Inventory Management
          </h2>
          <div className="flex items-center gap-2">
            <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-gradient-to-r ${stockStatus.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${stockUtilization}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600">
              {stockUtilization.toFixed(0)}% filled
            </span>
          </div>
        </div>
      </div>

      {/* Stock Quantity & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-orange-600" />
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min="0"
            value={formData.stockQuantity}
            onChange={(e) => onInputChange('stockQuantity', e.target.value)}
            placeholder="0"
            className="border-2 border-orange-200 focus:border-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">Current available stock</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Stock Location (Aisle/Shelf)
          </label>
          <Input
            value={formData.stockLocation}
            onChange={(e) => onInputChange('stockLocation', e.target.value)}
            placeholder="e.g., Aisle 3, Shelf B"
            className="border-2 border-amber-200 focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">Physical location in facility</p>
        </div>
      </div>

      {/* Warehouse Selection & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-blue-600" />
            Warehouse <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.warehouseId}
            onValueChange={(value) => onInputChange('warehouseId', value)}
          >
            <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
              <SelectValue placeholder="Select warehouse..." />
            </SelectTrigger>
            <SelectContent>
              {warehouses?.length > 0 ? (
                warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.value} value={warehouse.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{warehouse.label}</span>
                      {warehouse.code && (
                        <span className="text-xs text-gray-500">({warehouse.code})</span>
                      )}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-warehouses" disabled>
                  No warehouses configured
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {selectedWarehouse && (
            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs font-medium text-blue-700">
                Selected: {selectedWarehouse.label}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-600" />
            Warehouse Status
          </label>
          <Select
            value={formData.warehouseStatusId}
            onValueChange={(value) => onInputChange('warehouseStatusId', value)}
          >
            <SelectTrigger className="border-2 border-purple-200 focus:border-purple-500">
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              {warehouseStatus?.length > 0 ? (
                warehouseStatus.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{status.label}</span>
                      {status.description && (
                        <span className="text-xs text-gray-500 truncate ml-2 max-w-20">
                          {status.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-status" disabled>
                  No status configured
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {selectedWarehouseStatus && (
            <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <p className="text-xs font-medium text-purple-700">
                  {selectedWarehouseStatus.label}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bin Location & Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bin Location
          </label>
          <Input
            value={formData.binLocation}
            onChange={(e) => onInputChange('binLocation', e.target.value)}
            placeholder="e.g., A-12-03"
            className="border-2 border-yellow-200 focus:border-yellow-500"
          />
          <p className="text-xs text-gray-500 mt-1">Specific bin/location code</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Safety Stock
          </label>
          <Input
            type="number"
            min="0"
            value={formData.safetyStock || ''}
            onChange={(e) => onInputChange('safetyStock', e.target.value)}
            placeholder="Extra stock for emergencies"
            className="border-2 border-amber-200 focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">Buffer stock for unexpected demand</p>
        </div>
      </div>

      {/* Product Status & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-green-600" />
            Product Status
          </label>
          <Select
            value={formData.productStatusId}
            onValueChange={(value) => onInputChange('productStatusId', value)}
          >
            <SelectTrigger className="border-2 border-green-200 focus:border-green-500">
              <SelectValue placeholder="Select product status..." />
            </SelectTrigger>
            <SelectContent>
              {productStatus?.length > 0 ? (
                productStatus.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-product-status" disabled>
                  No product status configured
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {selectedProductStatus && (
            <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
              <p className="text-xs font-medium text-green-700">
                Status: {selectedProductStatus.label}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-600" />
            Item Condition
          </label>
          <Select
            value={formData.conditionId}
            onValueChange={(value) => onInputChange('conditionId', value)}
          >
            <SelectTrigger className="border-2 border-red-200 focus:border-red-500">
              <SelectValue placeholder="Select condition..." />
            </SelectTrigger>
            <SelectContent>
              {conditions?.length > 0 ? (
                conditions.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-conditions" disabled>
                  No conditions configured
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {selectedCondition && (
            <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
              <p className="text-xs font-medium text-red-700">
                Condition: {selectedCondition.label}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stock Levels Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Stock Level
          </label>
          <Input
            type="number"
            min="0"
            value={formData.minStockLevel}
            onChange={(e) => onInputChange('minStockLevel', e.target.value)}
            placeholder="0"
            className="border-2 border-red-200 focus:border-red-500"
          />
          <p className="text-xs text-gray-500 mt-1">Alert when stock falls below</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Maximum Stock Level
          </label>
          <Input
            type="number"
            min="0"
            value={formData.maxStockLevel}
            onChange={(e) => onInputChange('maxStockLevel', e.target.value)}
            placeholder="0"
            className="border-2 border-green-200 focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum capacity to hold</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reorder Point
          </label>
          <Input
            type="number"
            min="0"
            value={formData.reorderPoint}
            onChange={(e) => onInputChange('reorderPoint', e.target.value)}
            placeholder="0"
            className="border-2 border-amber-200 focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">Trigger automatic reordering</p>
        </div>
      </div>

      {/* Featured Product & Lead Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => onInputChange('featured', e.target.checked)}
            className="h-5 w-5 rounded border-2 border-orange-300 text-orange-600 focus:ring-2 focus:ring-orange-200"
          />
          <div>
            <label htmlFor="featured" className="text-sm font-semibold text-gray-700 cursor-pointer block">
              Featured Product
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Display prominently on storefront and promotions
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lead Time (Days)
          </label>
          <Input
            type="number"
            min="0"
            value={formData.leadTimeDays || ''}
            onChange={(e) => onInputChange('leadTimeDays', e.target.value)}
            placeholder="e.g., 7"
            className="border-2 border-blue-200 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Days to replenish stock</p>
        </div>
      </div>

      {/* Stock Status Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border-2 border-orange-300"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-orange-900 flex items-center gap-2">
            <StockIcon className="h-5 w-5" />
            Stock Status Dashboard
          </h3>
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${stockStatus.color} text-white text-xs font-bold`}>
            {stockStatus.label}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-orange-200">
            <p className="text-xs text-gray-600">Current Stock</p>
            <p className="text-2xl font-bold text-gray-900">{stockQuantity}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-red-200">
            <p className="text-xs text-gray-600">Min Level</p>
            <p className="text-2xl font-bold text-red-700">{formData.minStockLevel || '—'}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600">Max Level</p>
            <p className="text-2xl font-bold text-green-700">{formData.maxStockLevel || '—'}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-amber-200">
            <p className="text-xs text-gray-600">Reorder Point</p>
            <p className="text-2xl font-bold text-amber-700">{formData.reorderPoint || '—'}</p>
          </div>
        </div>

        {/* Stock Level Visualization */}
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-gray-600">
            <span>0</span>
            <span>Stock Level</span>
            <span>{maxStockLevel > 0 ? maxStockLevel : '100'}</span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden relative">
            {/* Critical Zone */}
            {reorderPoint > 0 && (
              <div 
                className="absolute h-full bg-red-500/30"
                style={{ width: `${(reorderPoint / Math.max(maxStockLevel, 100)) * 100}%` }}
              />
            )}
            
            {/* Low Stock Zone */}
            {minStockLevel > 0 && (
              <div 
                className="absolute h-full bg-orange-500/30"
                style={{ 
                  left: `${(reorderPoint / Math.max(maxStockLevel, 100)) * 100}%`,
                  width: `${((minStockLevel - reorderPoint) / Math.max(maxStockLevel, 100)) * 100}%`
                }}
              />
            )}
            
            {/* Optimal Zone */}
            {maxStockLevel > 0 && (
              <div 
                className="absolute h-full bg-green-500/30"
                style={{ 
                  left: `${(minStockLevel / Math.max(maxStockLevel, 100)) * 100}%`,
                  width: `${((maxStockLevel - minStockLevel) / Math.max(maxStockLevel, 100)) * 100}%`
                }}
              />
            )}
            
            {/* Current Stock Indicator */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-gray-800"
              style={{ left: `${(stockQuantity / Math.max(maxStockLevel, 100)) * 100}%` }}
            >
              <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg"></div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500/30 rounded"></div>
              <span className="text-gray-600">Critical ({reorderPoint || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500/30 rounded"></div>
              <span className="text-gray-600">Low ({minStockLevel || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500/30 rounded"></div>
              <span className="text-gray-600">Optimal ({maxStockLevel || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500/30 rounded"></div>
              <span className="text-gray-600">Overstock</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-2 mt-4">
          {stockQuantity === 0 && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                ⚠️ Out of Stock - Immediate action required!
              </p>
            </div>
          )}
          
          {isCriticalStock && stockQuantity > 0 && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                ⚠️ Critical Stock Level - Reorder immediately!
              </p>
            </div>
          )}
          
          {isLowStock && !isCriticalStock && (
            <div className="p-3 bg-orange-100 border border-orange-300 rounded-lg">
              <p className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                ⚠️ Low Stock Warning - Consider reordering
              </p>
            </div>
          )}
          
          {isOverstocked && (
            <div className="p-3 bg-purple-100 border border-purple-300 rounded-lg">
              <p className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ⚠️ Overstocked - Consider reducing stock
              </p>
            </div>
          )}
          
          {isOptimalStock && (
            <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                <PackageCheck className="h-4 w-4" />
                ✅ Stock Level Optimal
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Info Box */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Inventory Management Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Warehouse Status:</strong> Indicates operational status (Active, Maintenance, etc.)</li>
              <li><strong>Product Status:</strong> Controls product visibility (Active, Draft, Archived)</li>
              <li><strong>Item Condition:</strong> Important for quality control and pricing</li>
              <li>Set reorder points to automate purchase orders</li>
              <li>Use bin locations for efficient warehouse picking</li>
              <li>Monitor min/max levels to optimize stock holding</li>
              <li>Featured products appear prominently on your storefront</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}