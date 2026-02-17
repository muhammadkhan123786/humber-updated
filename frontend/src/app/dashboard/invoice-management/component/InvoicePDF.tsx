"use client";
import { jsPDF } from "jspdf";

interface InvoiceData {
  invoiceId: string;
  invoiceDate: string;
  dueDate: string;
  paymentStatus: string;
  paymentMethod: string;
  status: string;
  netTotal: number;
  subtotal: number;
  discountAmount: number;
  discountType: string;
  taxAmount: number;
  isVATEXEMPT: boolean;
  callOutFee: number;
  invoiceNotes?: string;
  customerId?: {
    personId?: {
      firstName?: string;
      lastName?: string;
    };
    addressId?: {
      address?: string;
      city?: string;
    };
    contactId?: {
      emailId?: string;
      mobileNumber?: string;
    };
  };
  jobId?: {
    jobId?: string;
    ticketId?: {
      ticketCode?: string;
    };
  };
  parts?: Array<{
    partId?: {
      partName?: string;
    };
    quantity?: number;
    unitCost?: number;
    totalCost?: number;
  }>;
  services?: Array<{
    description?: string;
    duration?: string;
    rate?: number;
    activityId?: {
      technicianServiceType?: string;
    };
  }>;
  updatedAt?: string;
}

