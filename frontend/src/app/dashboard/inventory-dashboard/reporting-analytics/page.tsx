'use client'
import React from 'react'
import StatCard from "@/components/StatCard";
import Reports from "./components/Reports"

import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUp,
} from "lucide-react";
import SalesForecastCharts from './components/SalesForecastCharts';
export default function ReportingAnalytics() {
    const statsData = [
    {
      title: "Total Inventory Value",
      value: "£1.2M",
      subtitle: "Last month",
      icon: TrendingUp,
      color: "#4F46E5", // Indigo
      gradientClass: "to-indigo-100",
     
    },
    {
      title: "Low Stock Items",
      value: "05",
      subtitle: "Action Needed !",
      icon: Package,
      color: "#10B981", // Green
      gradientClass: "to-green-100",
     
    },
    {
      title: "Pending Orders",
      value: "34",
      subtitle: "12 Awaiting Shipment",
      icon: ShoppingCart,
      color: "#F59E0B", // Amber
      gradientClass: "to-amber-100",
    },
    {
      title: "Monthly Revenue",
      value: "£1.2k",
      subtitle: "Last month",
      icon: DollarSign,
      color: "#F97316", // Orange
      gradientClass: "to-red-100",
    
    },
  ];
  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <div>
        <SalesForecastCharts />
        <Reports />
      </div>
      <div>
      </div>
    </div>
  )
}
