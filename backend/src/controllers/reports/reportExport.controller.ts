import { Request, Response } from "express";
import { exportReport } from "../../utils/export/exportService";
import { ExportOptions, ExportType, ModuleType } from "../../utils/export/ExportOptions";

const VALID_TYPES: ExportType[] = ["pdf", "excel", "csv"];
const VALID_MODULES: ModuleType[] = ["inventory", "purchase", "supplier", "financial"];

export const exportReportController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, module, reportName, kpis, headers, rows } = req.body;

    // ── Input validation ──────────────────────────────────────────────────────
    if (!type || !VALID_TYPES.includes(type)) {
      res.status(400).json({
        message: `Invalid or missing 'type'. Must be one of: ${VALID_TYPES.join(", ")}.`,
      });
      return;
    }

    if (!module || !VALID_MODULES.includes(module)) {
      res.status(400).json({
        message: `Invalid or missing 'module'. Must be one of: ${VALID_MODULES.join(", ")}.`,
      });
      return;
    }

    if (!reportName || typeof reportName !== "string" || reportName.trim() === "") {
      res.status(400).json({ message: "'reportName' is required and must be a non-empty string." });
      return;
    }

    if (!Array.isArray(headers) || headers.length === 0) {
      res.status(400).json({ message: "'headers' is required and must be a non-empty array." });
      return;
    }

    if (!Array.isArray(rows)) {
      res.status(400).json({ message: "'rows' is required and must be an array." });
      return;
    }

    // ── Build options ─────────────────────────────────────────────────────────
    const options: ExportOptions = {
      type,
      module,
      title: reportName.trim(),
      kpis: Array.isArray(kpis) ? kpis : [],
      table: { headers, rows },
    };

    await exportReport(res, options);
  } catch (error: any) {
    console.error("EXPORT ERROR:", error);

    // Avoid sending headers twice if the stream already started
    if (!res.headersSent) {
      res.status(500).json({
        message: "Export failed",
        error: error.message || String(error),
      });
    }
  }
};