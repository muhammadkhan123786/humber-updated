import { Request, Response } from "express";
import { PurchaseOrder, PurchaseDoc } from "../models/purchaseOrder.model";
import { Types } from "mongoose";


export class PurchaseOrderCustomController {
  

  updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }

      const validStatuses = ['draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
      }

      const updated = await PurchaseOrder.findByIdAndUpdate(
        id,
        { 
          status,
          updatedBy: req.body.userId ? new Types.ObjectId(req.body.userId) : undefined
        },
        { new: true, runValidators: true }
      ).populate(['userId']);

      if (!updated) {
        return res.status(404).json({ success: false, message: "Purchase order not found" });
      }

      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ 
        success: false, 
        message: err.message || "Failed to update status" 
      });
    }
  };

  /**
   * Generate next order number
   */
  generateNextOrderNumber = async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId || req.body.userId;
      
      if (!userId || !Types.ObjectId.isValid(userId as string)) {
        return res.status(400).json({ success: false, message: "Valid userId required" });
      }

      const currentYear = new Date().getFullYear();

      // Find the latest order for this user in current year
      const latestOrder = await PurchaseOrder
        .findOne({
        //   userId: new Types.ObjectId(userId as string),
          orderNumber: new RegExp(`^PO-${currentYear}-`),
          isDeleted: false
        })
        .sort({ createdAt: -1 })
        .exec();

      let nextNumber = 1;
      if (latestOrder?.orderNumber) {
        const match = latestOrder.orderNumber.match(/PO-\d{4}-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      const nextOrderNumber = `PO-${currentYear}-${String(nextNumber).padStart(3, '0')}`;

      res.status(200).json({ success: true, nextOrderNumber });
    } catch (err: any) {
      res.status(500).json({ 
        success: false, 
        message: err.message || "Failed to generate order number" 
      });
    }
  };

  /**
   * Get purchase order statistics for dashboard
   */
  getStats = async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId;

      if (!userId || !Types.ObjectId.isValid(userId as string)) {
        return res.status(400).json({ success: false, message: "Valid userId required" });
      }

      const userIdObj = new Types.ObjectId(userId as string);

      // Aggregate statistics
      const stats = await PurchaseOrder.aggregate([
        { 
          $match: { 
            userId: userIdObj,
            isDeleted: false 
          } 
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            totalAmount: { $sum: "$total" },
            draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
            approved: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
            ordered: { $sum: { $cond: [{ $eq: ["$status", "ordered"] }, 1, 0] } },
            received: { $sum: { $cond: [{ $eq: ["$status", "received"] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } }
          }
        }
      ]);

      const result = stats[0] || {
        total: 0,
        totalAmount: 0,
        draft: 0,
        pending: 0,
        approved: 0,
        ordered: 0,
        received: 0,
        cancelled: 0
      };

      res.status(200).json({
        success: true,
        total: result.total,
        totalAmount: result.totalAmount,
        pendingOrders: result.pending + result.approved,
        byStatus: {
          draft: result.draft,
          pending: result.pending,
          approved: result.approved,
          ordered: result.ordered,
          received: result.received,
          cancelled: result.cancelled
        }
      });
    } catch (err: any) {
      res.status(500).json({ 
        success: false, 
        message: err.message || "Failed to fetch statistics" 
      });
    }
  };

  /**
   * Export purchase orders to CSV
   */
  exportToCSV = async (req: Request, res: Response) => {
    try {
      const { userId, status, startDate, endDate, supplier } = req.query;

      if (!userId || !Types.ObjectId.isValid(userId as string)) {
        return res.status(400).json({ success: false, message: "Valid userId required" });
      }

      const filters: any = {
        userId: new Types.ObjectId(userId as string),
        isDeleted: false
      };

      if (status && status !== 'all') filters.status = status;
      if (supplier) filters.supplier = { $regex: supplier, $options: 'i' };
      if (startDate || endDate) {
        filters.orderDate = {};
        if (startDate) filters.orderDate.$gte = new Date(startDate as string);
        if (endDate) filters.orderDate.$lte = new Date(endDate as string);
      }

      const orders = await PurchaseOrder.find(filters).sort({ orderDate: -1 });

      // Generate CSV
      const csvHeader = 'Order Number,Supplier,Contact,Order Date,Expected Delivery,Status,Subtotal,Tax,Total,Notes\n';
      const csvRows = orders.map(order => {
        const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
        const expectedDelivery = new Date(order.expectedDelivery).toISOString().split('T')[0];
        return `"${order.orderNumber}","${order.supplier}","${order.supplierContact}","${orderDate}","${expectedDelivery}","${order.status}",${order.subtotal},${order.tax},${order.total},"${order.notes || ''}"`;
      }).join('\n');

      const csv = csvHeader + csvRows;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=purchase-orders.csv');
      res.status(200).send(csv);
    } catch (err: any) {
      res.status(500).json({ 
        success: false, 
        message: err.message || "Failed to export orders" 
      });
    }
  };

  /**
   * Bulk update purchase orders
   */
  bulkUpdate = async (req: Request, res: Response) => {
    // try {
    //   const { ids, updates, updatedBy } = req.body;

    //   if (!ids || !Array.isArray(ids) || ids.length === 0) {
    //     return res.status(400).json({ success: false, message: "IDs array required" });
    //   }

    //   if (!updates || typeof updates !== 'object') {
    //     return res.status(400).json({ success: false, message: "Updates object required" });
    //   }

    //   const objectIds = ids
    //     .filter(id => Types.ObjectId.isValid(id))
    //     .map(id => new Types.ObjectId(id));

    //   if (objectIds.length === 0) {
    //     return res.status(400).json({ success: false, message: "No valid IDs provided" });
    //   }

    //   const updateData: any = { ...updates };
    //   if (updatedBy && Types.ObjectId.isValid(updatedBy)) {
    //     updateData.updatedBy = new Types.ObjectId(updatedBy);
    //   }

    //   const result = await PurchaseOrder.updateMany(
    //     { _id: { $in: objectIds }},
    //     { $set: updateData }
    //   );

    //   res.status(200).json({
    //     success: true,
    //     message: `${result.modifiedCount} orders updated`,
    //     updatedCount: result.modifiedCount
    //   });
    // } catch (err: any) {
    //   res.status(500).json({ 
    //     success: false, 
    //     message: err.message || "Failed to bulk update orders" 
    //   });
    // }
  };
}

export const purchaseOrderCustomController = new PurchaseOrderCustomController();