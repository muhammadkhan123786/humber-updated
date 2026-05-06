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

// ✅ Get all users (with filters)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const { search, status, role, page = 1, limit = 10 } = req.query;
        const adminShopId = req.shopId;

        if (!adminShopId) {
            return res.status(400).json({ message: "Shop context missing" });
        }

        // Build filter
        let filter: any = { shopId: adminShopId, isDeleted: false };

        // Search by name or email
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by role
        if (role && role !== "all") {
            filter.role = role;
        }

        // Filter by status (active/inactive/locked)
        if (status && status !== "all") {
            if (status === "active") {
                filter.isActive = true;
                filter.isLocked = false;
            } else if (status === "inactive") {
                filter.isActive = false;
            } else if (status === "locked") {
                filter.isLocked = true;
            }
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            User.countDocuments(filter),
        ]);

        return res.status(200).json({
            users,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (error: any) {
        console.error("Get users error:", error);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};

// ✅ Get user stats for dashboard
export const getUserStats = async (req: AuthRequest, res: Response) => {
    try {
        const adminShopId = req.shopId;

        if (!adminShopId) {
            return res.status(400).json({ message: "Shop context missing" });
        }

        const filter = { shopId: adminShopId, isDeleted: false };

        const [totalUsers, activeUsers, lockedUsers] = await Promise.all([
            User.countDocuments(filter),
            User.countDocuments({ ...filter, isActive: true, isLocked: false }),
            User.countDocuments({ ...filter, isLocked: true }),
        ]);

        // Get unique roles count
        const roles = await User.distinct("role", filter);

        return res.status(200).json({
            totalUsers,
            activeUsers,
            lockedUsers,
            totalRoles: roles.length,
        });
    } catch (error: any) {
        console.error("Get stats error:", error);
        return res.status(500).json({ message: "Failed to fetch stats" });
    }
};

// ✅ Lock/Unlock user
export const toggleUserLock = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const adminShopId = req.shopId;

        if (!adminShopId) {
            return res.status(400).json({ message: "Shop context missing" });
        }

        // Find user in the same shop
        const user = await User.findOne({ _id: id, shopId: adminShopId, isDeleted: false });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Toggle lock status
        user.isLocked = !user.isLocked;
        await user.save();

        return res.status(200).json({
            message: user.isLocked ? "User locked successfully" : "User unlocked successfully",
            isLocked: user.isLocked,
        });
    } catch (error: any) {
        console.error("Toggle lock error:", error);
        return res.status(500).json({ message: "Failed to toggle user lock" });
    }
};

// ✅ Get single user by ID
export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const adminShopId = req.shopId;

        const user = await User.findOne({ _id: id, shopId: adminShopId, isDeleted: false }).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error: any) {
        console.error("Get user error:", error);
        return res.status(500).json({ message: "Failed to fetch user" });
    }
};