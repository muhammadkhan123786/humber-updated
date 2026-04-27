import PDFDocument from "pdfkit";
import { Response } from "express";
import { ExportOptions } from "./ExportOptions";
import { REPORT_STYLES } from "./styles";
import path from "path";
import fs from "fs";

// ─── Layout constants ────────────────────────────────────────────────────────
const PAGE_MARGIN  = 40;
const HEADER_H     = 80;
const FOOTER_H     = 64;   // height of the coloured footer band
const ROW_HEIGHT   = 22;
const HEADER_ROW_H = 26;
const KPI_CARD_W   = 155;
const KPI_CARD_H   = 56;
const KPI_GAP      = 12;
const KPI_PER_ROW  = 3;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Get the maximum Y position for content before needing a new page
 * Reserves space for footer only on the last page
 */
const getMaxContentY = (pageHeight: number, isLastPage: boolean): number => {
  return isLastPage ? pageHeight - FOOTER_H - 10 : pageHeight - 30;
};

/**
 * Safely parse a numeric value from strings like "$1,234.56" or "4.8k".
 * Keeps the decimal point; strips everything else that is not a digit.
 */
const toNum = (v: string | number): number => {
  if (typeof v === "number") return isFinite(v) ? v : 0;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
};

/**
 * Resolve the company logo to a Buffer.
 * Tries: path.join(__dirname, "../../../public/logo.png") first,
 * then COMPANY_LOGO_URL env var (local path only — PDFKit cannot load URLs).
 * Returns null when nothing is found; caller draws an initials circle instead.
 */
const resolveLogoBuffer = (): Buffer | null => {
  const candidates = [
    path.join(__dirname, "../../../public/logo.png"),
    process.env.COMPANY_LOGO_URL ?? "",
  ].filter(Boolean);

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return fs.readFileSync(p);
    } catch {}
  }
  return null;
};

/**
 * Draw a coloured circle containing the first two initials of `name`.
 * Used whenever the logo file is unavailable.
 */
function drawInitialsCircle(
  doc: InstanceType<typeof PDFDocument>,
  name: string,
  cx: number,
  cy: number,
  radius: number,
  bg: string
): void {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  doc.circle(cx, cy, radius).fill(bg);
  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(radius * 0.72)
    .text(initials, cx - radius, cy - radius * 0.42, {
      width: radius * 2,
      align: "center",
      lineBreak: false,
    });
}

/** Render a section-title line and advance the cursor. */
function sectionTitle(
  doc: InstanceType<typeof PDFDocument>,
  text: string,
  color: string
): void {
  doc
    .fillColor(color)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(text, PAGE_MARGIN, doc.y, { lineBreak: false });
  doc.moveDown(0.6);
}

/**
 * Draw footer on the current page
 */
