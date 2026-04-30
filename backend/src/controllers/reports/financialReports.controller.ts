// import { Request, Response } from "express";
// import { ProductModal } from "../../models/product.models";
// import { PurchaseOrder } from "../../models/purchaseOrder.model";

// import { GoodsReturn } from "../../models/goodsReturn.model";
// import { buildQueryOptions } from "../../utils/queryHelper";
// import { applyFilters } from "../../utils/filterBuilder";
// import { PipelineStage } from "mongoose";
// import { mapColumnFilters } from "../../utils/reports/fieldMapper"

// // Field maps for financial reports (searchable fields)
// const COST_ANALYSIS_FIELD_MAP = {
//   productName: "productName",
//   sku: "sku",
//   category: "category"
// };

// const PROFIT_LOSS_FIELD_MAP = {
//   poNumber: "poNumber",
//   supplier: "supplierName",
//   product: "productName"
// };

// const BUDGET_FIELD_MAP = {
//   product: "productName",
//   sku: "sku",
//   type: "adjustmentType"
// };

// // ----------------------------------------------------------------------
// // 1. Cost Analysis Report (Inventory Value by product/category)
// // ----------------------------------------------------------------------
// export const getCostAnalysisReport = async (req: Request, res: Response) => {
//   try {
//     let options = buildQueryOptions(req);
//     options = mapColumnFilters(options, COST_ANALYSIS_FIELD_MAP);

//     let basePipeline: any[] = [
//       { $match: { isDeleted: false } },
//       { $unwind: "$attributes" },
//       { $unwind: "$attributes.pricing" },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "categoryId",
//           foreignField: "_id",
//           as: "category"
//         }
//       },
//       { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
//       {
//         $addFields: {
//           inventoryValue: {
//             $multiply: ["$attributes.stock.stockQuantity", "$attributes.pricing.costPrice"]
//           }
//         }
//       },
//       {
//         $project: {
//           productName: 1,
//           sku: "$attributes.sku",
//           category: "$category.categoryName",
//           currentStock: "$attributes.stock.stockQuantity",
//           unitCost: "$attributes.pricing.costPrice",
//           stockValue: "$inventoryValue",
//           warehouse: { $literal: "N/A" } // can be added if available
//         }
//       }
//     ];

//     // Date filter: not applicable directly, but we can filter by createdAt if needed (optional)
//     if (options.startDate || options.endDate) {
//       const dateMatch: any = {};
//       if (options.startDate) dateMatch.$gte = new Date(options.startDate);
//       if (options.endDate) dateMatch.$lte = new Date(options.endDate);
//       basePipeline.unshift({ $match: { createdAt: dateMatch } });
//     }

//     basePipeline = applyFilters(basePipeline, options);

//     // Chart: total inventory value by category
//     const chartPipeline = [
//       ...basePipeline,
//       {
//         $group: {
//           _id: "$category",
//           Value: { $sum: "$stockValue" }
//         }
//       },
//       {
//         $project: {
//           name: "$_id",
//           Value: 1
//         }
//       }
//     ];

//     const [mainResult, chartResult] = await Promise.all([
//       ProductModal.aggregate([
//         ...basePipeline,
//         {
//           $facet: {
//             paginated: [{ $skip: options.skip }, { $limit: options.limit }],
//             totalCount: [{ $count: "count" }],
//             kpis: [
//               {
//                 $group: {
//                   _id: null,
//                   totalInventoryValue: { $sum: "$stockValue" },
//                   totalProductsInStock: { $sum: 1 },
//                   averageProductCost: { $avg: "$unitCost" },
//                   highestValueProduct: { $max: "$stockValue" }
//                 }
//               }
//             ]
//           }
//         }
//       ]),
//       ProductModal.aggregate(chartPipeline)
//     ]);

//     const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
//     const total = data.totalCount[0]?.count || 0;
//     const kpis = data.kpis[0] || {
//       totalInventoryValue: 0,
//       totalProductsInStock: 0,
//       averageProductCost: 0,
//       highestValueProduct: 0
//     };

//     // Find actual product name for highest value (if needed)
//     let highestProductName = "N/A";
//     if (data.paginated.length > 0) {
//       const highest = [...data.paginated].sort((a, b) => b.stockValue - a.stockValue)[0];
//       if (highest) highestProductName = highest.productName;
//     }

