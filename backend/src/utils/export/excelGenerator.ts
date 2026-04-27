import { Response } from "express";
import ExcelJS from "exceljs";
import { ExportOptions } from "./ExportOptions";
import { REPORT_STYLES } from "./styles";
// Note: In a real-world prod app, you'd generate a buffer using Chart.js
// For this code, I will implement the layout structure and Image placement logic

export const generateExcel = async (res: Response, options: ExportOptions): Promise<void> => {
  const { title, module, table, kpis = [] } = options;
  const style = REPORT_STYLES[module] ?? REPORT_STYLES.inventory;

  const primaryHex = style.primary.replace("#", "");
  const lightHex = style.light.replace("#", "");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report Analysis", {
    views: [{ showGridLines: false }], // Professional look: hide gridlines
    pageSetup: { fitToPage: true, orientation: "landscape" },
  });

  // ── 1. HEADER BANNER ──────────────────────────────────────────────────
  sheet.mergeCells("A1:E2");
  const titleCell = sheet.getCell("A1");
  titleCell.value = title.toUpperCase();
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${primaryHex}` },
  };
  titleCell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  // ── 2. KPI DASHBOARD CARDS (Row 4) ────────────────────────────────────
  if (kpis.length > 0) {
    let currentColumn = 1;
    kpis.forEach((kpi) => {
      const cell = sheet.getCell(4, currentColumn);
      cell.value = `${kpi.label}\n${kpi.value}`;
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${lightHex}` },
      };
      cell.border = {
        left: { style: "medium", color: { argb: `FF${primaryHex}` } },
        top: { style: "thin", color: { argb: "FFD1D5DB" } },
        bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
        right: { style: "thin", color: { argb: "FFD1D5DB" } },
      };
      cell.font = { bold: true, size: 10 };
      cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
      currentColumn++;
    });
  }

  sheet.addRow([]); // Spacer
  sheet.addRow([]); // Spacer

  // ── 3. DATA TABLE ─────────────────────────────────────────────────────
  const startRow = 7;
  const headerRow = sheet.getRow(startRow);
  headerRow.values = table.headers;
  
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${primaryHex}` },
    };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { horizontal: "center" };
    cell.border = { bottom: { style: "medium", color: { argb: "FFFFFFFF" } } };
  });

  table.rows.forEach((rowData, index) => {
    const row = sheet.addRow(rowData);
    row.eachCell((cell) => {
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
      cell.alignment = { horizontal: "left", indent: 1 };
      // Zebra striping
      if (index % 2 !== 0) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FFF9FAFB` } };
      }
    });
  });

  // ── 4. AUTO-COLUMN WIDTH ──────────────────────────────────────────────
  sheet.columns.forEach((col) => {
    col.width = 20;
  });

  // ── 5. PLACEHOLDER FOR CHART (Real-World Implementation) ──────────────
  // Since ExcelJS doesn't draw charts, professionals insert a pre-generated image
  /*
  if (options.chartBuffer) {
    const chartImage = workbook.addImage({
      buffer: options.chartBuffer,
      extension: 'png',
    });
    sheet.addImage(chartImage, {
      tl: { col: table.headers.length + 1, row: 6 },
      ext: { width: 400, height: 250 }
    });
  }
  */

  // ── 6. FINAL RESPONSE ─────────────────────────────────────────────────
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${title}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
};