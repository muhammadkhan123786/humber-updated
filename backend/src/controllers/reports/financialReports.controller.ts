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

// Field maps for financial reports (frontend field → MongoDB field)
const COST_ANALYSIS_FIELD_MAP: Record<string, string> = {
  productName: "productName",
  sku: "sku",
  category: "category",
  stockValue: "stockValue",
};

const PROFIT_LOSS_FIELD_MAP: Record<string, string> = {
  purchaseDate: "purchaseDate",
  supplier: "supplierName",      // mapped to computed field after lookup
  product: "product",
  totalCost: "totalCost",
};

const BUDGET_VS_ACTUAL_FIELD_MAP: Record<string, string> = {
  category: "category",
  status: "status",
};

// ----------------------------------------------------------------------
// 1. Cost Analysis Report (inventory valuation by product)
// ----------------------------------------------------------------------
export const getCostAnalysisReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, COST_ANALYSIS_FIELD_MAP);

    const dateFilter: any = {};
    if (options.startDate) dateFilter.$gte = new Date(options.startDate);
    if (options.endDate) dateFilter.$lte = new Date(options.endDate);

    // Base aggregation pipeline
    let pipeline: PipelineStage[] = [
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
        $addFields: {
          productName: 1,
          sku: "$attributes.sku",
          category: "$category.categoryName",
          currentStock: "$attributes.stock.stockQuantity",
          unitCost: "$attributes.pricing.costPrice",
          stockValue: {
            $multiply: ["$attributes.stock.stockQuantity", "$attributes.pricing.costPrice"],
          },
        },
      },
      {
        $project: {
          productName: 1,
          sku: 1,
          category: 1,
          currentStock: 1,
          unitCost: 1,
          stockValue: 1,
          warehouse: { $literal: "Main Warehouse" },
        },
      },
    ];

    // Date filter (if any) – using createdAt or any date field; adjust if needed
    if (options.startDate || options.endDate) {
      pipeline.unshift({ $match: { createdAt: dateFilter } } as PipelineStage);
    }

    // Apply dynamic column filters (productName, sku, category, stockValue)
    pipeline = applyFilters(pipeline, options);

    // Chart: stock value by category
    const chartPipeline: PipelineStage[] = [
      ...pipeline,
      {
        $group: {
          _id: "$category",
          Value: { $sum: "$stockValue" },
        },
      },
      {
        $project: {
          name: { $ifNull: ["$_id", "Uncategorized"] },
          Value: { $round: ["$Value", 0] },
        },
      },
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
                  averageProductCost: { $avg: "$unitCost" },
                  highestValueProduct: { $max: "$stockValue" },
                },
              },
            ],
          },
        },
      ]),
      ProductModal.aggregate(chartPipeline),
    ]);

    const data = mainResult[0] || { paginated: [], totalCount: [], kpis: [] };
    const total = data.totalCount[0]?.count || 0;
    let kpis = data.kpis[0] || {
      totalInventoryValue: 0,
      totalProductsInStock: 0,
      averageProductCost: 0,
      highestValueProduct: 0,
    };

    // Fetch the product name for highest value product
    if (kpis.highestValueProduct) {
      const highest = await ProductModal.aggregate([
        ...pipeline,
        { $sort: { stockValue: -1 } },
        { $limit: 1 },
        { $project: { productName: 1 } },
      ]);
      if (highest[0]) kpis.highestValueProduct = highest[0].productName;
    }

    res.json({
      rows: data.paginated,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        totalInventoryValue: kpis.totalInventoryValue,
        totalProductsInStock: kpis.totalProductsInStock,
        averageProductCost: kpis.averageProductCost,
        highestValueProduct: kpis.highestValueProduct || "N/A",
      },
      chart: chartResult,
    });
  } catch (error) {
    console.error("Cost analysis error:", error);
    res.status(500).json({ message: "Cost analysis error", error });
  }
};

// ----------------------------------------------------------------------
// 2. Profit & Loss Report (with supplier name fix)
// ----------------------------------------------------------------------
export const getProfitLossReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, PROFIT_LOSS_FIELD_MAP);

    const dateFilter: any = {};
    if (options.startDate) dateFilter.$gte = new Date(options.startDate);
    if (options.endDate) dateFilter.$lte = new Date(options.endDate);

    // Base pipeline with proper supplier name extraction
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
        },
      },
      {
        $project: {
          purchaseDate: "$orderDate",
          poNumber: "$orderNumber",
          supplier: "$supplierName",           // ✅ mapped to 'supplier' field
          product: "$items.productName",
          quantity: "$items.quantity",
          unitCost: "$items.unitPrice",
          totalCost: "$items.totalPrice",
        },
      },
    ];

    // Date range filter (as first stage)
    if (options.startDate || options.endDate) {
      basePipeline.unshift({ $match: { orderDate: dateFilter } } as PipelineStage);
    }

    // Apply dynamic column filters (supplier, product, totalCost, purchaseDate)
    basePipeline = applyFilters(basePipeline, options);

    // Chart pipeline: monthly COGS and dummy revenue
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
export const getBudgetVsActualReport = async (req: Request, res: Response) => {
  try {
    let options = buildQueryOptions(req);
    options = mapColumnFilters(options, BUDGET_VS_ACTUAL_FIELD_MAP);

    // Static data (replace with real collection later)
    const staticRows = [
      ["Electronics", "$3.2M", "$3.45M", "+$250K", "Over"],
      ["Furniture", "$1.5M", "$1.48M", "-$20K", "Under"],
      ["Accessories", "$1.0M", "$1.12M", "+$120K", "Over"],
      ["Marketing", "$800K", "$750K", "-$50K", "Under"],
    ];

    // Apply category filter if provided
    let filteredRows = staticRows;
    if (options.columnFilters?.category) {
      const filterVal = options.columnFilters.category.toLowerCase();
      filteredRows = staticRows.filter(row => row[0].toLowerCase().includes(filterVal));
    }

    // Apply status filter if provided
    if (options.columnFilters?.status) {
      const filterVal = options.columnFilters.status.toLowerCase();
      filteredRows = filteredRows.filter(row => row[4].toLowerCase().includes(filterVal));
    }

    const total = filteredRows.length;
    const paginatedRows = filteredRows.slice(options.skip, options.skip + options.limit);

    // Chart data (static, but could be dynamic)
    const chartData = [
      { name: "Electronics", Budget: 3200, Actual: 3450 },
      { name: "Furniture", Budget: 1500, Actual: 1480 },
      { name: "Accessories", Budget: 1000, Actual: 1120 },
      { name: "Marketing", Budget: 800, Actual: 750 },
    ];

    res.json({
      rows: paginatedRows,
      headers: ["Category", "Budget", "Actual", "Variance", "Status"],
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
      kpis: {
        budgetVariance: "+8.2%",
        underBudget: "64%",
      },
      chart: chartData,
    });
  } catch (error) {
    console.error("Budget vs actual error:", error);
    res.status(500).json({ message: "Budget vs actual error", error });
  }
};