"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  User,
  Calendar,
  MapPin,
  Globe,
  Briefcase,
  Landmark,
  Upload,
  Heart,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import FormSection from "../../suppliers/components/FormSection";
import FormField from "../../suppliers/components/FormInput";
import { ITechnician } from "../../../../../../common/technician-updated/ITechnician.interface";

interface ModalFormProps {
  onClose: () => void;
  editData?: ITechnician;
}

const ModalForm = ({ onClose, editData }: ModalFormProps) => {
  const [paymentFreq, setPaymentFreq] = useState("Monthly");
  const [activeDays, setActiveDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [technicianStatus, setTechnicianStatus] = useState(true);

  const [documents, setDocuments] = useState<
    { id: number; file: File | null; existingUrl?: string }[]
  >([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf">("image");
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (editData?.technicianDocuments) {
      const existingDocs = editData.technicianDocuments.map((url, index) => ({
        id: index + 1,
        file: null,
        existingUrl: url,
      }));
      setDocuments(
        existingDocs.length > 0 ? existingDocs : [{ id: 1, file: null }],
      );
    } else {
      setDocuments([{ id: 1, file: null }]);
    }
  }, [editData]);

  const addDocument = () =>
    setDocuments([...documents, { id: Date.now(), file: null }]);

  const removeDocument = (id: number) =>
    documents.length > 1 &&
    setDocuments(documents.filter((doc) => doc.id !== id));

  const handleTriggerUpload = (id: number) => {
    fileInputRefs.current[id]?.click();
  };

  const handlePreviewDocument = (doc: {
    file: File | null;
    existingUrl?: string;
  }) => {
    let urlToPreview = "";
    if (doc.file) {
      urlToPreview = URL.createObjectURL(doc.file);
    } else if (doc.existingUrl) {
      urlToPreview = doc.existingUrl.startsWith("http")
        ? doc.existingUrl
        : `${process.env.NEXT_PUBLIC_IMAGE_URL}${doc.existingUrl}`;
    }

    if (urlToPreview) {
      const ext = urlToPreview.toLowerCase().split(".").pop();
      setPreviewType(ext === "pdf" ? "pdf" : "image");
      setPreviewUrl(urlToPreview);
    }
  };

  const handleFileChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? { ...doc, file: selectedFile, existingUrl: undefined }
            : doc,
        ),
      );
    }
  };

  const getDocumentDisplay = (doc: {
    file: File | null;
    existingUrl?: string;
  }) => {
    if (doc.file) {
      return `Selected: ${doc.file.name}`;
    }
    if (doc.existingUrl) {
      const fileName = doc.existingUrl.split("/").pop();
      return `Existing: ${fileName}`;
    }
    return "PDF, JPG or PNG (Max. 10MB)";
  };

  const [dropdowns, setDropdowns] = useState({
    contractTypes: [],
    serviceTypesMaster: [],
    departments: [],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDropdownData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const [contractRes, serviceMasterRes, deptRes] = await Promise.all([
          fetch(`${baseUrl}/contract-types`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/service-types-master`, { headers }).then((r) =>
            r.json(),
          ),
          fetch(`${baseUrl}/departments`, { headers }).then((r) => r.json()),
        ]);

        if (!isMounted) return;

        setDropdowns({
          contractTypes:
            contractRes.data?.map((i: any) => ({
              label: i.contractType || i.name,
              value: i._id,
            })) || [],
          serviceTypesMaster:
            serviceMasterRes.data?.map((i: any) => ({
              label: i.MasterServiceType || i.name,
              value: i._id,
            })) || [],
          departments:
            deptRes.data?.map((i: any) => ({
              label: i.departmentName || i.name,
              value: i._id,
            })) || [],
        });
      } catch (err) {
        console.error("Error fetching technician dropdowns:", err);
      }
    };

    fetchDropdownData();

    return () => {
      isMounted = false;
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    dateOfBirth: "",
    employeeId: "",

    // Address Information
    streetAddress: "",
    city: "",
    postcode: "",

    // Employment Details
    dateOfJoining: "",
    contractTypeId: "",
    departmentId: "",
    specializationIds: [],

    // Salary & Compensation
    salary: "",
    paymentFrequency: "Monthly",
    bankAccountNumber: "",
    taxId: "",

    // Availability
    dutyRoster: [] as Array<{
      day: string;
      isActive: boolean;
      startTime: string;
      endTime: string;
    }>,

    // Additional Information
    emergencyContactName: "",
    emergencyContactPhone: "",
    healthInsuranceDetails: "",
    additionalNotes: "",
    technicianStatus: "Available",
  });

  useEffect(() => {
    if (editData) {
      console.log("Edit data received:", editData);

      const mappedDutyRoster =
        editData.dutyRoster?.map((item) => ({
          day: item.day,
          isActive: item.isActive,
          startTime: item.startTime || "09:00",
          endTime: item.endTime || "17:00",
        })) || [];

      if (mappedDutyRoster.length > 0) {
        const activeDayNames = mappedDutyRoster
          .filter((item) => item.isActive)
          .map((item) => item.day);
        setActiveDays(activeDayNames);
      }

      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        emailAddress: editData.email || "",
        phoneNumber: editData.phone || "",
        dateOfBirth: editData.dateOfBirth
          ? new Date(editData.dateOfBirth).toISOString().split("T")[0]
          : "",
        employeeId: editData.employeeId || "",

        streetAddress: "",
        city: "",
        postcode: "",

        dateOfJoining: editData.dateOfJoining
          ? new Date(editData.dateOfJoining).toISOString().split("T")[0]
          : "",
        contractTypeId: editData.contractTypeId || "",
        departmentId: editData.departmentId || "",
        specializationIds: editData.specializationIds || [],

        // Salary & Compensation
        salary: editData.salary?.toString() || "",
        paymentFrequency: editData.paymentFrequency || "Monthly",
        bankAccountNumber: editData.bankAccountNumber || "",
        taxId: editData.taxId || "",
        dutyRoster: mappedDutyRoster,
        emergencyContactName:
          editData.additionalInformation?.emergencyContactName || "",
        emergencyContactPhone:
          editData.additionalInformation?.emergencyContactNumber || "",
        healthInsuranceDetails:
          editData.additionalInformation?.healthInsuranceDetails || "",
        additionalNotes: editData.additionalInformation?.additionalNotes || "",
        technicianStatus: editData.technicianStatus || "Available",
      });

      setPaymentFreq(editData.paymentFrequency || "Monthly");
      setTechnicianStatus(editData.technicianStatus === "Available");
    }
  }, [editData]);

  const handleChange = (e: any) => {
    const { name, type, value, selectedOptions } = e.target;

    if (name === "specializationIds" || type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt: any) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const allDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const updatedDutyRoster = allDays.map((day) => {
      const existing = formData.dutyRoster.find((d) => d.day === day);
      return {
        day,
        isActive: activeDays.includes(day),
        startTime: existing?.startTime || "09:00",
        endTime: existing?.endTime || "17:00",
      };
    });

    setFormData((prev) => ({ ...prev, dutyRoster: updatedDutyRoster }));
  }, [activeDays]);

  // Handle time change in duty roster
  const handleTimeChange = (
    day: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      dutyRoster: prev.dutyRoster.map((item) =>
        item.day === day ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const toggleDay = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const getCurrentUserId = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            return user.id || user._id || "69564bc3886c7c0d91574dfd";
          } catch {
            return "69564bc3886c7c0d91574dfd";
          }
        }
        return "69564bc3886c7c0d91574dfd";
      };

      const currentUserId = getCurrentUserId();
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      // Build duty roster from form data
      const dutyRosterPayload = formData.dutyRoster
        .filter((item) => item.isActive)
        .map((item) => ({
          day: item.day,
          isActive: item.isActive,
          startTime: item.startTime,
          endTime: item.endTime,
        }));

      // Create FormData - DO NOT use JSON.stringify for the entire payload
      const formDataToSend = new FormData();

      // Append all fields INDIVIDUALLY, not as a single JSON
      // This is the key fix - middleware expects individual fields

      // 1. Basic fields
      formDataToSend.append("userId", currentUserId);
      // formDataToSend.append("isActive", "true");
      // formDataToSend.append("isDeleted", "false");
      // formDataToSend.append("isDefault", "false");
      formDataToSend.append("role", "Technician");

      // 2. Person object fields
      formDataToSend.append("person[firstName]", formData.firstName.trim());
      formDataToSend.append("person[middleName]", formData.middleName.trim());
      formDataToSend.append("person[lastName]", formData.lastName.trim());

      // 3. Contact object fields - CRITICAL: These must match middleware expectation
      formDataToSend.append(
        "contact[mobileNumber]",
        formData.phoneNumber.trim(),
      );
      formDataToSend.append(
        "contact[phoneNumber]",
        formData.phoneNumber.trim(),
      );
      formDataToSend.append("contact[emailId]", formData.emailAddress.trim()); // Exact field name

      // 4. Address object fields
      formDataToSend.append("address[address]", formData.streetAddress.trim());
      formDataToSend.append("address[zipCode]", formData.postcode.trim());
      formDataToSend.append("address[city]", formData.city.trim());
      formDataToSend.append("address[country]", "UK");
      formDataToSend.append("address[latitude]", "");
      formDataToSend.append("address[longitude]", "");
      formDataToSend.append("address[userId]", currentUserId);

      // 5. Technician fields
      if (formData.employeeId.trim())
        formDataToSend.append("employeeId", formData.employeeId.trim());
      if (formData.dateOfBirth)
        formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      if (formData.dateOfJoining)
        formDataToSend.append("dateOfJoining", formData.dateOfJoining);
      if (formData.contractTypeId)
        formDataToSend.append("contractTypeId", formData.contractTypeId);
      if (formData.departmentId)
        formDataToSend.append("departmentId", formData.departmentId);
      if (formData.salary) formDataToSend.append("salary", formData.salary);
      if (formData.bankAccountNumber.trim())
        formDataToSend.append(
          "bankAccountNumber",
          formData.bankAccountNumber.trim(),
        );
      if (formData.taxId.trim())
        formDataToSend.append("taxId", formData.taxId.trim());
      formDataToSend.append("paymentFrequency", formData.paymentFrequency);
      formDataToSend.append("technicianStatus", formData.technicianStatus);

      // 6. SpecializationIds (array)
      if (formData.specializationIds && formData.specializationIds.length > 0) {
        formData.specializationIds.forEach((id, index) => {
          formDataToSend.append(`specializationIds[${index}]`, id);
        });
      }

      // 7. DutyRoster (array of objects)
      // 7. DutyRoster (array of objects) - updated
      if (dutyRosterPayload.length > 0) {
        formDataToSend.append("dutyRoster", JSON.stringify(dutyRosterPayload));
      }

      // 8. Additional Information
      if (formData.emergencyContactName.trim()) {
        formDataToSend.append(
          "additionalInformation[emergencyContactName]",
          formData.emergencyContactName.trim(),
        );
      }
      if (formData.emergencyContactPhone.trim()) {
        formDataToSend.append(
          "additionalInformation[emergencyContactNumber]",
          formData.emergencyContactPhone.trim(),
        );
      }
      if (formData.healthInsuranceDetails.trim()) {
        formDataToSend.append(
          "additionalInformation[healthInsuranceDetails]",
          formData.healthInsuranceDetails.trim(),
        );
      }
      if (formData.additionalNotes.trim()) {
        formDataToSend.append(
          "additionalInformation[additionalNotes]",
          formData.additionalNotes.trim(),
        );
      }

      if (!editData?._id) {
        formDataToSend.append("createdAt", new Date().toISOString());
        formDataToSend.append("createdBy", currentUserId);
      }

      // 10. For edit, add IDs
      if (editData?._id) {
        formDataToSend.append("_id", editData._id);
        formDataToSend.append("updatedAt", new Date().toISOString());

        if (editData.personId)
          formDataToSend.append("personId", editData.personId);
        if (editData.contactId)
          formDataToSend.append("contactId", editData.contactId);
        if (editData.addressId)
          formDataToSend.append("addressId", editData.addressId);
        if (editData.accountId)
          formDataToSend.append("accountId", editData.accountId);
      }

      documents.forEach((doc) => {
        if (doc.file) {
          formDataToSend.append("technicianDocumentsFile", doc.file);
        }
      });

      if (editData?._id) {
        documents.forEach((doc, index) => {
          if (doc.existingUrl && !doc.file) {
            formDataToSend.append(
              `technicianDocuments[${index}]`,
              doc.existingUrl,
            );
          }
        });
      }

      // Debug: Log FormData
      console.log("FormData entries:");
      for (const [key, value] of (formDataToSend as any).entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(key, value);
        }
      }

      // Send request
      const url = editData?._id
        ? `${baseUrl}/technicians/${editData._id}`
        : `${baseUrl}/technicians`;

      const response = await fetch(url, {
        method: editData?._id ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const text = await response.text();
      console.log("Raw response:", text.substring(0, 1000));

      try {
        const result = JSON.parse(text);
        console.log("Parsed response:", result);

        if (!response.ok) {
          throw new Error(
            result.message ||
              `API request failed with status ${response.status}`,
          );
        }

        alert(
          editData
            ? "Technician updated successfully!"
            : "Technician created successfully!",
        );
        onClose();
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error(
          `Server returned non-JSON response: ${text.substring(0, 200)}`,
        );
      }
    } catch (err: any) {
      console.error("Full error:", err);
      console.error("Error stack:", err.stack);

      let errorMessage = `Failed to ${editData ? "update" : "create"} technician.\n\n`;

      if (err.message) {
        errorMessage += err.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const sectionTitleStyle =
    "flex items-center gap-2 text-md font-bold text-slate-800 border-b border-slate-50 pb-2 mb-4";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-bold text-[#E7000B]">
              {editData ? "Update Technician" : "Register New Technician"}
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Complete technician profile and HR onboarding
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-[#E7000B] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Scrollable Form Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-10 custom-scrollbar">
            {/* HR Info Alert */}
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F54900] flex items-center justify-center text-white shrink-0 shadow-md">
                <User size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[#F54900] text-sm">
                  HR Onboarding
                </h4>
                <p className="text-slate-500 font-medium text-[13px] leading-relaxed">
                  Fields marked with <span className="text-red-500">*</span> are
                  required for payroll and system access.
                </p>
              </div>
            </div>

            <FormSection
              icon={User}
              number={1}
              title="Personal Information"
              theme="red"
            >
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormField
                  label="First Name *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
                <FormField
                  label="Middle Name"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Michael"
                />
                <FormField
                  label="Last Name *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                  required
                />
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  label="Email Address *"
                  name="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="technician@example.com"
                  required
                />
                <FormField
                  label="Phone Number *"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              {/* Date of Birth and Employee ID Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                <FormField
                  label="Employee ID"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="EMP-001"
                  className="[&_input]:bg-[#F0FDFF]"
                />
              </div>
            </FormSection>

            {/* 2. Address & Location */}
            <FormSection
              icon={MapPin}
              number={2}
              title="Address Information"
              theme="green"
            >
              <FormField
                label="Street Address *"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="Start typing address... (e.g., 123 Main St)"
                className="mb-4"
                required
              />

              {/* Info Box */}
              <div className="p-3.5 rounded-xl bg-[#EBFFF3] border border-[#C6F6D5] flex gap-3 items-center mb-4">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Globe size={14} className="text-[#16A34A]" />
                </div>
                <p className="text-[12px] font-bold text-[#16A34A] leading-tight">
                  Google Places Integration:{" "}
                  <span className="font-medium text-slate-500">
                    City and postcode will auto-populate when you select an
                    address.
                  </span>
                  <br />
                  <span className="text-[#22C55E] font-bold">
                    Demo: Type 123 to see auto-fill in action
                  </span>
                </p>
              </div>

              {/* City and Postcode Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="City *"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
                <FormField
                  label="Postcode *"
                  name="postcode"
                  type="text"
                  value={formData.postcode}
                  onChange={handleChange}
                  placeholder="Enter postcode"
                  required
                />
              </div>
            </FormSection>

            {/* 3. Employment Details */}
            <FormSection
              icon={Briefcase}
              number={3}
              title="Employment Details"
              theme="blue"
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
                    className="w-full p-3.5 bg-[#F8FAFF] border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E7000B]/10 focus:border-[#E7000B] transition-all font-medium text-slate-600 placeholder:text-slate-400 text-sm border-blue-200 focus:border-blue-500"
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

              {/* Specialization */}
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

            {/* 4. Salary & Compensation */}
            <FormSection
              icon={Landmark}
              number={4}
              title="Salary & Compensation"
              theme="green"
            >
              {/* Compensation Info Box */}
              <div className="p-3 bg-[#EBFFF3] border border-[#C6F6D5] rounded-xl flex items-center gap-3 text-[#16A34A] text-[12px] font-bold mb-4">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                  <Landmark size={14} />
                </div>
                <p>
                  Compensation Structure:{" "}
                  <span className="font-medium text-slate-500">
                    Enter the base salary amount and select payment frequency
                    (daily, weekly, or monthly)
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-6">
                {/* Salary Amount Input with Currency Symbol */}
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
                      required
                    />
                    <span className="absolute left-4 top-[43px] text-[#16A34A] font-bold text-lg">
                      £
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 ml-1">
                    Enter base compensation amount
                  </p>
                </div>

                {/* Payment Frequency Toggle Buttons */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mb-1.5">
                    <CalendarDays size={14} className="text-blue-500" /> Payment
                    Frequency *
                  </label>
                  <div className="flex gap-2">
                    {["Daily", "Weekly", "Monthly"].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => {
                          setPaymentFreq(freq);
                          setFormData((prev) => ({
                            ...prev,
                            paymentFrequency: freq,
                          }));
                        }}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all h-[74px] ${
                          paymentFreq === freq
                            ? "bg-linear-to-br from-[#F54900] via-[#E7000B] to-[#E60076] border-transparent text-white shadow-lg scale-[1.02]"
                            : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg ${paymentFreq === freq ? "bg-white/20" : "bg-slate-50 border border-slate-100 shadow-sm"}`}
                        >
                          <Calendar
                            size={18}
                            className={
                              paymentFreq === freq
                                ? "text-white"
                                : "text-slate-500"
                            }
                          />
                        </div>
                        <span className="text-[11px] font-bold">{freq}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Banking Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Bank Account Number"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  placeholder="1234567890"
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

            {/* 5. Availability & Duty Roster */}
            <section className="space-y-4">
              <h3 className={sectionTitleStyle}>
                <div className="w-1 h-4 bg-[#A855F7] rounded-full" />
                Availability & Duty Roster
              </h3>
              <div className="space-y-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => {
                  const dayData = formData.dutyRoster.find(
                    (d) => d.day === day,
                  ) || {
                    day,
                    isActive: activeDays.includes(day),
                    startTime: "09:00",
                    endTime: "17:00",
                  };

                  return (
                    <div
                      key={day}
                      className={`flex flex-wrap items-center justify-between p-3 rounded-2xl border transition-all ${dayData.isActive ? "bg-[#F0FDF4] border-[#DCFCE7]" : "bg-slate-50 border-slate-100 opacity-60"}`}
                    >
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <button
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${dayData.isActive ? "bg-[#22C55E]" : "bg-slate-300"}`}
                        >
                          <div
                            className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${dayData.isActive ? "right-1" : "left-1"}`}
                          />
                        </button>
                        <span className="text-sm font-bold text-slate-700">
                          {day}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Start
                          </span>
                          <input
                            type="time"
                            value={dayData.startTime}
                            onChange={(e) =>
                              handleTimeChange(day, "startTime", e.target.value)
                            }
                            className="bg-white border border-slate-200 rounded-lg p-1.5 text-[12px] font-bold text-slate-600 focus:ring-1 focus:ring-[#22C55E] outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            End
                          </span>
                          <input
                            type="time"
                            value={dayData.endTime}
                            onChange={(e) =>
                              handleTimeChange(day, "endTime", e.target.value)
                            }
                            className="bg-white border border-slate-200 rounded-lg p-1.5 text-[12px] font-bold text-slate-600 focus:ring-1 focus:ring-[#22C55E] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 6. Document Upload */}
            <section className="space-y-3">
              <h3 className={sectionTitleStyle}>
                <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                <span className="text-slate-800 text-sm flex items-center gap-2">
                  Document Upload (Multi-File)
                </span>
              </h3>

              <div className="p-2 bg-[#EBFAFF] border border-[#BEE3F8] rounded-lg flex items-center gap-2 text-slate-700 text-[10px] font-bold">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                  <Upload size={12} className="text-cyan-600" />
                </div>
                <p className="leading-tight">
                  Upload documents:{" "}
                  <span className="font-medium text-slate-500">
                    Resume, Certs, ID, Licenses, etc.
                  </span>
                </p>
              </div>

              {/* Document Upload Fields */}
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl border border-slate-200 shadow-sm ${doc.file || doc.existingUrl ? "bg-cyan-500 text-white" : "bg-white text-cyan-600"}`}
                        >
                          <Upload size={20} />
                        </div>
                        <div>
                          <label className="text-[13px] font-bold text-slate-700 mb-1">
                            {index === 0
                              ? "Technician Documents"
                              : `Additional Document ${index + 1}`}
                          </label>
                          <p className="text-[12px] text-slate-500 font-medium truncate max-w-[250px]">
                            {getDocumentDisplay(doc)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          className="hidden"
                          ref={(el) => {
                            fileInputRefs.current[doc.id] = el;
                          }}
                          onChange={(e) => handleFileChange(doc.id, e)}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        {(doc.file || doc.existingUrl) && (
                          <button
                            type="button"
                            onClick={() => handlePreviewDocument(doc)}
                            className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm font-bold text-blue-700 hover:bg-blue-100 shadow-sm"
                          >
                            Preview
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleTriggerUpload(doc.id)}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                        >
                          {doc.file || doc.existingUrl
                            ? "Change File"
                            : "Choose File"}
                        </button>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.id)}
                            className="p-2.5 bg-rose-50 rounded-lg hover:bg-rose-100 text-rose-500 border border-rose-100"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDocument}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-cyan-600 bg-white rounded-xl hover:bg-cyan-50 border border-dashed border-cyan-200 w-full justify-center mt-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Another Document
                </button>
              </div>
            </section>

            {/* 7. Additional Information */}
            <FormSection
              icon={Heart}
              number={7}
              title="Additional Information"
              theme="rose"
            >
              {/* Emergency Contact Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  label="Emergency Contact Name"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  placeholder="Contact person name"
                />
                <FormField
                  label="Emergency Contact Phone"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 999-8888"
                />
              </div>

              {/* Health Insurance Field */}
              <div className="mb-4">
                <FormField
                  label="Health Insurance Details"
                  name="healthInsuranceDetails"
                  value={formData.healthInsuranceDetails}
                  onChange={handleChange}
                  placeholder="Insurance provider and policy number"
                />
              </div>

              {/* Additional Notes Textarea */}
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

              {/* Technician Status Toggle Card */}
              <div
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  technicianStatus
                    ? "bg-[#EBFFF3] border-[#C6F6D5]"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      technicianStatus
                        ? "bg-[#22C55E] text-white shadow-lg shadow-green-100"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-slate-800 tracking-tight">
                      Technician Status
                    </h4>
                    <p className="text-[12px] text-slate-500 font-medium">
                      Active and can be assigned to jobs
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTechnicianStatus(!technicianStatus);
                    setFormData((prev) => ({
                      ...prev,
                      technicianStatus: !technicianStatus
                        ? "Available"
                        : "Busy",
                    }));
                  }}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    technicianStatus ? "bg-[#22C55E]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      technicianStatus ? "right-1" : "left-1 shadow-sm"
                    }`}
                  />
                </button>
              </div>
            </FormSection>
          </div>

          <div className="p-6 bg-slate-50 flex gap-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all text-sm border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3.5 rounded-xl font-bold bg-linear-to-r from-[#F54900] via-[#E7000B] to-[#E60076] text-white shadow-lg shadow-red-200 hover:opacity-90 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Processing..."
                : editData
                  ? "Update Technician"
                  : "Register Technician"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Document Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Document Preview
              </h2>
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  if (previewUrl?.startsWith("blob:")) {
                    URL.revokeObjectURL(previewUrl);
                  }
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-50 p-6">
              {previewType === "image" ? (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={previewUrl}
                    alt="Document Preview"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <iframe
                  src={previewUrl}
                  className="w-full h-full rounded-lg"
                  title="PDF Preview"
                />
              )}
            </div>
            <div className="flex items-center justify-end p-6 border-t border-slate-200 gap-3">
              <a
                href={previewUrl}
                download
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Download
              </a>
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  if (previewUrl?.startsWith("blob:")) {
                    URL.revokeObjectURL(previewUrl);
                  }
                }}
                className="px-6 py-2.5 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalForm;
