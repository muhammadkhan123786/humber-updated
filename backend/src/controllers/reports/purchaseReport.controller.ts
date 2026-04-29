// // import { Request, Response } from "express";
// // import { PurchaseOrder } from "../../models/purchaseOrder.model";
// // import { GrnModel } from "../../models/grn.models"

// // /**
// //  * ================================
// //  * 1. PURCHASE ORDER REPORT
// //  * ================================
// //  */
// // export const getPurchaseOrderReport = async (req: Request, res: Response) => {
// //   try {
// //     const orders = await PurchaseOrder.find({ isDeleted: false })
// //       .populate("supplier", "name")
// //       .sort({ createdAt: -1 });

// //     const table = orders.map((po: any) => {
// //       const totalItems = po.items.length;

// //       const totalQty = po.items.reduce((acc: number, i: any) => acc + i.quantity, 0);

// //       const receivedQty = 0; // will be calculated via GRN later if needed
// //       const pendingQty = totalQty - receivedQty;

// //       return {
// //         poNumber: po.orderNumber,
// //         orderDate: po.orderDate,
// //         supplierName: po.supplier?.name || "N/A",
// //         totalItems,
// //         totalQuantity: totalQty,
// //         totalAmount: po.total,
// //         receivedQuantity: receivedQty,
// //         pendingQuantity: pendingQty,
// //         status: po.status,
// //         createdBy: po.createdBy || "N/A"
// //       };
// //     });

// //     const totalPO = orders.length;
// //     const pending = orders.filter(o => o.status === "pending").length;
// //     const completed = orders.filter(o => o.status === "received").length;
// //     const cancelled = orders.filter(o => o.status === "cancelled").length;

// //     const totalValue = orders.reduce((acc, o) => acc + o.total, 0);

// //     res.json({
// //       kpis: {
// //         totalPurchaseOrders: totalPO,
// //         pendingPurchaseOrders: pending,
// //         completedPurchaseOrders: completed,
// //         cancelledPurchaseOrders: cancelled,
// //         totalPurchaseValue: totalValue
// //       },
// //       table
// //     });

// //   } catch (error) {
// //     res.status(500).json({ message: "Purchase order report error", error });
// //   }
// // };


// // /**
// //  * ================================
// //  * 2. GOODS RECEIVED (GRN REPORT)
// //  * ================================
// //  */
// // export const getGRNReport = async (req: Request, res: Response) => {
// //   try {
// //     const grns = await GrnModel.find()
// //       .populate("purchaseOrderId", "orderNumber")
// //       .sort({ createdAt: -1 });

// //     let totalItemsReceived = 0;
// //     let totalValue = 0;

// //     const table: any[] = [];

// //     grns.forEach((grn: any) => {
// //       grn.items.forEach((item: any) => {

// //         const totalCost = item.acceptedQuantity * item.unitPrice;

// //         totalItemsReceived += item.acceptedQuantity;
// //         totalValue += totalCost;

// //         table.push({
// //           grnNumber: grn.grnNumber,
// //           grnDate: grn.receivedDate,
// //           poNumber: grn.purchaseOrderId?.orderNumber || "N/A",
// //           supplierName: "N/A", // optional (can be linked via PO if needed)
// //           productName: item.productName,
// //           sku: item.sku,
// //           orderedQuantity: item.orderedQuantity || 0,
// //           receivedQuantity: item.receivedQuantity,
// //           remainingQuantity: (item.orderedQuantity || 0) - item.receivedQuantity,
// //           unitCost: item.unitPrice,
// //           totalCost,
// //           warehouse: "N/A",
// //           receivedBy: grn.receivedBy
// //         });
// //       });
// //     });

// //     res.json({
// //       kpis: {
// //         totalGRN: grns.length,
// //         totalItemsReceived,
// //         totalPurchaseValueReceived: totalValue,
// //         pendingDeliveries: table.filter(i => i.remainingQuantity > 0).length
// //       },
// //       table
// //     });

// //   } catch (error) {
// //     res.status(500).json({ message: "GRN report error", error });
// //   }
// // };


// // /**
// //  * ================================
// //  * 3. PURCHASE SUMMARY (SUPPLIER)
// //  * ================================
// //  */
// // export const getPurchaseSummaryReport = async (req: Request, res: Response) => {
// //   try {

