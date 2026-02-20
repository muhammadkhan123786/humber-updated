"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/form/Dialog";
import { Button } from "@/components/form/CustomButton";
import { Input } from "@/components/form/Input";
import { Label } from "@/components/form/Label";
import { Textarea } from "@/components/form/Textarea";
import { IPurchaseOrder, IPurchaseOrderItem } from "../types/purchaseOrders";
import { OrderFormData, OrderItemForm } from "../types/purchaseOrders";
import { Plus, Trash2, Building2, Truck, Box, X } from "lucide-react";
import { toast } from "sonner";
import { useFormActions } from "@/hooks/useFormActions";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Supplier {
  _id: string;
  legalBusinessName: string;
  contactInformation: {
    primaryContactName?: string;
    emailAddress: string;
  };
}

export interface ProductPricing {
  _id: string;
  marketplaceName: string;
  costPrice: number;
  sellingPrice: number;
  retailPrice: number;
  discountPercentage: number;
  taxRate: number;
  vatExempt: boolean;
}

export interface ProductAttribute {
  _id: string;
  sku: string;
  pricing: ProductPricing[];
  stock: {
    stockQuantity: number;
    onHand: number;
  };
}

export interface ProductFull {
  _id: string;           // ← this is what gets stored as productId in the DB
  productName: string;
  sku: string;
  attributes: ProductAttribute[];
  ui_price: number;
  ui_totalStock: number;
}

interface PurchaseOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingOrder: IPurchaseOrder | null;
  orderForm: OrderFormData;
  onOrderFormChange: (data: OrderFormData) => void;
  orderItems: IPurchaseOrderItem[];
  newItem: OrderItemForm;
  onNewItemChange: (data: OrderItemForm) => void;
  suppliers: Supplier[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSaveOrder: () => Promise<boolean>;
  onCancel: () => void;
  orderNumber: string;
  calculateTotals: (items: IPurchaseOrderItem[]) => {
    subtotal: number;
    tax: number;
    total: number;
  };
}

// ─── Pricing Selector ────────────────────────────────────────────────────────

interface PricingSelectorProps {
  pricingOptions: ProductPricing[];
  selectedPricingId: string;
  onSelect: (pricing: ProductPricing) => void;
}

