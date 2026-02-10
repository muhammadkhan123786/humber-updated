import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  GoodsReceivedNote,
  PurchaseOrder,
  GRNStats,
  NewProductForm,
  GoodsReceivedNoteItem as GRNItem
} from "@/app/dashboard/inventory-dashboard/product-goods-received/types/goodsReceived";

import {
  fetchGRNs,
  createGRN,
  deleteGRN,
  fetchNextDocumentNumber,
  exportSingleGRNToPDF,
} from "../helper/goodsReceived";

import { fetchOrders } from "../helper/purchaseOrderApi";

export interface GoodsReceivedNoteItem extends GRNItem {
  id?: string;
}

export const useGoodsReceived = () => {
  /* =========================================================
   * SERVER STATE
   * ======================================================= */
  const [grns, setGrns] = useState<GoodsReceivedNote[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [grnNumber, setGRNNumber] = useState("");
  const [grnReference, setGRNReference] = useState("");
  const [isExporting, setIsExporting] = useState<string | null>(null); 

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  /* =========================================================
   * FILTER STATE
   * ======================================================= */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  /* =========================================================
   * FORM STATE
   * ======================================================= */
  const [selectedPO, setSelectedPO] = useState<string>("");
  const [receivedBy, setReceivedBy] = useState("");
  const [grnNotes, setGRNNotes] = useState("");
  const [receivingItems, setReceivingItems] = useState<GoodsReceivedNoteItem[]>([]);

  const [newProduct, setNewProduct] = useState<NewProductForm>({
    purchaseOrderItemId: "",
    productName: "",
    sku: "",
    status: "received",
    orderedQuantity: 0,
    receivedQuantity: 0,
    unitPrice: 0,
  });

  /* =========================================================
   * FETCH DATA
   * ======================================================= */
  const loadGRNs = async () => {
    try {
      setLoading(true);

      const [grnRes, poRes] = await Promise.all([
       fetchGRNs(page, 10, searchTerm, selectedStatus),
        fetchOrders(),
      ]);

      setGrns(grnRes.data);
      setTotal(grnRes.total);
       setPurchaseOrders(poRes.data as unknown as PurchaseOrder[]);
    } catch (error) {
      console.error("Failed to load GRNs:", error);
      toast.error("Failed to load Goods Received Notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGRNs();
  }, [page, searchTerm, selectedStatus]);

  useEffect(() => {
    (async () => {
      try {
        const grnNumRes = await fetchNextDocumentNumber("GRN");
        const grnRefRes = await fetchNextDocumentNumber("GRN_REFERENCE");
        setGRNNumber(grnNumRes.nextNumber);
        setGRNReference(grnRefRes.nextNumber);
      } catch (err) {
        console.error("Failed to fetch document numbers", err);
        toast.error("Failed to fetch document numbers");
      }
    })();
  }, []);

  /* =========================================================
   * STATS (DASHBOARD)
   * ======================================================= */
 const stats: GRNStats = useMemo(() => {
  return {
    // 1. Total GRNs (The total count from your state/API)
    totalGRNs: total,

    completedGRNs: grns.filter((g) => g.status === "received").length,

   totalItemsReceived: grns.reduce((sum, grn) => {
  const grnTotal = grn.items?.reduce((iSum, item) => {
    const qty = Number(item.receivedQuantity) || 0;   
    return Number(iSum + qty);
  }, 0) || 0;
  return sum + grnTotal;
}, 0),



    // 4. With Discrepancies
    // Logic: A GRN has a discrepancy if any item's received qty != ordered qty
    discrepancyGRNs: grns.filter((grn) => 
      grn.items?.some((item) => item.receivedQuantity !== item.orderedQuantity)
    ).length,
  };
}, [grns, total]);


  /* =========================================================
   * AVAILABLE PURCHASE ORDERS
   * ======================================================= */
 const availablePOs = useMemo(() => {
  return purchaseOrders.filter(po => {
    const status = po.status?.toLowerCase().trim();    
    return ["received", "ordered"].includes(status);
  });
}, [purchaseOrders]);

  /* =========================================================
   * HANDLE PO SELECTION
   * ======================================================= */
  const handleSelectPO = (poId: string) => {
    setSelectedPO(poId);
    const po = purchaseOrders.find((p) => p._id === poId);
    
    if (!po) return;

    // Build receiving items from PO items
    const items: GoodsReceivedNoteItem[] = po.items.map((item) => ({
      purchaseOrderItemId: item._id,
      productName: item.productName,
      sku: item.sku,
      orderedQuantity: item.quantity,
      receivedQuantity: 0,
      acceptedQuantity: 0,
      rejectedQuantity: 0,
      damageQuantity: 0,
      condition: "good" as const,
      notes: "",
      unitPrice: item.unitPrice,
    }));

    setReceivingItems(items);
  };

  

  /* =========================================================
   * UPDATE RECEIVING ITEM
   * ======================================================= */
  const handleUpdateItem = (
    purchaseOrderItemId: string,
    field: keyof GoodsReceivedNoteItem,
    value: any,
  ) => {
    setReceivingItems((items) =>
      items.map((item) => {
        if (item.purchaseOrderItemId !== purchaseOrderItemId) return item;

        const updated = { ...item, [field]: value };

        const received = Number(updated.receivedQuantity) || 0;
        const rejected = Number(updated.rejectedQuantity) || 0;
        const damaged = Number(updated.damageQuantity) || 0;

        updated.acceptedQuantity = Math.max(0, received - rejected - damaged);

        return updated;
      }),
    );
  };

  /* =========================================================
   * CREATE GRN
   * ======================================================= */
  const handleCreateGRN = async () => {
    if (!selectedPO || !receivedBy) {
      toast.error("Purchase order and receiver are required");
      return;
    }

    // Filter out items with zero received quantity
    const validItems = receivingItems.filter((i) => i.receivedQuantity > 0);
    
    if (validItems.length === 0) {
      toast.error("At least one item must have received quantity greater than 0");
      return;
    }

    const payload: Partial<GoodsReceivedNote> = {
      purchaseOrderId: selectedPO,
      grnNumber,
      receivedBy,
      notes: grnNotes,
      items: validItems,
      status: newProduct.status
    };

    try {
      setLoading(true);
      await createGRN(payload);
      toast.success("Goods Received Note created");
      resetForm();
      loadGRNs(); // Refresh the list
    } catch (error) {
      console.error("Failed to create GRN:", error);
      toast.error("Failed to create GRN");
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualProduct = () => {
    if (!newProduct.productName || !newProduct.sku || newProduct.orderedQuantity <= 0 || newProduct.receivedQuantity <= 0 || newProduct.unitPrice <= 0) {
      toast.error('Please fill in all product fields with valid values');
      return;
    }

    const manualItem: GoodsReceivedNoteItem = {
      purchaseOrderItemId: `manual-${Date.now()}`,
      productName: newProduct.productName,
      sku: newProduct.sku,
      status: newProduct.status,
      orderedQuantity: newProduct.orderedQuantity,
      receivedQuantity: newProduct.receivedQuantity,
      acceptedQuantity: newProduct.receivedQuantity,
      rejectedQuantity: 0,
      damageQuantity: 0,
      condition: 'good',
      notes: '',
      unitPrice: newProduct.unitPrice,
    };

    setReceivingItems(prev => [...prev, manualItem]);
    setNewProduct({
      purchaseOrderItemId: "",
      productName: '',
      sku: '',
      orderedQuantity: 0,
      receivedQuantity: 0,
      unitPrice: 0,
      status: "received"  
    });
    
    toast.success('Product added successfully!');
  };

  /* =========================================================
   * DELETE GRN
   * ======================================================= */
  const handleDeleteGRN = async (id: string) => {
    try {
      await deleteGRN(id);
      setGrns((prev) => prev.filter((g) => g._id !== id));
      toast.success("GRN deleted");
    } catch {
      toast.error("Failed to delete GRN");
    }
  };

  /* =========================================================
   * RESET FORM
   * ======================================================= */
  const resetForm = () => {
    setSelectedPO("");
    setReceivedBy("");
    setGRNNotes("");
    setReceivingItems([]);
    setNewProduct({
      purchaseOrderItemId: "",
      productName: "",
      sku: "",
      orderedQuantity: 0,
      receivedQuantity: 0,
      unitPrice: 0,
      status: "received",
    });
  };



const handleExportGRN = async (grn: GoodsReceivedNote) => {
  if (!grn?._id) return toast.error("Invalid ID");

  try {
    // 1. Start UI Feedback
    setIsExporting(grn._id); 
    const downloadToast = toast.loading(`Generating PDF for ${grn.grnNumber}...`);

    // 2. The API Call (The "Delay" happens here)
    const blob = await exportSingleGRNToPDF(grn._id);
    
    // 3. Browser Download Logic
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${grn.grnNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // 4. Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    // 5. Success Feedback
    toast.success("Download complete!", { id: downloadToast });
  } catch (error) {
    toast.error("Export failed. Please try again.");
  } finally {
    setIsExporting(null);
  }
};

  /* =========================================================
   * PUBLIC API
   * ======================================================= */
  return {
    // data
    grns,
    purchaseOrders,
    availablePOs,
    stats,
    loading,
    page,
    total,
    grnNumber,
    grnReference,

    // filters
    searchTerm,
    selectedStatus,

    // form
    selectedPO,
    receivedBy,
    grnNotes,
    receivingItems,
    newProduct,

    // setters
    setPage,
    setSearchTerm,
    setSelectedStatus,
    setReceivedBy,
    setGRNNotes,
    setNewProduct,

    // actions
    handleSelectPO,
    handleUpdateItem,
    handleCreateGRN,
    handleDeleteGRN,
    resetForm,
    handleAddManualProduct,
    loadGRNs,
    handleExportGRN
  };
};
