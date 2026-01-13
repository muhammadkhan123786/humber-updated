"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ICustomerVehicleRegInterface } from "../../../../.././../common/Vehicle-Registeration.Interface";

export default function BrandModelInfo({ formData, setFormData }: { formData: any, setFormData: any }) {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${BASE_URL}/vehiclebrand`, { headers: { Authorization: `Bearer ${token}` }})
         .then(res => setBrands(res.data.data || []));
  }, []);

  useEffect(() => {
    if (formData.vehicleBrandId) {
      const token = localStorage.getItem("token");
      axios.get(`${BASE_URL}/vechilemodel`, { 
        headers: { Authorization: `Bearer ${token}` },
        params: { brandId: formData.vehicleBrandId }
      }).then(res => setModels(res.data.data || []));
    }
  }, [formData.vehicleBrandId]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-1">Make *</label>
        <select 
          className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#FE6B1D]"
          value={formData.vehicleBrandId}
          onChange={(e) => setFormData({...formData, vehicleBrandId: e.target.value})}
        >
          <option value="">Select Manufacturer</option>
          {brands.map((b: any) => <option key={b._id} value={b._id}>{b.brandName}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600 block mb-1">Model *</label>
        <select 
          className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#FE6B1D]"
          value={formData.vehicleModelId}
          onChange={(e) => setFormData({...formData, vehicleModelId: e.target.value})}
        >
          <option value="">Select Model</option>
          {models.map((m: any) => <option key={m._id} value={m._id}>{m.modelName}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600 block mb-1">Serial Number *</label>
        <input 
          type="text" placeholder="S/N 123456789"
          className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#FE6B1D]"
          value={formData.serialNumber}
          onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
        />
      </div>
    </div>
  );
}