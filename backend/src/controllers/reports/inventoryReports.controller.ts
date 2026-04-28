import { Request, Response } from "express";
import { ProductModal } from "../../models/product.models";
import { GrnModel } from "../../models/grn.models";
import { GoodsReturn } from "../../models/goodsReturn.model";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
import { buildQueryOptions } from "../../utils/queryHelper";
import { applyFilters } from "../../utils/filterBuilder";
import { PipelineStage } from "mongoose";
import { mapColumnFilters } from "../../utils/reports/fieldMapper"
// ----------------------------------------------------------------------
// 1. Stock Summary Report (with chart: monthly Purchased, Sold, Opening, Closing)
// ----------------------------------------------------------------------


// export const getStockSummaryReport = async (req: Request, res: Response) => {
//   try {
//     const options = buildQueryOptions(req);

//     // 1. Base Pipeline: Data Aggregation & Lookups
//     const basePipeline: PipelineStage[] = [
//       { $match: { isDeleted: false } },
//       { $unwind: "$attributes" },
//       { $unwind: "$attributes.pricing" },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "categoryId",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
//       // Purchase Orders Lookup
//       {
//         $lookup: {
//           from: "purchaseorders",
//           let: { sku: "$attributes.sku" },
//           pipeline: [
//             { $unwind: "$items" },
//             { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
//             { $group: { _id: null, purchasedQty: { $sum: "$items.quantity" } } },
//           ],
//           as: "purchaseData",
//         },
//       },
//       // GRN Lookup
//       {
//         $lookup: {
//           from: "grns",
//           let: { sku: "$attributes.sku" },
//           pipeline: [
//             { $unwind: "$items" },
//             { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
//             { $group: { _id: null, receivedQty: { $sum: "$items.acceptedQuantity" } } },
//           ],
//           as: "grnData",
//         },
//       },
//       // Returns Lookup
//       {
//         $lookup: {
//           from: "goodsreturns",
//           let: { sku: "$attributes.sku" },
//           pipeline: [
//             { $unwind: "$items" },
//             { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
//             { $group: { _id: null, returnedQty: { $sum: "$items.returnQty" } } },
//           ],
//           as: "returnData",
//         },
//       },
//       // Project final flat structure
//       {
//         $project: {
//           productName: 1,
//           sku: "$attributes.sku",
//           category: "$category.categoryName",
//           closingStock: { $ifNull: ["$attributes.stock.stockQuantity", 0] },
//           unitCost: { $ifNull: ["$attributes.pricing.costPrice", 0] },
//           stockValue: { 
//             $multiply: [
//               { $ifNull: ["$attributes.stock.stockQuantity", 0] }, 
//               { $ifNull: ["$attributes.pricing.costPrice", 0] }
//             ] 
//           },
//           purchasedQty: { $ifNull: [{ $arrayElemAt: ["$purchaseData.purchasedQty", 0] }, 0] },
//           soldQty: { $ifNull: ["$attributes.stock.soldQty", 0] },
//           returnedQty: { $ifNull: [{ $arrayElemAt: ["$returnData.returnedQty", 0] }, 0] },
//           createdAt: 1,
//         },
//       },
//     ];

//     // ✅ APPLY DYNAMIC FILTERS (Applied after project so you can filter by 'category' name)
//     const filteredPipeline = applyFilters(basePipeline, options);

//     // 2. Chart Pipeline (Independent timeline data)
//     const chartPipeline: PipelineStage[] = [
//       { $match: { isDeleted: false } },
//       { $unwind: "$items" },
//       {
//         $match: (options.startDate || options.endDate)
//           ? {
//               orderDate: {
//                 ...(options.startDate && { $gte: new Date(options.startDate) }),
//                 ...(options.endDate && { $lte: new Date(options.endDate) }),
//               } as any,
//             }
//           : {},
//       },
//       {
//         $group: {
//           _id: { $month: "$orderDate" },
//           month: { $first: { $dateToString: { format: "%b", date: "$orderDate" } } },
//           Purchased: { $sum: "$items.quantity" },
//         },
//       },
//       { $sort: { _id: 1 } },
//       {
//         $project: {
//           name: "$month",
//           Purchased: 1,
//           "Sold": { $literal: 0 }, // Placeholder for comparison
//         },
//       },
//     ];

