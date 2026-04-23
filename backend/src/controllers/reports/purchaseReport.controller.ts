import { Request, Response } from "express";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
import { GrnModel } from "../../models/grn.models"

/**
 * ================================
 * 1. PURCHASE ORDER REPORT
 * ================================
 */
export const getPurchaseOrderReport = async (req: Request, res: Response) => {
  try {
    const orders = await PurchaseOrder.find({ isDeleted: false })
      .populate("supplier", "name")
      .sort({ createdAt: -1 });

    const table = orders.map((po: any) => {
      const totalItems = po.items.length;

      const totalQty = po.items.reduce((acc: number, i: any) => acc + i.quantity, 0);

      const receivedQty = 0; // will be calculated via GRN later if needed
      const pendingQty = totalQty - receivedQty;

      return {
        poNumber: po.orderNumber,
        orderDate: po.orderDate,
        supplierName: po.supplier?.name || "N/A",
        totalItems,
        totalQuantity: totalQty,
        totalAmount: po.total,
        receivedQuantity: receivedQty,
        pendingQuantity: pendingQty,
        status: po.status,
        createdBy: po.createdBy || "N/A"
      };
    });

    const totalPO = orders.length;
    const pending = orders.filter(o => o.status === "pending").length;
    const completed = orders.filter(o => o.status === "received").length;
    const cancelled = orders.filter(o => o.status === "cancelled").length;

    const totalValue = orders.reduce((acc, o) => acc + o.total, 0);

    res.json({
      kpis: {
        totalPurchaseOrders: totalPO,
        pendingPurchaseOrders: pending,
        completedPurchaseOrders: completed,
        cancelledPurchaseOrders: cancelled,
        totalPurchaseValue: totalValue
      },
      table
    });

  } catch (error) {
    res.status(500).json({ message: "Purchase order report error", error });
  }
};


/**
 * ================================
 * 2. GOODS RECEIVED (GRN REPORT)
 * ================================
 */
export const getGRNReport = async (req: Request, res: Response) => {
  try {
    const grns = await GrnModel.find()
      .populate("purchaseOrderId", "orderNumber")
      .sort({ createdAt: -1 });

    let totalItemsReceived = 0;
    let totalValue = 0;

    const table: any[] = [];

    grns.forEach((grn: any) => {
      grn.items.forEach((item: any) => {

        const totalCost = item.acceptedQuantity * item.unitPrice;

        totalItemsReceived += item.acceptedQuantity;
        totalValue += totalCost;

        table.push({
          grnNumber: grn.grnNumber,
          grnDate: grn.receivedDate,
          poNumber: grn.purchaseOrderId?.orderNumber || "N/A",
          supplierName: "N/A", // optional (can be linked via PO if needed)
          productName: item.productName,
          sku: item.sku,
          orderedQuantity: item.orderedQuantity || 0,
          receivedQuantity: item.receivedQuantity,
          remainingQuantity: (item.orderedQuantity || 0) - item.receivedQuantity,
          unitCost: item.unitPrice,
          totalCost,
          warehouse: "N/A",
          receivedBy: grn.receivedBy
        });
      });
    });

    res.json({
      kpis: {
        totalGRN: grns.length,
        totalItemsReceived,
        totalPurchaseValueReceived: totalValue,
        pendingDeliveries: table.filter(i => i.remainingQuantity > 0).length
      },
      table
    });

  } catch (error) {
    res.status(500).json({ message: "GRN report error", error });
  }
};


/**
 * ================================
 * 3. PURCHASE SUMMARY (SUPPLIER)
 * ================================
 */
export const getPurchaseSummaryReport = async (req: Request, res: Response) => {
  try {

    const summary = await PurchaseOrder.aggregate([
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
        $group: {
          _id: "$supplier._id",
          supplierName: { $first: "$supplier.name" },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: { $sum: "$items.quantity" } },
          totalAmount: { $sum: "$total" },
          lastPurchaseDate: { $max: "$orderDate" }
        }
      },

      {
        $project: {
          supplierName: 1,
          totalOrders: 1,
          totalQuantityPurchased: "$totalQuantity",
          totalPurchaseAmount: "$totalAmount",
          avgOrderValue: {
            $divide: ["$totalAmount", "$totalOrders"]
          },
          lastPurchaseDate: 1,
          topProductPurchased: "N/A"
        }
      }
    ]);

    const totalPurchaseAmount = summary.reduce((acc, s) => acc + s.totalPurchaseAmount, 0);
    const totalOrders = summary.reduce((acc, s) => acc + s.totalOrders, 0);
    const totalProducts = summary.reduce((acc, s) => acc + s.totalQuantityPurchased, 0);

    const topSupplier = summary.sort((a, b) => b.totalPurchaseAmount - a.totalPurchaseAmount)[0];

    res.json({
      kpis: {
        totalPurchaseAmount,
        totalPurchaseOrders: totalOrders,
        averagePurchaseValue: totalPurchaseAmount / (totalOrders || 1),
        topSupplier: topSupplier?.supplierName || "N/A",
        totalProductsPurchased: totalProducts
      },
      table: summary
    });

  } catch (error) {
    res.status(500).json({ message: "Purchase summary error", error });
  }
};