import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Roles, User } from '../models/user.models';
import { Technicians } from '../models/technician-models/technician.models';

export interface AuthRequest extends Request {
    user?: any;
    role?: Roles;
    technician?: any
}

//admin protector operations middleware.
export const adminProtecter = (
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

        if (decoded.role !== "Admin") {
            res.status(403).json({ message: "Not authorized, admin access only" });
            return; // ✅ return void
        }

        next(); // ✅ continue to next middleware
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token invalid" });
        return; // ✅ return void
    }
};
//technician protector operations middleware.
export const technicianProtecter = (
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

        if (decoded.role !== "Technician") {
            res.status(403).json({ message: "Not authorized, Technician access only" });
            return; // ✅ return void
        }
        // console.log("Technician access granted");
        next(); // ✅ continue to next middleware
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token invalid" });
        return; // ✅ return void
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

        // 2️⃣ Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            userId: string;
            role: "Admin" | "Technician";
        };
        console.log("decoded", decoded);

        // 3️⃣ Technician only
        if (decoded.role !== "Technician") {
            return res.status(403).json({ message: "Technician access only" });
        }

        // 4️⃣ Fetch technician
        console.log("decoded id", decoded.userId);
        const technician = await Technicians.findOne({
            accountId: decoded.userId,
            isDeleted: false,
            isActive: true,
        })
            .select("_id accountId")
            .lean();
        console.log("technician", technician);
        if (!technician) {
            return res.status(403).json({ message: "Technician not found or inactive" });
        }

        // 5️⃣ Fetch MASTER ADMIN
        const masterUser = await User.findOne({
            _id: technician.accountId,
            isDeleted: false,
            isActive: true,
        }).lean();

        if (!masterUser) {
            return res.status(403).json({ message: "Associated admin not found" });
        }

        // 6️⃣ Attach MASTER user (important)
        req.user = masterUser;

        // 7️⃣ Attach technician metadata (optional but recommended)
        req.technician = technician;

        req.role = "Technician";

        next();
    } catch (error) {
        console.error("Technician Master Protector Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