//     // 3. Parallel Execution for Speed
//     const [mainResult, chartResult] = await Promise.all([
//       ProductModal.aggregate([
//         ...filteredPipeline,
//         {
//           $facet: {
//             paginated: [{ $skip: options.skip }, { $limit: options.limit }],
//             totalCount: [{ $count: "count" }],
//             kpis: [
//               {
//                 $group: {
//                   _id: null,
//                   totalProducts: { $sum: 1 },
//                   availableStock: { $sum: "$closingStock" },
//                   incomingStock: { $sum: "$purchasedQty" },
//                   totalInventoryValue: { $sum: "$stockValue" },
//                 },
//               },
//             ],
//           },
//         },
//       ]),
//       PurchaseOrder.aggregate(chartPipeline),
//     ]);

//     const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
//     const total = data.totalCount[0]?.count || 0;

//     res.json({
//       rows: data.paginated,
//       total,
//       page: options.page,
//       totalPages: Math.ceil(total / options.limit),
//       kpis: data.kpis[0] || {
//         totalProducts: 0,
//         availableStock: 0,
//         incomingStock: 0,
//         totalInventoryValue: 0
//       },
//       chart: chartResult,
//     });

//   } catch (error) {
//     console.error("Stock Summary Error:", error);
//     res.status(500).json({ message: "Internal server error during report generation", error });
//   }
// };

// ✅ FIX 2: Map frontend field names → actual MongoDB paths (post-unwind, pre-$project)
const STOCK_FIELD_MAP: Record<string, string> = {
  productName:  "productName",
  sku:          "attributes.sku",
  category:     "category.categoryName",
  closingStock: "attributes.stock.stockQuantity",
  unitCost:     "attributes.pricing.costPrice",
};

