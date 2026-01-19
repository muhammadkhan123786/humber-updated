"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Building2,
  Search,
  Edit2,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import SupplierForm from "./SupplierForm";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SuppliersPage = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [editData, setEditData] = useState<any>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BASE_URL}/suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.data) {
        setSuppliers(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching suppliers:", error);
      if (error.response?.status === 401) {
        console.error("Unauthorized - Redirecting to login...");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const total = suppliers.length;
    const active = suppliers.filter((sup) => sup.isActive).length;
    const inactive = total - active;
    setStats({ total, active, inactive });
  }, [suppliers]);

  useEffect(() => {
    if (view === "list") fetchSuppliers();
  }, [view]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((sup) => {
      const name =
        sup.supplierIdentification?.legalBusinessName?.toLowerCase() || "";
      const email = sup.contactInformation?.emailAddress?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [suppliers, searchQuery]);

  const handleEdit = (supplier: any) => {
    const flatData = {
      _id: supplier._id,
      userId:
        typeof supplier.userId === "object"
          ? supplier.userId._id
          : supplier.userId,

      legalBusinessName: supplier.supplierIdentification?.legalBusinessName,
      tradingName: supplier.supplierIdentification?.tradingName,
      businessRegNumber: supplier.supplierIdentification?.businessRegNumber,
      taxRegNumber: supplier.supplierIdentification?.vat,
      businessTypeId: supplier.supplierIdentification?.businessTypeId?._id,

      primaryContactName: supplier.contactInformation?.primaryContactName,
      jobTitleId: supplier.contactInformation?.jobTitleId?._id,
      phoneNumber: supplier.contactInformation?.phoneNumber,
      emailAddress: supplier.contactInformation?.emailAddress,
      website: supplier.contactInformation?.website,

      registeredAddress: supplier.businessAddress?.businessAddress,
      tradingAddress: supplier.businessAddress?.tradingAddress,
      cityId: supplier.businessAddress?.city?.cityName,
      stateCounty: supplier.businessAddress?.state,
      countryId: supplier.businessAddress?.country?.countryName,
      postalCode: supplier.businessAddress?.zipCode,

      vatRegistered: supplier.financialInformation?.vatRegistered,
      taxIdNumber: supplier.financialInformation?.taxIdentificationNumber,
      currencyId: supplier.financialInformation?.paymentCurrencyId?._id,
      paymentMethodId: supplier.financialInformation?.paymentMethodId?._id,

      bankName: supplier.bankPaymentDetails?.bankName,
      accountHolderName: supplier.bankPaymentDetails?.accountHolderName,
      accountNumber: supplier.bankPaymentDetails?.accountNumber,
      sortCode: supplier.bankPaymentDetails?.sortCode,
      iban: supplier.bankPaymentDetails?.ibanNumber,
      swiftCode: supplier.bankPaymentDetails?.swiftCode,

      productServiceId: supplier.productServices?.typeOfServiceId?._id,
      categoryId:
        supplier.productServices?.productCategoryIds?.map((cat: any) =>
          typeof cat === "object" ? cat._id : cat,
        ) || [],
      leadTime: supplier.productServices?.leadTimes,
      moq: supplier.productServices?.minimumOrderQuantity,

      paymentTermId: supplier.commercialTerms?.paymentTermsId?._id,
      pricingAgreementId: supplier.commercialTerms?.pricingAgreementId?._id,
      discountTerms: supplier.commercialTerms?.discountTerms,
      contractStartDate: supplier.commercialTerms?.contractStartDate
        ? new Date(supplier.commercialTerms.contractStartDate)
            .toISOString()
            .split("T")[0]
        : "",
      contractEndDate: supplier.commercialTerms?.contractEndDate
        ? new Date(supplier.commercialTerms.contractEndDate)
            .toISOString()
            .split("T")[0]
        : "",

      insuranceDetails: supplier.complianceDocumentation?.insuranceDetails,
      insuranceExpiryDate: supplier.complianceDocumentation?.insuranceExpiryDate
        ? new Date(supplier.complianceDocumentation.insuranceExpiryDate)
            .toISOString()
            .split("T")[0]
        : "",
      hsCompliance: supplier.complianceDocumentation?.healthAndSafetyCompliance
        ? "Yes"
        : "No",
      qualityCertifications:
        supplier.complianceDocumentation?.qualityCertificate,

      orderContactName: supplier.operationalInformation?.orderContactName,
      orderContactEmail: supplier.operationalInformation?.orderContactEmail,
      returnsPolicy: supplier.operationalInformation?.returnPolicy,
      warrantyTerms: supplier.operationalInformation?.warrantyTerms,
    };

    console.log("Edit data prepared:", flatData);
    setEditData(flatData);
    setView("form");
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this supplier?",
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/suppliers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSuppliers();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#f8fafc]">
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-linear-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/20">
                  <Building2 size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    Suppliers
                  </h1>
                  <p className="opacity-80">Manage your supplier database</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditData(null);
                  setView("form");
                }}
                className="bg-white text-[#a855f7] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <Plus size={20} /> Add Supplier
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Suppliers"
                value={stats.total}
                color="#0ea5e9"
                icon={<Building2 size={48} />}
              />
              <StatCard
                title="Active"
                value={stats.active}
                color="#10b981"
                icon={<CheckCircle2 size={48} />}
              />
              <StatCard
                title="Inactive"
                value={stats.inactive}
                color="#f59e0b"
                icon={<AlertCircle size={48} />}
              />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <div className="relative mb-6">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by business name or email..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="animate-spin mb-2" size={40} />
                  <p>Loading suppliers...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                        <th className="pb-4 pl-6">ID</th>
                        <th className="pb-4">Business Name</th>
                        <th className="pb-4">Contact</th>
                        <th className="pb-4">Location</th>
                        <th className="pb-4">Products</th>
                        <th className="pb-4 text-center">Status</th>
                        <th className="pb-4 text-right pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSuppliers.map((sup) => (
                        <tr
                          key={sup._id}
                          className="bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group"
                        >
                          <td className="py-5 pl-6 rounded-l-3xl font-medium text-slate-500">
                            #{sup._id.slice(-4).toUpperCase()}
                          </td>
                          <td className="py-5">
                            <div className="font-bold text-slate-800">
                              {sup.supplierIdentification?.legalBusinessName}
                            </div>
                            <span className="text-[9px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded font-black uppercase">
                              {sup.supplierIdentification?.businessTypeId
                                ?.businessTypeName || "N/A"}
                            </span>
                          </td>
                          <td className="py-5">
                            <div className="text-sm font-medium text-slate-700">
                              {sup.contactInformation?.primaryContactName}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <Mail size={12} />{" "}
                              {sup.contactInformation?.emailAddress}
                            </div>
                          </td>
                          <td className="py-5">
                            <div className="text-xs text-slate-600 flex items-center gap-1">
                              <MapPin size={14} className="text-slate-400" />
                              {sup.businessAddress?.state || "N/A"}
                            </div>
                            <div className="text-[10px] text-slate-400 ml-5">
                              {sup.businessAddress?.country?.countryName ||
                                "UK"}
                            </div>
                          </td>
                          <td className="py-5">
                            <div className="text-xs font-medium text-slate-700">
                              {sup.productServices?.typeOfServiceId
                                ?.productServicesName || "Service"}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock size={10} />{" "}
                              {sup.productServices?.leadTimes} days lead
                            </div>
                          </td>
                          <td className="py-5 text-center">
                            <span
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${sup.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                            >
                              {sup.isActive ? "active" : "inactive"}
                            </span>
                          </td>
                          <td className="py-5 pr-6 rounded-r-3xl text-right">
                            <button
                              onClick={() => handleEdit(sup)}
                              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(sup._id)}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <SupplierForm editData={editData} onBack={() => setView("list")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }: any) => (
  <div
    style={{ backgroundColor: color }}
    className="p-6 rounded-4xl text-white shadow-xl flex justify-between items-center relative overflow-hidden group"
  >
    <div>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <h2 className="text-5xl font-bold mt-1 tracking-tighter">{value}</h2>
    </div>
    <div className="opacity-20 group-hover:scale-110 transition-transform">
      {icon}
    </div>
  </div>
);

export default SuppliersPage;
