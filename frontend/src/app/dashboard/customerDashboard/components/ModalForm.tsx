"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  ReceiptText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Check,
} from "lucide-react";
import { saveCustomer } from "../../../../hooks/useCustomer";
import { Customer } from "../../../../../../common/DTOs/Customer.dto";
import { getById } from "../../../../helper/apiHelper";

interface ModalProps {
  onClose: () => void;
  onSuccess?: (customer: Customer) => void;
  customerId?: string | null;
}

const ModalForm: React.FC<ModalProps> = ({
  onClose,
  onSuccess,
  customerId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sourceOptions, setSourceOptions] = useState<any[]>([]);

  const { register, handleSubmit, watch, setValue, reset } = useForm<Customer>({
    defaultValues: {
      customerType: "domestic",
      isActive: true,
      isVatExemption: false,
      address: { country: "UK" },
    } as any,
  });

  const customerType = watch("customerType");
  const isActive = watch("isActive");
  const sourceId = watch("sourceId");
  const isVatExemption = watch("isVatExemption" as any);

  const loadCustomerData = useCallback(
    async (id: string) => {
      setFetchingData(true);
      try {
        const cleanId = id.replace(/"/g, "").trim();
        const response = await getById<any>("/customers", cleanId);

        if (response.success && response.data) {
          const d = response.data;

          reset({
            customerType: d.customerType,
            companyName: d.companyName,
            sourceId: d.sourceId?._id || d.sourceId,
            isActive: d.isActive,
            isVatExemption: d.isVatExemption,
            vatExemptionReason: d.vatExemptionReason,
            person: d.personId || {},
            contact: d.contactId || {},
            address: d.addressId || {},
          } as any);
        }
      } catch (err: any) {
        setError("Could not fetch customer details.");
        console.log(err);
      } finally {
        setFetchingData(false);
      }
    },
    [reset],
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUserId(user.id || user._id || null);

    const fetchSources = async () => {
      try {
        const token = localStorage.getItem("token")?.replace(/"/g, "") || "";
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${baseUrl}/customer-source`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success)
          setSourceOptions(data.data?.filter((s: any) => s.isActive));
      } catch (err) {
        console.error(err);
      }
    };

    fetchSources();
    if (customerId) loadCustomerData(customerId);
  }, [customerId, loadCustomerData]);

  const onFormSubmit = async (data: Customer) => {
    if (!currentUserId) return setError("Session expired.");
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...data,
        _id: customerId || undefined,
        userId: currentUserId,
        address: { ...data.address, userId: currentUserId },
      };

      const result = await saveCustomer(payload);
      setSuccess(true);
      if (onSuccess) onSuccess(result as unknown as Customer);
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setError(err.message || "Submission failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#F8FAFC] w-full max-w-[750px] rounded-3xl shadow-2xl relative z-10 overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Loading State for Edit */}
        {fetchingData && (
          <div className="absolute inset-0 z-[60] bg-white/80 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        )}

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                {customerId ? "Customer Updated!" : "Registration Complete!"}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-bold text-[#6366F1] leading-tight">
                  {customerId ? "Edit Customer" : "Register New Customer"}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Manage customer profile details
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                <AlertTriangle size={18} /> {error}
              </div>
            )}

            <div className="space-y-6 mt-6">
              {/* Customer Type Selector */}
              <div>
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-3">
                  <User size={16} className="text-[#6366F1]" /> Customer Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setValue("customerType", "domestic" as any)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 ${customerType === "domestic" ? "border-[#0EA5E9] bg-linear-to-br from-[#38BDF8] to-[#0284C7] text-white" : "border-white bg-white text-slate-600 shadow-sm"}`}
                  >
                    <User
                      size={22}
                      className={
                        customerType === "domestic"
                          ? "text-white"
                          : "text-slate-400"
                      }
                    />
                    <span className="font-bold text-sm">Individual</span>
                  </div>

                  <div
                    onClick={() => setValue("customerType", "corporate" as any)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 ${customerType === "corporate" ? "border-[#D946EF] bg-linear-to-br from-[#E879F9] to-[#C026D3] text-white" : "border-white bg-white text-slate-600 shadow-sm"}`}
                  >
                    <Building2
                      size={22}
                      className={
                        customerType === "corporate"
                          ? "text-white"
                          : "text-slate-400"
                      }
                    />
                    <span className="font-bold text-sm">Company</span>
                  </div>
                </div>
              </div>

              {/* Name & Company */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <User size={16} className="text-[#6366F1]" />{" "}
                    {customerType === "corporate"
                      ? "Contact Person Name *"
                      : "Full Name *"}
                  </label>
                  <input
                    {...register("person.firstName", { required: true })}
                    className="w-full bg-[#E8F0FE] border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 ring-indigo-200 "
                    placeholder="NAME"
                  />
                </div>
                {customerType === "corporate" && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <Building2 size={16} className="text-[#6366F1]" /> Company
                      Name *
                    </label>
                    <input
                      {...register("companyName", { required: true })}
                      className="w-full bg-[#F1F5F9] border-none rounded-xl px-4 py-3 text-sm font-medium"
                      placeholder="Enter company name"
                    />
                  </div>
                )}
              </div>

              {/* Source */}
              <div>
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-3">
                  <MapPin size={16} className="text-[#10B981]" /> Customer
                  Source *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {sourceOptions
                    .filter((item) => item.isActive === true)
                    .map((item) => (
                      <div
                        key={item._id}
                        onClick={() => setValue("sourceId", item._id)}
                        className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center shadow-sm ${
                          sourceId === item._id
                            ? "text-white bg-linear-to-br from-[#6366F1] to-[#4F46E5] border-transparent"
                            : "border-white bg-white text-slate-500"
                        }`}
                      >
                        <Globe size={18} />
                        <span className="text-[10px] font-bold">
                          {item.customerSource}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Mail size={16} className="text-[#A855F7]" /> Email Address
                    *
                  </label>
                  <input
                    {...register("contact.emailId", { required: true })}
                    type="email"
                    className="w-full bg-[#F8FAFC] border-none rounded-xl px-4 py-3 text-sm font-medium shadow-sm"
                    placeholder="customer@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Phone size={16} className="text-[#3B82F6]" /> Phone Number
                    *
                  </label>
                  <input
                    {...register("contact.mobileNumber", { required: true })}
                    className="w-full bg-[#E8F0FE] border-none rounded-xl px-4 py-3 text-sm font-medium"
                    placeholder="032024234443"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <MapPin size={16} className="text-[#10B981]" /> Street
                    Address *
                  </label>
                  <input
                    {...register("address.address", { required: true })}
                    className="w-full bg-[#F1F5F9] border-none rounded-xl px-4 py-3 text-sm font-medium"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    {...register("address.city")}
                    placeholder="City"
                    className="w-full bg-[#E0F2FE] border-none rounded-xl px-4 py-3 text-sm font-medium"
                  />
                  <input
                    {...register("address.zipCode")}
                    placeholder="Postcode"
                    className="w-full bg-[#FCE7F3] border-none rounded-xl px-4 py-3 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="space-y-3">
                <div
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${isActive ? "bg-[#ECFDF5] border-[#10B981]/20" : "bg-slate-50 border-slate-200"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${isActive ? "bg-[#10B981] text-white" : "bg-slate-300 text-white"}`}
                    >
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Customer Status
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue("isActive", !isActive)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${isActive ? "bg-[#10B981]" : "bg-slate-300"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${isActive ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                <div
                  className={`p-4 rounded-2xl border-2 transition-all ${isVatExemption ? "bg-[#FFFBEB] border-[#F59E0B]/20" : "bg-white border-slate-100 shadow-sm"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${isVatExemption ? "bg-[#F59E0B] text-white" : "bg-slate-400 text-white"}`}
                      >
                        <ReceiptText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          VAT Exemption
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {isVatExemption ? "Exempt" : "Standard"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setValue("isVatExemption" as any, !isVatExemption)
                      }
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${isVatExemption ? "bg-[#F59E0B]" : "bg-slate-200"}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${isVatExemption ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                  {isVatExemption && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-4 border-t border-amber-200 pt-4"
                    >
                      <textarea
                        {...register("vatExemptionReason" as any)}
                        placeholder="Exemption Reason..."
                        className="w-full bg-white border-none rounded-xl p-3 text-sm min-h-20 focus:ring-1 ring-amber-500"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={onClose}
                className="py-3 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || fetchingData}
                className="py-3 rounded-xl font-bold text-white bg-linear-to-r from-[#6366F1] to-[#8B5CF6] shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : customerId ? (
                  "Update Customer"
                ) : (
                  "Register Customer"
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                console.log("Create Ticket clicked");
              }}
              className="w-full py-3 rounded-xl font-bold text-emerald-600 bg-white border-2 border-emerald-500 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              <ReceiptText size={18} />
              Create Ticket
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ModalForm;
