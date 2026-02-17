import React from "react";
import FormSection from "../../suppliers/components/FormSection";
import FormField from "../../suppliers/components/FormInput";
import { PoundSterling, Calendar, Landmark } from "lucide-react";

interface SalarySectionProps {
  formData: any;
  handleChange: (e: any) => void;
  paymentFreq: string;
  setPaymentFreq: (freq: string) => void;
}

const SalarySection: React.FC<SalarySectionProps> = ({
  formData,
  handleChange,
  paymentFreq,
  setPaymentFreq,
}) => {
  // Handle frequency change and update both local state and formData
  const handleFrequencyChange = (freq: string) => {
    setPaymentFreq(freq);

    // Create a synthetic event to update formData
    const event = {
      target: {
        name: "paymentFrequency",
        value: freq,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(event);
  };

  return (
    <FormSection
      icon={PoundSterling}
      title="Salary & Compensation"
      theme="green"
      iconClassName="text-green-500"
    >
      <div className="p-3 bg-[#EBFFF3] border border-[#C6F6D5] rounded-xl flex items-center gap-3 text-[#16A34A] text-[12px] font-bold mb-4">
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
          <Landmark size={14} />
        </div>
        <p>
          Compensation Structure:{" "}
          <span className="font-medium text-slate-500">
            Enter the base salary amount and select payment frequency (daily,
            weekly, or monthly)
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-6">
        <div className="space-y-1.5">
          <div className="relative">
            <FormField
              label="Salary Amount *"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              placeholder="5000"
              className="[&_input]:pl-10 [&_input]:text-xl [&_input]:font-bold [&_input]:bg-[#F0FDFF] [&_input]:border-[#B2EBF2]"
              hoverColor="green"
              required
            />
            <span className="absolute left-4 top-[30px] text-[#16A34A] font-bold text-lg">
              £
            </span>
          </div>
          <p className="text-[11px] text-slate-400 ml-1">
            Enter base compensation amount
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[14px] font-semibold text-[#1F2937]">
            <Calendar size={18} className="text-[#2563EB]" />
            Payment Frequency <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-3">
            {[
              {
                label: "Daily",
                activeBg:
                  "bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white outline-transparent shadow-lg shadow-blue-200/50",
                hoverBorder: "hover:outline-blue-400 hover:bg-blue-50",
                icon: ({ size }: { size?: number }) => (
                  <span style={{ fontSize: size }} className="leading-none">
                    📅
                  </span>
                ),
              },
              {
                label: "Weekly",
                activeBg:
                  "bg-gradient-to-r from-[#C026D3] to-[#F43F5E] text-white outline-transparent shadow-lg shadow-purple-200/50",
                hoverBorder: "hover:outline-purple-400 hover:bg-pink-50",
                icon: ({ size }: { size?: number }) => (
                  <span style={{ fontSize: size }} className="leading-none">
                    📆
                  </span>
                ),
              },
              {
                label: "Monthly",
                activeBg:
                  "bg-gradient-to-br from-emerald-500 to-green-500 text-white outline-transparent shadow-lg shadow-green-200/50",
                hoverBorder: "hover:outline-emerald-400 hover:bg-emerald-100",
                icon: ({ size }: { size?: number }) => (
                  <span style={{ fontSize: size }} className="leading-none">
                    🗓️
                  </span>
                ),
              },
            ].map((freq) => {
              const isSelected = paymentFreq === freq.label;
              const Icon = freq.icon;

              return (
                <button
                  key={freq.label}
                  type="button"
                  onClick={() => handleFrequencyChange(freq.label)}
                  className={`w-32 h-20 px-3.5 pt-3.5 pb-0.5 rounded-2xl outline-2 -outline-offset-2 transition-all duration-300 flex flex-col justify-start items-center gap-1 ${
                    isSelected
                      ? freq.activeBg
                      : `bg-white outline-gray-200 text-gray-400 ${freq.hoverBorder}`
                  }`}
                >
                  <div className="self-stretch h-8 flex items-center justify-center">
                    <Icon size={24} />
                  </div>

                  <div className="self-stretch h-4 flex items-center justify-center">
                    <span
                      className={`text-xs font-bold font-['Arial'] leading-4 ${
                        isSelected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {freq.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Bank Account Number"
          name="bankAccountNumber"
          value={formData.bankAccountNumber}
          onChange={handleChange}
          placeholder="1234567890"
          hoverColor="blue"
          className="[&_input]:bg-[#F8FAFF] [&_input]:border-[#EEF2FF]"
        />
        <FormField
          label="Tax ID / SSN"
          name="taxId"
          value={formData.taxId}
          onChange={handleChange}
          placeholder="XXX-XX-XXXX"
          className="[&_input]:bg-[#F5F5F5] [&_input]:border-slate-200"
        />
      </div>
    </FormSection>
  );
};

export default SalarySection;
