"use client";
import React, { useEffect, useState } from "react";
import { Save, Truck } from "lucide-react";
import { FormModal } from "../../../common-form/FormModal";
import { FormInput } from "../../../common-form/FormInput";
import axios from "axios";
import { VenderDto } from "../../../../../../common/DTOs/vender.dto";
import { ICurrency } from "../../../../../../common/ICurrency.interface";
import { IPaymentTerms } from "../../../../../../common/IPayment.terms.interface";
import { FormToggle } from "@/app/common-form/FormToggle";

interface PopulatedPerson {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
}

interface PopulatedContact {
  _id: string;
  mobileNumber: string;
  phoneNumber?: string;
  emailId: string;
}

interface PopulatedAddress {
  _id: string;
  address: string;
  zipCode?: string;
  cityId?: string | { _id: string; cityName: string };
  countryId?: string | { _id: string; countryName: string };
  city?: string; // For backward compatibility
  country?: string; // For backward compatibility
}

interface PopulatedPaymentTerm {
  _id: string;
  paymentTerm: string;
}

interface PopulatedCurrency {
  _id: string;
  code: string;
  currencyName: string;
  currencySymbol: string;
}

interface City {
  _id: string;
  cityName: string;
  countryId?: string | { _id: string; countryName: string };
}

interface Country {
  _id: string;
  countryName: string;
}

type PopulatedVenderDto = Omit<VenderDto, "business_Name"> & {
  personId?: string | PopulatedPerson;
  addressId?: string | PopulatedAddress;
  contactId?: string | PopulatedContact;
  paymentTermId?: string | PopulatedPaymentTerm;
  currencyId?: string | PopulatedCurrency;
  business_name?: string;
  business_Name?: string;
};

interface Props {
  editingData: (PopulatedVenderDto & { _id?: string }) | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

interface FormState {
  venderType: "Supplier" | "Vendor" | "Both";
  business_name: string;
  website: string;
  paymentTermId: string;
  currencyId: string;
  credit_Limit: string;
  bank_name: string;
  account_Number: string;
  lead_Time_Days: string;
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
    cityId: string;
    countryId: string;
    cityName: string; // Added to store city name
    countryName: string; // Added to store country name
  };
}