function drawFooter(
  doc: InstanceType<typeof PDFDocument>,
  style: any,
  companyName: string,
  companyAddress: string,
  companyUrl: string,
  logoBuffer: Buffer | null,
  dateStr: string,
  pageNum: number,
  totalPages: number
): void {
  const PW = doc.page.width;
  const PH = doc.page.height;
  const FY = PH - FOOTER_H;

  // Background band
  doc.rect(0, FY, PW, FOOTER_H).fill(style.light);

  // Top border accent
  doc.moveTo(0, FY).lineTo(PW, FY)
    .strokeColor(style.primary).lineWidth(2.5).stroke();

  // LEFT: mini logo + company info
  const MINI_R  = 14;
  const MINI_CX = PAGE_MARGIN + MINI_R;
  const MINI_CY = FY + FOOTER_H / 2;

  if (logoBuffer) {
    try {
      doc.save();
      doc.circle(MINI_CX, MINI_CY, MINI_R).clip();
      doc.image(logoBuffer, MINI_CX - MINI_R, MINI_CY - MINI_R, {
        width: MINI_R * 2, height: MINI_R * 2, fit: [MINI_R * 2, MINI_R * 2],
      });
      doc.restore();
      doc.circle(MINI_CX, MINI_CY, MINI_R)
        .lineWidth(1.5).strokeColor(style.primary).stroke();
    } catch {
      drawInitialsCircle(doc, companyName, MINI_CX, MINI_CY, MINI_R, style.primary);
    }
  } else {
    drawInitialsCircle(doc, companyName, MINI_CX, MINI_CY, MINI_R, style.primary);
  }

  const INFO_X = PAGE_MARGIN + MINI_R * 2 + 10;

  doc
    .fillColor(style.text).font("Helvetica-Bold").fontSize(8)
    .text(companyName, INFO_X, FY + 10, { lineBreak: false });

  doc
    .fillColor("#6b7280").font("Helvetica").fontSize(7)
    .text(companyAddress, INFO_X, FY + 23, { lineBreak: false });

  // URL
  doc
    .fillColor("#2563eb").fontSize(7)
    .text(companyUrl, INFO_X, FY + 36, {
      width:      160,
      ellipsis:   true,
      underline:  true,
      lineBreak:  false,
    });

  // CENTRE: page number + date
  doc
    .fillColor(style.text).font("Helvetica-Bold").fontSize(9)
    .text(`Page ${pageNum} of ${totalPages}`, 0, FY + 16, {
      align: "center", width: PW, lineBreak: false,
    });

  doc
    .fillColor("#9ca3af").font("Helvetica").fontSize(7)
    .text(dateStr, 0, FY + 30, {
      align: "center", width: PW, lineBreak: false,
    });

  // RIGHT: authorised signature
  const SIG_W = 180;
  const SIG_X = PW - PAGE_MARGIN - SIG_W;

  doc
    .fillColor("#9ca3af").font("Helvetica").fontSize(7)
    .text("Authorised Signature:", SIG_X, FY + 10, { lineBreak: false });

  doc
    .moveTo(SIG_X, FY + 38).lineTo(SIG_X + SIG_W, FY + 38)
    .strokeColor("#9ca3af").lineWidth(0.7).stroke();

  doc
    .fillColor("#c4c4c4").fontSize(6.5)
    .text("Sign above", SIG_X + SIG_W / 2 - 14, FY + 41, { lineBreak: false });
}

