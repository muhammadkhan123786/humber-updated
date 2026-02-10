import { Request, Response } from "express";
import { PurchaseOrder, PurchaseDoc } from "../models/purchaseOrder.model";
import { Types } from "mongoose";
import { SupplierModel } from '../models/suppliers/supplier.models';
import { generatePdfFromTemplate } from '../utils/pdfGenerator';



export class PurchaseOrderCustomController {
  
   getAllWithSearch =  async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        userId,
        sortBy = 'createdAt',
        order = 'desc',
      } = req.query;

      const pageNumber = Number(page);
      const pageSize = Number(limit);
      const skip = (pageNumber - 1) * pageSize;

      // Build base query
      const queryFilters: any = { isDeleted: false };

      if (userId) {
        queryFilters.userId = userId;
      }

      if (status) {
        queryFilters.status = status;
      }

      // Handle search - search in both order fields AND supplier fields
      if (search) {
        const searchTerm = search as string;

        // Step 1: Find suppliers matching the search term
        const matchingSuppliers = await SupplierModel.find({
          isDeleted: false,
          $or: [
            { 'supplierIdentification.legalBusinessName': { $regex: searchTerm, $options: 'i' } },
            { 'supplierIdentification.tradingName': { $regex: searchTerm, $options: 'i' } },
            { 'contactInformation.primaryContactName': { $regex: searchTerm, $options: 'i' } },
            { 'contactInformation.emailAddress': { $regex: searchTerm, $options: 'i' } },
            { 'operationalInformation.orderContactEmail': { $regex: searchTerm, $options: 'i' } },
          ]
        }).select('_id');

        const supplierIds = matchingSuppliers.map((s: any) => s._id);

        // Step 2: Search in order fields OR matching supplier IDs
        queryFilters.$or = [
          { orderNumber: { $regex: searchTerm, $options: 'i' } },
          { orderContactEmail: { $regex: searchTerm, $options: 'i' } },
          { notes: { $regex: searchTerm, $options: 'i' } },
          { supplier: { $in: supplierIds } }, // Include orders with matching suppliers
        ];
      }

      // Build sort option
      const sortOption: any = {};
      sortOption[sortBy as string] = order === 'desc' ? -1 : 1;

      // Execute query with population
      const data = await PurchaseOrder.find(queryFilters)
        .populate('userId', 'email role')
        .populate('supplier') // Populate full supplier details
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .exec();

      const total = await PurchaseOrder.countDocuments(queryFilters);

      res.status(200).json({
        success: true,
        data,
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      });

    } catch (error: any) {
      console.error('❌ Error in getAllWithSearch:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch purchase orders',
      });
    }
  };

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
 exportToPDF = async (req: Request, res: Response) => {
  try {
    const { userId /* filters */ } = req.query;

    const orders = await PurchaseOrder.find({ userId, isDeleted: false })
      .populate('supplier') // This fetches the full nested supplier object
      .sort({ orderDate: -1 })
      .lean();

    const pdfData = {
      companyName: "Humber Mobility Scooter",
      reportTitle: "Purchase Order Report",
      generatedAt: new Date().toLocaleDateString('en-GB'), // Professional UK format
      orders: orders
    };

    const pdfBuffer = await generatePdfFromTemplate('purchase-orders', pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Humber_Orders.pdf');
    res.status(200).send(pdfBuffer);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
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