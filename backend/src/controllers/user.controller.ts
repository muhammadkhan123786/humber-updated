// controllers/user.controller.ts
import { Request, Response } from "express";
import { User } from "../models/user.models";
import { AuthRequest } from "../middleware/auth.middleware";

export const createUserByAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const {
            fullName,
            username,
            email,
            phone,
            department,
            password,
            role,
            hasAccessPeriod,
            startDate,
            endDate,
        } = req.body;

        // ✅ Get shopId from the authenticated admin (attached by adminProtecter)
        const adminShopId = req.shopId;

        if (!adminShopId) {
            return res.status(400).json({ message: "Admin shop context missing" });
        }

        // Check if email already exists in this shop
        const existingUser = await User.findOne({ email, shopId: adminShopId });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists in this shop" });
        }

        // Check username uniqueness (global or per shop – your choice)
        if (username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(409).json({ message: "Username already taken" });
            }
        }

        // Create user data
        const userData: any = {
            email,
            password,
            role,
            shopId: adminShopId,
            isActive: true,
            isDeleted: false,
            fullName,
            username,
            phone,
            department,
        };

        // Add access period if enabled
        if (hasAccessPeriod && startDate && endDate) {
            userData.accessStartDate = new Date(startDate);
            userData.accessEndDate = new Date(endDate);
        }

        // Create user
        const [newUser] = await User.create([userData]);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser.toObject();

        return res.status(201).json({
            message: "User created successfully",
            user: userWithoutPassword,
        });
    } catch (error: any) {
        console.error("Create user error:", error);
        return res.status(500).json({
            message: "Failed to create user",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};