//     res.json({
//       rows: data.paginated,
//       total,
//       page: options.page,
//       totalPages: Math.ceil(total / options.limit),
//       kpis: {
//         totalInventoryValue: kpis.totalInventoryValue,
//         totalProductsInStock: kpis.totalProductsInStock,
//         averageProductCost: kpis.averageProductCost,
//         highestValueProduct: highestProductName,
//         lowestValueProduct: "N/A" // optional
//       },
//       chart: chartResult
//     });
//   } catch (error) {
//     console.error("Cost analysis error:", error);
//     res.status(500).json({ message: "Cost analysis error", error });
//   }
// };

// // ----------------------------------------------------------------------
// // 2. Profit & Loss Report (Purchase Expenses)
// // ----------------------------------------------------------------------

// export const getProfitLossReport = async (req: Request, res: Response) => {
//   try {
//     let options = buildQueryOptions(req);
//     options = mapColumnFilters(options, PROFIT_LOSS_FIELD_MAP);

//     let dateFilter: any = {};
//     if (options.startDate) dateFilter.$gte = new Date(options.startDate);
//     if (options.endDate) dateFilter.$lte = new Date(options.endDate);

//     // 1. Base Pipeline with explicit typing
//     let basePipeline: PipelineStage[] = [
//       { 
//         $match: { 
//           isDeleted: false, 
//           ...(Object.keys(dateFilter).length && { orderDate: dateFilter }) 
//         } 
//       },
//       {
//         $lookup: {
//           from: "suppliers",
//           localField: "supplier",
//           foreignField: "_id",
//           as: "supplier"
//         }
//       },
//       { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
//       { $unwind: "$items" },
//       {
//         $addFields: {
//           supplierName: {
//             $ifNull: [
//               "$supplier.companyName",
//               "$supplier.contactInformation.companyName",
//               "$supplier.contactInformation.primaryContactName",
//               "N/A"
//             ]
//           }
//         }
//       },
//       {
//         $project: {
//           purchaseDate: "$orderDate",
//           poNumber: "$orderNumber",
//           supplier: "$supplierName",
//           product: "$items.productName",
//           quantity: "$items.quantity",
//           unitCost: "$items.unitPrice",
//           totalCost: "$items.totalPrice",
//           warehouse: { $literal: "N/A" }
//         }
//       }
//     ];

//     // Note: applyFilters function should return PipelineStage[]
//     basePipeline = applyFilters(basePipeline, options) as PipelineStage[];

//     // 2. Chart Pipeline with fixed typing for $sort
//     const chartPipeline: PipelineStage[] = [
//       { 
//         $match: { 
//           isDeleted: false, 
//           ...(Object.keys(dateFilter).length && { orderDate: dateFilter }) 
//         } 
//       },
//       {
//         $group: {
//           _id: { $month: "$orderDate" },
//           month: { $first: { $dateToString: { format: "%b", date: "$orderDate" } } },
//           Amount: { $sum: "$total" }
//         }
//       },
//       { $sort: { _id: 1 } }, // Ab ye error nahi dega kyunke array typed hai
//       {
//         $project: {
//           _id: 0,
//           name: "$month",
//           Amount: { $round: [{ $divide: ["$Amount", 1000] }, 0] }
//         }
//       }
//     ];

//     const [mainResult, chartResult] = await Promise.all([
//       PurchaseOrder.aggregate([
//         ...basePipeline,
//         {
//           $facet: {
//             paginated: [{ $skip: options.skip }, { $limit: options.limit }],
//             totalCount: [{ $count: "count" }],
//             kpis: [
//               {
//                 $group: {
//                   _id: null,
//                   totalPurchaseCost: { $sum: "$totalCost" },
//                   totalPurchaseOrders: { $sum: 1 },
//                   averagePurchaseValue: { $avg: "$totalCost" },
//                   highestPurchaseMonth: { $max: "$purchaseDate" } 
//                 }
//               }
//             ]
//           }
//         }
//       ]),
//       PurchaseOrder.aggregate(chartPipeline)
//     ]);

//     const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
//     const total = data.totalCount[0]?.count || 0;
//     const kpis = data.kpis[0] || {
//       totalPurchaseCost: 0,
//       totalPurchaseOrders: 0,
//       averagePurchaseValue: 0,
//       highestPurchaseMonth: "N/A"
//     };

//     let highestMonth = "N/A";
//     if (chartResult.length > 0) {
//       const max = [...chartResult].sort((a, b) => b.Amount - a.Amount)[0];
//       if (max) highestMonth = max.name;
//     }

