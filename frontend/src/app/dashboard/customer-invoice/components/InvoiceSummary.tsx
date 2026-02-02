import React from "react";
import { CheckCircle2 } from "lucide-react";

const InvoiceSummary = () => {
  return (
    <div className="w-full max-w-[1260px] bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl  outline-2 -outline-offset-2 outline-green-200 p-6 flex flex-col gap-6 font-sans">
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
          <span className="text-gray-600 text-lg font-normal font-['Arial'] leading-7">
            Parts:
          </span>
          <span className="text-indigo-950 text-lg font-bold font-['Arial'] leading-7">
            £599.98
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg font-normal font-['Arial'] leading-7">
            Labour:
          </span>
          <span className="text-indigo-950 text-lg font-bold font-['Arial'] leading-7">
            £67.50
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg font-normal font-['Arial'] leading-7">
            Callout Fee:
          </span>
          <span className="text-indigo-950 text-lg font-bold font-['Arial'] leading-7">
            £0.00
          </span>
        </div>

        <div className="h-px w-full bg-indigo-600/10" />

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg font-normal font-['Arial'] leading-7">
            Subtotal:
          </span>
          <span className="text-indigo-950 text-lg font-bold font-['Arial'] leading-7">
            £667.48
          </span>
        </div>

        <div className="h-px w-full bg-green-300" />

        <div className="mt-2 px-4 py-4 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl flex justify-between items-center shadow-lg shadow-emerald-900/10">
          <span className="text-white text-2xl font-bold font-['Arial'] leading-8">
            Grand Total:
          </span>
          <span className="text-white text-4xl font-bold font-['Arial'] leading-10">
            £667.48
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
