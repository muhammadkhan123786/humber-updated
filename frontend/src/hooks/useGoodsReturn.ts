// import { useState, useMemo } from 'react';
// import { toast } from 'sonner';
// import { 
//   GoodsReturnNote, 
//   GRNForReturn, 
//   ReturningItem,
//   ReturnStats 
// } from '../app/dashboard/inventory-dashboard/product-goods-return/types/goodsReturn';
// import { mockGoodsReturnNotes, mockAvailableGRNs } from '../app/dashboard/inventory-dashboard/product-goods-return/data/goodsReturn';


// export const useGoodsReturn = () => {
//   const [goodsReturnNotes, setGoodsReturnNotes] = useState<GoodsReturnNote[]>(mockGoodsReturnNotes);
//   const [availableGRNs] = useState<GRNForReturn[]>(mockAvailableGRNs);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
//   const [selectedGRN, setSelectedGRN] = useState<string>('');
//   const [returnedBy, setReturnedBy] = useState('');
//   const [returnReason, setReturnReason] = useState('');
//   const [returnNotes, setReturnNotes] = useState('');
//   const [returningItems, setReturningItems] = useState<ReturningItem[]>([]);

//   // Calculate statistics
//   const stats: ReturnStats = useMemo(() => ({
//     totalReturns: goodsReturnNotes.length,
//     pendingReturns: goodsReturnNotes.filter(g => g.status === 'pending').length,
//     inTransitReturns: goodsReturnNotes.filter(g => g.status === 'in-transit').length,
//     completedReturns: goodsReturnNotes.filter(g => g.status === 'completed').length,
//     totalReturnValue: goodsReturnNotes.reduce((sum, g) => sum + g.totalAmount, 0)
//   }), [goodsReturnNotes]);

//   // Filter return notes
//   const filteredReturns = useMemo(() => {
//     return goodsReturnNotes.filter(grtn => {
//       const matchesSearch = 
//         grtn.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         grtn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         grtn.supplier.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = selectedStatus === 'all' || grtn.status === selectedStatus;
//       return matchesSearch && matchesStatus;
//     });
//   }, [goodsReturnNotes, searchTerm, selectedStatus]);

//   // Handle GRN selection
//   const handleGRNSelection = (grnId: string) => {
//     const grn = availableGRNs.find(g => g.id === grnId);
//     if (grn) {
//       setSelectedGRN(grnId);
//       setReturningItems(grn.items.map(item => ({
//         id: item.id,
//         productName: item.productName,
//         sku: item.sku,
//         receivedQuantity: item.acceptedQuantity,
//         returnQuantity: 0,
//         returnReason: 'damaged',
//         condition: '',
//         notes: '',
//         unitPrice: item.unitPrice
//       })));
//     }
//   };

//   // Update returning item
//   const handleUpdateItemReturn = (itemId: string, field: string, value: any) => {
//     setReturningItems(prev => prev.map(item => 
//       item.id === itemId ? { ...item, [field]: value } : item
//     ));
//   };

//   // Create return note
//   const handleCreateReturn = () => {
//     const selectedGRNData = availableGRNs.find(g => g.id === selectedGRN);
//     if (!selectedGRNData) {
//       toast.error('Please select a GRN');
//       return;
//     }

//     if (!returnedBy) {
//       toast.error('Please enter who is processing the return');
//       return;
//     }

//     const itemsToReturn = returningItems.filter(item => item.returnQuantity > 0);
//     if (itemsToReturn.length === 0) {
//       toast.error('Please specify at least one item to return');
//       return;
//     }

//     // Validate return quantities
//     for (const item of itemsToReturn) {
//       if (item.returnQuantity > item.receivedQuantity) {
//         toast.error(`Return quantity for ${item.productName} cannot exceed received quantity`);
//         return;
//       }
//       if (!item.returnReason) {
//         toast.error(`Please select return reason for ${item.productName}`);
//         return;
//       }
//     }