// //     const summary = await PurchaseOrder.aggregate([
// //       { $match: { isDeleted: false } },

// //       {
// //         $lookup: {
// //           from: "suppliers",
// //           localField: "supplier",
// //           foreignField: "_id",
// //           as: "supplier"
// //         }
// //       },
// //       { $unwind: "$supplier" },

// //       {
// //         $group: {
// //           _id: "$supplier._id",
// //           supplierName: { $first: "$supplier.name" },
// //           totalOrders: { $sum: 1 },
// //           totalQuantity: { $sum: { $sum: "$items.quantity" } },
// //           totalAmount: { $sum: "$total" },
// //           lastPurchaseDate: { $max: "$orderDate" }
// //         }
// //       },

// //       {
// //         $project: {
// //           supplierName: 1,
// //           totalOrders: 1,
// //           totalQuantityPurchased: "$totalQuantity",
// //           totalPurchaseAmount: "$totalAmount",
// //           avgOrderValue: {
// //             $divide: ["$totalAmount", "$totalOrders"]
// //           },
// //           lastPurchaseDate: 1,
// //           topProductPurchased: "N/A"
// //         }
// //       }
// //     ]);

// //     const totalPurchaseAmount = summary.reduce((acc, s) => acc + s.totalPurchaseAmount, 0);
// //     const totalOrders = summary.reduce((acc, s) => acc + s.totalOrders, 0);
// //     const totalProducts = summary.reduce((acc, s) => acc + s.totalQuantityPurchased, 0);

// //     const topSupplier = summary.sort((a, b) => b.totalPurchaseAmount - a.totalPurchaseAmount)[0];

// //     res.json({
// //       kpis: {
// //         totalPurchaseAmount,
// //         totalPurchaseOrders: totalOrders,
// //         averagePurchaseValue: totalPurchaseAmount / (totalOrders || 1),
// //         topSupplier: topSupplier?.supplierName || "N/A",
// //         totalProductsPurchased: totalProducts
// //       },
// //       table: summary
// //     });

// //   } catch (error) {
// //     res.status(500).json({ message: "Purchase summary error", error });
// //   }
// // };


// // controllers/purchaseReports.controller.ts
// import { Request, Response } from "express";
// import { PurchaseOrder } from "../../models/purchaseOrder.model";
// import { GrnModel } from "../../models/grn.models"
// import { buildQueryOptions } from "../../utils/queryHelper";
// import { applyFilters } from "../../utils/filterBuilder";

// // ----------------------------------------------------------------------
// // 1. Purchase Orders Report (with pagination & search)
// // ----------------------------------------------------------------------
// export const getPurchaseOrderReport = async (req: Request, res: Response) => {
//   try {
//     const options = buildQueryOptions(req); // gives { page, limit, skip, search, startDate, endDate }

//     // Build match stage
//     let matchStage: any = { isDeleted: false };
    
//     // Date range filter on orderDate
//     if (options.startDate || options.endDate) {
//       matchStage.orderDate = {};
//       if (options.startDate) matchStage.orderDate.$gte = new Date(options.startDate);
//       if (options.endDate) matchStage.orderDate.$lte = new Date(options.endDate);
//     }
    
//     // Search: poNumber or supplier name (via lookup)
//     let searchMatch: any = {};
//     if (options.search) {
//       const searchRegex = new RegExp(options.search, "i");
//       searchMatch = {
//         $or: [
//           { orderNumber: searchRegex },
//           { "supplier.name": searchRegex }
//         ]
//       };
//     }

//     const pipeline: any[] = [
//       { $match: matchStage },
//       {
//         $lookup: {
//           from: "suppliers",
//           localField: "supplier",
//           foreignField: "_id",
//           as: "supplier"
//         }
//       },
//       { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
//       ...(options.search ? [{ $match: searchMatch }] : []),
//       {
//         $addFields: {
//           totalItems: { $size: "$items" },
//           totalQuantity: { $sum: "$items.quantity" }
//         }
//       },
//       // receivedQuantity & pendingQuantity could be computed via GRN lookup, but we'll keep as 0 for now
//       // For demo, we assume receivedQuantity = 0, pending = totalQuantity
//       // (You can later add a lookup to GRN to get actual received quantities)
//       {
//         $project: {
//           poNumber: "$orderNumber",
//           orderDate: 1,
//           supplierName: { $ifNull: ["$supplier.name", "N/A"] },
//           totalItems: 1,
//           totalQuantity: 1,
//           totalAmount: "$total",
//           receivedQuantity: { $literal: 0 },
//           pendingQuantity: "$totalQuantity", // placeholder
//           status: 1,
//           createdBy: { $ifNull: ["$createdBy", "N/A"] }
//         }
//       }
//     ];

