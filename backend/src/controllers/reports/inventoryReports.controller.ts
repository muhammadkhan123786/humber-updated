import { Request, Response } from "express";
import { ProductModal }  from "../../models/product.models";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
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

    const lowStockProducts = await ProductModal.aggregate([
      { $unwind: "$attributes" },
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
      {
        $project: {
          productName: 1,
          sku: "$attributes.sku",
          currentStock: "$attributes.stock.stockQuantity",
          reorderPoint: "$attributes.stock.reorderPoint",
          supplier: "$attributes.stock.supplierId"
        }
      }
    ]);

    const outOfStock = await ProductModal.aggregate([
      { $unwind: "$attributes" },
      {
        $match: {
          "attributes.stock.stockQuantity": 0
        }
      },
      { $count: "count" }
    ]);

    res.json({
      kpis: {
        lowStockItems: lowStockProducts.length,
        outOfStock: outOfStock[0]?.count || 0
      },
      table: lowStockProducts
    });

  } catch (error) {
    res.status(500).json({ message: "Low stock report error", error });
  }
};

export const getInventoryValuationReport = async (req: Request, res: Response) => {
  try {

    const valuation = await ProductModal.aggregate([
      { $unwind: "$attributes" },
      { $unwind: "$attributes.pricing" },
      {
        $project: {
          productName: 1,
          sku: "$attributes.sku",
          quantityOnHand: "$attributes.stock.stockQuantity",
          unitCost: "$attributes.pricing.costPrice",
          inventoryValue: {
            $multiply: [
              "$attributes.stock.stockQuantity",
              "$attributes.pricing.costPrice"
            ]
          }
        }
      }
    ]);

    const totalValue = valuation.reduce(
      (acc, item) => acc + item.inventoryValue,
      0
    );

    res.json({
      kpis: {
        totalInventoryValue: totalValue,
        totalProducts: valuation.length
      },
      table: valuation
    });

  } catch (error) {
    res.status(500).json({ message: "Inventory valuation error", error });
  }
};

export const getStockMovementReport = async (req: Request, res: Response) => {
  try {

    const received = await GrnModel.aggregate([
      { $unwind: "$items" },
      {
        $project: {
          date: "$receivedDate",
          productName: "$items.productName",
          sku: "$items.sku",
          movementType: "Stock In",
          quantity: "$items.acceptedQuantity",
          reference: "$grnNumber"
        }
      }
    ]);

    const returns = await GoodsReturn.aggregate([
      { $unwind: "$items" },
      {
        $project: {
          date: "$returnDate",
          productName: "$items.productName",
          sku: "$items.sku",
          movementType: "Return",
          quantity: "$items.returnQty",
          reference: "$grtnNumber"
        }
      }
    ]);

    res.json({
      kpis: {
        totalMovements: received.length + returns.length,
        stockIn: received.length,
        stockOut: returns.length
      },
      table: [...received, ...returns]
    });

  } catch (error) {
    res.status(500).json({ message: "Stock movement error", error });
  }
};