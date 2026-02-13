import React from "react";
import FormSection from "../../suppliers/components/FormSection";
import FormField from "../../suppliers/components/FormInput";
import { User, Mail, Phone, Loader2 } from "lucide-react";

interface PersonalInfoSectionProps {
  formData: any;
  handleChange: (e: any) => void;
  isLoadingEmployeeCode?: boolean;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  handleChange,
  isLoadingEmployeeCode = false,
}) => {
  return (
    <FormSection
      icon={User}
      title="Personal Information"
      theme="red"
      iconClassName="text-red-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <FormField
          label="First Name *"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="John"
          hoverColor="orange"
          required
        />
        <FormField
          label="Middle Name"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
          hoverColor="orange"
          placeholder="Michael"
        />
        <FormField
          label="Last Name *"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          hoverColor="orange"
          placeholder="Smith"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          label="Email Address *"
          name="emailAddress"
          labelIcon={Mail}
          type="email"
          value={formData.emailAddress}
          onChange={handleChange}
          placeholder="technician@example.com"
          hoverColor="blue"
          required
        />
        <FormField
          label="Phone Number *"
          name="phoneNumber"
          labelIcon={Phone}
          type="text"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
          hoverColor="purple"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          hoverColor="pink"
          onChange={handleChange}
        />
        <div className="relative">
          <FormField
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            hoverColor="blue"
            placeholder="Auto-generated"
            className="[&_input]:bg-[#F0FDFF] [&_input]:cursor-not-allowed [&_input]:opacity-75"
            disabled={true}
          />
          {isLoadingEmployeeCode && (
            <div className="absolute right-3 top-9">
              <Loader2 size={16} className="animate-spin text-blue-500" />
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
};

export default PersonalInfoSection;