//     // Apply filters (if any)
//     const filteredPipeline = applyFilters(pipeline, options); // this may add extra $match for dimensions

//     const finalPipeline = [
//       ...filteredPipeline,
//       {
//         $facet: {
//           paginated: [{ $skip: options.skip }, { $limit: options.limit }],
//           totalCount: [{ $count: "count" }],
//           kpis: [
//             {
//               $group: {
//                 _id: null,
//                 totalPurchaseOrders: { $sum: 1 },
//                 pendingPurchaseOrders: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
//                 completedPurchaseOrders: { $sum: { $cond: [{ $eq: ["$status", "received"] }, 1, 0] } },
//                 cancelledPurchaseOrders: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
//                 totalPurchaseValue: { $sum: "$totalAmount" }
//               }
//             }
//           ]
//         }
//       }
//     ];

//     const result = await PurchaseOrder.aggregate(finalPipeline);
//     const data = result[0] || { paginated: [], totalCount: [], kpis: [] };
    
//     const rows = data.paginated;
//     const total = data.totalCount[0]?.count || 0;
//     const kpis = data.kpis[0] || {
//       totalPurchaseOrders: 0,
//       pendingPurchaseOrders: 0,
//       completedPurchaseOrders: 0,
//       cancelledPurchaseOrders: 0,
//       totalPurchaseValue: 0
//     };

//     res.json({
//       rows,
//       total,
//       page: options.page,
//       totalPages: Math.ceil(total / options.limit),
//       kpis
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Purchase order report error", error });
//   }
// };

// // ----------------------------------------------------------------------
// // 2. Goods Received (GRN) Report with pagination & search
// // ----------------------------------------------------------------------
// export const getGRNReport = async (req: Request, res: Response) => {
//   try {
//     const options = buildQueryOptions(req);
    
//     let matchStage: any = {};
//     if (options.startDate || options.endDate) {
//       matchStage.receivedDate = {};
//       if (options.startDate) matchStage.receivedDate.$gte = new Date(options.startDate);
//       if (options.endDate) matchStage.receivedDate.$lte = new Date(options.endDate);
//     }

//     const pipeline: any[] = [
//       { $match: matchStage },
//       {
//         $lookup: {
//           from: "purchaseorders",
//           localField: "purchaseOrderId",
//           foreignField: "_id",
//           as: "purchaseOrder"
//         }
//       },
//       { $unwind: { path: "$purchaseOrder", preserveNullAndEmptyArrays: true } },
//       { $unwind: "$items" },
//       {
//         $addFields: {
//           totalCost: { $multiply: ["$items.acceptedQuantity", "$items.unitPrice"] },
//           remainingQuantity: { $subtract: ["$items.orderedQuantity", "$items.receivedQuantity"] }
//         }
//       },
//       {
//         $project: {
//           grnNumber: 1,
//           grnDate: "$receivedDate",
//           poNumber: "$purchaseOrder.orderNumber",
//           supplierName: { $literal: "N/A" }, // can be populated via PO.supplier if needed
//           productName: "$items.productName",
//           sku: "$items.sku",
//           orderedQuantity: "$items.orderedQuantity",
//           receivedQuantity: "$items.receivedQuantity",
//           remainingQuantity: 1,
//           unitCost: "$items.unitPrice",
//           totalCost: 1,
//           warehouse: { $ifNull: ["$warehouse", "N/A"] },
//           receivedBy: { $ifNull: ["$receivedBy", "N/A"] }
//         }
//       }
//     ];

//     // Apply search filter (on productName, sku, poNumber, grnNumber)
//     if (options.search) {
//       const searchRegex = new RegExp(options.search, "i");
//       pipeline.push({
//         $match: {
//           $or: [
//             { productName: searchRegex },
//             { sku: searchRegex },
//             { poNumber: searchRegex },
//             { grnNumber: searchRegex }
//           ]
//         }
//       });
//     }

