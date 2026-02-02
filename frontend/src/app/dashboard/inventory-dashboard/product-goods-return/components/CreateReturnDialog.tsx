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
import { Card, CardContent } from "@/components/form/Card";
import { GRNForReturn, ReturningItem } from "../types/goodsReturn";
import { PackageX, Loader2 } from "lucide-react";

interface CreateReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGRN: string;
  onSelectGRN: (grnId: string) => void;
  returnedBy: string;
  onReturnedByChange: (value: string) => void;
  returnReason: string;
  onReturnReasonChange: (value: string) => void;
  returnNotes: string;
  onReturnNotesChange: (value: string) => void;
  returningItems: ReturningItem[];
  onUpdateItem: (itemId: string, field: string, value: any) => void;
  availableGRNs: GRNForReturn[];
  onCreateReturn: () => void;
  onCancel: () => void;
  isLoadingItems?: boolean;   // ← new prop: true while the full GRN is being fetched
}

export const CreateReturnDialog: React.FC<CreateReturnDialogProps> = ({
  open,
  onOpenChange,
  selectedGRN,
  onSelectGRN,
  returnedBy,
  onReturnedByChange,
  returnReason,
  onReturnReasonChange,
  returnNotes,
  onReturnNotesChange,
  returningItems,
  onUpdateItem,
  availableGRNs,
  onCreateReturn,
  onCancel,
  isLoadingItems = false,
}) => {
  const totalReturnValue = returningItems.reduce(
    (sum, item) => sum + item.returnQuantity * item.unitPrice,
    0,
  );

  const canSubmit =
    selectedGRN &&
    returnedBy.trim() !== "" &&
    returningItems.some((item) => item.returnQuantity > 0);

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
          {/* GRN Selection */}
          <div className="space-y-2">
            <Label htmlFor="grn">Select GRN to Return From *</Label>
            <Select value={selectedGRN} onValueChange={onSelectGRN}>
              <SelectTrigger className="border-2 border-[#fed7aa]">
                <SelectValue placeholder="Select a Goods Received Note..." />
              </SelectTrigger>
              <SelectContent>
                {availableGRNs.map((grn) => (
                  <SelectItem key={grn.id} value={grn.id}>
                    {grn.grnNumber} -{" "}
                    {grn.purchaseOrderId?.supplier?.contactInformation
                      ?.primaryContactName || "Unknown Supplier"}{" "}
                    ({new Date(grn.createdAt).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedGRN && (
            <>
              {/* Return Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="returnedBy">Returned By *</Label>
                  <Input
                    id="returnedBy"
                    value={returnedBy}
                    onChange={(e) => onReturnedByChange(e.target.value)}
                    placeholder="Enter name"
                    className="border-2 border-[#fed7aa]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnReason">General Return Reason</Label>
                  <Input
                    id="returnReason"
                    value={returnReason}
                    onChange={(e) => onReturnReasonChange(e.target.value)}
                    placeholder="e.g., Quality issues"
                    className="border-2 border-[#fed7aa]"
                  />
                </div>
              </div>

              {/* Items to Return */}
              <div className="space-y-2">
                <Label>Items to Return</Label>
                <div className="border-2 border-[#fed7aa] rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">

                  {/* Loading spinner — shows while fetchGRNById is running */}
                  {isLoadingItems && (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Loading items...
                    </div>
                  )}

                  {/* Empty state — shows after loading is done but no items came back */}
                  {!isLoadingItems && returningItems.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No items found for this GRN.
                    </div>
                  )}

                  {/* The actual item cards — only rendered when we have items */}
                  {!isLoadingItems &&
                    returningItems.map((item) => (
                      <div
                        key={item._id!}
                        className="bg-gray-50 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-sm text-gray-600">
                              SKU: {item.sku}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Received: {item.receivedQuantity} units
                            </p>
                          </div>
                          <Badge className="bg-indigo-100 text-indigo-700">
                            £{item.unitPrice != null ? item.unitPrice.toFixed(2) : "0.00"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Return Quantity</Label>
                            <Input
                              type="number"
                              min="0"
                              max={item.receivedQuantity}
                              value={item.returnQuantity}
                              onChange={(e) =>
                                onUpdateItem(
                                  item._id,
                                  "returnQuantity",
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="border-2 border-[#fed7aa]"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Return Reason</Label>
                            <Select
                              value={item.returnReason}
                              onValueChange={(value) =>
                                onUpdateItem(item._id, "returnReason", value)
                              }
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
                          <Label className="text-xs">Condition / Notes</Label>
                          <Textarea
                            value={item.condition}
                            onChange={(e) =>
                              onUpdateItem(item._id, "condition", e.target.value)
                            }
                            placeholder="Describe the condition or reason for return..."
                            className="border-2 border-[#fed7aa] min-h-20"
                          />
                        </div>

                        {item.returnQuantity > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded p-2 text-sm">
                            <p className="font-medium text-orange-900">
                              Return Value: £
                              {item.returnQuantity > 0 && item.unitPrice != null ? (item.returnQuantity * item.unitPrice).toFixed(2) : "0.00"}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={returnNotes}
                  onChange={(e) => onReturnNotesChange(e.target.value)}
                  placeholder="Enter any additional notes about this return..."
                  className="border-2 border-[#fed7aa] min-h-24"
                />
              </div>

              {/* Total Summary */}
              {returningItems.some((item) => item.returnQuantity > 0) && (
                <Card className="border-2 border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-700">
                          Total Return Value
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          {returningItems.filter((i) => i.returnQuantity > 0).length}{" "}
                          item(s) selected for return
                        </p>
                      </div>
                      <p className="text-3xl font-bold text-orange-900">
                        £{totalReturnValue}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onCreateReturn}
            disabled={!canSubmit || isLoadingItems}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PackageX className="h-4 w-4 mr-2" />
            Create Return Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};