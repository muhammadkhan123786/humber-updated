// components/steps/variant-sections/InventorySection.tsx
import { motion } from 'framer-motion';
import { Input } from '@/components/form/Input';
import { 
  PackageCheck, Warehouse, Shield, AlertTriangle, 
  TrendingUp, TrendingDown, Package 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";

interface InventorySectionProps {
  currentVariant: any;
  warehouses: any[];
  warehouseStatus: any[];
  productStatus: any[];
  conditions: any[];
  onVariantFieldChange: (field: string, value: any) => void;
}

export function InventorySection({
  currentVariant,
  warehouses = [],
  warehouseStatus = [],
  productStatus = [],
  conditions = [],
  onVariantFieldChange,
}: InventorySectionProps) {
  const stockQuantity = parseInt(currentVariant.stockQuantity || '0');
  const minStockLevel = parseInt(currentVariant.minStockLevel || '0');
  const maxStockLevel = parseInt(currentVariant.maxStockLevel || '0');
  const reorderPoint = parseInt(currentVariant.reorderPoint || '0');
  
  // Stock status calculations
  const isLowStock = minStockLevel > 0 && stockQuantity < minStockLevel;
  const isCriticalStock = reorderPoint > 0 && stockQuantity <= reorderPoint;
  const isOverstocked = maxStockLevel > 0 && stockQuantity > maxStockLevel;
  const isOptimalStock = stockQuantity >= minStockLevel && stockQuantity <= maxStockLevel;
  
  // Get stock status
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
    <div className="space-y-4">
      {/* Stock Quantity & Status */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Stock Quantity <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            type="number"
            min="0"
            value={currentVariant.stockQuantity}
            onChange={(e) => onVariantFieldChange('stockQuantity', e.target.value)}
            placeholder="0"
            className="border-2 border-blue-200 focus:border-blue-500"
          />
        </div>
        
        {/* Stock Status Display */}
        {stockQuantity > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StockIcon className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">
                  {stockStatus.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${stockStatus.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stockUtilization}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {stockUtilization.toFixed(0)}%
                </span>
              </div>
            </div>
            
            {/* Stock Alerts */}
            <div className="mt-2 space-y-1">
              {stockQuantity === 0 && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  ⚠️ Out of Stock - Immediate action required!
                </div>
              )}
              
              {isCriticalStock && stockQuantity > 0 && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  ⚠️ Critical Stock Level - Reorder immediately!
                </div>
              )}
              
              {isLowStock && !isCriticalStock && (
                <div className="p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                  ⚠️ Low Stock Warning - Consider reordering
                </div>
              )}
              
              {isOverstocked && (
                <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-700">
                  ⚠️ Overstocked - Consider reducing stock
                </div>
              )}
              
              {isOptimalStock && (
                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                  ✅ Stock Level Optimal
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Stock Levels Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Minimum Stock Level
          </label>
          <Input
            type="number"
            min="0"
            value={currentVariant.minStockLevel}
            onChange={(e) => onVariantFieldChange('minStockLevel', e.target.value)}
            placeholder="0"
            className="border-2 border-red-200 focus:border-red-500"
          />
          <p className="text-xs text-gray-500 mt-1">Alert when stock falls below</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Maximum Stock Level
          </label>
          <Input
            type="number"
            min="0"
            value={currentVariant.maxStockLevel}
            onChange={(e) => onVariantFieldChange('maxStockLevel', e.target.value)}
            placeholder="0"
            className="border-2 border-green-200 focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum capacity to hold</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Reorder Point
          </label>
          <Input
            type="number"
            min="0"
            value={currentVariant.reorderPoint}
            onChange={(e) => onVariantFieldChange('reorderPoint', e.target.value)}
            placeholder="0"
            className="border-2 border-amber-200 focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">Trigger automatic reordering</p>
        </div>
      </div>

      {/* Stock Location */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Stock Location (Aisle/Shelf)
        </label>
        <Input
          value={currentVariant.stockLocation}
          onChange={(e) => onVariantFieldChange('stockLocation', e.target.value)}
          placeholder="e.g., Aisle 3, Shelf B"
          className="border-2 border-amber-200 focus:border-amber-500"
        />
      </div>

      {/* Warehouse & Bin Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-blue-600" />
            Warehouse
          </label>
          <Select
            value={currentVariant.warehouseId}
            onValueChange={(value) => onVariantFieldChange('warehouseId', value)}
          >
            <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
              <SelectValue placeholder="Select warehouse..." />
            </SelectTrigger>
            <SelectContent>
              {warehouses.length > 0 ? (
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
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Bin Location
          </label>
          <Input
            value={currentVariant.binLocation}
            onChange={(e) => onVariantFieldChange('binLocation', e.target.value)}
            placeholder="e.g., A-12-03"
            className="border-2 border-yellow-200 focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Product Status & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-green-600" />
            Product Status
          </label>
          <Select
            value={currentVariant.productStatusId}
            onValueChange={(value) => onVariantFieldChange('productStatusId', value)}
          >
            <SelectTrigger className="border-2 border-green-200 focus:border-green-500">
              <SelectValue placeholder="Select product status..." />
            </SelectTrigger>
            <SelectContent>
              {productStatus.length > 0 ? (
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
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-600" />
            Item Condition
          </label>
          <Select
            value={currentVariant.conditionId}
            onValueChange={(value) => onVariantFieldChange('conditionId', value)}
          >
            <SelectTrigger className="border-2 border-red-200 focus:border-red-500">
              <SelectValue placeholder="Select condition..." />
            </SelectTrigger>
            <SelectContent>
              {conditions.length > 0 ? (
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
        </div>
      </div>

      {/* Additional Inventory Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Safety Stock
          </label>
          <Input
            type="number"
            min="0"
            value={currentVariant.safetyStock || ''}
            onChange={(e) => onVariantFieldChange('safetyStock', e.target.value)}
            placeholder="Extra stock for emergencies"
            className="border-2 border-amber-200 focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">Buffer stock for unexpected demand</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Lead Time (Days)
          </label>
          <Input
            type="number"
            min="0"
            value={currentVariant.leadTimeDays || ''}
            onChange={(e) => onVariantFieldChange('leadTimeDays', e.target.value)}
            placeholder="e.g., 7"
            className="border-2 border-blue-200 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Days to replenish stock</p>
        </div>
      </div>

      {/* Featured Product */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200">
        <input
          type="checkbox"
          checked={currentVariant.featured || false}
          onChange={(e) => onVariantFieldChange('featured', e.target.checked)}
          className="h-5 w-5 rounded border-2 border-orange-300 text-orange-600 focus:ring-2 focus:ring-orange-200"
        />
        <div>
          <label className="text-sm font-medium text-gray-700 cursor-pointer block">
            Featured Product
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Display prominently on storefront and promotions
          </p>
        </div>
      </div>

      {/* Stock Status Dashboard */}
      {stockQuantity > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-orange-900 flex items-center gap-2">
              <StockIcon className="h-5 w-5" />
              Stock Status Dashboard
            </h3>
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${stockStatus.color} text-white text-xs font-bold`}>
              {stockStatus.label}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600">Current Stock</p>
              <p className="text-lg font-bold text-gray-900">{stockQuantity}</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-red-200">
              <p className="text-xs text-gray-600">Min Level</p>
              <p className="text-lg font-bold text-red-700">{minStockLevel || '—'}</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600">Max Level</p>
              <p className="text-lg font-bold text-green-700">{maxStockLevel || '—'}</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-amber-200">
              <p className="text-xs text-gray-600">Reorder Point</p>
              <p className="text-lg font-bold text-amber-700">{reorderPoint || '—'}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}