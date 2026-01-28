// import { useState, useMemo } from 'react';
// import { toast } from 'sonner';
// import {
//   GoodsReceivedNote,
//   PurchaseOrder,
//   ReceivingItem,
//   NewProductForm,
//   GRNStats
// } from '../app/dashboard/inventory-dashboard/product-goods-received/types/goodsReceived';
// import { mockGRNs, mockPurchaseOrders } from '../app/dashboard/inventory-dashboard/product-goods-received/data/goodsReceived';

// export const useGoodsReceived = () => {
//   const [grns, setGrns] = useState<GoodsReceivedNote[]>(mockGRNs);
//   const [purchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [selectedPO, setSelectedPO] = useState<string>('');
//   const [receivedBy, setReceivedBy] = useState('');
//   const [grnNotes, setGRNNotes] = useState('');
//   const [receivingItems, setReceivingItems] = useState<ReceivingItem[]>([]);
//   const [newProduct, setNewProduct] = useState<NewProductForm>({
//     productName: '',
//     sku: '',
//     orderedQuantity: '',
//     receivedQuantity: '',
//     unitPrice: ''
//   });

//   // Calculate statistics
//   const stats: GRNStats = useMemo(() => ({
//     totalGRNs: grns.length,
//     completedGRNs: grns.filter(g => g.status === 'completed').length,
//     discrepancyGRNs: grns.filter(g => g.status === 'discrepancy').length,
//     totalItemsReceived: grns.reduce((sum, grn) => sum + grn.totalReceived, 0)
//   }), [grns]);

//   // Filter GRNs
//   const filteredGRNs = useMemo(() => {
//     return grns.filter(grn => {
//       const matchesSearch = grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            grn.purchaseOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            grn.supplier.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = selectedStatus === 'all' || grn.status === selectedStatus;
//       return matchesSearch && matchesStatus;
//     });
//   }, [grns, searchTerm, selectedStatus]);

//   // Get available purchase orders
//   const availablePOs = useMemo(() => {
//     return purchaseOrders.filter(po =>
//       po.status === 'ordered' && po.deliveryStatus !== 'fully-delivered'
//     );
//   }, [purchaseOrders]);

//   // Handle PO selection
//   const handleSelectPO = (poId: string) => {
//     setSelectedPO(poId);
//     const po = purchaseOrders.find(p => p.id === poId);
//     if (po) {
//       const items: ReceivingItem[] = po.items.map(item => ({
//         id: item.id,
//         productName: item.productName,
//         sku: item.sku,
//         orderedQuantity: item.quantity,
//         receivedQuantity: 0,
//         acceptedQuantity: 0,
//         rejectedQuantity: 0,
//         damageQuantity: 0,
//         condition: 'good',
//         notes: '',
//         unitPrice: item.unitPrice
//       }));
//       setReceivingItems(items);
//     }
//   };

//   // Update receiving item
//   const handleUpdateItem = (itemId: string, field: string, value: any) => {
//     setReceivingItems(items =>
//       items.map(item => {
//         if (item.id === itemId) {
//           const updated = { ...item, [field]: value };

//           // Auto-calculate accepted if received changes
//           if (field === 'receivedQuantity') {
//             const received = parseInt(value) || 0;
//             const rejected = item.rejectedQuantity || 0;
//             const damaged = item.damageQuantity || 0;
//             updated.acceptedQuantity = Math.max(0, received - rejected - damaged);
//           }

//           // Auto-calculate accepted if rejected/damaged changes
//           if (field === 'rejectedQuantity' || field === 'damageQuantity') {
//             const received = item.receivedQuantity || 0;
//             const rejected = field === 'rejectedQuantity' ? (parseInt(value) || 0) : item.rejectedQuantity;
//             const damaged = field === 'damageQuantity' ? (parseInt(value) || 0) : item.damageQuantity;
//             updated.acceptedQuantity = Math.max(0, received - rejected - damaged);
//           }

//           return updated;
//         }
//         return item;
//       })
//     );
//   };

//   // Add manual product
//   const handleAddManualProduct = () => {
//     if (!newProduct.productName || !newProduct.sku || !newProduct.orderedQuantity || !newProduct.receivedQuantity || !newProduct.unitPrice) {
//       toast.error('Please fill in all product fields');
//       return;
//     }

//     const orderedQty = parseInt(newProduct.orderedQuantity);
//     const receivedQty = parseInt(newProduct.receivedQuantity);