export const getStockSummaryReport = async (req: Request, res: Response) => {
  try {
    const options = buildQueryOptions(req);

    // Map column filter keys to real MongoDB field paths
    const mappedColumnFilters: Record<string, string> = {};
    Object.entries(options.columnFilters || {}).forEach(([field, value]) => {
      const mappedField = STOCK_FIELD_MAP[field] ?? field;
      mappedColumnFilters[mappedField] = value as string;
    });

    // Map the global searchField too
    const mappedSearchField =
      STOCK_FIELD_MAP[options.searchField] ?? options.searchField;

    const mappedOptions = {
      ...options,
      columnFilters: mappedColumnFilters,
      searchField: mappedSearchField,
    };

    // 1. BASE PIPELINE
    let basePipeline: PipelineStage[] = [
      { $match: { isDeleted: false } },

      { $unwind: "$attributes" },
      { $unwind: "$attributes.pricing" },

      // Category Lookup
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      // Purchase Orders
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
                purchasedQty: { $sum: "$items.quantity" },
              },
            },
          ],
          as: "purchaseData",
        },
      },

      // GRN
      {
        $lookup: {
          from: "grns",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            {
              $group: {
                _id: null,
                receivedQty: { $sum: "$items.acceptedQuantity" },
              },
            },
          ],
          as: "grnData",
        },
      },

      // Returns
      {
        $lookup: {
          from: "goodsreturns",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            { $match: { $expr: { $eq: ["$items.sku", "$$sku"] } } },
            {
              $group: {
                _id: null,
                returnedQty: { $sum: "$items.returnQty" },
              },
            },
          ],
          as: "returnData",
        },
      },
    ];

    // 2. ✅ APPLY FILTERS — after all lookups/unwinds, before $project
    //    applyFilters now uses push(), so this is safe
    basePipeline = applyFilters(basePipeline, mappedOptions);

    // 3. FINAL PROJECT
    basePipeline.push({
      $project: {
        productName: 1,
        sku: "$attributes.sku",
        category: "$category.categoryName",

        closingStock: {
          $ifNull: ["$attributes.stock.stockQuantity", 0],
        },

        unitCost: {
          $ifNull: ["$attributes.pricing.costPrice", 0],
        },

        stockValue: {
          $multiply: [
            { $ifNull: ["$attributes.stock.stockQuantity", 0] },
            { $ifNull: ["$attributes.pricing.costPrice", 0] },
          ],
        },

        purchasedQty: {
          $ifNull: [{ $arrayElemAt: ["$purchaseData.purchasedQty", 0] }, 0],
        },

        soldQty: {
          $ifNull: ["$attributes.stock.soldQty", 0],
        },

        returnedQty: {
          $ifNull: [{ $arrayElemAt: ["$returnData.returnedQty", 0] }, 0],
        },

        createdAt: 1,
      },
    });

    // 4. CHART PIPELINE (unchanged)
    const chartPipeline: PipelineStage[] = [
      { $match: { isDeleted: false } },
      { $unwind: "$items" },
      {
        $match:
          options.startDate || options.endDate
            ? {
                orderDate: {
                  ...(options.startDate && { $gte: new Date(options.startDate) }),
                  ...(options.endDate && { $lte: new Date(options.endDate) }),
                },
              }
            : {},
      },
      {
        $group: {
          _id: { $month: "$orderDate" },
          month: {
            $first: { $dateToString: { format: "%b", date: "$orderDate" } },
          },
          Purchased: { $sum: "$items.quantity" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          name: "$month",
          Purchased: 1,
          Sold: { $literal: 0 },
        },
      },
    ];

    // 5. EXECUTION
    const [mainResult, chartResult] = await Promise.all([
      ProductModal.aggregate([
        ...basePipeline,
        {
          $facet: {
            paginated: [
              { $skip: options.skip },
              { $limit: options.limit },
            ],
            totalCount: [{ $count: "count" }],
            kpis: [
              {
                $group: {
                  _id: null,
                  totalProducts:       { $sum: 1 },
                  availableStock:      { $sum: "$closingStock" },
                  incomingStock:       { $sum: "$purchasedQty" },
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
    const total = data.totalCount[0]?.count || 0;

    res.json({
      rows: data.paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: data.kpis[0] || {
        totalProducts: 0,
        availableStock: 0,
        incomingStock: 0,
        totalInventoryValue: 0,
      },
      chart: chartResult,
    });
  } catch (error) {
    console.error("Stock Summary Error:", error);
    res.status(500).json({
      message: "Internal server error during report generation",
      error,
    });
  }
};



// ----------------------------------------------------------------------
// 2. Low Stock Report (with chart: Low Stock & Critical by category)
// ----------------------------------------------------------------------
// controllers/inventoryReports.controller.ts (excerpt)

const LOWSTOCK_FIELD_MAP: Record<string, string> = {
  productName: "productName",
  sku: "attributes.sku",
  reorderQty: "reorderQuantity",      // computed field, will be available after $addFields
  stockStatus: "stockStatus",         // computed field
};

export const getLowStockReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    // Map column filters to real database paths
    options = mapColumnFilters(options, LOWSTOCK_FIELD_MAP);

    // 1. Base pipeline (unwind, lookups, etc.)
    let basePipeline: PipelineStage[] = [
      { $match: { isDeleted: false } },
      { $unwind: "$attributes" },
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
            { $sort: { orderDate: -1 } },
            { $limit: 1 },
          ],
          as: "lastPurchase",
        },
      },
      { $unwind: { path: "$lastPurchase", preserveNullAndEmptyArrays: true } },
    ];

    // 2. Apply low‑stock condition
    basePipeline.push({
      $match: {
        $expr: {
          $lte: ["$attributes.stock.stockQuantity", "$attributes.stock.reorderPoint"],
        },
      },
    });

    // 3. Add computed fields (stockStatus, reorderQuantity)
    basePipeline.push({
      $addFields: {
        stockStatus: {
          $switch: {
            branches: [
              { case: { $eq: ["$attributes.stock.stockQuantity", 0] }, then: "Out of Stock" },
              {
                case: {
                  $lte: ["$attributes.stock.stockQuantity", "$attributes.stock.minStockLevel"],
                },
                then: "Critical",
              },
            ],
            default: "Low",
          },
        },
        reorderQuantity: {
          $max: [
            { $subtract: ["$attributes.stock.maxStockLevel", "$attributes.stock.stockQuantity"] },
            0,
          ],
        },
      },
    });

    // 4. Project final shape
    basePipeline.push({
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
        createdAt: 1,
      },
    });

    // ✅ 5. Apply column filters (after all fields are available)
    basePipeline = applyFilters(basePipeline, options);

    // 6. Facet for pagination, totals, KPIs, chart
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
                reorderRequired: { $sum: { $cond: [{ $gt: ["$reorderQuantity", 0] }, 1, 0] } },
              },
            },
          ],
          chart: [
            {
              $group: {
                _id: "$category",
                LowStock: { $sum: { $cond: [{ $eq: ["$stockStatus", "Low"] }, 1, 0] } },
                Critical: { $sum: { $cond: [{ $eq: ["$stockStatus", "Critical"] }, 1, 0] } },
              },
            },
            {
              $project: {
                name: "$_id",
                LowStock: 1,
                Critical: 1,
              },
            },
          ],
        },
      },
    ];

    const result = await ProductModal.aggregate(finalPipeline);
    const data = result[0] || { paginated: [], totalCount: [], kpis: [], chart: [] };

    res.json({
      rows: data.paginated,
      total: data.totalCount[0]?.count || 0,
      page: options.page,
      totalPages: Math.ceil((data.totalCount[0]?.count || 0) / options.limit),
      kpis: data.kpis[0] || { lowStockItems: 0, criticalStock: 0, outOfStock: 0, reorderRequired: 0 },
      chart: data.chart,
    });
  } catch (error) {
    console.error("Low stock report error:", error);
    res.status(500).json({ message: "Low stock report error", error });
  }
};

