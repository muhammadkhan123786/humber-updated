import { Request, Response } from "express";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
import { GoodsReturn } from "../../models/goodsReturn.model";
import { buildQueryOptions } from "../../utils/queryHelper";
import { applyFilters } from "../../utils/filterBuilder";
import { PipelineStage } from "mongoose"; 
// ----------------------------------------------------------------------
// 1. Supplier History Report (with chart: Orders, Received, Returns by supplier)
// ----------------------------------------------------------------------
export const getSupplierHistoryReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);

    let matchStage: any = { isDeleted: false };
    if (options.startDate || options.endDate) {
      matchStage.orderDate = {};
      if (options.startDate) matchStage.orderDate.$gte = new Date(options.startDate);
      if (options.endDate) matchStage.orderDate.$lte = new Date(options.endDate);
    }

    const basePipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplier"
        }
      },
      { $unwind: "$supplier" },
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

    if (options.search) {
      const regex = new RegExp(options.search, "i");
      basePipeline.push({
        $match: {
          $or: [
            { supplierName: regex },
            { poNumber: regex },
            { productName: regex },
            { sku: regex }
          ]
        }
      });
    }

    // Chart: aggregated by supplier (Orders, Received, Returns) – top 5 suppliers
    const chartPipeline = [
      ...basePipeline,
      {
        $group: {
          _id: "$supplierName",
          Orders: { $sum: 1 },
          Received: { $sum: "$receivedQuantity" },
          Returns: { $sum: "$returnedQuantity" }
        }
      },
      { $sort: { Orders: -1 } },
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
    const rows = data.paginated;
    const total = data.totalCount[0]?.count || 0;
    const kpis = data.kpis[0] || {
      totalSuppliers: 0,
      totalPurchases: 0,
      totalPurchaseValue: 0,
      totalGoodsReceived: 0,
      totalReturnsToSuppliers: 0
    };
    const chart = chartResult;

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis,
      chart
    });
  } catch (error) {
    res.status(500).json({ message: "Supplier history error", error });
  }
};

// ----------------------------------------------------------------------
// 2. Supplier Performance Report (with chart: On-Time vs Late deliveries by supplier)
// ----------------------------------------------------------------------
export const getSupplierPerformanceReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);

    let matchStage: any = { isDeleted: false };
    if (options.startDate || options.endDate) {
      matchStage.orderDate = {};
      if (options.startDate) matchStage.orderDate.$gte = new Date(options.startDate);
      if (options.endDate) matchStage.orderDate.$lte = new Date(options.endDate);
    }

    const basePipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplier"
        }
      },
      { $unwind: "$supplier" },
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
          returnedItems: { $literal: 0 },
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
          },
          avgDeliveryDays: { $literal: "N/A" }
        }
      }
    ];

    if (options.search) {
      const regex = new RegExp(options.search, "i");
      basePipeline.push({ $match: { supplierName: regex } });
    }

    // Chart: top 5 suppliers by On-Time vs Late deliveries
    const chartPipeline = [
      ...basePipeline,
      {
        $project: {
          name: "$supplierName",
          "On-Time": "$onTimeDeliveries",
          Late: "$lateDeliveries"
        }
      },
      { $sort: { "On-Time": -1 } },
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
                  avgDeliveryTime: { $avg: "$avgDeliveryDays" },
                  supplierRatingScore: { $avg: "$supplierRating" }
                }
              },
              {
                $project: {
                  totalActiveSuppliers: 1,
                  onTimeDeliveries: 1,
                  lateDeliveries: 1,
                  avgDeliveryTime: { $ifNull: ["$avgDeliveryTime", "N/A"] },
                  supplierRatingScore: { $round: ["$supplierRatingScore", 1] }
                }
              }
            ]
          }
        }
      ]),
      PurchaseOrder.aggregate(chartPipeline)
    ]);

    const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
    const rows = data.paginated;
    const total = data.totalCount[0]?.count || 0;
    const kpis = data.kpis[0] || {
      totalActiveSuppliers: 0,
      onTimeDeliveries: 0,
      lateDeliveries: 0,
      avgDeliveryTime: "N/A",
      supplierRatingScore: 0
    };
    const chart = chartResult;

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis,
      chart
    });
  } catch (error) {
    res.status(500).json({ message: "Supplier performance error", error });
  }
};

