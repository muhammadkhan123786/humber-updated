import React, { useState } from "react";
import { Search, RotateCw, Plus } from "lucide-react";
import {
  Button,
  PageHeader,
  Product,
  StatCard,
  InventoryManagement,
} from "./index";
import { steps } from "./data";

const Super = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const statsData = [
    {
      title: "Total Product",
      // 2. TS FIX: Convert numbers to strings to match StatCardProps
      value: "5",
      color: "#4F46E5",
      gradientClass: "from-indigo-50 to-indigo-100",
    },
    {
      title: "Critical Stock",
      value: "2",
      color: "#10B981",
      gradientClass: "from-emerald-50 to-emerald-100",
    },
    {
      title: "Low Stock",
      value: "1",
      color: "#F59E0B",
      gradientClass: "from-amber-50 to-amber-100",
    },
    {
      title: "Healthy Stock",
      value: "3",
      color: "#F97316",
      gradientClass: "from-orange-50 to-orange-100",
    },
  ];

  return (
    <>
      <PageHeader
        title="Inventory Management"
        subtitle="Manage products with hierarchical categories and marketplace sync"
      >
        <Button icon={Plus}>Add Product</Button>
      </PageHeader>

      <div className="p-6 bg-gray-50 min-h-screen space-y-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6">
          {statsData.map((stat, index) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div> */}

        <div className="p-6 bg-gray-50 min-h-screen space-y-4">
          {/* 1. Tabs Section */}
          <div className="bg-white">
            <div className="flex items-center gap-8 border-b  px-6">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 py-4  transition-all ${
                    currentStep === step.id
                      ? " text-blue-600"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  <step.icon size={18} />
                  <span className="text-sm font-bold">{step.title}</span>
                </button>
              ))}
            </div>
            {currentStep === 1 && (
              <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-2">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="Search by name or SKU..."
                  />
                </div>
                <select className="border rounded-lg px-4 py-2 text-sm font-medium bg-white outline-none">
                  <option>All Categories</option>
                </select>
                <select className="border rounded-lg px-4 py-2 text-sm font-medium bg-white outline-none">
                  <option>All Stock Levels</option>
                </select>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition-colors">
                  <RotateCw size={16} /> Sync All
                </button>
              </div>
            )}
          </div>

          {/* 2. Conditional Content: Only show table if currentStep is 1 (Products) */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Product />
            </div>
          )}

          {currentStep === 2 && <InventoryManagement />}
          {currentStep === 3 && (
            <div className="p-10 text-center text-gray-400">
              Marketplace Distribution Content
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Super;
