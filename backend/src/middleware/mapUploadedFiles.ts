import { Request, Response, NextFunction } from "express";

export const mapUploadedFilesToBody = (basePath = "/uploads") => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      // No uploaded files, leave req.body as-is
      return next();
    }

    const filesArray = req.files as Express.Multer.File[];

    const filesByField: Record<string, Express.Multer.File[]> = {};

    // Group files by fieldname
    filesArray.forEach((file) => {
      if (!filesByField[file.fieldname]) {
        filesByField[file.fieldname] = [];
      }
      filesByField[file.fieldname].push(file);
    });

    // Map dynamically
    Object.entries(filesByField).forEach(([field, fileList]) => {
      const paths = fileList.map((file) => `${basePath}/${file.filename}`);

      if (fileList.length === 1) {
        // single file → string
        req.body[field] = paths[0];
      } else {
        // multiple files → array
        req.body[field] = paths;
      }
    });

    next();
  };
};