// ----------------------------------------------------------------------
// 3. Supplier Price History Report (with chart: price trends over months)
// ----------------------------------------------------------------------




export const getSupplierPriceHistoryReport = async (req: Request, res: Response) => {
  try {
    // Assuming buildQueryOptions is defined or imported
    const options = (req as any).buildQueryOptions ? (req as any).buildQueryOptions(req) : { skip: 0, limit: 10, page: 1 };

    let matchStage: any = { isDeleted: false };
    if (options.startDate || options.endDate) {
      matchStage.orderDate = {};
      if (options.startDate) matchStage.orderDate.$gte = new Date(options.startDate);
      if (options.endDate) matchStage.orderDate.$lte = new Date(options.endDate);
    }

    // 1. Strictly type the base pipeline
    const basePipeline: PipelineStage[] = [
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplier",
        },
      },
      { $unwind: "$supplier" },
      {
        $sort: { "items.sku": 1, orderDate: 1 },
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
              poNumber: "$orderNumber",
            },
          },
        },
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
                by: -1,
              },
            },
          },
        },
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
            $subtract: ["$history.price", { $ifNull: ["$prevPrice", 0] }],
          },
          purchaseQuantity: "$history.quantity",
          poNumber: "$history.poNumber",
        },
      },
    ];

    if (options.search) {
      const regex = new RegExp(options.search, "i");
      basePipeline.push({
        $match: {
          $or: [
            { productName: regex },
            { sku: regex },
            { supplier: regex },
            { poNumber: regex },
          ],
        },
      } as PipelineStage.Match); // Explicitly cast the push
    }

    // 2. Strictly type the chart pipeline
    const chartPipeline: PipelineStage[] = [
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            month: { $month: "$orderDate" },
            productName: "$items.productName",
          },
          monthName: { $first: { $dateToString: { format: "%b", date: "$orderDate" } } },
          avgPrice: { $avg: "$items.unitPrice" },
        },
      },
      { $sort: { "_id.month": 1 } },
      {
        $group: {
          _id: "$monthName",
          Laptop: { $avg: { $cond: [{ $eq: ["$_id.productName", "Gaming Laptop"] }, "$avgPrice", null] } },
          Monitor: { $avg: { $cond: [{ $eq: ["$_id.productName", "Monitor 27\""] }, "$avgPrice", null] } },
          Keyboard: { $avg: { $cond: [{ $eq: ["$_id.productName", "Mechanical Keyboard"] }, "$avgPrice", null] } },
          Mouse: { $avg: { $cond: [{ $eq: ["$_id.productName", "Wireless Mouse"] }, "$avgPrice", null] } },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          name: "$_id",
          Laptop: { $round: ["$Laptop", 0] },
          Monitor: { $round: ["$Monitor", 0] },
          Keyboard: { $round: ["$Keyboard", 0] },
          Mouse: { $round: ["$Mouse", 0] },
        },
      },
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
                  totalProductsTracked: { $sum: 1 },
                  avgPurchasePrice: { $avg: "$currentPrice" },
                  highestPrice: { $max: "$currentPrice" },
                  lowestPrice: { $min: "$currentPrice" },
                  priceChangePercent: {
                    $avg: {
                      $multiply: [
                        { $divide: ["$priceDifference", { $max: [{ $ifNull: ["$previousPrice", 1] }, 1] }] },
                        100,
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ]),
      PurchaseOrder.aggregate(chartPipeline),
    ]);

    const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
    const rows = data.paginated;
    const total = data.totalCount[0]?.count || 0;
    const kpis = data.kpis[0] || {
      totalProductsTracked: 0,
      avgPurchasePrice: 0,
      highestPrice: 0,
      lowestPrice: 0,
      priceChangePercent: 0,
    };

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis,
      chart: chartResult,
    });
  } catch (error) {
    console.error("Price History Error:", error);
    res.status(500).json({ message: "Price history error", error });
  }
};