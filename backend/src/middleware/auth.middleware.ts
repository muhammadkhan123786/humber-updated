import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Roles, User } from '../models/user.models';
import { Technicians } from '../models/technician-models/technician.models';
import { JwtPayload } from '../services/auth.service';

export interface AuthRequest extends Request {
    user?: any;
    role?: Roles;
    technician?: any
    technicianId?: string
}

export interface TechnicianAuthRequest extends Request {
    user?: any;
    role?: Roles;
    technicianId?: string;
}


//admin protector operations middleware.
export const adminProtecter = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {

        let userId: string | null = null;
        let role: Roles | null = null;

        /* ===================================================
           ✅ 1. MOBILE FLOW (adminId)
        ==================================================== */

        const adminId =
            req.body?.adminId ||
            (req.headers["x-admin-id"] as string | undefined);

        if (adminId) {
            const mobileUser = await User.findById(adminId)
                .select("_id role isDeleted");

            if (!mobileUser || mobileUser.isDeleted) {
                return res.status(401).json({
                    message: "Mobile admin not found",
                });
            }

            userId = mobileUser._id.toString();
            role = mobileUser.role as Roles;
        }

        /* ===================================================
           ✅ 2. JWT FLOW (WEB)
        ==================================================== */
        else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            const token = req.headers.authorization.split(" ")[1];

            if (!token) {
                return res.status(401).json({
                    message: "Not authorized, token missing",
                });
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as { id: string; role: Roles };

            userId = decoded.id;
            role = decoded.role;
        }

        /* ===================================================
           ❌ NO AUTH PROVIDED
        ==================================================== */
        else {
            return res.status(401).json({
                message: "Not authorized",
            });
        }

        /* ===================================================
           ✅ UNIFIED ATTACH (IDENTICAL STRUCTURE)
           Controllers DO NOT CHANGE
        ==================================================== */

        req.user = { id: userId };
        req.role = role;

        /* ===================================================
           🔐 ROLE GUARD
        ==================================================== */

        if (role !== "Admin") {
            return res.status(403).json({
                message: "Not authorized, Admin access only",
            });
        }

        return next();

    } catch (error) {
        console.error("ADMIN PROTECTOR ERROR:", error);

        return res.status(401).json({
            message: "Authentication failed",
        });
    }
};

//technician protector operations middleware.
export const technicianProtecter = (
    req: TechnicianAuthRequest,
    res: Response,
    next: NextFunction
) => {
    console.log("Technician protector middleware invoked");

    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, token missing",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        if (decoded.role !== "Technician" && decoded.role !== "Admin") {
            return res.status(401).json({
                message: "Not authorized, token invalid",
            });
        }

        // ✅ Role check FIRST
        if (decoded.role === "Technician" || decoded.role === 'Admin') {
            // ✅ Attach to request
            req.user = decoded;
            req.role = decoded.role;
            req.technicianId = decoded.technicianId;
        }
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, token invalid",
        });
    }
};

//customer protector operations middleware.
export const customerProtecter = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, token missing" });
        return; // ✅ return void
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { id: string; role: Roles };

        // attach user info to request
        req.user = decoded;
        req.role = decoded.role;

        if (decoded.role !== "Customer") {
            res.status(403).json({ message: "Not authorized, Customer access only" });
            return; // ✅ return void
        }

        next(); // ✅ continue to next middleware
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token invalid" });
        return; // ✅ return void
    }
};


//driver protector operations middleware.
export const driverProtecter = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, token missing" });
        return; // ✅ return void
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { id: string; role: Roles };

        // attach user info to request
        req.user = decoded;
        req.role = decoded.role;

        if (decoded.role !== "Driver") {
            res.status(403).json({ message: "Not authorized, Driver access only" });
            return; // ✅ return void
        }

        next(); // ✅ continue to next middleware
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token invalid" });
        return; // ✅ return void
    }
};


//check user is valid logged in. 
export const generalProtecter = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, token missing" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { id: string; role: Roles };

        // ✅ Attach ONLY token data
        req.user = { id: decoded.id };
        req.role = decoded.role;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token invalid" });
    }
};

//admin add user id 
export const technicianMasterProtector = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1️⃣ Extract token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token missing" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Technician Master Protector invoked with token:", token);
        // 2️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: string;
            role: "Admin" | "Technician";
        };

        if (decoded.role !== "Technician") {
            return res.status(403).json({ message: "Technician access only" });
        }

        // 3️⃣ Fetch technician
        const technician = await Technicians.findOne({
            accountId: decoded.userId,
            isDeleted: false,
            isActive: true,
        })
            .select("_id accountId")
            .lean();

        if (!technician) {
            return res.status(403).json({ message: "Technician not found or inactive" });
        }
        // 4️⃣ Fetch MASTER Admin associated with technician
        const masterUser = await User.findOne({
            _id: technician.accountId,
            isDeleted: false,
            isActive: true,
        }).lean();

        if (!masterUser) {
            return res.status(403).json({ message: "Associated admin not found" });
        }

        // 5️⃣ Attach master user and technician info to request
        req.user = masterUser; // MASTER Admin
        req.technician = technician; // Logged-in Technician metadata
        req.role = "Technician";

        next();
    } catch (error) {
        console.error("Technician Master Protector Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};