const VenderForm = ({ editingData, onClose, onRefresh, themeColor }: Props) => {
  const [paymentTerms, setPaymentTerms] = useState<IPaymentTerms[]>([]);
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

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
      cityId: "",
      countryId: "",
      cityName: "",
      countryName: "",
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

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [pt, cur, citiesData, countriesData] = await Promise.all([
          axios.get<{ data: IPaymentTerms[] }>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment-terms`,
            getAuthConfig()
          ),
          axios.get<{ data: ICurrency[] }>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/currencies`,
            getAuthConfig()
          ),
          axios.get<{ data: City[] }>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/city`,
            getAuthConfig()
          ),
          axios.get<{ data: Country[] }>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/country`,
            getAuthConfig()
          ),
        ]);

        setPaymentTerms(pt.data.data || []);
        setCurrencies(cur.data.data || []);
        setCities(citiesData.data.data || []);
        setCountries(countriesData.data.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    loadDropdowns();
  }, []);

  useEffect(() => {
    if (!editingData) return;

    const loadEditingData = async () => {
      setIsLoadingData(true);
      try {
        const getBusinessName = () => {
          if (editingData.business_name) return editingData.business_name;
          if (editingData.business_Name) return editingData.business_Name;
          return "";
        };

        const getPaymentTermId = () => {
          if (!editingData.paymentTermId) return "";
          const paymentTermId = editingData.paymentTermId;

          if (
            paymentTermId &&
            typeof paymentTermId === "object" &&
            "_id" in paymentTermId
          ) {
            return (paymentTermId as { _id: string })._id;
          }

          return editingData.paymentTermId as string;
        };

        const getCurrencyId = () => {
          if (!editingData.currencyId) return "";
          const currencyId = editingData.currencyId;

          if (
            currencyId &&
            typeof currencyId === "object" &&
            "_id" in currencyId
          ) {
            return (currencyId as { _id: string })._id;
          }
          return editingData.currencyId as string;
        };

        const getPersonData = () => {
          if (editingData.person) {
            return {
              firstName: editingData.person.firstName || "",
              middleName: editingData.person.middleName || "",
              lastName: editingData.person.lastName || "",
            };
          }

          if (
            editingData.personId &&
            typeof editingData.personId === "object"
          ) {
            return {
              firstName: editingData.personId.firstName || "",
              middleName: editingData.personId.middleName || "",
              lastName: editingData.personId.lastName || "",
            };
          }

          return { firstName: "", middleName: "", lastName: "" };
        };

        const getContactData = () => {
          if (editingData.contact) {
            return {
              mobileNumber: editingData.contact.mobileNumber || "",
              phoneNumber: editingData.contact.phoneNumber || "",
              emailId: editingData.contact.emailId || "",
            };
          }

          if (
            editingData.contactId &&
            typeof editingData.contactId === "object"
          ) {
            return {
              mobileNumber: editingData.contactId.mobileNumber || "",
              phoneNumber: editingData.contactId.phoneNumber || "",
              emailId: editingData.contactId.emailId || "",
            };
          }

          return { mobileNumber: "", phoneNumber: "", emailId: "" };
        };

        const getAddressData = async () => {
          const addressData = {
            address: "",
            zipCode: "",
            cityId: "",
            countryId: "",
            cityName: "",
            countryName: "",
          };

          let addressObj: PopulatedAddress | undefined;
          if (editingData.address) {
          } else if (editingData.addressId) {
            if (typeof editingData.addressId === "object") {
              addressObj = editingData.addressId as PopulatedAddress;
            }
          }
          if (addressObj) {
            addressData.address = addressObj.address || "";
            addressData.zipCode = addressObj.zipCode || "";

            if (addressObj.countryId) {
              if (typeof addressObj.countryId === "string") {
                addressData.countryId = addressObj.countryId;
                const country = countries.find(
                  (c) => c._id === addressObj?.countryId
                );
                if (country) {
                  addressData.countryName = country.countryName;
                }
              } else if (addressObj.countryId._id) {
                addressData.countryId = addressObj.countryId._id;
                addressData.countryName = addressObj.countryId.countryName;
              }
            }
            if (addressObj.cityId) {
              if (typeof addressObj.cityId === "string") {
                addressData.cityId = addressObj.cityId;
                // Find city name
                const city = cities.find((c) => c._id === addressObj?.cityId);
                if (city) {
                  addressData.cityName = city.cityName;
                }
              } else if (addressObj.cityId._id) {
                addressData.cityId = addressObj.cityId._id;
                addressData.cityName = addressObj.cityId.cityName;
              }
            }
            if (addressData.cityId && !addressData.countryId) {
              const city = cities.find((c) => c._id === addressData.cityId);
              if (city && city.countryId) {
                if (typeof city.countryId === "string") {
                  addressData.countryId = city.countryId;
                  const country = countries.find(
                    (c) => c._id === city.countryId
                  );
                  if (country) {
                    addressData.countryName = country.countryName;
                  }
                } else if (
                  typeof city.countryId === "object" &&
                  city.countryId._id
                ) {
                  addressData.countryId = city.countryId._id;
                  addressData.countryName = city.countryId.countryName;
                }
              }
            }
          }

          return addressData;
        };

        const personData = getPersonData();
        const contactData = getContactData();
        const addressData = await getAddressData();

        setFormData({
          venderType: editingData.venderType || "Supplier",
          business_name: getBusinessName(),
          website: editingData.website || "",
          paymentTermId: getPaymentTermId(),
          currencyId: getCurrencyId(),
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
          person: personData,
          contact: contactData,
          address: addressData,
        });
      } catch (error) {
        console.error("Error loading editing data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadEditingData();
  }, [editingData, cities, countries]);

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

      const cityName =
        formData.address.cityName ||
        (formData.address.cityId
          ? cities.find((c) => c._id === formData.address.cityId)?.cityName
          : "");

      const countryName =
        formData.address.countryName ||
        (formData.address.countryId
          ? countries.find((c) => c._id === formData.address.countryId)
              ?.countryName
          : "");

      if (!cityName || !countryName) {
        alert("Please select valid city and country from the dropdown.");
        setLoading(false);
        return;
      }

      const payload: any = {
        userId: userId,
        venderType: formData.venderType,
        business_name: formData.business_name,
        website: formData.website || undefined,
        paymentTermId: formData.paymentTermId,
        currencyId: formData.currencyId || undefined,
        credit_Limit: formData.credit_Limit ? Number(formData.credit_Limit) : 0,
        bank_name: formData.bank_name || undefined,
        account_Number: formData.account_Number || undefined,
        lead_Time_Days: formData.lead_Time_Days
          ? Number(formData.lead_Time_Days)
          : 0,
        isActive: formData.isActive,
        isDefault: formData.isDefault,
        person: {
          firstName: formData.person.firstName,
          middleName: formData.person.middleName || undefined,
          lastName: formData.person.lastName,
        },
        contact: {
          mobileNumber: formData.contact.mobileNumber,
          phoneNumber: formData.contact.phoneNumber || undefined,
          emailId: formData.contact.emailId,
        },
        address: {
          userId: userId,
          address: formData.address.address,
          zipCode: formData.address.zipCode || undefined,
          city: cityName, // Send city NAME (not ID)
          country: countryName, // Send country NAME (not ID)
        },
      };
      const config = getAuthConfig();

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
    } catch (error: unknown) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else if (error.response?.data) {
          alert(`Error: ${JSON.stringify(error.response.data)}`);
        } else if (error.response) {
          alert(`Request failed with status ${error.response.status}`);
        } else {
          alert("Server not response");
        }
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateNestedObject = (
    parentKey: keyof FormState,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  const handleFormChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredCities = formData.address.countryId
    ? cities.filter((city) => {
        if (typeof city.countryId === "string") {
          return city.countryId === formData.address.countryId;
        } else if (city.countryId && typeof city.countryId === "object") {
          return city.countryId._id === formData.address.countryId;
        }
        return false;
      })
    : cities;

  useEffect(() => {
    if (formData.address.countryId) {
      const country = countries.find(
        (c) => c._id === formData.address.countryId
      );
      if (country) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            countryName: country.countryName,
            cityId: "", // Reset city when country changes
            cityName: "",
          },
        }));
      }
    }
  }, [formData.address.countryId, countries]);

  useEffect(() => {
    if (formData.address.cityId) {
      const city = cities.find((c) => c._id === formData.address.cityId);
      if (city) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            cityName: city.cityName,
          },
        }));
      }
    }
  }, [formData.address.cityId, cities]);

  return (
    <FormModal
      title={editingData ? "Edit Vendor" : "Add New Vendor"}
      icon={<Truck size={24} />}
      onClose={onClose}
      themeColor={themeColor}
      width="w-[95vw] max-w-[1000px]"
      className="min-w-[350px] max-h-[90vh]"
    >
      {isLoadingData ? (
        <div className="flex justify-center items-center h-64">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
            style={{ borderColor: themeColor }}
          ></div>
          <span className="ml-3">Loading data...</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Business Name *"
              value={formData.business_name}
              onChange={(e) =>
                handleFormChange("business_name", e.target.value)
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Type *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.venderType}
                onChange={(e) =>
                  handleFormChange(
                    "venderType",
                    e.target.value as "Supplier" | "Vendor" | "Both"
                  )
                }
                required
              >
                <option value="Supplier">Supplier</option>
                <option value="Vendor">Vendor</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          <FormInput
            label="Website"
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            onBlur={(e) => {
              const value = e.target.value.trim();
              if (value && !/^https?:\/\//i.test(value)) {
                setFormData({
                  ...formData,
                  website: "https://" + value,
                });
              }
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Term *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.paymentTermId}
                onChange={(e) =>
                  handleFormChange("paymentTermId", e.target.value)
                }
                required
              >
                <option value="">Select Payment Term</option>
                {paymentTerms
                  .filter((p) => p.isActive)
                  .map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.paymentTerm}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.currencyId}
                onChange={(e) => handleFormChange("currencyId", e.target.value)}
              >
                <option value="">Select Currency</option>
                {currencies
                  .filter((c) => c.isActive)
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.currencySymbol} - {c.currencyName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormInput
              label="Credit Limit"
              type="text"
              value={formData.credit_Limit}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                handleFormChange("credit_Limit", value);
              }}
              placeholder="0"
            />
            <FormInput
              label="Lead Time (Days)"
              type="text"
              value={formData.lead_Time_Days}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                handleFormChange("lead_Time_Days", value);
              }}
              placeholder="0"
            />
            <FormInput
              label="Bank Name"
              value={formData.bank_name}
              onChange={(e) => handleFormChange("bank_name", e.target.value)}
              placeholder="Bank"
            />
            <FormInput
              label="Account Number"
              value={formData.account_Number}
              onChange={(e) =>
                handleFormChange("account_Number", e.target.value)
              }
              placeholder="Account No"
            />
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <div
                className="w-1 h-6 rounded"
                style={{ backgroundColor: themeColor }}
              ></div>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="First Name *"
                value={formData.person.firstName}
                onChange={(e) =>
                  updateNestedObject("person", "firstName", e.target.value)
                }
                required
              />
              <FormInput
                label="Middle Name"
                value={formData.person.middleName}
                onChange={(e) =>
                  updateNestedObject("person", "middleName", e.target.value)
                }
              />
              <FormInput
                label="Last Name *"
                value={formData.person.lastName}
                onChange={(e) =>
                  updateNestedObject("person", "lastName", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <div
                className="w-1 h-6 rounded"
                style={{ backgroundColor: themeColor }}
              ></div>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Mobile Number *"
                value={formData.contact.mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9+]/g, "");
                  const formatted = value.startsWith("+")
                    ? "+" + value.slice(1).replace(/\+/g, "")
                    : value.replace(/\+/g, "");

                  updateNestedObject("contact", "mobileNumber", formatted);
                }}
                inputMode="tel"
                placeholder="+923001234567"
                required
              />

              <FormInput
                label="Phone Number"
                value={formData.contact.phoneNumber}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9+]/g, "");
                  if (value.indexOf("+") > 0) {
                    value = value.replace(/\+/g, "");
                  }
                  updateNestedObject("contact", "phoneNumber", value);
                }}
                inputMode="tel"
                placeholder="+923001234567"
              />
              <FormInput
                label="Email ID *"
                type="email"
                value={formData.contact.emailId}
                onChange={(e) =>
                  updateNestedObject("contact", "emailId", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <div
                className="w-1 h-6 rounded"
                style={{ backgroundColor: themeColor }}
              ></div>
              Address Information
            </h3>
            <FormInput
              label="Address *"
              value={formData.address.address}
              onChange={(e) =>
                updateNestedObject("address", "address", e.target.value)
              }
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormInput
                label="Zip Code"
                value={formData.address.zipCode}
                onChange={(e) =>
                  updateNestedObject(
                    "address",
                    "zipCode",
                    e.target.value.replace(/\D/g, "")
                  )
                }
                inputMode="numeric"
                placeholder="e.g. 54000"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.address.countryId}
                  onChange={(e) => {
                    updateNestedObject("address", "countryId", e.target.value);
                  }}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.countryName}
                    </option>
                  ))}
                </select>
                {formData.address.countryName && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {formData.address.countryName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.address.cityId}
                  onChange={(e) =>
                    updateNestedObject("address", "cityId", e.target.value)
                  }
                  disabled={!formData.address.countryId}
                  required
                >
                  <option value="">Select City</option>
                  {filteredCities.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.cityName}
                    </option>
                  ))}
                </select>
                {formData.address.cityName && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {formData.address.cityName}
                  </p>
                )}
                {!formData.address.countryId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please select a country first
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <div
                className="w-1 h-6 rounded"
                style={{ backgroundColor: themeColor }}
              ></div>
              Status Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormToggle
                label="Active Status"
                checked={formData.isActive}
                onChange={(val) => handleFormChange("isActive", val)}
                disabled={formData.isDefault}
              />
              <FormToggle
                label="Set as Default"
                checked={formData.isDefault}
                onChange={(val) => handleFormChange("isDefault", val)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: themeColor }}
          >
            <Save size={20} />
            {loading
              ? "Processing..."
              : editingData
              ? "Update Vendor"
              : "Save Vendor"}
          </button>
        </form>
      )}
    </FormModal>
  );
};

export default VenderForm;