//     res.json({
//       rows: data.paginated,
//       total,
//       page: options.page,
//       totalPages: Math.ceil(total / options.limit),
//       kpis: {
//         totalPurchaseCost: kpis.totalPurchaseCost,
//         totalPurchaseOrders: kpis.totalPurchaseOrders,
//         averagePurchaseValue: kpis.averagePurchaseValue,
//         highestPurchaseMonth: highestMonth
//       },
//       chart: chartResult
//     });
//   } catch (error) {
//     console.error("Profit & Loss error:", error);
//     res.status(500).json({ message: "Profit & Loss error", error });
//   }
// };

// // ----------------------------------------------------------------------
// // 3. Budget vs Actual Report (Stock Loss / Adjustments)
// // ----------------------------------------------------------------------


// export const getBudgetVsActualReport = async (req: Request, res: Response) => {
//   try {
//     let options = buildQueryOptions(req);
//     options = mapColumnFilters(options, BUDGET_FIELD_MAP);

//     let dateFilter: any = {};
//     if (options.startDate) dateFilter.$gte = new Date(options.startDate);
//     if (options.endDate) dateFilter.$lte = new Date(options.endDate);

//     // 1. Base Pipeline with explicit typing
//     let basePipeline: PipelineStage[] = [
//       { 
//         $match: { 
//           isDeleted: false, 
//           ...(Object.keys(dateFilter).length && { returnDate: dateFilter }) 
//         } 
//       },
//       { $unwind: "$items" },
//       {
//         $project: {
//           adjustmentId: "$grtnNumber",
//           date: "$returnDate",
//           product: "$items.productName",
//           sku: "$items.sku",
//           adjustmentType: "Return",
//           quantityChanged: "$items.returnQty",
//           unitPrice: { $ifNull: ["$items.unitPrice", 0] }, // Ensure price exists
//           previousStock: { $literal: 0 },
//           newStock: { $literal: 0 },
//           reason: "$reason",
//           adjustedBy: "$createdBy"
//         }
//       }
//     ];

//     // Note: applyFilters should ideally return PipelineStage[]
//     basePipeline = applyFilters(basePipeline, options) as PipelineStage[];

//     // 2. Chart Pipeline with fixed sort typing
//     const chartPipeline: PipelineStage[] = [
//       { 
//         $match: { 
//           isDeleted: false, 
//           ...(Object.keys(dateFilter).length && { returnDate: dateFilter }) 
//         } 
//       },
//       { $unwind: "$items" },
//       {
//         $group: {
//           _id: { $month: "$returnDate" },
//           month: { $first: { $dateToString: { format: "%b", date: "$returnDate" } } },
//           totalReturned: { $sum: "$items.returnQty" }
//         }
//       },
//       { $sort: { _id: 1 } }, // Explicit typing will now accept this
//       {
//         $project: {
//           _id: 0,
//           name: "$month",
//           "Loss": { $literal: 0 },
//           "Damage": { $literal: 0 },
//           "Correction": { $round: ["$totalReturned", 0] }
//         }
//       }
//     ];

//     // 3. Main Data Aggregation
//     const [mainResult, chartResult] = await Promise.all([
//       GoodsReturn.aggregate([
//         ...basePipeline,
//         {
//           $facet: {
//             paginated: [{ $skip: options.skip }, { $limit: options.limit }],
//             totalCount: [{ $count: "count" }],
//             kpis: [
//               {
//                 $group: {
//                   _id: null,
//                   totalAdjustments: { $sum: 1 },
//                   totalLostStock: { $sum: "$quantityChanged" },
//                   adjustmentValue: { $sum: { $multiply: ["$quantityChanged", "$unitPrice"] } }
//                 }
//               }
//             ]
//           }
//         }
//       ]),
//       GoodsReturn.aggregate(chartPipeline)
//     ]);

//     const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
//     const total = data.totalCount[0]?.count || 0;
//     const kpis = data.kpis[0] || {
//       totalAdjustments: 0,
//       totalLostStock: 0,
//       adjustmentValue: 0
//     };

//     // 4. Logical calculation for "Most Adjusted Product"
//     let mostAdjusted = "N/A";
//     if (data.paginated.length > 0) {
//       const productCounts: Record<string, number> = {};
//       data.paginated.forEach((item: any) => {
//         const prodName = item.product || "Unknown";
//         productCounts[prodName] = (productCounts[prodName] || 0) + Math.abs(item.quantityChanged);
//       });
//       const top = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
//       if (top) mostAdjusted = top[0];
//     }

