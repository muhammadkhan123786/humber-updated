import React from "react";
import {
  Check,
  Truck,
  User,
  Building,
  Users,
  Calendar,
  UserCheck,
  Package,
} from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { CustomSelect } from "@/app/common-form/CustomSelect";

interface ScooterDeliveryMethodProps {
  form: UseFormReturn<any>;
  drivers: any[];
  isUpdating?: boolean;
}

interface DeliveryMethod {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  activeColor: string;
}

interface PickupByOption {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

const ScooterDeliveryMethod: React.FC<ScooterDeliveryMethodProps> = ({
  form,
  drivers,
  isUpdating = false,
}) => {
  const {
    formState: { errors },
    setValue,
    control,
    watch,
    register,
    clearErrors,
  } = form;

  const riderOptions = drivers.map((d) => ({
    id: d._id,
    label: `${d.personalInfo.firstName} ${d.personalInfo.lastName}`,
  }));

  const deliveryMethods: DeliveryMethod[] = [
    {
      id: "Customer-Drop",
      label: "Customer Drop-off",
      description: "Customer brings scooter",
      icon: User,
      activeColor: "bg-gradient-to-br from-indigo-500 to-blue-500",
    },
    {
      id: "Company-Pickup",
      label: "Company Pick-up",
      description: "We collect from customer",
      icon: Truck,
      activeColor: "bg-gradient-to-br from-teal-500 to-cyan-500",
    },
  ];

  const pickupByOptions: PickupByOption[] = [
    {
      id: "External Company",
      label: "External Company",
      description: "Third-party courier",
      icon: Building,
    },
    {
      id: "Company Rider",
      label: "Company Rider",
      description: "Internal delivery team",
      icon: Users,
    },
  ];

  // Watch values directly from form
  const vehiclePickUpValue = watch("vehiclePickUp") || "Customer-Drop";
  const pickupByValue = watch("pickupBy") || "";

  // Function to handle delivery method change
  const handleDeliveryMethodChange = (methodId: string) => {
    if (methodId === "Customer-Drop") {
      // When switching to Customer-Drop, clear all pick-up related fields
      setValue("pickUpDate", "");
      setValue("pickupBy", "");
      setValue("externalCompanyName", "");
      setValue("riderId", "");

      // Clear validation errors for pick-up fields
      clearErrors("pickUpDate");
      clearErrors("pickupBy");
      clearErrors("externalCompanyName");
      clearErrors("riderId");
    }

    // Set the delivery method
    setValue("vehiclePickUp", methodId, {
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-1.5 text-indigo-500 rounded-lg">
          <Package size={16} />
        </div>
        <h2 className="font-medium text-base">Scooter Delivery Method *</h2>
      </div>

      {/* Delivery Methods */}
      <Controller
        name="vehiclePickUp"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryMethods.map((method) => {
              const Icon = method.icon;
              const isActive = field.value === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleDeliveryMethodChange(method.id)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                    isActive
                      ? `bg-linear-to-br ${method.activeColor} text-white border-transparent shadow-lg scale-[1.02]`
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-lg ${
                      isActive ? "bg-white/20" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">{method.label}</h3>
                    <p
                      className={`text-sm mt-1 ${
                        isActive ? "text-white/90" : "text-gray-500"
                      }`}
                    >
                      {method.description}
                    </p>
                  </div>
                  {isActive && (
                    <Check
                      size={20}
                      className="text-white animate-in zoom-in"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      />
      {errors.vehiclePickUp && (
        <p className="text-red-500 text-xs mt-1">Delivery method is required</p>
      )}

      {/* Company Pick-up Options - Only show when Company-Pickup is selected */}
      <AnimatePresence>
        {vehiclePickUpValue === "Company-Pickup" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 p-6 bg-linear-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200"
          >
            {/* Pick-up Date - Only required for Company-Pickup */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-teal-600" />
                <label className="text-teal-900 font-medium">
                  Pick-up Date *
                </label>
              </div>
              <input
                type="date"
                {...register("pickUpDate", {
                  required: vehiclePickUpValue === "Company-Pickup",
                })}
                className="w-full h-11 px-4 bg-white rounded-xl border border-teal-200 text-sm outline-none transition-all hover:border-teal-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20"
              />
              {errors.pickUpDate && (
                <p className="text-red-500 text-xs mt-1">
                  Pick-up date is required for company pick-up
                </p>
              )}
            </div>

            {/* Pickup By - Only required for Company-Pickup */}
            <Controller
              name="pickupBy"
              control={control}
              rules={{ required: vehiclePickUpValue === "Company-Pickup" }}
              render={() => (
                <div className="space-y-3">
                  <label className="text-teal-900 font-medium">
                    Pick-up By *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pickupByOptions.map((option, index) => {
                      const OptionIcon = option.icon;
                      const isActive = pickupByValue === option.id;
                      const activeGradient =
                        index === 0
                          ? "bg-linear-to-br from-violet-500 to-purple-500"
                          : "bg-linear-to-br from-emerald-500 to-teal-500";
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setValue("pickupBy", option.id, {
                              shouldValidate: true,
                            })
                          }
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            isActive
                              ? `${activeGradient} text-white border-transparent shadow-md`
                              : "bg-white border-teal-200 hover:border-teal-400"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-teal-50 text-teal-500"
                            }`}
                          >
                            <OptionIcon size={18} />
                          </div>
                          <div className="flex-1 text-left">
                            <p
                              className={`font-medium text-sm ${
                                isActive ? "text-white" : "text-gray-700"
                              }`}
                            >
                              {option.label}
                            </p>
                            <p
                              className={`text-xs mt-0.5 ${
                                isActive ? "text-white/90" : "text-gray-500"
                              }`}
                            >
                              {option.description}
                            </p>
                          </div>
                          {isActive && (
                            <Check size={16} className="text-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.pickupBy && (
                    <p className="text-red-500 text-xs mt-1">
                      Please select who will pick up
                    </p>
                  )}
                </div>
              )}
            />

            {/* Conditional Fields - Only show when External Company is selected */}
            <AnimatePresence>
              {pickupByValue === "External Company" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <label className="text-teal-900 font-medium">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    {...register("externalCompanyName", {
                      required: pickupByValue === "External Company",
                    })}
                    placeholder="Enter courier/transport company name"
                    className="w-full h-11 px-4 bg-white rounded-xl border border-teal-200 text-sm outline-none transition-all hover:border-teal-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20"
                  />
                  {errors.externalCompanyName && (
                    <p className="text-red-500 text-xs mt-1">
                      Company name is required for external courier
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Conditional Fields - Only show when Company Rider is selected */}
            <AnimatePresence>
              {pickupByValue === "Company Rider" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 pt-4 border-t border-teal-100"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-teal-600" />
                      <label className="text-teal-900 font-medium">
                        Select Rider *
                      </label>
                    </div>
                    <Controller
                      name="riderId"
                      control={control}
                      rules={{ required: pickupByValue === "Company Rider" }}
                      render={({ field }) => (
                        <CustomSelect
                          options={riderOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Choose an available rider"
                          error={errors.riderId}
                          isSearchable={true}
                        />
                      )}
                    />
                    {errors.riderId && (
                      <p className="text-red-500 text-xs mt-1">
                        Please select a rider
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScooterDeliveryMethod;
