import { Request, Response } from "express";
import { ProductModal } from "../../models/product.models";
import { GrnModel } from "../../models/grn.models";
import { GoodsReturn } from "../../models/goodsReturn.model";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
import { buildQueryOptions } from "../../utils/queryHelper";
import { applyFilters } from "../../utils/filterBuilder";
import { PipelineStage } from "mongoose";
// ----------------------------------------------------------------------
// 1. Stock Summary Report (with chart: monthly Purchased, Sold, Opening, Closing)
// ----------------------------------------------------------------------
export const getStockSummaryReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);

    // 2. Explicitly type the base pipeline
    const basePipeline: PipelineStage[] = [
      { $match: { isDeleted: false } },
      { $unwind: "$attributes" },
      { $unwind: "$attributes.pricing" },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "purchaseorders",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            { $group: { _id: null, purchasedQty: { $sum: "$items.quantity" } } },
          ],
          as: "purchaseData",
        },
      },
      {
        $lookup: {
          from: "grns",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            { $group: { _id: null, receivedQty: { $sum: "$items.acceptedQuantity" } } },
          ],
          as: "grnData",
        },
      },
      {
        $lookup: {
          from: "goodsreturns",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            { $group: { _id: null, returnedQty: { $sum: "$items.returnQty" } } },
          ],
          as: "returnData",
        },
      },
      {
        $project: {
          productName: 1,
          sku: "$attributes.sku",
          category: "$category.categoryName",
          closingStock: "$attributes.stock.stockQuantity",
          unitCost: "$attributes.pricing.costPrice",
          stockValue: { $multiply: ["$attributes.stock.stockQuantity", "$attributes.pricing.costPrice"] },
          purchasedQty: { $ifNull: [{ $arrayElemAt: ["$purchaseData.purchasedQty", 0] }, 0] },
          soldQty: { $ifNull: ["$attributes.stock.soldQty", 0] },
          returnedQty: { $ifNull: [{ $arrayElemAt: ["$returnData.returnedQty", 0] }, 0] },
          adjustmentQty: { $ifNull: ["$attributes.stock.adjustmentQty", 0] },
          createdAt: 1,
        },
      },
    ];

    // Ensure applyFilters returns PipelineStage[]
    const filteredPipeline: PipelineStage[] = applyFilters(basePipeline, options);

    // 3. Explicitly type the chart pipeline
    const chartPipeline: PipelineStage[] = [
      { $match: { isDeleted: false } },
      { $unwind: "$items" },
      {
        $match: (options.startDate || options.endDate)
          ? {
              orderDate: {
                ...(options.startDate && { $gte: new Date(options.startDate) }),
                ...(options.endDate && { $lte: new Date(options.endDate) }),
              } as any, // Cast specific date logic to any if Mongo types conflict
            }
          : {},
      },
      {
        $group: {
          _id: { $month: "$orderDate" },
          month: { $first: { $dateToString: { format: "%b", date: "$orderDate" } } },
          Purchased: { $sum: "$items.quantity" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          name: "$month",
          Purchased: 1,
          "Opening Stock": { $literal: 0 },
          "Sold": { $literal: 0 },
          "Closing Stock": { $literal: 0 },
        },
      },
    ];

    const [mainResult, chartResult] = await Promise.all([
      ProductModal.aggregate([
        ...filteredPipeline,
        {
          $facet: {
            paginated: [{ $skip: options.skip }, { $limit: options.limit }],
            totalCount: [{ $count: "count" }],
            kpis: [
              {
                $group: {
                  _id: null,
                  totalProducts: { $sum: 1 },
                  availableStock: { $sum: "$closingStock" },
                  incomingStock: { $sum: "$purchasedQty" },
                  outgoingStock: { $sum: "$soldQty" },
                  totalInventoryValue: { $sum: "$stockValue" },
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
      totalProducts: 0,
      availableStock: 0,
      incomingStock: 0,
      outgoingStock: 0,
      totalInventoryValue: 0,
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
    console.error("Stock Summary Error:", error);
    res.status(500).json({ message: "Stock summary report error", error });
  }
};

// ----------------------------------------------------------------------
// 2. Low Stock Report (with chart: Low Stock & Critical by category)
// ----------------------------------------------------------------------
export const getLowStockReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);

    let basePipeline: any[] = [
      { $match: { isDeleted: false } },
      { $unwind: "$attributes" },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "purchaseorders",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            { $sort: { orderDate: -1 } },
            { $limit: 1 }
          ],
          as: "lastPurchase"
        }
      },
      { $unwind: { path: "$lastPurchase", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $expr: {
            $lte: ["$attributes.stock.stockQuantity", "$attributes.stock.reorderPoint"]
          }
        }
      },
      {
        $addFields: {
          stockStatus: {
            $switch: {
              branches: [
                { case: { $eq: ["$attributes.stock.stockQuantity", 0] }, then: "Out of Stock" },
                {
                  case: {
                    $lte: ["$attributes.stock.stockQuantity", "$attributes.stock.minStockLevel"]
                  },
                  then: "Critical"
                }
              ],
              default: "Low"
            }
          },
          reorderQuantity: {
            $max: [
              { $subtract: ["$attributes.stock.maxStockLevel", "$attributes.stock.stockQuantity"] },
              0
            ]
          }
        }
      },
      {
        $project: {
          productName: 1,
          sku: "$attributes.sku",
          category: "$category.categoryName",
          currentStock: "$attributes.stock.stockQuantity",
          minStockLevel: "$attributes.stock.minStockLevel",
          reorderQuantity: 1,
          supplier: "$attributes.stock.supplierId",
          stockStatus: 1,
          lastPurchaseDate: "$lastPurchase.orderDate",
          createdAt: 1
        }
      }
    ];

    basePipeline = applyFilters(basePipeline, options);

    const finalPipeline = [
      ...basePipeline,
      {
        $facet: {
          paginated: [{ $skip: options.skip }, { $limit: options.limit }],
          totalCount: [{ $count: "count" }],
          kpis: [
            {
              $group: {
                _id: null,
                lowStockItems: { $sum: 1 },
                criticalStock: { $sum: { $cond: [{ $eq: ["$stockStatus", "Critical"] }, 1, 0] } },
                outOfStock: { $sum: { $cond: [{ $eq: ["$stockStatus", "Out of Stock"] }, 1, 0] } },
                reorderRequired: { $sum: { $cond: [{ $gt: ["$reorderQuantity", 0] }, 1, 0] } }
              }
            }
          ],
          chart: [
            {
              $group: {
                _id: "$category",
                LowStock: {
                  $sum: { $cond: [{ $eq: ["$stockStatus", "Low"] }, 1, 0] }
                },
                Critical: {
                  $sum: { $cond: [{ $eq: ["$stockStatus", "Critical"] }, 1, 0] }
                }
              }
            },
            {
              $project: {
                name: "$_id",
                LowStock: 1,
                Critical: 1
              }
            }
          ]
        }
      }
    ];

    const result = await ProductModal.aggregate(finalPipeline);
    const data = result[0] || { paginated: [], totalCount: [], kpis: [], chart: [] };
    const rows = data.paginated;
    const total = data.totalCount[0]?.count || 0;
    const kpis = data.kpis[0] || {
      lowStockItems: 0,
      criticalStock: 0,
      outOfStock: 0,
      reorderRequired: 0
    };
    const chart = data.chart;

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis,
      chart
    });
  } catch (error) {
    res.status(500).json({ message: "Low stock report error", error });
  }
};

