// app/dashboard/suppliers/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Building2, TrendingUp, Package, DollarSign, Truck } from "lucide-react";
import { Button } from "@/components/form/CustomButton";

// Custom Hooks
import { useSupplier } from "./hooks/useSupplier";

// Components
import { SupplierHeader } from "./components/SupplierHeader";
import { SupplierTabs, type TabId } from "./components/SupplierTabs";
import { InfoTab } from "./components/tabs/InfoTab";
import { OrdersTab } from "./components/tabs/OrdersTab";
import { ReturnsTab } from "./components/tabs/ReturnsTab";
import { SupplierPricingTab } from "./components/tabs/PricingTab";

export default function SupplierDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [activeTab, setActiveTab] = useState<TabId>("info");
  
  // Get userId from localStorage
  const userId = typeof window !== "undefined"
    ? (() => { 
        try { 
          const u = JSON.parse(localStorage.getItem("user") || "{}"); 
          return u.id || u._id || ""; 
        } catch { 
          return ""; 
        }
      })()
    : "";

  // Use custom hook for supplier data
  const { supplier, loading, error } = useSupplier(id);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white rounded-2xl px-8 py-6 shadow-xl flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-700 font-medium">Loading supplier dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (!supplier || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-orange-400 blur-xl opacity-50"></div>
            <Building2 className="h-16 w-16 text-gray-400 relative" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mt-6">Supplier Not Found</h3>
          <p className="text-gray-500 mt-2">{error || "The supplier you're looking for doesn't exist or has been removed."}</p>
          <Button 
            variant="outline" 
            className="mt-6 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const name = supplier.contactInformation?.primaryContactName
              || supplier.supplierIdentification?.legalBusinessName
              || "Unknown Supplier";

  const businessName = supplier.supplierIdentification?.legalBusinessName;

  // Calculate stats for header
  // const totalProducts = supplier.products?.length || 0;
  // const activeProducts = supplier.products?.filter((p: any) => p.status === 'active').length || 0;
  const avgLeadTime = supplier.productServices?.leadTimes || "—";
   const totalProducts =  0;
  const activeProducts =  0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      {/* <SupplierHeader 
        name={name}
        businessName={businessName}
        isActive={supplier.isActive}
        supplierId={id}
        stats={{
          totalProducts,
          activeProducts,
          avgLeadTime
        }}
      /> */}

      {/* Quick Stats Row */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Products</p>
                <p className="text-2xl font-bold text-gray-800">{activeProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-gray-800">
                  {/* £{supplier.products?.reduce((acc: number, p: any) => acc + (p.unitPrice || 0), 0).toFixed(0) || 0} */}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Lead Time</p>
                <p className="text-2xl font-bold text-gray-800">{avgLeadTime} days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm p-1">
          <SupplierTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative">
          {/* Content Card with Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-6">
            {activeTab === "info" && <InfoTab supplier={supplier} />}
            
            {activeTab === "pricing" && (
              <SupplierPricingTab
                supplierId={supplier._id}
                supplierName={name}
                userId={userId}
              />
            )}
            
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Purchase Orders</h3>
                    <p className="text-sm text-gray-500 mt-1">All purchase orders placed with this supplier</p>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25">
                    Create New PO
                  </Button>
                </div>
                <OrdersTab supplierId={supplier._id} userId={userId} />
              </div>
            )}
            
            {activeTab === "returns" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Goods Returns</h3>
                    <p className="text-sm text-gray-500 mt-1">All return notes and credits for this supplier</p>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/25">
                    Create Return
                  </Button>
                </div>
                <ReturnsTab supplierId={supplier._id} userId={userId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}