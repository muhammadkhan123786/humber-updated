// controllers/supplierReports.controller.ts
import { Request, Response } from "express";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
import { GoodsReturn } from "../../models/goodsReturn.model";
import { buildQueryOptions } from "../../utils/queryHelper";
import { applyFilters } from "../../utils/filterBuilder";

// ----------------------------------------------------------------------
// 1. Supplier History Report
// ----------------------------------------------------------------------
export const getSupplierHistoryReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);
    
    // Base match stage (isDeleted false + date range)
    let matchStage: any = { isDeleted: false };
    if (options.startDate || options.endDate) {
      matchStage.orderDate = {};
      if (options.startDate) matchStage.orderDate.$gte = new Date(options.startDate);
      if (options.endDate) matchStage.orderDate.$lte = new Date(options.endDate);
    }

    // Pipeline without pagination (for total counts and KPIs later)
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

    // Apply search if needed (on supplierName, poNumber, productName, sku)
    let searchMatch: any = {};
    if (options.search) {
      const searchRegex = new RegExp(options.search, "i");
      searchMatch = {
        $or: [
          { supplierName: searchRegex },
          { poNumber: searchRegex },
          { productName: searchRegex },
          { sku: searchRegex }
        ]
      };
      basePipeline.push({ $match: searchMatch });
    }

    const facetPipeline = [
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
    ];

    const result = await PurchaseOrder.aggregate(facetPipeline);
    const data = result[0] || { paginated: [], totalCount: [], kpis: [] };
    
    const rows = data.paginated;
    const total = data.totalCount[0]?.count || 0;
    const kpis = data.kpis[0] || {
      totalSuppliers: 0,
      totalPurchases: 0,
      totalPurchaseValue: 0,
      totalGoodsReceived: 0,
      totalReturnsToSuppliers: 0
    };

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis
    });
  } catch (error) {
    res.status(500).json({ message: "Supplier history error", error });
  }
};

// ----------------------------------------------------------------------
// 2. Supplier Performance Report
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
          returnedItems: { $literal: 0 }, // placeholder – you can add a lookup to goodsreturns
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
          avgDeliveryDays: { $literal: "N/A" } // placeholder – can be computed
        }
      }
    ];

    // Search filter on supplier name
    if (options.search) {
      const searchRegex = new RegExp(options.search, "i");
      basePipeline.push({ $match: { supplierName: searchRegex } });
    }

    const facetPipeline = [
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
    ];

    const result = await PurchaseOrder.aggregate(facetPipeline);
    const data = result[0] || { paginated: [], totalCount: [], kpis: [] };
    
    const rows = data.paginated;
    const total = data.totalCount[0]?.count || 0;
    const kpis = data.kpis[0] || {
      totalActiveSuppliers: 0,
      onTimeDeliveries: 0,
      lateDeliveries: 0,
      avgDeliveryTime: "N/A",
      supplierRatingScore: 0
    };

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis
    });
  } catch (error) {
    res.status(500).json({ message: "Supplier performance error", error });
  }
};

// ----------------------------------------------------------------------
// 3. Supplier Price History Report
// ----------------------------------------------------------------------
export const getSupplierPriceHistoryReport = async (req: Request, res: Response) => {
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
      { $unwind: "$items" },
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
        $sort: { "items.sku": 1, orderDate: 1 }
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

    // Search filter
    if (options.search) {
      const searchRegex = new RegExp(options.search, "i");
      basePipeline.push({
        $match: {
          $or: [
            { productName: searchRegex },
            { sku: searchRegex },
            { supplier: searchRegex },
            { poNumber: searchRegex }
          ]
        }
      });
    }

    const facetPipeline = [
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
                priceChangePercent: { $avg: { $multiply: [{ $divide: ["$priceDifference", { $max: ["$previousPrice", 1] }] }, 100] } }
              }
            }
          ]
        }
      }
    ];

    const result = await PurchaseOrder.aggregate(facetPipeline);
    const data = result[0] || { paginated: [], totalCount: [], kpis: [] };
    
    const rows = data.paginated;
    const total = data.totalCount[0]?.count || 0;
    const kpis = data.kpis[0] || {
      totalProductsTracked: 0,
      avgPurchasePrice: 0,
      highestPrice: 0,
      lowestPrice: 0,
      priceChangePercent: 0
    };

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis
    });
  } catch (error) {
    res.status(500).json({ message: "Price history error", error });
  }
};