// ─── Main export ─────────────────────────────────────────────────────────────
export const generatePDF = (res: Response, options: ExportOptions): void => {
  const { title, module, kpis = [], table } = options;

  const companyName    = process.env.COMPANY_NAME    || "Humber Mobility";
  const companyAddress = process.env.COMPANY_ADDRESS || "123 Business Street, London, UK";
  const companyUrl     = process.env.COMPANY_URL     || "https://onyxtech.co.uk/";
  const style          = REPORT_STYLES[module] ?? REPORT_STYLES.inventory;
  const logoBuffer     = resolveLogoBuffer();

  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });

  const doc = new PDFDocument({
    margin:        PAGE_MARGIN,
    size:          "A4",
    autoFirstPage: true,
    bufferPages:   true,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${title}.pdf"`);
  doc.pipe(res);

  // Track pages and content
  let currentPage = 1;
  let totalPages = 1;

  // ══════════════════════════════════════════════════════════════════════════
  // BANNER HEADER (same on all pages)
  // ══════════════════════════════════════════════════════════════════════════
  const drawBannerHeader = () => {
    doc.rect(0, 0, doc.page.width, HEADER_H).fill(style.primary);

    // Subtle diagonal stripes
    doc.save();
    doc.opacity(0.07);
    for (let s = 0; s < 7; s++) {
      const sx = doc.page.width - 130 + s * 28;
      doc.moveTo(sx, 0).lineTo(sx + 70, HEADER_H)
        .lineWidth(20).strokeColor("#ffffff").stroke();
    }
    doc.restore();

    // Logo
    const LOGO_R  = 22;
    const LOGO_CX = PAGE_MARGIN + LOGO_R;
    const LOGO_CY = HEADER_H / 2;

    if (logoBuffer) {
      try {
        doc.save();
        doc.circle(LOGO_CX, LOGO_CY, LOGO_R).clip();
        doc.image(logoBuffer, LOGO_CX - LOGO_R, LOGO_CY - LOGO_R, {
          width: LOGO_R * 2, height: LOGO_R * 2, fit: [LOGO_R * 2, LOGO_R * 2],
        });
        doc.restore();
        doc.circle(LOGO_CX, LOGO_CY, LOGO_R).lineWidth(2).strokeColor("#ffffff").stroke();
      } catch {
        drawInitialsCircle(doc, companyName, LOGO_CX, LOGO_CY, LOGO_R, style.text);
      }
    } else {
      drawInitialsCircle(doc, companyName, LOGO_CX, LOGO_CY, LOGO_R, style.text);
    }

    // Company name + report title
    const TX = PAGE_MARGIN + LOGO_R * 2 + 12;
    doc
      .fillColor("#ffffff").font("Helvetica-Bold").fontSize(17)
      .text(companyName, TX, HEADER_H / 2 - 18, { lineBreak: false });
    doc
      .fillColor("rgba(255,255,255,0.82)").font("Helvetica").fontSize(11)
      .text(title, TX, HEADER_H / 2 + 2, { lineBreak: false });

    // Date
    doc
      .fillColor("rgba(255,255,255,0.68)").fontSize(8)
      .text(`Generated: ${dateStr}`, 0, 16, {
        align: "right", width: doc.page.width - PAGE_MARGIN, lineBreak: false,
      });

    doc.y = HEADER_H + 18;
  };

  // Draw initial banner
  drawBannerHeader();

  // ══════════════════════════════════════════════════════════════════════════
  // KPI CARDS
  // ══════════════════════════════════════════════════════════════════════════
  if (kpis.length > 0) {
    sectionTitle(doc, "Summary", style.primary);

    let cardX   = PAGE_MARGIN;
    let cardY   = doc.y;
    let bottomY = cardY + KPI_CARD_H;

    kpis.forEach((kpi, i) => {
      // Check if we need a new page for KPIs
      if (cardY + KPI_CARD_H > doc.page.height - 50) {
        doc.addPage();
        drawBannerHeader();
        cardX = PAGE_MARGIN;
        cardY = doc.y;
        bottomY = cardY + KPI_CARD_H;
        currentPage++;
        totalPages++;
      }

      if (i > 0 && i % KPI_PER_ROW === 0) {
        cardX   = PAGE_MARGIN;
        cardY   = bottomY + KPI_GAP;
        bottomY = cardY + KPI_CARD_H;
      }

      // Shadow + card face
      doc.roundedRect(cardX + 2, cardY + 2, KPI_CARD_W, KPI_CARD_H, 7).fill(style.light);
      doc.roundedRect(cardX,     cardY,     KPI_CARD_W, KPI_CARD_H, 7).fill(style.light);

      // Left accent bar
      doc.roundedRect(cardX, cardY, 5, KPI_CARD_H, 3).fill(style.primary);

      doc
        .fillColor("#6b7280").font("Helvetica").fontSize(7.5)
        .text(kpi.label, cardX + 14, cardY + 11, {
          width: KPI_CARD_W - 20, lineBreak: false,
        });

      doc
        .fillColor(style.primary).font("Helvetica-Bold").fontSize(15)
        .text(String(kpi.value), cardX + 14, cardY + 27, {
          width: KPI_CARD_W - 20, lineBreak: false,
        });

      bottomY = Math.max(bottomY, cardY + KPI_CARD_H);
      cardX  += KPI_CARD_W + KPI_GAP;
    });

    doc.y = bottomY + 18;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // BAR CHART
  // ══════════════════════════════════════════════════════════════════════════
  const chartKpis = kpis
    .map((k) => ({ ...k, safeValue: toNum(k.value) }))
    .filter((k) => k.safeValue > 0)
    .slice(0, 6);

  if (chartKpis.length > 0) {
    const CHART_MAX_H  = 75;
    const TOTAL_NEEDED = CHART_MAX_H + 48;

    if (doc.y + TOTAL_NEEDED > doc.page.height - 50) {
      doc.addPage();
      drawBannerHeader();
      currentPage++;
      totalPages++;
    }

    sectionTitle(doc, "Analytics Overview", style.primary);

    const originX = PAGE_MARGIN;
    const originY = doc.y + CHART_MAX_H;
    const maxVal  = Math.max(...chartKpis.map((k) => k.safeValue), 1);

    // Guide lines
    [0.25, 0.5, 0.75, 1].forEach((pct) => {
      const gy = originY - pct * CHART_MAX_H;
      doc
        .moveTo(originX, gy)
        .lineTo(originX + chartKpis.length * (34 + 18), gy)
        .strokeColor("#f3f4f6").lineWidth(0.6).stroke();
    });

    // Baseline
    doc
      .moveTo(originX, originY)
      .lineTo(originX + chartKpis.length * (34 + 18), originY)
      .strokeColor("#d1d5db").lineWidth(1).stroke();

    chartKpis.forEach((kpi, i) => {
      const val  = kpi.safeValue;
      const barH = maxVal > 0 ? Math.max(Math.round((val / maxVal) * CHART_MAX_H), 4) : 4;
      const bx   = originX + i * (34 + 18);
      const by   = originY - barH;

      doc.rect(bx, by, 34, barH).fill(style.primary);

      doc
        .fillColor(style.text).font("Helvetica-Bold").fontSize(7)
        .text(String(kpi.value), bx, by - 12, {
          width: 34, align: "center", lineBreak: false,
        });

      const lbl = kpi.label.length > 9 ? kpi.label.slice(0, 8) + "…" : kpi.label;
      doc
        .fillColor("#9ca3af").font("Helvetica").fontSize(6.5)
        .text(lbl, bx, originY + 5, {
          width: 34, align: "center", lineBreak: false,
        });
    });

    doc.y = originY + 28;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // DATA TABLE
  // ══════════════════════════════════════════════════════════════════════════
  sectionTitle(doc, "Report Data", style.primary);

  const headers = table?.headers ?? [];
  const rows    = table?.rows    ?? [];

  if (headers.length === 0 || rows.length === 0) {
    doc.fillColor("#9ca3af").fontSize(10).font("Helvetica")
      .text("No data available for this report.", PAGE_MARGIN);
  } else {
    const tableW  = doc.page.width - PAGE_MARGIN * 2;
    const numCols = headers.length || 1;
    const colW    = Math.floor(tableW / numCols);

    const drawTableHeaders = (startY: number): number => {
      headers.forEach((h, i) => {
        const x = PAGE_MARGIN + i * colW;
        doc.rect(x, startY, colW, HEADER_ROW_H).fill(style.primary);
        doc
          .fillColor("#ffffff").font("Helvetica-Bold").fontSize(8.5)
          .text(h, x + 5, startY + 8, {
            width: colW - 10, ellipsis: true, lineBreak: false,
          });
      });
      return startY + HEADER_ROW_H;
    };

    let y = drawTableHeaders(doc.y);

    rows.forEach((row, rowIdx) => {
      // Check if we need a new page (reserve 50px for safety)
      if (y + ROW_HEIGHT > doc.page.height - 50) {
        doc.addPage();
        drawBannerHeader();
        y = doc.y;
        y = drawTableHeaders(y);
        currentPage++;
        totalPages++;
      }

      const isEven = rowIdx % 2 === 0;

      doc.rect(PAGE_MARGIN, y, colW * numCols, ROW_HEIGHT)
        .fill(isEven ? style.light : "#ffffff");

      doc
        .moveTo(PAGE_MARGIN, y + ROW_HEIGHT)
        .lineTo(PAGE_MARGIN + colW * numCols, y + ROW_HEIGHT)
        .strokeColor("#e5e7eb").lineWidth(0.4).stroke();

      row.forEach((cell, i) => {
        doc
          .fillColor("#374151").font("Helvetica").fontSize(8)
          .text(String(cell ?? ""), PAGE_MARGIN + i * colW + 5, y + 6, {
            width: colW - 10, ellipsis: true, lineBreak: false,
          });
      });

      y += ROW_HEIGHT;
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FOOTER — Draw on all pages AFTER content is laid out
  // ══════════════════════════════════════════════════════════════════════════
  const range = doc.bufferedPageRange();
  totalPages = range.count;

  for (let p = 0; p < range.count; p++) {
    doc.switchToPage(range.start + p);
    drawFooter(
      doc, style, companyName, companyAddress, companyUrl,
      logoBuffer, dateStr, p + 1, totalPages
    );
  }

  doc.end();
};