import { NextFunction, Request, Response } from "express";

export const normalizeArrays = (arrayFields: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        for (const field of arrayFields) {
            const value = req.body[field];

            if (!value) continue;

            // If already array → OK
            if (Array.isArray(value)) continue;

            // If JSON string → parse
            if (typeof value === "string") {
                try {
                    const parsed = JSON.parse(value);
                    req.body[field] = Array.isArray(parsed) ? parsed : [parsed];
                } catch {
                    // Single value → wrap in array
                    req.body[field] = [value];
                }
            }
        }
        next();
    };
};
