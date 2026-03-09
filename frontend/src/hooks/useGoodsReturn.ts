"use client";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  GoodsReturnNote, GRNForReturn, ReturningItem,
  ReturnStats, CreateGoodsReturnDto, ReturnStatus
} from "../app/dashboard/inventory-dashboard/product-goods-return/types/goodsReturn";
import {
  fetchGoodsReturns, createGoodsReturn,
  deleteGoodsReturn, exportSingleGRNToPDF, updateGoodsReturn
} from "../helper/goodsReturn";
import { fetchGRNs } from "../helper/goodsReceived";

export const useGoodsReturn = () => {

  // ── State ──────────────────────────────────────────────────────────────
  const [goodsReturnNotes, setGoodsReturnNotes] = useState<GoodsReturnNote[]>([]);
  const [availableGRNs,    setAvailableGRNs]    = useState<GRNForReturn[]>([]);
  const [searchTerm,       setSearchTerm]        = useState("");
  const [selectedStatus,   setSelectedStatus]    = useState("");
  const [viewMode,         setViewMode]          = useState<"grid" | "table">("grid");
  const [page,             setPage]              = useState(1);
  const [limit,            setLimit]             = useState(10);
  const [total,            setTotal]             = useState(0);
  const [isExporting,      setIsExporting]       = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus]  = useState<string | null>(null);

  // Server-side stats state (accurate across all pages)
  const [serverStats, setServerStats] = useState({
    totalReturns:     0,
    pendingReturns:   0,
    inTransitReturns: 0,
    completedReturns: 0,
    totalReturnValue: 0,
  });

  // Form state
  const [selectedGRN,    setSelectedGRN]    = useState("");
  const [returnedBy,     setReturnedBy]     = useState("");
  const [returnReason,   setReturnReason]   = useState("");
  const [returnNotes,    setReturnNotes]    = useState("");
  const [returnDate,     setReturnDate]     = useState(new Date().toISOString().split("T")[0]);
  const [returningItems, setReturningItems] = useState<ReturningItem[]>([]);

  // ── Load Return Notes ──────────────────────────────────────────────────
  const loadGoodsReturns = async () => {
    try {
      const res = await fetchGoodsReturns(page, limit, searchTerm);
      setGoodsReturnNotes(res.data as any);
      setTotal(res.total);

      // ✅ Stats from ALL data — not just current page
      const allRes  = await fetchGoodsReturns(1, 9999, "");
      const allData = allRes.data as any[];

      setServerStats({
        totalReturns:     allRes.total,
        pendingReturns:   allData.filter(g => g.status === "pending").length,
        inTransitReturns: allData.filter(g => g.status === "in-transit").length,
        completedReturns: allData.filter(g => g.status === "completed").length,
        totalReturnValue: allData.reduce((sum, g) => sum + (g.totalAmount ?? 0), 0),
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to load goods return notes");
    }
  };

  // ── Load Available GRNs (FILTERED — professional rules) ───────────────
  //
  // RULE 1: Only "received" GRNs (stock was updated)
  // RULE 2: At least one item with acceptedQuantity > 0
  //         (agar sab rejected/damaged the — kuch return karne ko hai nahi)
  // RULE 3: returnableQty = acceptedQty - alreadyReturnedQty
  //         (pehle se jo return ho chuka, wo deduct karo)
  // RULE 4: returnableQty > 0 honi chahiye (fully returned GRNs hide karo)
  //
  const loadAvailableGRNs = async () => {
    try {
      // Fetch all received GRNs + all existing returns together
      const [grnRes, returnRes] = await Promise.all([
        fetchGRNs(1, 200, ""),         // ✅ 3 params only (as original)
        fetchGoodsReturns(1, 9999, ""),
      ]);

      const allReturns = returnRes.data as any[];

      // ✅ Filter received GRNs in JS (fetchGRNs doesn't support status param)
      const receivedGRNs = (grnRes.data as any[]).filter(
        grn => grn.status === "received"
      );

      // Build map: grnId → { sku → totalReturnedQty }
      // Only count returns that are NOT rejected
      const returnedQtyMap: Record<string, Record<string, number>> = {};
      for (const ret of allReturns) {
        if (ret.status === "rejected") continue;
        if (!ret.grnId) continue; // ✅ skip if grnId is null/undefined
        const grnId = typeof ret.grnId === "object" && ret.grnId !== null
          ? (ret.grnId as any)._id
          : String(ret.grnId);
        if (!grnId) continue; // ✅ skip if _id itself is missing
        if (!returnedQtyMap[grnId]) returnedQtyMap[grnId] = {};
        for (const item of ret.items) {
          const sku = item.sku;
          returnedQtyMap[grnId][sku] = (returnedQtyMap[grnId][sku] || 0) + item.returnQty;
        }
      }

      // Normalise GRNs and inject returnableQty per item
      const normalised = receivedGRNs
        .map((grn) => {
          const grnId = String(grn._id ?? grn.id);
          const grnReturnMap = returnedQtyMap[grnId] || {};

          const items = (grn.items || []).map((item: any) => {
            const accepted    = Number(item.acceptedQuantity) || 0;
            const alreadyRet  = grnReturnMap[item.sku] || 0;
            const returnableQty = Math.max(0, accepted - alreadyRet);
            return {
              ...item,
              id:           item._id ?? item.id,
              acceptedQuantity: accepted,
              returnableQty,   // ✅ NEW: how much can still be returned
            };
          });

          return { ...grn, id: grnId, items };
        })
        // ✅ RULE: Only show GRNs where at least one item can still be returned
        .filter(grn =>
          grn.items.some((item: any) => item.returnableQty > 0)
        );

      setAvailableGRNs(normalised as GRNForReturn[]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load available GRNs");
    }
  };

  useEffect(() => { loadGoodsReturns(); }, [page, limit, searchTerm, selectedStatus]);
  useEffect(() => { loadAvailableGRNs(); }, []);

  // ── Stats (from server, accurate) ─────────────────────────────────────
  const stats: ReturnStats = useMemo(() => serverStats, [serverStats]);

  // ── Filtered List ──────────────────────────────────────────────────────
  const filteredReturns = useMemo(() => {
    return goodsReturnNotes.filter(grtn => {
      const matchesStatus =
        !selectedStatus || selectedStatus === "all" || grtn.status === selectedStatus;
      return matchesStatus;
    });
  }, [goodsReturnNotes, searchTerm, selectedStatus]);

  // ── GRN Selection → Populate Items ────────────────────────────────────
  const handleGRNSelection = (grnId: string) => {
    const grn = availableGRNs.find(g => g.id === grnId);
    if (!grn) { toast.error("Selected GRN not found."); return; }

    setSelectedGRN(grnId);

    // ✅ Only show items that can still be returned (returnableQty > 0)
    const returnableItems = grn.items.filter((item: any) => (item.returnableQty ?? 0) > 0);

    if (returnableItems.length === 0) {
      toast.warning("All items in this GRN have already been fully returned.");
      return;
    }

    setReturningItems(
      returnableItems.map((item: any, index: number) => ({
        _id:              item.id || `${item.sku}-${index}`,
        productId:        item.productId,
        productName:      item.productName,
        sku:              item.sku,
        // ✅ acceptedQuantity = original stock-in
        // ✅ returnableQty    = what can still go back (accepted - already returned)
        acceptedQuantity: item.acceptedQuantity ?? 0,
        receivedQuantity: item.returnableQty ?? 0,  // used as MAX in form
        returnQuantity:   0,
        returnReason:     "damaged",
        condition:        "",
        notes:            "",
        unitPrice:        item.unitPrice ?? 0,
      }))
    );
  };

  // ── Update Single Item ─────────────────────────────────────────────────
  const handleUpdateItemReturn = (itemId: string, field: string, value: any) => {
    setReturningItems(prev =>
      prev.map(item => {
        if (item._id !== itemId) return item;
        if (field === "returnQuantity") {
          const clamped = Math.min(
            item.receivedQuantity, // receivedQuantity = returnableQty (max)
            Math.max(0, typeof value === "number" ? value : parseInt(value) || 0)
          );
          return { ...item, returnQuantity: clamped };
        }
        return { ...item, [field]: value };
      })
    );
  };

  // ── Create Return ──────────────────────────────────────────────────────
  const handleCreateReturn = async () => {
    if (!selectedGRN)       return toast.error("Please select a GRN");
    if (!returnedBy.trim()) return toast.error("Please enter who is processing the return");

    const itemsToReturn = returningItems.filter(item => item.returnQuantity > 0);
    if (itemsToReturn.length === 0)
      return toast.error("Please specify at least one item to return");

    for (const item of itemsToReturn) {
      if (item.returnQuantity > item.receivedQuantity) {
        return toast.error(`"${item.productName}" return qty exceeds returnable qty (${item.receivedQuantity})`);
      }
      if (!item.returnReason) {
        return toast.error(`Please select a return reason for "${item.productName}"`);
      }
      if (!item.productId) {
        return toast.error(`Product ID missing for "${item.productName}" — please re-select the GRN`);
      }
    }

    const payload: CreateGoodsReturnDto = {
      grnId:        selectedGRN,
      returnedBy,
      returnDate:   new Date(returnDate),
      returnReason: returnReason || "General return",
      notes:        returnNotes,
      items: itemsToReturn.map(item => ({
        productId:   item.productId,
        sku:         item.sku,
        productName: item.productName,
        returnQty:   item.returnQuantity,
        totalAmount: item.returnQuantity * item.unitPrice,
        unitPrice:   item.unitPrice,
        itemsNotes:  item.notes || item.condition,
      })),
    };

    try {
      await createGoodsReturn(payload);
      toast.success("Return Note created — awaiting manager approval");
      await loadGoodsReturns();
      await loadAvailableGRNs(); // ✅ Refresh returnable qtys
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create goods return note");
    }
  };

  // ── Status Update ──────────────────────────────────────────────────────
  // Flow: pending → approved → in-transit → completed (stock decreases)
  //       any → rejected (stock unchanged)
  const handleStatusUpdate = async (returnId: string, newStatus: ReturnStatus) => {
    const current = goodsReturnNotes.find(g => g._id === returnId);
    if (!current) return;

    const validTransitions: Record<ReturnStatus, ReturnStatus[]> = {
      "pending":    ["approved",   "rejected"],
      "approved":   ["in-transit", "rejected"],
      "in-transit": ["completed",  "rejected"],
      "completed":  [],
      "rejected":   [],
    };

    const allowed = validTransitions[current.status] || [];
    if (!allowed.includes(newStatus)) {
      toast.error(`Cannot move from "${current.status}" to "${newStatus}"`);
      return;
    }

    try {
      setIsUpdatingStatus(returnId);

      // ✅ PATCH /api/goods-returns/:id/status — not PUT update
      await updateGoodsReturn(returnId, { status: newStatus });

      setGoodsReturnNotes(prev =>
        prev.map(g => g._id === returnId ? { ...g, status: newStatus } : g)
      );

      const messages: Record<ReturnStatus, string> = {
        "approved":   "✅ Return approved — items ready to dispatch",
        "in-transit": "🚚 Items dispatched to supplier",
        "completed":  "✅ Return completed — stock reversed automatically",
        "rejected":   "❌ Return rejected — stock unchanged",
        "pending":    "Return set to pending",
      };
      toast.success(messages[newStatus]);

      // If completed — refresh available GRNs (returnableQty changed)
      if (newStatus === "completed") {
        await loadAvailableGRNs();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
      await loadGoodsReturns();
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // ── Export PDF ─────────────────────────────────────────────────────────
  const handleExportReturn = async (returnNote: GoodsReturnNote) => {
    const targetId = returnNote._id;
    if (!targetId) return toast.error("Invalid Return Note ID");
    try {
      setIsExporting(targetId);
      const loadingToast = toast.loading(`Generating PDF for ${returnNote.grtnNumber}...`);
      const blob = await exportSingleGRNToPDF(targetId);
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `${returnNote.grtnNumber || "Return-Note"}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success("Downloaded!", { id: loadingToast });
    } catch {
      toast.error("Failed to generate PDF.");
    } finally {
      setIsExporting(null);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────
  const handleDeleteReturn = async (id: string) => {
    const target = goodsReturnNotes.find(g => g._id === id);
    if (target && !["pending", "rejected"].includes(target.status)) {
      toast.error(`Cannot delete a return in "${target.status}" status`);
      return;
    }
    try {
      await deleteGoodsReturn(id);
      setGoodsReturnNotes(prev => prev.filter(g => g._id !== id));
      await loadAvailableGRNs(); // returnableQty wapas badh jayega
      toast.success("Return Note deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ── Reset Form ─────────────────────────────────────────────────────────
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
    goodsReturnNotes, filteredReturns, stats, availableGRNs, statuses,
    searchTerm, setSearchTerm, selectedStatus, setSelectedStatus,
    viewMode, setViewMode, isExporting, isUpdatingStatus,
    page, setPage, limit, setLimit, total,
    selectedGRN, returnedBy, setReturnedBy,
    returnReason, setReturnReason,
    returnNotes, setReturnNotes,
    returningItems, returnDate, setReturnDate,
    handleGRNSelection, handleUpdateItemReturn,
    handleCreateReturn, handleStatusUpdate,
    handleDeleteReturn, handleExportReturn,
    resetForm, loadGoodsReturns,
  };
};
