// components/PricingSupplierTab.tsx

import { Input } from "@/components/form/Input";
import { Label } from "@/components/form/Label";
import { Badge } from "@/components/form/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";
import {
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  Search,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { ProductFormData } from "../types";
import { useState, useEffect } from "react";

interface PricingSupplierTabProps {
  formData: ProductFormData;
  onInputChange: (field: keyof ProductFormData, value: any) => void;
  onSupplierChange: (supplierId: string) => void;
  suppliers: any[];
  profit: number;
  margin: number;
}

export const PricingSupplierTab: React.FC<PricingSupplierTabProps> = ({
  formData,
  onInputChange,
  onSupplierChange,
  suppliers,
  profit,
  margin,
}) => {
  const [supplierSearch, setSupplierSearch] = useState("");

  // Debug logs
  useEffect(() => {
    console.log("🎯 PricingSupplierTab - formData:", {
      supplierId: formData?.supplierId,
      supplierName: formData?.supplierName
    });
    console.log("🎯 PricingSupplierTab - suppliers:", suppliers);
  }, [formData, suppliers]);

  // Helper function to extract supplier display name
  const getSupplierName = (supplier: any): string => {
    return (
      supplier?.contactInformation?.primaryContactName ||
      supplier?.supplierIdentification?.legalBusinessName ||
      supplier?.legalBusinessName ||
      supplier?.name ||
      "Unnamed Supplier"
    );
  };

  // Helper function to extract contact email
  const getSupplierEmail = (supplier: any): string => {
    return (
      supplier?.contactInformation?.emailAddress ||
      supplier?.operationalInformation?.orderContactEmail ||
      supplier?.email ||
      ""
    );
  };

  // Helper function to extract contact phone
  const getSupplierPhone = (supplier: any): string => {
    return (
      supplier?.contactInformation?.phoneNumber ||
      supplier?.phone ||
      ""
    );
  };

  // Filter suppliers based on search
  const filteredSuppliers = supplierSearch
    ? suppliers.filter(s => {
        const name = getSupplierName(s).toLowerCase();
        const email = getSupplierEmail(s).toLowerCase();
        const search = supplierSearch.toLowerCase();
        
        return name.includes(search) || email.includes(search);
      })
    : suppliers;

  const calculateMarkup = () => {
    if (formData.costPrice > 0) {
      return (((formData.price - formData.costPrice) / formData.costPrice) * 100).toFixed(1);
    }
    return "0";
  };

  // Find selected supplier
  const selectedSupplier = suppliers.find(s => s._id === formData?.supplierId);

  return (
    <div className="space-y-6">
      {/* Pricing Section */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
        <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Pricing Information
        </h4>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="costPrice">Cost Price (£) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={formData?.costPrice || ""}
                onChange={(e) => onInputChange("costPrice", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Selling Price (£) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData?.price || ""}
                onChange={(e) => onInputChange("price", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="retailPrice">Retail Price (£)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <Input
                id="retailPrice"
                type="number"
                step="0.01"
                value={formData?.retailPrice || ""}
                onChange={(e) => onInputChange("retailPrice", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>
        </div>

        {/* Profit Calculations */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border-2 border-green-300">
            <p className="text-xs text-gray-600 mb-1">Gross Profit</p>
            <p className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              £{profit.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border-2 border-green-300">
            <p className="text-xs text-gray-600 mb-1">Profit Margin</p>
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-5 w-5 ${margin >= 0 ? "text-green-600" : "text-red-600"}`} />
              <p className={`text-2xl font-bold ${margin >= 0 ? "text-green-600" : "text-red-600"}`}>
                {margin.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
            <p className="text-xs text-gray-600 mb-1">Markup</p>
            <p className="text-2xl font-bold text-blue-600">{calculateMarkup()}%</p>
          </div>
        </div>
      </div>

      {/* Supplier Section */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Supplier Information
        </h4>

        {/* Selected Supplier Badge */}
        {selectedSupplier && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Current: {getSupplierName(selectedSupplier)}
              </span>
            </div>
            {getSupplierEmail(selectedSupplier) && (
              <p className="text-xs text-green-600 mt-1 ml-7">
                {getSupplierEmail(selectedSupplier)}
              </p>
            )}
          </div>
        )}

        {/* Dropdown for Supplier Selection */}
        <div className="space-y-2">
          <Label htmlFor="supplier" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Change Supplier
          </Label>

          <Select
            value={formData?.supplierId || ""}
            onValueChange={onSupplierChange}
          >
            <SelectTrigger className="w-full border-2 border-blue-200">
              <SelectValue placeholder="Select a supplier...">
                {selectedSupplier && getSupplierName(selectedSupplier)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {/* Search Input inside dropdown */}
              <div className="sticky top-0 bg-white p-2 border-b z-10">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search suppliers..."
                    value={supplierSearch}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSupplierSearch(e.target.value);
                    }}
                    className="pl-8 h-9 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Supplier List */}
              {filteredSuppliers.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No suppliers found
                </div>
              ) : (
                filteredSuppliers.map((supplier) => {
                  const isSelected = formData?.supplierId === supplier._id;
                  const supplierName = getSupplierName(supplier);
                  const supplierEmail = getSupplierEmail(supplier);
                  
                  return (
                    <SelectItem 
                      key={supplier._id} 
                      value={supplier._id}
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-start gap-2">
                        <div className={`
                          h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0
                          ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                        `}>
                          <Building2 className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {supplierName}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-blue-500 ml-2 flex-shrink-0" />
                            )}
                          </div>
                          
                          {supplierEmail && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3" />
                              {supplierEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })
              )}
            </SelectContent>
          </Select>

          <p className="text-xs text-gray-500 mt-1">
            {suppliers.length} suppliers available
          </p>
        </div>

     
      </div>
    </div>
  );
};