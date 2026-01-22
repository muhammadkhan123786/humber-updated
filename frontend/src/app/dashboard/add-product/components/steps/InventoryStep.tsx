import { motion } from 'framer-motion';
import { Input } from '@/components/form/Input';
import { PackageCheck, Info } from 'lucide-react';
import { WAREHOUSE_OPTIONS, STATUS_OPTIONS, CONDITION_OPTIONS } from '../../data/productData';

interface InventoryStepProps {
  formData: {
    stockQuantity: string;
    minStockLevel: string;
    maxStockLevel: string;
    reorderPoint: string;
    stockLocation: string;
    warehouse: string;
    binLocation: string;
    status: string;
    condition: string;
    featured: boolean;
  };
  onInputChange: (field: string, value: any) => void;
}

export function InventoryStep({ formData, onInputChange }: InventoryStepProps) {
  const stockQuantity = parseInt(formData.stockQuantity) || 0;
  const minStockLevel = parseInt(formData.minStockLevel) || 0;
  const isLowStock = minStockLevel > 0 && stockQuantity < minStockLevel;

  return (
    <div className="space-y-6">
      {/* Stock Quantity & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-orange-600" />
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => onInputChange('stockQuantity', e.target.value)}
            placeholder="0"
            className="border-2 border-orange-200 focus:border-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">Current available stock</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Stock Location
          </label>
          <Input
            value={formData.stockLocation}
            onChange={(e) => onInputChange('stockLocation', e.target.value)}
            placeholder="e.g., Warehouse A, Shelf B3"
            className="border-2 border-amber-200 focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">Physical location in facility</p>
        </div>
      </div>

      {/* Warehouse & Bin Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Warehouse
          </label>
          <select
            value={formData.warehouse}
            onChange={(e) => onInputChange('warehouse', e.target.value)}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
          >
            {WAREHOUSE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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
      </div>

      {/* Min, Max, Reorder Point */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Stock Level
          </label>
          <Input
            type="number"
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
            value={formData.reorderPoint}
            onChange={(e) => onInputChange('reorderPoint', e.target.value)}
            placeholder="0"
            className="border-2 border-amber-200 focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">Trigger automatic reordering</p>
        </div>
      </div>

      {/* Product Status & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => onInputChange('status', e.target.value)}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={formData.condition}
            onChange={(e) => onInputChange('condition', e.target.value)}
            className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
          >
            {CONDITION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => onInputChange('featured', e.target.checked)}
            className="h-5 w-5 rounded border-2 border-orange-300 text-orange-600 focus:ring-2 focus:ring-orange-200"
          />
          <label htmlFor="featured" className="text-sm font-semibold text-gray-700 cursor-pointer">
            Featured Product
          </label>
        </div>
      </div>

      {/* Stock Status Card */}
      {stockQuantity > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border-2 border-orange-300"
        >
          <h3 className="text-lg font-bold text-orange-900 mb-4">Stock Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stockQuantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Min Level</p>
              <p className="text-2xl font-bold text-red-700">{formData.minStockLevel || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Max Level</p>
              <p className="text-2xl font-bold text-green-700">{formData.maxStockLevel || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Reorder Point</p>
              <p className="text-2xl font-bold text-amber-700">{formData.reorderPoint || '—'}</p>
            </div>
          </div>
          {isLowStock && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm font-semibold text-red-800">⚠️ Stock level is below minimum threshold!</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Info Box */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Inventory Tips:</p>
            <ul className="list-disc list-inside space-y-1">
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