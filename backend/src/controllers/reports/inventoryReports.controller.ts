import { Request, Response } from "express";
import { ProductModal }  from "../../models/product.models";

import { GrnModel } from "../../models/grn.models"
import { GoodsReturn }   from "../../models/goodsReturn.model";


export const getStockSummaryReport = async (req: Request, res: Response) => {
  try {

    const products = await ProductModal.aggregate([

      { $match: { isDeleted: false } },

      { $unwind: "$attributes" },

      { $unwind: "$attributes.pricing" },

      // JOIN CATEGORY
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true
        }
      },

      // PURCHASE QTY
      {
        $lookup: {
          from: "purchaseorders",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            {
              $match: {
                $expr: { $eq: ["$items.sku", "$$sku"] }
              }
            },
            {
              $group: {
                _id: null,
                purchasedQty: { $sum: "$items.quantity" }
              }
            }
          ],
          as: "purchaseData"
        }
      },

      // RECEIVED QTY
      {
        $lookup: {
          from: "grns",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            {
              $match: {
                $expr: { $eq: ["$items.sku", "$$sku"] }
              }
            },
            {
              $group: {
                _id: null,
                receivedQty: { $sum: "$items.acceptedQuantity" }
              }
            }
          ],
          as: "grnData"
        }
      },

      // RETURNS
      {
        $lookup: {
          from: "goodsreturns",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            {
              $match: {
                $expr: { $eq: ["$items.sku", "$$sku"] }
              }
            },
            {
              $group: {
                _id: null,
                returnedQty: { $sum: "$items.returnQty" }
              }
            }
          ],
          as: "returnData"
        }
      },

      {
        $project: {

          productName: 1,

          sku: "$attributes.sku",

          category: "$category.categoryName",

          openingStock: "$attributes.stock.openingStock",

          purchasedQty: {
            $ifNull: [{ $arrayElemAt: ["$purchaseData.purchasedQty", 0] }, 0]
          },

          soldQty: {
            $ifNull: ["$attributes.stock.soldQty", 0]
          },

          returnedQty: {
            $ifNull: [{ $arrayElemAt: ["$returnData.returnedQty", 0] }, 0]
          },

          adjustmentQty: {
            $ifNull: ["$attributes.stock.adjustmentQty", 0]
          },

          closingStock: "$attributes.stock.stockQuantity",

          unitCost: "$attributes.pricing.costPrice",

          stockValue: {
            $multiply: [
              "$attributes.stock.stockQuantity",
              "$attributes.pricing.costPrice"
            ]
          }
        }
      }

    ]);

    // KPIs
    const totalProducts = products.length;

    const availableStock = products.reduce(
      (sum, p) => sum + (p.closingStock || 0),
      0
    );

    const incomingStock = products.reduce(
      (sum, p) => sum + (p.purchasedQty || 0),
      0
    );

    const outgoingStock = products.reduce(
      (sum, p) => sum + (p.soldQty || 0),
      0
    );

    const totalInventoryValue = products.reduce(
      (sum, p) => sum + (p.stockValue || 0),
      0
    );

    res.json({
      kpis: {
        totalProducts,
        availableStock,
        incomingStock,
        outgoingStock,
        totalInventoryValue
      },
      table: products
    });

  } catch (error) {

    res.status(500).json({
      message: "Stock summary report error",
      error
    });

  }
};


