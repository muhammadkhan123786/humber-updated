import PDFDocument from "pdfkit";
import { Response } from "express";
import { ExportOptions } from "./ExportOptions";
import { REPORT_STYLES } from "./styles";
import path from "path";
import fs from "fs";

const PAGE_MARGIN = 40;
const HEADER_H = 80;
const ROW_HEIGHT = 26; 
const HEADER_ROW_H = 30; 
const KPI_CARD_W = 155;
const KPI_CARD_H = 56;
const KPI_GAP = 12;
const KPI_PER_ROW = 3;

const toNum = (v: string | number): number => {
  if (typeof v === "number") return isFinite(v) ? v : 0;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
};

const resolveLogoBuffer = (): Buffer | null => {
  const candidates = [
    path.join(__dirname, "../../../public/logo.png"),
    process.env.COMPANY_LOGO_URL ?? "",
  ].filter(Boolean);
  for (const p of candidates) {
    try { if (fs.existsSync(p)) return fs.readFileSync(p); } catch {}
  }
  return null;
};

function drawInitialsCircle(doc: any, name: string, cx: number, cy: number, radius: number, bg: string) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
  doc.circle(cx, cy, radius).fill(bg);
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(radius * 0.72)
    .text(initials, cx - radius, cy - radius * 0.42, { width: radius * 2, align: "center", lineBreak: false });
}

function sectionTitle(doc: any, text: string, color: string) {
  doc.moveDown(1.5);
  doc.fillColor(color).font("Helvetica-Bold").fontSize(12).text(text, PAGE_MARGIN, doc.y);
  doc.moveDown(0.8);
}

function drawHeader(doc: any, style: any, companyName: string, title: string, dateStr: string, logoBuffer: Buffer | null) {
  const PW = doc.page.width;
  doc.rect(0, 0, PW, HEADER_H).fill(style.primary);
  doc.save();
  doc.opacity(0.07);
  for (let s = 0; s < 7; s++) {
    const sx = PW - 130 + s * 28;
    doc.moveTo(sx, 0).lineTo(sx + 70, HEADER_H).lineWidth(20).strokeColor("#ffffff").stroke();
  }
  doc.restore();

  const LOGO_R = 22;
  const LOGO_CX = PAGE_MARGIN + LOGO_R;
  const LOGO_CY = HEADER_H / 2;
  if (logoBuffer) {
    try {
      doc.save();
      doc.circle(LOGO_CX, LOGO_CY, LOGO_R).clip();
      doc.image(logoBuffer, LOGO_CX - LOGO_R, LOGO_CY - LOGO_R, { width: LOGO_R * 2, height: LOGO_R * 2 });
      doc.restore();
    } catch { drawInitialsCircle(doc, companyName, LOGO_CX, LOGO_CY, LOGO_R, style.text); }
  } else {
    drawInitialsCircle(doc, companyName, LOGO_CX, LOGO_CY, LOGO_R, style.text);
  }

  const TX = PAGE_MARGIN + LOGO_R * 2 + 15;
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(18).text(companyName, TX, HEADER_H / 2 - 18);
  doc.fillColor("rgba(255,255,255,0.85)").font("Helvetica").fontSize(11).text(title, TX, HEADER_H / 2 + 5);
  doc.y = HEADER_H + 25;
}

// Simplified Signature Block
function drawSignatureArea(doc: any, dateStr: string) {
  const PW = doc.page.width;
  const PH = doc.page.height;
  const SIG_BLOCK_H = 100;

  // If near the bottom, move signature to a new page
  if (doc.y + SIG_BLOCK_H > PH - PAGE_MARGIN) {
    doc.addPage();
  } else {
    doc.moveDown(3);
  }

  const SIG_W = 200;
  const SIG_X = PW - PAGE_MARGIN - SIG_W;
  const currentY = doc.y;

  doc.fillColor("#374151").font("Helvetica-Bold").fontSize(10).text("Signature", SIG_X, currentY);
  
  // Signature Line
  doc.moveTo(SIG_X, currentY + 35)
     .lineTo(SIG_X + SIG_W, currentY + 35)
     .strokeColor("#9ca3af")
     .lineWidth(1)
     .stroke();

  doc.fillColor("#6b7280").font("Helvetica").fontSize(8).text("Verified", SIG_X, currentY + 42);
  doc.fillColor("#9ca3af").fontSize(7).text(`Date: ${dateStr}`, SIG_X, currentY + 52);
}