//     res.json({
//       rows: data.paginated,
//       total,
//       page: options.page,
//       totalPages: Math.ceil(total / options.limit),
//       kpis: {
//         totalAdjustments: kpis.totalAdjustments,
//         totalLostStock: kpis.totalLostStock,
//         adjustmentValue: kpis.adjustmentValue,
//         mostAdjustedProduct: mostAdjusted
//       },
//       chart: chartResult
//     });
//   } catch (error) {
//     console.error("Budget vs Actual error:", error);
//     res.status(500).json({ message: "Budget vs Actual error", error });
//   }
// };

import { Request, Response } from "express";
import { ProductModal } from "../../models/product.models";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
import { buildQueryOptions } from "../../utils/queryHelper";
import { applyFilters } from "../../utils/filterBuilder";
import { mapColumnFilters } from "../../utils/reports/fieldMapper";
import { PipelineStage } from "mongoose";

const COST_ANALYSIS_FIELD_MAP: Record<string, string> = {
  productName: "productName",
  sku: "sku",
  category: "category",
  stockValue: "stockValue",
};

export const getCostAnalysisReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, COST_ANALYSIS_FIELD_MAP);

    const dateFilter: any = {};
    if (options.startDate) dateFilter.$gte = new Date(options.startDate);
    if (options.endDate) dateFilter.$lte = new Date(options.endDate);

    // ---------- Main aggregation (unwinds attributes and first pricing) ----------
    let pipeline: PipelineStage[] = [
      { $match: { isDeleted: false } },
      { $unwind: "$attributes" },
      {
        $addFields: {
          firstPricing: { $arrayElemAt: ["$attributes.pricing", 0] }
        }
      },
      { $unwind: { path: "$firstPricing", preserveNullAndEmptyArrays: true } },
      // Lookup warehouse using attributes.stock.warehouseId
      {
        $lookup: {
          from: "warehouses",
          localField: "attributes.stock.warehouseId",
          foreignField: "_id",
          as: "warehouseInfo"
        }
      },
      { $unwind: { path: "$warehouseInfo", preserveNullAndEmptyArrays: true } },
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
        $addFields: {
          productName: "$productName",
          sku: "$attributes.sku",
          category: "$category.categoryName",
          currentStock: "$attributes.stock.stockQuantity",
          unitCost: "$firstPricing.costPrice",
          stockValue: {
            $multiply: ["$attributes.stock.stockQuantity", "$firstPricing.costPrice"]
          },
          warehouse: { $ifNull: ["$warehouseInfo.name", "N/A"] }  // assuming warehouse schema has a "name" field
        }
      },
      {
        $project: {
          productName: 1,
          sku: 1,
          category: 1,
          currentStock: 1,
          unitCost: 1,
          stockValue: 1,
          warehouse: 1
        }
      }
    ];

    // Date filter (using createdAt – adjust if needed)
    if (options.startDate || options.endDate) {
      pipeline.unshift({ $match: { createdAt: dateFilter } } as PipelineStage);
    }

    pipeline = applyFilters(pipeline, options);

    // Chart: stock value by category
    const chartPipeline: PipelineStage[] = [
      ...pipeline,
      {
        $group: {
          _id: "$category",
          Value: { $sum: "$stockValue" }
        }
      },
      {
        $project: {
          name: { $ifNull: ["$_id", "Uncategorized"] },
          Value: { $round: ["$Value", 0] }
        }
      }
    ];

    const [mainResult, chartResult] = await Promise.all([
      ProductModal.aggregate([
        ...pipeline,
        {
          $facet: {
            paginated: [{ $skip: options.skip }, { $limit: options.limit }],
            totalCount: [{ $count: "count" }],
            kpis: [
              {
                $group: {
                  _id: null,
                  totalInventoryValue: { $sum: "$stockValue" },
                  totalProductsInStock: { $sum: 1 },
                  averageProductCost: { $avg: "$unitCost" }
                }
              }
            ],
            highestValueProduct: [
              { $sort: { stockValue: -1 } },
              { $limit: 1 },
              { $project: { productName: 1, _id: 0 } }
            ]
          }
        }
      ]),
      ProductModal.aggregate(chartPipeline)
    ]);

    const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [], highestValueProduct: [] };
    const total = data.totalCount[0]?.count || 0;
    const kpis = data.kpis[0] || { totalInventoryValue: 0, totalProductsInStock: 0, averageProductCost: 0 };
    const highestProduct = data.highestValueProduct[0] || { productName: "N/A" };

    res.json({
      rows: data.paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalInventoryValue: kpis.totalInventoryValue,
        totalProductsInStock: kpis.totalProductsInStock,
        averageProductCost: kpis.averageProductCost,
        highestValueProduct: highestProduct.productName
      },
      chart: chartResult
    });
  } catch (error) {
    console.error("Cost analysis error:", error);
    res.status(500).json({ message: "Cost analysis error", error });
  }
};