export const downloadInvoicePDF = (invoice: InvoiceData) => {
  const doc = new jsPDF();

  // Helper functions
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  const formatCurrency = (amount: number) => {
    return `£${amount?.toFixed(2) || "0.00"}`;
  };

  // Calculate totals
  const partsTotal =
    invoice.parts?.reduce((sum, part) => sum + (part.totalCost || 0), 0) || 0;

  const labourTotal =
    invoice.services?.reduce((sum, service) => {
      let hours = 1;
      if (service?.duration) {
        if (
          typeof service.duration === "string" &&
          service.duration.includes(":")
        ) {
          const [h, m] = service.duration.split(":").map(Number);
          hours = (h || 0) + (m || 0) / 60;
        } else {
          hours = parseFloat(String(service.duration)) || 1;
        }
      }
      const rate = service?.rate || 50;
      return sum + hours * rate;
    }, 0) || 0;

  const subtotal = partsTotal + labourTotal + (invoice.callOutFee || 0);
  const afterDiscount = subtotal - (invoice.discountAmount || 0);

  // Colors matching the web component
  const colors = {
    blueGradient: { r: 37, g: 99, b: 235 },
    indigoGradient: { r: 79, g: 70, b: 229 },
    gray900: { r: 17, g: 24, b: 39 },
    gray800: { r: 31, g: 41, b: 55 },
    gray700: { r: 55, g: 65, b: 81 },
    gray600: { r: 75, g: 85, b: 99 },
    gray500: { r: 107, g: 114, b: 128 },
    gray400: { r: 156, g: 163, b: 175 },
    gray300: { r: 209, g: 213, b: 219 },
    gray200: { r: 229, g: 231, b: 235 },
    gray100: { r: 243, g: 244, b: 246 },
    gray50: { r: 249, g: 250, b: 251 },
    green800: { r: 22, g: 101, b: 52 },
    green700: { r: 21, g: 128, b: 61 },
    green600: { r: 22, g: 163, b: 74 },
    green500: { r: 34, g: 197, b: 94 },
    green300: { r: 134, g: 239, b: 172 },
    green200: { r: 187, g: 247, b: 208 },
    green100: { r: 220, g: 252, b: 231 },
    green50: { r: 240, g: 253, b: 244 },
    yellow700: { r: 161, g: 98, b: 7 },
    yellow600: { r: 202, g: 138, b: 4 },
    yellow500: { r: 234, g: 179, b: 8 },
    yellow300: { r: 253, g: 224, b: 71 },
    yellow200: { r: 254, g: 240, b: 138 },
    yellow100: { r: 254, g: 249, b: 195 },
    yellow50: { r: 254, g: 252, b: 232 },
    blue900: { r: 30, g: 58, b: 138 },
    blue800: { r: 30, g: 64, b: 175 },
    blue700: { r: 29, g: 78, b: 216 },
    blue600: { r: 37, g: 99, b: 235 },
    blue500: { r: 59, g: 130, b: 246 },
    blue400: { r: 96, g: 165, b: 250 },
    blue300: { r: 147, g: 197, b: 253 },
    blue200: { r: 191, g: 219, b: 254 },
    blue100: { r: 219, g: 234, b: 254 },
    blue50: { r: 239, g: 246, b: 255 },
    red600: { r: 220, g: 38, b: 38 },
    red500: { r: 239, g: 68, b: 68 },
    red400: { r: 248, g: 113, b: 113 },
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    borderLight: { r: 229, g: 231, b: 235 },
    borderGray: { r: 209, g: 213, b: 219 },
  };

  // Set font
  doc.setFont("helvetica");

  // Header with Company Info - REDUCED SIZE to match web component
  // Logo placeholder - smaller to match web (24x24 instead of 92x92 scale)
  doc.setFillColor(colors.gray100.r, colors.gray100.g, colors.gray100.b);
  doc.setDrawColor(
    colors.borderLight.r,
    colors.borderLight.g,
    colors.borderLight.b,
  );
  doc.roundedRect(20, 15, 20, 20, 3, 3, "FD"); // Smaller logo background

  // INVOICE title - smaller font size
  doc.setTextColor(
    colors.blueGradient.r,
    colors.blueGradient.g,
    colors.blueGradient.b,
  );
  doc.setFontSize(36); // Reduced from 48
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 45, 30);

  // Invoice number - smaller font
  doc.setTextColor(colors.gray600.r, colors.gray600.g, colors.gray600.b);
  doc.setFontSize(12); // Reduced from 16
  doc.setFont("helvetica", "normal");
  doc.text(`#${invoice.invoiceId || "N/A"}`, 45, 38);

  // Company Info - Right side - adjusted positioning
  doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
  doc.setFontSize(14); // Reduced from 20
  doc.setFont("helvetica", "bold");
  doc.text("Humber Mobility Scooter", 190, 18, { align: "right" });

  doc.setTextColor(colors.gray600.r, colors.gray600.g, colors.gray600.b);
  doc.setFontSize(9); // Reduced from 11
  doc.setFont("helvetica", "normal");
  doc.text("376 Anlaby Road, Hull, HU3 6PB", 190, 26, { align: "right" });
  doc.text("01482 561964", 190, 32, { align: "right" });
  doc.text("info@humbermobility.co.uk", 190, 38, { align: "right" });

  // VAT - adjusted
  doc.setTextColor(colors.gray700.r, colors.gray700.g, colors.gray700.b);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("VAT: GB123456789", 190, 46, { align: "right" });

  // Bill To & Invoice Details Section - adjusted start Y
  const detailsStartY = 55; // Reduced from 75

  // Bill To box
  doc.setFillColor(colors.gray50.r, colors.gray50.g, colors.gray50.b);
  doc.setDrawColor(
    colors.borderLight.r,
    colors.borderLight.g,
    colors.borderLight.b,
  );
  doc.roundedRect(20, detailsStartY, 85, 60, 8, 8, "FD");

  doc.setTextColor(colors.gray500.r, colors.gray500.g, colors.gray500.b);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 25, detailsStartY + 10);

  doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const customerName =
    `${invoice.customerId?.personId?.firstName || ""} ${invoice.customerId?.personId?.lastName || ""}`.trim() ||
    "N/A";
  doc.text(customerName, 25, detailsStartY + 18);

  doc.setTextColor(colors.gray600.r, colors.gray600.g, colors.gray600.b);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const address = invoice.customerId?.addressId?.address || "N/A";
  const city = invoice.customerId?.addressId?.city || "N/A";
  doc.text(address, 25, detailsStartY + 26);
  doc.text(city, 25, detailsStartY + 33);

  const email = invoice.customerId?.contactId?.emailId || "N/A";
  const phone = invoice.customerId?.contactId?.mobileNumber || "N/A";
  doc.text(email, 25, detailsStartY + 41);
  doc.text(phone, 25, detailsStartY + 48);

  // Invoice Details box
  doc.setFillColor(colors.gray50.r, colors.gray50.g, colors.gray50.b);
  doc.roundedRect(105, detailsStartY, 85, 60, 8, 8, "FD");

  const details = [
    { label: "Issue Date:", value: formatDate(invoice.invoiceDate) },
    { label: "Due Date:", value: formatDate(invoice.dueDate) },
    { label: "Job Number:", value: invoice.jobId?.jobId || "N/A" },
    {
      label: "Ticket Number:",
      value: invoice.jobId?.ticketId?.ticketCode || "N/A",
    },
  ];

  let yPos = detailsStartY + 12;
  details.forEach((detail) => {
    doc.setTextColor(colors.gray700.r, colors.gray700.g, colors.gray700.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(detail.label, 115, yPos);

    doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
    doc.setFont("helvetica", "normal");
    doc.text(detail.value, 185, yPos, { align: "right" });
    yPos += 10;
  });

  //   // Payment Status Badge
  //   const isPaid = invoice.paymentStatus === "PAID";
  //   const badgeColor = isPaid ? colors.green100 : colors.yellow100;
  //   const badgeTextColor = isPaid ? colors.green700 : colors.yellow700;
  //   const badgeBorderColor = isPaid ? colors.green300 : colors.yellow300;

  //   doc.setFillColor(badgeColor.r, badgeColor.g, badgeColor.b);
  //   doc.setDrawColor(badgeBorderColor.r, badgeBorderColor.g, badgeBorderColor.b);
  //   doc.roundedRect(20, detailsStartY + 65, 50, 16, 5, 5, "FD");

  //   doc.setFillColor(badgeTextColor.r, badgeTextColor.g, badgeTextColor.b);
  //   doc.circle(28, detailsStartY + 73, 2.5, "F");

  //   doc.setTextColor(badgeTextColor.r, badgeTextColor.g, badgeTextColor.b);
  //   doc.setFontSize(9);
  //   doc.setFont("helvetica", "normal");
  //   doc.text(invoice.paymentStatus || "PENDING", 35, detailsStartY + 76);

  // Parts Section
  let currentY = detailsStartY + 90;

  doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Parts & Components", 20, currentY);

  currentY += 8;
  doc.setDrawColor(colors.gray200.r, colors.gray200.g, colors.gray200.b);
  doc.line(20, currentY, 190, currentY);
  currentY += 6;

  // Parts Headers
  doc.setTextColor(colors.gray700.r, colors.gray700.g, colors.gray700.b);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 20, currentY);
  doc.text("Qty", 140, currentY, { align: "right" });
  doc.text("Price", 165, currentY, { align: "right" });
  doc.text("Total", 190, currentY, { align: "right" });

  currentY += 6;
  doc.setDrawColor(colors.gray100.r, colors.gray100.g, colors.gray100.b);
  doc.line(20, currentY, 190, currentY);
  currentY += 6;

  // Parts Rows
  if (invoice.parts && invoice.parts.length > 0) {
    invoice.parts.forEach((part) => {
      doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(part.partId?.partName || "Part Name", 20, currentY);

      doc.setTextColor(colors.gray600.r, colors.gray600.g, colors.gray600.b);
      doc.text((part.quantity || 0).toString(), 140, currentY, {
        align: "right",
      });
      doc.text(formatCurrency(part.unitCost || 0), 165, currentY, {
        align: "right",
      });

      doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(part.totalCost || 0), 190, currentY, {
        align: "right",
      });

      currentY += 7;
      doc.setDrawColor(colors.gray50.r, colors.gray50.g, colors.gray50.b);
      doc.line(20, currentY - 3, 190, currentY - 3);
    });
  } else {
    doc.setTextColor(colors.gray500.r, colors.gray500.g, colors.gray500.b);
    doc.text("No parts added", 105, currentY, { align: "center" });
    currentY += 8;
  }

  currentY += 5;

  // Labour Section
  doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Labour & Services", 20, currentY);

  currentY += 8;
  doc.setDrawColor(colors.gray200.r, colors.gray200.g, colors.gray200.b);
  doc.line(20, currentY, 190, currentY);
  currentY += 6;

  // Labour Headers
  doc.setTextColor(colors.gray700.r, colors.gray700.g, colors.gray700.b);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 20, currentY);
  doc.text("Hours", 140, currentY, { align: "right" });
  doc.text("Rate", 165, currentY, { align: "right" });
  doc.text("Total", 190, currentY, { align: "right" });

  currentY += 6;
  doc.setDrawColor(colors.gray100.r, colors.gray100.g, colors.gray100.b);
  doc.line(20, currentY, 190, currentY);
  currentY += 6;

  // Labour Rows
  if (invoice.services && invoice.services.length > 0) {
    invoice.services.forEach((service) => {
      let hours = 1;
      if (service?.duration) {
        if (
          typeof service.duration === "string" &&
          service.duration.includes(":")
        ) {
          const [h, m] = service.duration.split(":").map(Number);
          hours = (h || 0) + (m || 0) / 60;
        } else {
          hours = parseFloat(String(service.duration)) || 1;
        }
      }
      const rate = service?.rate || 50;
      const total = hours * rate;

      doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        service.description ||
          service.activityId?.technicianServiceType ||
          "Service",
        20,
        currentY,
      );

      doc.setTextColor(colors.gray600.r, colors.gray600.g, colors.gray600.b);
      doc.text(hours.toFixed(1), 140, currentY, { align: "right" });
      doc.text(formatCurrency(rate), 165, currentY, { align: "right" });

      doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(total), 190, currentY, { align: "right" });

      currentY += 7;
      doc.setDrawColor(colors.gray50.r, colors.gray50.g, colors.gray50.b);
      doc.line(20, currentY - 3, 190, currentY - 3);
    });
  } else {
    doc.setTextColor(colors.gray500.r, colors.gray500.g, colors.gray500.b);
    doc.text("No services added", 105, currentY, { align: "center" });
    currentY += 8;
  }

  currentY += 10;

  // Totals Section - Right aligned
  const totalsX = 120;
  let totalsY = currentY;

  // Subtotal
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.gray400.r, colors.gray400.g, colors.gray400.b);
  doc.text("Subtotal", totalsX, totalsY);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
  doc.text(formatCurrency(subtotal), 190, totalsY, { align: "right" });
  totalsY += 6;

  // Discount if exists
  if (invoice.discountAmount > 0) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.gray400.r, colors.gray400.g, colors.gray400.b);
    doc.text(`Discount (${invoice.discountType})`, totalsX, totalsY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.red600.r, colors.red600.g, colors.red600.b);
    doc.text(`-${formatCurrency(invoice.discountAmount)}`, 190, totalsY, {
      align: "right",
    });
    totalsY += 6;
  }

  // VAT if not exempt
  if (!invoice.isVATEXEMPT) {
    const vatRate =
      invoice.taxAmount && afterDiscount > 0
        ? ((invoice.taxAmount / afterDiscount) * 100).toFixed(1)
        : "20";

    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.gray400.r, colors.gray400.g, colors.gray400.b);
    doc.text(`VAT (${vatRate}%)`, totalsX, totalsY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
    doc.text(formatCurrency(invoice.taxAmount || 0), 190, totalsY, {
      align: "right",
    });
    totalsY += 6;
  }

  // Total
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.gray900.r, colors.gray900.g, colors.gray900.b);
  doc.text("Total", totalsX, totalsY);

  doc.setTextColor(colors.blue600.r, colors.blue600.g, colors.blue600.b);
  doc.text(formatCurrency(invoice.netTotal), 190, totalsY, { align: "right" });
  totalsY += 12;

  // Payment Status if PAID
  if (invoice.paymentStatus === "PAID") {
    // 1. Amount Paid Label and Value
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.gray400.r, colors.gray400.g, colors.gray400.b);
    doc.text("Amount Paid", totalsX, totalsY);

    doc.setFontSize(11); // Increased for prominence
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.green600.r, colors.green600.g, colors.green600.b);
    doc.text(formatCurrency(invoice.netTotal), 190, totalsY, {
      align: "right",
    });

    totalsY += 6;

    // 2. Setup Box Dimensions
    const boxWidth = 70;
    const boxX = 190 - boxWidth; // Aligns box right edge to 190
    const boxHeight = 20;

    // 3. Draw the Paid Box
    doc.setFillColor(colors.green50.r, colors.green50.g, colors.green50.b);
    doc.setDrawColor(colors.green300.r, colors.green300.g, colors.green300.b);
    doc.roundedRect(boxX, totalsY, boxWidth, boxHeight, 5, 5, "FD");

    // 4. "PAID" Status Text (Left side of box)
    doc.setTextColor(colors.green800.r, colors.green800.g, colors.green800.b);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PAID", boxX + 8, totalsY + 12);

    // 5. Payment Details (Right side of box with padding)
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.gray600.r, colors.gray600.g, colors.gray600.b);

    const paymentMethod = (invoice.paymentMethod || "CASH").toUpperCase();
    const paymentDate = formatDate(invoice.updatedAt || "");

    // Using 185 instead of 190 provides 5 units of "padding" from the box border
    doc.text(paymentMethod, 185, totalsY + 7, { align: "right" });
    doc.text(paymentDate, 185, totalsY + 15, { align: "right" });

    totalsY += boxHeight + 10;
  }

  // Notes Section
  if (invoice.invoiceNotes) {
    doc.setDrawColor(colors.gray300.r, colors.gray300.g, colors.gray300.b);
    doc.line(20, totalsY, 190, totalsY);
    totalsY += 8;

    doc.setFillColor(colors.blue50.r, colors.blue50.g, colors.blue50.b);
    doc.setDrawColor(colors.blue500.r, colors.blue500.g, colors.blue500.b);
    doc.roundedRect(20, totalsY, 170, 25, 4, 4, "FD");

    doc.setFillColor(colors.blue500.r, colors.blue500.g, colors.blue500.b);
    doc.rect(20, totalsY, 4, 25, "F");

    doc.setTextColor(colors.blue900.r, colors.blue900.g, colors.blue900.b);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 30, totalsY + 8);

    doc.setTextColor(colors.blue800.r, colors.blue800.g, colors.blue800.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    // Handle long notes with word wrap
    const splitNotes = doc.splitTextToSize(invoice.invoiceNotes, 150);
    doc.text(splitNotes, 30, totalsY + 16);
    totalsY += 30 + (splitNotes.length - 1) * 6;
  }

  // Footer - Matching web component exactly
  const footerY = Math.max(totalsY + 15, 265);

  // Top border - thicker like web component
  doc.setDrawColor(colors.gray200.r, colors.gray200.g, colors.gray200.b);
  doc.setLineWidth(0.5);
  doc.line(20, footerY, 190, footerY);

  doc.setTextColor(colors.gray600.r, colors.gray600.g, colors.gray600.b);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing Humber Mobility Scooter", 105, footerY + 8, {
    align: "center",
  });

  doc.setFontSize(9);
  doc.text(
    "For any queries, please contact us at info@humbermobility.co.uk or 01482 561964",
    105,
    footerY + 16,
    { align: "center" },
  );

  // Save the PDF
  doc.save(`Invoice-${invoice.invoiceId || "download"}.pdf`);
};