export const generatePDF = (res: Response, options: ExportOptions): void => {
  const { title, module, kpis = [], table } = options;
  const companyName = process.env.COMPANY_NAME || "Humber Mobility";
  const style = REPORT_STYLES[module] ?? REPORT_STYLES.inventory;
  const logoBuffer = resolveLogoBuffer();
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const doc = new PDFDocument({ margin: PAGE_MARGIN, size: "A4", autoFirstPage: true });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${title}.pdf"`);
  doc.pipe(res);

  drawHeader(doc, style, companyName, title, dateStr, logoBuffer);

  // ----- 1. TABLE SECTION -----
  const headers = table?.headers ?? [];
  const rows = table?.rows ?? [];
  if (headers.length && rows.length) {
    sectionTitle(doc, "Report Details", style.primary);
    const tableW = doc.page.width - PAGE_MARGIN * 2;
    const colW = Math.floor(tableW / headers.length);

    const drawTableHeaders = (yPos: number): number => {
      headers.forEach((h, i) => {
        const x = PAGE_MARGIN + i * colW;
        doc.rect(x, yPos, colW, HEADER_ROW_H).fill(style.primary);
        doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9).text(h, x + 8, yPos + 10, { width: colW - 16, ellipsis: true });
      });
      return yPos + HEADER_ROW_H;
    };

    let y = drawTableHeaders(doc.y);
    for (let i = 0; i < rows.length; i++) {
      if (y + ROW_HEIGHT > doc.page.height - PAGE_MARGIN - 40) {
        doc.addPage();
        drawHeader(doc, style, companyName, title, dateStr, logoBuffer);
        y = drawTableHeaders(doc.y);
      }
      const isEven = i % 2 === 0;
      doc.rect(PAGE_MARGIN, y, colW * headers.length, ROW_HEIGHT).fill(isEven ? style.light : "#ffffff");
      rows[i].forEach((cell, ci) => {
        doc.fillColor("#374151").font("Helvetica").fontSize(8.5).text(String(cell ?? ""), PAGE_MARGIN + ci * colW + 8, y + 8, { width: colW - 16, ellipsis: true });
      });
      y += ROW_HEIGHT;
    }
    doc.y = y;
  }

  // ----- 2. SUMMARY (KPIs) -----
  if (kpis.length > 0) {
    sectionTitle(doc, "Summary Metrics", style.primary);
    let cardX = PAGE_MARGIN, cardY = doc.y, bottomY = cardY + KPI_CARD_H;
    for (let i = 0; i < kpis.length; i++) {
      if (cardY + KPI_CARD_H > doc.page.height - PAGE_MARGIN) {
        doc.addPage();
        drawHeader(doc, style, companyName, title, dateStr, logoBuffer);
        cardX = PAGE_MARGIN; cardY = doc.y;
      }
      if (i > 0 && i % KPI_PER_ROW === 0) {
        cardX = PAGE_MARGIN; cardY = bottomY + KPI_GAP;
      }
      const kpi = kpis[i];
      doc.roundedRect(cardX, cardY, KPI_CARD_W, KPI_CARD_H, 6).fill(style.light);
      doc.rect(cardX, cardY, 4, KPI_CARD_H).fill(style.primary);
      doc.fillColor("#4b5563").font("Helvetica").fontSize(8).text(kpi.label, cardX + 12, cardY + 12);
      doc.fillColor(style.primary).font("Helvetica-Bold").fontSize(14).text(String(kpi.value), cardX + 12, cardY + 28);
      bottomY = Math.max(bottomY, cardY + KPI_CARD_H);
      cardX += KPI_CARD_W + KPI_GAP;
    }
    doc.y = bottomY;
  }

  // ----- 3. ANALYTICS CHART -----
  const chartKpis = kpis.map(k => ({ ...k, safeValue: toNum(k.value) })).filter(k => k.safeValue > 0).slice(0, 6);
  if (chartKpis.length > 0) {
    const CHART_MAX_H = 80;
    if (doc.y + CHART_MAX_H + 60 > doc.page.height - PAGE_MARGIN) {
      doc.addPage();
      drawHeader(doc, style, companyName, title, dateStr, logoBuffer);
    }
    sectionTitle(doc, "Analytics Overview", style.primary);
    const originX = PAGE_MARGIN + 20;
    const originY = doc.y + CHART_MAX_H;
    const maxVal = Math.max(...chartKpis.map(k => k.safeValue), 1);
    
    chartKpis.forEach((kpi, i) => {
      const barH = (kpi.safeValue / maxVal) * CHART_MAX_H;
      const bx = originX + i * 60;
      doc.rect(bx, originY - barH, 30, barH).fill(style.primary);
      doc.fillColor(style.text).font("Helvetica-Bold").fontSize(8).text(String(kpi.value), bx, originY - barH - 12, { width: 30, align: "center" });
      doc.fillColor("#6b7280").fontSize(7).text(kpi.label.substring(0, 10), bx, originY + 8, { width: 30, align: "center" });
    });
    doc.y = originY + 30;
  }

  // ----- 4. SIGNATURE ONLY -----
  drawSignatureArea(doc, dateStr);

  doc.end();
};