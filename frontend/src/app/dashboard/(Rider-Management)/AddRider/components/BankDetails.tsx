"use client";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, Info } from "lucide-react";
import FormInput from "../../components/FormInput";
import { RiderFormData } from "@/schema/rider.schema";

const BankDetails: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<RiderFormData>();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-orange-600 rounded-xl text-white shadow-lg shadow-orange-100">
          <CreditCard size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bank Details</h2>
          <p className="text-gray-500 text-sm">
            Payment information for earnings
          </p>
        </div>
      </div>

      <div className="p-6 bg-linear-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200 flex items-start gap-4">
        <div className="text-orange-600 mt-0.5 shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="font-semibold mb-1">Secure Payment Information:</h4>
          <p className="text-sm">
            Your bank details are encrypted and securely stored. This
            information will only be used for payment processing.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Bank Name */}
        <Controller
          name="bankName"
          control={control}
          render={({ field }) => (
            <FormInput
              label="Bank Name"
              placeholder="Barclays Bank"
              required
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
        {errors.bankName && (
          <p className="text-sm text-red-500 -mt-4">
            {errors.bankName.message}
          </p>
        )}

        {/* Account Holder Name */}
        <Controller
          name="accountHolderName"
          control={control}
          render={({ field }) => (
            <FormInput
              label="Account Holder Name"
              placeholder="John Smith"
              required
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
        {errors.accountHolderName && (
          <p className="text-sm text-red-500 -mt-4">
            {errors.accountHolderName.message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Controller
              name="accountNumber"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Account Number"
                  placeholder="12345678"
                  required
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.accountNumber && (
              <p className="text-sm text-red-500 mt-1">
                {errors.accountNumber.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="sortCode"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Sort Code"
                  placeholder="12-34-56"
                  required
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.sortCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.sortCode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
        <div className="text-blue-600 mt-1">
          <Info size={20} />
        </div>
        <div>
          <h4 className="font-semibold mb-2">Payment Schedule:</h4>
          <ul className="text-sm space-y-1.5 list-disc pl-4">
            <li>Earnings are calculated weekly</li>
            <li>Payments are processed every Friday</li>
            <li>First payment may take 7-10 business days</li>
            <li>View detailed earnings in the Rider Portal</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default BankDetails;
