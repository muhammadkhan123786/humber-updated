"use client";

import React, { useRef, useState } from "react";
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

interface SupplierFormProps {
  editData?: any;
  onBack: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ editData, onBack }) => {
  const [documents, setDocuments] = useState([
    { id: 1, file: null as File | null },
  ]);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
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
          doc.id === id ? { ...doc, file: selectedFile } : doc,
        ),
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] pb-20">
      <div className="relative w-full bg-linear-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] p-6 md:p-8 text-white shadow-xl mb-8">
        <div className="max-w-[1600px] mx-auto flex items-center gap-5">
          <button
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
              {editData ? " Update Supplier " : " Add New Supplier"}
            </h1>
            <p className="opacity-80 text-xs md:text-sm font-medium mt-0.5">
              Complete all required fields to {editData ? "update" : "register"}{" "}
              a supplier
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-8">
        <FormSection
          number={1}
          title="Supplier Identification"
          icon={Building2}
          theme="blue"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <FormField
              label="Legal Business Name *"
              placeholder="Enter legal name"
              className="md:col-span-2"
            />
            <FormField
              label="Trading Name (if different)"
              placeholder="Enter trading name"
            />
            <FormField
              label="Business Registration Number *"
              placeholder="e.g. CRN-123456"
            />
            <FormField
              label="VAT / Tax Registration Number"
              placeholder="e.g. VAT-7890"
            />
            <FormField
              label="Business Type *"
              type="select"
              options={["Limited Company", "Sole Trader", "Partnership"]}
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
              placeholder="John Smith"
            />
            <FormField label="Job Title *" placeholder="Manager" />
            <FormField label="Phone Number *" placeholder="+44 20 1234 5678" />
            <FormField
              label="Email Address *"
              type="email"
              placeholder="email@company.com"
            />
            <FormField
              label="Website"
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
              placeholder="Street name"
              className="md:col-span-2"
            />
            <FormField
              label="Trading Address (if different)"
              placeholder="Secondary location"
              className="md:col-span-2"
            />
            <FormField label="City *" placeholder="e.g. London" />
            <FormField
              label="State / County *"
              placeholder="e.g. Greater London"
            />
            <FormField
              label="Postal / ZIP Code *"
              placeholder="e.g. EC1A 1BB"
            />
            <FormField label="Country *" placeholder="United Kingdom" />
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
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600 text-sm">
                  <input
                    type="radio"
                    name="vat"
                    className="w-4 h-4 accent-orange-500"
                  />{" "}
                  Yes
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600 text-sm">
                  <input
                    type="radio"
                    name="vat"
                    defaultChecked
                    className="w-4 h-4 accent-orange-500"
                  />{" "}
                  No
                </label>
              </div>
            </div>
            <FormField
              label="VAT Number"
              placeholder="Enter VAT if applicable"
            />
            <FormField
              label="Tax Identification Number"
              placeholder="Enter TIN"
            />
            <FormField label="Payment Currency *" defaultValue="GBP" />
            <FormField
              label="Preferred Payment Method *"
              type="select"
              options={["Bank Transfer", "Credit Card", "PayPal", "Net 30"]}
              className="md:col-span-2"
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
            <FormField label="Bank Name *" placeholder="Enter bank name" />
            <FormField
              label="Account Holder Name *"
              placeholder="Full name on account"
            />
            <FormField
              label="Account Number *"
              placeholder="Enter account number"
            />
            <FormField
              label="Sort Code / Routing Number *"
              placeholder="00-00-00"
            />
            <FormField
              label="IBAN (for international payments)"
              placeholder="GB00 XXXX ..."
            />
            <FormField label="SWIFT / BIC Code" placeholder="BIC Code" />
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
              placeholder="e.g. Spare Parts"
            />
            <FormField
              label="Product Categories *"
              placeholder="Select categories"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <FormField
                label="Lead Time (days) *"
                type="number"
                placeholder="5"
              />
              <FormField label="Minimum Order Quantity" placeholder="MOQ" />
            </div>
            <FormField
              label="Service Coverage Area"
              placeholder="Nationwide / Regional"
            />
          </div>
        </FormSection>

        <FormSection
          number={7}
          title="Commercial Terms"
          icon={FileText}
          theme="sky"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <FormField label="Payment Terms *" placeholder="e.g. Net 30" />
            <FormField
              label="Pricing Agreement *"
              type="select"
              options={["Fixed", "Variable"]}
            />
            <FormField
              label="Discount Terms"
              placeholder="Volume based discount"
              className="md:col-span-2"
            />
            <FormField label="Contract Start Date *" type="date" />
            <FormField label="Contract End Date" type="date" />
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
                  className="p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl border border-slate-200 shadow-sm transition-colors ${
                          doc.file
                            ? "bg-teal-500 text-white"
                            : "bg-white text-teal-600"
                        }`}
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
                          {doc.file
                            ? `Selected: ${doc.file.name}`
                            : "PDF, JPG or PNG (Max. 5MB)"}
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
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                      >
                        {doc.file ? "Change File" : "Choose File"}
                      </button>

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          className="p-2.5 bg-rose-50 rounded-lg hover:bg-rose-100 text-rose-500 transition-colors border border-rose-100"
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
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-teal-600 bg-white rounded-xl hover:bg-teal-50 transition-all border border-dashed border-teal-200 w-full justify-center mt-2"
              >
                <Plus size={16} />
                Add Another Document Requirement
              </button>
            </div>

            <div className="h-px bg-slate-100 w-full my-4" />
            <FormField
              label="Insurance Details"
              placeholder="Public Liability, etc."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <FormField label="Insurance Expiry Date" type="date" />
              <div className="space-y-3">
                <label className="field-label">
                  Health & Safety Compliance
                </label>
                <div className="flex items-center gap-8 h-[50px]">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="hs_comp"
                      className="w-4 h-4 accent-teal-600"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-teal-700 transition-colors">
                      Yes
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="hs_comp"
                      defaultChecked
                      className="w-4 h-4 accent-teal-600"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-teal-700 transition-colors">
                      No
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <FormField label="Quality Certifications (ISO, etc.)" />
          </div>
        </FormSection>
        <FormSection
          number={9}
          title="Operational Information"
          icon={ClipboardList}
          theme="rose"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <FormField label="Order Contact Name *" />
              <FormField label="Order Contact Email *" type="email" />
            </div>
            <FormField
              label="Returns Policy"
              type="textarea"
              placeholder="Enter details..."
            />
            <FormField
              label="Warranty Terms"
              type="textarea"
              placeholder="Enter details..."
            />
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-4 mt-8 pb-10">
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-xl font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-10 py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all text-sm active:scale-[0.98]"
          >
            {editData ? "Update Supplier" : "Add Supplier"}
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
          margin-bottom: 6px; /* Added spacing between label and input */
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
      `}</style>
    </div>
  );
};

export default SupplierForm;
