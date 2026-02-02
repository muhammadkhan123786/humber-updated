"use client";

import { Phone, Globe, Store, UserPlus, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
// Path check kar lein apne folder structure ke mutabiq
import { CustomSelect } from "../../../../common-form/CustomSelect";

const StepSourceCustomer = ({ form, customers }: any) => {
  const router = useRouter();
  const {
    watch,
    formState: { errors },
  } = form;

  const selectedSource = watch("ticketSource");
  const selectedCustomerId = watch("customerId");

  const sources = [
    {
      id: "Phone",
      label: "Phone",
      icon: Phone,
      activeGradient: "from-[#0095FF] to-[#00CCFF]",
    },
    {
      id: "Online Portal",
      label: "Online Portal",
      icon: Globe,
      activeGradient: "from-[#C148F0] to-[#F15FD1]",
    },
    {
      id: "Walk-in",
      label: "Walk-in",
      icon: Store,
      activeGradient: "from-[#00C853] to-[#4CAF50]",
    },
  ];

  const selectedCustomerData = customers.find(
    (c: any) => c._id === selectedCustomerId,
  );

  const customerOptions = customers.map((c: any) => ({
    id: c._id,
    label: `${c.personId?.firstName} - ${c.contactId?.mobileNumber}`,
  }));

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div
        className="text-white w-full"
        style={{
          display: "inline-grid",
          height: "66px",
          padding: "12px 32px",
          background: "linear-gradient(90deg, #2B7FFF 0%, #00B8DB 100%)",
          alignContent: "center",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <h2 className="font-bold tracking-tight leading-none pt-3 text-[16px]">
          Source & Customer
        </h2>
        <p className="leading-none opacity-90 pt-3 text-[12px] font-normal">
          Select ticket source and customer
        </p>
      </div>

      <div className="p-10 space-y-10">
        {/* Ticket Source Section */}
        <div className="space-y-4">
          <div className="text-indigo-950 text-base font-normal font-['Arial'] leading-6">
            Ticket Source
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sources.map((item) => {
              const isActive = selectedSource === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => form.setValue("ticketSource", item.id)}
                  className={`relative h-24 w-full rounded-2xl p-5 text-left transition-all duration-300 ${
                    isActive
                      ? `bg-linear-to-br ${item.activeGradient} text-white shadow-lg scale-[1.02]`
                      : "bg-white border border-gray-100 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <div className="w-6 h-6 mb-4">
                    <item.icon
                      size={20}
                      strokeWidth={2.5}
                      className={isActive ? "text-white" : "text-[#0095FF]"}
                    />
                  </div>
                  <p
                    className={`text-sm font-normal ${isActive ? "text-white" : "text-gray-700"}`}
                  >
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-indigo-950 text-base font-normal font-['Arial'] leading-6">
            Select Customer *
          </div>

          <Controller
            name="customerId"
            control={form.control}
            render={({ field }) => (
              <CustomSelect
                isSearchable={true}
                options={customerOptions}
                value={field.value}
                onChange={(id: string) => field.onChange(id)}
                placeholder="Search and select a customer"
                error={!!errors.customerId}
              />
            )}
          />

          {errors.customerId && (
            <p className="text-red-500 text-sm font-bold flex items-center gap-1">
              <Info size={14} /> {errors.customerId.message}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/customerDashboard?create=true")
            }
            className="w-full h-11 bg-[#F8F9FF] rounded-[10px] border-2 border-dashed border-[#A3B3FF] flex items-center justify-center gap-2 text-[13px] font-semibold text-[#4F39F6] hover:bg-white transition-all"
          >
            <UserPlus size={18} strokeWidth={2.5} />
            <span className="tracking-tight">
              Customer Not Found? Register New Customer
            </span>
          </button>
        </div>

        {/* Selected Customer Details Section */}
        {selectedCustomerData && (
          <div className="p-8 rounded-3xl bg-[#F5F3FF] border border-[#4F39F6]/10 space-y-4 animate-in slide-in-from-top-4 duration-500">
            <h3 className="text-[#4F39F6] font-black text-sm uppercase tracking-widest">
              Customer Details
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <DetailRow
                label="Phone"
                value={selectedCustomerData.contactId?.mobileNumber}
              />
              <DetailRow
                label="Email"
                value={selectedCustomerData.contactId?.emailId || "N/A"}
              />
              <DetailRow
                label="Address"
                value={`${selectedCustomerData.addressId?.address || ""}, ${selectedCustomerData.addressId?.zipCode || ""}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start">
    <span className="text-[#4F39F6] font-bold text-sm w-20 shrink-0">
      {label}:
    </span>
    <span className="font-bold text-[#1E293B] text-sm">{value}</span>
  </div>
);

export default StepSourceCustomer;
