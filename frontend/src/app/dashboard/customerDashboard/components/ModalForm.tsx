"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  User,
  Building2,
  Store,
  Phone,
  Globe,
  Mail,
  PhoneCall,
  MapPin,
  ReceiptText,
  CheckCircle2,
  AlertTriangle,
  TicketPlus,
} from "lucide-react";

interface ModalProps {
  onClose: () => void;
}

const ModalForm: React.FC<ModalProps> = ({ onClose }) => {
  const [customerType, setCustomerType] = useState<"Individual" | "Company">(
    "Individual",
  );
  const [source, setSource] = useState<
    "Walk-In" | "Phone Call" | "Website/Mobile"
  >("Phone Call");
  const [status, setStatus] = useState(true);
  const [vatExempt, setVatExempt] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#F8FAFC] w-full max-w-[750px] rounded-3xl shadow-2xl relative z-10 overflow-hidden max-h-[95vh] flex flex-col"
      >
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold text-[#6366F1] leading-tight">
                Register New Customer
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Add a new customer to the system
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6 mt-6">
            <div>
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-3">
                <User size={16} className="text-[#6366F1]" /> Customer Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setCustomerType("Individual")}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 ${
                    customerType === "Individual"
                      ? "border-[#0EA5E9] bg-linear-to-br from-[#38BDF8] to-[#0284C7] text-white"
                      : "border-white bg-white text-slate-600 shadow-sm"
                  }`}
                >
                  <User
                    size={22}
                    className={
                      customerType === "Individual"
                        ? "text-white"
                        : "text-slate-400"
                    }
                  />
                  <span className="font-bold text-sm">Individual</span>
                  <p
                    className={`text-[10px] leading-tight ${customerType === "Individual" ? "text-white/80" : "text-slate-400"}`}
                  >
                    Individual customers and walk-in clients
                  </p>
                </div>

                <div
                  onClick={() => setCustomerType("Company")}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 ${
                    customerType === "Company"
                      ? "border-[#D946EF] bg-linear-to-br from-[#E879F9] to-[#C026D3] text-white"
                      : "border-white bg-white text-slate-600 shadow-sm"
                  }`}
                >
                  <Building2
                    size={22}
                    className={
                      customerType === "Company"
                        ? "text-white"
                        : "text-slate-400"
                    }
                  />
                  <span className="font-bold text-sm">Company</span>
                  <p
                    className={`text-[10px] leading-tight ${customerType === "Company" ? "text-white/80" : "text-slate-400"}`}
                  >
                    Corporate clients and business accounts
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {customerType === "Individual" ? (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 font-sans">
                    <User size={16} className="text-[#6366F1]" /> Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="RABIA AHMAD"
                    className="w-full bg-[#E8F0FE] border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 ring-indigo-200"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <User size={16} className="text-[#6366F1]" /> Contact
                      Person Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter contact person name"
                      className="w-full bg-[#E8F0FE] border-2 border-[#6366F1]/40 rounded-xl px-4 py-3 text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <Building2 size={16} className="text-[#6366F1]" /> Company
                      Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      className="w-full bg-[#F1F5F9] border-none rounded-xl px-4 py-3 text-sm font-medium"
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-3">
                <MapPin size={16} className="text-[#10B981]" /> Customer Source
                *
              </label>
              <div className="grid grid-cols-3 gap-5">
                {[
                  { id: "Walk-In", icon: Store, label: "Walk-In" },
                  {
                    id: "Phone Call",
                    icon: PhoneCall,
                    label: "Phone Call",
                    color: "from-[#F97316] to-[#EF4444]",
                  },
                  {
                    id: "Website/Mobile",
                    icon: Globe,
                    label: "Website/Mobile",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSource(item.id as any)}
                    className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center shadow-sm ${
                      source === item.id
                        ? `text-white ${item.color || "from-[#6366F1] to-[#4F46E5]"} bg-linear-to-br border-transparent`
                        : "border-white bg-white text-slate-500"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-[10px] font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                  <Mail size={16} className="text-[#A855F7]" /> Email Address *
                </label>
                <input
                  type="email"
                  placeholder="customer@example.com"
                  className="w-full bg-[#F8FAFC] border-none rounded-xl px-4 py-3 text-sm font-medium shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                  <Phone size={16} className="text-[#3B82F6]" /> Phone Number *
                </label>
                <input
                  type="text"
                  placeholder="032024234443"
                  className="w-full bg-[#E8F0FE] border-none rounded-xl px-4 py-3 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                  <MapPin size={16} className="text-[#10B981]" /> Street Address
                  *
                </label>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  className="w-full bg-[#F1F5F9] border-none rounded-xl px-4 py-3 text-sm font-medium"
                />
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  💡 Tip: Google Places autocomplete can be enabled with an API
                  key
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Building2 size={16} className="text-[#06B6D4]" /> City *
                  </label>
                  <input
                    type="text"
                    placeholder="Lahore"
                    className="w-full bg-[#E0F2FE] border-none rounded-xl px-4 py-3 text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <MapPin size={16} className="text-[#EC4899]" /> Postcode *
                  </label>
                  <input
                    type="text"
                    placeholder="05450"
                    className="w-full bg-[#FCE7F3] border-none rounded-xl px-4 py-3 text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${status ? "bg-[#ECFDF5] border-[#10B981]/20" : "bg-slate-50 border-slate-200"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${status ? "bg-[#10B981] text-white" : "bg-slate-300 text-white"}`}
                  >
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      Customer Status
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {status ? "Active and can receive services" : "Inactive"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStatus(!status)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${status ? "bg-[#10B981]" : "bg-slate-300"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${status ? "translate-x-6" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <div
                className={`p-4 rounded-2xl border-2 transition-all ${vatExempt ? "bg-[#FFFBEB] border-[#F59E0B]/20" : "bg-white border-slate-100 shadow-sm"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${vatExempt ? "bg-[#F59E0B] text-white" : "bg-slate-400 text-white"}`}
                    >
                      <ReceiptText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        VAT Exemption
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {vatExempt
                          ? "Customer is VAT exempt"
                          : "Standard VAT applies"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setVatExempt(!vatExempt)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${vatExempt ? "bg-[#F59E0B]" : "bg-slate-200"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${vatExempt ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>
                {vatExempt && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="space-y-3 mt-4 border-t border-amber-200 pt-4"
                  >
                    <label className="flex items-center gap-2 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                      📋 Exemption Reason *
                    </label>
                    <textarea
                      placeholder="e.g., Disability aids, Charity organization..."
                      className="w-full bg-white border-none rounded-xl p-3 text-sm  min-h-20 focus:ring-1 ring-amber-500"
                    />
                    <div className="bg-amber-100/50 p-3 rounded-xl flex gap-2 border border-amber-200">
                      <AlertTriangle
                        size={16}
                        className="text-amber-600 shrink-0"
                      />
                      <p className="text-[10px] text-amber-800">
                        Please specify the reason for VAT exemption. This must
                        comply with HMRC regulations.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="py-3 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button className="py-3 rounded-xl font-bold text-white bg-linear-to-r from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-indigo-200 hover:opacity-90 transition-all">
              Register Customer
            </button>
          </div>
          <button className="w-full py-3 rounded-xl font-bold text-[#10B981] border-2 border-[#10B981] flex items-center justify-center gap-2 hover:bg-[#10B981]/5 transition-all">
            <TicketPlus size={18} /> Create Ticket
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalForm;