// ----------------------------------------------------------------------
// 3. Inventory Valuation Report (with chart: Value by category)
// ----------------------------------------------------------------------
const VALUATION_FIELD_MAP: Record<string, string> = {
  productName: "productName",
  sku: "attributes.sku",
  category: "category.categoryName",
  inventoryValue: "inventoryValue",
};

export const getInventoryValuationReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, VALUATION_FIELD_MAP);

    let basePipeline: PipelineStage[] = [
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
            {
              $group: {
                _id: null,
                totalPurchaseValue: { $sum: "$items.totalPrice" },
                lastPurchaseCost: { $last: "$items.unitPrice" },
              },
            },
          ],
          as: "purchaseData",
        },
      },
      { $unwind: { path: "$purchaseData", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          inventoryValue: {
            $multiply: ["$attributes.stock.stockQuantity", "$attributes.pricing.costPrice"],
          },
        },
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
          createdAt: 1,
        },
      },
    ];

    // Apply column filters
    basePipeline = applyFilters(basePipeline, options);

    // ✅ Cast to any[] to avoid TypeScript error with $facet
    const finalPipeline: any[] = [
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
                avgUnitCost: { $avg: "$unitCost" },
              },
            },
          ],
          highestValueProduct: [
            { $sort: { inventoryValue: -1 as const } },   // ✅ as const fixes literal type
            { $limit: 1 },
            { $project: { _id: 0, productName: 1, inventoryValue: 1 } },
          ],
          lowestValueProduct: [
            { $sort: { inventoryValue: 1 as const } },    // ✅ as const
            { $limit: 1 },
            { $project: { _id: 0, productName: 1, inventoryValue: 1 } },
          ],
          chart: [
            {
              $group: {
                _id: "$category",
                Value: { $sum: "$inventoryValue" },
              },
            },
            {
              $project: {
                name: "$_id",
                Value: 1,
              },
            },
          ],
        },
      },
    ];

    const result = await ProductModal.aggregate(finalPipeline);
    const data = result[0] || {
      paginated: [],
      totalCount: [],
      kpis: [],
      highestValueProduct: [],
      lowestValueProduct: [],
      chart: [],
    };

    res.json({
      rows: data.paginated,
      total: data.totalCount[0]?.count || 0,
      page: options.page,
      totalPages: Math.ceil((data.totalCount[0]?.count || 0) / options.limit),
      kpis: {
        totalInventoryValue: data.kpis[0]?.totalInventoryValue || 0,
        totalPurchaseValue: data.kpis[0]?.totalPurchaseValue || 0,
        averageProductCost: data.kpis[0]?.avgUnitCost || 0,
        highestValueProduct: data.highestValueProduct[0]?.productName || "N/A",
        lowestValueProduct: data.lowestValueProduct[0]?.productName || "N/A",
      },
      chart: data.chart,
    });
  } catch (error) {
    console.error("Inventory valuation error:", error);
    res.status(500).json({ message: "Inventory valuation error", error });
  }
};;

