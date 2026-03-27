"use client";
import React, { useState } from "react";
import {
  BellDot,
  ChevronDown,
  Sparkles,
  Stars,
  CheckCircle2,
  Lightbulb,
  Copy,
  Check,
  Zap,
  Info,
  RefreshCcw,
} from "lucide-react";
import CommunicationMode from "./CommunicationMode";
import MessageTemplate from "./MessageTemplate";
import RecipientSettings from "./RecipientSettings";
import AlertStatusFooter from "./AlertStatusFooter";

const MessageAlertSetup = () => {
  const [module, setModule] = useState("");
  const [status, setStatus] = useState("");
  const [eventName, setEventName] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  const dynamicVariables = [
    { key: "{CustomerName}", label: "Customer full name" },
    { key: "{TicketNo}", label: "Ticket number" },
    { key: "{Status}", label: "Current status" },
    { key: "{JobDate}", label: "Job scheduled date" },
    { key: "{TechnicianName}", label: "Assigned technician" },
    { key: "{ProductName}", label: "Product name" },
    { key: "{CompanyName}", label: "Company name" },
  ];

  const handleCopy = (text: any) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-[#F0F5FD] p-6 font-sans text-[#1E1F4B] ">
      <div className="flex items-center gap-4 mb-8 ml-2">
        <div className="flex items-center justify-center h-12 w-12 bg-linear-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
          <BellDot size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Message Alert Setup
          </h1>
          <p className="text-[13px] text-[#555675] font-medium opacity-80">
            Configure automated notifications for customer events
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start ">
        <div className="flex-[2.5] w-full space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-white/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-2.5 rounded-xl text-white">
                <Stars size={18} />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold tracking-wide">
                  Basic Information
                </h2>
                <p className="text-[11px] text-[#808191] font-medium">
                  Define the alert configuration details
                </p>
              </div>
            </div>

            <form className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                  Form Name <span className="text-purple-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Ticket Status Update Alert"
                  className="w-full h-10 px-5 rounded-xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] transition-all placeholder:text-[#ACB5BD]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                  Form Module <span className="text-purple-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    className="w-full h-10 px-5 rounded-xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a form module</option>
                    <option value="Quotation Form">Quotation Form</option>
                    <option value="Support Ticket">Support Ticket</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-3.5 text-[#ACB5BD] pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                  Form Status <span className="text-purple-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-10 px-5 rounded-xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a form status</option>
                    <option value="Sent to Customer">Sent to Customer</option>
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-3.5 text-[#ACB5BD] pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of when this alert should be triggered..."
                  className="w-full h-[100px] p-5 rounded-2xl bg-[#F5F8FF] border border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] transition-all placeholder:text-[#ACB5BD] resize-none"
                />
              </div>

              {module && status && (
                <div className="mt-6 p-5 bg-[#EFFFF6] border border-[#00C48C44] rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-[#00C48C] p-2 rounded-xl text-white">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="accent-[#00C48C] h-4 w-4"
                      />
                      <h3 className="text-[14px] font-bold text-[#1E1F4B]">
                        Alert Trigger Configuration
                      </h3>
                    </div>
                    <div className="text-[12px] font-medium space-y-0.5 ml-6">
                      <p className="text-[#555675]">
                        Form Module:{" "}
                        <span className="text-[#00A374]">{module}</span>
                      </p>
                      <p className="text-[#555675]">
                        Trigger Status:{" "}
                        <span className="text-[#00A374]">{status}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#00C48C11] ml-6">
                      <Lightbulb size={14} className="text-orange-400" />
                      <p className="text-[11px] italic text-[#555675]">
                        This alert will be triggered when the selected form
                        reaches the specified status.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-white/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-linear-to-br from-purple-500 to-fuchsia-500 p-2.5 rounded-xl text-white">
                <Zap size={18} />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold tracking-wide">
                  Event Configuration
                </h2>
                <p className="text-[11px] text-[#808191] font-medium">
                  Select the trigger event for this alert
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium ml-1 uppercase tracking-wider opacity-90">
                  Event Name <span className="text-purple-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-3 text-blue-500">
                    <RefreshCcw size={16} />
                  </div>
                  <select
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full h-10 pl-11 pr-5 rounded-xl bg-[#F5F8FF] border-2 border-transparent focus:border-blue-400 focus:bg-white outline-none text-[13px] font-semibold transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select an event</option>
                    <option value="Status Updated">Status Updated</option>
                    <option value="Form Created">Form Created</option>
                    <option value="Response Received">Response Received</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-4 text-[#ACB5BD] pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              {eventName && (
                <div className="p-4 bg-[#F5F1FF] border border-purple-100 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                  <div className="bg-white p-2 rounded-full text-purple-600 shadow-sm border border-purple-50">
                    <Info size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[13px] font-bold text-[#1E1F4B]">
                      Event Selected
                    </h3>
                    <p className="text-[11px] text-[#555675]">
                      This alert will trigger when:{" "}
                      <span className="font-bold">{eventName}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <CommunicationMode />
            <MessageTemplate />
            <RecipientSettings />
            <AlertStatusFooter />
          </div>
        </div>

        <div className="flex-1 w-full space-y-6  lg:top-6">
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm h-[480px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-2.5 rounded-xl text-white">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="font-bold text-[15px]">Dynamic Variables</h2>
                <p className="text-[11px] text-[#808191] font-medium">
                  Click to copy
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {dynamicVariables.map((variable, index) => (
                <div
                  key={index}
                  onClick={() => handleCopy(variable.key)}
                  className="relative w-full bg-white border border-slate-100 p-4 rounded-2xl hover:border-purple-300 transition-all cursor-pointer group active:scale-[0.98] shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-mono text-[13px] font-bold text-purple-600 mb-1">
                      {variable.key}
                    </p>
                    <p className="text-[11px] text-[#555675] font-semibold opacity-80">
                      {variable.label}
                    </p>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#F5F1FF] px-2 py-1 rounded-lg flex items-center gap-1 border border-purple-100 shadow-sm">
                    {copiedKey === variable.key ? (
                      <>
                        <Check size={12} className="text-green-600" />
                        <span className="text-[10px] font-bold text-green-600">
                          Copied
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} className="text-purple-600" />
                        <span className="text-[10px] font-bold text-purple-600">
                          Copy
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl shadow-purple-200">
            <h2 className="font-bold text-[15px] mb-4">
              Configuration Summary
            </h2>
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl flex justify-between items-center border border-white/10">
                <span className="text-[12px] font-medium opacity-90">
                  Channels Selected
                </span>
                <span className="bg-white text-purple-600 h-6 w-6 flex items-center justify-center rounded-full text-[11px] font-bold">
                  1
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl flex justify-between items-center border border-white/10">
                <span className="text-[12px] font-medium opacity-90">
                  Recipients
                </span>
                <span className="bg-white text-purple-600 h-6 w-6 flex items-center justify-center rounded-full text-[11px] font-bold">
                  1
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl flex justify-between items-center border border-white/10">
                <span className="text-[12px] font-medium opacity-90">
                  Status
                </span>
                <span className="bg-emerald-400 text-white px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-tight">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MessageAlertSetup;
