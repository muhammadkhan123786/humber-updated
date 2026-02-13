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
  AlertTriangle,
  Loader2,
  Check,
  CircleUserRound,
  Store,
  PhoneCall,
  Building,
  Receipt,
  FileText,
} from "lucide-react";
import { saveCustomer } from "../../../../hooks/useCustomer";
import { Customer } from "../../../../../../common/DTOs/Customer.dto";
import { getById } from "../../../../helper/apiHelper";
import useGoogleMapLoad from "@/hooks/useGoogleMapLoad";
interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GooglePlaceResult {
  place_id?: string;
  formatted_address?: string;
  address_components?: GoogleAddressComponent[];
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

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

  const googleMapLoader = useGoogleMapLoad();

  const { register, handleSubmit, watch, setValue, reset } = useForm<Customer>({
    defaultValues: {
      customerType: "domestic",
      isActive: true,
      isVatExemption: false,
      address: {
        country: "UK",
        address: "",
        city: "",
        zipCode: "",
        latitude: 0,
        longitude: 0,
      },
    } as any,
  });

  const customerType = watch("customerType");
  const isActive = watch("isActive");
  const sourceId = watch("sourceId");
  const isVatExemption = watch("isVatExemption" as any);
  useEffect(() => {
    if (!googleMapLoader || typeof window === "undefined" || !window.google)
      return;

    const input = document.getElementById(
      "street-address-input",
    ) as HTMLInputElement;
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["address"],
      componentRestrictions: { country: "uk" },
    });
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace() as GooglePlaceResult;

      if (!place?.place_id) return;

      const service = new window.google.maps.places.PlacesService(
        document.createElement("div"),
      );

      service.getDetails(
        {
          placeId: place.place_id,
          fields: ["address_components", "formatted_address", "geometry"],
        },
        (result: GooglePlaceResult | null, status: string) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            result
          ) {
            const addressComponents = result.address_components || [];
            const getComponent = (types: string[]): string => {
              const component = addressComponents.find((comp) =>
                types.some((type) => comp.types.includes(type)),
              );
              return component?.long_name || "";
            };
            const streetNumber = getComponent(["street_number"]);
            const route = getComponent(["route"]);
            const address =
              streetNumber && route
                ? `${streetNumber} ${route}`
                : result.formatted_address || input.value;
            const city =
              getComponent(["locality"]) ||
              getComponent(["postal_town"]) ||
              getComponent(["administrative_area_level_3"]);
            const zipCode = getComponent(["postal_code"]);
            const country = getComponent(["country"]);
            setValue("address.address", address);
            setValue("address.city", city);
            setValue("address.zipCode", zipCode);
            setValue("address.country", country);
          }
        },
      );
    });

    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [googleMapLoader, setValue]);

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
        if (data.success) {
          const activeSources = data.data?.filter((s: any) => s.isActive) || [];
          if (activeSources.length < 3) {
            const defaultSources = [
              {
                _id: "walk-in",
                customerSource: "Walk-in",
                isActive: true,
                icon: "walk",
              },
              {
                _id: "phone",
                customerSource: "Phone",
                isActive: true,
                icon: "phone",
              },
              {
                _id: "web",
                customerSource: "Web",
                isActive: true,
                icon: "web",
              },
            ];
            const mergedSources = [...activeSources];
            defaultSources.forEach((def) => {
              if (
                !mergedSources.some(
                  (s) =>
                    s.customerSource.toLowerCase() ===
                    def.customerSource.toLowerCase(),
                )
              ) {
                mergedSources.push(def);
              }
            });
            setSourceOptions(mergedSources);
          } else {
            setSourceOptions(activeSources);
          }
        } else {
          setSourceOptions([
            {
              _id: "walk-in",
              customerSource: "Walk-in",
              isActive: true,
              icon: "walk",
            },
            {
              _id: "phone",
              customerSource: "Phone",
              isActive: true,
              icon: "phone",
            },
            { _id: "web", customerSource: "Web", isActive: true, icon: "web" },
          ]);
        }
      } catch (err) {
        console.error(err);
        setSourceOptions([
          {
            _id: "walk-in",
            customerSource: "Walk-in",
            isActive: true,
            icon: "walk",
          },
          {
            _id: "phone",
            customerSource: "Phone",
            isActive: true,
            icon: "phone",
          },
          { _id: "web", customerSource: "Web", isActive: true, icon: "web" },
        ]);
      }
    };

    fetchSources();
    if (customerId) loadCustomerData(customerId);
  }, [customerId, loadCustomerData]);

  const onFormSubmit = async (data: Customer) => {
    if (!currentUserId) return setError("Session expired.");
    if (!data.address?.address) {
      setError("Please enter a valid address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...data,
        _id: customerId || undefined,
        userId: currentUserId,
        address: {
          ...data.address,
          userId: currentUserId,
          latitude: data.address.latitude || 0,
          longitude: data.address.longitude || 0,
        },
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

  const getSourceIcon = (sourceName: string, isActive: boolean) => {
    console.log(isActive);
    const name = sourceName.toLowerCase();
    if (name.includes("walk")) return <Store size={22} strokeWidth={2.5} />;
    if (name.includes("phone"))
      return <PhoneCall size={22} strokeWidth={2.5} />;
    if (name.includes("web") || name.includes("online"))
      return <Globe size={22} strokeWidth={2.5} />;

    return <Building size={22} strokeWidth={2.5} />;
  };

  const getSourceGradient = (sourceName: string) => {
    const name = sourceName.toLowerCase();
    if (name.includes("walk"))
      return "bg-gradient-to-br from-emerald-500 to-green-500 shadow-green-200";
    if (name.includes("phone"))
      return "bg-gradient-to-br from-orange-500 to-red-500 shadow-orange-200";
    if (name.includes("web") || name.includes("online"))
      return "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-200";
    return "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-200";
  };

  const getSourceHoverBorder = (sourceName: string) => {
    const name = sourceName.toLowerCase();
    if (name.includes("walk")) return "hover:border-green-400";
    if (name.includes("phone")) return "hover:border-red-400";
    if (name.includes("web") || name.includes("online"))
      return "hover:border-blue-400";
    return "hover:border-purple-400";
  };

  if (!googleMapLoader && !customerId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
        <div className="bg-white p-8 rounded-2xl shadow-2xl relative z-10">
          <Loader2 className="animate-spin text-indigo-600 mx-auto" size={40} />
          <p className="mt-4 text-slate-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

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
        className="bg-[#F8FAFC] w-full max-w-[550px] rounded-3xl shadow-2xl relative z-10 overflow-hidden max-h-[95vh] flex flex-col"
      >
        {fetchingData && (
          <div className="absolute inset-0 z-60 bg-white/80 flex items-center justify-center">
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
          className="flex flex-col flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="p-8  flex-1 custom-scrollbar">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="font-semibold text-xl bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {customerId ? "Edit Customer" : "Register New Customer"}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Add a new customer to the system
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
              <div>
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-3">
                  <User size={16} className="text-[#6366F1]" /> Customer Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setValue("customerType", "domestic" as any)}
                    className={`cursor-pointer relative min-h-[140px] rounded-2xl transition-all duration-300 flex flex-col p-[18px]  outline-2 -outline-offset-2 hover:shadow-xl hover:scale-[1.02] active:scale-95 ${
                      customerType === "domestic"
                        ? "bg-linear-to-br from-[#3B82F6] to-[#06B6D4] outline-white/20 shadow-[0px_4px_12px_rgba(59,130,246,0.3)]"
                        : "bg-white outline-gray-200 hover:outline-[#3B82F6] shadow-sm"
                    }`}
                  >
                    <div className="mb-4">
                      <CircleUserRound
                        size={28}
                        strokeWidth={2.5}
                        className={
                          customerType === "domestic"
                            ? "text-white"
                            : "text-gray-400"
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-base font-bold font-['Arial'] leading-6 ${
                          customerType === "domestic"
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        Individual
                      </span>
                      <span
                        className={`text-xs font-normal font-['Arial'] leading-4 ${
                          customerType === "domestic"
                            ? "text-white/80"
                            : "text-gray-500"
                        }`}
                      >
                        Individual customers and walk-in clients
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={() => setValue("customerType", "corporate" as any)}
                    className={`cursor-pointer relative min-h-[140px] rounded-2xl transition-all duration-300 flex flex-col p-[18px]  outline-2 -outline-offset-2 hover:shadow-xl hover:scale-[1.02] active:scale-95 ${
                      customerType === "corporate"
                        ? "bg-linear-to-br from-[#D946EF] to-[#E11DBC] outline-white/20 shadow-[0px_4px_12px_rgba(217,70,239,0.3)]"
                        : "bg-white outline-gray-200 hover:outline-[#D946EF] shadow-sm"
                    }`}
                  >
                    <div className="mb-4">
                      <Building2
                        size={28}
                        strokeWidth={2.5}
                        className={
                          customerType === "corporate"
                            ? "text-white"
                            : "text-gray-400"
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-base font-bold font-['Arial'] leading-6 ${
                          customerType === "corporate"
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        Company
                      </span>
                      <span
                        className={`text-xs font-normal font-['Arial'] leading-4 ${
                          customerType === "corporate"
                            ? "text-white/80"
                            : "text-gray-500"
                        }`}
                      >
                        Corporate clients and business accounts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <CircleUserRound size={16} className="text-[#6366F1]" />{" "}
                    {customerType === "corporate"
                      ? "Contact Person Name *"
                      : "Full Name *"}
                  </label>
                  <input
                    {...register("person.firstName", { required: true })}
                    placeholder="Enter full name"
                    className="
                    w-full h-12 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                    bg-[#F8FAFF] text-slate-700 placeholder:text-slate-400 outline-none
                    selection:bg-primary selection:text-primary-foreground
                    border-[3px] border-transparent
                    hover:border-indigo-200
                    focus:border-indigo-400
                    focus-visible:ring-4px
                    focus-visible:ring-indigo-100/60
                    aria-invalid:border-destructive
                    aria-invalid:ring-destructive/30
                    disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
                  "
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
                      className="w-full h-12 rounded-xl px-4 py-3 text-sm font-medium bg-[#F1F5F9] border-none"
                      placeholder="Enter company name"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-3">
                  <MapPin size={16} className="text-[#10B981]" /> Customer
                  Source *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {sourceOptions
                    .filter((item) => item.isActive === true)
                    .map((item, index) => {
                      const activeBg = getSourceGradient(item.customerSource);
                      const hoverBorder = getSourceHoverBorder(
                        item.customerSource,
                      );

                      return (
                        <div
                          key={item._id || index}
                          onClick={() => setValue("sourceId", item._id)}
                          className={`
                            cursor-pointer relative p-4 rounded-2xl transition-all duration-300
                            flex flex-col items-center justify-center gap-2 text-center
                            outline-2 -outline-offset-2
                            hover:scale-[1.05] active:scale-95 shadow-lg
                            ${
                              sourceId === item._id
                                ? `${activeBg} text-white outline-white/20`
                                : `bg-white text-slate-500 border-2 border-transparent outline-gray-100 ${hoverBorder}`
                            }
                          `}
                        >
                          <div
                            className={
                              sourceId === item._id
                                ? "text-white"
                                : "text-slate-400"
                            }
                          >
                            {getSourceIcon(
                              item.customerSource,
                              sourceId === item._id,
                            )}
                          </div>

                          <span
                            className={`text-[12px] font-bold font-['Arial'] ${sourceId === item._id ? "text-white" : "text-slate-600"}`}
                          >
                            {item.customerSource}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Mail size={16} className="text-[#A855F7]" /> Email Address
                    *
                  </label>
                  <input
                    {...register("contact.emailId", { required: true })}
                    type="email"
                    placeholder="customer@example.com"
                    className="
                      w-full h-12 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                      bg-[#F8FAFF] text-slate-700 placeholder:text-slate-400 outline-none shadow-sm
                      selection:bg-primary selection:text-primary-foreground
                      border-[3px] border-transparent
                      hover:border-[#A855F7]/40
                      focus:border-[#A855F7]
                      focus-visible:ring-4px
                      focus-visible:ring-[#A855F7]/20
                      aria-invalid:border-destructive
                      aria-invalid:ring-destructive/30
                      disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
                    "
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Phone size={16} className="text-[#3B82F6]" /> Phone Number
                    *
                  </label>
                  <input
                    {...register("contact.mobileNumber", { required: true })}
                    placeholder="+1 (555) 123-4567"
                    className="
                      w-full h-12 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                      bg-[#F8FAFF] text-slate-700 placeholder:text-slate-400 outline-none shadow-sm
                      selection:bg-primary selection:text-primary-foreground
                      border-[3px] border-transparent
                      hover:border-[#3B82F6]/40
                      focus:border-[#3B82F6]
                      focus-visible:ring-4px
                      focus-visible:ring-[#3B82F6]/20
                      aria-invalid:border-destructive
                      aria-invalid:ring-destructive/30
                      disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
                    "
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 transition-colors group-focus-within:text-[#10B981]">
                    <MapPin size={16} className="text-[#10B981]" /> Street
                    Address *
                  </label>
                  <input
                    id="street-address-input"
                    {...register("address.address", { required: true })}
                    placeholder="123 Main Street"
                    className="
                      w-full h-12 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                      bg-[#F0FDF4] text-slate-700 placeholder:text-slate-400 outline-none
                      border-[3px] border-transparent hover:border-[#10B981]/30
                      focus:border-[#10B981] focus-visible:ring-4px focus-visible:ring-[#10B981]/20
                    "
                  />
                  <p className="text-xs text-slate-500">
                    Start typing your UK address and select from suggestions
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 transition-colors group-focus-within:text-[#3B82F6]">
                      <Building size={16} className="text-[#3B82F6]" /> City *
                    </label>
                    <input
                      {...register("address.city", { required: true })}
                      placeholder="London"
                      className="
                        w-full h-12 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                        bg-[#F0F9FF] text-slate-700 placeholder:text-slate-400 outline-none
                        border-[3px] border-transparent hover:border-[#3B82F6]/30
                        focus:border-[#3B82F6] focus-visible:ring-4px focus-visible:ring-[#3B82F6]/20
                        read-only:bg-[#F1F5F9] read-only:cursor-not-allowed
                      "
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 transition-colors group-focus-within:text-[#EC4899]">
                      <MapPin size={16} className="text-[#EC4899]" /> Postcode *
                    </label>
                    <input
                      {...register("address.zipCode", { required: true })}
                      placeholder="SW1A 1AA"
                      className="
                        w-full h-12 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                        bg-[#FDF2F8] text-slate-700 placeholder:text-slate-400 outline-none
                        border-[3px] border-transparent hover:border-[#EC4899]/30
                        focus:border-[#EC4899] focus-visible:ring-4px focus-visible:ring-[#EC4899]/20
                        read-only:bg-[#F1F5F9] read-only:cursor-not-allowed
                      "
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 ">
                  <input type="hidden" {...register("address.latitude")} />
                  <input type="hidden" {...register("address.longitude")} />
                  <input type="hidden" {...register("address.country")} />
                </div>
              </div>

              <div className="space-y-3">
                <div
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    isActive
                      ? "bg-[#ECFDF5] border-[#10B981]/20"
                      : "bg-[#F8FAFC] border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full transition-colors shadow-sm ${
                        isActive
                          ? "bg-[#00C853] text-white"
                          : "bg-[#94A3B8] text-white"
                      }`}
                    >
                      {isActive ? (
                        <Check size={20} strokeWidth={3} />
                      ) : (
                        <X size={20} strokeWidth={3} />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#1E293B]">
                        Customer Status
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 leading-tight">
                        {isActive
                          ? "Active and can receive services"
                          : "Inactive and cannot receive services"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setValue("isActive", !isActive)}
                    className={`w-11 h-6 rounded-full p-1 transition-all duration-300 ${
                      isActive ? "bg-[#00C853]" : "bg-[#CBD5E1]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                        isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    isVatExemption
                      ? "bg-[#FFF9F0] border-[#F59E0B]/20"
                      : "bg-[#FDFDFD] border-slate-100 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-full transition-colors shadow-sm ${
                          isVatExemption
                            ? "bg-[#FF8F00] text-white"
                            : "bg-[#94A3B8] text-white"
                        }`}
                      >
                        <Receipt size={22} strokeWidth={2.5} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#1E293B]">
                          VAT Exemption
                        </p>
                        <p className="text-[11px] font-medium text-slate-500 leading-tight">
                          {isVatExemption
                            ? "Customer is VAT exempt"
                            : "Standard VAT applies"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setValue("isVatExemption", !isVatExemption)
                      }
                      className={`w-11 h-6 rounded-full p-1 transition-all duration-300 ${
                        isVatExemption ? "bg-[#FF8F00]" : "bg-[#CBD5E1]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                          isVatExemption ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {isVatExemption && (
                    <div className="mt-4 border-t border-amber-100 pt-4 space-y-3">
                      <div className="space-y-2 group">
                        <label className="flex items-center gap-2 text-[12px] font-bold text-slate-700 group-focus-within:text-[#FF8F00] transition-colors">
                          <FileText size={16} className="text-[#FF8F00]" />{" "}
                          Exemption Reason *
                        </label>
                        <textarea
                          {...register("vatExemptionReason", {
                            required: isVatExemption,
                          })}
                          placeholder="e.g., Disability aids, Charity organization, Medical equipment..."
                          className="
                            w-full min-h-[100px] bg-white rounded-xl p-4 text-sm font-medium transition-all
                            border-[3px] border-slate-100 focus:border-[#FF8F00]
                            outline-none focus:ring-4px focus:ring-[#FF8F00]/10
                            placeholder:text-slate-300
                          "
                        />
                      </div>

                      <div className="flex items-start gap-2 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                        <AlertTriangle
                          size={16}
                          className="text-[#FF8F00] mt-0.5 shrink-0"
                        />
                        <p className="text-[11px] font-medium text-amber-800 leading-normal">
                          Please specify the reason for VAT exemption. This must
                          comply with HMRC regulations.
                        </p>
                      </div>
                    </div>
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
                className="py-3 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-green-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || fetchingData || !googleMapLoader}
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
