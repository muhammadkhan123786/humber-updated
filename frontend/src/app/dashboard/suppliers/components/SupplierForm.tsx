"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Building2,
  User,
  MapPin,
  Landmark,
  ChevronDown,
  CreditCard,
  Package,
  FileText,
  Upload,
  ShieldCheck,
  ClipboardList,
  Trash2,
  Plus,
} from "lucide-react";

interface SupplierFormProps {
  editData?: any;
  onBack: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ editData, onBack }) => {
  const [documents, setDocuments] = useState([{ id: 1, title: "", path: "" }]);

  const addDocument = () => {
    setDocuments([...documents, { id: Date.now(), title: "", path: "" }]);
  };

  const removeDocument = (id: number) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] pb-20">
      <div className="relative w-full bg-linear-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] p-6 md:p-8  text-white shadow-xl mb-8">
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
              {editData ? " update Supplier " : " Add New Supplier"}
            </h1>
            <p className="opacity-80 text-xs md:text-sm font-medium mt-0.5">
              {editData
                ? " Complete all required fields to update supplier"
                : " Complete all required fields to register a new supplier"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-8">
        {/* --- SECTION 1: SUPPLIER IDENTIFICATION (Grid as per Image) --- */}
        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2.5 p-5 bg-blue-50/40 border-b border-blue-50">
            <Building2 size={18} className="text-blue-600" />
            <h3 className="text-[13px] font-black uppercase tracking-wider text-blue-700">
              1. Supplier Identification
            </h3>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="md:col-span-2 space-y-1.5">
              <label className="field-label">Legal Business Name *</label>
              <input
                type="text"
                placeholder="Enter legal name"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">Trading Name (if different)</label>
              <input
                type="text"
                placeholder="Enter trading name"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">
                Business Registration Number *
              </label>
              <input
                type="text"
                placeholder="e.g. CRN-123456"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">
                VAT / Tax Registration Number
              </label>
              <input
                type="text"
                placeholder="e.g. VAT-7890"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">Business Type *</label>
              <div className="relative">
                <select className="form-input-style appearance-none cursor-pointer">
                  <option>Limited Company</option>
                  <option>Sole Trader</option>
                  <option>Partnership</option>
                </select>
                <ChevronDown
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: CONTACT INFORMATION (Grid as per Image) --- */}
        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2.5 p-5 bg-purple-50/40 border-b border-purple-50">
            <User size={18} className="text-purple-600" />
            <h3 className="text-[13px] font-black uppercase tracking-wider text-purple-700">
              2. Contact Information
            </h3>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="space-y-1.5">
              <label className="field-label">Primary Contact Name *</label>
              <input
                type="text"
                placeholder="John Smith"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">Job Title *</label>
              <input
                type="text"
                placeholder="Manager"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">Phone Number *</label>
              <input
                type="text"
                placeholder="+44 20 1234 5678"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">Email Address *</label>
              <input
                type="email"
                placeholder="email@company.com"
                className="form-input-style"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="field-label">Website</label>
              <input
                type="text"
                placeholder="https://www.website.com"
                className="form-input-style"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2.5 p-5 bg-[#f0fdf4] border-b border-[#dcfce7]">
            <MapPin size={18} className="text-[#16a34a]" />
            <h3 className="text-[13px] font-black uppercase tracking-wider text-[#15803d]">
              3. Business Address
            </h3>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="md:col-span-2 space-y-1.5">
              <label className="field-label">Registered Address *</label>
              <input
                type="text"
                placeholder="Street name, Building number"
                className="form-input-style"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="field-label">
                Trading Address (if different)
              </label>
              <input
                type="text"
                placeholder="Warehouse or secondary location"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">City *</label>
              <input
                type="text"
                placeholder="e.g. London"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">State / County *</label>
              <input
                type="text"
                placeholder="e.g. Greater London"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">Postal / ZIP Code *</label>
              <input
                type="text"
                placeholder="e.g. EC1A 1BB"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">Country *</label>
              <input
                type="text"
                placeholder="United Kingdom"
                className="form-input-style"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2.5 p-5 bg-[#fff7ed] border-b border-[#ffedd5]">
            <Landmark size={18} className="text-[#ea580c]" />
            <h3 className="text-[13px] font-black uppercase tracking-wider text-[#c2410c]">
              4. Financial & Tax Information
            </h3>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
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

            <div className="space-y-1.5">
              <label className="field-label">VAT Number</label>
              <input
                type="text"
                placeholder="Enter VAT if applicable"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">Tax Identification Number</label>
              <input
                type="text"
                placeholder="Enter TIN"
                className="form-input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">Payment Currency *</label>
              <input
                type="text"
                defaultValue="GBP"
                className="form-input-style"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="field-label">Preferred Payment Method *</label>
              <div className="relative">
                <select className="form-input-style appearance-none cursor-pointer">
                  <option>Bank Transfer</option>
                  <option>Credit Card</option>
                  <option>PayPal</option>
                  <option>Net 30</option>
                </select>
                <ChevronDown
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-4xlshadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2.5 p-5 bg-red-50/40 border-b border-red-50">
            <CreditCard size={18} className="text-red-600" />
            <h3 className="text-[13px] font-black uppercase tracking-wider text-red-700">
              5. Bank / Payment Details
            </h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="space-y-1.5">
              <label className="field-label">Bank Name *</label>
              <input
                type="text"
                placeholder="Enter bank name"
                className="form-input-style"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Account Holder Name *</label>
              <input
                type="text"
                placeholder="Full name on account"
                className="form-input-style"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Account Number *</label>
              <input
                type="text"
                placeholder="Enter account number"
                className="form-input-style"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">
                Sort Code / Routing Number *
              </label>
              <input
                type="text"
                placeholder="00-00-00"
                className="form-input-style"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">
                IBAN (for international payments)
              </label>
              <input
                type="text"
                placeholder="GB00 XXXX ..."
                className="form-input-style"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">SWIFT / BIC Code</label>
              <input
                type="text"
                placeholder="BIC Code"
                className="form-input-style"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2.5 p-5 bg-indigo-50/40 border-b border-indigo-50">
            <Package size={18} className="text-indigo-600" />
            <h3 className="text-[13px] font-black uppercase tracking-wider text-indigo-700">
              6. Products / Services Supplied
            </h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-1.5">
              <label className="field-label">
                Type of Products or Services *
              </label>
              <input
                type="text"
                placeholder="e.g. Spare Parts"
                className="form-input-style"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Product Categories *</label>
              <input
                type="text"
                placeholder="Select categories"
                className="form-input-style"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <div className="space-y-1.5">
                <label className="field-label">Lead Time (days) *</label>
                <input
                  type="number"
                  placeholder="5"
                  className="form-input-style"
                />
              </div>
              <div className="space-y-1.5">
                <label className="field-label">Minimum Order Quantity</label>
                <input
                  type="text"
                  placeholder="MOQ"
                  className="form-input-style"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Service Coverage Area</label>
              <input
                type="text"
                placeholder="Nationwide / Regional"
                className="form-input-style"
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 7: COMMERCIAL TERMS (Exact Picture Layout) --- */}
        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2.5 p-5 bg-sky-50/40 border-b border-sky-50">
            <FileText size={18} className="text-sky-600" />
            <h3 className="text-[13px] font-black uppercase tracking-wider text-sky-700">
              7. Commercial Terms
            </h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="space-y-1.5">
              <label className="field-label">Payment Terms *</label>
              <input
                type="text"
                placeholder="e.g. Net 30"
                className="form-input-style"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Pricing Agreement *</label>
              <div className="relative">
                <select className="form-input-style appearance-none cursor-pointer">
                  <option>Fixed</option>
                  <option>Variable</option>
                </select>
                <ChevronDown
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="field-label">Discount Terms</label>
              <input
                type="text"
                placeholder="Volume based discount"
                className="form-input-style"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Contract Start Date *</label>
              <input type="date" className="form-input-style" />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Contract End Date</label>
              <input type="date" className="form-input-style" />
            </div>
          </div>
        </div>

        {/* --- SECTION 8: COMPLIANCE & DOCUMENTATION --- */}
        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-2.5 p-5 bg-teal-50/40 border-b border-teal-50">
            <ShieldCheck size={18} className="text-teal-600" />
            <h3 className="text-[13px] font-black uppercase tracking-wider text-teal-700">
              8. Compliance & Documentation
            </h3>
          </div>

          <div className="p-8 space-y-6">
            {documents.map((doc, index) => (
              <div
                key={doc.id}
                className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <label className="field-label">
                  {index === 0
                    ? "Business Registration Certificate"
                    : `Additional Document ${index + 1}`}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="File path or URL"
                    className="form-input-style flex-1"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="p-3 bg-slate-100 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-colors border border-slate-200 shadow-sm"
                    >
                      <Upload size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={addDocument}
                      className="p-3 bg-teal-600 rounded-xl hover:bg-teal-700 text-white transition-all shadow-md shadow-teal-100 active:scale-90"
                    >
                      <Plus size={18} />
                    </button>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="p-3 bg-rose-50 rounded-xl hover:bg-rose-100 text-rose-500 transition-colors border border-rose-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="h-px bg-slate-100 w-full my-2" />

            {/* Insurance & Compliance Fields */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="field-label">Insurance Details</label>
                <input
                  type="text"
                  placeholder="Public Liability, Professional Indemnity, etc."
                  className="form-input-style"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div className="space-y-1.5">
                  <label className="field-label">Insurance Expiry Date</label>
                  <input type="date" className="form-input-style" />
                </div>
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

              <div className="space-y-1.5">
                <label className="field-label">
                  Quality Certifications (ISO, etc.)
                </label>
                <input type="text" className="form-input-style" />
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 9: OPERATIONAL INFORMATION (Rose/Pink Theme) --- */}
        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="flex items-center gap-2.5 p-5 bg-rose-50/40 border-b border-rose-50">
            <ClipboardList size={18} className="text-rose-600" />
            <h3 className="text-[13px] font-black uppercase tracking-wider text-rose-700">
              9. Operational Information
            </h3>
          </div>

          <div className="p-8 space-y-6">
            {/* Top Row: Split 50/50 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <div className="space-y-1.5">
                <label className="field-label">Order Contact Name *</label>
                <input type="text" className="form-input-style" />
              </div>
              <div className="space-y-1.5">
                <label className="field-label">Order Contact Email *</label>
                <input type="email" className="form-input-style" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Returns Policy</label>
              <textarea
                className="form-input-style min-h-[100px] py-4 resize-none"
                placeholder="Enter details..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="field-label">Warranty Terms</label>
              <textarea
                className="form-input-style min-h-[100px] py-4 resize-none"
                placeholder="Enter details..."
              />
            </div>
          </div>
        </div>

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
            Add Supplier
          </button>
        </div>
      </div>

      <style jsx>{`
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-left: 4px;
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
