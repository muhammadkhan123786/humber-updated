// controllers/MarketplaceController.ts
import { Request, Response } from "express";
import { EncryptionService } from "../services/encryption.service";
import { marketplaceModel } from "../models/marketplace.models";
import mongoose from "mongoose";

export class MarketplaceController {

  // CREATE CONNECTION
  async create(req: Request, res: Response) {
    try {
      const {
        name,
        credentials,
        type,
        description
      } = req.body;

      if (!name ||  !credentials || !type) {
        return res.status(400).json({
          success: false,
          message: "name, code and credentials object are required",
        });
      }

      const userId = (req as any).user?.id || req.body.userId;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // 🔐 Encrypt credentials object
      const encryptedCredentials = EncryptionService.encrypt(credentials);

      const connection = await marketplaceModel.create({
        userId,
        name,
        credentials: encryptedCredentials,
        type,
        description,
        status: "disconnected",
      });

      console.log("conn", connection)
      return res.status(201).json({
        success: true,
        message: "Marketplace connection created",
        data: connection,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET ALL
  async getAll(req: Request, res: Response) {
    const data = await marketplaceModel.find({ isDeleted: false })
    .populate({
      path: "type",
      select: "_id Icons Color",
       populate: [
      { path: 'icon', select: '_id  icon' },  
      { path: 'color', select: '_id colorCode' }        
    ]
    })
    // .populate("color", "_id colorCode")
    ;
    res.json({ success: true, data });
    console.log("res", data);
  }

  // GET ONE
//   async getById(req: Request, res: Response) {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }

//     const doc = await marketplaceModel.findById(id);
//     if (!doc) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     res.json({ success: true, data: doc });
//   }

  // CONNECT (decrypt + test)
//   async connect(req: Request, res: Response) {
//     const { id } = req.params;

//     const marketplace = await marketplaceModel.findById(id);
//     if (!marketplace) {
//       return res.status(404).json({ message: "Marketplace not found" });
//     }

//     try {
//       const creds = EncryptionService.decrypt(marketplace.credentials);

//       // 👉 Here you call connector (shopify / ebay / amazon)
//       // await testEbayConnection(creds);

//       marketplace.status = "connected";
//       marketplace.lastError = undefined;
//       await marketplace.save();

//       res.json({
//         success: true,
//         message: "Marketplace connected successfully",
//       });
//     } catch (err: any) {
//       marketplace.status = "error";
//       marketplace.lastError = err.message;
//       await marketplace.save();

//       res.status(400).json({
//         success: false,
//         message: "Connection failed",
//         error: err.message,
//       });
//     }
//   }
}