//     const manualItem: ReceivingItem = {
//       id: Date.now().toString(),
//       productName: newProduct.productName,
//       sku: newProduct.sku,
//       orderedQuantity: orderedQty,
//       receivedQuantity: receivedQty,
//       acceptedQuantity: receivedQty,
//       rejectedQuantity: 0,
//       damageQuantity: 0,
//       condition: 'good',
//       notes: '',
//       unitPrice: parseFloat(newProduct.unitPrice),
//       isManual: true
//     };

//     setReceivingItems(prev => [...prev, manualItem]);
//     setNewProduct({
//       productName: '',
//       sku: '',
//       orderedQuantity: '',
//       receivedQuantity: '',
//       unitPrice: ''
//     });
//     toast.success('Product added successfully!');
//   };

//   // Remove item
//   const handleRemoveItem = (itemId: string) => {
//     setReceivingItems(prev => prev.filter(item => item.id !== itemId));
//     toast.success('Item removed');
//   };

//   // Create GRN
//   const handleCreateGRN = () => {
//     if (!selectedPO || !receivedBy) {
//       toast.error('Please select a purchase order and enter received by name');
//       return;
//     }

//     const po = purchaseOrders.find(p => p.id === selectedPO);
//     if (!po) return;

//     const totalReceived = receivingItems.reduce((sum, item) => sum + (item.receivedQuantity || 0), 0);

//     if (totalReceived === 0) {
//       toast.error('Please enter received quantities for at least one item');
//       return;
//     }

//     const totalOrdered = receivingItems.reduce((sum, item) => sum + item.orderedQuantity, 0);
//     const totalAccepted = receivingItems.reduce((sum, item) => sum + (item.acceptedQuantity || 0), 0);
//     const totalRejected = receivingItems.reduce((sum, item) => sum + (item.rejectedQuantity || 0), 0);

//     const grnItems = receivingItems
//       .filter(item => item.receivedQuantity > 0)
//       .map(item => ({
//         id: item.id,
//         purchaseOrderItemId: item.id,
//         productName: item.productName,
//         sku: item.sku,
//         orderedQuantity: item.orderedQuantity,
//         receivedQuantity: item.receivedQuantity,
//         acceptedQuantity: item.acceptedQuantity,
//         rejectedQuantity: item.rejectedQuantity,
//         damageQuantity: item.damageQuantity,
//         unitPrice: item.unitPrice,
//         condition: item.condition,
//         notes: item.notes
//       }));

//     const hasDiscrepancy = totalRejected > 0 || totalReceived !== totalOrdered;

//     const newGRN: GoodsReceivedNote = {
//       id: Date.now().toString(),
//       grnNumber: `GRN-${new Date().getFullYear()}-${String(grns.length + 1).padStart(3, '0')}`,
//       purchaseOrderId: po.id,
//       purchaseOrderNumber: po.orderNumber,
//       supplier: po.supplier,
//       receivedDate: new Date(),
//       receivedBy,
//       items: grnItems,
//       totalOrdered,
//       totalReceived,
//       totalAccepted,
//       totalRejected,
//       status: hasDiscrepancy ? 'discrepancy' : 'completed',
//       notes: grnNotes,
//       signature: receivedBy.split(' ').map(n => n[0]).join('.') + '.' + receivedBy.split(' ').pop()
//     };

//     setGrns(prev => [newGRN, ...prev]);
//     toast.success(`GRN ${newGRN.grnNumber} created successfully!`);
//     resetForm();
//   };

//   // Reset form
//   const resetForm = () => {
//     setSelectedPO('');
//     setReceivedBy('');
//     setGRNNotes('');
//     setReceivingItems([]);
//     setNewProduct({
//       productName: '',
//       sku: '',
//       orderedQuantity: '',
//       receivedQuantity: '',
//       unitPrice: ''
//     });
//   };

//   // Available statuses
//   const statuses = ['all', 'draft', 'completed', 'discrepancy'];

//   return {
//     grns,
//     filteredGRNs,
//     stats,
//     purchaseOrders,
//     availablePOs,
//     searchTerm,
//     setSearchTerm,
//     selectedStatus,
//     setSelectedStatus,
//     selectedPO,
//     setSelectedPO: handleSelectPO,
//     receivedBy,
//     setReceivedBy,
//     grnNotes,
//     setGRNNotes,
//     receivingItems,
//     newProduct,
//     setNewProduct,
//     statuses,
//     handleUpdateItem,
//     handleAddManualProduct,
//     handleRemoveItem,
//     handleCreateGRN,
//     resetForm
//   };
// };

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  GoodsReceivedNote,
  PurchaseOrder,
  ReceivingItem,
  
  GRNStats,
} from "@/app/dashboard/inventory-dashboard/product-goods-received/types/goodsReceived";

