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
          supplierName: { 
  $ifNull: [
    "$supplier.companyName", 
    "$supplier.contactInformation.companyName",
    "$supplier.contactInformation.primaryContactName",
    "N/A"
  ] 
},
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
// ----------------------------------------------------------------------
// 2. Goods Received (GRN) Report with chart: monthly received value
// ----------------------------------------------------------------------
export const getGRNReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, GRN_FIELD_MAP);

    let basePipeline: any[] = [
      // 1. Lookup purchase order
      {
        $lookup: {
          from: "purchaseorders",
          localField: "purchaseOrderId",
          foreignField: "_id",
          as: "purchaseOrder",
        },
      },
      { $unwind: { path: "$purchaseOrder", preserveNullAndEmptyArrays: true } },

      // 2. Lookup supplier using the purchase order's supplier field
      {
        $lookup: {
          from: "suppliers",
          localField: "purchaseOrder.supplier",
          foreignField: "_id",
          as: "supplier",
        },
      },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },

      // 3. Unwind items array
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
          supplierName: {
            $ifNull: [
              "$supplier.companyName",
              "$supplier.contactInformation.companyName",
              "$supplier.contactInformation.primaryContactName",
              "N/A"
            ]
          },
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

    // Date range filter (applies before $unwind for efficiency)
    if (options.startDate || options.endDate) {
      const dateMatch: any = {};
      if (options.startDate) dateMatch.$gte = new Date(options.startDate);
      if (options.endDate) dateMatch.$lte = new Date(options.endDate);
      basePipeline.unshift({ $match: { receivedDate: dateMatch } });
    }

    basePipeline = applyFilters(basePipeline, options);

    // Chart pipeline (unchanged – works on raw GRN data)
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
          supplierName: { 
  $ifNull: [
    "$supplier.companyName", 
    "$supplier.contactInformation.companyName",
    "$supplier.contactInformation.primaryContactName",
    "N/A"
  ] 
},
          totalOrders: { $sum: 1 },
          totalQuantityPurchased: { $sum: { $sum: "$items.quantity" } },
          totalPurchaseAmount: { $sum: "$total" },
          lastPurchaseDate: { $max: "$orderDate" },
        },
      },
      {
        $project: {
          supplierName: { 
  $ifNull: [
    "$supplier.companyName", 
    "$supplier.contactInformation.companyName",
    "$supplier.contactInformation.primaryContactName",
    "N/A"
  ] 
},
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