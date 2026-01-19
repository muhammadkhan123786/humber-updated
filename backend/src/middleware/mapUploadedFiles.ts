import { Request, Response, NextFunction } from "express";
export const mapUploadedFilesToBody = (
  basePath = "/uploads",
  aliases: Record<string, string> = {}
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.files || !Array.isArray(req.files)) return next();

    const filesByField: Record<string, Express.Multer.File[]> = {};

    req.files.forEach((file) => {
      const targetField = aliases[file.fieldname] ?? file.fieldname;

      if (!filesByField[targetField]) {
        filesByField[targetField] = [];
      }
      filesByField[targetField].push(file);
    });

    Object.entries(filesByField).forEach(([field, fileList]) => {
      const paths = fileList.map(
        (file) => `${basePath}/${file.filename}`
      );

      req.body[field] = fileList.length === 1 ? paths[0] : paths;
    });

    next();
  };
};
