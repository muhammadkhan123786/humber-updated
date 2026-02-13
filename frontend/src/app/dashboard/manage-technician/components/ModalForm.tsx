"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Users } from "lucide-react";
import useGoogleMapLoad from "@/hooks/useGoogleMapLoad";
import PersonalInfoSection from "./PersonalInfoSection";
import AddressSection from "./AddressSection";
import EmploymentSection from "./EmploymentSection";
import SalarySection from "./SalarySection";
import AvailabilitySection from "./AvailabilitySection";
import DocumentUploadSection from "./DocumentUploadSection";
import AdditionalInfoSection from "./AdditionalInfoSection";
import FormActions from "./FormActions";
import DocumentPreviewModal from "./DocumentPreviewModal";

// Google Maps types
interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GooglePlaceResult {
  place_id?: string;
  formatted_address?: string;
  address_components?: GoogleAddressComponent[];
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

interface ModalFormProps {
  onClose: () => void;
  initialData?: any;
}

const ModalForm = ({ onClose, initialData }: ModalFormProps) => {
  const isEditMode = !!initialData;
  const [paymentFreq, setPaymentFreq] = useState("Monthly");
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [technicianStatus, setTechnicianStatus] = useState(true);
  const googleMapLoader = useGoogleMapLoad();

  const [documents, setDocuments] = useState<
    { id: number; file: File | null; existingUrl?: string }[]
  >([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf">("image");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEmployeeCode, setIsLoadingEmployeeCode] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    contractTypes: [],
    serviceTypesMaster: [],
    departments: [],
  });
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    dateOfBirth: "",
    employeeId: "",
    streetAddress: "",
    city: "",
    postcode: "",
    latitude: 0,
    longitude: 0,
    dateOfJoining: "",
    contractTypeId: "",
    departmentId: "",
    specializationIds: [] as string[],
    salary: "",
    paymentFrequency: "Monthly",
    bankAccountNumber: "",
    taxId: "",
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
    emergencyContactName: "",
    emergencyContactPhone: "",
    healthInsuranceDetails: "",
    additionalNotes: "",
    technicianStatus: "Available",
  });

  // Auto-generate employee code on mount (only for new technicians)
  useEffect(() => {
    const generateEmployeeCode = async () => {
      if (isEditMode) return; // Don't generate for edit mode

      setIsLoadingEmployeeCode(true);
      try {
        const token = localStorage.getItem("token")?.replace(/"/g, "") || "";
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await fetch(
          `${baseUrl}/auto-generate-codes/employee-code`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const result = await response.json();

        if (result.employeeCode) {
          setFormData((prev) => ({
            ...prev,
            employeeId: result.employeeCode,
          }));
        }
      } catch (error) {
        console.error("Error generating employee code:", error);
      } finally {
        setIsLoadingEmployeeCode(false);
      }
    };

    generateEmployeeCode();
  }, [isEditMode]);

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

  // Initialize Google Maps Autocomplete with TypeScript fixes
  useEffect(() => {
    if (!googleMapLoader || typeof window === "undefined" || !window.google)
      return;

    const input = document.getElementById(
      "street-address-input",
    ) as HTMLInputElement;
    if (!input) return;

    // Create autocomplete instance
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["address"],
      componentRestrictions: { country: "uk" },
    });

    // Add place changed listener
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace() as GooglePlaceResult;

      if (!place?.place_id) return;

      // Create PlacesService for details
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div"),
      );

      service.getDetails(
        {
          placeId: place.place_id,
          fields: ["address_components", "formatted_address", "geometry"],
        },
        (result: GooglePlaceResult | null, status: string) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            result
          ) {
            // Get address components
            const addressComponents = result.address_components || [];

            // Extract address components
            const getComponent = (types: string[]): string => {
              const component = addressComponents.find((comp) =>
                types.some((type) => comp.types.includes(type)),
              );
              return component?.long_name || "";
            };

            // Get formatted address or build from components
            const streetNumber = getComponent(["street_number"]);
            const route = getComponent(["route"]);
            const address =
              streetNumber && route
                ? `${streetNumber} ${route}`
                : result.formatted_address || input.value;

            // Get city (locality or postal_town)
            const city =
              getComponent(["locality"]) ||
              getComponent(["postal_town"]) ||
              getComponent(["administrative_area_level_3"]);

            // Get postal code
            const zipCode = getComponent(["postal_code"]);

            // Get coordinates
            const lat = result.geometry?.location?.lat() || 0;
            const lng = result.geometry?.location?.lng() || 0;

            // Update form values
            setFormData((prev) => ({
              ...prev,
              streetAddress: address,
              city: city,
              postcode: zipCode,
              latitude: lat,
              longitude: lng,
            }));
          }
        },
      );
    });

    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [googleMapLoader]);

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

  useEffect(() => {
    if (isEditMode && initialData) {
      console.log("Edit data received:", initialData);

      const person = initialData.personId || {};
      const contact = initialData.contactId || {};
      const address = initialData.addressId || {};
      const additionalInfo = initialData.additionalInformation || {};

      const mappedDutyRoster =
        initialData.dutyRoster?.map((item: any) => ({
          day: item.day,
          isActive: item.isActive,
          startTime: item.startTime || "09:00",
          endTime: item.endTime || "17:00",
        })) || [];

      const activeDayNames = mappedDutyRoster
        .filter((item: any) => item.isActive)
        .map((item: any) => item.day);
      setActiveDays(activeDayNames);

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

      setPaymentFreq(initialData.paymentFrequency || "Monthly");

      const isAvailable = initialData.technicianStatus === "Available";
      setTechnicianStatus(isAvailable);

      const specializationIds = Array.isArray(initialData.specializationIds)
        ? initialData.specializationIds.map((item: any) => item._id)
        : [];

      const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setFormData((prev) => ({
        ...prev,
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
        latitude: address.latitude || 0,
        longitude: address.longitude || 0,
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
        dutyRoster: completeDutyRoster,
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

  const removeDocument = (id: number) =>
    documents.length > 1 &&
    setDocuments(documents.filter((doc) => doc.id !== id));

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

    if (!formData.streetAddress) {
      alert("Please enter a valid address.");
      return;
    }

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

      if (formData.latitude && formData.longitude) {
        formDataToSend.append(
          "address[latitude]",
          formData.latitude.toString(),
        );
        formDataToSend.append(
          "address[longitude]",
          formData.longitude.toString(),
        );
      }

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

  if (!googleMapLoader && !isEditMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        <div className="relative w-[900px] max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading Google Maps API...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
        className="relative w-[900px] max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto custom-scrollbar"
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
          <div className="p-6 space-y-10">
            <div className="w-full max-w-[835px] min-h-24 px-5 py-4 bg-linear-to-r from-[#FFF7F4] via-[#FFF3F3] to-[#FFF0F6] rounded-2xl outline-2 -outline-offset-2 outline-[#FFD9C7] flex flex-col justify-center">
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

            <PersonalInfoSection
              formData={formData}
              handleChange={handleChange}
              isLoadingEmployeeCode={isLoadingEmployeeCode}
            />
            <AddressSection
              formData={formData}
              handleChange={handleChange}
              googleMapLoader={googleMapLoader}
            />
            <EmploymentSection
              formData={formData}
              handleChange={handleChange}
              dropdowns={dropdowns}
            />
            <SalarySection
              formData={formData}
              handleChange={handleChange}
              paymentFreq={paymentFreq}
              setPaymentFreq={setPaymentFreq}
            />
            <AvailabilitySection
              formData={formData}
              activeDays={activeDays}
              toggleDay={toggleDay}
              handleTimeChange={handleTimeChange}
            />
            <DocumentUploadSection
              documents={documents}
              handleMultipleFiles={handleMultipleFiles}
              removeDocument={removeDocument}
              handlePreviewDocument={handlePreviewDocument}
            />
            <AdditionalInfoSection
              formData={formData}
              handleChange={handleChange}
              technicianStatus={technicianStatus}
              setTechnicianStatus={setTechnicianStatus}
            />
          </div>

          <FormActions
            onClose={onClose}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
            googleMapLoader={googleMapLoader}
          />
        </form>
      </motion.div>

      {previewUrl && (
        <DocumentPreviewModal
          previewUrl={previewUrl}
          previewType={previewType}
          onClose={() => {
            setPreviewUrl(null);
            if (previewUrl?.startsWith("blob:")) {
              URL.revokeObjectURL(previewUrl);
            }
          }}
        />
      )}
    </div>
  );
};

export default ModalForm;
