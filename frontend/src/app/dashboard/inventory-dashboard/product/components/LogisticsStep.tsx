"use client";

import { useFormContext, Controller } from "react-hook-form";
import SearchableDropdown from "@/components/form/SearchableDropdown";
import { ShieldCheck, Globe, BadgePercent, Clock } from "lucide-react";

export function LogisticsStep({ dropdownData }: any) {
  const { register, control } = useFormContext();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 1: REGULATORY & TAX */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <BadgePercent className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Taxation & Customs</h3>
          </div>
          
          <Controller
            name="taxId"
            control={control}
            render={({ field }) => (
              <SearchableDropdown 
                label="Tax Class" 
                options={dropdownData?.taxes || []} 
                {...field} 
              />
            )}
          />

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">HS Code (Customs Tariff)</label>
              <input 
                {...register("hsCode")} 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                placeholder="e.g. 8517.12.00" 
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: FINANCIAL & GLOBAL */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Global Settings</h3>
          </div>

          <Controller
            name="currencyId"
            control={control}
            render={({ field }) => (
              <SearchableDropdown 
                label="Base Currency" 
                options={dropdownData?.currencies || []} 
                {...field} 
              />
            )}
          />

          <Controller
            name="unitId"
            control={control}
            render={({ field }) => (
              <SearchableDropdown 
                label="Standard Unit of Measure" 
                options={dropdownData?.units || []} 
                {...field} 
              />
            )}
          />
        </div>

        {/* SECTION 3: FULFILLMENT & WARRANTY */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Service Level Agreements (SLA)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <label className="text-sm font-semibold text-gray-700">Lead Time (Processing Days)</label>
              </div>
              <input 
                type="number" 
                {...register("leadTime", { valueAsNumber: true })} 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
                placeholder="Number of days to ship"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Warranty Duration (Months)</label>
              <input 
                type="number" 
                {...register("warrantyDuration", { valueAsNumber: true })} 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
                placeholder="e.g. 12"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}