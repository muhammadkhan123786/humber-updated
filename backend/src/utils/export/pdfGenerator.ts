import PDFDocument from "pdfkit";
import { Response } from "express";
import { ExportOptions } from "./ExportOptions";
import { REPORT_STYLES } from "./styles";

const PAGE_MARGIN = 40;
const COL_WIDTH = 90;
const ROW_HEIGHT = 22;
const HEADER_ROW_HEIGHT = 24;

export const generatePDF = (res: Response, options: ExportOptions): void => {
  const { title, module, kpis = [], table } = options;

  const style = REPORT_STYLES[module] ?? REPORT_STYLES.inventory;

  const doc = new PDFDocument({ margin: PAGE_MARGIN, size: "A4", autoFirstPage: true });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${title}.pdf"`);
  doc.pipe(res);

  // ── Banner header ──────────────────────────────────────────────────────────
  doc.rect(0, 0, doc.page.width, 70).fill(style.primary);

  doc
    .fillColor("#ffffff")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text(title, PAGE_MARGIN, 22, { align: "left" });

  doc.moveDown(3);

  // ── KPI summary ────────────────────────────────────────────────────────────
  if (kpis.length > 0) {
    doc
      .fillColor(style.primary)
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Summary", PAGE_MARGIN, doc.y);

    doc.moveDown(0.4);

    const kpiBoxX = PAGE_MARGIN;
    const kpiBoxY = doc.y;
    const kpiBoxW = doc.page.width - PAGE_MARGIN * 2;
    const kpiBoxH = kpis.length * 20 + 12;

    doc.rect(kpiBoxX, kpiBoxY, kpiBoxW, kpiBoxH).fill(style.light);

    kpis.forEach((kpi, i) => {
      const y = kpiBoxY + 8 + i * 20;
      doc
        .fillColor(style.text)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(`${kpi.label}:`, kpiBoxX + 10, y, { continued: true, width: 160 });
      doc
        .font("Helvetica")
        .fillColor("#1f2937")
        .text(` ${kpi.value}`);
    });

    doc.y = kpiBoxY + kpiBoxH + 16;
  }

  // ── Table ──────────────────────────────────────────────────────────────────
  doc
    .fillColor(style.primary)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Report Data", PAGE_MARGIN, doc.y);

  doc.moveDown(0.5);

  const tableLeft = PAGE_MARGIN;
  const tableWidth = doc.page.width - PAGE_MARGIN * 2;
  const numCols = table.headers.length;
  const colW = Math.min(COL_WIDTH, Math.floor(tableWidth / numCols));

  const drawTableHeaders = (startY: number) => {
    table.headers.forEach((header, i) => {
      const x = tableLeft + i * colW;
      // cell background
      doc.rect(x, startY, colW, HEADER_ROW_HEIGHT).fill(style.primary);
      // cell text
      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(header, x + 4, startY + 7, { width: colW - 8, ellipsis: true });
    });
    return startY + HEADER_ROW_HEIGHT;
  };

  let y = drawTableHeaders(doc.y);

  // ── Data rows with page-overflow guard ────────────────────────────────────
  table.rows.forEach((row, rowIndex) => {
    // Check if we need a new page (leave 60px bottom margin)
    if (y + ROW_HEIGHT > doc.page.height - 60) {
      doc.addPage();
      y = PAGE_MARGIN + 10;
      y = drawTableHeaders(y); // repeat header on new page
    }

    const isEven = rowIndex % 2 === 0;

    // Row background
    doc
      .rect(tableLeft, y, colW * numCols, ROW_HEIGHT)
      .fill(isEven ? style.light : "#ffffff");

    // Bottom border
    doc
      .moveTo(tableLeft, y + ROW_HEIGHT)
      .lineTo(tableLeft + colW * numCols, y + ROW_HEIGHT)
      .strokeColor("#e5e7eb")
      .lineWidth(0.5)
      .stroke();

    // Cell values
    row.forEach((cell, i) => {
      const x = tableLeft + i * colW;
      doc
        .fillColor("#374151")
        .font("Helvetica")
        .fontSize(8)
        .text(String(cell ?? ""), x + 4, y + 6, {
          width: colW - 8,
          ellipsis: true,
        });
    });

    y += ROW_HEIGHT;
  });

  // ── Footer with page numbers ───────────────────────────────────────────────
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    doc
      .fillColor("#9ca3af")
      .fontSize(8)
      .font("Helvetica")
      .text(
        `Page ${i + 1} of ${range.count}  ·  Generated ${new Date().toLocaleDateString()}`,
        PAGE_MARGIN,
        doc.page.height - 30,
        { align: "center", width: doc.page.width - PAGE_MARGIN * 2 }
      );
  }

  doc.end();
};