// ----------------------------------------------------------------------
// 2. Profit & Loss Report (with supplier name fix)
// ----------------------------------------------------------------------
const PROFIT_LOSS_FIELD_MAP: Record<string, string> = {
  purchaseDate: "purchaseDate",
  supplier: "supplierName",      // mapped after $addFields
  product: "product",            // will be mapped to $items.productName
  totalCost: "totalCost",
};

export const getProfitLossReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, PROFIT_LOSS_FIELD_MAP);

    const dateFilter: any = {};
    if (options.startDate) dateFilter.$gte = new Date(options.startDate);
    if (options.endDate) dateFilter.$lte = new Date(options.endDate);

    let basePipeline: PipelineStage[] = [
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
      { $unwind: "$items" },
      // ✅ Lookup product details using productId (convert to ObjectId)
      {
        $lookup: {
          from: "products",
          let: { prodId: "$items.productId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$prodId" }] } } },
            { $project: { productName: 1 } }
          ],
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          supplierName: {
            $ifNull: [
              "$supplier.companyName",
              "$supplier.contactInformation.companyName",
              "$supplier.contactInformation.primaryContactName",
              "N/A",
            ],
          },
          // Use product name from product master if available, otherwise fallback to PO item's productName
          finalProduct: {
            $ifNull: ["$productInfo.productName", "$items.productName", "Unknown Product"]
          },
          // Compute totalCost = quantity × unitPrice if items.totalPrice is missing/zero
          computedTotalCost: {
            $cond: [
              { $eq: [{ $ifNull: ["$items.totalPrice", 0] }, 0] },
              { $multiply: ["$items.quantity", "$items.unitPrice"] },
              "$items.totalPrice"
            ]
          }
        },
      },
      {
        $project: {
          purchaseDate: "$orderDate",
          poNumber: "$orderNumber",
          supplier: "$supplierName",
          product: "$finalProduct",
          quantity: "$items.quantity",
          unitCost: "$items.unitPrice",
          totalCost: "$computedTotalCost",
        },
      },
    ];

    if (options.startDate || options.endDate) {
      basePipeline.unshift({ $match: { orderDate: dateFilter } } as PipelineStage);
    }

    basePipeline = applyFilters(basePipeline, options);

    const chartPipeline: PipelineStage[] = [
      { $match: { isDeleted: false } },
      ...(options.startDate || options.endDate
        ? [{ $match: { orderDate: dateFilter } } as PipelineStage]
        : []),
      {
        $group: {
          _id: { $month: "$orderDate" },
          month: { $first: { $dateToString: { format: "%b", date: "$orderDate" } } },
          totalCost: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 as const } },
      {
        $project: {
          name: "$month",
          COGS: { $round: ["$totalCost", 0] },
          Revenue: { $round: [{ $multiply: ["$totalCost", 1.35] }, 0] },
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
                  totalPurchaseCost: { $sum: "$totalCost" },
                  totalPurchaseOrders: { $sum: 1 },
                  averagePurchaseValue: { $avg: "$totalCost" },
                  highestPurchaseMonth: { $max: "$purchaseDate" },
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
        totalPurchaseCost: 0,
        totalPurchaseOrders: 0,
        averagePurchaseValue: 0,
        highestPurchaseMonth: "N/A",
      },
      chart: chartResult,
    });
  } catch (error) {
    console.error("Profit & loss error:", error);
    res.status(500).json({ message: "Profit & loss error", error });
  }
};


// ----------------------------------------------------------------------
// 3. Budget vs Actual Report (static but now with proper filter)
// ----------------------------------------------------------------------


const BUDGET_VS_ACTUAL_FIELD_MAP: Record<string, string> = {
  category: "category",
  status: "status",
};

// Optional: define a Budget model if you have one
// import { Budget } from "../../models/budget.model";

