import { Request, Response } from "express";
import { VechicleBrand } from "../models/vehicleBrand.models"; // adjust path
import { Types } from "mongoose";

/* ------------------------------------------
   CREATE VEHICLE BRAND
------------------------------------------- */
export const createVehicleBrand = async (req: Request, res: Response) => {
    try {
        const { brandName, isDefault, userId } = req.body;

        if (!brandName) {
            return res.status(400).json({ message: "Brand name is required" });
        }
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // If isDefault is true, unset other defaults
        if (isDefault) {
            await VechicleBrand.updateMany(
                { userId, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        const newBrand = new VechicleBrand({
            userId: new Types.ObjectId(userId),
            brandName,
            isDefault: !!isDefault,
        });

        const savedBrand = await newBrand.save();

        res.status(201).json({ success: true, data: savedBrand });
    } catch (error) {
        console.error("Error creating brand:", error);
        res.status(500).json({ success: false, message: "Failed to create brand" });
    }
};

/* ------------------------------------------
   GET VEHICLE BRANDS
------------------------------------------- */
export const getVehicleBrands = async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;

        const filter = {
            isActive: true,
            isDeleted: false,
            ...(userId ? { userId } : {}),
        };

        const vehicleBrands = await VechicleBrand.find(filter).sort({ brandName: 1 });

        res.status(200).json({ success: true, data: vehicleBrands });
    } catch (error) {
        console.error("Error fetching vehicle brands:", error);
        res.status(500).json({ success: false, message: "Failed to fetch vehicle brands" });
    }
};

/* ------------------------------------------
   UPDATE VEHICLE BRAND
------------------------------------------- */
export const updateVehicleBrand = async (req: Request, res: Response) => {
    try {
        const { brandId } = req.params;
        const { brandName, isDefault, isActive } = req.body;
        const userId = req.body.userId;

        if (!Types.ObjectId.isValid(brandId)) {
            return res.status(400).json({ message: "Invalid brand ID" });
        }

        const brand = await VechicleBrand.findOne({
            _id: brandId,
            userId,
            isDeleted: false,
        });

        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        if (isDefault) {
            // Unset other defaults
            await VechicleBrand.updateMany(
                { userId, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        brand.brandName = brandName ?? brand.brandName;
        brand.isDefault = isDefault ?? brand.isDefault;
        brand.isActive = isActive ?? brand.isActive;

        const updatedBrand = await brand.save();

        res.status(200).json({ success: true, data: updatedBrand });
    } catch (error) {
        console.error("Error updating brand:", error);
        res.status(500).json({ success: false, message: "Failed to update brand" });
    }
};

/* ------------------------------------------
   DELETE VEHICLE BRAND (soft delete)
------------------------------------------- */
export const deleteVehicleBrand = async (req: Request, res: Response) => {
    try {
        const { brandId } = req.params;
        const userId = req.body.userId;

        if (!Types.ObjectId.isValid(brandId)) {
            return res.status(400).json({ message: "Invalid brand ID" });
        }

        const brand = await VechicleBrand.findOne({
            _id: brandId,
            userId,
            isDeleted: false,
        });

        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        brand.isDeleted = true;
        await brand.save();

        res.status(200).json({ success: true, message: "Brand deleted successfully" });
    } catch (error) {
        console.error("Error deleting brand:", error);
        res.status(500).json({ success: false, message: "Failed to delete brand" });
    }
};
