"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Building2,
  User,
  MapPin,
  Landmark,
  CreditCard,
  Package,
  FileText,
  Upload,
  ShieldCheck,
  ClipboardList,
  Trash2,
  Plus,
} from "lucide-react";
import FormSection from "./FormSection";
import FormField from "./FormInput";
import { ISupplier } from "../../.././../../../common/suppliers/ISuppliers.interface";
import { createSupplier, updateSupplier } from "@/hooks/useSupplier";

interface SupplierFormProps {
  editData?: ISupplier;
  onBack: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ editData, onBack }) => {
  const [documents, setDocuments] = useState<
    { id: number; file: File | null; existingUrl?: string }[]
  >([]);

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (editData?.complianceDocumentation?.businessRegistrationCertificates) {
      const existingDocs =
        editData.complianceDocumentation.businessRegistrationCertificates.map(
          (url, index) => ({
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
  }, [editData]);

  const addDocument = () =>
    setDocuments([...documents, { id: Date.now(), file: null }]);

  const removeDocument = (id: number) =>
    documents.length > 1 &&
    setDocuments(documents.filter((doc) => doc.id !== id));

  const handleTriggerUpload = (id: number) => {
    fileInputRefs.current[id]?.click();
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

  const [dropdowns, setDropdowns] = useState({
    businessTypes: [],
    jobTitles: [],
    cities: [],
    countries: [],
    currencies: [],
    paymentMethods: [],
    productServices: [],
    categories: [],
    paymentTerms: [],
    pricingAgreements: [],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDropdownData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const [
          bizRes,
          jobRes,
          cityRes,
          countryRes,
          currRes,
          methRes,
          servRes,
          catRes,
          termRes,
          priceRes,
        ] = await Promise.all([
          fetch(`${baseUrl}/business-types`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/job-titles`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/city`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/country`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/currencies`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/payment-method`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/product-services`, { headers }).then((r) =>
            r.json(),
          ),
          fetch(`${baseUrl}/categories`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/payment-terms`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/pricing-agreement`, { headers }).then((r) =>
            r.json(),
          ),
        ]);

        if (!isMounted) return;

        setDropdowns({
          businessTypes:
            bizRes.data?.map((i: any) => ({
              label: i.businessTypeName,
              value: i._id,
            })) || [],
          jobTitles:
            jobRes.data?.map((i: any) => ({
              label: i.jobTitleName || i.name,
              value: i._id,
            })) || [],
          cities:
            cityRes.data?.map((i: any) => ({
              label: i.cityName || i.name,
              value: i._id,
            })) || [],
          countries:
            countryRes.data?.map((i: any) => ({
              label: i.countryName || i.name,
              value: i._id,
            })) || [],
          currencies:
            currRes.data?.map((i: any) => ({
              label: `${i.currencyName} (${i.currencySymbol})`,
              value: i._id,
            })) || [],
          paymentMethods:
            methRes.data?.map((i: any) => ({
              label: i.paymentMethodName || i.name,
              value: i._id,
            })) || [],
          productServices:
            servRes.data?.map((i: any) => ({
              label: i.productServicesName || i.name,
              value: i._id,
            })) || [],
          categories:
            catRes.data?.map((i: any) => ({
              label: i.categoryName || i.name,
              value: i._id,
            })) || [],
          paymentTerms:
            termRes.data?.map((i: any) => ({
              label: i.paymentTerm || i.name,
              value: i._id,
            })) || [],
          pricingAgreements:
            priceRes.data?.map((i: any) => ({
              label: i.pricingAgreementName || i.name,
              value: i._id,
            })) || [],
        });
      } catch (err) {
        console.error("Error fetching supplier dropdowns:", err);
      }
    };

    fetchDropdownData();

    return () => {
      isMounted = false;
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    legalBusinessName: "",
    tradingName: "",
    businessRegNumber: "",
    taxRegNumber: "",
    businessTypeId: "",

    primaryContactName: "",
    jobTitleId: "",
    phoneNumber: "",
    emailAddress: "",
    website: "",

    registeredAddress: "",
    tradingAddress: "",
    cityId: "",
    stateCounty: "",
    postalCode: "",
    countryId: "",

    vatRegistered: "No",
    taxIdNumber: "",
    currencyId: "",
    paymentMethodId: "",

    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    sortCode: "",
    iban: "",
    swiftCode: "",

    productServiceId: "",
    categoryId: [],
    leadTime: "",
    moq: "",

    paymentTermId: "",
    pricingAgreementId: "",
    discountTerms: "",
    contractStartDate: "",
    contractEndDate: "",

    insuranceDetails: "",
    insuranceExpiryDate: "",
    hsCompliance: "No",
    qualityCertifications: "",

    orderContactName: "",
    orderContactEmail: "",
    returnsPolicy: "",
    warrantyTerms: "",
  });

  useEffect(() => {
    if (editData) {
      const data = editData as any;

      console.log("Edit data received in form:", data);

      const existingCertificates =
        data.complianceDocumentation?.businessRegistrationCertificates ||
        data.businessRegistrationCertificates ||
        [];

      setFormData({
        legalBusinessName: data.legalBusinessName || "",
        tradingName: data.tradingName || "",
        businessRegNumber: data.businessRegNumber || "",
        taxRegNumber: data.taxRegNumber || data.vat || "",
        businessTypeId: data.businessTypeId || "",

        primaryContactName: data.primaryContactName || "",
        jobTitleId: data.jobTitleId || "",
        phoneNumber: data.phoneNumber || "",
        emailAddress: data.emailAddress || "",
        website: data.website || "",

        registeredAddress: data.registeredAddress || data.businessAddress || "",
        tradingAddress: data.tradingAddress || "",
        cityId: data.cityId || "",
        stateCounty: data.stateCounty || "",
        postalCode: data.postalCode || "",
        countryId: data.countryId || "",

        vatRegistered:
          data.vatRegistered === true || data.vatRegistered === "Yes"
            ? "Yes"
            : "No",
        taxIdNumber: data.taxIdNumber || "",
        currencyId: data.currencyId || "",
        paymentMethodId: data.paymentMethodId || "",

        bankName: data.bankName || "",
        accountHolderName: data.accountHolderName || "",
        accountNumber: data.accountNumber || "",
        sortCode: data.sortCode || "",
        iban: data.iban || "",
        swiftCode: data.swiftCode || "",

        productServiceId: data.productServiceId || "",
        categoryId: data.categoryId || "",
        leadTime: data.leadTime?.toString() || "",
        moq: data.moq?.toString() || "",

        paymentTermId: data.paymentTermId || "",
        pricingAgreementId: data.pricingAgreementId || "",
        discountTerms: data.discountTerms || "",
        contractStartDate: data.contractStartDate || "",
        contractEndDate: data.contractEndDate || "",

        insuranceDetails: data.insuranceDetails || "",
        insuranceExpiryDate: data.insuranceExpiryDate || "",
        hsCompliance:
          data.hsCompliance === true || data.hsCompliance === "Yes"
            ? "Yes"
            : "No",
        qualityCertifications: data.qualityCertifications || "",

        orderContactName: data.orderContactName || "",
        orderContactEmail: data.orderContactEmail || "",
        returnsPolicy: data.returnsPolicy || "",
        warrantyTerms: data.warrantyTerms || "",
      });

      if (existingCertificates.length > 0) {
        const existingDocs = existingCertificates.map(
          (url: string, index: number) => ({
            id: index + 1,
            file: null,
            existingUrl: url,
          }),
        );
        setDocuments(existingDocs);
      }
    }
  }, [editData]);
  const handleChange = (e: any) => {
    const { name, type, value, selectedOptions } = e.target;

    if (name === "categoryId" || type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt: any) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
      return; // Exit early
    }

    if (name === "website") {
      const cleanedValue = value.replace(/^https?:\/\//, "").replace(/\/$/, "");
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const payload: any = {
        userId: currentUserId,
        updatedAt: new Date().toISOString(),
        isDeleted: false,

        supplierIdentification: {
          legalBusinessName: formData.legalBusinessName.trim(),
          tradingName: formData.tradingName?.trim() || undefined,
          businessRegNumber: formData.businessRegNumber.trim(),
          vat: formData.taxRegNumber?.trim() || undefined,
          businessTypeId: formData.businessTypeId,
        },

        contactInformation: {
          primaryContactName: formData.primaryContactName.trim(),
          jobTitleId: formData.jobTitleId,
          phoneNumber: formData.phoneNumber.trim(),
          emailAddress: formData.emailAddress.trim(),
          website: formData.website?.trim()
            ? formData.website.startsWith("http")
              ? formData.website.trim()
              : `https://${formData.website.trim()}`
            : undefined,
        },

        businessAddress: {
          businessAddress: formData.registeredAddress.trim(),
          tradingAddress: formData.tradingAddress?.trim() || undefined,
          city: formData.cityId,
          state: formData.stateCounty.trim(),
          country: formData.countryId,
          zipCode: formData.postalCode.trim(),
        },

        financialInformation: {
          vatRegistered: formData.vatRegistered === "Yes",
          vatNumber: formData.taxRegNumber?.trim() || undefined,
          taxIdentificationNumber: formData.taxIdNumber.trim(),
          paymentCurrencyId: formData.currencyId,
          paymentMethodId: formData.paymentMethodId,
        },

        bankPaymentDetails: formData.bankName?.trim()
          ? {
              bankName: formData.bankName.trim(),
              accountHolderName: formData.accountHolderName.trim(),
              accountNumber: formData.accountNumber.trim(),
              sortCode: formData.sortCode?.trim() || undefined,
              ibanNumber: formData.iban?.trim() || undefined,
              swiftCode: formData.swiftCode?.trim() || undefined,
            }
          : undefined,

        productServices: {
          typeOfServiceId: formData.productServiceId,
          productCategoryIds: Array.isArray(formData.categoryId)
            ? formData.categoryId
            : formData.categoryId
              ? [formData.categoryId]
              : [],
          leadTimes: formData.leadTime,
          minimumOrderQuantity: formData.moq,
        },

        commercialTerms: {
          paymentTermsId: formData.paymentTermId,
          pricingAgreementId: formData.pricingAgreementId,
          discountTerms: formData.discountTerms?.trim() || undefined,
          contractStartDate: formData.contractStartDate,
          contractEndDate: formData.contractEndDate || undefined,
        },

        complianceDocumentation: {
          businessRegistrationCertificates: documents
            .filter((doc) => doc.existingUrl || doc.file)
            .map((doc) => doc.existingUrl || ""),
          insuranceDetails: formData.insuranceDetails?.trim() || undefined,
          insuranceExpiryDate: formData.insuranceExpiryDate || undefined,
          healthAndSafetyCompliance:
            formData.hsCompliance === "Yes"
              ? true
              : formData.hsCompliance === "No"
                ? false
                : undefined,
          qualityCertificate:
            formData.qualityCertifications?.trim() || undefined,
        },

        operationalInformation: {
          orderContactName: formData.orderContactName?.trim() || undefined,
          orderContactEmail: formData.orderContactEmail?.trim() || undefined,
          returnPolicy: formData.returnsPolicy?.trim() || undefined,
          warrantyTerms: formData.warrantyTerms?.trim() || undefined,
        },
      };

      if (editData?._id) {
        payload._id = editData._id;
      } else {
        payload.createdAt = new Date().toISOString();
        payload.createdBy = currentUserId;
      }

      console.log("Final payload structure:");
      console.log(
        "vatRegistered type:",
        typeof payload.financialInformation.vatRegistered,
      );
      console.log(
        "vatRegistered value:",
        payload.financialInformation.vatRegistered,
      );
      console.log(
        "healthAndSafetyCompliance type:",
        typeof payload.complianceDocumentation.healthAndSafetyCompliance,
      );
      console.log(
        "healthAndSafetyCompliance value:",
        payload.complianceDocumentation.healthAndSafetyCompliance,
      );
      console.log("City ID:", payload.businessAddress.city);
      console.log("Country ID:", payload.businessAddress.country);
      console.log("Full payload:", JSON.stringify(payload, null, 2));

      const hasFiles = documents.some((doc) => doc.file);

      if (hasFiles) {
        console.log("Has files, sending as FormData");

        const formDataToSend = new FormData();

        formDataToSend.append("data", JSON.stringify(payload));

        documents.forEach((doc) => {
          if (doc.file) {
            formDataToSend.append("businessRegistrationCertificates", doc.file);
          }
        });

        if (editData?._id) {
          const existingUrls = documents
            .filter((doc) => doc.existingUrl && !doc.file)
            .map((doc) => doc.existingUrl) as string[];

          if (existingUrls.length > 0) {
            formDataToSend.append(
              "existingFiles",
              JSON.stringify(existingUrls),
            );
          }
        }

        console.log("FormData entries:");
        for (let [key, value] of (formDataToSend as any).entries()) {
          console.log(
            key,
            value instanceof File ? `File: ${value.name}` : value,
          );
        }
        if (editData?._id) {
          await updateSupplier(editData._id, formDataToSend);
        } else {
          await createSupplier(formDataToSend);
        }
      } else {
        console.log("No files, sending as plain JSON");

        if (editData?._id) {
          await updateSupplier(editData._id, payload);
        } else {
          await createSupplier(payload);
        }
      }

      alert(
        editData
          ? "Supplier updated successfully!"
          : "Supplier created successfully!",
      );
      onBack();
    } catch (err: any) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);

      let errorMessage = `Failed to ${editData ? "update" : "create"} supplier.\n\n`;

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          const match = err.response.data.match(/<pre>([\s\S]*?)<\/pre>/);
          if (match) {
            errorMessage += match[1].replace(/<br\s*\/?>/g, "\n");
          } else {
            errorMessage += err.response.data;
          }
        } else if (err.response.data.message) {
          if (Array.isArray(err.response.data.message)) {
            errorMessage +=
              "Validation errors:\n" +
              err.response.data.message
                .map((err: any) => `• ${err.message || JSON.stringify(err)}`)
                .join("\n");
          } else if (typeof err.response.data.message === "string") {
            try {
              const parsed = JSON.parse(err.response.data.message);
              if (Array.isArray(parsed)) {
                errorMessage +=
                  "Validation errors:\n" +
                  parsed
                    .map(
                      (err: any) => `• ${err.message || JSON.stringify(err)}`,
                    )
                    .join("\n");
              } else {
                errorMessage += err.response.data.message;
              }
            } catch {
              errorMessage += err.response.data.message;
            }
          } else {
            errorMessage += JSON.stringify(err.response.data, null, 2);
          }
        }
      } else if (err.message) {
        errorMessage += err.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
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
    return "PDF, JPG or PNG (Max. 5MB)";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-h-screen bg-[#fcfcfd] pb-20"
    >
      <div className="relative w-full bg-linear-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] p-6 md:p-8 text-white shadow-xl mb-8">
        <div className="max-w-[1600px] mx-auto flex items-center gap-5">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 bg-white/20 rounded-xl hover:bg-white/30 transition-all backdrop-blur-md border border-white/20 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Building2 size={24} />
              </div>
              {editData ? "Update Supplier" : "Add New Supplier"}
            </h1>
            <p className="opacity-80 text-xs md:text-sm font-medium mt-0.5">
              Complete all required fields to {editData ? "update" : "register"}{" "}
              a supplier
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-8">
        {/* Form sections remain the same */}
        <FormSection
          number={1}
          title="Supplier Identification"
          icon={Building2}
          theme="blue"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <FormField
              label="Legal Business Name *"
              name="legalBusinessName"
              value={formData.legalBusinessName}
              onChange={handleChange}
              placeholder="Enter legal name"
              className="md:col-span-2"
              required
            />
            <FormField
              label="Trading Name (if different)"
              name="tradingName"
              value={formData.tradingName}
              onChange={handleChange}
              placeholder="Enter trading name"
            />
            <FormField
              label="Business Registration Number *"
              name="businessRegNumber"
              value={formData.businessRegNumber}
              onChange={handleChange}
              placeholder="e.g. CRN-123456"
              required
            />
            <FormField
              label="VAT / Tax Registration Number"
              name="taxRegNumber"
              value={formData.taxRegNumber}
              onChange={handleChange}
              placeholder="e.g. VAT-7890"
            />
            <FormField
              label="Business Type *"
              name="businessTypeId"
              type="select"
              value={formData.businessTypeId}
              onChange={handleChange}
              options={dropdowns.businessTypes}
              required
            />
          </div>
        </FormSection>

        <FormSection
          number={2}
          title="Contact Information"
          icon={User}
          theme="purple"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <FormField
              label="Primary Contact Name *"
              name="primaryContactName"
              value={formData.primaryContactName}
              onChange={handleChange}
              placeholder="John Smith"
              required
            />
            <FormField
              label="Job Title *"
              name="jobTitleId"
              type="select"
              value={formData.jobTitleId}
              onChange={handleChange}
              options={dropdowns.jobTitles}
              required
            />
            <FormField
              label="Phone Number *"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+44 20 1234 5678"
              required
            />
            <FormField
              label="Email Address *"
              name="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="email@company.com"
              required
            />
            <FormField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.website.com"
              className="md:col-span-2"
            />
          </div>
        </FormSection>

        <FormSection
          number={3}
          title="Business Address"
          icon={MapPin}
          theme="green"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <FormField
              label="Registered Address *"
              name="registeredAddress"
              value={formData.registeredAddress}
              onChange={handleChange}
              placeholder="Street name"
              className="md:col-span-2"
              required
            />
            <FormField
              label="Trading Address (if different)"
              name="tradingAddress"
              value={formData.tradingAddress}
              onChange={handleChange}
              placeholder="Secondary location"
              className="md:col-span-2"
            />
            <FormField
              label="City *"
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              placeholder="e.g. London"
              required
            />
            <FormField
              label="State / County *"
              name="stateCounty"
              value={formData.stateCounty}
              onChange={handleChange}
              placeholder="e.g. Greater London"
              required
            />
            <FormField
              label="Postal / ZIP Code *"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="e.g. EC1A 1BB"
              required
            />
            <FormField
              label="Country *"
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              placeholder="e.g. United Kingdom"
              required
            />
          </div>
        </FormSection>

        <FormSection
          number={4}
          title="Financial & Tax Information"
          icon={Landmark}
          theme="orange"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="space-y-3">
              <label className="field-label">VAT Registered</label>
              <div className="flex gap-6 mt-1">
                {["Yes", "No"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 cursor-pointer font-bold text-slate-600 text-sm"
                  >
                    <input
                      type="radio"
                      name="vatRegistered"
                      value={opt}
                      checked={formData.vatRegistered === opt}
                      onChange={handleChange}
                      className="w-4 h-4 accent-orange-500"
                    />{" "}
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <FormField
              label="VAT Number"
              name="taxRegNumber"
              value={formData.taxRegNumber}
              onChange={handleChange}
              placeholder="Enter VAT if applicable"
              disabled={formData.vatRegistered === "No"}
            />
            <FormField
              label="Tax Identification Number *"
              name="taxIdNumber"
              value={formData.taxIdNumber}
              onChange={handleChange}
              placeholder="Enter TIN"
              required
            />
            <FormField
              label="Payment Currency *"
              name="currencyId"
              type="select"
              value={formData.currencyId}
              onChange={handleChange}
              options={dropdowns.currencies}
              required
            />
            <FormField
              label="Preferred Payment Method *"
              name="paymentMethodId"
              type="select"
              value={formData.paymentMethodId}
              onChange={handleChange}
              options={dropdowns.paymentMethods}
              className="md:col-span-2"
              required
            />
          </div>
        </FormSection>

        <FormSection
          number={5}
          title="Bank / Payment Details"
          icon={CreditCard}
          theme="red"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <FormField
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="Enter bank name"
            />
            <FormField
              label="Account Holder Name"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder="Full name on account"
            />
            <FormField
              label="Account Number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
            />
            <FormField
              label="Sort Code / Routing Number"
              name="sortCode"
              value={formData.sortCode}
              onChange={handleChange}
              placeholder="00-00-00"
            />
            <FormField
              label="IBAN"
              name="iban"
              value={formData.iban}
              onChange={handleChange}
              placeholder="GB00 XXXX ..."
            />
            <FormField
              label="SWIFT / BIC Code"
              name="swiftCode"
              value={formData.swiftCode}
              onChange={handleChange}
              placeholder="BIC Code"
            />
          </div>
        </FormSection>

        <FormSection
          number={6}
          title="Products / Services Supplied"
          icon={Package}
          theme="indigo"
        >
          <div className="space-y-6">
            <FormField
              label="Type of Products or Services *"
              name="productServiceId"
              type="select"
              value={formData.productServiceId}
              onChange={handleChange}
              options={dropdowns.productServices}
              required
            />
            <FormField
              label="Product Categories *"
              name="categoryId"
              type="select"
              multiple={true}
              value={formData.categoryId}
              onChange={handleChange}
              options={dropdowns.categories}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <FormField
                label="Lead Time (days) *"
                name="leadTime"
                type="number"
                value={formData.leadTime}
                onChange={handleChange}
                placeholder="5"
                required
              />
              <FormField
                type="number"
                label="Minimum Order Quantity"
                name="moq"
                value={formData.moq}
                onChange={handleChange}
                placeholder="MOQ"
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          number={7}
          title="Commercial Terms"
          icon={FileText}
          theme="sky"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <FormField
              label="Payment Terms *"
              name="paymentTermId"
              type="select"
              value={formData.paymentTermId}
              onChange={handleChange}
              options={dropdowns.paymentTerms}
              required
            />
            <FormField
              label="Pricing Agreement *"
              name="pricingAgreementId"
              type="select"
              value={formData.pricingAgreementId}
              onChange={handleChange}
              options={dropdowns.pricingAgreements}
              required
            />
            <FormField
              label="Discount Terms"
              name="discountTerms"
              value={formData.discountTerms}
              onChange={handleChange}
              placeholder="Volume based discount"
              className="md:col-span-2"
            />
            <FormField
              label="Contract Start Date *"
              name="contractStartDate"
              type="date"
              value={formData.contractStartDate}
              onChange={handleChange}
              required
            />
            <FormField
              label="Contract End Date"
              name="contractEndDate"
              type="date"
              value={formData.contractEndDate}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        <FormSection
          number={8}
          title="Compliance & Documentation"
          icon={ShieldCheck}
          theme="teal"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div
                  key={doc.id}
                  className="p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl border border-slate-200 shadow-sm ${doc.file || doc.existingUrl ? "bg-teal-500 text-white" : "bg-white text-teal-600"}`}
                      >
                        <Upload size={20} />
                      </div>
                      <div>
                        <label className="field-label ml-0!">
                          {index === 0
                            ? "Business Registration Certificate"
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
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addDocument}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-teal-600 bg-white rounded-xl hover:bg-teal-50 border border-dashed border-teal-200 w-full justify-center mt-2"
              >
                <Plus size={16} /> Add Another Document Requirement
              </button>
            </div>
            <div className="h-px bg-slate-100 w-full my-4" />
            <FormField
              label="Insurance Details"
              name="insuranceDetails"
              value={formData.insuranceDetails}
              onChange={handleChange}
              placeholder="Public Liability, etc."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <FormField
                label="Insurance Expiry Date"
                name="insuranceExpiryDate"
                type="date"
                value={formData.insuranceExpiryDate}
                onChange={handleChange}
              />
              <div className="space-y-3">
                <label className="field-label">
                  Health & Safety Compliance
                </label>
                <div className="flex items-center gap-8 h-[50px]">
                  {["Yes", "No"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="hsCompliance"
                        value={opt}
                        checked={formData.hsCompliance === opt}
                        onChange={handleChange}
                        className="w-4 h-4 accent-teal-600"
                      />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-teal-700 transition-colors">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <FormField
              label="Quality Certifications (ISO, etc.)"
              name="qualityCertifications"
              value={formData.qualityCertifications}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        {/* Operational Information Section */}
        <FormSection
          number={9}
          title="Operational Information"
          icon={ClipboardList}
          theme="rose"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <FormField
                label="Order Contact Name"
                name="orderContactName"
                value={formData.orderContactName}
                onChange={handleChange}
              />
              <FormField
                label="Order Contact Email"
                name="orderContactEmail"
                type="email"
                value={formData.orderContactEmail}
                onChange={handleChange}
              />
            </div>
            <FormField
              label="Returns Policy"
              name="returnsPolicy"
              type="textarea"
              value={formData.returnsPolicy}
              onChange={handleChange}
              placeholder="Enter details..."
            />
            <FormField
              label="Warranty Terms"
              name="warrantyTerms"
              type="textarea"
              value={formData.warrantyTerms}
              onChange={handleChange}
              placeholder="Enter details..."
            />
          </div>
        </FormSection>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 mt-8 pb-10">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 rounded-xl font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all text-sm active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting
              ? "Processing..."
              : editData
                ? "Update Supplier"
                : "Add Supplier"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-left: 4px;
          margin-bottom: 6px;
        }
        .form-input-style {
          width: 100%;
          padding: 14px 20px;
          border-radius: 14px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          outline: none;
          transition: all 0.2s;
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
        }
        .form-input-style:focus {
          background-color: white;
          border-color: #a855f7;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.08);
        }
        .form-input-style::placeholder {
          color: #cbd5e1;
        }
        .form-input-style:disabled {
          background-color: #f1f5f9;
          color: #94a3b8;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
};

export default SupplierForm;
