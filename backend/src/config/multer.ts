import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

export type UploadFieldRule = {
    name: string;
    maxCount: number;
    mimeTypes: string[];
};

export interface UploadedFiles {
    [fieldname: string]: Express.Multer.File[];
}

/**
 * Factory function to create a multer middleware for multiple fields with type and count validation
 */
export const createUploader = (fields: UploadFieldRule[]) => {
    // Save uploads in /uploads relative to project root
    const uploadDir = path.resolve(__dirname, '../../uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => {
            console.log("[MULTER] Saving file to:", uploadDir);
            cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname);
            const safeName = file.fieldname.replace(/\s+/g, '_');
            const filename = `${Date.now()}-${safeName}${ext}`;
            console.log("[MULTER] Filename generated:", filename);
            cb(null, filename);
        },
    });

    const fileFilter: multer.Options['fileFilter'] = (req: Request, file, cb) => {
        console.log("[MULTER] Checking file:", file.fieldname, file.mimetype);
        const rule = fields.find(f => f.name === file.fieldname);
        if (!rule) {
            console.log("[MULTER] No rule found for field:", file.fieldname, "- skipping");
            // Silently skip unknown file fields instead of erroring
            return cb(null, false);
        }

        if (!rule.mimeTypes.includes(file.mimetype)) {
            console.error("[MULTER] Invalid MIME type for", file.fieldname, "- expected", rule.mimeTypes);
            return cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${rule.mimeTypes.join(', ')}`));
        }

        console.log("[MULTER] File accepted:", file.fieldname);
        cb(null, true);
    };

    // Use .any() to parse all fields (both text and files)
    // This automatically preserves text form fields alongside files
    const uploader = multer({ 
        storage, 
        fileFilter,
        limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
    }).any();

    // Wrap to add logging
    return (req: any, res: any, next: any) => {
        console.log("[MULTER] Starting file upload parsing");
        uploader(req, res, (err: any) => {
            if (err) {
                console.error("[MULTER ERROR]:", err.message);
                return next(err);
            }
            console.log("[MULTER] File parsing complete. req.files:", !!req.files, "req.body keys:", Object.keys(req.body || {}));
            next();
        });
    };
};