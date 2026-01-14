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
    <div className="bg-linear-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 hover:shadow-2xl transition-all animate-fadeInUp animation-delay-200">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Warranty & History</h2>
          <p className="text-xs text-gray-400">Manage purchase dates and warranty coverage periods.</p>
        </div>
        <div className="bg-linear-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Warranty Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="animate-fadeInUp">
          <label className="text-sm font-bold text-gray-700 block mb-2 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text ">Purchase Date</label>
          <input 
            type="date" 
            name="purchaseDate" 
            className="w-full p-3 bg-linear-to-br from-green-50 to-emerald-50 border border-gray-300 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all hover:border-green-400" 
            value={formatDateForInput(formData.purchaseDate)}
            onChange={handleChange} 
          />
        </div>
        <div className="animate-fadeInUp animation-delay-100">
          <label className="text-sm font-bold text-gray-700 block mb-2 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text ">Warranty Start Date</label>
          <input 
            type="date" 
            name="warrantyStartDate" 
            className="w-full p-3 bg-linear-to-br from-green-50 to-emerald-50 border border-gray-300 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all hover:border-green-400" 
            value={formatDateForInput(formData.warrantyStartDate)}
            onChange={handleChange} 
          />
        </div>
        <div className="animate-fadeInUp animation-delay-200">
          <label className="text-sm font-bold text-gray-700 block mb-2 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text ">Warranty End Date</label>
          <input 
            type="date" 
            name="warrantyEndDate" 
            className="w-full p-3 bg-linear-to-br from-green-50 to-emerald-50 border border-gray-300 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all hover:border-green-400" 
            value={formatDateForInput(formData.warrantyEndDate)}
            onChange={handleChange} 
          />
          <p className="text-[10px] text-gray-400 mt-1">Default is 1 year from start date.</p>
        </div>
      </div>
    </div>
  );
}