//     const totalAmount = itemsToReturn.reduce((sum, item) => 
//       sum + (item.returnQuantity * item.unitPrice), 0
//     );

//     const newGRTN: GoodsReturnNote = {
//       id: (goodsReturnNotes.length + 1).toString(),
//       grnNumber: selectedGRNData.grnNumber,
//       grnReference: `${selectedGRNData.grnNumber} / ${selectedGRNData.poNumber}`,
//       returnNumber: `GRTN-2024-${String(goodsReturnNotes.length + 1).padStart(3, '0')}`,
//       supplier: selectedGRNData.supplier,
//       returnDate: new Date(),
//       returnedBy,
//       status: 'pending',
//       returnReason: returnReason || 'General return',
//       items: itemsToReturn.map(item => ({
//         id: item.id,
//         productName: item.productName,
//         sku: item.sku,
//         receivedQuantity: item.receivedQuantity,
//         returnQuantity: item.returnQuantity,
//         returnReason: item.returnReason,
//         condition: item.condition,
//         unitPrice: item.unitPrice,
//         totalPrice: item.returnQuantity * item.unitPrice,
//         notes: item.notes
//       })),
//       totalAmount,
//       notes: returnNotes,
//       createdAt: new Date()
//     };

//     setGoodsReturnNotes(prev => [newGRTN, ...prev]);
//     toast.success(`Goods Return Note ${newGRTN.returnNumber} created successfully!`);
//     resetForm();
//   };

//   // Reset form
//   const resetForm = () => {
//     setSelectedGRN('');
//     setReturnedBy('');
//     setReturnReason('');
//     setReturnNotes('');
//     setReturningItems([]);
//   };

//   // Available statuses
//   const statuses = ['all', 'pending', 'approved', 'in-transit', 'completed', 'rejected'];

//   return {
//     goodsReturnNotes,
//     filteredReturns,
//     stats,
//     availableGRNs,
//     searchTerm,
//     setSearchTerm,
//     selectedStatus,
//     setSelectedStatus,
//     viewMode,
//     setViewMode,
//     selectedGRN,
//     returnedBy,
//     setReturnedBy,
//     returnReason,
//     setReturnReason,
//     returnNotes,
//     setReturnNotes,
//     returningItems,
//     statuses,
//     handleGRNSelection,
//     handleUpdateItemReturn,
//     handleCreateReturn,
//     resetForm
//   };
// };



