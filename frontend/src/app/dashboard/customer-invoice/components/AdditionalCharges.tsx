"use client";

import React from "react";
import { CheckCircle2, DollarSign } from "lucide-react";
import { CustomSelect } from "../../../common-form/CustomSelect";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormData } from "../../../../schema/invoice.schema";

interface AdditionalChargesProps {
  calloutFee: number;
  setCalloutFee: (value: number) => void;
  discountValue: number;
  setDiscountValue: (value: number) => void;
  discountType: string;
  setDiscountType: (value: string) => void;
  isVatExempt: boolean;
  setIsVatExempt: (value: boolean) => void;
  vatRate: number;
  setVatRate: (value: number) => void;
  subtotal: number;
  form: UseFormReturn<InvoiceFormData>;
}

const AdditionalCharges: React.FC<AdditionalChargesProps> = ({
  calloutFee,
  setCalloutFee,
  discountValue,
  setDiscountValue,
  discountType,
  setDiscountType,
  isVatExempt,
  setIsVatExempt,
  vatRate,
  subtotal,
  form,
}) => {
  const discountOptions = [
    { id: "Percentage", label: "Percentage (%)" },
    { id: "Fix Amount", label: "Fixed Amount (£)" },
  ];

  const handleCalloutFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setCalloutFee(value);
    // Use setTimeout to break the update cycle
    setTimeout(() => {
      form.setValue("callOutFee", value, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }, 0);
  };

  const handleDiscountValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscountValue(value);
    // Use setTimeout to break the update cycle
    setTimeout(() => {
      form.setValue("discountAmount", value, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }, 0);
  };

  const handleDiscountTypeChange = (value: string) => {
    setDiscountType(value);
    // Use setTimeout to break the update cycle
    setTimeout(() => {
      form.setValue("discountType", value as "Percentage" | "Fix Amount", {
        shouldDirty: true,
        shouldValidate: false,
      });
    }, 0);
  };

  const handleVatExemptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsVatExempt(checked);
    // Use setTimeout to break the update cycle
    setTimeout(() => {
      form.setValue("isVATEXEMPT", checked, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }, 0);
  };

  const isPercentage = discountType === "Percentage";
  const calculatedDiscount = isPercentage
    ? (subtotal * (discountValue || 0)) / 100
    : discountValue || 0;

  const afterDiscount = subtotal - calculatedDiscount;
  const vatAmount = !isVatExempt ? (afterDiscount * (vatRate || 0)) / 100 : 0;

  const inputFocusClasses =
    "focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all";

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
            <input
              type="number"
              min="0"
              step="0.01"
              value={calloutFee}
              onChange={handleCalloutFeeChange}
              className={`w-full h-10 px-3 bg-gray-100 rounded-xl outline-2 outline-amber-100 border border-transparent text-indigo-950 text-sm ${inputFocusClasses}`}
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
            <div className="h-12">
              <CustomSelect
                options={discountOptions}
                value={discountType}
                onChange={handleDiscountTypeChange}
                placeholder="Select Type"
                isSearchable={false}
              />
            </div>
            <div className="w-full">
              <input
                type="number"
                min="0"
                step={isPercentage ? "1" : "0.01"}
                placeholder={isPercentage ? "Enter %" : "Enter £"}
                value={discountValue}
                onChange={handleDiscountValueChange}
                className={`w-full h-10 px-3 bg-gray-100 rounded-xl outline-2 outline-amber-100 border border-transparent text-indigo-950 text-sm ${inputFocusClasses}`}
              />
            </div>
            <div className="h-12 px-4 bg-amber-50 rounded-xl outline-2 outline-amber-200 flex justify-between items-center">
              <span className="text-gray-600 text-sm">Discount Amount:</span>
              <span className="text-amber-600 text-lg font-bold">
                -£{calculatedDiscount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-indigo-600/10" />

        {/* VAT Settings */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-indigo-950 text-sm font-medium">
              VAT Settings
            </span>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isVatExempt}
                onChange={handleVatExemptChange}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-indigo-950 text-sm group-hover:text-indigo-700">
                VAT Exempt
              </span>
            </label>
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
                  min="0"
                  max="100"
                  step="0.1"
                  value={vatRate}
                  onChange={() => {}} // Remove handler since we don't need to update
                  readOnly
                  className={`w-full h-12 px-3 bg-gray-100 rounded-xl outline-2 outline-amber-100 border border-transparent text-indigo-950 text-sm ${inputFocusClasses} opacity-75 cursor-not-allowed`}
                />
              </div>
              <div className="flex flex-col gap-2 justify-end">
                <div className="h-12 px-4 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                  <span className="text-gray-600 text-sm">VAT Amount:</span>
                  <span className="text-amber-600 text-lg font-bold">
                    £{vatAmount.toFixed(2)}
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