import { IGoodsReceivedNote, GoodsReceivedItem } from "../../../common/IGRN.interface";
import { IPurchaseOrder } from "../../../common/IPurchase.order.interface";
import {
  fetchGRNs,
  createGRN,
  deleteGRN,
  fetchNextDocumentNumber,
} from "../helper/goodsReceived";

import { fetchOrders } from "../helper/purchaseOrderApi";

 interface NewProductForm {
  productName: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitPrice: number;
}
export interface GoodsReceivedNoteItem {
id: string;
  purchaseOrderItemId: string;
  productName: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  damageQuantity: number;
  unitPrice: number;
  condition: 'good' | 'damaged' | 'defective';
  notes: string;
}
export const useGoodsReceived = () => {
  /* =========================================================
   * SERVER STATE
   * ======================================================= */
  const [grns, setGrns] = useState<IGoodsReceivedNote[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<IPurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [grnNumber, setGRNNumber] = useState("");
  const [grnReference, setGRNReference] = useState("");

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
  const [receivingItems, setReceivingItems] = useState<ReceivingItem[]>([]);

  const [newProduct, setNewProduct] = useState<NewProductForm>({
    productName: "",
    sku: "",
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
        fetchGRNs(page, 10, searchTerm),
        fetchOrders(),
      ]);

      setGrns(grnRes.data);
      setTotal(grnRes.total);
      setPurchaseOrders(poRes.data);
    } catch (error) {
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
      }
    })();
  }, []);

  /* =========================================================
   * STATS (DASHBOARD)
   * ======================================================= */
  const stats: GRNStats = useMemo(
    () => ({
      totalGRNs: total,
      completedGRNs: grns.filter((g) => g.status === "completed").length,
      discrepancyGRNs: grns.filter((g) => g.status === "draft").length,
      totalItemsReceived: grns.reduce(
        (sum, g) => sum + (Number(g.totalReceived) || 0),
        0,
      ),
    }),
    [grns, total],
  );

  /* =========================================================
   * AVAILABLE PURCHASE ORDERS
   * ======================================================= */
  const availablePOs = useMemo(() => {
    return purchaseOrders.filter((po) => po.status === "draft");
  }, [purchaseOrders]);


  /* =========================================================
   * HANDLE PO SELECTION
   * ======================================================= */
  const handleSelectPO = (poId: string) => {
    setSelectedPO(poId);

    const po = purchaseOrders.find((p) => p._id === poId);
    if (!po) return;

    // Build receiving items from PO items
    const items: GoodsReceivedItem[] = po.items.map((item) => ({
      productName: item.productName,
      sku: item.sku,
      orderedQuantity: item.quantity,
      receivedQuantity: 0,
      acceptedQuantity: 0,
      rejectedQuantity: 0,
      damageQuantity: 0,
      condition: "good",
      notes: "",
      unitPrice: item.unitPrice,
    }));

    setReceivingItems(items);
  };

  /* =========================================================
   * UPDATE RECEIVING ITEM
   * ======================================================= */
  const handleUpdateItem = (
    itemId: string,
    field: keyof ReceivingItem,
    value: any,
  ) => {
    setReceivingItems((items) =>
      items.map((item) => {
        if (item.id !== itemId) return item;

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

    const payload: Partial<GoodsReceivedNote> = {
      purchaseOrderId: selectedPO,
      grnNumber,
      receivedBy,
      notes: grnNotes,
      items: receivingItems.filter((i) => i.receivedQuantity > 0),
    };

    try {
     

      setLoading(true);
       await createGRN(payload);
      toast.success("Goods Received Note created");
      resetForm();
    } catch {
      toast.error("Failed to create GRN");
    } finally {
      setLoading(false);
    }
  };

    const handleAddManualProduct = async() => {
    if (!newProduct.productName || !newProduct.sku || !newProduct.orderedQuantity || !newProduct.receivedQuantity || !newProduct.unitPrice) {
      toast.error('Please fill in all product fields');
      return;
    }


    const manualItem: GoodsReceivedNoteItem = {     
      productName: newProduct.productName,
      sku: newProduct.sku,
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
      productName: '',
      sku: '',
      orderedQuantity: 0,
      receivedQuantity: 0,
      unitPrice: 0
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
      productName: "",
      sku: "",
      orderedQuantity: "",
      receivedQuantity: "",
      unitPrice: "",
    });
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
    setSelectedPO: handleSelectPO,
    handleUpdateItem,
    handleCreateGRN,
    handleDeleteGRN,
    resetForm,
    handleAddManualProduct
  };
};
