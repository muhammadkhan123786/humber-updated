import multer from 'multer';
import path from 'path';
import fs from 'fs';

type UploadFieldRule = {
    name: string;
    maxCount: number;
    mimeTypes: string[];
};

export const createUploader = (fields: UploadFieldRule[]) => {

    const uploadDir = path.join(__dirname, '../../uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}-${file.fieldname}${ext}`);
        },
    });

    const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
        const rule = fields.find(f => f.name === file.fieldname);

        if (!rule) {
            return cb(new Error(`Unexpected file field: ${file.fieldname}`));
        }

        if (!rule.mimeTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type for ${file.fieldname}`));
        }

        cb(null, true);
    };

    return multer({ storage, fileFilter }).fields(
        fields.map(f => ({ name: f.name, maxCount: f.maxCount }))
    );
};
