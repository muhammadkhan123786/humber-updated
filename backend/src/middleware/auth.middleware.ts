import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Roles } from '../models/user.models';

export interface AuthRequest extends Request {
    user?: any;
    role?: Roles
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
