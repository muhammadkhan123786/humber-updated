import React from "react";
import FormSection from "../../suppliers/components/FormSection";
import FormField from "../../suppliers/components/FormInput";
import { Award, X, Check } from "lucide-react";

interface AdditionalInfoSectionProps {
  formData: any;
  handleChange: (e: any) => void;
  technicianStatus: boolean;
  setTechnicianStatus: (status: boolean) => void;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  formData,
  handleChange,
  technicianStatus,
  setTechnicianStatus,
}) => {
  return (
    <FormSection
      icon={Award}
      title="Additional Information"
      theme="rose"
      iconClassName="text-rose-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          label="Emergency Contact Name"
          name="emergencyContactName"
          value={formData.emergencyContactName}
          onChange={handleChange}
          placeholder="Contact person name"
          hoverColor="pink"
        />
        <FormField
          label="Emergency Contact Phone"
          name="emergencyContactPhone"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
          placeholder="+1 (555) 999-8888"
          hoverColor="pink"
        />
      </div>

      <div className="mb-4">
        <FormField
          label="Health Insurance Details"
          name="healthInsuranceDetails"
          value={formData.healthInsuranceDetails}
          onChange={handleChange}
          placeholder="Insurance provider and policy number"
        />
      </div>

      <div className="mb-6">
        <FormField
          label="Additional Notes"
          name="additionalNotes"
          type="textarea"
          value={formData.additionalNotes}
          onChange={handleChange}
          placeholder="Any additional information about the technician..."
          className="[&_textarea]:h-24 [&_textarea]:resize-none"
        />
      </div>

      <div
        className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
          technicianStatus
            ? "bg-[#F0FFF4] border-[#22C55E]/30 ring-1 ring-[#22C55E]/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              technicianStatus
                ? "bg-[#00C951] text-white shadow-lg shadow-green-100"
                : "bg-slate-400 text-white shadow-md shadow-slate-200"
            }`}
          >
            {technicianStatus ? (
              <Check size={22} strokeWidth={3} />
            ) : (
              <X size={20} strokeWidth={3} />
            )}
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#1E293B] tracking-tight">
              Technician Status
            </h4>
            <p
              className={`text-[12px] font-medium transition-colors ${
                technicianStatus ? "text-slate-600" : "text-slate-500"
              }`}
            >
              {technicianStatus
                ? "Active and can be assigned to jobs"
                : "Inactive and cannot be assigned"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setTechnicianStatus(!technicianStatus);
            // Update form data as well
            handleChange({
              target: {
                name: "technicianStatus",
                value: !technicianStatus ? "Available" : "Busy",
              },
            });
          }}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
            technicianStatus ? "bg-[#00C951]" : "bg-slate-300"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
              technicianStatus ? "left-7" : "left-1 shadow-sm"
            }`}
          />
        </button>
      </div>
    </FormSection>
  );
};

export default AdditionalInfoSection;
