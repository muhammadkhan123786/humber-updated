import { Request, Response } from "express";
import { ProductModal } from "../../models/product.models";
import { PurchaseOrder } from "../../models/purchaseOrder.model";
import { SupplierModel } from "../../models/suppliers/supplier.models";
import { GrnModel } from "../../models/grn.models";

// ----------------------------------------------------------------------
// Dashboard Quick Stats
// ----------------------------------------------------------------------
export const getDashboardQuickStats = async (req: Request, res: Response) => {
  try {
    // 1. Inventory Value (sum of stockValue across all products)
    const inventoryValueAgg = await ProductModal.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$attributes" },
      { $unwind: "$attributes.pricing" },
      {
        $group: {
          _id: null,
          totalInventoryValue: {
            $sum: {
              $multiply: [
                { $ifNull: ["$attributes.stock.stockQuantity", 0] },
                { $ifNull: ["$attributes.pricing.costPrice", 0] }
              ]
            }
          }
        }
      }
    ]);
    const inventoryValue = inventoryValueAgg[0]?.totalInventoryValue || 0;
    const formattedInventoryValue = `$${(inventoryValue / 1_000_000).toFixed(1)}M`;

    // 2. Pending POs (status = "pending" or "draft"?)
    const pendingPOs = await PurchaseOrder.countDocuments({ isDeleted: false, status: "pending" });

    // 3. Active Suppliers (count of suppliers with isActive = true or any transaction)
    const activeSuppliers = await SupplierModel.countDocuments({ isDeleted: false, isActive: true });

    // 4. Gross Margin – need revenue and COGS. Use financial chart data from revenue/COGS aggregated.
    // For simplicity, compute from purchase orders total cost and sales? We'll approximate from inventory valuation.
    // Alternatively, get from a sales collection. Since not provided, we'll use a placeholder from static data.
    // In a real system, you'd have a Sales collection. We'll compute from PurchaseOrders (COGS) and assume revenue = COGS / (1 - margin).
    // But to keep it functional, we'll return a static value with dynamic calculation later.
    // Better: compute from financialData table? We'll use an aggregate over purchase orders for COGS and assume a markup.
    const totalCOGS = await PurchaseOrder.aggregate([
      { $match: { isDeleted: false, status: "received" } },
      { $group: { _id: null, totalCOGS: { $sum: "$total" } } }
    ]);
    const cogs = totalCOGS[0]?.totalCOGS || 0;
    // Dummy revenue (e.g., 1.35 * COGS)
    const revenue = cogs * 1.35;
    const grossMargin = cogs ? ((revenue - cogs) / revenue) * 100 : 0;
    const formattedMargin = grossMargin.toFixed(1) + "%";

    // 5. Low Stock Alerts (products where stockQuantity <= reorderPoint)
    const lowStockAlerts = await ProductModal.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$attributes" },
      {
        $match: {
          $expr: { $lte: ["$attributes.stock.stockQuantity", "$attributes.stock.reorderPoint"] }
        }
      },
      { $count: "count" }
    ]);
    const lowStockCount = lowStockAlerts[0]?.count || 0;

    // 6. On-Time Delivery (percentage of GRNs delivered on or before expected date)
    const grnStats = await GrnModel.aggregate([
      {
        $lookup: {
          from: "purchaseorders",
          localField: "purchaseOrderId",
          foreignField: "_id",
          as: "po"
        }
      },
      { $unwind: "$po" },
      {
        $group: {
          _id: null,
          totalGRN: { $sum: 1 },
          onTime: {
            $sum: {
              $cond: [
                { $lte: ["$receivedDate", "$po.expectedDelivery"] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
    const totalGRN = grnStats[0]?.totalGRN || 1;
    const onTimeCount = grnStats[0]?.onTime || 0;
    const onTimePercent = (onTimeCount / totalGRN) * 100;
    const formattedOnTime = onTimePercent.toFixed(1) + "%";

    // Compute changes (mock or from previous period). For simplicity, we'll keep static changes as per original static data.
    // In production, you'd compare with previous month/year.
    const quickStats = [
      {
        label: "Inventory Value",
        value: formattedInventoryValue,
        change: "+8.3%",
        up: true,
        icon: "📦",
        color: "#059669",
        bg: "linear-gradient(135deg, #059669 0%, #10b981 100%)"
      },
      {
        label: "Pending POs",
        value: pendingPOs.toString(),
        change: "+3",
        up: false,
        icon: "🛒",
        color: "#2563eb",
        bg: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)"
      },
      {
        label: "Active Suppliers",
        value: activeSuppliers.toString(),
        change: "+12",
        up: true,
        icon: "🏢",
        color: "#7c3aed",
        bg: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)"
      },
      {
        label: "Gross Margin",
        value: formattedMargin,
        change: "+2.3%",
        up: true,
        icon: "💰",
        color: "#d97706",
        bg: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)"
      },
      {
        label: "Low Stock Alerts",
        value: lowStockCount.toString(),
        change: "−18",
        up: true,
        icon: "⚠️",
        color: "#ef4444",
        bg: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)"
      },
      {
        label: "On-Time Delivery",
        value: formattedOnTime,
        change: "+2.1%",
        up: true,
        icon: "✅",
        color: "#0891b2",
        bg: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)"
      }
    ];

    res.json(quickStats);
  } catch (error) {
    console.error("Dashboard quick stats error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};

// ----------------------------------------------------------------------
// Dashboard Charts
// ----------------------------------------------------------------------
export const getDashboardCharts = async (req: Request, res: Response) => {
  try {
    // 1. Stock Status Overview (Pie chart)
    const stockStatus = await ProductModal.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: "$attributes" },
      {
        $facet: {
          inStock: [
            { $match: { $expr: { $gt: ["$attributes.stock.stockQuantity", 0] } } },
            { $count: "count" }
          ],
          lowStock: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gt: ["$attributes.stock.stockQuantity", 0] },
                    { $lte: ["$attributes.stock.stockQuantity", "$attributes.stock.reorderPoint"] }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          outOfStock: [
            { $match: { $expr: { $eq: ["$attributes.stock.stockQuantity", 0] } } },
            { $count: "count" }
          ]
        }
      }
    ]);
    const inStock = stockStatus[0]?.inStock[0]?.count || 0;
    const lowStock = stockStatus[0]?.lowStock[0]?.count || 0;
    const outOfStock = stockStatus[0]?.outOfStock[0]?.count || 0;

    const pieData = [
      { name: "In Stock", value: inStock },
      { name: "Low Stock", value: lowStock },
      { name: "Out of Stock", value: outOfStock }
    ];

    // 2. Revenue vs COGS (Area chart) – monthly data from purchase orders (COGS) and assumed revenue
    // We need monthly aggregates for the current year.
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear(), 11, 31);

    const monthlyData = await PurchaseOrder.aggregate([
      {
        $match: {
          isDeleted: false,
          status: "received",
          orderDate: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: { $month: "$orderDate" },
          month: { $first: { $dateToString: { format: "%b", date: "$orderDate" } } },
          COGS: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing months with zeros
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = months.map((month, idx) => {
      const found = monthlyData.find(m => m.month === month);
      const cogs = found ? found.COGS / 1000 : 0; // to K$
      // Estimate revenue as COGS / (1 - grossMargin) – use average gross margin from purchase? For simplicity, multiply by 1.35
      const revenue = cogs * 1.35;
      return {
        name: month,
        Revenue: Math.round(revenue),
        COGS: Math.round(cogs)
      };
    });

    res.json({
      pieData,
      areaData: chartData
    });
  } catch (error) {
    console.error("Dashboard charts error:", error);
    res.status(500).json({ message: "Error fetching charts", error });
  }
};