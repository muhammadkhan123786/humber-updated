'use client'
import React, { useState } from "react";
import { Search, RotateCw, ChevronRight, Plus, icons } from "lucide-react";
import {
  Button,
  StatCard,
  CustomTable,
  PageHeader,
  StockDetailCard,

} from "./index";
import { productData, ProductItem, steps, filters, StockDetail } from "./data";
import { TriangleAlert, Package } from "lucide-react";

const PackageIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TrendingIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const mockStockData: StockDetail = {
  id: "1",
  name: 'MacBook Pro 16"',
  sku: "ELEC-COMP-LAP-001",
  image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
  status: "Critical",
  lastUpdated: "2026-01-08 14:30",
  unitPrice: 2799.99,
  metrics: {
    onHand: 3,
    reserved: 0,
    reorderLevel: 3,
    reorderQty: 8,
    dangerLevel: 5,
  },
};

const InventoryManagement = () => {
  const [activeFilter, setActiveFilter] = useState<string>("product");
  const statsData = [
    {
      title: 'Total Parts',
      value: 5,
      icon: <PackageIcon />,
      borderColor: 'border-blue-500',
      iconBgColor: 'bg-blue-500'
    },
    {
      title: 'Total Value',
      value: '$452.50',
      icon: <TrendingIcon />,
      borderColor: 'border-green-500',
      iconBgColor: 'bg-green-500'
    },
    {
      title: 'Low Stock',
      value: 1,
      icon: <AlertIcon />,
      borderColor: 'border-orange-500',
      iconBgColor: 'bg-orange-500'
    },
    {
      title: 'Out of Stock',
      value: 2,
      icon: <CloseIcon />,
      borderColor: 'border-pink-500',
      iconBgColor: 'bg-pink-500'
    }
  ];

  return (
    <>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            borderColor={stat.borderColor}
            iconBgColor={stat.iconBgColor}
          />
        ))}
      </div>
     <div className="flex items-center gap-4">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        console.log("isActive", filter.colorClass)

        return (
          <Button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`transition-all duration-200 border shadow-sm ${
              isActive 
                ? filter.colorClass 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {filter.label}
          </Button>
        );
      })}
    </div>
      <StockDetailCard data={mockStockData} />
    </>
  );
};

export default InventoryManagement;