export const getLowStockReport = async (req: Request, res: Response) => {
  try {

    const data = await ProductModal.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$attributes" },

      // ✅ Category Join
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      // ✅ Purchase Orders Join (for last purchase date)
      {
        $lookup: {
          from: "purchaseorders",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            {
              $match: {
                $expr: { $eq: ["$items.sku", "$$sku"] }
              }
            },
            { $sort: { orderDate: -1 } }, // latest first
            { $limit: 1 }
          ],
          as: "lastPurchase"
        }
      },
      { $unwind: { path: "$lastPurchase", preserveNullAndEmptyArrays: true } },

      // ✅ Filter Low Stock
      {
        $match: {
          $expr: {
            $lte: [
              "$attributes.stock.stockQuantity",
              "$attributes.stock.reorderPoint"
            ]
          }
        }
      },

      // ✅ Add Fields
      {
        $addFields: {
          stockStatus: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$attributes.stock.stockQuantity", 0] },
                  then: "Out of Stock"
                },
                {
                  case: {
                    $lte: [
                      "$attributes.stock.stockQuantity",
                      "$attributes.stock.minStockLevel"
                    ]
                  },
                  then: "Critical"
                }
              ],
              default: "Low"
            }
          },

          reorderQuantity: {
            $max: [
              {
                $subtract: [
                  "$attributes.stock.maxStockLevel",
                  "$attributes.stock.stockQuantity"
                ]
              },
              0
            ]
          }
        }
      },

      // ✅ Final Projection
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

          lastPurchaseDate: "$lastPurchase.orderDate"
        }
      }
    ]);

    // ✅ KPIs
    const lowStockItems = data.length;
    const criticalStock = data.filter(i => i.stockStatus === "Critical").length;
    const outOfStock = data.filter(i => i.stockStatus === "Out of Stock").length;
    const reorderRequired = data.filter(i => i.reorderQuantity > 0).length;

    res.json({
      kpis: {
        lowStockItems,
        criticalStock,
        outOfStock,
        reorderRequired
      },
      table: data
    });

  } catch (error) {
    res.status(500).json({
      message: "Low stock report error",
      error
    });
  }
};

export const getInventoryValuationReport = async (req: Request, res: Response) => {
  try {

    const data = await ProductModal.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$attributes" },
      { $unwind: "$attributes.pricing" },

      // ✅ Category
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      // ✅ Purchase Orders (for Total Purchase Value)
      {
        $lookup: {
          from: "purchaseorders",
          let: { sku: "$attributes.sku" },
          pipeline: [
            { $unwind: "$items" },
            {
              $match: {
                $expr: { $eq: ["$items.sku", "$$sku"] }
              }
            },
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
            $multiply: [
              "$attributes.stock.stockQuantity",
              "$attributes.pricing.costPrice"
            ]
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

          totalPurchaseValue: {
            $ifNull: ["$purchaseData.totalPurchaseValue", 0]
          }
        }
      }
    ]);

    // ✅ KPIs
    const totalInventoryValue = data.reduce((acc, i) => acc + i.inventoryValue, 0);
    const totalPurchaseValue = data.reduce((acc, i) => acc + i.totalPurchaseValue, 0);

    const highest = [...data].sort((a, b) => b.inventoryValue - a.inventoryValue)[0];
    const lowest = [...data].sort((a, b) => a.inventoryValue - b.inventoryValue)[0];

    res.json({
      kpis: {
        totalInventoryValue,
        totalPurchaseValue, // ✅ NEW KPI
        averageProductCost: totalInventoryValue / (data.length || 1),
        highestValueProduct: highest?.productName,
        lowestValueProduct: lowest?.productName
      },
      table: data
    });

  } catch (error) {
    res.status(500).json({
      message: "Inventory valuation error",
      error
    });
  }
};

export const getStockMovementReport = async (req: Request, res: Response) => {
  try {

    const stockIn = await GrnModel.aggregate([
      { $unwind: "$items" },
      {
        $project: {
          date: "$receivedDate",
          productName: "$items.productName",
          sku: "$items.sku",
          movementType: "Purchase",
          quantityIn: "$items.acceptedQuantity",
          quantityOut: 0,
          reference: "$grnNumber"
        }
      }
    ]);

    const stockOut = await GoodsReturn.aggregate([
      { $unwind: "$items" },
      {
        $project: {
          date: "$returnDate",
          productName: "$items.productName",
          sku: "$items.sku",
          movementType: "Return",
          quantityIn: 0,
          quantityOut: "$items.returnQty",
          reference: "$grtnNumber"
        }
      }
    ]);

    const combined = [...stockIn, ...stockOut];

    const totalStockIn = combined.reduce((acc, i) => acc + i.quantityIn, 0);
    const totalStockOut = combined.reduce((acc, i) => acc + i.quantityOut, 0);

    res.json({
      kpis: {
        totalMovements: combined.length,
        totalStockIn,
        totalStockOut,
        adjustments: 0 // future: add manual adjustments
      },
      table: combined
    });

  } catch (error) {
    res.status(500).json({ message: "Stock movement error", error });
  }
};