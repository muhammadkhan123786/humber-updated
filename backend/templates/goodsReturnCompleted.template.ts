// services/emailTemplates/goodsReturnCompleted.template.ts
export function generateGoodsReturnCompletedEmail(goodsReturn: any): { html: string; text: string; subject: string } {
  const grn = goodsReturn.grnId as any;
  const po  = grn?.purchaseOrderId as any;

  const supplierName: string =
    po?.supplier?.contactInformation?.primaryContactName  ||
    po?.supplier?.supplierIdentification?.legalBusinessName ||
    "Supplier";

  const grtnNumber  = goodsReturn.grtnNumber  || "N/A";
  const grnNumber   = grn?.grnNumber          || "N/A";
  const orderNumber = po?.orderNumber         || "N/A";

  const totalQty = goodsReturn.items.reduce(
    (sum: number, item: any) => sum + (item.returnQty || 0), 0
  );
  const totalValue = goodsReturn.items.reduce(
    (sum: number, item: any) => sum + (item.totalAmount || 0), 0
  );

  const itemRows = goodsReturn.items.map((item: any) => `
    <tr style="border-bottom:1px solid #e5e7eb;">
      <td style="padding:12px;font-weight:500;">${item.productName || "N/A"}</td>
      <td style="padding:12px;font-family:monospace;color:#6b7280;">${item.sku || "N/A"}</td>
      <td style="padding:12px;text-align:center;color:#dc2626;font-weight:600;">${item.returnQty || 0}</td>
      <td style="padding:12px;text-align:center;">£${(item.unitPrice || 0).toFixed(2)}</td>
      <td style="padding:12px;text-align:right;font-weight:600;">£${(item.totalAmount || 0).toFixed(2)}</td>
      <td style="padding:12px;color:#6b7280;font-size:13px;">${item.itemsNotes || "—"}</td>
    </tr>
  `).join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;color:#1f2937;">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#dc2626,#ea580c);padding:30px;border-radius:12px 12px 0 0;">
        <h1 style="color:white;margin:0;font-size:22px;">📦 Goods Return — Completed</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">
          Return Note: <strong>${grtnNumber}</strong> | GRN: <strong>${grnNumber}</strong>
        </p>
      </div>

      <!-- Body -->
      <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;">

        <p>Dear <strong>${supplierName}</strong>,</p>
        <p style="color:#374151;line-height:1.6;">
          We confirm that the following goods return against Purchase Order
          <strong>${orderNumber}</strong> has been completed.
          The items listed below have been returned to you in full.
        </p>

        <!-- Summary - TABLE BASED WITH PROPER SPACING (24px gap) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; border-collapse: collapse;">
          <tr>
            <td width="33%" style="padding-right: 12px;">
              <div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;padding:16px 24px;text-align:center;">
                <p style="margin:0;font-size:32px;font-weight:700;color:#dc2626;">${totalQty}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#991b1b;">Units Returned</p>
              </div>
            </td>
            <td width="33%" style="padding-left: 12px; padding-right: 12px;">
              <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px 24px;text-align:center;">
                <p style="margin:0;font-size:32px;font-weight:700;color:#d97706;">${goodsReturn.items.length}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#92400e;">Product Lines</p>
              </div>
            </td>
            <td width="33%" style="padding-left: 12px;">
              <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px 24px;text-align:center;">
                <p style="margin:0;font-size:32px;font-weight:700;color:#16a34a;">£${totalValue.toFixed(2)}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#15803d;">Total Return Value</p>
              </div>
            </td>
          </tr>
        </table>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:12px;text-align:left;font-size:13px;color:#6b7280;">Product</th>
              <th style="padding:12px;text-align:left;font-size:13px;color:#6b7280;">SKU</th>
              <th style="padding:12px;text-align:center;font-size:13px;color:#dc2626;">Qty Returned</th>
              <th style="padding:12px;text-align:center;font-size:13px;color:#6b7280;">Unit Price</th>
              <th style="padding:12px;text-align:right;font-size:13px;color:#6b7280;">Total</th>
              <th style="padding:12px;text-align:left;font-size:13px;color:#6b7280;">Notes</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr style="background:#fef2f2;">
              <td colspan="4" style="padding:12px;text-align:right;font-weight:700;color:#dc2626;">Total Return Value:</td>
              <td style="padding:12px;text-align:right;font-weight:700;color:#dc2626;font-size:16px;">£${totalValue.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <!-- Action box -->
        <div style="margin-top:24px;padding:16px;background:#fff7ed;border-left:4px solid #ea580c;border-radius:4px;">
          <p style="margin:0;font-weight:600;color:#9a3412;">Credit Note / Refund</p>
          <p style="margin:8px 0 0;color:#7c2d12;font-size:14px;">
            Please process a credit note or refund for the returned amount of
            <strong>£${totalValue.toFixed(2)}</strong>.
            Reference: <strong>${grtnNumber}</strong>
          </p>
        </div>

        <p style="margin-top:24px;">Best regards,<br/>
          <strong>${process.env.APP_NAME || "Inventory Pro"}</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#1f2937;padding:16px;border-radius:0 0 12px 12px;text-align:center;">
        <p style="color:#9ca3af;margin:0;font-size:12px;">
          Automated message — ${process.env.APP_NAME || "Inventory Pro"}
        </p>
      </div>
    </div>
  `;

  const text = `
Goods Return Completed — ${grtnNumber}
PO: ${orderNumber} | GRN: ${grnNumber}

Dear ${supplierName},

The following return has been completed:
Total Units: ${totalQty}
Total Value: £${totalValue.toFixed(2)}

Items:
${goodsReturn.items.map((i: any) =>
  `${i.productName} (${i.sku}) — ${i.returnQty} units @ £${(i.unitPrice||0).toFixed(2)}`
).join("\n")}

Please process a credit note for £${totalValue.toFixed(2)}.
Reference: ${grtnNumber}
  `.trim();

  const subject = `📦 Return Completed — ${grtnNumber} | £${totalValue.toFixed(2)} credit due`;

  return { html, text, subject };
}