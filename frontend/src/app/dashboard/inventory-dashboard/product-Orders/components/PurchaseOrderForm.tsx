"use client";

import { useState, useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/form/Dialog";
import { Button } from "@/components/form/CustomButton";
import { Input } from "@/components/form/Input";
import { Label } from "@/components/form/Label";
import { Textarea } from "@/components/form/Textarea";
import { IPurchaseOrder, IPurchaseOrderItem } from "../types/purchaseOrders";
import { OrderFormData, OrderItemForm } from "../types/purchaseOrders";
import {
  Plus, Trash2, Building2, Truck, Box,
  RefreshCw, AlertTriangle, CheckCircle2,
  ArrowDownToLine, Info, Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useFormActions } from "@/hooks/useFormActions";
import { SearchableCombobox, ComboboxItemConfig } from "@/components/SearchableCombobox";
import React from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

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

export interface ProductStock {
  stockQuantity: number;
  onHand: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  safetyStock?: number;
  leadTimeDays?: number;
  supplierId?: string; // ← linked supplier from product setup
}

export interface ProductAttribute {
  _id: string;
  sku: string;
  pricing: ProductPricing[];
  stock: ProductStock;
}

export interface ProductFull {
  _id: string;
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
  calculateTotals: (items: IPurchaseOrderItem[]) => { subtotal: number; tax: number; total: number };
}

// ─── Combobox config ──────────────────────────────────────────────────────────

const productConfig: ComboboxItemConfig<ProductFull> = {
  getKey: (p) => p._id,
  getLabel: (p) => p.productName,
  getSubLabel: (p) => p.sku,
  getRightSubLabel: (p) => `Stock: ${p.ui_totalStock}`,
  getRightLabel: (p) => `£${p.ui_price.toFixed(2)}`,
  getSearchFields: (p) => [p.productName, p.sku],
};

// ─── Stock health helper ──────────────────────────────────────────────────────

function getStockHealth(stock: ProductStock): {
  needsReorder: boolean;
  isCritical: boolean;
  label: string;
  color: string;
  bg: string;
} {
  const qty = stock.stockQuantity || 0;
  const reorder = stock.reorderPoint || 0;
  const min = stock.minStockLevel || 0;
  const safety = stock.safetyStock || 0;

  if (qty <= safety && safety > 0)
    return { needsReorder: true, isCritical: true, label: "Critical — below safety stock", color: "text-red-700", bg: "bg-red-100    border-red-300" };
  if (reorder > 0 && qty <= reorder)
    return { needsReorder: true, isCritical: false, label: "Reorder needed", color: "text-orange-700", bg: "bg-orange-100 border-orange-300" };
  if (min > 0 && qty <= min)
    return { needsReorder: true, isCritical: false, label: "Below minimum level", color: "text-amber-700", bg: "bg-amber-100  border-amber-300" };
  return { needsReorder: false, isCritical: false, label: "Stock OK", color: "text-green-700", bg: "bg-green-100  border-green-300" };
}

// ─── Reorder Chip (shown next to product after selection) ────────────────────

function StockChip({ stock }: { stock: ProductStock }) {
  const health = getStockHealth(stock);
  if (!health.needsReorder) return null;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${health.bg} ${health.color}`}
    >
      <AlertTriangle className="h-3 w-3" />
      {health.label}
    </motion.span>
  );
}

// ─── Reorder Mode Banner ──────────────────────────────────────────────────────

function ReorderBanner({
  supplierName,
  productName,
  stock,
}: {
  supplierName: string;
  productName?: string;
  stock?: ProductStock;
}) {
  if (!supplierName) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl"
    >
      <div className="h-8 w-8 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
        <RefreshCw className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-amber-800">
          Reorder Mode Active
        </p>
        <p className="text-xs text-amber-700 mt-0.5">
          Supplier <span className="font-semibold">{supplierName}</span> has been auto-selected
          {productName && <> for <span className="font-semibold">{productName}</span></>}.
        </p>
        {stock && (
          <div className="mt-1.5 flex flex-wrap gap-2 text-[11px]">
            <span className="px-1.5 py-0.5 bg-white border border-amber-200 rounded text-amber-700 font-medium">
              Current: {stock.stockQuantity}
            </span>
            {stock.reorderPoint && (
              <span className="px-1.5 py-0.5 bg-white border border-amber-200 rounded text-amber-700 font-medium">
                Reorder point: {stock.reorderPoint}
              </span>
            )}
            {stock.safetyStock && (
              <span className="px-1.5 py-0.5 bg-white border border-red-200 rounded text-red-700 font-medium">
                Safety stock: {stock.safetyStock}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Pricing Selector ─────────────────────────────────────────────────────────

const PricingSelector: React.FC<{
  pricingOptions: ProductPricing[];
  selectedPricingId: string;
  onSelect: (p: ProductPricing) => void;
}> = ({ pricingOptions, selectedPricingId, onSelect }) => {
  if (pricingOptions.length <= 1) return null;
  return (
    <div className="col-span-5">
      <p className="text-xs text-indigo-500 font-medium mb-1.5">
        💡 Multiple marketplace prices found — select one:
      </p>
      <div className="flex flex-wrap gap-2">
        {pricingOptions.map((p) => (
          <button
            key={p._id} type="button" onClick={() => onSelect(p)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border-2 transition-all ${selectedPricingId === p._id
              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
              : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
          >
            {p.marketplaceName}
            <span className="ml-1.5 font-bold">£{p.sellingPrice.toFixed(2)}</span>
            {p.vatExempt && <span className="ml-1 opacity-70">(VAT exempt)</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Reorder Checkbox ─────────────────────────────────────────────────────────

function ReorderCheckbox({
  checked,
  onChange,
  productsNeedingReorder,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  productsNeedingReorder: number;
}) {
  return (
    <motion.label
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer select-none transition-all ${checked
        ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-400 shadow-sm"
        : "bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50/40"
        }`}
    >
      {/* Custom checkbox */}
      <div className="relative shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${checked
          ? "bg-amber-500 border-amber-500"
          : "bg-white border-gray-300"
          }`}>
          {checked && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
              <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${checked ? "text-amber-600" : "text-gray-400"}`} />
          <span className={`text-sm font-semibold ${checked ? "text-amber-800" : "text-gray-700"}`}>
            Reorder Mode
          </span>
          {productsNeedingReorder > 0 && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full"
            >
              {productsNeedingReorder} low
            </motion.span>
          )}
        </div>
        <p className={`text-xs mt-0.5 ${checked ? "text-amber-700" : "text-gray-500"}`}>
          When enabled, selecting a product auto-fills its linked supplier
        </p>
      </div>

      {checked && (
        <Lock className="h-4 w-4 text-amber-500 shrink-0" />
      )}
    </motion.label>
  );
}

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
  const [fetchProducts, setFetchProducts] = useState(false);
  const [availablePricing, setAvailablePricing] = useState<ProductPricing[]>([]);
  const [selectedPricingId, setSelectedPricingId] = useState<string>("");

  // ── Reorder mode state ────────────────────────────────────────────────
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [selectedProductStock, setSelectedProductStock] = useState<ProductStock | null>(null);
  const [supplierLocked, setSupplierLocked] = useState(false); // true when auto-filled from product

  // ── Products (lazy) ───────────────────────────────────────────────────
  const { data: products, isLoading } = useFormActions<ProductFull>(
    "/products", "products", "Product", 1, "", fetchProducts,
  );

  console.log("Products for combobox:", products);

  // ── Count how many products need reorder (for the badge) ──────────────
  const productsNeedingReorder = useMemo(() => {
    if (!products) return 0;
    return (products as ProductFull[]).filter((p) => {
      const stock = p.attributes?.[0]?.stock;
      if (!stock) return false;
      return getStockHealth(stock).needsReorder;
    }).length;
  }, [products]);

  // ── When reorder mode toggled OFF → unlock supplier ───────────────────
  const handleReorderToggle = (val: boolean) => {
    setIsReorderMode(val);
    if (!val) {
      setSupplierLocked(false);
      setSelectedProductStock(null);
      // Optionally clear the supplier so user picks manually
      onOrderFormChange({ ...orderForm, supplier: "", orderContactEmail: "" });
    }
  };

  // ── Product input typed → clear selection ─────────────────────────────
  const handleProductInputChange = (value: string) => {
    onNewItemChange({ ...newItem, productName: value, productId: "" });
    setAvailablePricing([]);
    setSelectedPricingId("");
    setSelectedProductStock(null);
    if (isReorderMode) {
      setSupplierLocked(false);
    }
  };

  // ── Product selected ──────────────────────────────────────────────────
  // Key behaviour: if reorder mode ON, read supplierId from stock and
  // auto-fill the supplier dropdown, then lock it.
  const handleProductSelect = (product: ProductFull) => {
    const allPricing = product.attributes.flatMap((a) => a.pricing);
    const firstPricing = allPricing[0];
    const attrSku = product.attributes[0]?.sku ?? product.sku;
    const stock = product.attributes[0]?.stock ?? null;

    setAvailablePricing(allPricing);
    setSelectedPricingId(firstPricing?._id ?? "");
    setSelectedProductStock(stock);

    onNewItemChange({
      ...newItem,
      productId: product._id,
      productName: product.productName,
      sku: attrSku,
      quantity: newItem.quantity || "1",
      unitPrice: firstPricing
        ? String(firstPricing.sellingPrice)
        : String(product.ui_price),
    });

    // ── Reorder mode: auto-fill supplier from product.attributes.stock.supplierId ──
    if (isReorderMode && stock?.supplierId) {
      const linkedSupplier = suppliers.find(
        (s) => s._id === stock.supplierId ||
          s._id === (stock.supplierId as any)?.$oid  // handle MongoDB $oid wrapper
      );

      if (linkedSupplier) {
        onOrderFormChange({
          ...orderForm,
          supplier: linkedSupplier._id,
          orderContactEmail: linkedSupplier.contactInformation?.emailAddress || "",
        });
        setSupplierLocked(true);
        toast.success(
          `Supplier "${linkedSupplier.legalBusinessName || linkedSupplier.contactInformation?.primaryContactName}" auto-selected from product`,
          { icon: "🔗" }
        );
      } else {
        // Product has no linked supplier — warn and let user pick manually
        setSupplierLocked(false);
        toast.warning("This product has no linked supplier. Please select one manually.");
      }
    }
  };

  // ── Product cleared ───────────────────────────────────────────────────
  const handleProductClear = () => {
    onNewItemChange({ ...newItem, productId: "", productName: "", sku: "", unitPrice: "" });
    setAvailablePricing([]);
    setSelectedPricingId("");
    setSelectedProductStock(null);
    if (isReorderMode) {
      setSupplierLocked(false);
      onOrderFormChange({ ...orderForm, supplier: "", orderContactEmail: "" });
    }
  };

  const handlePricingSelect = (pricing: ProductPricing) => {
    setSelectedPricingId(pricing._id);
    onNewItemChange({ ...newItem, unitPrice: String(pricing.sellingPrice) });
  };

  const handleAddItem = () => {
    onAddItem();
    setAvailablePricing([]);
    setSelectedPricingId("");
    // Keep stock info so banner stays visible, reset on next product change
  };

  const handleSupplierChange = (supplierId: string) => {
    if (supplierLocked) return; // blocked when auto-filled by reorder mode
    const found = suppliers.find((s) => s._id === supplierId);
    onOrderFormChange({
      ...orderForm,
      supplier: supplierId,
      orderContactEmail: found?.contactInformation?.emailAddress || "",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await onSaveOrder();
      if (success) {
        toast.success("Purchase order created successfully");
        onCancel();
      }
    } catch (err) {
      console.error("Error saving order:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Computed totals ───────────────────────────────────────────────────
  const memoizedTotals = useMemo(() => {
    const subtotal = orderItems.reduce((acc, item) => acc + (item.unitPrice || 0) * (Number(item.quantity) || 0), 0);
    const taxAmount = subtotal * 0.20;
    return { subtotal, tax: taxAmount, total: subtotal + taxAmount };
  }, [orderItems]);

  // ── Current supplier name (for banner) ───────────────────────────────
  const currentSupplierName = useMemo(() => {
    const found = suppliers.find(s => s._id === orderForm.supplier);
    return found?.legalBusinessName
      || found?.contactInformation?.primaryContactName
      || "";
  }, [suppliers, orderForm.supplier]);

  // ─────────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {editingOrder ? "Edit Purchase Order" : "Create Purchase Order"}
          </DialogTitle>
          <DialogDescription>
            {editingOrder ? "Update purchase order details" : "Fill in the details to create a new purchase order"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">

          {/* ── Order Info ── */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg border-2 border-indigo-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Purchase Order Number</Label>
                <p className="text-xl font-bold text-gray-900 font-mono bg-white px-3 py-2 rounded border border-indigo-200">
                  {editingOrder ? editingOrder.orderNumber : orderNumber}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Order Date</Label>
                <p className="text-xl font-bold text-gray-900 bg-white px-3 py-2 rounded border border-indigo-200">
                  {editingOrder
                    ? new Date(editingOrder.orderDate).toLocaleDateString("en-GB")
                    : new Date().toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
          </div>

          {/* ── Reorder Mode Checkbox ── */}
          <ReorderCheckbox
            checked={isReorderMode}
            onChange={handleReorderToggle}
            productsNeedingReorder={productsNeedingReorder}
          />

          {/* ── Reorder active banner ── */}
          <AnimatePresence>
            {isReorderMode && supplierLocked && (
              <ReorderBanner
                supplierName={currentSupplierName}
                productName={newItem.productId ? newItem.productName : undefined}
                stock={selectedProductStock ?? undefined}
              />
            )}
          </AnimatePresence>

          {/* ── Supplier ── */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
              Supplier Information
              {supplierLocked && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full"
                >
                  <Lock className="h-3 w-3" />
                  Auto-filled from product
                </motion.span>
              )}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier Name *</Label>
                <div className="relative">
                  <select
                    id="supplier"
                    value={orderForm.supplier}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    disabled={isSaving || supplierLocked}
                    className={`w-full h-10 px-3 rounded-md border-2 transition-colors focus:outline-none ${supplierLocked
                      ? "border-amber-300 bg-amber-50 text-amber-900 cursor-not-allowed opacity-80"
                      : "border-emerald-100 hover:border-emerald-300 focus:border-emerald-400"
                      }`}
                  >
                    <option value="">Select a supplier...</option>
                    {suppliers.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.legalBusinessName || s.contactInformation?.primaryContactName}
                      </option>
                    ))}
                  </select>
                  {/* Lock icon overlay */}
                  {supplierLocked && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock className="h-4 w-4 text-amber-500" />
                    </div>
                  )}
                </div>
                {supplierLocked && (
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-xs text-amber-600 flex items-center gap-1"
                  >
                    <Info className="h-3 w-3" />
                    Locked by Reorder Mode. Clear product to change supplier.
                  </motion.p>
                )}
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
                  onChange={(e) => onOrderFormChange({ ...orderForm, expectedDelivery: e.target.value })}
                  className="border-2 border-teal-100 hover:border-teal-300 focus:border-teal-400"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={orderForm.notes}
                  onChange={(e) => onOrderFormChange({ ...orderForm, notes: e.target.value })}
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

            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-100 space-y-3">
              <div className="grid grid-cols-5 gap-3">

                {/* Product combobox */}
                <SearchableCombobox<ProductFull>
                  items={(products as ProductFull[] | undefined) ?? []}
                  inputValue={newItem.productName}
                  isSelected={!!newItem.productId}
                  onInputChange={handleProductInputChange}
                  onSelect={handleProductSelect}
                  onClear={handleProductClear}
                  onFirstOpen={() => setFetchProducts(true)}
                  config={productConfig}
                  placeholder="Search product..."
                  isLoading={isLoading}
                  disabled={isSaving}
                  colorTheme="indigo"
                  className="col-span-2"
                />

                {/* SKU */}
                <Input
                  placeholder="SKU"
                  value={newItem.sku}
                  onChange={(e) => onNewItemChange({ ...newItem, sku: e.target.value })}
                  className="h-10"
                  disabled={isSaving}
                />

                {/* Qty */}
                <Input
                  type="number"
                  placeholder="Qty"
                  value={newItem.quantity}
                  onChange={(e) => onNewItemChange({ ...newItem, quantity: e.target.value })}
                  className="h-10"
                  min="1"
                  disabled={isSaving}
                />

                {/* Price + Add */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newItem.unitPrice}
                    onChange={(e) => onNewItemChange({ ...newItem, unitPrice: e.target.value })}
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

                {/* Multi-marketplace pricing pills */}
                <PricingSelector
                  pricingOptions={availablePricing}
                  selectedPricingId={selectedPricingId}
                  onSelect={handlePricingSelect}
                />
              </div>

              {/* Stock health chip (shown after product selected) */}
              <AnimatePresence>
                {selectedProductStock && newItem.productId && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2 pt-1"
                  >
                    <span className="text-xs text-gray-500">Stock status:</span>
                    <StockChip stock={selectedProductStock} />
                    <span className="text-xs text-gray-500">
                      {selectedProductStock.stockQuantity} units on hand
                      {selectedProductStock.reorderPoint
                        ? ` · reorder at ${selectedProductStock.reorderPoint}`
                        : ""}
                    </span>
                    {isReorderMode && !supplierLocked && selectedProductStock && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        No linked supplier found for this product
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Items Table */}
            {orderItems.length > 0 ? (
              <div className="border-2 border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="text-left   p-3 text-sm font-semibold text-gray-700">Product</th>
                      <th className="text-left   p-3 text-sm font-semibold text-gray-700">SKU</th>
                      <th className="text-center p-3 text-sm font-semibold text-gray-700">Qty</th>
                      <th className="text-right  p-3 text-sm font-semibold text-gray-700">Unit Price</th>
                      <th className="text-right  p-3 text-sm font-semibold text-gray-700">Total</th>
                      <th className="text-center p-3 text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm">{item.productName}</td>
                        <td className="p-3 text-sm font-mono text-gray-600">{item.sku}</td>
                        <td className="p-3 text-sm text-center">{item.quantity}</td>
                        <td className="p-3 text-sm text-right">£{item.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-sm text-right font-semibold">£{item.totalPrice.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <Button
                            size="sm" variant="ghost" type="button"
                            onClick={() => onRemoveItem(index)}
                            className="hover:bg-red-50 hover:text-red-600"
                            disabled={isSaving}
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
                    <span className="font-semibold">£{memoizedTotals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (20%):</span>
                    <span className="font-semibold">£{memoizedTotals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg border-t-2 border-emerald-200 pt-2">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-emerald-600">£{memoizedTotals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isSaving} type="button">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            disabled={isSaving || orderItems.length === 0}
            type="button"
          >
            {isSaving ? "Saving..." : editingOrder ? "Update Order" : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};