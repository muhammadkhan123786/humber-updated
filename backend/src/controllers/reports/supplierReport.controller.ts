import { Request, Response } from "express";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
import { GrnModel } from "../../models/grn.models"

export const getSupplierHistoryReport = async (req: Request, res: Response) => {
  try {

    const data = await PurchaseOrder.aggregate([
      { $match: { isDeleted: false } },

      // Supplier
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplier"
        }
      },
      { $unwind: "$supplier" },

      // Items
      { $unwind: "$items" },

      // GRN join
      {
        $lookup: {
          from: "goodsreceiveds",
          localField: "_id",
          foreignField: "purchaseOrderId",
          as: "grn"
        }
      },

      {
        $addFields: {
          grnItem: {
            $first: {
              $filter: {
                input: { $ifNull: [{ $arrayElemAt: ["$grn.items", 0] }, []] },
                as: "g",
                cond: { $eq: ["$$g.sku", "$items.sku"] }
              }
            }
          }
        }
      },

      // Goods Return join
      {
        $lookup: {
          from: "goodsreturns",
          localField: "items.sku",
          foreignField: "items.sku",
          as: "returns"
        }
      },

      {
        $addFields: {
          returnedQty: {
            $sum: "$returns.items.returnQty"
          }
        }
      },

      {
        $project: {
          supplierName: "$supplier.name",
          poNumber: "$orderNumber",
          grnNumber: { $arrayElemAt: ["$grn.grnNumber", 0] },
          productName: "$items.productName",
          sku: "$items.sku",
          orderedQuantity: "$items.quantity",
          receivedQuantity: { $ifNull: ["$grnItem.acceptedQuantity", 0] },
          returnedQuantity: { $ifNull: ["$returnedQty", 0] },
          unitCost: "$items.unitPrice",
          totalAmount: "$items.totalPrice",
          orderDate: "$orderDate",
          deliveryDate: { $arrayElemAt: ["$grn.receivedDate", 0] }
        }
      }
    ]);

    // KPIs
    const totalSuppliers = new Set(data.map(i => i.supplierName)).size;
    const totalPurchases = data.length;
    const totalPurchaseValue = data.reduce((a, i) => a + (i.totalAmount || 0), 0);
    const totalReceived = data.reduce((a, i) => a + (i.receivedQuantity || 0), 0);
    const totalReturns = data.reduce((a, i) => a + (i.returnedQuantity || 0), 0);

    res.json({
      kpis: {
        totalSuppliers,
        totalPurchases,
        totalPurchaseValue,
        totalGoodsReceived: totalReceived,
        totalReturnsToSuppliers: totalReturns
      },
      table: data
    });

  } catch (error) {
    res.status(500).json({ message: "Supplier history error", error });
  }
};


export const getSupplierPerformanceReport = async (req: Request, res: Response) => {
  try {

    const data = await PurchaseOrder.aggregate([
      { $match: { isDeleted: false } },

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
          from: "goodsreceiveds",
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
          }
        }
      },

      {
        $group: {
          _id: "$supplier._id",
          supplierName: { $first: "$supplier.name" },
          totalOrders: { $sum: 1 },
          totalDelivered: { $sum: "$delivered" },
          lateDeliveries: { $sum: "$late" },
          totalPurchaseValue: { $sum: "$total" }
        }
      },

      {
        $project: {
          supplierName: 1,
          totalOrders: 1,
          totalDelivered: 1,
          lateDeliveries: 1,
          onTimeDeliveries: { $subtract: ["$totalDelivered", "$lateDeliveries"] },
          avgDeliveryDays: 3, // optional logic later
          totalPurchaseValue: 1,
          returnedItems: 1,
          supplierRating: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$totalDelivered", "$lateDeliveries"] },
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
    ]);

    res.json({
      kpis: {
        totalActiveSuppliers: data.length,
        onTimeDeliveries: data.reduce((a, i) => a + i.onTimeDeliveries, 0),
        lateDeliveries: data.reduce((a, i) => a + i.lateDeliveries, 0),
        avgDeliveryTime: "N/A",
        supplierRatingScore: "Dynamic"
      },
      table: data
    });

  } catch (error) {
    res.status(500).json({ message: "Supplier performance error", error });
  }
};

export const getSupplierPriceHistoryReport = async (req: Request, res: Response) => {
  try {

    const data = await PurchaseOrder.aggregate([
      { $match: { isDeleted: false } },
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
    ]);

    res.json({
      kpis: {
        totalProductsTracked: data.length,
        avgPurchasePrice: 0,
        highestPrice: Math.max(...data.map(i => i.currentPrice || 0)),
        lowestPrice: Math.min(...data.map(i => i.currentPrice || 0)),
        priceChangePercent: 0
      },
      table: data
    });

  } catch (error) {
    res.status(500).json({ message: "Price history error", error });
  }
};