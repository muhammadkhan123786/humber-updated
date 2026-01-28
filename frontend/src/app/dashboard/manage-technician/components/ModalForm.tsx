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
  CheckCircle2,
  CalendarDays,
  Users,
  Mail,
  Phone,
  SquarePen,
  PoundSterling,
  Clock,
  Paperclip,
  Check,
} from "lucide-react";
import FormSection from "../../suppliers/components/FormSection";
import FormField from "../../suppliers/components/FormInput";

interface ModalFormProps {
  onClose: () => void;
  initialData?: any;
}

const ModalForm = ({ onClose, initialData }: ModalFormProps) => {
  const isEditMode = !!initialData;
  const [paymentFreq, setPaymentFreq] = useState("Monthly");
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [technicianStatus, setTechnicianStatus] = useState(true);

  const [documents, setDocuments] = useState<
    { id: number; file: File | null; existingUrl?: string }[]
  >([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf">("image");
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (isEditMode && initialData?.technicianDocuments) {
      const existingDocs = initialData.technicianDocuments.map(
        (url: string, index: number) => ({
          id: index + 1,
          file: null,
          existingUrl: url,
        }),
      );
      setDocuments(
        existingDocs.length > 0 ? existingDocs : [{ id: 1, file: null }],
      );
    } else {
      setDocuments([{ id: 1, file: null }]);
    }
  }, [isEditMode, initialData]);

  const removeDocument = (id: number) =>
    documents.length > 1 &&
    setDocuments(documents.filter((doc) => doc.id !== id));

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
          fetch(`${baseUrl}/contract-types?filter=all`, { headers }).then((r) =>
            r.json(),
          ),
          fetch(`${baseUrl}/service-types-master?filter=all`, { headers }).then(
            (r) => r.json(),
          ),
          fetch(`${baseUrl}/departments?filter=all`, { headers }).then((r) =>
            r.json(),
          ),
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
    specializationIds: [] as string[],

    // Salary & Compensation
    salary: "",
    paymentFrequency: "Monthly",
    bankAccountNumber: "",
    taxId: "",

    // Availability - YAHAN INITIALIZE KARO
    dutyRoster: [
      { day: "Sunday", isActive: false, startTime: "09:00", endTime: "17:00" },
      { day: "Monday", isActive: true, startTime: "09:00", endTime: "17:00" },
      { day: "Tuesday", isActive: true, startTime: "09:00", endTime: "17:00" },
      {
        day: "Wednesday",
        isActive: true,
        startTime: "09:00",
        endTime: "17:00",
      },
      { day: "Thursday", isActive: true, startTime: "09:00", endTime: "17:00" },
      { day: "Friday", isActive: true, startTime: "09:00", endTime: "17:00" },
      {
        day: "Saturday",
        isActive: false,
        startTime: "09:00",
        endTime: "17:00",
      },
    ] as Array<{
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
    if (isEditMode && initialData) {
      console.log("Edit data received:", initialData);

      // Extract data from nested API response
      const person = initialData.personId || {};
      const contact = initialData.contactId || {};
      const address = initialData.addressId || {};
      const additionalInfo = initialData.additionalInformation || {};

      // Map duty roster and active days
      const mappedDutyRoster =
        initialData.dutyRoster?.map((item: any) => ({
          day: item.day,
          isActive: item.isActive,
          startTime: item.startTime || "09:00",
          endTime: item.endTime || "17:00",
        })) || [];

      // Set active days based on duty roster
      const activeDayNames = mappedDutyRoster
        .filter((item: any) => item.isActive)
        .map((item: any) => item.day);
      setActiveDays(activeDayNames);

      // IMPORTANT: Initialize dutyRoster with ALL days, not just active ones
      const allDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const completeDutyRoster = allDays.map((day) => {
        const existing = mappedDutyRoster.find((d: any) => d.day === day);
        return {
          day,
          isActive: existing?.isActive || false,
          startTime: existing?.startTime || "09:00",
          endTime: existing?.endTime || "17:00",
        };
      });

      // Set payment frequency
      setPaymentFreq(initialData.paymentFrequency || "Monthly");

      // Set technician status
      const isAvailable = initialData.technicianStatus === "Available";
      setTechnicianStatus(isAvailable);

      // Map specialization IDs
      const specializationIds = Array.isArray(initialData.specializationIds)
        ? initialData.specializationIds.map((item: any) => item._id)
        : [];

      // Format dates
      const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      // Populate form data
      setFormData((prev) => ({
        ...prev, // IMPORTANT: Pehle ki values preserve karo
        firstName: person.firstName || "",
        middleName: person.middleName || "",
        lastName: person.lastName || "",
        emailAddress: contact.emailId || "",
        phoneNumber: contact.mobileNumber || contact.phoneNumber || "",
        dateOfBirth: formatDate(initialData.dateOfBirth),
        employeeId: initialData.employeeId || "",

        streetAddress: address.address || "",
        city: address.city || "",
        postcode: address.zipCode || "",

        dateOfJoining: formatDate(initialData.dateOfJoining),
        contractTypeId:
          initialData.contractTypeId?._id || initialData.contractTypeId || "",
        departmentId:
          initialData.departmentId?._id || initialData.departmentId || "",
        specializationIds: specializationIds,

        salary: initialData.salary?.toString() || "",
        paymentFrequency: initialData.paymentFrequency || "Monthly",
        bankAccountNumber: initialData.bankAccountNumber || "",
        taxId: initialData.taxId || "",

        dutyRoster: completeDutyRoster, // Use complete roster with all days

        emergencyContactName: additionalInfo.emergencyContactName || "",
        emergencyContactPhone: additionalInfo.emergencyContactNumber || "",
        healthInsuranceDetails: additionalInfo.healthInsuranceDetails || "",
        additionalNotes: additionalInfo.additionalNotes || "",
        technicianStatus: initialData.technicianStatus || "Available",
      }));
    }
  }, [isEditMode, initialData]);
  const handleChange = (e: any) => {
    const { name, type, value, selectedOptions } = e.target;

    if (name === "specializationIds" || type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt: any) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleMultipleFiles = (files: File[]) => {
    if (files.length === 0) return;

    const existingDocs = documents.filter(
      (doc) => doc.existingUrl && !doc.file,
    );

    const newDocuments = files.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      existingUrl: undefined,
    }));

    setDocuments([...existingDocs, ...newDocuments]);
  };
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
    setFormData((prev) => {
      const updatedRoster = prev.dutyRoster.map((d) =>
        d.day === day ? { ...d, isActive: !d.isActive } : d,
      );
      return { ...prev, dutyRoster: updatedRoster };
    });

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

      const dutyRosterPayload = formData.dutyRoster
        .filter((item) => item.isActive)
        .map((item) => ({
          day: item.day,
          isActive: item.isActive,
          startTime: item.startTime,
          endTime: item.endTime,
        }));

      const formDataToSend = new FormData();

      formDataToSend.append("userId", currentUserId);
      formDataToSend.append("role", "Technician");

      formDataToSend.append("person[firstName]", formData.firstName.trim());
      formDataToSend.append("person[middleName]", formData.middleName.trim());
      formDataToSend.append("person[lastName]", formData.lastName.trim());

      formDataToSend.append(
        "contact[mobileNumber]",
        formData.phoneNumber.trim(),
      );
      formDataToSend.append(
        "contact[phoneNumber]",
        formData.phoneNumber.trim(),
      );
      formDataToSend.append("contact[emailId]", formData.emailAddress.trim());
      formDataToSend.append("address[address]", formData.streetAddress.trim());
      formDataToSend.append("address[zipCode]", formData.postcode.trim());
      formDataToSend.append("address[city]", formData.city.trim());
      formDataToSend.append("address[country]", "UK");
      formDataToSend.append("address[userId]", currentUserId);
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
      if (formData.specializationIds && formData.specializationIds.length > 0) {
        formData.specializationIds.forEach((id, index) => {
          formDataToSend.append(`specializationIds[${index}]`, id);
        });
      }
      if (dutyRosterPayload.length > 0) {
        formDataToSend.append("dutyRoster", JSON.stringify(dutyRosterPayload));
      }
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
      if (isEditMode && initialData?._id) {
        formDataToSend.append("_id", initialData._id);
        formDataToSend.append("updatedAt", new Date().toISOString());

        if (initialData.personId)
          formDataToSend.append("personId", initialData.personId._id);
        if (initialData.contactId)
          formDataToSend.append("contactId", initialData.contactId._id);
        if (initialData.addressId)
          formDataToSend.append("addressId", initialData.addressId._id);
        if (initialData.accountId)
          formDataToSend.append("accountId", initialData.accountId._id);
      } else {
        formDataToSend.append("createdAt", new Date().toISOString());
        formDataToSend.append("createdBy", currentUserId);
      }
      documents.forEach((doc) => {
        if (doc.file) {
          formDataToSend.append("technicianDocumentsFile", doc.file);
        }
      });

      if (isEditMode && initialData?._id) {
        documents.forEach((doc, index) => {
          if (doc.existingUrl && !doc.file) {
            formDataToSend.append(
              `technicianDocuments[${index}]`,
              doc.existingUrl,
            );
          }
        });
      }
      console.log("FormData entries:");
      for (const [key, value] of (formDataToSend as any).entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(key, value);
        }
      }

      const url = isEditMode
        ? `${baseUrl}/technicians/${initialData._id}`
        : `${baseUrl}/technicians`;

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const text = await response.text();
      console.log("Final Duty Roster:", formData.dutyRoster);
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
          isEditMode
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

      let errorMessage = `Failed to ${
        isEditMode ? "update" : "create"
      } technician`;

      if (
        err?.response?.status === 409 ||
        (typeof err?.message === "string" &&
          err.message.toLowerCase().includes("already exists"))
      ) {
        errorMessage = "❌ Email already exists";
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionTitleStyle =
    "flex items-center gap-2 text-md font-bold text-slate-800 border-b border-slate-50 pb-2 mb-4";

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full  max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <div>
            <h2 className="font-semibold text-2xl bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {isEditMode ? "Update Technician" : "Register New Technician"}
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Complete technician profile with HR information, documents, and
              duty roster
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
          <div className="p-6 max-h-[75vh]  overflow-y-auto space-y-10 custom-scrollbar">
            <div className="w-full max-w-[835px] min-h-24 px-5 py-4 bg-linear-to-r from-[#FFF7F4] via-[#FFF3F3] to-[#FFF0F6] rounded-2xl  outline-2 -outline-offset-2 outline-[#FFD9C7] flex flex-col justify-center">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-linear-to-br from-[#FF5100] to-[#FF2E00] rounded-full flex justify-center items-center shadow-sm shrink-0">
                  <div className="w-5 h-5 flex items-center justify-center text-white">
                    <Users size={20} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-[#1F2937] text-base font-bold font-['Arial'] leading-6">
                    Complete HR Onboarding Form
                  </h3>

                  <p className="text-[#374151] text-sm font-normal font-['Arial'] leading-5">
                    Fill in all required fields marked with
                    <span className="text-[#E11D48] font-bold mx-0.5">*</span>.
                    The form includes: Personal details, Google Places address
                    lookup, multi-document upload, weekly duty roster, salary
                    configuration, and comprehensive HR information.
                  </p>
                </div>
              </div>
            </div>

            <FormSection icon={User} title="Personal Information" theme="red">
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
                <FormField
                  label="Employee ID"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  hoverColor="blue"
                  placeholder="EMP-001"
                  className="[&_input]:bg-[#F0FDFF]"
                />
              </div>
            </FormSection>

            <FormSection
              icon={MapPin}
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
                hoverColor="green"
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
                  hoverColor="blue"
                  required
                />
                <FormField
                  label="Postcode *"
                  name="postcode"
                  type="text"
                  value={formData.postcode}
                  onChange={handleChange}
                  placeholder="Enter postcode"
                  hoverColor="purple"
                  required
                />
              </div>
            </FormSection>

            {/* 3. Employment Details */}
            <FormSection
              icon={Briefcase}
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
                    className="w-full p-3.5 bg-[#F8FAFF] border  rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E7000B]/10 focus:border-blue-500 transition-all font-medium text-slate-600 placeholder:text-slate-400 text-sm border-blue-200 focus:border-blue-500"
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

            <FormSection
              icon={PoundSterling}
              title="Salary & Compensation"
              theme="green"
            >
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
                      hoverColor="green"
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
                          "bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] border-transparent text-white", //
                        hoverBorder: "hover:border-[#3B82F6]",
                        icon: Calendar,
                        iconColor: "text-blue-500",
                      },
                      {
                        label: "Weekly",
                        activeBg:
                          "bg-gradient-to-r from-[#C026D3] to-[#F43F5E] border-transparent text-white", //
                        hoverBorder: "hover:border-[#C026D3]",
                        icon: CalendarDays,
                        iconColor: "text-purple-600",
                      },
                      {
                        label: "Monthly",
                        activeBg: "bg-[#00C964] border-transparent text-white", //
                        hoverBorder: "hover:border-[#00C964]",
                        icon: CalendarDays,
                        iconColor: "text-green-600",
                      },
                    ].map((freq) => {
                      const isSelected = paymentFreq === freq.label;
                      const Icon = freq.icon;

                      return (
                        <button
                          key={freq.label}
                          type="button"
                          onClick={() => setPaymentFreq(freq.label)}
                          className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 h-[100px] shadow-sm ${
                            isSelected
                              ? freq.activeBg
                              : `bg-white border-[#F3F4F6] text-[#6B7280] ${freq.hoverBorder}`
                          }`}
                        >
                          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100">
                            <Icon
                              size={22}
                              // Icon color remains consistent for selection
                              className={`${isSelected ? freq.iconColor : "text-[#6B7280]"}`}
                            />
                          </div>

                          <span
                            className={`text-[13px] font-bold ${
                              isSelected ? "text-white" : "text-[#374151]"
                            }`}
                          >
                            {freq.label}
                          </span>
                        </button>
                      );
                    })}
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

            <section className="space-y-4">
              <h3 className={`${sectionTitleStyle} flex items-center gap-2`}>
                <Clock size={18} className="text-[#A855F7]" />

                <span>Availability & Duty Roster</span>
              </h3>
              <div className="space-y-2">
                {formData.dutyRoster.map((dayData) => (
                  <div
                    key={dayData.day}
                    className={`flex flex-wrap items-center justify-between p-3 rounded-2xl border transition-all ${dayData.isActive ? "bg-[#F0FDF4] border-[#DCFCE7]" : "bg-slate-50 border-slate-100 opacity-60"}`}
                  >
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <button
                        type="button"
                        onClick={() => toggleDay(dayData.day)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${dayData.isActive ? "bg-[#22C55E]" : "bg-slate-300"}`}
                      >
                        <div
                          className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${dayData.isActive ? "right-1" : "left-1"}`}
                        />
                      </button>
                      <span className="text-sm font-bold text-slate-700">
                        {dayData.day}
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
                            handleTimeChange(
                              dayData.day,
                              "startTime",
                              e.target.value,
                            )
                          }
                          className="bg-white border border-slate-200 rounded-lg p-1.5 text-[12px] font-bold text-slate-600 focus:ring-1 focus:ring-[#22C55E] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!dayData.isActive}
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
                            handleTimeChange(
                              dayData.day,
                              "endTime",
                              e.target.value,
                            )
                          }
                          className="bg-white border border-slate-200 rounded-lg p-1.5 text-[12px] font-bold text-slate-600 focus:ring-1 focus:ring-[#22C55E] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!dayData.isActive}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* 6. Document Upload */}
            <section className="space-y-3">
              <h3 className={sectionTitleStyle}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <span className="text-slate-800 text-sm flex items-center gap-2">
                  Document Upload (Multi-File Support)
                </span>
              </h3>

              <div className="p-6 rounded-2xl border-2 border-slate-100 hover:border-cyan-100 transition-all">
                <div className="text-center mb-6 bg-linear-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-xl py-3 px-4">
                  <p className="text-slate-700 text-sm font-medium">
                    <Paperclip className="inline-block w-4 h-4 mr-2 text-slate-900" />
                    Upload multiple documents:{" "}
                    <span className="font-bold">
                      Resume, Certifications, ID Proof, Licenses, Background
                      Check, Training Certificates, etc.
                    </span>
                  </p>
                </div>

                <div
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-linear-to-br from-cyan-200 to-blue-200  cursor-pointer hover:border-cyan-400 hover:bg-slate-50/80 transition-all duration-300"
                  onClick={() => {
                    if (documents.length > 0) {
                      const input = fileInputRefs.current[documents[0]?.id];
                      if (input) {
                        input.click();
                      }
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add(
                      "border-cyan-500",
                      "bg-cyan-50/20",
                    );
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(
                      "border-cyan-500",
                      "bg-cyan-50/20",
                    );
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(
                      "border-cyan-500",
                      "bg-cyan-50/20",
                    );

                    if (e.dataTransfer.files.length > 0) {
                      const files = Array.from(e.dataTransfer.files);
                      handleMultipleFiles(files);
                    }
                  }}
                >
                  <motion.div
                    className="h-20 w-20 rounded-2xl bg-linear-to-br from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg mx-auto mb-4 relative overflow-hidden group"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-cyan-200 to-blue-200 opacity-0 group-hover:opacity-30 transition-opacity" />
                    <Upload size={32} className="text-white relative z-10" />
                  </motion.div>

                  <h4 className="text-lg font-bold text-slate-800 mb-2">
                    Click to Upload Multiple Documents
                  </h4>

                  <p className="text-slate-500 text-sm mb-6">or drag & drop</p>

                  <div className="mb-4">
                    <p className="text-slate-700 text-sm font-medium mb-1">
                      PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-green-600 font-medium">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Select multiple files at once
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        No file limit
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all duration-300 inline-flex items-center gap-2 shadow-sm hover:shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (documents.length > 0) {
                        const input = fileInputRefs.current[documents[0].id];
                        if (input) {
                          input.click();
                        }
                      }
                    }}
                  >
                    Browse Files
                  </button>

                  <input
                    type="file"
                    className="hidden"
                    ref={(el) => {
                      if (documents.length > 0) {
                        fileInputRefs.current[documents[0].id] = el;
                      }
                    }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const files = Array.from(e.target.files);
                        handleMultipleFiles(files);
                      }
                    }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    multiple={true}
                  />
                </div>

                {documents.filter((doc) => doc.file || doc.existingUrl).length >
                  0 && (
                  <div className="mt-8">
                    <h5 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      Selected Documents (
                      {
                        documents.filter((doc) => doc.file || doc.existingUrl)
                          .length
                      }
                      )
                    </h5>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {documents
                        .filter((doc) => doc.file || doc.existingUrl)
                        .map((doc) => (
                          <div
                            key={doc.id}
                            className="bg-slate-50 rounded-lg border border-slate-200 p-3 hover:border-slate-300 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className={`p-2 rounded-md ${doc.file ? "bg-blue-100" : "bg-green-100"}`}
                                >
                                  {doc.file?.name
                                    ?.toLowerCase()
                                    .endsWith(".pdf") ? (
                                    <svg
                                      className="w-5 h-5 text-red-500"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : doc.file?.name
                                      ?.toLowerCase()
                                      .match(/\.(jpg|jpeg|png)$/) ? (
                                    <svg
                                      className="w-5 h-5 text-blue-500"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-5 h-5 text-purple-500"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-slate-800 truncate">
                                      {doc.file
                                        ? doc.file.name
                                        : doc.existingUrl?.split("/").pop()}
                                    </span>
                                    {doc.file && (
                                      <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                        New
                                      </span>
                                    )}
                                    {!doc.file && doc.existingUrl && (
                                      <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded">
                                        Existing
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span>
                                      {doc.file
                                        ? `${(doc.file.size / 1024).toFixed(0)} KB`
                                        : "Uploaded"}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {doc.file?.name
                                        ?.split(".")
                                        .pop()
                                        ?.toUpperCase() ||
                                        doc.existingUrl
                                          ?.split(".")
                                          .pop()
                                          ?.toUpperCase() ||
                                        "FILE"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handlePreviewDocument(doc)}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Preview"
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
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removeDocument(doc.id)}
                                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Remove"
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
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
            {/* 7. Additional Information */}
            <FormSection
              icon={SquarePen}
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
                    ? "bg-[#F0FFF4] border-[#22C55E]/30 ring-1 ring-[#22C55E]/10" // Matches the soft green outline in image_ced1f2.png
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      technicianStatus
                        ? "bg-[#00C951] text-white shadow-lg shadow-green-100" // Vibrant green from image_ced1f2.png
                        : "bg-slate-400 text-white shadow-md shadow-slate-200" // Grey circle from image_ced1d0.png
                    }`}
                  >
                    {/* Changed icons to match the screenshot circular style */}
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
                    setFormData((prev) => ({
                      ...prev,
                      technicianStatus: !technicianStatus
                        ? "Available"
                        : "Busy",
                    }));
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
          </div>

          <div className="p-6 bg-slate-50 flex gap-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-[#00C951] hover:text-white hover:border-[#00C951] transition-all duration-300 text-sm shadow-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              // Changed flex-2 to flex-1 so both buttons have the same size
              // Gradient matches image_cecdd3.png
              className="flex-1 py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#FF5C00] via-[#E7000B] to-[#D8006F] text-white shadow-lg shadow-red-100 hover:opacity-95 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Processing..."
                : isEditMode
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
