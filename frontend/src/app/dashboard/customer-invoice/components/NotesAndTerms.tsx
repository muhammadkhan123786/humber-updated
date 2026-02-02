import React from "react";
import { FileText } from "lucide-react";

const NotesAndTerms = () => {
  const inputFocusClasses =
    "border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:bg-white focus:outline-none transition-all";

  return (
    <div className="w-full max-w-[1260px] self-stretch bg-white rounded-2xl  outline-2 -outline-offset-2 outline-indigo-100 p-6 flex flex-col gap-6 font-['Arial']">
      <div className="flex items-center gap-3">
        <div className="p-1  rounded-md bg-white text-indigo-600">
          <FileText size={20} />
        </div>
        <h2 className="text-indigo-600 text-base font-normal leading-4">
          Notes & Terms
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-indigo-950 text-sm font-normal leading-4">
            Invoice Notes
          </label>

          <div className="w-full">
            <textarea
              placeholder="Add any additional notes for the customer..."
              className={`${inputFocusClasses} w-full bg-gray-100 px-3 py-2 text-gray-500 text-sm font-normal leading-5 resize-none placeholder:text-gray-400 border-2 rounded-[10px]`}
              rows={2}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-indigo-950 text-sm font-normal leading-4">
            Terms & Conditions
          </label>
          <div className="w-full">
            <textarea
              defaultValue="Payment due within 14 days. VAT exemption applied as per customer eligibility."
              className={`${inputFocusClasses} w-full bg-gray-100 px-3 py-2 text-indigo-950 text-sm font-normal leading-5 resize-none border-2 rounded-[10px]`}
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesAndTerms;
