"use client";

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/form/Dialog";
import { Button }   from "@/components/form/CustomButton";
import { Input }    from "@/components/form/Input";
import { Label }    from "@/components/form/Label";
import { Badge }    from "@/components/form/Badge";
import { Textarea } from "@/components/form/Textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/form/Select";
import { Card, CardContent } from "@/components/form/Card";
import { GRNForReturn, ReturningItem } from "../types/goodsReturn";
import { PackageX, Loader2, Calendar, Info } from "lucide-react";

interface CreateReturnDialogProps {
  open: boolean;
  onOpenChange:         (open: boolean) => void;
  selectedGRN:          string;
  onSelectGRN:          (grnId: string) => void;
  returnedBy:           string;
  onReturnedByChange:   (value: string) => void;
  returnReason:         string;
  onReturnReasonChange: (value: string) => void;
  returnNotes:          string;
  onReturnNotesChange:  (value: string) => void;
  returningItems:       ReturningItem[];
  onUpdateItem:         (itemId: string, field: string, value: any) => void;
  availableGRNs:        GRNForReturn[];
  onCreateReturn:       () => void;
  onCancel:             () => void;
  isLoadingItems?:      boolean;
  returnDate:           string;
  onReturnDateChange:   (value: string) => void;
}

export const CreateReturnDialog: React.FC<CreateReturnDialogProps> = ({
  open, onOpenChange, selectedGRN, onSelectGRN,
  returnedBy, onReturnedByChange, returnReason, onReturnReasonChange,
  returnNotes, onReturnNotesChange, returningItems, onUpdateItem,
  availableGRNs, onCreateReturn, onCancel,
  isLoadingItems = false, returnDate, onReturnDateChange,
}) => {

  const totalReturnValue = returningItems.reduce(
    (sum, item) => sum + item.returnQuantity * item.unitPrice, 0
  );

  const canSubmit =
    selectedGRN &&
    returnedBy.trim() !== "" &&
    returnDate &&
    returningItems.some(item => item.returnQuantity > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <PackageX className="h-4 w-4 text-white" />
            </div>
            Create Goods Return Note
          </DialogTitle>
          <DialogDescription>
            Select a GRN and specify items to return to supplier
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          {/* GRN Selection ──────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label>Select GRN to Return From *</Label>
            {availableGRNs.length === 0 ? (
              // ✅ Professional empty state — tells user WHY no GRNs
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">No returnable GRNs available</p>
                  <p className="text-xs text-amber-600 mt-1">
                    GRNs appear here only when: (1) status is "received", (2) items were accepted into stock,
                    and (3) those items haven't been fully returned yet.
                  </p>
                </div>
              </div>
            ) : (
              <Select value={selectedGRN} onValueChange={onSelectGRN}>
                <SelectTrigger className="border-2 border-[#fed7aa]">
                  <SelectValue placeholder="Select a Goods Received Note..." />
                </SelectTrigger>
                <SelectContent>
                  {availableGRNs.map(grn => {
                    // ✅ Show how many items are returnable
                    const returnableCount = grn.items.filter(
                      (i: any) => (i.returnableQty ?? 0) > 0
                    ).length;
                    return (
                      <SelectItem key={grn.id} value={grn.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{grn.grnNumber}</span>
                          <span className="text-gray-500">—</span>
                          <span>{grn.purchaseOrderId?.supplier?.contactInformation?.primaryContactName || "Unknown Supplier"}</span>
                          <Badge className="bg-orange-100 text-orange-700 text-xs ml-1">
                            {returnableCount} returnable
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedGRN && (
            <>
              {/* Return Details ─────────────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="returnDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    Return Date *
                  </Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={e => onReturnDateChange(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="border-2 border-[#fed7aa] focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500">Cannot be a future date</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnedBy">Returned By *</Label>
                  <Input
                    id="returnedBy"
                    value={returnedBy}
                    onChange={e => onReturnedByChange(e.target.value)}
                    placeholder="Enter name of person processing return"
                    className="border-2 border-[#fed7aa] focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="returnReason">General Return Reason</Label>
                  <Input
                    id="returnReason"
                    value={returnReason}
                    onChange={e => onReturnReasonChange(e.target.value)}
                    placeholder="e.g., Quality issues, Wrong delivery, Excess stock"
                    className="border-2 border-[#fed7aa] focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Items ───────────────────────────────────────────────────── */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Items to Return</Label>
                  <span className="text-xs text-gray-500">
                    Max qty = accepted stock − already returned
                  </span>
                </div>

                <div className="border-2 border-[#fed7aa] rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
                  {isLoadingItems && (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Loading items...
                    </div>
                  )}

                  {!isLoadingItems && returningItems.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No returnable items found for this GRN.
                    </div>
                  )}

                  {!isLoadingItems && returningItems.map(item => (
                    <div key={item._id}
                      className="bg-gray-50 rounded-lg p-4 space-y-3 hover:bg-gray-100 transition-colors border border-gray-200">

                      {/* Item header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-500 font-mono">SKU: {item.sku}</p>
                          {/* ✅ Show returnable qty clearly */}
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-green-600 font-medium">
                              ✓ {item.acceptedQuantity ?? item.receivedQuantity} accepted into stock
                            </span>
                            <span className="text-xs text-orange-600 font-semibold">
                              ↩ {item.receivedQuantity} returnable
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-700">
                          £{item.unitPrice != null ? item.unitPrice.toFixed(2) : "0.00"} / unit
                        </Badge>
                      </div>

                      {/* Qty + Reason */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">
                            Return Quantity
                            <span className="text-gray-400 ml-1">(max: {item.receivedQuantity})</span>
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max={item.receivedQuantity}  // ✅ returnableQty is the max
                            value={item.returnQuantity}
                            onChange={e => onUpdateItem(item._id, "returnQuantity", parseInt(e.target.value) || 0)}
                            className="border-2 border-[#fed7aa] focus:border-orange-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Return Reason *</Label>
                          <Select
                            value={item.returnReason}
                            onValueChange={value => onUpdateItem(item._id, "returnReason", value)}
                          >
                            <SelectTrigger className="border-2 border-[#fed7aa]">
                              <SelectValue placeholder="Select reason..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="damaged">Damaged</SelectItem>
                              <SelectItem value="defective">Defective</SelectItem>
                              <SelectItem value="wrong-item">Wrong Item</SelectItem>
                              <SelectItem value="excess">Excess Quantity</SelectItem>
                              <SelectItem value="quality-issue">Quality Issue</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium">Notes / Condition</Label>
                        <Textarea
                          value={item.condition}
                          onChange={e => onUpdateItem(item._id, "condition", e.target.value)}
                          placeholder="Describe condition, damage, or reason..."
                          className="border-2 border-[#fed7aa] focus:border-orange-500 min-h-16"
                        />
                      </div>

                      {item.returnQuantity > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded p-2">
                          <p className="text-sm font-medium text-orange-900">
                            Return Value: £{(item.returnQuantity * item.unitPrice).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  value={returnNotes}
                  onChange={e => onReturnNotesChange(e.target.value)}
                  placeholder="Any additional notes about this return..."
                  className="border-2 border-[#fed7aa] focus:border-orange-500 min-h-20"
                />
              </div>

              {/* Total summary */}
              {returningItems.some(i => i.returnQuantity > 0) && (
                <Card className="border-2 border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Total Return Value</p>
                        <p className="text-xs text-orange-600 mt-1">
                          {returningItems.filter(i => i.returnQuantity > 0).length} item(s) selected
                          — awaiting manager approval after submit
                        </p>
                      </div>
                      <p className="text-3xl font-bold text-orange-900">
                        £{totalReturnValue.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            onClick={onCreateReturn}
            disabled={!canSubmit || isLoadingItems}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50"
          >
            <PackageX className="h-4 w-4 mr-2" />
            Create Return Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
