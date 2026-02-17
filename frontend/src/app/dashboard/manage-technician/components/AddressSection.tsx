import React from "react";
import FormSection from "../../suppliers/components/FormSection";
import { MapPin, Globe } from "lucide-react";

interface AddressSectionProps {
  formData: any;
  handleChange: (e: any) => void;
  googleMapLoader: any;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <FormSection
      icon={MapPin}
      title="Address Information"
      theme="green"
      iconClassName="text-green-500"
    >
      <div className="space-y-2 mb-4">
        <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-1.5">
          Street Address *
        </label>
        <input
          id="street-address-input"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
          placeholder="Start typing address... (UK addresses only)"
          className="w-full h-9 px-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all font-medium text-slate-600 placeholder:text-slate-400 text-sm"
          required
        />
      </div>

      <div className="p-3.5 rounded-xl bg-[#EBFFF3] border border-[#C6F6D5] flex gap-3 items-center mb-4">
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Globe size={14} className="text-[#16A34A]" />
        </div>
        <p className="text-[12px] font-bold text-[#16A34A] leading-tight">
          Google Places Integration:{" "}
          <span className="font-medium text-slate-500">
            City and postcode will auto-populate when you select an address.
          </span>
          <br />
          <span className="text-[#22C55E] font-bold">
            Demo: Type 123 to see auto-fill in action
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-1.5">
            City *
          </label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Auto-filled from address"
            className="w-full h-9 px-4 bg-[#F0F9FF] border border-[#DBEAFE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all font-medium text-slate-600 placeholder:text-slate-400 text-sm"
            required
            readOnly
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-1.5">
            Postcode *
          </label>
          <input
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            placeholder="Auto-filled from address"
            className="w-full h-9 px-4 bg-[#FDF2F8] border border-[#FCE7F3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EC4899]/10 focus:border-[#EC4899] transition-all font-medium text-slate-600 placeholder:text-slate-400 text-sm"
            required
            readOnly
          />
        </div>
      </div>

      <div className="hidden">
        <input type="hidden" name="latitude" value={formData.latitude} />
        <input type="hidden" name="longitude" value={formData.longitude} />
      </div>
    </FormSection>
  );
};

export default AddressSection;
