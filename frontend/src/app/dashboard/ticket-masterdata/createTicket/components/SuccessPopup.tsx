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

  console.log("SuccessPopup ticketData:", ticketData); // Debugging log to check ticketData received by SuccessPopup

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
        <div className="bg-linear-to-r from-green-500 to-emerald-500 p-6 flex items-center gap-5 text-white shrink-0">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border border-white/40 shrink-0">
            <Check size={32} strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {message || "Ticket Created Successfully!"}
            </h2>
            <p className="text-white/90 mt-1">
              Ticket ID: <span className="font-bold">{displayData.id}</span>
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className="mb-8 p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Ticket Information
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">Customer:</span>
                <span className="text-gray-700 ">{displayData.customer}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">Product:</span>
                <span className="text-gray-700 ">{displayData.product}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">Serial No:</span>
                <span className="text-gray-700 ">
                  {displayData.serialNumber}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">Urgency:</span>
                <span
                  className={`text-gray-700 ${
                    displayData.urgency.toLowerCase() === "emergency"
                      ? "text-gray-600"
                      : displayData.urgency.toLowerCase() === "high"
                        ? "text-gray-600"
                        : "text-gray-600"
                  }`}
                >
                  {displayData.urgency}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <label className="flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-base font-semibold">
              Would you like to send this ticket to the customer for approval?
            </label>
            <p className="text-sm text-gray-600">
              The customer will receive an email with the ticket details
              including the investigation report, required parts, and estimated
              costs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (onSendForApproval) {
                  onSendForApproval();
                } else {
                  console.log("Sending for approval...");
                  onClose();
                }
              }}
              className="flex flex-col items-center text-center p-4 rounded-xl border-2 border-transparent bg-linear-to-br from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg"
            >
              <SendHorizontal size={24} className="mb-2" />
              <div className="flex flex-col">
                <span className="font-bold text-base">Send for Approval</span>
                <span className="text-xs opacity-80 mt-1">
                  Email customer now
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                if (onSkipForNow) {
                  onSkipForNow();
                } else {
                  onClose();
                }
              }}
              className="flex flex-col items-center text-center p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300"
            >
              <FileText size={24} className="mb-2 text-gray-400" />
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
