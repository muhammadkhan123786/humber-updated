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
  Users,
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

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf">("image");

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

  const handlePreviewDocument = (doc: {
    file: File | null;
    existingUrl?: string;
  }) => {
    let urlToPreview = "";
    if (doc.file) {
      urlToPreview = URL.createObjectURL(doc.file);
    } else if (doc.existingUrl) {
      // Handle both relative and absolute URLs
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
          fetch(`${baseUrl}/business-types?filter=all`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/job-titles?filter=all`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/city?filter=all`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/country?filter=all`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/currencies?filter=all`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/payment-method?filter=all`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/product-services?filter=all`, { headers }).then((r) =>
            r.json(),
          ),
          fetch(`${baseUrl}/categories?filter=all`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/payment-terms?filter=all`, { headers }).then((r) => r.json()),
          fetch(`${baseUrl}/pricing-agreement?filter=all`, { headers }).then((r) =>
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

      // Build proper JSON payload with correct types for booleans and arrays
      const payload: any = {
        userId: currentUserId,
        updatedAt: new Date().toISOString(),
        isDeleted: false, // Already boolean
        supplierIdentification: {
          legalBusinessName: formData.legalBusinessName.trim(),
          businessRegNumber: formData.businessRegNumber.trim(),
          businessTypeId: formData.businessTypeId,
        },
        contactInformation: {
          primaryContactName: formData.primaryContactName.trim(),
          jobTitleId: formData.jobTitleId,
          phoneNumber: formData.phoneNumber.trim(),
          emailAddress: formData.emailAddress.trim(),
        },
        businessAddress: {
          businessAddress: formData.registeredAddress.trim(),
          city: formData.cityId,
          state: formData.stateCounty.trim(),
          country: formData.countryId,
          zipCode: formData.postalCode.trim(),
        },
        financialInformation: {
          vatRegistered: formData.vatRegistered === "Yes", // Boolean
          taxIdentificationNumber: formData.taxIdNumber.trim(),
          paymentCurrencyId: formData.currencyId,
          paymentMethodId: formData.paymentMethodId,
        },
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
          contractStartDate: formData.contractStartDate,
        },
        complianceDocumentation: {
          businessRegistrationCertificates: documents
            .filter((doc) => doc.existingUrl && !doc.file)
            .map((doc) => doc.existingUrl) as string[],
          healthAndSafetyCompliance: formData.hsCompliance === "Yes", // Boolean
        },
        operationalInformation: {},
      };

      // Add optional fields
      if (formData.tradingName?.trim()) {
        payload.supplierIdentification.tradingName =
          formData.tradingName.trim();
      }
      if (formData.taxRegNumber?.trim()) {
        payload.supplierIdentification.vat = formData.taxRegNumber.trim();
        payload.financialInformation.vatNumber = formData.taxRegNumber.trim();
      }
      if (formData.website?.trim()) {
        const website = formData.website.startsWith("http")
          ? formData.website.trim()
          : `https://${formData.website.trim()}`;
        payload.contactInformation.website = website;
      }
      if (formData.tradingAddress?.trim()) {
        payload.businessAddress.tradingAddress = formData.tradingAddress.trim();
      }
      if (formData.bankName?.trim()) {
        payload.bankPaymentDetails = {
          bankName: formData.bankName.trim(),
          accountHolderName: formData.accountHolderName.trim(),
          accountNumber: formData.accountNumber.trim(),
        };
        if (formData.sortCode?.trim()) {
          payload.bankPaymentDetails.sortCode = formData.sortCode.trim();
        }
        if (formData.iban?.trim()) {
          payload.bankPaymentDetails.ibanNumber = formData.iban.trim();
        }
        if (formData.swiftCode?.trim()) {
          payload.bankPaymentDetails.swiftCode = formData.swiftCode.trim();
        }
      }
      if (formData.discountTerms?.trim()) {
        payload.commercialTerms.discountTerms = formData.discountTerms.trim();
      }
      if (formData.contractEndDate) {
        payload.commercialTerms.contractEndDate = formData.contractEndDate;
      }
      if (formData.insuranceDetails?.trim()) {
        payload.complianceDocumentation.insuranceDetails =
          formData.insuranceDetails.trim();
      }
      if (formData.insuranceExpiryDate) {
        payload.complianceDocumentation.insuranceExpiryDate =
          formData.insuranceExpiryDate;
      }
      if (formData.qualityCertifications?.trim()) {
        payload.complianceDocumentation.qualityCertificate =
          formData.qualityCertifications.trim();
      }
      if (formData.orderContactName?.trim()) {
        payload.operationalInformation.orderContactName =
          formData.orderContactName.trim();
      }
      if (formData.orderContactEmail?.trim()) {
        payload.operationalInformation.orderContactEmail =
          formData.orderContactEmail.trim();
      }
      if (formData.returnsPolicy?.trim()) {
        payload.operationalInformation.returnPolicy =
          formData.returnsPolicy.trim();
      }
      if (formData.warrantyTerms?.trim()) {
        payload.operationalInformation.warrantyTerms =
          formData.warrantyTerms.trim();
      }

      if (editData?._id) {
        payload._id = editData._id;
      } else {
        payload.createdAt = new Date().toISOString();
        payload.createdBy = currentUserId;
      }

      console.log("Payload to send:", JSON.stringify(payload, null, 2));

      const formDataToSend = new FormData();

      // Helper function to append nested objects to FormData WITH proper boolean handling
      const appendToFormData = (obj: any, prefix = "") => {
        for (const [key, value] of Object.entries(obj)) {
          const fieldName = prefix ? `${prefix}[${key}]` : key;

          if (value === null || value === undefined) {
            continue;
          }

          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              // Handle array items properly
              if (typeof item === "boolean") {
                formDataToSend.append(
                  `${fieldName}[${index}]`,
                  item ? "true" : "false",
                );
              } else if (typeof item === "object" && item !== null) {
                // If array contains objects, stringify them
                formDataToSend.append(
                  `${fieldName}[${index}]`,
                  JSON.stringify(item),
                );
              } else {
                formDataToSend.append(`${fieldName}[${index}]`, String(item));
              }
            });
          } else if (typeof value === "object" && !(value instanceof File)) {
            appendToFormData(value, fieldName);
          } else if (typeof value === "boolean") {
            // Handle booleans - send as "true"/"false" strings
            formDataToSend.append(fieldName, value ? "true" : "false");
          } else {
            formDataToSend.append(fieldName, String(value));
          }
        }
      };

      // Append all payload fields
      appendToFormData(payload);

      const hasFiles = documents.some((doc) => doc.file);
      if (hasFiles) {
        documents.forEach((doc) => {
          if (doc.file) {
            console.log(`Appending file: ${doc.file.name}`);
            formDataToSend.append(
              "businessRegistrationCertificatesFile",
              doc.file,
            );
          }
        });
      }

      console.log("FormData entries:");
      for (const [key, value] of (formDataToSend as any).entries()) {
        if (value instanceof File) {
          console.log(
            key,
            `File: ${value.name} (${value.type}, ${value.size} bytes)`,
          );
        } else {
          console.log(key, value);
        }
      }

      if (editData?._id) {
        await updateSupplier(editData._id, formDataToSend);
      } else {
        await createSupplier(formDataToSend);
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
          errorMessage += err.response.data;
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
      className="w-full min-h-screen pb-20"
    >
      <div className="self-stretch h-32 pl-8 pt-8 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl flex flex-col justify-start items-start mb-8">
        <div className="flex items-center gap-5">

          {/* Back Button - matching the Figma 'w-9 h-9' logic */}
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex justify-center items-center  rounded-[10px] hover:bg-white/20 transition-all backdrop-blur-md  group"
          >
            <ArrowLeft
              size={20}
              className="text-white group-hover:-translate-x-1 transition-transform"
            />
          </button>

          <div className="relative flex justify-center items-center h-20 w-20">
            {/* Wrap both elements in this spinning container */}
            <div className="flex justify-center items-center animate-[spin_13s_linear_infinite]">

              {/* Background Glass - Now locked to the icon */}
              <div className="absolute w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/10 rotate-[59.56deg]" />

              {/* The Icon - Now spinning with the background */}
              <div className="relative z-10">
                <Building2 size={36} className="text-white" />
              </div>

            </div>
          </div>
          {/* Text Content */}
          <div className="flex flex-col justify-start items-start gap-1">
            <h1 className="text-white text-4xl font-bold font-sans leading-10 drop-shadow-md">
              {editData ? "Update Supplier" : "Add New Supplier"}
            </h1>
            <p className="text-white/90 text-lg font-normal font-sans leading-7">
              Complete all required fields to {editData ? "update" : "register"} a new supplier
            </p>
          </div>

        </div>
      </div>

      <div className="max-w-[1600px]  mx-auto space-y-8">
        {/* Form sections remain the same */}
        <FormSection
          number={1}
          title="Supplier Identification"
          icon={Building2}
          theme="blue"
          headerClassName="bg-linear-to-r from-blue-50 to-indigo-50" // Different bg for every section
          iconClassName="text-blue-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2  gap-x-4 gap-y-4 ">
            <FormField
              label="Legal Business Name *"
              name="legalBusinessName"
              value={formData.legalBusinessName}
              onChange={handleChange}
              className="md:col-span-2"
              required
            />
            <FormField
              label="Trading Name (if different)"
              name="tradingName"
              value={formData.tradingName}
              onChange={handleChange}
            />
            <FormField
              label="Business Registration Number *"
              name="businessRegNumber"
              value={formData.businessRegNumber}
              onChange={handleChange}
              required
            />
            <FormField
              label="VAT / Tax Registration Number"
              name="taxRegNumber"
              value={formData.taxRegNumber}
              onChange={handleChange}

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
          icon={Users}
          theme="purple"
          headerClassName="bg-linear-to-r from-purple-50 to-pink-50" // Different bg for every section
          iconClassName="text-purple-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            <FormField
              label="Primary Contact Name *"
              name="primaryContactName"
              value={formData.primaryContactName}
              onChange={handleChange}
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
              required
            />
            <FormField
              label="Email Address *"
              name="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              required
            />
            <FormField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="md:col-span-2"
            />
          </div>
        </FormSection>

        <FormSection
          number={3}
          title="Business Address"
          icon={MapPin}
          theme="green"
          headerClassName="bg-linear-to-r from-green-50 to-emerald-50" // Different bg for every section
          iconClassName="text-green-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            <FormField
              label="Registered Address *"
              name="registeredAddress"
              value={formData.registeredAddress}
              onChange={handleChange}
              className="md:col-span-2"
              required
            />
            <FormField
              label="Trading Address (if different)"
              name="tradingAddress"
              value={formData.tradingAddress}
              onChange={handleChange}
              className="md:col-span-2"
            />
            <FormField
              label="City *"
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              required
            />
            <FormField
              label="State / County *"
              name="stateCounty"
              value={formData.stateCounty}
              onChange={handleChange}
              required
            />
            <FormField
              label="Postal / ZIP Code *"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
            <FormField
              label="Country *"
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              required
            />
          </div>
        </FormSection>

        <FormSection
          number={4}
          title="Financial & Tax Information"
          icon={Landmark}
          theme="orange"
          headerClassName="bg-linear-to-r from-orange-50 to-amber-50"
          iconClassName="text-orange-600"

        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">VAT Registered</label>
              <div className="flex gap-4 mt-2">
                {["Yes", "No"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <input
                      type="radio"
                      name="vatRegistered"
                      value={opt}
                      checked={formData.vatRegistered === opt}
                      onChange={handleChange}
                      className="w-4 h-4 accent-blue-500"
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
              disabled={formData.vatRegistered === "No"}
            />
            <FormField
              label="Tax Identification Number *"
              name="taxIdNumber"
              value={formData.taxIdNumber}
              onChange={handleChange}
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
              className="md:col-span-2  
             [&_select]:bg-transparent! [&_input]:bg-transparent! 
             [&_select]:border [&_select]:border-gray-300 
             [&_select]:focus:outline-none [&_select]:focus:ring-2 [&_select]:focus:ring-orange-500
             [&_input]:border [&_input]:border-gray-300 
             [&_input]:focus:outline-none [&_input]:focus:ring-2 [&_input]:focus:ring-orange-500"
              required
            />
          </div>
        </FormSection>

        <FormSection
          number={5}
          title="Bank / Payment Details"
          icon={CreditCard}
          theme="red"
          headerClassName="bg-linear-to-r from-red-50 to-rose-50"
          iconClassName="text-red-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            <FormField
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
            />
            <FormField
              label="Account Holder Name"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
            />
            <FormField
              label="Account Number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
            />
            <FormField
              label="Sort Code / Routing Number"
              name="sortCode"
              value={formData.sortCode}
              onChange={handleChange}
            />
            <FormField
              label="IBAN"
              name="iban"
              value={formData.iban}
              onChange={handleChange}
            />
            <FormField
              label="SWIFT / BIC Code"
              name="swiftCode"
              value={formData.swiftCode}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        <FormSection
          number={6}
          title="Products / Services Supplied"
          icon={Package}
          theme="indigo"
          headerClassName="bg-linear-to-r from-indigo-50 to-purple-50"
          iconClassName="text-indigo-600"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
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
          headerClassName="bg-linear-to-r from-cyan-50 to-blue-50"
          iconClassName="text-cyan-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
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
              min={formData.contractStartDate}
            />
          </div>
        </FormSection>

        <FormSection
          number={8}
          title="Compliance & Documentation"
          icon={ShieldCheck}
          theme="teal"
          headerClassName="bg-linear-to-r from-teal-50 to-green-50"
          iconClassName="text-teal-600"
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
              type="textarea"
              value={formData.insuranceDetails}
              onChange={handleChange}
              placeholder="Public Liability,Professional Indemnity, etc."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
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
          headerClassName="bg-linear-to-r from-pink-50 to-rose-50"
          iconClassName="text-pink-600"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
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
            />
            <FormField
              label="Warranty Terms"
              name="warrantyTerms"
              type="textarea"
              value={formData.warrantyTerms}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        {/* Form Actions */}
        {/* Form Actions Container */}
        <div className="self-stretch h-20 pr-6 pt-6 bg-white rounded-2xl shadow-lg shadow-black/5 flex justify-end items-start gap-4 mt-8 pb-10">

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-20 h-9 px-4 py-2 bg-slate-50 rounded-[10px]   outline-1 outline-indigo-600/10 hover:bg-[#10b981] hover:text-white transition-all text-center text-indigo-950 text-sm font-medium font-sans leading-5"
          >
            Cancel
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-w-28 h-9 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 rounded-[10px] hover:opacity-90 transition-all disabled:opacity-50 active:scale-[0.98] flex justify-center items-center gap-2 shadow-md shadow-indigo-200"
          >
            <span className="text-center text-white text-sm font-normal font-sans leading-5">
              {isSubmitting
                ? "Processing..."
                : editData
                  ? "Update Supplier"
                  : "Add Supplier"}
            </span>
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

      {/* Document Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Document Preview
              </h2>
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  // Clean up blob URLs
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

            {/* Content */}
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

            {/* Footer */}
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
    </form>
  );
};

export default SupplierForm;