"use client";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { GoodsReturnNote, GRNForReturn, ReturningItem, ReturnStats } from "../app/dashboard/inventory-dashboard/product-goods-return/types/goodsReturn";
import {
  fetchGoodsReturns,
  createGoodsReturn,
  updateGoodsReturn,
  deleteGoodsReturn,
  fetchAvailableGRNs,
  
} from "../helper/goodsReturn";

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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // ------------------- Load Goods Return Notes -------------------
  const loadGoodsReturns = async () => {
    try {
      const res = await fetchGoodsReturns(page, limit, searchTerm, selectedStatus);
      setGoodsReturnNotes(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load goods return notes");
    }
  };

  // ------------------- Load Available GRNs -------------------
  const loadAvailableGRNs = async () => {
    try {
      const grns = await fetchAvailableGRNs();
      console.log("grns", grns);
      setAvailableGRNs(grns);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load available GRNs");
    }
  };

  useEffect(() => {
    loadGoodsReturns();
    loadAvailableGRNs();
  }, [page, limit, searchTerm, selectedStatus]);

  // ------------------- Statistics -------------------
  const stats: ReturnStats = useMemo(() => ({
    totalReturns: goodsReturnNotes.length,
    pendingReturns: goodsReturnNotes.filter(g => g.status === "pending").length,
    inTransitReturns: goodsReturnNotes.filter(g => g.status === "in-transit").length,
    completedReturns: goodsReturnNotes.filter(g => g.status === "completed").length,
    totalReturnValue: goodsReturnNotes.reduce((sum, g) => sum + g.totalAmount, 0),
  }), [goodsReturnNotes]);

  // ------------------- Filtered Returns -------------------
  // const filteredReturns = useMemo(() => {
  //   return goodsReturnNotes.filter(grtn => {
  //     const matchesSearch =
  //       grtn.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       grtn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       grtn.supplier.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesStatus = selectedStatus === "all" || grtn.status === selectedStatus;
  //     return matchesSearch && matchesStatus;
  //   });
  // }, [goodsReturnNotes, searchTerm, selectedStatus]);

    const filteredReturns = useMemo(() => {
    return goodsReturnNotes.filter(grtn => {
      const matchesSearch = 
        grtn.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grtn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grtn.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      // const matchesStatus = selectedStatus === 'all' || grtn.status === selectedStatus;
      return matchesSearch;
    });
  }, [goodsReturnNotes, searchTerm, selectedStatus]);
  // ------------------- Handle GRN Selection -------------------
  const handleGRNSelection = (grnId: string) => {
    const grn = availableGRNs.find(g => g.id === grnId);
    if (grn) {
      setSelectedGRN(grnId);
      setReturningItems(grn.items.map(item => ({
        id: item.id,
        productName: item.productName,
        sku: item.sku,
        receivedQuantity: item.acceptedQuantity,
        returnQuantity: 0,
        returnReason: "damaged",
        condition: "",
        notes: "",
        unitPrice: item.unitPrice,
      })));
    }
  };

  // ------------------- Update Returning Item -------------------
  const handleUpdateItemReturn = (itemId: string, field: string, value: any) => {
    setReturningItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  // ------------------- Create Return Note -------------------
  const handleCreateReturn = async () => {
    if (!selectedGRN) return toast.error("Please select a GRN");
    if (!returnedBy) return toast.error("Please enter who is processing the return");

    const itemsToReturn = returningItems.filter(item => item.returnQuantity > 0);
    if (itemsToReturn.length === 0) return toast.error("Please specify at least one item to return");

    for (const item of itemsToReturn) {
      if (item.returnQuantity > item.receivedQuantity) {
        return toast.error(`Return quantity for ${item.productName} cannot exceed received quantity`);
      }
      if (!item.returnReason) {
        return toast.error(`Please select return reason for ${item.productName}`);
      }
    }

    const totalAmount = itemsToReturn.reduce((sum, item) => sum + (item.returnQuantity * item.unitPrice), 0);

    const payload: Partial<GoodsReturnNote> = {
      grnId: selectedGRN,
      returnedBy,
      returnReason: returnReason || "General return",
      notes: returnNotes,
      items: itemsToReturn.map(item => ({
        id: item.id,
        productName: item.productName,
        sku: item.sku,
        receivedQuantity: item.receivedQuantity,
        returnQuantity: item.returnQuantity,
        returnReason: item.returnReason,
        condition: item.condition,
        unitPrice: item.unitPrice,
        totalPrice: item.returnQuantity * item.unitPrice,
        notes: item.notes,
      })),
      totalAmount,
    };

    try {
      const newReturn = await createGoodsReturn(payload);
      setGoodsReturnNotes(prev => [newReturn, ...prev]);
      toast.success(`Goods Return Note ${newReturn.returnNumber} created successfully`);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create goods return note");
    }
  };

  // ------------------- Update Return Note -------------------
  const handleUpdateReturn = async (id: string, payload: Partial<GoodsReturnNote>) => {
    try {
      const updated = await updateGoodsReturn(id, payload);
      setGoodsReturnNotes(prev => prev.map(g => g.id === id ? updated : g));
      toast.success(`Goods Return Note ${updated.returnNumber} updated successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update goods return note");
    }
  };

  // ------------------- Delete Return Note -------------------
  const handleDeleteReturn = async (id: string) => {
    try {
      await deleteGoodsReturn(id);
      setGoodsReturnNotes(prev => prev.filter(g => g.id !== id));
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
    total
  };
};
