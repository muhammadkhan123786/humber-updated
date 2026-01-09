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
        destination: (_req, _file, cb) => cb(null, uploadDir),
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname);
            const safeName = file.fieldname.replace(/\s+/g, '_');
            cb(null, `${Date.now()}-${safeName}${ext}`);
        },
    });

    const fileFilter: multer.Options['fileFilter'] = (req: Request, file, cb) => {
        const rule = fields.find(f => f.name === file.fieldname);
        if (!rule) return cb(new Error(`Unexpected file field: ${file.fieldname}`));

        if (!rule.mimeTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${rule.mimeTypes.join(', ')}`));
        }

        cb(null, true);
    };

    return multer({ storage, fileFilter }).fields(
        fields.map(f => ({ name: f.name, maxCount: f.maxCount }))
    );
};
