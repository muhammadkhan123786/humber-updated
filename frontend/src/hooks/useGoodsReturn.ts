"use client";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  GoodsReturnNote, GRNForReturn, ReturningItem,
  CreateGoodsReturnDto, ReturnStatus
} from "../app/dashboard/inventory-dashboard/product-goods-return/types/goodsReturn";
import {
  fetchGoodsReturns, createGoodsReturn,
  deleteGoodsReturn, exportSingleGRNToPDF, updateGoodsReturn
} from "../helper/goodsReturn";
import { fetchGRNs } from "../helper/goodsReceived";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ReturnStats {
  totalReturns: number;
  completed:    number;
  pending:      number;
  rejected:     number;
  totalValue:   number;
}

interface UseGoodsReturnOptions {
  supplierId?: string;
  // ─────────────────────────────────────────────────────────────────────────
  // supplierId PASS KARO   → Supplier Tab Mode
  //   - GET /goods-return-notice/by-supplier/:supplierId
  //   - Sirf is supplier ki returns dikhata hai
  //   - Stats bhi filtered hoti hain
  //
  // supplierId NAHI PASS   → Global Mode (Goods Return Notice page)
  //   - fetchGoodsReturns() use karta hai (existing helper)
  //   - Saari returns dikhata hai (pagination + search)
  // ─────────────────────────────────────────────────────────────────────────
}

