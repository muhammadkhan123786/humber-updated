"use client";

import React from "react";
import {
  Phone,
  Globe,
  Store,
  ChevronRight,
  User,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

const StepSourceCustomer = ({ onNext, form, customers }: any) => {
  const selectedSource = form.watch("ticketSource");
  const selectedCustomerId = form.watch("customerId");

  const sources = [
    { id: "Phone", label: "Phone", icon: Phone, color: "bg-[#2B7FFF]" },
    {
      id: "Online Portal",
      label: "Online Portal",
      icon: Globe,
      color: "bg-purple-500",
    },
    { id: "Walk-in", label: "Walk-in", icon: Store, color: "bg-orange-500" },
  ];

  const selectedCustomerData = customers.find(
    (c: any) => c._id === selectedCustomerId,
  );

  const router = useRouter();
  const onRegisterClick = () => {
    router.push("/dashboard/customers");
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div
        className="p-8 text-white"
        style={{
          display: "inline-grid",
          height: "66px",
          rowGap: "6px",
          columnGap: "6px",
          gridTemplateRows: "minmax(0, 16fr) minmax(0, 1fr)",
          gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
          borderRadius: "12px 12px 0 0",
          background: "linear-gradient(90deg, #2B7FFF 0%, #00B8DB 100%)",
        }}
      >
        <h2 className="text-xl font-bold tracking-tight leading-none">
          Source & Customer
        </h2>
      </div>

      <div className="p-10 space-y-10">
        {/* Ticket Source Section */}
        <div className="space-y-4">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest">
            Ticket Source
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sources.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => form.setValue("ticketSource", item.id)}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-3xl transition-all border ${
                  selectedSource === item.id
                    ? `${item.color} text-white shadow-xl scale-[1.02] border-transparent`
                    : "bg-white border-gray-100 text-[#64748B] hover:border-gray-200"
                }`}
              >
                <item.icon size={32} />
                <span className="font-bold text-base">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer Selection Section */}
        <div className="space-y-4">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-2">
            <User size={16} className="text-[#4F39F6]" /> Select Customer *
          </label>
          <div className="relative">
            <select
              {...form.register("customerId")}
              className="w-full p-4 rounded-2xl bg-[#F8FAFF] border border-[#EEF2FF] text-[#1E293B] font-bold outline-none appearance-none cursor-pointer pr-10"
            >
              <option value="">Select a customer</option>
              {customers.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.personId?.firstName} {c.personId?.lastName} -{" "}
                  {c.contactId?.phoneNumber}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4F39F6]">
              <ChevronRight size={20} className="rotate-90" />
            </div>
          </div>

          {/* REGISTER NEW CUSTOMER BUTTON */}
          <button
            type="button"
            onClick={onRegisterClick}
            className="w-full mt-4 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#4F39F6]/30 bg-[#F5F3FF]/50 text-[#4F39F6] font-bold transition-all hover:bg-[#F5F3FF] hover:border-[#4F39F6]/50 group"
          >
            <UserPlus
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span>Customer Not Found? Register New Customer</span>
          </button>
        </div>

        {/* Selected Customer Details Card */}
        {selectedCustomerData && (
          <div className="p-8 rounded-3xl bg-[#F5F3FF] border border-[#4F39F6]/10 space-y-4 animate-in slide-in-from-top-4 duration-500">
            <h3 className="text-[#4F39F6] font-black text-sm uppercase tracking-widest">
              Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow
                label="Name"
                value={`${selectedCustomerData.personId?.firstName} ${selectedCustomerData.personId?.lastName}`}
              />
              <DetailRow
                label="Phone"
                value={selectedCustomerData.contactId?.phoneNumber}
              />
              <DetailRow
                label="Email"
                value={selectedCustomerData.contactId?.emailId || "N/A"}
              />
              <DetailRow
                label="Address"
                value={`${selectedCustomerData.addressId?.address}, ${selectedCustomerData.addressId?.zipCode}`}
              />
            </div>
          </div>
        )}

        {/* Navigation Button */}
        <div className="flex justify-end pt-8 border-t border-gray-50">
          <button
            onClick={onNext}
            disabled={!selectedCustomerId || !selectedSource}
            className={`flex items-center gap-2 px-10 py-4 font-black text-white transition-all ${
              selectedCustomerId && selectedSource
                ? "hover:opacity-90 scale-[1.02] active:scale-[0.98]"
                : "cursor-not-allowed opacity-50"
            }`}
            style={{
              borderRadius: "10px",
              background:
                selectedCustomerId && selectedSource
                  ? "linear-gradient(90deg, #2B7FFF 0%, #00B8DB 100%)"
                  : "#E5E7EB",
              boxShadow:
                selectedCustomerId && selectedSource
                  ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for cleaner code
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start">
    <span className="text-[#4F39F6] font-bold text-sm w-20 shrink-0">
      {label}:
    </span>
    <span className="font-bold text-[#1E293B] text-sm">{value}</span>
  </div>
);

export default StepSourceCustomer;