// ----------------------------------------------------------------------
// 3. Inventory Valuation Report (with chart: Value by category)
// ----------------------------------------------------------------------
export const getInventoryValuationReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);

    let basePipeline: any[] = [
      { $match: { isDeleted: false } },
      { $unwind: "$attributes" },
      { $unwind: "$attributes.pricing" },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "purchaseorders",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            {
              $group: {
                _id: null,
                totalPurchaseValue: { $sum: "$items.totalPrice" },
                lastPurchaseCost: { $last: "$items.unitPrice" }
              }
            }
          ],
          as: "purchaseData"
        }
      },
      { $unwind: { path: "$purchaseData", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          inventoryValue: {
            $multiply: ["$attributes.stock.stockQuantity", "$attributes.pricing.costPrice"]
          }
        }
      },
      {
        $project: {
          productName: 1,
          sku: "$attributes.sku",
          category: "$category.categoryName",
          quantityOnHand: "$attributes.stock.stockQuantity",
          unitCost: "$attributes.pricing.costPrice",
          inventoryValue: 1,
          lastPurchaseCost: "$purchaseData.lastPurchaseCost",
          avgCost: "$attributes.pricing.costPrice",
          totalPurchaseValue: { $ifNull: ["$purchaseData.totalPurchaseValue", 0] },
          createdAt: 1
        }
      }
    ];

    basePipeline = applyFilters(basePipeline, options);

    const extendedPipeline = [
      ...basePipeline,
      {
        $facet: {
          paginated: [{ $skip: options.skip }, { $limit: options.limit }],
          totalCount: [{ $count: "count" }],
          kpis: [
            {
              $group: {
                _id: null,
                totalInventoryValue: { $sum: "$inventoryValue" },
                totalPurchaseValue: { $sum: "$totalPurchaseValue" },
                avgUnitCost: { $avg: "$unitCost" }
              }
            }
          ],
          highestValueProduct: [
            { $sort: { inventoryValue: -1 } },
            { $limit: 1 },
            { $project: { _id: 0, productName: 1, inventoryValue: 1 } }
          ],
          lowestValueProduct: [
            { $sort: { inventoryValue: 1 } },
            { $limit: 1 },
            { $project: { _id: 0, productName: 1, inventoryValue: 1 } }
          ],
          chart: [
            {
              $group: {
                _id: "$category",
                Value: { $sum: "$inventoryValue" }
              }
            },
            {
              $project: {
                name: "$_id",
                Value: 1
              }
            }
          ]
        }
      }
    ];

    const fullResult = await ProductModal.aggregate(extendedPipeline);
    const facetData = fullResult[0] || { paginated: [], totalCount: [], kpis: [], highestValueProduct: [], lowestValueProduct: [], chart: [] };
    const rows = facetData.paginated;
    const total = facetData.totalCount[0]?.count || 0;
    const kpisAgg = facetData.kpis[0] || { totalInventoryValue: 0, totalPurchaseValue: 0, avgUnitCost: 0 };
    const highest = facetData.highestValueProduct[0] || { productName: "N/A" };
    const lowest = facetData.lowestValueProduct[0] || { productName: "N/A" };
    const chart = facetData.chart;

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalInventoryValue: kpisAgg.totalInventoryValue,
        totalPurchaseValue: kpisAgg.totalPurchaseValue,
        averageProductCost: kpisAgg.avgUnitCost,
        highestValueProduct: highest.productName,
        lowestValueProduct: lowest.productName
      },
      chart
    });
  } catch (error) {
    res.status(500).json({ message: "Inventory valuation error", error });
  }
};

