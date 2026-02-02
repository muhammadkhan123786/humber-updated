import React from "react";
import { Check, SendHorizontal, FileText } from "lucide-react";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  ticketData?: {
    id: string;
    customer: string;
    product: string;
    serialNumber: string;
    urgency: string;
  };
  onSendForApproval?: () => void;
  onSkipForNow?: () => void;
}

const SuccessPopup = ({
  isOpen,
  onClose,
  message,
  ticketData,
  onSendForApproval,
  onSkipForNow,
}: SuccessPopupProps) => {
  if (!isOpen) return null;

  const displayData = ticketData || {
    id: "T-2026-Pending",
    customer: "N/A",
    product: "N/A",
    serialNumber: "N/A",
    urgency: "Normal",
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-[28px] w-full max-w-[600px] max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#00C950] p-6 flex items-center gap-5 text-white shrink-0">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border border-white/40 shrink-0">
            <Check size={32} strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              {message || "Ticket Created Successfully!"}
            </h2>
            <p className="opacity-90 text-base font-medium">
              Ticket ID: <span className="font-bold">{displayData.id}</span>
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {/* Ticket Summary Section */}
          <div className="mb-8">
            <div className="border-t border-gray-200 my-4"></div>
            <h3 className="text-[#1E293B] font-bold text-xl mb-4 text-center uppercase tracking-wider">
              TICKET SUMMARY
            </h3>

            {/* Ticket Information - Dynamic values */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Customer:</span>
                <span className="text-gray-900 font-bold text-lg">
                  {displayData.customer}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Product:</span>
                <span className="text-gray-900 font-bold text-lg">
                  {displayData.product}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Serial No:</span>
                <span className="text-gray-900 font-bold text-lg">
                  {displayData.serialNumber}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Urgency:</span>
                <span
                  className={`font-bold text-lg ${
                    displayData.urgency.toLowerCase() === "emergency"
                      ? "text-red-600"
                      : displayData.urgency.toLowerCase() === "high"
                        ? "text-orange-600"
                        : "text-green-600"
                  }`}
                >
                  {displayData.urgency}
                </span>
              </div>
            </div>
          </div>

          {/* Approval Question */}
          <div className="mb-8 text-center">
            <h4 className="text-gray-900 font-bold text-xl mb-3">
              Send for customer approval?
            </h4>
            <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto">
              The customer will receive an email with investigation reports.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {/* Send for Approval Button */}
            <button
              onClick={() => {
                if (onSendForApproval) {
                  onSendForApproval();
                } else {
                  console.log("Sending for approval...");
                  onClose();
                }
              }}
              className="flex flex-col items-center justify-center gap-2 py-5 px-4 bg-[#1E293B] text-white rounded-[20px] hover:bg-black transition-all hover:shadow-lg active:scale-[0.97]"
            >
              <SendHorizontal size={24} />
              <div className="flex flex-col">
                <span className="font-bold text-base">Send for Approval</span>
                <span className="text-xs opacity-80 mt-1">
                  Email customer now
                </span>
              </div>
            </button>

            {/* Skip for Now Button */}
            <button
              onClick={() => {
                if (onSkipForNow) {
                  onSkipForNow();
                } else {
                  onClose();
                }
              }}
              className="flex flex-col items-center justify-center gap-2 py-5 px-4 bg-gray-50 border border-gray-200 text-gray-700 rounded-[20px] hover:bg-white hover:border-gray-300 hover:text-gray-900 transition-all active:scale-[0.97]"
            >
              <FileText size={24} />
              <div className="flex flex-col">
                <span className="font-bold text-base">Skip for Now</span>
                <span className="text-xs text-gray-500 mt-1">
                  Send later from ticket page
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
