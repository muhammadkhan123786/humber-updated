"use client";

import React from "react";
import { CheckCircle2, DollarSign } from "lucide-react";
import { CustomSelect } from "../../../common-form/CustomSelect";
import { UseFormReturn, Controller } from "react-hook-form";
import { InvoiceFormData } from "../../../../schema/invoice.schema";

interface AdditionalChargesProps {
  vatRate: number;
  subtotal: number;
  form: UseFormReturn<InvoiceFormData>;
}

const AdditionalCharges: React.FC<AdditionalChargesProps> = ({
  vatRate,
  subtotal,
  form,
}) => {
  const { control, watch } = form;
  const discountValueRaw = watch("discountAmount");
  const discountType = watch("discountType") || "Percentage";
  const isVatExempt = watch("isVATEXEMPT") || false;

  const discountValue = parseFloat(discountValueRaw as any) || 0;

  const isPercentage = discountType === "Percentage";
  const calculatedDiscount: number = isPercentage
    ? (subtotal * discountValue) / 100
    : discountValue;

  const afterDiscount = subtotal - calculatedDiscount;
  const vatAmount = !isVatExempt ? (afterDiscount * (vatRate || 0)) / 100 : 0;

  const inputFocusClasses =
    "focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all";

  const discountOptions = [
    { id: "Percentage", label: "Percentage (%)" },
    { id: "Fix Amount", label: "Fixed Amount (£)" },
  ];

  return (
    <div className="w-full bg-white rounded-2xl outline-2 outline-amber-100 p-6 flex flex-col gap-6 font-sans">
      <div className="flex items-center gap-3 text-amber-600">
        <div className="p-1 rounded-md">
          <DollarSign size={20} />
        </div>
        <h2 className="text-lg font-bold">Additional Charges & Adjustments</h2>
      </div>

      <div className="flex flex-col gap-6">
        {/* Callout Fee */}
        <div className="flex flex-col gap-2">
          <label className="text-indigo-950 text-sm font-medium">
            Callout Fee (£)
          </label>
          <div className="w-full md:w-1/2">
            <Controller
              control={control}
              name="callOutFee"
              render={({ field }) => (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...field}
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))} // <-- string to number
                  className={`w-full h-10 px-3 bg-gray-100 rounded-xl outline-2 outline-amber-100 border border-transparent text-indigo-950 text-sm ${inputFocusClasses}`}
                />
              )}
            />
          </div>
        </div>

        <div className="h-px w-full bg-indigo-600/10" />

        {/* Discount Section */}
        <div className="flex flex-col gap-3">
          <label className="text-indigo-950 text-sm font-medium">
            Discount
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Discount Type */}
            <div className="h-12">
              <Controller
                control={control}
                name="discountType"
                render={({ field }) => (
                  <CustomSelect
                    options={discountOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Type"
                    isSearchable={false}
                  />
                )}
              />
            </div>

            {/* Discount Value */}
            <div className="w-full">
              <Controller
                control={control}
                name="discountAmount"
                render={({ field }) => (
                  <input
                    type="number"
                    min="0"
                    step={isPercentage ? "1" : "0.01"}
                    placeholder={isPercentage ? "Enter %" : "Enter £"}
                    {...field}
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className={`w-full h-10 px-3 bg-gray-100 rounded-xl outline-2 outline-amber-100 border border-transparent text-indigo-950 text-sm ${inputFocusClasses}`}
                  />
                )}
              />
            </div>

            {/* Calculated Discount */}
            <div className="h-12 px-4 bg-amber-50 rounded-xl outline-2 outline-amber-200 flex justify-between items-center">
              <span className="text-gray-600 text-sm">Discount Amount:</span>
              <span className="text-amber-600 text-lg font-bold">
                -£{Number(calculatedDiscount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-indigo-600/10" />

        {/* VAT Section */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-indigo-950 text-sm font-medium">
              VAT Settings
            </span>

            <Controller
              control={control}
              name="isVATEXEMPT"
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-indigo-950 text-sm group-hover:text-indigo-700">
                    VAT Exempt
                  </span>
                </label>
              )}
            />
          </div>

          {isVatExempt ? (
            <div className="h-12 px-4 rounded-xl bg-green-50 outline-2 outline-green-200 text-green-700 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-600" />
              <span className="text-sm">
                VAT exemption applied for eligible customer
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-indigo-950 text-xs font-medium">
                  VAT Rate (%)
                </label>
                <input
                  type="number"
                  value={vatRate}
                  readOnly
                  className={`w-full h-12 px-3 bg-gray-100 rounded-xl outline-2 outline-amber-100 border border-transparent text-indigo-950 text-sm ${inputFocusClasses} opacity-75 cursor-not-allowed`}
                />
              </div>

              <div className="flex flex-col gap-2 justify-end">
                <div className="h-12 px-4 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                  <span className="text-gray-600 text-sm">VAT Amount:</span>
                  <span className="text-amber-600 text-lg font-bold">
                    £{Number(vatAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalCharges;
