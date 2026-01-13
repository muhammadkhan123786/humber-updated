import { Request, Response, NextFunction } from "express";

export const mapUploadedFilesToBody = (
    basePath = "/uploads"
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.files) return next();

        const files = req.files as Record<string, Express.Multer.File[]>;

        Object.entries(files).forEach(([field, fileList]) => {
            if (!fileList?.length) return;

            // Multiple files → array
            if (fileList.length > 1) {
                req.body[field] = fileList.map(
                    file => `${basePath}/${file.filename}`
                );
            } else {
                // Single file → string
                req.body[field] = `${basePath}/${fileList[0].filename}`;
            }
        });

        next();
    };
};
