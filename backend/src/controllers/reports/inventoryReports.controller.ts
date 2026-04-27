import { Request, Response } from "express";
import { ProductModal } from "../../models/product.models";
import { GrnModel } from "../../models/grn.models";
import { GoodsReturn } from "../../models/goodsReturn.model";
import { buildQueryOptions } from "../../utils/queryHelper";
import { applyFilters } from "../../utils/filterBuilder";

// ----------------------------------------------------------------------
// 1. Stock Summary Report
// ----------------------------------------------------------------------
export const getStockSummaryReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);

    // Base pipeline (filters + lookups)
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
      // Purchase lookups
      {
        $lookup: {
          from: "purchaseorders",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            { $group: { _id: null, purchasedQty: { $sum: "$items.quantity" } } }
          ],
          as: "purchaseData"
        }
      },
      {
        $lookup: {
          from: "grns",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            { $group: { _id: null, receivedQty: { $sum: "$items.acceptedQuantity" } } }
          ],
          as: "grnData"
        }
      },
      {
        $lookup: {
          from: "goodsreturns",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            { $group: { _id: null, returnedQty: { $sum: "$items.returnQty" } } }
          ],
          as: "returnData"
        }
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
          createdAt: 1
        }
      }
    ];

    // Apply search/date filters
    basePipeline = applyFilters(basePipeline, options);

    // $facet for pagination + global KPIs
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
                totalProducts: { $sum: 1 },
                availableStock: { $sum: "$closingStock" },
                incomingStock: { $sum: "$purchasedQty" },
                outgoingStock: { $sum: "$soldQty" },
                totalInventoryValue: { $sum: "$stockValue" }
              }
            }
          ]
        }
      }
    ];

    const result = await ProductModal.aggregate(finalPipeline);
    const data = result[0] || { paginated: [], totalCount: [], kpis: [] };

    const rows = data.paginated;
    const total = data.totalCount[0]?.count || 0;
    const kpis = data.kpis[0] || {
      totalProducts: 0,
      availableStock: 0,
      incomingStock: 0,
      outgoingStock: 0,
      totalInventoryValue: 0
    };

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis
    });
  } catch (error) {
    res.status(500).json({ message: "Stock summary report error", error });
  }
};

// ----------------------------------------------------------------------
// 2. Low Stock Report
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
      // Last purchase date
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
      // Filter low stock
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
          ]
        }
      }
    ];

    const result = await ProductModal.aggregate(finalPipeline);
    const data = result[0] || { paginated: [], totalCount: [], kpis: [] };

    const rows = data.paginated;
    const total = data.totalCount[0]?.count || 0;
    const kpis = data.kpis[0] || {
      lowStockItems: 0,
      criticalStock: 0,
      outOfStock: 0,
      reorderRequired: 0
    };

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis
    });
  } catch (error) {
    res.status(500).json({ message: "Low stock report error", error });
  }
};

// ----------------------------------------------------------------------
// 3. Inventory Valuation Report
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
      // Purchase data for total purchase value & last cost
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
                totalInventoryValue: { $sum: "$inventoryValue" },
                totalPurchaseValue: { $sum: "$totalPurchaseValue" },
                averageProductCost: { $avg: "$unitCost" },
                highestValueProduct: { $max: "$inventoryValue" }, // we need product name later
                lowestValueProduct: { $min: "$inventoryValue" }
              }
            }
          ]
        }
      }
    ];

    const result = await ProductModal.aggregate(finalPipeline);
    const data = result[0] || { paginated: [], totalCount: [], kpis: [] };

    // To get product names for highest/lowest, we need a separate aggregation or use $facet with $sort/$limit
    // Better: compute highest/lowest names from the same basePipeline using $sort + $limit inside facet
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
          ]
        }
      }
    ];

    const fullResult = await ProductModal.aggregate(extendedPipeline);
    const facetData = fullResult[0] || { paginated: [], totalCount: [], kpis: [], highestValueProduct: [], lowestValueProduct: [] };

    const rows = facetData.paginated;
    const total = facetData.totalCount[0]?.count || 0;
    const kpis = facetData.kpis[0] || {
      totalInventoryValue: 0,
      totalPurchaseValue: 0,
      avgUnitCost: 0
    };
    const highest = facetData.highestValueProduct[0] || { productName: "N/A" };
    const lowest = facetData.lowestValueProduct[0] || { productName: "N/A" };

    res.json({
      rows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalInventoryValue: kpis.totalInventoryValue,
        totalPurchaseValue: kpis.totalPurchaseValue,
        averageProductCost: kpis.avgUnitCost,
        highestValueProduct: highest.productName,
        lowestValueProduct: lowest.productName
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Inventory valuation error", error });
  }
};

// ----------------------------------------------------------------------
// 4. Stock Movement Report (from GRN & Returns)
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

    // Execute both aggregations
    const [stockIn, stockOut] = await Promise.all([
      GrnModel.aggregate(stockInPipeline),
      GoodsReturn.aggregate(stockOutPipeline)
    ]);

    // Combine and sort
    let combined = [...stockIn, ...stockOut];
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply search filter if needed
    if (options.search) {
      const searchRegex = new RegExp(options.search, "i");
      combined = combined.filter(
        item => searchRegex.test(item.productName) || searchRegex.test(item.sku)
      );
    }

    const total = combined.length;
    const paginatedRows = combined.slice(skip, skip + limit);

    // KPIs on whole dataset
    const totalStockIn = combined.reduce((acc, i) => acc + i.quantityIn, 0);
    const totalStockOut = combined.reduce((acc, i) => acc + i.quantityOut, 0);

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
      }
    });
  } catch (error) {
    console.error("Stock movement error:", error);
    res.status(500).json({ message: "Stock movement error", error });
  }
};