export const getBudgetVsActualReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, BUDGET_VS_ACTUAL_FIELD_MAP);

    const dateFilter: any = {};
    if (options.startDate) dateFilter.$gte = new Date(options.startDate);
    if (options.endDate) dateFilter.$lte = new Date(options.endDate);

    // ---------- 1. Aggregate actual spend by category ----------
    // This pipeline:
    // - Joins purchase order items with products to get categoryId
    // - Joins categories to get categoryName
    // - Groups by category, sums total spent
    const actualPipeline = [
      { $match: { isDeleted: false, ...(Object.keys(dateFilter).length && { orderDate: dateFilter }) } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          let: { productId: "$items.productId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$productId" }] } } },
            { $project: { categoryId: 1 } }
          ],
          as: "productInfo"
        }
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "productInfo.categoryId",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$categoryInfo.categoryName", "Uncategorized"] },
          actualAmount: { $sum: "$items.totalPrice" }
        }
      },
      { $project: { category: "$_id", actualAmount: 1, _id: 0 } }
    ];

    const actualData = await PurchaseOrder.aggregate(actualPipeline);

    // ---------- 2. Get budget data (if Budget collection exists) ----------
    let budgets: Record<string, number> = {};
    const BUDGET_MULTIPLIER = 1.1; // fallback – use 10% above actual

    // Try to fetch from Budget model (uncomment when you have the model)
    /*
    try {
      const budgetDocs = await Budget.find({});
      for (const doc of budgetDocs) {
        budgets[doc.category] = doc.amount;
      }
    } catch (err) {
      console.warn("Budget collection not found – using fallback multiplier");
    }
    */

    // ---------- 3. Build rows ----------
    const rowsData = actualData.map(actual => {
      const budgetValue = budgets[actual.category] || actual.actualAmount * BUDGET_MULTIPLIER;
      const variance = actual.actualAmount - budgetValue;
      const variancePercent = ((variance / budgetValue) * 100).toFixed(1);
      const status = variance >= 0 ? "Over" : "Under";

      return {
        category: actual.category,
        budget: budgetValue,
        actual: actual.actualAmount,
        variance,
        variancePercent: parseFloat(variancePercent),
        status
      };
    });

    // ---------- 4. Apply filters (category, status) ----------
    let filteredRows = rowsData;
    if (options.columnFilters?.category) {
      const filterVal = options.columnFilters.category.toLowerCase();
      filteredRows = filteredRows.filter(row => row.category.toLowerCase().includes(filterVal));
    }
    if (options.columnFilters?.status) {
      const filterVal = options.columnFilters.status.toLowerCase();
      filteredRows = filteredRows.filter(row => row.status.toLowerCase() === filterVal);
    }

    // ---------- 5. Format for output (pagination handled in memory) ----------
    const total = filteredRows.length;
    const paginatedRows = filteredRows
      .slice(options.skip, options.skip + options.limit)
      .map(row => [
        row.category,
        `$${(row.budget / 1_000_000).toFixed(1)}M`,
        `$${(row.actual / 1_000_000).toFixed(1)}M`,
        `${row.variance >= 0 ? "+" : ""}$${(Math.abs(row.variance) / 1_000_000).toFixed(1)}M (${Math.abs(row.variancePercent)}%)`,
        row.status
      ]);

    const headers = ["Category", "Budget", "Actual", "Variance", "Status"];

    // Chart data (numeric values in thousands)
    const chartData = filteredRows.map(row => ({
      name: row.category,
      Budget: row.budget / 1_000_000,
      Actual: row.actual / 1_000_000
    }));

    // ---------- 6. KPIs ----------
    const totalBudget = filteredRows.reduce((sum, r) => sum + r.budget, 0);
    const totalActual = filteredRows.reduce((sum, r) => sum + r.actual, 0);
    const budgetVariance = totalBudget === 0 ? 0 : ((totalActual - totalBudget) / totalBudget * 100).toFixed(1);
    const underBudgetCount = filteredRows.filter(r => r.status === "Under").length;
    const underBudgetPercent = total === 0 ? 0 : Math.round((underBudgetCount / total) * 100);

    res.json({
      rows: paginatedRows,
      headers,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        budgetVariance: `${budgetVariance}%`,
        underBudget: `${underBudgetPercent}%`
      },
      chart: chartData
    });
  } catch (error) {
    console.error("Budget vs actual error:", error);
    res.status(500).json({ message: "Budget vs actual error", error });
  }
};