import { Response } from "express";
import { ExportOptions } from "./ExportOptions";
import { generatePDF } from "./pdfGenerator";
import { generateExcel } from "./excelGenerator";
import { generateCSV } from "./csvGenerator";

export const exportReport = async (res: Response, options: ExportOptions): Promise<void> => {
  const { type } = options;

  console.log(`[Export] type=${type} | module=${options.module} | title="${options.title}"`);

  switch (type) {
    case "pdf":
      return generatePDF(res, options);
    case "excel":
      return generateExcel(res, options);
    case "csv":
      return generateCSV(res, options);
    default:
      throw new Error(`Unsupported export type: "${type}"`);
  }
};