//     const finalPipeline = [
//       ...pipeline,
//       {
//         $facet: {
//           paginated: [{ $skip: options.skip }, { $limit: options.limit }],
//           totalCount: [{ $count: "count" }],
//           kpis: [
//             {
//               $group: {
//                 _id: null,
//                 totalGRN: { $sum: 1 },
//                 totalItemsReceived: { $sum: "$receivedQuantity" },
//                 totalPurchaseValueReceived: { $sum: "$totalCost" },
//                 pendingDeliveries: { $sum: { $cond: [{ $gt: ["$remainingQuantity", 0] }, 1, 0] } }
//               }
//             }
//           ]
//         }
//       }
//     ];

//     const result = await GrnModel.aggregate(finalPipeline);
//     const data = result[0] || { paginated: [], totalCount: [], kpis: [] };
    
//     const rows = data.paginated;
//     const total = data.totalCount[0]?.count || 0;
//     const kpis = data.kpis[0] || {
//       totalGRN: 0,
//       totalItemsReceived: 0,
//       totalPurchaseValueReceived: 0,
//       pendingDeliveries: 0
//     };

//     res.json({
//       rows,
//       total,
//       page: options.page,
//       totalPages: Math.ceil(total / options.limit),
//       kpis
//     });
//   } catch (error) {
//     res.status(500).json({ message: "GRN report error", error });
//   }
// };

// // ----------------------------------------------------------------------
// // 3. Purchase Summary (Supplier) with pagination & search
// // ----------------------------------------------------------------------
// export const getPurchaseSummaryReport = async (req: Request, res: Response) => {
//   try {
//     const options = buildQueryOptions(req);
    
//     // Build aggregation pipeline for purchase orders grouped by supplier
//     let matchStage: any = { isDeleted: false };
//     if (options.startDate || options.endDate) {
//       matchStage.orderDate = {};
//       if (options.startDate) matchStage.orderDate.$gte = new Date(options.startDate);
//       if (options.endDate) matchStage.orderDate.$lte = new Date(options.endDate);
//     }

//     const groupPipeline = [
//       { $match: matchStage },
//       {
//         $lookup: {
//           from: "suppliers",
//           localField: "supplier",
//           foreignField: "_id",
//           as: "supplier"
//         }
//       },
//       { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
//       {
//         $group: {
//           _id: "$supplier._id",
//           supplierName: { $first: "$supplier.name" },
//           totalOrders: { $sum: 1 },
//           totalQuantityPurchased: { $sum: { $sum: "$items.quantity" } },
//           totalPurchaseAmount: { $sum: "$total" },
//           lastPurchaseDate: { $max: "$orderDate" },
//           // topProduct: we can't easily get here without more complex aggregation, keep as "N/A"
//         }
//       },
//       {
//         $project: {
//           supplierName: { $ifNull: ["$supplierName", "N/A"] },
//           totalOrders: 1,
//           totalQuantityPurchased: 1,
//           totalPurchaseAmount: 1,
//           averageOrderValue: { $divide: ["$totalPurchaseAmount", { $max: ["$totalOrders", 1] }] },
//           lastPurchaseDate: 1,
//           topProductPurchased: { $literal: "N/A" }
//         }
//       }
//     ];

//     // Apply search filter on supplier name
//     if (options.search) {
//       const searchRegex = new RegExp(options.search, "i");
//       groupPipeline.push({
//         $match: { supplierName: searchRegex }
//       });
//     }

//     const finalPipeline = [
//       ...groupPipeline,
//       {
//         $facet: {
//           paginated: [{ $skip: options.skip }, { $limit: options.limit }],
//           totalCount: [{ $count: "count" }],
//           kpis: [
//             {
//               $group: {
//                 _id: null,
//                 totalPurchaseAmount: { $sum: "$totalPurchaseAmount" },
//                 totalPurchaseOrders: { $sum: "$totalOrders" },
//                 totalProductsPurchased: { $sum: "$totalQuantityPurchased" },
//                 avgPurchaseValue: { $avg: "$averageOrderValue" },
//                 topSupplier: { $first: "$supplierName" } // not accurate, better to sort later
//               }
//             }
//           ]
//         }
//       }
//     ];

