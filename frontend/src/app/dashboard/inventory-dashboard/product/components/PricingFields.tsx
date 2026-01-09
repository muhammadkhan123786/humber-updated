"use client";

import { useFormContext, Controller } from "react-hook-form";
import SearchableDropdown from "@/components/form/SearchableDropdown";
import { Warehouse, Activity, Calculator } from "lucide-react";

export function PricingFields({ dropdownData }: any) {
  const { register, watch, control } = useFormContext();
  
  const salePrice = watch("salePrice") || 0;
  const costPrice = watch("costPrice") || 0;
  const margin = salePrice > 0 ? ((salePrice - costPrice) / salePrice) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* 1. PROFESSIONAL PRICING SECTION */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-orange-500" />
          <h3 className="font-bold text-gray-800 text-sm uppercase">Financial Configuration</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cost Price</label>
            <input type="number" {...register("costPrice", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Base Price</label>
            <input type="number" {...register("basePrice", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sale Price</label>
            <input type="number" {...register("salePrice", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg border-orange-200 bg-orange-50/50 outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Compare At</label>
            <input type="number" {...register("compareAtPrice", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        <div className="px-6 py-2 bg-orange-50 border-t border-orange-100 flex justify-between items-center">
          <span className="text-xs font-bold text-orange-700">Gross Profit Margin:</span>
          <span className={`text-sm font-bold ${margin >= 20 ? 'text-green-600' : 'text-orange-600'}`}>
            {margin.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* 2. WAREHOUSE & STOCK MANAGEMENT */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
          <Warehouse className="w-4 h-4 text-blue-500" />
          <h3 className="font-bold text-gray-800 text-sm uppercase">Inventory Sourcing</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Warehouse Dropdown */}
          <Controller
            name="warehouseId"
            control={control}
            render={({ field }) => (
              <SearchableDropdown 
                label="Storage Warehouse" 
                options={dropdownData?.warehouses || []} 
                {...field} 
              />
            )}
          />

          {/* Stock Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Available Quantity</label>
            <input 
              type="number" 
              {...register("stock", { valueAsNumber: true })} 
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" 
              placeholder="0"
            />
          </div>

          {/* Warehouse/Inventory Status */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
               Stock Status
            </label>
            <select 
              {...register("inventoryStatus")} 
              className="w-full p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="in_stock">In Stock (Available)</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="on_backorder">On Backorder</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}