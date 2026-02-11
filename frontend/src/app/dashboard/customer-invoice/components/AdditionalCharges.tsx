"use client";

import React, { useState } from "react";
import { CheckCircle2, DollarSign } from "lucide-react";
import { CustomSelect } from "../../../common-form/CustomSelect";

const AdditionalCharges: React.FC = () => {
  const [calloutFee, setCalloutFee] = useState<number>(0);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("percentage");
  const [isVatExempt, setIsVatExempt] = useState<boolean>(true);
  const [vatRate, setVatRate] = useState<number>(20);

  const discountOptions = [
    { id: "percentage", label: "Percentage (%)" },
    { id: "fixed", label: "Fixed Amount (£)" },
  ];

  const calculatedDiscount = discountValue;

  const inputFocusClasses =
    "focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all";

  return (
    <div className="w-full  bg-white rounded-2xl outline-2 outline-amber-100 p-6 flex flex-col gap-6 font-sans">
      <div className="flex items-center gap-3 text-amber-600">
        <div className="p-1 rounded-md">
          <DollarSign size={20} />
        </div>
        <h2 className="text-lg font-bold">Additional Charges & Adjustments</h2>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-indigo-950 text-sm font-medium">
            Callout Fee (£)
          </label>
          <div className="w-full md:w-1/2">
            <input
              type="number"
              value={calloutFee}
              onChange={(e) => setCalloutFee(parseFloat(e.target.value) || 0)}
              className={`w-full h-10 px-3 bg-gray-100 rounded-xl outline-2 outline-amber-100 border border-transparent text-indigo-950 text-sm ${inputFocusClasses}`}
            />
          </div>
        </div>

        <div className="h-px w-full bg-indigo-600/10" />

        <div className="flex flex-col gap-3">
          <label className="text-indigo-950 text-sm font-medium">
            Discount
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-12">
              <CustomSelect
                options={discountOptions}
                value={discountType}
                onChange={setDiscountType}
                placeholder="Select Type"
                isSearchable={false}
              />
            </div>
            <div className="w-full ">
              <input
                type="number"
                placeholder="0"
                value={discountValue}
                onChange={(e) =>
                  setDiscountValue(parseFloat(e.target.value) || 0)
                }
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

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-indigo-950 text-sm font-medium">
              VAT Settings
            </span>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isVatExempt}
                onChange={() => setIsVatExempt(!isVatExempt)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-indigo-950 text-sm group-hover:text-indigo-700">
                VAT Exempt
              </span>
            </label>
          </div>

          {isVatExempt ? (
            <div className="h-12 px-4 rounded-xl bg-green-50 outline-2 outline-green-200 text-green-700 flex items-center gap-3 transition-all duration-300">
              <CheckCircle2 size={20} className="text-green-600" />
              <span className="text-sm">
                VAT exemption applied for eligible customer
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
              <div className="flex flex-col gap-2">
                <label className="text-indigo-950 text-xs font-medium">
                  VAT Rate (%)
                </label>
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                  className={`w-full h-12 px-3 bg-gray-100 rounded-xl outline-2 outline-amber-100 border border-transparent text-indigo-950 text-sm ${inputFocusClasses}`}
                />
              </div>
              <div className="flex flex-col gap-2 justify-end">
                <div className="h-12 px-4 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                  <span className="text-gray-600 text-sm">VAT Amount:</span>
                  <span className="text-amber-600 text-lg font-bold">
                    £0.00
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
