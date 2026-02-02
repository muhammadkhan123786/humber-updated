import React from "react";
import FormSection from "../../suppliers/components/FormSection";
import FormField from "../../suppliers/components/FormInput";
import { Briefcase } from "lucide-react";

interface EmploymentSectionProps {
  formData: any;
  handleChange: (e: any) => void;
  dropdowns: {
    contractTypes: any[];
    serviceTypesMaster: any[];
    departments: any[];
  };
}

const EmploymentSection: React.FC<EmploymentSectionProps> = ({
  formData,
  handleChange,
  dropdowns,
}) => {
  return (
    <FormSection
      icon={Briefcase}
      title="Employment Details"
      theme="blue"
      iconClassName="text-blue-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-1.5">
            Date of Joining *
          </label>
          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
            className="w-full h-9 px-4 bg-[#F8FAFF] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E7000B]/10 focus:border-blue-500 transition-all font-medium text-slate-600 placeholder:text-slate-400 text-sm border-blue-2"
            required
          />
        </div>

        <FormField
          label="Contract Type *"
          name="contractTypeId"
          type="select"
          value={formData.contractTypeId}
          onChange={handleChange}
          options={dropdowns.contractTypes}
          hoverColor="indigo"
          required
        />

        <FormField
          label="Department"
          name="departmentId"
          type="select"
          value={formData.departmentId}
          onChange={handleChange}
          options={dropdowns.departments}
        />
      </div>

      <FormField
        label="Specialization *"
        name="specializationIds"
        type="select"
        multiple={true}
        value={formData.specializationIds}
        onChange={handleChange}
        options={dropdowns.serviceTypesMaster}
        required
      />
    </FormSection>
  );
};

export default EmploymentSection;
