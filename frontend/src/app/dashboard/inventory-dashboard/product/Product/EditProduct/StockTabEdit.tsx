// components/StockTabEdit.tsx
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
  Warehouse,
  AlertCircle,
  Shield,
} from "lucide-react";
import { ProductFormData } from "../types";
import { useEffect, useState } from "react";

interface StockTabProps {
  formData: ProductFormData;
  onInputChange: (field: keyof ProductFormData, value: any) => void;
  warehouses?: any[];
  taxes?: any[];
  productStatuses?: any[];
  conditions?: any[];
  warehouseStatuses?: any[];
  handleAttributeUpdate: any
}

export const StockTab: React.FC<StockTabProps> = ({
  formData,
  onInputChange,
  handleAttributeUpdate,
  warehouses = [],
  taxes = [],
  productStatuses = [],
  conditions = [],
  warehouseStatuses = [],
}) => {
  const [selectedValues, setSelectedValues] = useState({
    warehouseId: "",
    warehouseStatusId: "",
    productStatusId: "",
    conditionId: ""
  });

  const isLowStock = formData.stockQuantity <= formData.reorderLevel && formData.reorderLevel > 0;

  const firstAttribute = formData.attributes?.[0];
  
  console.log("firstAttribute", firstAttribute);
  const stock = firstAttribute?.stock;

  // Debug logs - CHECK KARO KE DATA AA RAHA HAI
  useEffect(() => {
    console.log("=".repeat(50));
    console.log("📦 STOCK TAB DEBUG:");
    console.log("📦 Stock object:", stock);
    console.log("📦 Warehouses array:", warehouses);
    console.log("📦 First warehouse:", warehouses[0]);
    console.log("📦 WarehouseStatuses array:", warehouseStatuses);
    console.log("📦 First warehouseStatus:", warehouseStatuses[0]);
    console.log("📦 ProductStatuses array:", productStatuses);
    console.log("📦 First productStatus:", productStatuses[0]);
    console.log("📦 Conditions array:", conditions);
    console.log("📦 First condition:", conditions[0]);
    console.log("=".repeat(50));
  }, [stock, warehouses, warehouseStatuses, productStatuses, conditions]);

  // Update selected values when stock changes
 useEffect(() => {
  if (!stock) return;

  setSelectedValues({
    warehouseId: String(stock?.warehouseId || ""),
    warehouseStatusId: String(stock?.warehouseStatusId || ""),
    productStatusId: String(stock?.productStatusId || ""),
    conditionId: String(stock?.conditionId || "")
  });

}, [
  stock,
  warehouses,
  warehouseStatuses,
  productStatuses,
  conditions
]);

  // Helper function to extract ID from any object
  const extractId = (item: any): string => {
    return item?._id || item?.value || item?.id || "";
  };

  // Helper function to extract label from any object
  const extractLabel = (item: any): string => {
    return (
      item?.label ||
      item?.name ||
      item?.warehouseName ||
      item?.statusName ||
      item?.conditionName ||
      item?.itemConditionName ||
      item?.wareHouseStatus ||
      item?.productStatus ||
      item?.legalBusinessName ||
      `Item ${extractId(item).substring(0, 6)}` ||
      "Unknown"
    );
  };

  const handleWarehouseChange = (value: string) => {
    console.log("🏭 Selected warehouse ID:", value);
    setSelectedValues(prev => ({ ...prev, warehouseId: value }));
    // onInputChange("attributes[0].stock.warehouseId", value);
        handleAttributeUpdate(0, "stock.warehouseId", value);

  };

  const handleWarehouseStatusChange = (value: string) => {
    console.log("📊 Selected warehouse status ID:", value);
    setSelectedValues(prev => ({ ...prev, warehouseStatusId: value }));
    // onInputChange("attributes[0].stock.warehouseStatusId", value);
        handleAttributeUpdate(0, "stock.conditionId", value);

  };

  const handleProductStatusChange = (value: string) => {
    console.log("🏷️ Selected product status ID:", value);
    setSelectedValues(prev => ({ ...prev, productStatusId: value }));
    // onInputChange("attributes[0].stock.productStatusId", value);
    handleAttributeUpdate(0, "stock.productStatusId", value);

    
  };

  const handleConditionChange = (value: string) => {
    console.log("🔧 Selected condition ID:", value);
    setSelectedValues(prev => ({ ...prev, conditionId: value }));
    handleAttributeUpdate(0, "stock.conditionId", value);
  };

  return (
    <div className="space-y-6">
      {/* Stock Section */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <Warehouse className="h-5 w-5" />
          Inventory Management
        </h4>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
            <Input
              id="stockQuantity"
              type="number"
              value={formData.stockQuantity || ""}
              onChange={(e) => onInputChange("stockQuantity", parseInt(e.target.value) || 0)}
              placeholder="0"
              className={isLowStock ? "border-orange-300" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="onHand">On Hand</Label>
            <Input
              id="onHand"
              type="number"
              value={formData.onHand || formData.stockQuantity || ""}
              onChange={(e) => onInputChange("onHand", parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="minStockLevel">Min Stock Level</Label>
            <Input
              id="minStockLevel"
              type="number"
              value={formData.minStockLevel || ""}
              onChange={(e) => onInputChange("minStockLevel", parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxStockLevel">Max Stock Level</Label>
            <Input
              id="maxStockLevel"
              type="number"
              value={formData.maxStockLevel || ""}
              onChange={(e) => onInputChange("maxStockLevel", parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reorderLevel">Reorder Point</Label>
            <Input
              id="reorderLevel"
              type="number"
              value={formData.reorderLevel || ""}
              onChange={(e) => onInputChange("reorderLevel", parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Warehouse Selection */}
          <div className="space-y-2">
            <Label htmlFor="warehouseId">Warehouse</Label>
            <Select
              key={`warehouse-${selectedValues.warehouseId}`}
              value={selectedValues.warehouseId}
              onValueChange={handleWarehouseChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses && warehouses.length > 0 ? (
                  warehouses.map((item: any) => {
                    const id = extractId(item);
                    const label = extractLabel(item);
                    return (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="no-warehouses" disabled>
                    No warehouses available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Warehouse Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="warehouseStatusId">Warehouse Status</Label>
            <Select
              key={`status-${selectedValues.warehouseStatusId}`}
              value={selectedValues.warehouseStatusId}
              onValueChange={handleWarehouseStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {warehouseStatuses && warehouseStatuses.length > 0 ? (
                  warehouseStatuses.map((item: any) => {
                    const id = extractId(item);
                    const label = extractLabel(item);
                    return (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="no-statuses" disabled>
                    No statuses available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Product Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="productStatusId">Product Status</Label>
            <Select
              key={`product-${selectedValues.productStatusId}`}
              value={selectedValues.productStatusId}
              onValueChange={handleProductStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {productStatuses && productStatuses.length > 0 ? (
                  productStatuses.map((item: any) => {
                    const id = extractId(item);
                    const label = extractLabel(item);
                    return (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="no-statuses" disabled>
                    No statuses available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Condition Selection */}
          <div className="space-y-2">
            <Label htmlFor="conditionId">Condition</Label>
            <Select
              key={`condition-${selectedValues.conditionId}`}
              value={selectedValues.conditionId}
              onValueChange={handleConditionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions && conditions.length > 0 ? (
                  conditions.map((item: any) => {
                    const id = extractId(item);
                    const label = extractLabel(item);
                    return (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="no-conditions" disabled>
                    No conditions available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stockStatus">Stock Status</Label>
          <Select
            value={formData.stockStatus || "in-stock"}
            onValueChange={(value) => onInputChange("stockStatus", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLowStock && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Stock level is at or below reorder point!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Warranty Section */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Warranty Information
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="warrantyType">Warranty Type</Label>
            <Input
              id="warrantyType"
              value={formData.warrantyType || ""}
              onChange={(e) => onInputChange("warrantyType", e.target.value)}
              placeholder="e.g., Limited Warranty"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warrantyPeriod">Warranty Period</Label>
            <Select
              value={formData.warrantyPeriod || ""}
              onValueChange={(value) => onInputChange("warrantyPeriod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30-days">30 Days</SelectItem>
                <SelectItem value="90-days">90 Days</SelectItem>
                <SelectItem value="6-months">6 Months</SelectItem>
                <SelectItem value="1-year">1 Year</SelectItem>
                <SelectItem value="2-years">2 Years</SelectItem>
                <SelectItem value="3-years">3 Years</SelectItem>
                <SelectItem value="5-years">5 Years</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};