import { Request, Response, NextFunction } from "express";

export const mapUploadedFilesToBody = (
  basePath = "/uploads",
  aliases: Record<string, string> = {},
  singleFields: string[] = [],
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.files) return next();

    const filesArray = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat();

    const filesByField: Record<string, string[]> = {};

    filesArray.forEach((file) => {
      const targetField = aliases[file.fieldname] ?? file.fieldname;

      if (!filesByField[targetField]) {
        filesByField[targetField] = [];
      }

      filesByField[targetField].push(`${basePath}/${file.filename}`);
    });

    Object.entries(filesByField).forEach(([field, paths]) => {
      const isSingle = singleFields.includes(field);
      let existing: any = req.body[field];

      if (existing) {
        if (!isSingle) {
          if (typeof existing === "string") {
            try {
              const parsed = JSON.parse(existing);
              existing = Array.isArray(parsed) ? parsed : [existing];
            } catch {
              existing = [existing];
            }
          } else if (!Array.isArray(existing)) {
            existing = [existing];
          }
          req.body[field] = [...existing, ...paths];
        } else {
          req.body[field] = paths[0] || existing;
        }
      } else {
        req.body[field] = isSingle ? paths[0] : paths;
      }
    });

    next();
  };
};
