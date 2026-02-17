"use client";

import { CheckCircle2 } from "lucide-react";
import { useWatch } from "react-hook-form";

interface InvoiceSummaryProps {
  form: any;
  vatRate: number;
}

const InvoiceSummary = ({ form, vatRate }: InvoiceSummaryProps) => {
  const parts = useWatch({ control: form.control, name: "parts" }) || [];
  const services = useWatch({ control: form.control, name: "services" }) || [];
  const callOutFee = parseFloat(
    useWatch({ control: form.control, name: "callOutFee" }) || 0,
  );
  const discountValueRaw =
    useWatch({ control: form.control, name: "discountAmount" }) || 0;
  const discountType =
    useWatch({ control: form.control, name: "discountType" }) || "Percentage";
  const isVatExempt =
    useWatch({ control: form.control, name: "isVATEXEMPT" }) || false;

  const discountValue = parseFloat(discountValueRaw) || 0;
  const partsSubtotal = parts.reduce(
    (acc: number, part: any) =>
      acc + (part.quantity || 0) * (part.unitCost || 0),
    0,
  );

  const labourSubtotal = services.reduce((acc: number, service: any) => {
    let hours = 1;
    if (service?.duration) {
      if (
        typeof service.duration === "string" &&
        service.duration.includes(":")
      ) {
        const [h, m] = service.duration.split(":").map(Number);
        hours = h + (m || 0) / 60;
      } else {
        hours = parseFloat(String(service.duration)) || 1;
      }
    }
    return acc + hours * (service.rate || 50);
  }, 0);

  const subtotalRaw = partsSubtotal + labourSubtotal + callOutFee;

  // Discount with rounding
  const discountAmount =
    discountType === "Percentage"
      ? Math.round(subtotalRaw * discountValue) / 100
      : Math.round(discountValue * 100) / 100;

  const afterDiscount = subtotalRaw - discountAmount;
  const vatAmount = !isVatExempt
    ? Math.round(afterDiscount * vatRate) / 100
    : 0;
  const grandTotal = afterDiscount + vatAmount;

  const formatValue = (val: number) => val.toFixed(2);
  const getDiscountLabel = () =>
    discountType === "Percentage" ? ` (${discountValue}%)` : " (Fixed)";

  return (
    <div className="w-full bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl outline-2 -outline-offset-2 outline-green-200 p-6 flex flex-col gap-6 font-sans">
      <div className="flex items-center gap-3 text-green-600">
        <div className="p-1 bg-white/50">
          <CheckCircle2 size={20} />
        </div>
        <h2 className="text-base font-normal leading-4 font-['Arial']">
          Invoice Summary
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg">Parts:</span>
          <span className="text-indigo-950 text-lg font-bold">
            £{formatValue(partsSubtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg">Labour:</span>
          <span className="text-indigo-950 text-lg font-bold">
            £{formatValue(labourSubtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg">Callout Fee:</span>
          <span className="text-indigo-950 text-lg font-bold">
            £{formatValue(callOutFee)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-lg">Discount{getDiscountLabel()}:</span>
            <span className="text-lg font-bold">
              -£{formatValue(discountAmount)}
            </span>
          </div>
        )}

        <div className="h-px w-full bg-indigo-600/10" />

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg">Subtotal:</span>
          <span className="text-indigo-950 text-lg font-bold">
            £{formatValue(afterDiscount)}
          </span>
        </div>

        {!isVatExempt ? (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-lg">VAT ({vatRate}%):</span>
            <span className="text-indigo-950 text-lg font-bold">
              £{formatValue(vatAmount)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-green-600">
            <span className="text-lg">VAT:</span>
            <span className="text-lg font-bold bg-green-100 px-3 py-1 rounded-full text-[12px]">
              EXEMPT
            </span>
          </div>
        )}

        <div className="h-px w-full bg-green-300" />

        <div className="mt-2 px-4 py-4 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl flex justify-between items-center shadow-lg shadow-emerald-900/10">
          <span className="text-white text-2xl font-bold">Grand Total:</span>
          <span className="text-white text-4xl font-bold">
            £{formatValue(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
