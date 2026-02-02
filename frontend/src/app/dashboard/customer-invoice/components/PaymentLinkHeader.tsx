"use client";
import React, { useState } from "react";
import { Link2, Info, Check } from "lucide-react";

const PaymentLinkCard = () => {
  const [copied, setCopied] = useState(false);
  const paymentUrl = "https://payment.mobilityscooter.com/pay/INV-2026-1136";

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full self-stretch h-56 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl outline-2 -outline-offset-2 outline-blue-100 flex flex-col justify-start items-start gap-6 overflow-hidden font-['Arial']">
      <div className="w-full px-6 pt-6 flex flex-col justify-start items-start">
        <div className="flex items-center gap-2 relative">
          <div className="text-blue-600">
            <Link2 size={20} strokeWidth={2.5} />
          </div>
          <div className="text-blue-600 text-base font-normal leading-4">
            Payment Link
          </div>
        </div>
        <div className="mt-1 text-gray-500 text-base font-normal leading-6">
          Share this secure payment link with your customer
        </div>
      </div>

      <div className="w-full flex-1 px-6 flex flex-col justify-start items-start gap-3">
        <div className="w-full h-9 flex justify-start items-start gap-2">
          <div className="flex-1 h-9 px-3 py-1 bg-white rounded-[10px] outline-2 -outline-offset-2 outline-blue-200 flex justify-start items-center overflow-hidden focus-within:outline-blue-500 transition-all">
            <input
              readOnly
              value={paymentUrl}
              className="w-full bg-transparent border-none outline-none text-indigo-950 text-sm font-normal font-['Consolas'] leading-5"
            />
          </div>

          <button
            onClick={handleCopy}
            className={`w-28 h-9 shrink-0 relative rounded-[10px] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
              copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {copied ? (
              <Check size={16} className="text-white" />
            ) : (
              <div className="w-4 h-4 relative">
                <div className="w-2.5 h-2.5 absolute right-0 bottom-0 border-[1.5px] border-white rounded-xs" />
                <div className="w-2.5 h-2.5 absolute left-0 top-0 border-[1.5px] border-white rounded-xs" />
              </div>
            )}
            <span className="text-white text-sm font-normal leading-5">
              {copied ? "Copied" : "Copy Link"}
            </span>
          </button>
        </div>

        <div className="self-stretch h-12 relative bg-blue-100 rounded-xl outline-1 -outline-offset-1 outline-blue-300 flex items-center px-[13px]">
          <div className="flex items-center gap-2">
            <div className="text-blue-600 shrink-0">
              <Info size={20} />
            </div>
            <div className="text-blue-800 text-sm font-normal leading-5">
              This payment link will be included in the invoice email sent to
              the customer. They can pay securely online using credit/debit card
              or bank transfer.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentLinkCard;
