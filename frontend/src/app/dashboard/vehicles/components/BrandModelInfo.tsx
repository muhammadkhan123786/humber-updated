"use client";
import { useState, useEffect } from "react";
import axios from "axios";
export default function BrandModelInfo({ formData, setFormData }: { formData: any, setFormData: any }) {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${BASE_URL}/vehiclebrand`, { headers: { Authorization: `Bearer ${token}` }})
         .then(res => setBrands(res.data.data || []));
  }, []);

 // Inside BrandModelInfo.tsx update the models useEffect:
useEffect(() => {
  // Use either the ID or the object's _id
  const brandId = typeof formData.vehicleBrandId === 'object' ? formData.vehicleBrandId?._id : formData.vehicleBrandId;
  
  if (brandId) {
    const token = localStorage.getItem("token");
    axios.get(`${BASE_URL}/vechilemodel`, { 
      headers: { Authorization: `Bearer ${token}` },
      params: { brandId: brandId }
    }).then(res => {
      const modelList = res.data.data || [];
      setModels(modelList);
    });
  }
}, [formData.vehicleBrandId]);

  return (
    <div className="bg-linear-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6 hover:shadow-2xl transition-all animate-fadeInUp animation-delay-100">
      <div className="animate-fadeInUp">
        <label className="text-sm font-bold text-gray-700 block mb-2 bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text ">Make *</label>
        <select 
          className="w-full p-3 bg-linear-to-br from-blue-50 to-purple-50 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all hover:border-blue-400"
          value={formData.vehicleBrandId}
          onChange={(e) => setFormData({...formData, vehicleBrandId: e.target.value})}
        >
          <option value="">Select Manufacturer</option>
          {brands.map((b: any) => <option key={b._id} value={b._id}>{b.brandName}</option>)}
        </select>
      </div>

      <div className="animate-fadeInUp animation-delay-100">
        <label className="text-sm font-bold text-gray-700 block mb-2 bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text ">Model *</label>
        <select 
          className="w-full p-3 bg-linear-to-br from-blue-50 to-purple-50 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all hover:border-blue-400"
          value={formData.vehicleModelId}
          onChange={(e) => setFormData({...formData, vehicleModelId: e.target.value})}
        >
          <option value="">Select Model</option>
          {models.map((m: any) => <option key={m._id} value={m._id}>{m.modelName}</option>)}
        </select>
      </div>

      <div className="animate-fadeInUp animation-delay-200">
        <label className="text-sm font-bold text-gray-700 block mb-2 bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text t">Serial Number *</label>
        <input 
          type="text" 
          placeholder="S/N 123456789"
          className="w-full p-3 bg-linear-to-br from-blue-50 to-purple-50 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all hover:border-blue-400"
          value={formData.serialNumber}
          onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
        />
      </div>
    </div>
  );
}