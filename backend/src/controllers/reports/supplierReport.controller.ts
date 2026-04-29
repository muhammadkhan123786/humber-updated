import { Request, Response } from "express";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
import { buildQueryOptions } from "../../utils/queryHelper";
import { applyFilters } from "../../utils/filterBuilder";
import { mapColumnFilters } from "../../utils/reports/fieldMapper";

// ------------------------------
// Field maps for supplier reports
// ------------------------------
const SUPPLIER_HISTORY_FIELD_MAP: Record<string, string> = {
  productName: "productName",
  sku: "sku",
  poNumber: "poNumber",
  grnNumber: "grnNumber",
  orderDate: "orderDate",
};

const SUPPLIER_PERFORMANCE_FIELD_MAP: Record<string, string> = {
  supplierName: "supplierName",
};

const PRICE_HISTORY_FIELD_MAP: Record<string, string> = {
  productName: "productName",
  sku: "sku",
  poNumber: "poNumber",
  purchaseDate: "purchaseDate",
};

// ----------------------------------------------------------------------
// 1. Supplier History Report
// ----------------------------------------------------------------------
export const getSupplierHistoryReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, SUPPLIER_HISTORY_FIELD_MAP);

    // Date filter
    const dateFilter: any = {};
    if (options.startDate) dateFilter.$gte = new Date(options.startDate);
    if (options.endDate) dateFilter.$lte = new Date(options.endDate);

    // Base pipeline
    let basePipeline: any[] = [
      { $match: { isDeleted: false, ...(Object.keys(dateFilter).length && { orderDate: dateFilter }) } },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplier"
        }
      },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "grns",
          let: { poId: "$_id", sku: "$items.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $and: [{ $eq: ["$purchaseOrderId", "$$poId"] }, { $eq: ["$items.sku", "$$sku"] }] } } },
            { $project: { acceptedQuantity: "$items.acceptedQuantity", grnNumber: 1, receivedDate: 1 } }
          ],
          as: "grnData"
        }
      },
      {
        $lookup: {
          from: "goodsreturns",
          let: { sku: "$items.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            { $group: { _id: null, totalReturned: { $sum: "$items.returnQty" } } }
          ],
          as: "returnData"
        }
      },
      {
        $addFields: {
          grnItem: { $arrayElemAt: ["$grnData", 0] },
          returnedQty: { $ifNull: [{ $arrayElemAt: ["$returnData.totalReturned", 0] }, 0] }
        }
      },
      {
        $project: {
          supplierName: "$supplier.name",
          poNumber: "$orderNumber",
          grnNumber: { $ifNull: ["$grnItem.grnNumber", ""] },
          productName: "$items.productName",
          sku: "$items.sku",
          orderedQuantity: "$items.quantity",
          receivedQuantity: { $ifNull: ["$grnItem.acceptedQuantity", 0] },
          returnedQuantity: "$returnedQty",
          unitCost: "$items.unitPrice",
          totalAmount: "$items.totalPrice",
          orderDate: "$orderDate",
          deliveryDate: { $ifNull: ["$grnItem.receivedDate", null] }
        }
      }
    ];

    // Apply column filters (productName, sku, poNumber, grnNumber, orderDate)
    basePipeline = applyFilters(basePipeline, options);

    // Chart: top 5 suppliers by orders, received, returns
    const chartPipeline: any[] = [
      ...basePipeline,
      {
        $group: {
          _id: "$supplierName",
          Orders: { $sum: 1 },
          Received: { $sum: "$receivedQuantity" },
          Returns: { $sum: "$returnedQuantity" }
        }
      },
      { $sort: { Orders: -1 as const } },
      { $limit: 5 },
      {
        $project: {
          name: "$_id",
          Orders: 1,
          Received: 1,
          Returns: 1
        }
      }
    ];

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
                  totalSuppliers: { $addToSet: "$supplierName" },
                  totalPurchases: { $sum: 1 },
                  totalPurchaseValue: { $sum: "$totalAmount" },
                  totalGoodsReceived: { $sum: "$receivedQuantity" },
                  totalReturnsToSuppliers: { $sum: "$returnedQuantity" }
                }
              },
              {
                $project: {
                  totalSuppliers: { $size: "$totalSuppliers" },
                  totalPurchases: 1,
                  totalPurchaseValue: 1,
                  totalGoodsReceived: 1,
                  totalReturnsToSuppliers: 1
                }
              }
            ]
          }
        }
      ]),
      PurchaseOrder.aggregate(chartPipeline)
    ]);

    const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
    res.json({
      rows: data.paginated,
      total: data.totalCount[0]?.count || 0,
      page: options.page,
      totalPages: Math.ceil((data.totalCount[0]?.count || 0) / options.limit),
      kpis: data.kpis[0] || {
        totalSuppliers: 0,
        totalPurchases: 0,
        totalPurchaseValue: 0,
        totalGoodsReceived: 0,
        totalReturnsToSuppliers: 0
      },
      chart: chartResult
    });
  } catch (error) {
    console.error("Supplier history error:", error);
    res.status(500).json({ message: "Supplier history error", error });
  }
};