// ----------------------------------------------------------------------
// 4. Stock Movement Report (with chart: Monthly Stock In vs Stock Out)
// ----------------------------------------------------------------------
export const getStockMovementReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);
    const { skip, limit, page } = options;

    // Date filter
    const dateFilter: any = {};
    if (options.startDate) dateFilter.$gte = new Date(options.startDate);
    if (options.endDate) dateFilter.$lte = new Date(options.endDate);

    // Stock‑in (GRN)
    const stockInPipeline = [
      { $unwind: "$items" },
      {
        $match: {
          ...(Object.keys(dateFilter).length && { receivedDate: dateFilter })
        }
      },
      {
        $addFields: {
          date: "$receivedDate",
          productName: "$items.productName",
          sku: "$items.sku",
          movementType: "Purchase",
          quantityIn: "$items.acceptedQuantity",
          quantityOut: { $literal: 0 },
          reference: "$grnNumber"
        }
      },
      {
        $project: {
          date: 1,
          productName: 1,
          sku: 1,
          movementType: 1,
          quantityIn: 1,
          quantityOut: 1,
          reference: 1,
          _id: 0
        }
      }
    ];

    // Stock‑out (Goods Returns)
    const stockOutPipeline = [
      { $unwind: "$items" },
      {
        $match: {
          ...(Object.keys(dateFilter).length && { returnDate: dateFilter })
        }
      },
      {
        $addFields: {
          date: "$returnDate",
          productName: "$items.productName",
          sku: "$items.sku",
          movementType: "Return",
          quantityIn: { $literal: 0 },
          quantityOut: "$items.returnQty",
          reference: "$grtnNumber"
        }
      },
      {
        $project: {
          date: 1,
          productName: 1,
          sku: 1,
          movementType: 1,
          quantityIn: 1,
          quantityOut: 1,
          reference: 1,
          _id: 0
        }
      }
    ];

    const [stockIn, stockOut] = await Promise.all([
      GrnModel.aggregate(stockInPipeline),
      GoodsReturn.aggregate(stockOutPipeline)
    ]);

    let combined = [...stockIn, ...stockOut];
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (options.search) {
      const searchRegex = new RegExp(options.search, "i");
      combined = combined.filter(
        item => searchRegex.test(item.productName) || searchRegex.test(item.sku)
      );
    }

    const total = combined.length;
    const paginatedRows = combined.slice(skip, skip + limit);

    const totalStockIn = combined.reduce((acc, i) => acc + i.quantityIn, 0);
    const totalStockOut = combined.reduce((acc, i) => acc + i.quantityOut, 0);

    // Build chart: group by month
    const monthlyMap = new Map<string, { StockIn: number; StockOut: number }>();
    for (const item of combined) {
      const month = new Date(item.date).toLocaleString("default", { month: "short" });
      const existing = monthlyMap.get(month) || { StockIn: 0, StockOut: 0 };
      existing.StockIn += item.quantityIn;
      existing.StockOut += item.quantityOut;
      monthlyMap.set(month, existing);
    }
    const chart = Array.from(monthlyMap.entries()).map(([name, values]) => ({
      name,
      "Stock In": values.StockIn,
      "Stock Out": values.StockOut
    }));

    res.json({
      rows: paginatedRows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      kpis: {
        totalMovements: total,
        totalStockIn,
        totalStockOut,
        adjustments: 0
      },
      chart
    });
  } catch (error) {
    console.error("Stock movement error:", error);
    res.status(500).json({ message: "Stock movement error", error });
  }
};