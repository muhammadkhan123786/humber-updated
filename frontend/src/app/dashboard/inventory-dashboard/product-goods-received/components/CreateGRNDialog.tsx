"use client";

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
import { Badge } from "@/components/form/Badge";
import { Textarea } from "@/components/form/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";
import {
  PurchaseOrder,
  GoodsReceivedNoteItem,
  NewProductForm,
} from "../types/goodsReceived";
import { Plus, CheckCircle2, Package } from "lucide-react";
import { useState } from "react";
import { SearchableCombobox, ComboboxItemConfig } from "@/components/SearchableCombobox";

// ─── Combobox config for PurchaseOrder ───────────────────────────────────────

const poConfig: ComboboxItemConfig<PurchaseOrder> = {
  getKey:          (po) => po._id,
  getLabel:        (po) => po.orderNumber,
  getSubLabel:     (po) => po.supplier?.contactInformation?.primaryContactName ?? "Unknown supplier",
  getRightSubLabel:(po) => `${po.items.length} item${po.items.length !== 1 ? "s" : ""}`,
  getRightLabel:   (po) => po.status,
  getSearchFields: (po) => [
    po.orderNumber,
    po.supplier?.contactInformation?.primaryContactName ?? "",
  ],
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateGRNDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPO: string;
  onSelectPO: (poId: string) => void;
  receivedBy: string;
  onReceivedByChange: (value: string) => void;
  grnNotes: string;
  onGRNNotesChange: (value: string) => void;
  receivingItems: GoodsReceivedNoteItem[];
  onUpdateItem: (itemId: string, field: string, value: any) => void;
  newProduct: NewProductForm;
  onNewProductChange: (data: NewProductForm) => void;
  onAddManualProduct: () => void;
  availablePOs: PurchaseOrder[];
  onCreateGRN: () => void;
  onCancel: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CreateGRNDialog: React.FC<CreateGRNDialogProps> = ({
  open,
  onOpenChange,
  selectedPO,
  onSelectPO,
  receivedBy,
  onReceivedByChange,
  grnNotes,
  onGRNNotesChange,
  receivingItems,
  onUpdateItem,
  newProduct,
  onNewProductChange,
  onAddManualProduct,
  availablePOs,
  onCreateGRN,
  onCancel,
}) => {
  // The combobox needs an inputValue string — we derive it from the selected PO
  const [poSearch, setPOSearch] = useState("");

  const selectedPOObj = availablePOs.find((po) => po._id === selectedPO) ?? null;

  const handlePOSelect = (po: PurchaseOrder) => {
    onSelectPO(po._id);
    setPOSearch(po.orderNumber); // show the selected PO's number in the input
  };

  const handlePOClear = () => {
    onSelectPO("");
    setPOSearch("");
  };

  const handlePOInputChange = (value: string) => {
    // If user types after a selection, treat it as a new search (clear selection)
    if (selectedPO) onSelectPO("");
    setPOSearch(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Create Goods Received Note
          </DialogTitle>
          <DialogDescription>
            Record items received against a purchase order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* ── PO selector + Received By ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="po">Select Purchase Order *</Label>

              {/* ── SearchableCombobox for PO selection ── */}
              <SearchableCombobox<PurchaseOrder>
                items={availablePOs}
                inputValue={selectedPOObj ? selectedPOObj.orderNumber : poSearch}
                isSelected={!!selectedPO}
                onInputChange={handlePOInputChange}
                onSelect={handlePOSelect}
                onClear={handlePOClear}
                config={poConfig}
                placeholder="Search by PO number or supplier..."
                colorTheme="blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receivedBy">Received By *</Label>
              <Input
                id="receivedBy"
                value={receivedBy}
                onChange={(e) => onReceivedByChange(e.target.value)}
                placeholder="Enter receiver name"
                className="border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400"
              />
            </div>
          </div>

          {/* ── Items Table ── */}
          {receivingItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Receiving Items
              </h3>
              <div className="border-2 border-blue-100 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <th className="text-left p-3 font-semibold text-gray-700 text-sm">Product</th>
                      <th className="text-left p-3 font-semibold text-gray-700 text-sm">SKU</th>
                      <th className="text-center p-3 font-semibold text-gray-700 text-sm">Ordered</th>
                      <th className="text-center p-3 font-semibold text-gray-700 text-sm">Received</th>
                      <th className="text-center p-3 font-semibold text-gray-700 text-sm">Accepted</th>
                      <th className="text-center p-3 font-semibold text-gray-700 text-sm">Rejected</th>
                      <th className="text-center p-3 font-semibold text-gray-700 text-sm">Damaged</th>
                      <th className="text-left p-3 font-semibold text-gray-700 text-sm">Condition</th>
                      <th className="text-left p-3 font-semibold text-gray-700 text-sm">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivingItems.map((item, index) => {
                      const productName = item.productId?.productName ?? item.productName ?? "—";
                      const sku         = item.productId?.sku         ?? item.sku         ?? "—";

                      return (
                        <tr key={item.purchaseOrderItemId || index} className="border-t border-gray-100">
                          <td className="p-3">
                            <p className="font-medium text-sm">{productName}</p>
                          </td>
                          <td className="p-3">
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{sku}</span>
                          </td>
                          <td className="p-3 text-center">
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                              {item.orderedQuantity}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Input
                              type="number" min="0"
                              value={item.receivedQuantity}
                              onChange={(e) => onUpdateItem(item.purchaseOrderItemId, "receivedQuantity", Number(e.target.value))}
                              className="w-20 text-center border-2 border-blue-100"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              {item.acceptedQuantity}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Input
                              type="number" min="0" max={item.receivedQuantity}
                              value={item.rejectedQuantity}
                              onChange={(e) => onUpdateItem(item.purchaseOrderItemId, "rejectedQuantity", Number(e.target.value))}
                              className="w-20 text-center border-2 border-red-100"
                            />
                          </td>
                          <td className="p-3">
                            <Input
                              type="number" min="0" max={item.receivedQuantity}
                              value={item.damageQuantity}
                              onChange={(e) => onUpdateItem(item.purchaseOrderItemId, "damageQuantity", Number(e.target.value))}
                              className="w-20 text-center border-2 border-orange-100"
                            />
                          </td>
                          <td className="p-3">
                            <Select
                              value={item.condition}
                              onValueChange={(value) => onUpdateItem(item.purchaseOrderItemId, "condition", value)}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                                <SelectItem value="defective">Defective</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Input
                              value={item.notes}
                              onChange={(e) => onUpdateItem(item.purchaseOrderItemId, "notes", e.target.value)}
                              placeholder="Optional notes..."
                              className="w-40 text-xs border-2 border-gray-100"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Add Manual Product ── */}
          <div className="space-y-2">
            <Label>Add Manual Product</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Part Name</Label>
                <Input
                  id="productName"
                  value={newProduct?.productName}
                  onChange={(e) => onNewProductChange({ ...newProduct, productName: e.target.value })}
                  placeholder="Enter part name"
                  className="border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={newProduct?.sku}
                  onChange={(e) => onNewProductChange({ ...newProduct, sku: e.target.value })}
                  placeholder="Enter SKU"
                  className="border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderedQuantity">Ordered Quantity</Label>
                <Input
                  id="orderedQuantity"
                  type="number"
                  value={newProduct?.orderedQuantity}
                  onChange={(e) => onNewProductChange({ ...newProduct, orderedQuantity: Number(e.target.value) })}
                  placeholder="Enter ordered quantity"
                  className="border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receivedQuantity">Received Quantity</Label>
                <Input
                  id="receivedQuantity"
                  type="number"
                  value={newProduct?.receivedQuantity}
                  onChange={(e) => onNewProductChange({ ...newProduct, receivedQuantity: Number(e.target.value) })}
                  placeholder="Enter received quantity"
                  className="border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={newProduct?.unitPrice}
                  onChange={(e) => onNewProductChange({ ...newProduct, unitPrice: Number(e.target.value) })}
                  placeholder="Enter unit price"
                  className="border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={onAddManualProduct}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </div>

          {/* ── GRN Notes ── */}
          <div className="space-y-2">
            <Label htmlFor="grnNotes">GRN Notes</Label>
            <Textarea
              id="grnNotes"
              value={grnNotes}
              onChange={(e) => onGRNNotesChange(e.target.value)}
              placeholder="Add any notes about this delivery..."
              className="border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            onClick={onCreateGRN}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Create GRN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};