//     const result = await PurchaseOrder.aggregate(finalPipeline);
//     const data = result[0] || { paginated: [], totalCount: [], kpis: [] };
    
//     const rows = data.paginated;
//     const total = data.totalCount[0]?.count || 0;
//     let kpis = data.kpis[0] || {
//       totalPurchaseAmount: 0,
//       totalPurchaseOrders: 0,
//       totalProductsPurchased: 0,
//       avgPurchaseValue: 0,
//       topSupplier: "N/A"
//     };

//     // Correct topSupplier by sorting rows
//     if (rows.length) {
//       const top = [...rows].sort((a, b) => b.totalPurchaseAmount - a.totalPurchaseAmount)[0];
//       if (top) kpis.topSupplier = top.supplierName;
//     }

//     res.json({
//       rows,
//       total,
//       page: options.page,
//       totalPages: Math.ceil(total / options.limit),
//       kpis
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Purchase summary error", error });
//   }
// };



import { Request, Response } from "express";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
import { GrnModel } from "../../models/grn.models";
import { buildQueryOptions } from "../../utils/queryHelper";
import { applyFilters } from "../../utils/filterBuilder";
import { mapColumnFilters } from "../../utils/reports/fieldMapper";

// ------------------------------
// Field maps for purchase reports
// ------------------------------
const PURCHASE_ORDER_FIELD_MAP: Record<string, string> = {
  poNumber: "poNumber",
  orderDate: "orderDate",
  status: "status",
  supplier: "supplierName",
};

const GRN_FIELD_MAP: Record<string, string> = {
  grnNo: "grnNumber",
  totalCost: "totalCost",
  productName: "productName",
  sku: "sku",
  supplier: "supplierName",
};

const PURCHASE_SUMMARY_FIELD_MAP: Record<string, string> = {
  totalQuantityPurchased: "totalQuantityPurchased",
  supplier: "supplierName",
};

// ----------------------------------------------------------------------
// 1. Purchase Orders Report (with chart: monthly purchase value)
// ----------------------------------------------------------------------
export const getPurchaseOrderReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, PURCHASE_ORDER_FIELD_MAP);

    // Base pipeline for main data
    let basePipeline: any[] = [
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplier",
        },
      },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          totalItems: { $size: "$items" },
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      {
        $project: {
          poNumber: "$orderNumber",
          orderDate: 1,
          supplierName: { $ifNull: ["$supplier.name", "N/A"] },
          totalItems: 1,
          totalQuantity: 1,
          totalAmount: "$total",
          receivedQuantity: { $literal: 0 },
          pendingQuantity: "$totalQuantity",
          status: 1,
          createdBy: { $ifNull: ["$createdBy", "N/A"] },
        },
      },
    ];

    // Date range filter
    if (options.startDate || options.endDate) {
      const dateMatch: any = {};
      if (options.startDate) dateMatch.$gte = new Date(options.startDate);
      if (options.endDate) dateMatch.$lte = new Date(options.endDate);
      basePipeline.unshift({ $match: { orderDate: dateMatch } });
    }

    // Apply column filters
    basePipeline = applyFilters(basePipeline, options);

    // ---------- Chart pipeline: monthly total purchase value ----------
    const chartPipeline: any[] = [
      { $match: { isDeleted: false } },
      ...(options.startDate || options.endDate
        ? [{
            $match: {
              orderDate: {
                ...(options.startDate && { $gte: new Date(options.startDate) }),
                ...(options.endDate && { $lte: new Date(options.endDate) }),
              },
            },
          }]
        : []),
      {
        $group: {
          _id: { $month: "$orderDate" },
          month: { $first: { $dateToString: { format: "%b", date: "$orderDate" } } },
          totalValue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 as const } },
      {
        $project: {
          name: "$month",
          "Purchase Value": { $round: ["$totalValue", 0] },
        },
      },
    ];

    // Execute main query and chart in parallel
    const [mainResult, chartResult] = await Promise.all([
      PurchaseOrder.aggregate([
        ...basePipeline,
        {
          $facet: {
            paginated: [{ $skip: options.skip }, { $limit: options.limit }],
            totalCount: [{ $count: "count" }],
            kpis: [
              {
                $group: {
                  _id: null,
                  totalPurchaseOrders: { $sum: 1 },
                  pendingPurchaseOrders: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                  completedPurchaseOrders: { $sum: { $cond: [{ $eq: ["$status", "received"] }, 1, 0] } },
                  cancelledPurchaseOrders: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
                  totalPurchaseValue: { $sum: "$totalAmount" },
                },
              },
            ],
          },
        },
      ]),
      PurchaseOrder.aggregate(chartPipeline),
    ]);

    const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
    const total = data.totalCount[0]?.count || 0;

    res.json({
      rows: data.paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: data.kpis[0] || {
        totalPurchaseOrders: 0,
        pendingPurchaseOrders: 0,
        completedPurchaseOrders: 0,
        cancelledPurchaseOrders: 0,
        totalPurchaseValue: 0,
      },
      chart: chartResult,
    });
  } catch (error) {
    console.error("Purchase order report error:", error);
    res.status(500).json({ message: "Purchase order report error", error });
  }
};

