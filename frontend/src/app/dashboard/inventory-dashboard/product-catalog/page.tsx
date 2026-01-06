"use client";
import React, { useState } from "react";
import StatCard from "@/components/StatCard";
import CustomTable from "@/components/CustomTable";
import Dropdown from "@/components/form/Dropdown";
import DropdownMenu from "@/components/form/DropdownMenu";
import { 
  TrendingUp, Package, ShoppingCart, DollarSign, ArrowUp 
} from "lucide-react";

// --- Types for Product ---
interface ProductItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  channels: string[]; // e.g., ['D', 'M', 'MA']
  status: 'Active' | 'Draft' | 'Inactive';
  image: string;
}

export default function ProductCatalog() {
  const [channel, setChannel] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  // Mock Data as per your Image (Humber X-200)
  const products: ProductItem[] = [
    {
      id: "1",
      name: "Humber X-200 Scooter",
      category: "Mobility Scooters . 3 Variants",
      sku: "HMS X200",
      stock: 45,
      price: 50000,
      channels: ['D', 'M', 'MA'],
      status: 'Active',
      image: "/scooter-thumb.png", // Replace with your actual path
    },
    {
      id: "2",
      name: "Humber X-200 Scooter",
      category: "Mobility Scooters . 3 Variants",
      sku: "HMS X200",
      stock: 45,
      price: 50000,
      channels: ['D', 'M', 'MA'],
      status: 'Draft',
      image: "/scooter-thumb.png",
    }
  ];

  // --- Column Definitions matching exactly with image_1d744f.png ---
  const columns = [
    {
      header: "Product",
      accessor: (item: ProductItem) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0">
             <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-[10px] text-gray-400">IMG</div>
          </div>
          <div>
            <p className="text-[15px] font-bold text-slate-800">{item.name}</p>
            <p className="text-[12px] text-gray-400 font-medium">{item.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Master Sku",
      accessor: (item: ProductItem) => (
        <div>
          <p className="font-bold text-slate-800">{item.sku.split(' ')[0]}</p>
          <p className="text-xs text-gray-400">{item.sku.split(' ')[1]}</p>
        </div>
      ),
    },
    {
      header: "Stock",
      accessor: (item: ProductItem) => (
        <div>
          <p className="font-bold text-slate-800">{item.stock}</p>
          <p className="text-xs text-green-500 font-bold">In Stock</p>
        </div>
      ),
    },
    {
      header: "Price",
      accessor: (item: ProductItem) => (
        <span className="font-bold text-slate-800 text-[15px]">
          £{item.price.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Channels",
      accessor: (item: ProductItem) => (
        <div className="flex -space-x-2">
          {item.channels.map((ch, i) => (
            <div 
              key={i} 
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm text-white 
              ${ch === 'D' ? 'bg-green-500' : ch === 'M' ? 'bg-blue-500' : 'bg-orange-500'}`}
            >
              {ch}
            </div>
          ))}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (item: ProductItem) => (
        <span className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
          item.status === 'Active' 
            ? 'bg-green-50 text-green-500' 
            : 'bg-slate-100 text-slate-400'
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (item: ProductItem) => (
        <DropdownMenu 
          onEdit={() => console.log("Edit", item.id)}
          onDelete={() => console.log("Delete", item.id)}
        />
      ),
    },
  ];

  const statsData = [
    { title: "Total Inventory Value", value: "£1.2M", subtitle: "Last month", icon: TrendingUp, color: "#4F46E5", gradientClass: "to-indigo-100"  },
    { title: "Low Stock Items", value: "05", subtitle: "Action Needed !", icon: Package, color: "#10B981", gradientClass: "to-green-100"},
    { title: "Pending Orders", value: "34", subtitle: "12 Awaiting Shipment", icon: ShoppingCart, color: "#F59E0B", gradientClass: "to-amber-100" },
    { title: "Monthly Revenue", value: "£1.2k", subtitle: "Last month", icon: DollarSign, color: "#F97316", gradientClass: "to-red-100"  },
  ];

  return (
    <div className="space-y-8 p-6 bg-slate-50/30 min-h-screen">
      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* 2. Filters & Actions Area */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-slate-800">Product Inventory</h2>
        
        <div className="flex items-center gap-3">
          <Dropdown
            options={[{ value: "all", label: "Channel : All" }, { value: "a", label: "Channel A" }]}
            value={channel}
            onChange={setChannel}
          />
          <Dropdown
            options={[{ value: "all", label: "Category : E-Scooters" }, { value: "bikes", label: "Category : Bikes" }]}
            value={category}
            onChange={setCategory}
          />
          <Dropdown
            options={[{ value: "all", label: "Status : Active" }, { value: "inactive", label: "Status : Inactive" }]}
            value={status}
            onChange={setStatus}
          />
        </div>
      </div>

      {/* 3. Reusable Table with Pagination */}
      <CustomTable 
        data={products} 
        columns={columns} 
        showPagination={true}
        currentPage={1}
        totalPages={10}
        onPageChange={(page) => console.log("Page change:", page)}
      />
    </div>
  );
}