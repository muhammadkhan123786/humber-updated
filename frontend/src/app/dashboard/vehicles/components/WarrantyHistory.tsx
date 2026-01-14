"use client";
import { ICustomerVehicleRegInterface } from "../../../../../../common/Vehicle-Registeration.Interface";

interface Props {
  formData: Partial<ICustomerVehicleRegInterface>;
  setFormData: any;
}

export default function WarrantyHistory({ formData, setFormData }: Props) {
  
  // Helper: Date object ko "YYYY-MM-DD" string mein convert karne ke liye (Input requirements)
  const formatDateForInput = (dateValue: any) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Backend aur baaki components ke liye ise Date object hi rehne dein
    setFormData({ 
      ...formData, 
      [e.target.name]: new Date(e.target.value) 
    });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800">Warranty & History</h2>
          <p className="text-xs text-gray-400">Manage purchase dates and warranty coverage periods.</p>
        </div>
        <div className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Warranty Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Purchase Date</label>
          <input 
            type="date" 
            name="purchaseDate" 
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#FE6B1D]" 
            value={formatDateForInput(formData.purchaseDate)}
            onChange={handleChange} 
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Warranty Start Date</label>
          <input 
            type="date" 
            name="warrantyStartDate" 
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#FE6B1D]" 
            value={formatDateForInput(formData.warrantyStartDate)}
            onChange={handleChange} 
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Warranty End Date</label>
          <input 
            type="date" 
            name="warrantyEndDate" 
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#FE6B1D]" 
            value={formatDateForInput(formData.warrantyEndDate)}
            onChange={handleChange} 
          />
          <p className="text-[10px] text-gray-400 mt-1">Default is 1 year from start date.</p>
        </div>
      </div>
    </div>
  );
}