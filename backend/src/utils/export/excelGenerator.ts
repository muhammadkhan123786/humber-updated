import { Response } from "express";
import ExcelJS from "exceljs";
import { ExportOptions } from "./ExportOptions";
import { REPORT_STYLES } from "./styles";

export const generateExcel = async (res: Response, options: ExportOptions): Promise<void> => {
  const { title, module, table, kpis = [] } = options;
  const style = REPORT_STYLES[module] ?? REPORT_STYLES.inventory;

  // Strip leading '#' so ExcelJS receives a bare hex string (e.g. "059669")
  const primaryHex = style.primary.replace("#", "");
  const lightHex = style.light.replace("#", "");

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ReportService";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(title, {
    pageSetup: { fitToPage: true, orientation: "landscape" },
  });

  // ── Report title row ───────────────────────────────────────────────────────
  const titleRow = sheet.addRow([title]);
  titleRow.font = { bold: true, size: 16, color: { argb: `FF${primaryHex}` } };
  titleRow.height = 28;
  sheet.addRow([]); // spacer

  // ── KPI summary block ──────────────────────────────────────────────────────
  if (kpis.length > 0) {
    const kpiHeaderRow = sheet.addRow(["Summary"]);
    kpiHeaderRow.font = { bold: true, size: 12, underline: true };

    kpis.forEach((kpi) => {
      const row = sheet.addRow([kpi.label, kpi.value]);
      row.getCell(1).font = { bold: true };
    });

    sheet.addRow([]); // spacer
  }

  // ── Table header row ───────────────────────────────────────────────────────
  const headerRow = sheet.addRow(table.headers);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${primaryHex}` },
    };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top:    { style: "thin", color: { argb: "FFD1D5DB" } },
      bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
      left:   { style: "thin", color: { argb: "FFD1D5DB" } },
      right:  { style: "thin", color: { argb: "FFD1D5DB" } },
    };
  });
  headerRow.height = 22;

  // ── Data rows ──────────────────────────────────────────────────────────────
  table.rows.forEach((rowData, rowIndex) => {
    const row = sheet.addRow(rowData);
    const isEven = rowIndex % 2 === 0;

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEven ? `FF${lightHex}` : "FFFFFFFF" },
      };
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = {
        bottom: { style: "hair", color: { argb: "FFE5E7EB" } },
        right:  { style: "hair", color: { argb: "FFE5E7EB" } },
      };
    });
    row.height = 18;
  });

  // ── Auto-fit column widths ─────────────────────────────────────────────────
  sheet.columns.forEach((col) => {
    let maxLen = 10;
    col.eachCell?.({ includeEmpty: false }, (cell) => {
      const len = cell.value ? String(cell.value).length : 0;
      if (len > maxLen) maxLen = len;
    });
    col.width = Math.min(maxLen + 4, 40); // cap at 40 chars
  });

  // ── Stream to response ─────────────────────────────────────────────────────
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"  // ✅ was missing
  );
  res.setHeader("Content-Disposition", `attachment; filename="${title}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
};