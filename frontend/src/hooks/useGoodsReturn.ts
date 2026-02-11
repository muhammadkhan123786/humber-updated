"use client";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { GoodsReturnNote, GRNForReturn, ReturningItem, ReturnStats, CreateGoodsReturnDto } from "../app/dashboard/inventory-dashboard/product-goods-return/types/goodsReturn";
import {
  fetchGoodsReturns,
  createGoodsReturn,
  updateGoodsReturn,
  deleteGoodsReturn,
  exportSingleGRNToPDF
} from "../helper/goodsReturn";
import { fetchGRNs } from "../helper/goodsReceived";
import { fetchNextDocumentNumber } from "../helper/goodsReceived";

export const useGoodsReturn = () => {
  const [goodsReturnNotes, setGoodsReturnNotes] = useState<GoodsReturnNote[]>([]);
  const [availableGRNs, setAvailableGRNs] = useState<GRNForReturn[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedGRN, setSelectedGRN] = useState<string>("");
  const [returnedBy, setReturnedBy] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnNotes, setReturnNotes] = useState("");
  const [returningItems, setReturningItems] = useState<ReturningItem[]>([]);
  const [returnDate, setReturnDate] = useState<string>(
  new Date().toISOString().split("T")[0]);
  const [grtnNumber, setGRTNNumber] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
    const [isExporting, setIsExporting] = useState<string | null>(null); 
  

  // For GRNs we use a separate search/page state so that
  // typing in the main search box doesn't re-fetch the GRN dropdown list.
  const [grnPage] = useState(1);
  const [grnLimit] = useState(50); // load more at once so the dropdown is useful

  // ------------------- Load Goods Return Notes -------------------
  const loadGoodsReturns = async () => {
    try {
      const res = await fetchGoodsReturns(page, limit, searchTerm);
      setGoodsReturnNotes(res.data as any);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load goods return notes");
    }
  };

  // ------------------- Load Available GRNs (runs once on mount) -------------------
  const loadAvailableGRNs = async () => {
    try {
      const grns = await fetchGRNs(grnPage, grnLimit, "");
      // Normalise every item so we always work with `.id` internally.
      // The API returns `_id`; we map it to `id` here once so the
      // rest of the code doesn't have to guess.
      const normalised = (grns.data as any[]).map((grn) => ({
        ...grn,
        id: grn._id ?? grn.id, // prefer _id if present, fall back to id
        items: (grn.items || []).map((item: any) => ({
          ...item,
          id: item._id ?? item.id,
        })),
      }));
      setAvailableGRNs(normalised as GRNForReturn[]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load available GRNs");
    }
  };

  // Goods-return list reacts to pagination / search / status changes.
  useEffect(() => {
    loadGoodsReturns();
  }, [page, limit, searchTerm, selectedStatus]);

  // GRN dropdown is loaded once on mount only.
  useEffect(() => {
    loadAvailableGRNs();
  }, []);


  useEffect(() => {
      (async () => {
        try {
          const grnNumRes = await fetchNextDocumentNumber("GOODS_RETURN");          
          setGRTNNumber(grnNumRes.nextNumber);          
        } catch (err) {
          console.error("Failed to fetch document numbers", err);
          toast.error("Failed to fetch document numbers");
        }
      })();
    }, []);


   const handleExportReturn = async (returnNote: GoodsReturnNote) => {
  // 1. Validation check (Using _id or id based on your schema)
  const targetId = returnNote._id ;
  if (!targetId) return toast.error("Invalid Return Note ID");

  try {
    // 2. UI Feedback (Spinner and Toast)
    setIsExporting(targetId); 
    const downloadToast = toast.loading(`Generating PDF for ${returnNote.returnNumber}...`);

    // 3. The API Call
    // Make sure you create 'exportReturnToPDF' in your helper file (Step 2 below)
    const blob = await exportSingleGRNToPDF(targetId);
    
    // 4. Browser Download Logic
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Naming the file: e.g., GRTN-2026-002.pdf
    link.download = `${returnNote.returnNumber || 'Return-Note'}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    
    // 5. Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    // 6. Success Feedback
    toast.success("Return Note downloaded!", { id: downloadToast });
  } catch (error: any) {
    console.error("Export Error:", error);
    toast.error("Failed to generate PDF. Please try again.");
  } finally {
    setIsExporting(null);
  }
};
  // ------------------- Statistics -------------------
  const stats: ReturnStats = useMemo(() => ({
  totalReturns: goodsReturnNotes.length,
  pendingReturns: goodsReturnNotes.filter(g => g.status === "pending").length,
  inTransitReturns: goodsReturnNotes.filter(g => g.status === "in-transit").length,
  completedReturns: goodsReturnNotes.filter(g => g.status === "completed").length,
  totalReturnValue: goodsReturnNotes.reduce(
    (sum, g) => sum + (g.totalAmount ?? 0), 
    0
  ),
}), [goodsReturnNotes]);

  // ------------------- Filtered Returns -------------------
  const filteredReturns = useMemo(() => {
    return goodsReturnNotes.filter(grtn => {
      // const matchesSearch =
      //   grtn.returnNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   grtn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   grtn.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        !selectedStatus ||
        selectedStatus === "all" ||
        grtn.status === selectedStatus;
      return  matchesStatus;
    });
  }, [goodsReturnNotes, searchTerm, selectedStatus]);

  // ------------------- Handle GRN Selection -------------------
  // This is called from the <Select> with the value that was set on <SelectItem>,
  // which is grn.id (after normalisation above).
 // Find this function in your useGoodsReturn.ts and replace it:
const handleGRNSelection = (grnId: string) => {
  const grn = availableGRNs.find(g => g.id === grnId);

  if (!grn) {
    toast.error("Selected GRN not found. Please try again.");
    return;
  }

  setSelectedGRN(grnId);
  
  // We add 'index' here in the arguments so we can use it below
  setReturningItems(
    grn.items.map((item, index) => ({
      // FIX: Ensure _id is unique. Use database ID if it exists, 
      // otherwise combine sku and index for a guaranteed unique string.
      _id: item.id || `${item.sku}-${index}`, 
      productName: item.productName,
      sku: item.sku,
      receivedQuantity: item.acceptedQuantity ?? item.receivedQuantity ?? 0,
      returnQuantity: 0,
      returnReason: "damaged",
      condition: "",
      notes: "",
      unitPrice: item.unitPrice,
    }))
  );
};

  // ------------------- Update Returning Item -------------------
  const handleUpdateItemReturn = (itemId: string, field: string, value: any) => {
    setReturningItems(prev =>
      prev.map(item => {
        if (item._id !== itemId) return item;

        // Clamp returnQuantity so it can never exceed receivedQuantity or go below 0.
        if (field === "returnQuantity") {
          const clamped = Math.min(
            item.receivedQuantity,
            Math.max(0, typeof value === "number" ? value : parseInt(value) || 0)
          );
          return { ...item, returnQuantity: clamped };
        }

        return { ...item, [field]: value };
      })
    );
  };

  // ------------------- Create Return Note -------------------
  const handleCreateReturn = async () => {
    if (!selectedGRN) return toast.error("Please select a GRN");
    if (!returnedBy.trim()) return toast.error("Please enter who is processing the return");

    const itemsToReturn = returningItems.filter(item => item.returnQuantity > 0);
    if (itemsToReturn.length === 0)
      return toast.error("Please specify at least one item to return");

    for (const item of itemsToReturn) {
      if (item.returnQuantity > item.receivedQuantity) {
        return toast.error(
          `Return quantity for "${item.productName}" cannot exceed received quantity (${item.receivedQuantity})`
        );
      }
      if (!item.returnReason) {
        return toast.error(`Please select a return reason for "${item.productName}"`);
      }
    }

    const totalAmount = itemsToReturn.reduce(
      (sum, item) => sum + item.returnQuantity * item.unitPrice,
      0
    );

    
  const payload: Partial<CreateGoodsReturnDto> = {
  grnId: selectedGRN,
  returnedBy,
  grtnNumber,
  returnDate: new Date(returnDate),
  returnReason: returnReason || "General return",
  notes: returnNotes,

  items: itemsToReturn.map(item => ({
    returnQty: item.returnQuantity,
    totalAmount: item.returnQuantity * item.unitPrice,
    itemsNotes: item.notes,
   
  })),
};


    try {
      console.log("Creating Goods Return Note with items:", payload);
      const newReturn = await createGoodsReturn(payload);
      toast.success(`Goods Return Note created successfully`);

      // Refresh the list from the server so the new note appears.
      await loadGoodsReturns();

      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create goods return note");
    }
  };

  // ------------------- Update Return Note -------------------
  const handleUpdateReturn = async (id: string, payload: Partial<GoodsReturnNote>) => {
    try {
      // const updated = await updateGoodsReturn(id, payload);
      // toast.success(`Goods Return Note ${updated.returnNumber} updated successfully`);

      // Refresh so the UI reflects the change.
      await loadGoodsReturns();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update goods return note");
    }
  };

  // ------------------- Delete Return Note -------------------
  const handleDeleteReturn = async (id: string) => {
    try {
      await deleteGoodsReturn(id);
      // Optimistic removal is fine for delete.
      setGoodsReturnNotes(prev => prev.filter(g => g._id !== id));
      toast.success("Goods Return Note deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete goods return note");
    }
  };

  // ------------------- Reset Form -------------------
  const resetForm = () => {
    setSelectedGRN("");
    setReturnedBy("");
    setReturnReason("");
    setReturnNotes("");
    setReturningItems([]);
    setReturnDate(new Date().toISOString().split("T")[0]);
  };

  const statuses = ["all", "pending", "approved", "in-transit", "completed", "rejected"];

  return {
    goodsReturnNotes,
    filteredReturns,
    stats,
    availableGRNs,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    setViewMode,
    selectedGRN,
    returnedBy,
    setReturnedBy,
    returnReason,
    setReturnReason,
    returnNotes,
    setReturnNotes,
    returningItems,
    statuses,
    handleGRNSelection,
    handleUpdateItemReturn,
    handleCreateReturn,
    handleUpdateReturn,
    handleDeleteReturn,
    resetForm,
    page,
    setPage,
    limit,
    setLimit,
    total,
    returnDate,
    setReturnDate,
    handleExportReturn,
  };
};