const PricingSelector: React.FC<PricingSelectorProps> = ({
  pricingOptions,
  selectedPricingId,
  onSelect,
}) => {
  if (pricingOptions.length <= 1) return null;

  return (
    <div className="col-span-5">
      <p className="text-xs text-indigo-500 font-medium mb-1.5">
        💡 Multiple marketplace prices found — select one:
      </p>
      <div className="flex flex-wrap gap-2">
        {pricingOptions.map((p) => (
          <button
            key={p._id}
            type="button"
            onClick={() => onSelect(p)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border-2 transition-all ${
              selectedPricingId === p._id
                ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {p.marketplaceName}
            <span className="ml-1.5 font-bold">£{p.sellingPrice.toFixed(2)}</span>
            {p.vatExempt && (
              <span className="ml-1 opacity-70">(VAT exempt)</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Main Form ────────────────────────────────────────────────────────────────

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  open,
  onOpenChange,
  editingOrder,
  orderForm,
  onOrderFormChange,
  orderItems,
  newItem,
  onNewItemChange,
  suppliers,
  onAddItem,
  onRemoveItem,
  onSaveOrder,
  onCancel,
  calculateTotals,
  orderNumber,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  // API is only called after user first clicks the product input
  const [fetchProducts, setFetchProducts] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pricing state for the currently selected product
  const [availablePricing, setAvailablePricing] = useState<ProductPricing[]>([]);
  const [selectedPricingId, setSelectedPricingId] = useState<string>("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Lazy fetch — only fires once, when the user first clicks the input ────
  const { data: products, isLoading } = useFormActions<ProductFull>(
    "/products",
    "products",
    "Product",
    1,
    "",
    fetchProducts,
  );

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // ── Filter list as user types ─────────────────────────────────────────────
  const filtered = ((products as ProductFull[] | undefined) ?? []).filter((p) => {
    const q = (newItem.productName ?? "").toLowerCase();
    return (
      p.productName.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  // ── Typing in the combobox ────────────────────────────────────────────────
  const handleInputChange = (value: string) => {
    // If user edits the text manually after a product was selected,
    // clear the productId so validation catches an incomplete selection
    onNewItemChange({ ...newItem, productName: value, productId: "" });
    setIsDropdownOpen(true);
    if (availablePricing.length > 0) {
      setAvailablePricing([]);
      setSelectedPricingId("");
    }
  };

  // ── First focus/click: trigger the one-time API call ─────────────────────
  const handleInputFocus = useCallback(() => {
    if (!fetchProducts) setFetchProducts(true);
    setIsDropdownOpen(true);
  }, [fetchProducts]);

  // ── User picks a product ──────────────────────────────────────────────────
  const handleProductSelect = (product: ProductFull) => {
    const allPricing = product.attributes.flatMap((a) => a.pricing);
    const firstPricing = allPricing[0];
    const attrSku = product.attributes[0]?.sku ?? product.sku;

    setAvailablePricing(allPricing);
    setSelectedPricingId(firstPricing?._id ?? "");

    // ↓ productId = product._id  — this is what gets saved to MongoDB
    onNewItemChange({
      ...newItem,
      productId: product._id,          // ← THE KEY CHANGE: store the DB id
      productName: product.productName, // display only
      sku: attrSku,                     // display only
      quantity: newItem.quantity || "1",
      unitPrice: firstPricing
        ? String(firstPricing.sellingPrice)
        : String(product.ui_price),
    });

    setIsDropdownOpen(false);
  };

  // ── User picks a different marketplace price ──────────────────────────────
  const handlePricingSelect = (pricing: ProductPricing) => {
    setSelectedPricingId(pricing._id);
    onNewItemChange({ ...newItem, unitPrice: String(pricing.sellingPrice) });
  };

  // ── Clear product field ───────────────────────────────────────────────────
  const handleClearProduct = () => {
    onNewItemChange({
      ...newItem,
      productId: "",     // ← clear the id too
      productName: "",
      sku: "",
      unitPrice: "",
    });
    setAvailablePricing([]);
    setSelectedPricingId("");
    inputRef.current?.focus();
  };

  // ── Add item, reset pricing UI ────────────────────────────────────────────
  const handleAddItem = () => {
    onAddItem();
    setAvailablePricing([]);
    setSelectedPricingId("");
  };

  const handleSupplierChange = (supplierId: string) => {
    const selectedSupplier = suppliers.find((s) => s._id === supplierId);
    onOrderFormChange({
      ...orderForm,
      supplier: supplierId,
      orderContactEmail:
        selectedSupplier?.contactInformation?.emailAddress || "",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await onSaveOrder();
      toast.success("Order is created successfully");
      onCancel();
      if (!success) console.error("Save failed");
    } catch (err) {
      console.error("Error saving order:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {editingOrder ? "Edit Purchase Order" : "Create Purchase Order"}
          </DialogTitle>
          <DialogDescription>
            {editingOrder
              ? "Update purchase order details"
              : "Fill in the details to create a new purchase order"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* ── Order Info ── */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg border-2 border-indigo-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  Purchase Order Number
                </Label>
                <p className="text-xl font-bold text-gray-900 font-mono bg-white px-3 py-2 rounded border border-indigo-200">
                  {editingOrder ? editingOrder.orderNumber : orderNumber}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  Order Date
                </Label>
                <p className="text-xl font-bold text-gray-900 bg-white px-3 py-2 rounded border border-indigo-200">
                  {editingOrder
                    ? new Date(editingOrder.orderDate).toLocaleDateString("en-GB")
                    : new Date().toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
          </div>

          {/* ── Supplier ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
              Supplier Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier Name *</Label>
                <select
                  id="supplier"
                  value={orderForm.supplier}
                  onChange={(e) => handleSupplierChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border-2 border-emerald-100 hover:border-emerald-300 focus:border-emerald-400 focus:outline-none transition-colors"
                  disabled={isSaving}
                >
                  <option value="">Select a supplier...</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier?.contactInformation?.primaryContactName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderContactEmail">Contact Email *</Label>
                <Input
                  id="orderContactEmail"
                  type="email"
                  value={orderForm.orderContactEmail || ""}
                  placeholder="supplier@email.com"
                  disabled
                  className="border-2 border-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* ── Delivery ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Truck className="h-5 w-5 text-teal-600" />
              Delivery Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedDelivery">Expected Delivery Date *</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={orderForm.expectedDelivery}
                  onChange={(e) =>
                    onOrderFormChange({
                      ...orderForm,
                      expectedDelivery: e.target.value,
                    })
                  }
                  className="border-2 border-teal-100 hover:border-teal-300 focus:border-teal-400"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={orderForm.notes}
                  onChange={(e) =>
                    onOrderFormChange({ ...orderForm, notes: e.target.value })
                  }
                  placeholder="Additional notes..."
                  className="border-2 border-teal-100 hover:border-teal-300 focus:border-teal-400"
                  rows={3}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {/* ── Order Items ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Box className="h-5 w-5 text-indigo-600" />
              Order Items
            </h3>

            {/* Add Item Row */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-100">
              <div className="grid grid-cols-5 gap-3">

                {/* ── Combobox ── */}
                <div className="col-span-2 relative" ref={wrapperRef}>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search product..."
                      value={newItem.productName}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onFocus={handleInputFocus}
                      onClick={handleInputFocus}
                      disabled={isSaving}
                      autoComplete="off"
                      className="w-full h-10 px-3 pr-8 rounded-md border-2 border-gray-200
                                 hover:border-indigo-300 focus:border-indigo-400 focus:outline-none
                                 transition-colors text-sm bg-white placeholder:text-gray-400
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {newItem.productName && (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={handleClearProduct}
                        className="absolute right-2 top-1/2 -translate-y-1/2
                                   text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <ul
                      className="absolute z-50 top-full mt-1 w-full bg-white
                                 border-2 border-indigo-100 rounded-lg shadow-xl
                                 max-h-52 overflow-y-auto divide-y divide-gray-50"
                    >
                      {isLoading ? (
                        <li className="px-3 py-3 text-sm text-gray-400 text-center">
                          Loading products…
                        </li>
                      ) : filtered.length === 0 ? (
                        <li className="px-3 py-3 text-sm text-gray-400 text-center">
                          No products found.
                        </li>
                      ) : (
                        filtered.map((product) => (
                          <li
                            key={product._id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleProductSelect(product)}
                            className="flex items-center justify-between px-3 py-2.5
                                       cursor-pointer hover:bg-indigo-50 transition-colors
                                       text-sm group"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate group-hover:text-indigo-700">
                                {product.productName}
                              </p>
                              <p className="text-xs text-gray-400 font-mono">
                                {product.sku}
                              </p>
                            </div>
                            <div className="text-right text-xs text-gray-500 shrink-0 ml-3">
                              <p>Stock: {product.ui_totalStock}</p>
                              <p className="text-indigo-600 font-semibold">
                                £{product.ui_price.toFixed(2)}
                              </p>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>

                {/* SKU (auto-filled, display only) */}
                <div>
                  <Input
                    placeholder="SKU"
                    value={newItem.sku}
                    onChange={(e) =>
                      onNewItemChange({ ...newItem, sku: e.target.value })
                    }
                    className="h-10"
                    disabled={isSaving}
                  />
                </div>

                {/* Qty */}
                <div>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) =>
                      onNewItemChange({ ...newItem, quantity: e.target.value })
                    }
                    className="h-10"
                    min="1"
                    disabled={isSaving}
                  />
                </div>

                {/* Price + Add */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newItem.unitPrice}
                    onChange={(e) =>
                      onNewItemChange({ ...newItem, unitPrice: e.target.value })
                    }
                    className="h-10"
                    min="0"
                    disabled={isSaving}
                  />
                  <Button
                    onClick={handleAddItem}
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    disabled={isSaving}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Multi-pricing pills */}
                <PricingSelector
                  pricingOptions={availablePricing}
                  selectedPricingId={selectedPricingId}
                  onSelect={handlePricingSelect}
                />
              </div>
            </div>

            {/* Items Table */}
            {orderItems.length > 0 ? (
              <div className="border-2 border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">
                        SKU
                      </th>
                      <th className="text-center p-3 text-sm font-semibold text-gray-700">
                        Qty
                      </th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">
                        Unit Price
                      </th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">
                        Total
                      </th>
                      <th className="text-center p-3 text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="p-3 text-sm">{item.productName}</td>
                        <td className="p-3 text-sm font-mono text-gray-600">
                          {item.sku}
                        </td>
                        <td className="p-3 text-sm text-center">
                          {item.quantity}
                        </td>
                        <td className="p-3 text-sm text-right">
                          £{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="p-3 text-sm text-right font-semibold">
                          £{item.totalPrice.toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveItem(index)}
                            className="hover:bg-red-50 hover:text-red-600"
                            disabled={isSaving}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                No items added yet. Add items using the form above.
              </div>
            )}

            {/* Totals */}
            {orderItems.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border-2 border-emerald-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">
                      £{calculateTotals(orderItems).subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (20%):</span>
                    <span className="font-semibold">
                      £{calculateTotals(orderItems).tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg border-t-2 border-emerald-200 pt-2">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-emerald-600">
                      £{calculateTotals(orderItems).total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            disabled={isSaving || orderItems.length === 0}
            type="button"
          >
            {isSaving
              ? "Saving..."
              : editingOrder
                ? "Update Order"
                : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};