// ----------------------------------------------------------------------
// 2. Goods Received (GRN) Report with chart: monthly received value
// ----------------------------------------------------------------------
export const getGRNReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, GRN_FIELD_MAP);

    let basePipeline: any[] = [
      {
        $lookup: {
          from: "purchaseorders",
          localField: "purchaseOrderId",
          foreignField: "_id",
          as: "purchaseOrder",
        },
      },
      { $unwind: { path: "$purchaseOrder", preserveNullAndEmptyArrays: true } },
      { $unwind: "$items" },
      {
        $addFields: {
          totalCost: { $multiply: ["$items.acceptedQuantity", "$items.unitPrice"] },
          remainingQuantity: { $subtract: ["$items.orderedQuantity", "$items.receivedQuantity"] },
        },
      },
      {
        $project: {
          grnNumber: 1,
          grnDate: "$receivedDate",
          poNumber: "$purchaseOrder.orderNumber",
          supplierName: { $literal: "N/A" },
          productName: "$items.productName",
          sku: "$items.sku",
          orderedQuantity: "$items.orderedQuantity",
          receivedQuantity: "$items.receivedQuantity",
          remainingQuantity: 1,
          unitCost: "$items.unitPrice",
          totalCost: 1,
          warehouse: { $ifNull: ["$warehouse", "N/A"] },
          receivedBy: { $ifNull: ["$receivedBy", "N/A"] },
        },
      },
    ];

    // Date range filter
    if (options.startDate || options.endDate) {
      const dateMatch: any = {};
      if (options.startDate) dateMatch.$gte = new Date(options.startDate);
      if (options.endDate) dateMatch.$lte = new Date(options.endDate);
      basePipeline.unshift({ $match: { receivedDate: dateMatch } });
    }

    basePipeline = applyFilters(basePipeline, options);

    // ---------- Chart pipeline: monthly total received value ----------
    const chartPipeline: any[] = [
      { $unwind: "$items" },
      ...(options.startDate || options.endDate
        ? [{
            $match: {
              receivedDate: {
                ...(options.startDate && { $gte: new Date(options.startDate) }),
                ...(options.endDate && { $lte: new Date(options.endDate) }),
              },
            },
          }]
        : []),
      {
        $group: {
          _id: { $month: "$receivedDate" },
          month: { $first: { $dateToString: { format: "%b", date: "$receivedDate" } } },
          totalReceivedValue: { $sum: { $multiply: ["$items.acceptedQuantity", "$items.unitPrice"] } },
        },
      },
      { $sort: { _id: 1 as const } },
      {
        $project: {
          name: "$month",
          "Received Value": { $round: ["$totalReceivedValue", 0] },
        },
      },
    ];

    const [mainResult, chartResult] = await Promise.all([
      GrnModel.aggregate([
        ...basePipeline,
        {
          $facet: {
            paginated: [{ $skip: options.skip }, { $limit: options.limit }],
            totalCount: [{ $count: "count" }],
            kpis: [
              {
                $group: {
                  _id: null,
                  totalGRN: { $sum: 1 },
                  totalItemsReceived: { $sum: "$receivedQuantity" },
                  totalPurchaseValueReceived: { $sum: "$totalCost" },
                  pendingDeliveries: { $sum: { $cond: [{ $gt: ["$remainingQuantity", 0] }, 1, 0] } },
                },
              },
            ],
          },
        },
      ]),
      GrnModel.aggregate(chartPipeline),
    ]);

    const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
    const total = data.totalCount[0]?.count || 0;

    res.json({
      rows: data.paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: data.kpis[0] || {
        totalGRN: 0,
        totalItemsReceived: 0,
        totalPurchaseValueReceived: 0,
        pendingDeliveries: 0,
      },
      chart: chartResult,
    });
  } catch (error) {
    console.error("GRN report error:", error);
    res.status(500).json({ message: "GRN report error", error });
  }
};

