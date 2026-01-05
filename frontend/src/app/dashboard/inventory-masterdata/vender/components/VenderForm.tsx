"use client";
import React, { useEffect, useState } from "react";
import { Save, Truck, Check } from "lucide-react";
import { FormModal } from "../../../../common-form/FormModal";
import { FormInput } from "../../../../common-form/FormInput";
import axios from "axios";
import { VenderDto } from "../../../../../../../common/DTOs/vender.dto";
import { ICurrency } from "../../../../../../../common/ICurrency.interface";
import { IPaymentTerms } from "../../../../../../../common/IPayment.terms.interface";

interface Props {
  editingData: (VenderDto & { _id?: string }) | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

// Type for the form state (with string inputs)
interface FormState {
  venderType: "Supplier" | "Vender" | "Both";
  business_name: string;
  website: string;
  paymentTermId: string;
  currencyId: string;
  credit_Limit: string; // string for input
  bank_name: string;
  account_Number: string;
  lead_Time_Days: string; // string for input
  isActive: boolean;
  isDefault: boolean;
  person: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  contact: {
    mobileNumber: string;
    phoneNumber: string;
    emailId: string;
  };
  address: {
    address: string;
    zipCode: string;
    city: string;
    country: string;
  };
}

const VenderForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
  const [paymentTerms, setPaymentTerms] = useState<IPaymentTerms[]>([]);
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    venderType: "Supplier",
    business_name: "",
    website: "",
    paymentTermId: "",
    currencyId: "",
    credit_Limit: "",
    bank_name: "",
    account_Number: "",
    lead_Time_Days: "",
    isActive: true,
    isDefault: false,
    person: {
      firstName: "",
      middleName: "",
      lastName: "",
    },
    contact: {
      mobileNumber: "",
      phoneNumber: "",
      emailId: "",
    },
    address: {
      address: "",
      zipCode: "",
      city: "",
      country: "",
    },
  });

  const getAuthConfig = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  /* ---------------- Fetch dropdown data ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const [pt, cur] = await Promise.all([
          axios.get<{ data: IPaymentTerms[] }>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment-terms`,
            getAuthConfig()
          ),
          axios.get<{ data: ICurrency[] }>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/currencies`,
            getAuthConfig()
          ),
        ]);

        setPaymentTerms(pt.data.data || []);
        setCurrencies(cur.data.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    load();
  }, []);

  /* ---------------- Edit Mode ---------------- */
  useEffect(() => {
    if (!editingData) return;

    // Helper function to safely extract nested properties
    const extractNested = <T,>(obj: any, ...paths: string[]): T => {
      for (const path of paths) {
        const value = obj?.[path];
        if (value !== undefined && value !== null) return value as T;
      }
      return "" as T;
    };

    setFormData({
      venderType: editingData.venderType || "Supplier",
      business_name: editingData.business_name || "",
      website: editingData.website || "",
      paymentTermId: extractNested<string>(
        editingData,
        "paymentTermId",
        "paymentTermId._id"
      ),
      currencyId: extractNested<string>(
        editingData,
        "currencyId",
        "currencyId._id"
      ),
      credit_Limit: editingData.credit_Limit
        ? String(editingData.credit_Limit)
        : "",
      bank_name: editingData.bank_name || "",
      account_Number: editingData.account_Number || "",
      lead_Time_Days: editingData.lead_Time_Days
        ? String(editingData.lead_Time_Days)
        : "",
      isActive: editingData.isActive ?? true,
      isDefault: editingData.isDefault ?? false,
      person: {
        firstName: editingData.person?.firstName || "",
        middleName: editingData.person?.middleName || "",
        lastName: editingData.person?.lastName || "",
      },
      contact: {
        mobileNumber: editingData.contact?.mobileNumber || "",
        phoneNumber: editingData.contact?.phoneNumber || "",
        emailId: editingData.contact?.emailId || "",
      },
      address: {
        address: editingData.address?.address || "",
        zipCode: editingData.address?.zipCode || "",
        city: editingData.address?.city || "",
        country: editingData.address?.country || "",
      },
    });
  }, [editingData]);

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user._id;

      if (!userId) {
        alert("User not found. Please login again.");
        return;
      }

      // Prepare payload according to VenderDto structure
      // IMPORTANT: Send strings for credit_Limit and lead_Time_Days as per validation schema
      const payload = {
        userId: userId,
        venderType: formData.venderType,
        business_name: formData.business_name,
        website: formData.website || undefined,
        paymentTermId: formData.paymentTermId,
        currencyId: formData.currencyId || undefined,
        // Send as string (validation expects string)
        credit_Limit: formData.credit_Limit || undefined,
        bank_name: formData.bank_name || undefined,
        account_Number: formData.account_Number || undefined,
        // Send as string (validation expects string)
        lead_Time_Days: formData.lead_Time_Days || undefined,
        isActive: formData.isActive,
        isDefault: formData.isDefault,

        // Send nested objects - middleware will convert these to IDs
        person: {
          userId: userId,
          firstName: formData.person.firstName,
          middleName: formData.person.middleName || undefined,
          lastName: formData.person.lastName,
        },
        contact: {
          userId: userId,
          mobileNumber: formData.contact.mobileNumber,
          phoneNumber: formData.contact.phoneNumber || undefined,
          emailId: formData.contact.emailId,
        },
        address: {
          userId: userId,
          address: formData.address.address,
          zipCode: formData.address.zipCode || undefined,
          city: formData.address.city || undefined,
          country: formData.address.country || undefined,
        },
      };

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      const config = getAuthConfig();

      // Create or update vendor
      if (editingData?._id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/venders/${editingData._id}`,
          payload,
          config
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/venders`,
          payload,
          config
        );
      }

      onRefresh();
      onClose();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);

      if (error.response) {
        // Parse the Zod error array
        let errorMessage = "Validation failed: ";
        try {
          const errorData = error.response.data;
          if (typeof errorData.message === "string") {
            // Try to parse the Zod error array
            const zodErrors = JSON.parse(errorData.message);
            if (Array.isArray(zodErrors)) {
              zodErrors.forEach((err: any) => {
                errorMessage += `${err.path?.join(".")}: ${err.message}; `;
              });
            } else {
              errorMessage = errorData.message;
            }
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        } catch (parseError) {
          console.log(parseError);
          errorMessage = error.response.data?.message || "Unknown error";
        }

        alert(`Validation Error: ${errorMessage}`);
      } else if (error.request) {
        alert("No response from server. Check your network connection.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update nested objects
  const updateNestedObject = (
    parentKey: keyof FormState,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as any),
        [field]: value,
      },
    }));
  };

  // Handle direct form updates
  const handleFormChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field: keyof FormState) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <FormModal
      title={editingData ? "Edit Vender" : "Add New Vender"}
      icon={<Truck size={24} />}
      onClose={onClose}
      themeColor={themeColor}
      width="lg:max-w-3xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5 max-h-[75vh] overflow-y-auto p-1"
      >
        {/* Business Name */}
        <FormInput
          label="Business Name *"
          value={formData.business_name}
          onChange={(e) => handleFormChange("business_name", e.target.value)}
          required
        />

        {/* Vender Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vender Type *
          </label>
          <select
            className="w-full p-3 border rounded-xl"
            value={formData.venderType}
            onChange={(e) =>
              handleFormChange(
                "venderType",
                e.target.value as "Supplier" | "Vender" | "Both"
              )
            }
            required
          >
            <option value="Supplier">Supplier</option>
            <option value="Vender">Vender</option>
            <option value="Both">Both</option>
          </select>
        </div>

        {/* Website */}
        <FormInput
          label="Website"
          value={formData.website}
          onChange={(e) => handleFormChange("website", e.target.value)}
          type="url"
          placeholder="https://example.com"
        />

        {/* Payment Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Term *
          </label>
          <select
            className="w-full p-3 border rounded-xl"
            value={formData.paymentTermId}
            onChange={(e) => handleFormChange("paymentTermId", e.target.value)}
            required
          >
            <option value="">Select Payment Term</option>
            {paymentTerms.map((p) => (
              <option key={p._id} value={p._id}>
                {p.paymentTerm}
              </option>
            ))}
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            className="w-full p-3 border rounded-xl"
            value={formData.currencyId}
            onChange={(e) => handleFormChange("currencyId", e.target.value)}
          >
            <option value="">Select Currency</option>
            {currencies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.code} - {c.currencyName}
              </option>
            ))}
          </select>
        </div>

        {/* Credit & Bank Section */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Credit Limit"
            type="text"
            value={formData.credit_Limit}
            onChange={(e) => handleFormChange("credit_Limit", e.target.value)}
            placeholder="0"
          />
          <FormInput
            label="Lead Time (Days)"
            type="text"
            value={formData.lead_Time_Days}
            onChange={(e) => handleFormChange("lead_Time_Days", e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Bank Name"
            value={formData.bank_name}
            onChange={(e) => handleFormChange("bank_name", e.target.value)}
            placeholder="Bank name"
          />
          <FormInput
            label="Account Number"
            value={formData.account_Number}
            onChange={(e) => handleFormChange("account_Number", e.target.value)}
            placeholder="Account number"
          />
        </div>

        {/* Personal Information Section */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-gray-700 mb-3">
            Personal Information
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="First Name *"
              value={formData.person.firstName}
              onChange={(e) =>
                updateNestedObject("person", "firstName", e.target.value)
              }
              required
              placeholder="First name"
            />
            <FormInput
              label="Middle Name"
              value={formData.person.middleName}
              onChange={(e) =>
                updateNestedObject("person", "middleName", e.target.value)
              }
              placeholder="Middle name"
            />
            <FormInput
              label="Last Name *"
              value={formData.person.lastName}
              onChange={(e) =>
                updateNestedObject("person", "lastName", e.target.value)
              }
              required
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-gray-700 mb-3">
            Contact Information
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <FormInput
              label="Mobile Number *"
              value={formData.contact.mobileNumber}
              onChange={(e) =>
                updateNestedObject("contact", "mobileNumber", e.target.value)
              }
              required
              placeholder="03XXXXXXXXX"
            />
            <FormInput
              label="Phone Number"
              value={formData.contact.phoneNumber}
              onChange={(e) =>
                updateNestedObject("contact", "phoneNumber", e.target.value)
              }
              placeholder="Phone number"
            />
            <FormInput
              label="Email ID *"
              type="email"
              value={formData.contact.emailId}
              onChange={(e) =>
                updateNestedObject("contact", "emailId", e.target.value)
              }
              required
              placeholder="email@example.com"
            />
          </div>
        </div>

        {/* Address Information Section */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-gray-700 mb-3">
            Address Information
          </h3>
          <FormInput
            label="Address *"
            value={formData.address.address}
            onChange={(e) =>
              updateNestedObject("address", "address", e.target.value)
            }
            required
            placeholder="Full address"
          />
          <div className="grid grid-cols-3 gap-4 mt-3">
            <FormInput
              label="Zip Code"
              value={formData.address.zipCode}
              onChange={(e) =>
                updateNestedObject("address", "zipCode", e.target.value)
              }
              placeholder="Zip code"
            />
            <FormInput
              label="City"
              value={formData.address.city}
              onChange={(e) =>
                updateNestedObject("address", "city", e.target.value)
              }
              placeholder="City"
            />
            <FormInput
              label="Country"
              value={formData.address.country}
              onChange={(e) =>
                updateNestedObject("address", "country", e.target.value)
              }
              placeholder="Country"
            />
          </div>
        </div>

        {/* Status Checkboxes at Bottom */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-gray-700 mb-3">Status Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Active Checkbox */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={() => handleCheckboxChange("isActive")}
                  className="sr-only"
                />
                <label
                  htmlFor="isActive"
                  className={`block w-12 h-6 rounded-full cursor-pointer ${
                    formData.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.isActive ? "left-7" : "left-1"
                    }`}
                  ></div>
                </label>
              </div>
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Active Status
              </label>
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={() => handleCheckboxChange("isDefault")}
                  className="sr-only"
                />
                <div
                  onClick={() => handleCheckboxChange("isDefault")}
                  className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer ${
                    formData.isDefault
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {formData.isDefault && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
              </div>
              <label
                htmlFor="isDefault"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Set as Default
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: themeColor }}
        >
          <Save size={20} />
          {loading
            ? "Processing..."
            : editingData
            ? "Update Vender"
            : "Save Vender"}
        </button>
      </form>
    </FormModal>
  );
};

export default VenderForm;
