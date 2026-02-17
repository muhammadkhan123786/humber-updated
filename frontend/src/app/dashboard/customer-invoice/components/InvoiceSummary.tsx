"use client";

import { CheckCircle2 } from "lucide-react";

interface InvoiceSummaryProps {
  partsSubtotal: number;
  labourSubtotal: number;
  calloutFee: number;
  discountAmount: number;
  discountType: string;
  discountValue: number;
  subtotal: number;
  afterDiscount: number;
  isVatExempt: boolean;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
}

const InvoiceSummary = ({
  partsSubtotal,
  labourSubtotal,
  calloutFee,
  discountAmount,
  discountType,
  discountValue,
  afterDiscount,
  isVatExempt,
  vatRate,
  vatAmount,
  grandTotal,
}: InvoiceSummaryProps) => {
  const safeNumber = (value: any): number => {
    if (value === null || value === undefined || value === "") return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };
  const formatValue = (value: any): string => {
    return safeNumber(value).toFixed(2);
  };

  const getDiscountLabel = (): string => {
    if (discountType === "Percentage") {
      return ` (${safeNumber(discountValue)}%)`;
    } else if (discountType === "Fix Amount") {
      return " (Fixed)";
    }
    return "";
  };

  // Safely parse all props to numbers
  const safePartsSubtotal = safeNumber(partsSubtotal);
  const safeLabourSubtotal = safeNumber(labourSubtotal);
  const safeCalloutFee = safeNumber(calloutFee);
  const safeDiscountAmount = safeNumber(discountAmount);
  const safeAfterDiscount = safeNumber(afterDiscount);
  const safeVatAmount = safeNumber(vatAmount);
  const safeGrandTotal = safeNumber(grandTotal);

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
        {/* Parts */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg font-normal font-['Arial'] leading-7">
            Parts:
          </span>
          <span className="text-indigo-950 text-lg font-bold font-['Arial'] leading-7">
            £{formatValue(safePartsSubtotal)}
          </span>
        </div>

        {/* Labour */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg font-normal font-['Arial'] leading-7">
            Labour:
          </span>
          <span className="text-indigo-950 text-lg font-bold font-['Arial'] leading-7">
            £{formatValue(safeLabourSubtotal)}
          </span>
        </div>

        {/* Callout Fee - FIXED */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg font-normal font-['Arial'] leading-7">
            Callout Fee:
          </span>
          <span className="text-indigo-950 text-lg font-bold font-['Arial'] leading-7">
            £{formatValue(safeCalloutFee)}
          </span>
        </div>

        {/* Discount */}
        {safeDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-lg font-normal font-['Arial'] leading-7">
              Discount:
              {getDiscountLabel()}
            </span>
            <span className="text-lg font-bold font-['Arial'] leading-7">
              -£{formatValue(safeDiscountAmount)}
            </span>
          </div>
        )}

        <div className="h-px w-full bg-indigo-600/10" />

        {/* Subtotal after discount */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg font-normal font-['Arial'] leading-7">
            Subtotal:
          </span>
          <span className="text-indigo-950 text-lg font-bold font-['Arial'] leading-7">
            £{formatValue(safeAfterDiscount)}
          </span>
        </div>

        {/* VAT */}
        {!isVatExempt ? (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-lg font-normal font-['Arial'] leading-7">
              VAT ({vatRate}%):
            </span>
            <span className="text-indigo-950 text-lg font-bold font-['Arial'] leading-7">
              £{formatValue(safeVatAmount)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-green-600">
            <span className="text-lg font-normal font-['Arial'] leading-7">
              VAT:
            </span>
            <span className="text-lg font-bold font-['Arial'] leading-7 bg-green-100 px-3 py-1 rounded-full text-[12px]">
              EXEMPT
            </span>
          </div>
        )}

        <div className="h-px w-full bg-green-300" />

        {/* Grand Total */}
        <div className="mt-2 px-4 py-4 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl flex justify-between items-center shadow-lg shadow-emerald-900/10">
          <span className="text-white text-2xl font-bold font-['Arial'] leading-8">
            Grand Total:
          </span>
          <span className="text-white text-4xl font-bold font-['Arial'] leading-10">
            £{formatValue(safeGrandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