// ----------------------------------------------------------------------
// 3. Purchase Summary (Supplier) with chart: top 5 suppliers by purchase amount
// ----------------------------------------------------------------------
export const getPurchaseSummaryReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, PURCHASE_SUMMARY_FIELD_MAP);

    // Build summary aggregation (without $facet initially, because we need full list for chart)
    let summaryPipeline: any[] = [
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplier",
        },
      },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$supplier._id",
          supplierName: { $first: "$supplier.name" },
          totalOrders: { $sum: 1 },
          totalQuantityPurchased: { $sum: { $sum: "$items.quantity" } },
          totalPurchaseAmount: { $sum: "$total" },
          lastPurchaseDate: { $max: "$orderDate" },
        },
      },
      {
        $project: {
          supplierName: { $ifNull: ["$supplierName", "N/A"] },
          totalOrders: 1,
          totalQuantityPurchased: 1,
          totalPurchaseAmount: 1,
          averageOrderValue: { $divide: ["$totalPurchaseAmount", { $max: ["$totalOrders", 1] }] },
          lastPurchaseDate: 1,
          topProductPurchased: { $literal: "N/A" },
        },
      },
    ];

    // Date range filter
    if (options.startDate || options.endDate) {
      const dateMatch: any = {};
      if (options.startDate) dateMatch.$gte = new Date(options.startDate);
      if (options.endDate) dateMatch.$lte = new Date(options.endDate);
      summaryPipeline.unshift({ $match: { orderDate: dateMatch } });
    }

    // Apply column filters
    let filteredPipeline = applyFilters([...summaryPipeline], options);

    // ---------- Chart pipeline: top 5 suppliers by purchase amount ----------
    const chartPipeline: any[] = [
      ...summaryPipeline,
      { $sort: { totalPurchaseAmount: -1 as const } },
      { $limit: 5 },
      {
        $project: {
          name: "$supplierName",
          "Purchase Amount": { $round: ["$totalPurchaseAmount", 0] },
        },
      },
    ];

    // Execute main query (with pagination) and chart in parallel
    const [mainResult, chartResult] = await Promise.all([
      PurchaseOrder.aggregate([
        ...filteredPipeline,
        {
          $facet: {
            paginated: [{ $skip: options.skip }, { $limit: options.limit }],
            totalCount: [{ $count: "count" }],
            kpis: [
              {
                $group: {
                  _id: null,
                  totalPurchaseAmount: { $sum: "$totalPurchaseAmount" },
                  totalPurchaseOrders: { $sum: "$totalOrders" },
                  totalProductsPurchased: { $sum: "$totalQuantityPurchased" },
                  avgPurchaseValue: { $avg: "$averageOrderValue" },
                },
              },
            ],
          },
        },
      ]),
      PurchaseOrder.aggregate(chartPipeline),
    ]);

    const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
    const total = data.totalCount[0]?.count || 0;
    let kpis = data.kpis[0] || {
      totalPurchaseAmount: 0,
      totalPurchaseOrders: 0,
      totalProductsPurchased: 0,
      avgPurchaseValue: 0,
      topSupplier: "N/A",
    };

    // Derive topSupplier from chart data (already sorted)
    if (chartResult && chartResult.length > 0) {
      kpis.topSupplier = chartResult[0].name;
    }

    res.json({
      rows: data.paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis,
      chart: chartResult,
    });
  } catch (error) {
    console.error("Purchase summary error:", error);
    res.status(500).json({ message: "Purchase summary error", error });
  }
};