// ----------------------------------------------------------------------
// 2. Supplier Performance Report
// ----------------------------------------------------------------------
export const getSupplierPerformanceReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, SUPPLIER_PERFORMANCE_FIELD_MAP);

    const dateFilter: any = {};
    if (options.startDate) dateFilter.$gte = new Date(options.startDate);
    if (options.endDate) dateFilter.$lte = new Date(options.endDate);

    let basePipeline: any[] = [
      { $match: { isDeleted: false, ...(Object.keys(dateFilter).length && { orderDate: dateFilter }) } },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplier"
        }
      },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "grns",
          localField: "_id",
          foreignField: "purchaseOrderId",
          as: "grn"
        }
      },
      {
        $addFields: {
          delivered: { $size: "$grn" },
          late: {
            $size: {
              $filter: {
                input: "$grn",
                as: "g",
                cond: { $gt: ["$$g.receivedDate", "$expectedDelivery"] }
              }
            }
          },
          totalPurchaseValue: "$total"
        }
      },
      {
        $group: {
          _id: "$supplier._id",
          supplierName: { $first: "$supplier.name" },
          totalOrders: { $sum: 1 },
          totalDelivered: { $sum: "$delivered" },
          lateDeliveries: { $sum: "$late" },
          totalPurchaseValue: { $sum: "$totalPurchaseValue" }
        }
      },
      {
        $addFields: {
          onTimeDeliveries: { $subtract: ["$totalDelivered", "$lateDeliveries"] },
          supplierRating: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $ifNull: ["$onTimeDeliveries", 0] },
                      { $cond: [{ $eq: ["$totalDelivered", 0] }, 1, "$totalDelivered"] }
                    ]
                  },
                  5
                ]
              },
              1
            ]
          }
        }
      }
    ];

    // Apply column filter (supplierName)
    basePipeline = applyFilters(basePipeline, options);

    // Chart: top 5 suppliers by on‑time vs late deliveries
    const chartPipeline: any[] = [
      ...basePipeline,
      {
        $project: {
          name: "$supplierName",
          "On-Time": "$onTimeDeliveries",
          Late: "$lateDeliveries"
        }
      },
      { $sort: { "On-Time": -1 as const } },
      { $limit: 5 }
    ];

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
                  totalActiveSuppliers: { $sum: 1 },
                  onTimeDeliveries: { $sum: "$onTimeDeliveries" },
                  lateDeliveries: { $sum: "$lateDeliveries" },
                  supplierRatingScore: { $avg: "$supplierRating" }
                }
              }
            ]
          }
        }
      ]),
      PurchaseOrder.aggregate(chartPipeline)
    ]);

    const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
    res.json({
      rows: data.paginated,
      total: data.totalCount[0]?.count || 0,
      page: options.page,
      totalPages: Math.ceil((data.totalCount[0]?.count || 0) / options.limit),
      kpis: data.kpis[0] || {
        totalActiveSuppliers: 0,
        onTimeDeliveries: 0,
        lateDeliveries: 0,
        supplierRatingScore: 0
      },
      chart: chartResult
    });
  } catch (error) {
    console.error("Supplier performance error:", error);
    res.status(500).json({ message: "Supplier performance error", error });
  }
};

