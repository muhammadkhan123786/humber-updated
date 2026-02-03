import React, { useState } from "react";
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
import { UseFormReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

interface ScooterDeliveryMethodProps {
  form: UseFormReturn<any>;
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
}) => {
  const {
    formState: { errors },
    setValue,
    register,
  } = form;

  const [deliveryMethod, setDeliveryMethod] =
    useState<string>("Customer Drop-off");
  const [pickupBy, setPickupBy] = useState<string>("");

  const deliveryMethods: DeliveryMethod[] = [
    {
      id: "Customer Drop-off",
      label: "Customer Drop-off",
      description: "Customer brings scooter",
      icon: User,
      activeColor: "bg-gradient-to-br from-indigo-500 to-blue-500",
    },
    {
      id: "Company Pick-up",
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
      id: "Own Rider",
      label: "Own Rider",
      description: "Internal delivery team",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-1.5 text-indigo-500 rounded-lg ">
          <Package size={16} />
        </div>
        <h2 className="font-medium text-base">Scooter Delivery Method *</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliveryMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => {
                setDeliveryMethod(method.id);
                setValue("deliveryMethod", method.id, { shouldValidate: true });
              }}
              className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                deliveryMethod === method.id
                  ? `bg-linear-to-br ${method.activeColor} text-white border-transparent shadow-lg scale-[1.02]`
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg ${
                  deliveryMethod === method.id
                    ? "bg-white/20"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base">{method.label}</h3>
                <p
                  className={`text-sm mt-1 ${
                    deliveryMethod === method.id
                      ? "text-white/90"
                      : "text-gray-500"
                  }`}
                >
                  {method.description}
                </p>
              </div>
              {deliveryMethod === method.id && (
                <Check size={20} className="text-white animate-in zoom-in" />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {deliveryMethod === "Company Pick-up" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 p-6 bg-linear-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-teal-500 rounded-lg text-white">
                  <Truck size={16} />
                </div>
                <h3 className="text-base font-semibold text-teal-900">
                  Pick-up Details
                </h3>
              </div>
              <p className="text-teal-700 text-xs leading-relaxed">
                Select how the scooter will be collected from customer
              </p>
            </div>

            <div className="space-y-6">
              {/* Pick-up Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-teal-600" />
                  <label className="text-teal-900 font-medium">
                    Pick-up Date *
                  </label>
                </div>
                <input
                  type="date"
                  {...register("pickupDate", { required: true })}
                  className="w-full h-11 px-4 bg-white rounded-xl border border-teal-200 text-sm outline-none transition-all hover:border-teal-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20"
                  placeholder="mm/dd/yyyy"
                />
                {errors.pickupDate && (
                  <p className="text-red-500 text-xs mt-1">
                    Pick-up date is required
                  </p>
                )}
              </div>

              {/* Pick-up By Selection */}
              <div className="space-y-3">
                <label className="text-teal-900 font-medium">
                  Pick-up By *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pickupByOptions.map((option, index) => {
                    const OptionIcon = option.icon;
                    // First option gets violet gradient, second gets emerald gradient
                    const activeGradient =
                      index === 0
                        ? "bg-linear-to-br from-violet-500 to-purple-500"
                        : "bg-linear-to-br from-emerald-500 to-teal-500";

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setPickupBy(option.id);
                          setValue("pickupBy", option.id, {
                            shouldValidate: true,
                          });
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          pickupBy === option.id
                            ? `${activeGradient} text-white border-transparent shadow-md`
                            : "bg-white border-teal-200 hover:border-teal-400"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            pickupBy === option.id
                              ? "bg-white/20 text-white"
                              : "bg-teal-50 text-teal-500"
                          }`}
                        >
                          <OptionIcon size={18} />
                        </div>
                        <div className="flex-1 text-left">
                          <p
                            className={`font-medium text-sm ${
                              pickupBy === option.id
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            {option.label}
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${
                              pickupBy === option.id
                                ? "text-white/90"
                                : "text-gray-500"
                            }`}
                          >
                            {option.description}
                          </p>
                        </div>
                        {pickupBy === option.id && (
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

              <AnimatePresence>
                {pickupBy === "External Company" && (
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
                      {...register("companyName", {
                        required: pickupBy === "External Company",
                      })}
                      placeholder="Enter courier/transport company name"
                      className="w-full h-11 px-4 bg-white rounded-xl border border-teal-200 text-sm outline-none transition-all hover:border-teal-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-xs mt-1">
                        Company name is required for external courier
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {pickupBy === "Own Rider" && (
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
                      <select
                        {...register("riderId", {
                          required: pickupBy === "Own Rider",
                        })}
                        className="w-full h-11 px-4 bg-white rounded-xl border border-teal-200 text-sm outline-none transition-all hover:border-teal-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20"
                      >
                        <option value="">Choose an available rider</option>
                        <option value="rider1">John Doe</option>
                        <option value="rider2">Jane Smith</option>
                        <option value="rider3">Mike Johnson</option>
                      </select>
                      <p className="text-teal-600 text-xs italic mt-1">
                        Only available riders are shown
                      </p>
                      {errors.riderId && (
                        <p className="text-red-500 text-xs mt-1">
                          Please select a rider
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScooterDeliveryMethod;