// ----------------------------------------------------------------------
// 4. Stock Movement Report (with chart: Monthly Stock In vs Stock Out)
// ----------------------------------------------------------------------
const MOVEMENT_FIELD_MAP: Record<string, string> = {
  movementType: "movementType",
  productName: "productName",
  sku: "sku",
};

export const getStockMovementReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    // Map column filters (they refer to fields in the final projected object)
    options = mapColumnFilters(options, MOVEMENT_FIELD_MAP);

    const dateFilter: any = {};
    if (options.startDate) dateFilter.$gte = new Date(options.startDate);
    if (options.endDate) dateFilter.$lte = new Date(options.endDate);

    // Stock‑in pipeline (GRN)
    const stockInPipeline = [
      { $unwind: "$items" },
      {
        $match: {
          ...(Object.keys(dateFilter).length && { receivedDate: dateFilter }),
        },
      },
      {
        $project: {
          date: "$receivedDate",
          productName: "$items.productName",
          sku: "$items.sku",
          movementType: { $literal: "Purchase" },
          quantityIn: "$items.acceptedQuantity",
          quantityOut: { $literal: 0 },
          reference: "$grnNumber",
        },
      },
    ];

    // Stock‑out pipeline (Returns)
    const stockOutPipeline = [
      { $unwind: "$items" },
      {
        $match: {
          ...(Object.keys(dateFilter).length && { returnDate: dateFilter }),
        },
      },
      {
        $project: {
          date: "$returnDate",
          productName: "$items.productName",
          sku: "$items.sku",
          movementType: { $literal: "Return" },
          quantityIn: { $literal: 0 },
          quantityOut: "$items.returnQty",
          reference: "$grtnNumber",
        },
      },
    ];

    const [stockIn, stockOut] = await Promise.all([
      GrnModel.aggregate(stockInPipeline),
      GoodsReturn.aggregate(stockOutPipeline),
    ]);

    let combined = [...stockIn, ...stockOut];
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // ✅ Apply column filters (case‑insensitive partial match)
    if (options.columnFilters && Object.keys(options.columnFilters).length > 0) {
      combined = combined.filter((item) => {
        return Object.entries(options.columnFilters).every(([field, filterValue]) => {
          const itemValue = String(item[field] ?? "").toLowerCase();
          return itemValue.includes(String(filterValue).toLowerCase());
        });
      });
    }

    // Global search (if any) – optional, but keep for backward compatibility
    if (options.search) {
      const searchRegex = new RegExp(options.search, "i");
      combined = combined.filter(
        (item) => searchRegex.test(item.productName) || searchRegex.test(item.sku)
      );
    }

    const total = combined.length;
    const paginatedRows = combined.slice(options.skip, options.skip + options.limit);

    // KPIs
    const totalStockIn = combined.reduce((acc, i) => acc + i.quantityIn, 0);
    const totalStockOut = combined.reduce((acc, i) => acc + i.quantityOut, 0);

    // Chart: group by month
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
      "Stock Out": values.StockOut,
    }));

    res.json({
      rows: paginatedRows,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalMovements: total,
        totalStockIn,
        totalStockOut,
        adjustments: 0,
      },
      chart,
    });
  } catch (error) {
    console.error("Stock movement error:", error);
    res.status(500).json({ message: "Stock movement error", error });
  }
};