// ----------------------------------------------------------------------
// 3. Supplier Price History Report (dynamic chart: top 5 products by total quantity)
// ----------------------------------------------------------------------
export const getSupplierPriceHistoryReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, PRICE_HISTORY_FIELD_MAP);

    const dateFilter: any = {};
    if (options.startDate) dateFilter.$gte = new Date(options.startDate);
    if (options.endDate) dateFilter.$lte = new Date(options.endDate);

    // 1. Get top 5 products by total purchased quantity
    const topProducts = await PurchaseOrder.aggregate([
      { $match: { isDeleted: false, ...(Object.keys(dateFilter).length && { orderDate: dateFilter }) } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          totalQty: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalQty: -1 as const } },
      { $limit: 5 },
      { $project: { productName: "$_id" } }
    ]);
    const topProductNames = topProducts.map(p => p.productName);

    // Base pipeline for price history (with previous price difference)
    let basePipeline: any[] = [
      { $match: { isDeleted: false, ...(Object.keys(dateFilter).length && { orderDate: dateFilter }) } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplier"
        }
      },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
      {
        $sort: { "items.sku": 1, orderDate: 1 as const }
      },
      {
        $group: {
          _id: "$items.sku",
          history: {
            $push: {
              productName: "$items.productName",
              sku: "$items.sku",
              supplier: "$supplier.name",
              purchaseDate: "$orderDate",
              price: "$items.unitPrice",
              quantity: "$items.quantity",
              poNumber: "$orderNumber"
            }
          }
        }
      },
      { $unwind: "$history" },
      {
        $setWindowFields: {
          partitionBy: "$_id",
          sortBy: { "history.purchaseDate": 1 },
          output: {
            prevPrice: {
              $shift: {
                output: "$history.price",
                by: -1
              }
            }
          }
        }
      },
      {
        $project: {
          productName: "$history.productName",
          sku: "$history.sku",
          supplier: "$history.supplier",
          purchaseDate: "$history.purchaseDate",
          previousPrice: "$prevPrice",
          currentPrice: "$history.price",
          priceDifference: {
            $subtract: ["$history.price", { $ifNull: ["$prevPrice", 0] }]
          },
          purchaseQuantity: "$history.quantity",
          poNumber: "$history.poNumber"
        }
      }
    ];

    // Apply column filters
    basePipeline = applyFilters(basePipeline, options);

    // Chart pipeline (only if we have top products)
    let chartPipeline: any[] = [];
    if (topProductNames.length > 0) {
      chartPipeline = [
        { $match: { isDeleted: false, ...(Object.keys(dateFilter).length && { orderDate: dateFilter }) } },
        { $unwind: "$items" },
        { $match: { "items.productName": { $in: topProductNames } } },
        {
          $group: {
            _id: {
              month: { $month: "$orderDate" },
              productName: "$items.productName"
            },
            monthName: { $first: { $dateToString: { format: "%b", date: "$orderDate" } } },
            avgPrice: { $avg: "$items.unitPrice" }
          }
        },
        { $sort: { "_id.month": 1 as const } },
        {
          $group: {
            _id: "$monthName",
            ...topProductNames.reduce((acc, name) => {
              acc[name.replace(/\s/g, "_")] = {
                $avg: { $cond: [{ $eq: ["$_id.productName", name] }, "$avgPrice", null] }
              };
              return acc;
            }, {} as Record<string, any>)
          }
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            name: "$_id",
            ...topProductNames.reduce((acc, name) => {
              const safeKey = name?.replace(/\s/g, "_") || "unknown";
             acc[safeKey] = {
  $round: [
    {
      $ifNull: [`$${safeKey}`, 0]
    },
    0
  ]
};
              return acc;
            }, {} as Record<string, any>)
          }
        }
      ];
    }

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
                  totalProductsTracked: { $sum: 1 },
                  avgPurchasePrice: { $avg: "$currentPrice" },
                  highestPrice: { $max: "$currentPrice" },
                  lowestPrice: { $min: "$currentPrice" },
                  priceChangePercent: {
                    $avg: {
                      $multiply: [
                        { $divide: ["$priceDifference", { $max: [{ $ifNull: ["$previousPrice", 1] }, 1] }] },
                        100
                      ]
                    }
                  }
                }
              }
            ]
          }
        }
      ]),
      topProductNames.length ? PurchaseOrder.aggregate(chartPipeline) : Promise.resolve([])
    ]);

    const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
    res.json({
      rows: data.paginated,
      total: data.totalCount[0]?.count || 0,
      page: options.page,
      totalPages: Math.ceil((data.totalCount[0]?.count || 0) / options.limit),
      kpis: data.kpis[0] || {
        totalProductsTracked: 0,
        avgPurchasePrice: 0,
        highestPrice: 0,
        lowestPrice: 0,
        priceChangePercent: 0
      },
      chart: chartResult
    });
  } catch (error) {
    console.error("Price history error:", error);
    res.status(500).json({ message: "Price history error", error });
  }
};