export const useGoodsReturn = (options: UseGoodsReturnOptions = {}) => {
  const { supplierId } = options;
  const isSupplierMode = Boolean(supplierId);

  // ── State ──────────────────────────────────────────────────────────────
  const [goodsReturnNotes, setGoodsReturnNotes] = useState<GoodsReturnNote[]>([]);
  const [availableGRNs,    setAvailableGRNs]    = useState<GRNForReturn[]>([]);
  const [searchTerm,       setSearchTerm]        = useState("");
  const [selectedStatus,   setSelectedStatus]    = useState("");
  const [viewMode,         setViewMode]          = useState<"grid" | "table">("table");
  const [page,             setPage]              = useState(1);
  const [limit,            setLimit]             = useState(10);
  const [total,            setTotal]             = useState(0);
  const [isExporting,      setIsExporting]       = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus]  = useState<string | null>(null);

  const [serverStats, setServerStats] = useState<ReturnStats>({
    totalReturns: 0,
    pending:      0,
    completed:    0,
    rejected:     0,
    totalValue:   0,
  });

  // Form state
  const [selectedGRN,    setSelectedGRN]    = useState("");
  const [returnedBy,     setReturnedBy]     = useState("");
  const [returnReason,   setReturnReason]   = useState("");
  const [returnNotes,    setReturnNotes]    = useState("");
  const [returnDate,     setReturnDate]     = useState(new Date().toISOString().split("T")[0]);
  const [returningItems, setReturningItems] = useState<ReturningItem[]>([]);

  // ── Load Returns ───────────────────────────────────────────────────────
  const loadGoodsReturns = async () => {
    try {

      if (isSupplierMode) {
        // ╔══════════════════════════════════════════════╗
        // ║  SUPPLIER TAB MODE                          ║
        // ║  GET /goods-return-notice/by-supplier/:id   ║
        // ╚══════════════════════════════════════════════╝
        const token = localStorage.getItem("token");
        const res   = await axios.get(
          `${BASE_URL}/goods-return-notice/by-supplier/${supplierId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data: any[] = res.data?.data ?? [];
        setGoodsReturnNotes(data as GoodsReturnNote[]);
        setTotal(data.length);

        // Stats — inline calculate (no extra round-trip)
        setServerStats({
          totalReturns: data.length,
          completed:    data.filter(r => r.status === "completed").length,
          pending:      data.filter(r =>
            ["pending", "approved", "in-transit"].includes(r.status)
          ).length,
          rejected:     data.filter(r => r.status === "rejected").length,
          totalValue:   data.reduce((sum, ret) => {
            return sum + (ret.items || []).reduce((s: number, item: any) => {
              return s + (item.returnQuantity || item.returnQty || 0) * (item.unitPrice || 0);
            }, 0);
          }, 0),
        });

      } else {
        // ╔════════════════════════════════════════════════╗
        // ║  GLOBAL MODE (Goods Return Notice main page)  ║
        // ║  Uses existing fetchGoodsReturns() helper     ║
        // ╚════════════════════════════════════════════════╝
        const res = await fetchGoodsReturns(page, limit, searchTerm);
        setGoodsReturnNotes(res.data as any);
        setTotal(res.total);

        // All data for accurate stats
        const allRes  = await fetchGoodsReturns(1, 9999, "");
        const allData = allRes.data as any[];

        setServerStats({
          totalReturns: allRes.total,
          pending:      allData.filter(g =>
            ["pending", "approved", "in-transit"].includes(g.status)
          ).length,
          completed:    allData.filter(g => g.status === "completed").length,
          rejected:     allData.filter(g => g.status === "rejected").length,
          totalValue:   allData.reduce((sum, g) => sum + (g.totalAmount ?? 0), 0),
        });
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to load goods return notes");
    }
  };

  // ── Load Available GRNs ────────────────────────────────────────────────
  const loadAvailableGRNs = async () => {
    try {
      const [grnRes, returnRes] = await Promise.all([
        fetchGRNs(1, 200, ""),
        fetchGoodsReturns(1, 9999, ""),
      ]);

      const allReturns = returnRes.data as any[];

      let receivedGRNs = (grnRes.data as any[]).filter(
        grn => grn.status === "received"
      );

      // Supplier mode — sirf is supplier ke GRNs
      if (isSupplierMode) {
        receivedGRNs = receivedGRNs.filter((grn: any) => {
          const grnSupplier =
            grn?.purchaseOrderId?.supplier?._id ||
            grn?.purchaseOrderId?.supplier;
          return String(grnSupplier) === String(supplierId);
        });
      }

      // returnedQtyMap: grnId → { sku → qty }
      const returnedQtyMap: Record<string, Record<string, number>> = {};
      for (const ret of allReturns) {
        if (ret.status === "rejected") continue;
        if (!ret.grnId) continue;
        const grnId = typeof ret.grnId === "object" && ret.grnId !== null
          ? (ret.grnId as any)._id
          : String(ret.grnId);
        if (!grnId) continue;
        if (!returnedQtyMap[grnId]) returnedQtyMap[grnId] = {};
        for (const item of ret.items) {
          returnedQtyMap[grnId][item.sku] =
            (returnedQtyMap[grnId][item.sku] || 0) + item.returnQty;
        }
      }

      const normalised = receivedGRNs
        .map((grn) => {
          const grnId        = String(grn._id ?? grn.id);
          const grnReturnMap = returnedQtyMap[grnId] || {};
          const items = (grn.items || []).map((item: any) => {
            const accepted      = Number(item.acceptedQuantity) || 0;
            const alreadyRet    = grnReturnMap[item.sku] || 0;
            const returnableQty = Math.max(0, accepted - alreadyRet);
            return { ...item, id: item._id ?? item.id, acceptedQuantity: accepted, returnableQty };
          });
          return { ...grn, id: grnId, items };
        })
        .filter(grn => grn.items.some((item: any) => item.returnableQty > 0));

      setAvailableGRNs(normalised as GRNForReturn[]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load available GRNs");
    }
  };

  // ── Effects ────────────────────────────────────────────────────────────
  useEffect(() => {
    loadGoodsReturns();
  }, [page, limit, searchTerm, selectedStatus, supplierId]);

  useEffect(() => {
    loadAvailableGRNs();
  }, [supplierId]);

  // ── Stats ──────────────────────────────────────────────────────────────
  const stats: ReturnStats = useMemo(() => serverStats, [serverStats]);

  // ── Filtered List ──────────────────────────────────────────────────────
  const filteredReturns = useMemo(() => {
    return goodsReturnNotes.filter(grtn => {
      const matchesStatus =
        !selectedStatus || selectedStatus === "all" || grtn.status === selectedStatus;
      return matchesStatus;
    });
  }, [goodsReturnNotes, searchTerm, selectedStatus]);

  // ── GRN Selection ──────────────────────────────────────────────────────
  const handleGRNSelection = (grnId: string) => {
    const grn = availableGRNs.find(g => g.id === grnId);
    if (!grn) { toast.error("Selected GRN not found."); return; }
    setSelectedGRN(grnId);

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
        acceptedQuantity: item.acceptedQuantity ?? 0,
        receivedQuantity: item.returnableQty ?? 0,
        returnQuantity:   0,
        returnReason:     "damaged",
        condition:        "",
        notes:            "",
        unitPrice:        item.unitPrice ?? 0,
      }))
    );
  };

  // ── Update Item ────────────────────────────────────────────────────────
  const handleUpdateItemReturn = (itemId: string, field: string, value: any) => {
    setReturningItems(prev =>
      prev.map(item => {
        if (item._id !== itemId) return item;
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

  // ── Create Return ──────────────────────────────────────────────────────
  const handleCreateReturn = async () => {
    if (!selectedGRN)       return toast.error("Please select a GRN");
    if (!returnedBy.trim()) return toast.error("Please enter who is processing the return");

    const itemsToReturn = returningItems.filter(item => item.returnQuantity > 0);
    if (itemsToReturn.length === 0)
      return toast.error("Please specify at least one item to return");

    for (const item of itemsToReturn) {
      if (item.returnQuantity > item.receivedQuantity)
        return toast.error(`"${item.productName}" return qty exceeds returnable qty (${item.receivedQuantity})`);
      if (!item.returnReason)
        return toast.error(`Please select a return reason for "${item.productName}"`);
      if (!item.productId)
        return toast.error(`Product ID missing for "${item.productName}" — please re-select the GRN`);
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
      await loadAvailableGRNs();
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create goods return note");
    }
  };

  // ── Status Update ──────────────────────────────────────────────────────
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

    if (!validTransitions[current.status]?.includes(newStatus)) {
      toast.error(`Cannot move from "${current.status}" to "${newStatus}"`);
      return;
    }

    try {
      setIsUpdatingStatus(returnId);
      await updateGoodsReturn(returnId, { status: newStatus });

      // ✅ Optimistic UI — turant reflect karo, server ka wait mat karo
      setGoodsReturnNotes(prev =>
        prev.map(g => g._id === returnId ? { ...g, status: newStatus } : g)
      );

      // ✅ Stats bhi optimistically update karo
      setServerStats(prev => {
        const updated = { ...prev };
        const oldStatus = current.status;

        // Old status se ghatao
        if (["pending", "approved", "in-transit"].includes(oldStatus)) updated.pending   = Math.max(0, prev.pending   - 1);
        if (oldStatus === "completed")                                   updated.completed = Math.max(0, prev.completed - 1);
        if (oldStatus === "rejected")                                    updated.rejected  = Math.max(0, prev.rejected  - 1);

        // New status mein jodao
        if (["pending", "approved", "in-transit"].includes(newStatus)) updated.pending    = prev.pending   + 1;
        if (newStatus === "completed")                                  updated.completed  = prev.completed + 1;
        if (newStatus === "rejected")                                   updated.rejected   = prev.rejected  + 1;

        return updated;
      });
      const messages: Record<ReturnStatus, string> = {
        "approved":   "✅ Return approved — items ready to dispatch",
        "in-transit": "🚚 Items dispatched to supplier",
        "completed":  "✅ Return completed — stock reversed automatically",
        "rejected":   "❌ Return rejected — stock unchanged",
        "pending":    "Return set to pending",
      };
      toast.success(messages[newStatus]);
      // ✅ Refresh from server — accurate stats + latest data
      await loadGoodsReturns();
      if (newStatus === "completed") await loadAvailableGRNs();
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
      await loadAvailableGRNs();
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
    isSupplierMode,
  };
};