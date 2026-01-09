'use client'
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, Warehouse, Box } from "lucide-react";
import SearchableDropdown from "@/components/form/SearchableDropdown";
import Dropdown from "@/components/form/Dropdown";

export function VariantStep({ dropdownData }: any) {
  const { register, control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  const parentSKU = watch("SKU");

  const addNewVariant = () => {
    append({
      sku: `${parentSKU || "VAR"}-${fields.length + 1}`,
      colorId: "",
      sizeId: "",
      costPrice: 0,
      basePrice: 0,
      salePrice: 0,
      compareAtPrice: 0,
      stock: 0,
      warehouseId: "", // Added default value
      inventoryStatus: "in_stock", // Added default value
      isActive: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <h3 className="font-bold text-gray-800">Product Variations</h3>
          <p className="text-xs text-gray-500">Manage prices, warehouses, and stock for different versions</p>
        </div>
        <button
          type="button"
          onClick={addNewVariant}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition"
        >
          <Plus className="w-4 h-4" /> Add Variant
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((item, index) => (
          <div key={item.id} className="bg-white border rounded-xl shadow-sm overflow-hidden border-l-4 border-l-orange-500">
            <div className="p-4 space-y-4">
              {/* TOP ROW: Attributes & Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <Controller
                  name={`colorId`}
                  control={control}
                  render={({ field }) => (
                    <SearchableDropdown label="Color" options={dropdownData?.colors || []} {...field} />
                  )}
                />
                <Controller
                  name={`sizeId`}
                  control={control}
                  render={({ field }) => (
                    <SearchableDropdown label="Size" options={dropdownData?.sizes || []} {...field} />
                  )}
                />
                <div>
                  <label className="text-xs font-bold text-gray-600">Variant SKU</label>
                  <input {...register(`sku`)} className="w-full p-2 border rounded text-sm bg-gray-50 outline-none" />
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => remove(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* MIDDLE ROW: Warehouse & Stock Status (Newly Added) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-blue-50/30 rounded-lg border border-blue-100/50">
                <Controller
                  name={`warehouseId`}
                  control={control}
                  render={({ field }) => (
                    <SearchableDropdown 
                      label="Assign Warehouse" 
                      options={dropdownData?.fetchWherehoues || []} 
                      {...field} 
                    />
                  )}
                />
                <Controller
                  name={`warehouseStautsId`}
                  control={control}
                  render={({ field }) => (
                    <Dropdown 
                      label="Warehouse  Status" 
                      options={dropdownData?.fetchWherehouesStatus || []} 
                      {...field} 
                    />
                  )}
                />

                <div>
                  
                  <label className="text-[10px] font-bold uppercase text-blue-600 flex items-center gap-1 mb-3">
                    <Box className="w-3 h-3" /> Stock Qty
                  </label>
                  <input 
                    type="number" 
                    {...register(`stock`, { valueAsNumber: true })} 
                    className="w-full p-2 border border-blue-200 rounded text-sm focus:ring-2 focus:ring-blue-400 outline-none" 
                  />
                </div>
                {/* <div>
                  <label className="text-[10px] font-bold uppercase text-blue-600 mb-1 block">Stock Status</label>
                  <select 
                    {...register(`inventoryStatus`)} 
                    className="w-full p-2 border border-blue-200 rounded text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="on_backorder">Backorder</option>
                  </select>
                </div> */}
              </div>

              {/* BOTTOM ROW: Professional Pricing */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2 border-t border-dashed">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Cost ($)</label>
                  <input type="number" {...register(`costPrice`, { valueAsNumber: true })} className="w-full p-2 border rounded text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Base ($)</label>
                  <input type="number" {...register(`basePrice`, { valueAsNumber: true })} className="w-full p-2 border rounded text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 text-orange-600">Sale ($)</label>
                  <input type="number" {...register(`salePrice`, { valueAsNumber: true })} className="w-full p-2 border border-orange-200 rounded text-sm bg-orange-50/50" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Compare ($)</label>
                  <input type="number" {...register(`compareAtPrice`, { valueAsNumber: true })} className="w-full p-2 border rounded text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Barcode</label>
                  <input {...register(`barcode`)} className="w-full p-2 border rounded text-sm" placeholder="UPC/EAN" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50">
          <p className="text-gray-400">No variants added yet. Click "Add Variant" to start.</p>
        </div>
      )}
    </div>
  );
}