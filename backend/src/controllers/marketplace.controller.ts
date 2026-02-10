import { Request, Response } from "express";
import { Types } from "mongoose";

export class MarketplaceController {
  constructor(private service: any) {}

  // Toggle Active Status
  toggleActive = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid ID" 
        });
      }

      // Find the document
      const doc = await this.service.model.findById(id);
      
      if (!doc) {
        return res.status(404).json({ 
          success: false, 
          message: "Marketplace template not found" 
        });
      }

      // Toggle isActive status
      const currentStatus = doc.isActive;
      const newStatus = !currentStatus;

      const updated = await this.service.model.findByIdAndUpdate(
        id,
        { $set: { isActive: newStatus } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: `Marketplace template ${newStatus ? 'activated' : 'deactivated'} successfully`,
        data: updated
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to toggle active status",
      });
    }
  };

  // Set as Default
  setDefault = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid ID" 
        });
      }

      // Find the document to get userId
      const doc = await this.service.model.findById(id);
      
      if (!doc) {
        return res.status(404).json({ 
          success: false, 
          message: "Marketplace template not found" 
        });
      }

      const userId = doc.userId;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Template does not have a user ID"
        });
      }

      // Step 1: Set all other templates of this user to not default
      await this.service.model.updateMany(
        {
          _id: { $ne: id },
          userId: userId,
          isDeleted: false
        },
        { $set: { isDefault: false } }
      );

      // Step 2: Set this template as default
      const updated = await this.service.model.findByIdAndUpdate(
        id,
        { $set: { isDefault: true } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Marketplace template set as default successfully",
        data: updated
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to set as default",
      });
    }
  };

  // Bulk Update (optional)
  bulkUpdate = async (req: Request, res: Response) => {
    try {
      const { ids, updates } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide an array of IDs"
        });
      }

      // Validate all IDs
      const invalidIds = ids.filter((id: string) => !Types.ObjectId.isValid(id));
      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid IDs: ${invalidIds.join(', ')}`
        });
      }

      // Perform bulk update
      const result = await this.service.model.updateMany(
        {
          _id: { $in: ids.map((id: string) => new Types.ObjectId(id)) }
        },
        { $set: updates }
      );

      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} template(s) updated successfully`,
        data: { modifiedCount: result.modifiedCount }
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update templates",
      });
    }
  };
}