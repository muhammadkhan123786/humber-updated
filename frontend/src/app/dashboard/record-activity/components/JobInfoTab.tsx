"use client";
import React, { useState, useMemo } from "react";
import {
  Calendar,
  Settings,
  AlertCircle,
  UserCheck,
  Phone,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomSelectNoBorder } from "../../../common-form/CustomSelectNoBorder";
import { FormDisplay } from "@/app/common-form/FormDisplay";
import axios from "axios";

const generateJobId = async (): Promise<string> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const cleanToken = token ? token.replace(/^"|"$/g, "").trim() : "";

    const response = await axios.get(
      `${baseUrl}/auto-generate-codes/techcian-job-code`,
      {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      },
    );

    return response.data.technicianJobCode || "JOB-ERROR-000";
  } catch (error) {
    console.error("Failed to generate job ID from API:", error);
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `JOB-${year}${month}${day}-${random}`;
  }
};

export const JobInfoTab = ({ form, tickets, technicians }: any) => {
  const { watch, setValue } = form;

  const selectedTicketId = watch("ticketId");
  const selectedTechnicianId = watch("technicianId");
  const [jobId, setJobId] = useState<string>("");
  const [isGeneratingJobId, setIsGeneratingJobId] = useState(false);

  React.useEffect(() => {
    const fetchJobId = async () => {
      setIsGeneratingJobId(true);
      try {
        const generatedJobId = await generateJobId();
        setJobId(generatedJobId);
      } catch (error) {
        console.error("Error generating job ID:", error);
      } finally {
        setIsGeneratingJobId(false);
      }
    };

    fetchJobId();
  }, []);

  const selectedTicket = useMemo(() => {
    return tickets.find((t: any) => t._id === selectedTicketId) || null;
  }, [selectedTicketId, tickets]);

  const selectedTechnician = useMemo(() => {
    return technicians.find((t: any) => t._id === selectedTechnicianId) || null;
  }, [selectedTechnicianId, technicians]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCustomerName = (ticket: any) => {
    if (!ticket?.customerId?.personId) return "Unknown Customer";
    const person = ticket.customerId.personId;
    return `${person.firstName} ${person.middleName ? person.middleName + " " : ""}${person.lastName || ""}`.trim();
  };

  const getPriority = (ticket: any) => {
    if (!ticket?.priorityId) return "NORMAL";
    return ticket.priorityId.label || ticket.priorityId.serviceRequestPrioprity;
  };

  const getPriorityColor = (ticket: any) => {
    if (!ticket?.priorityId?.backgroundColor) return "#E65100";
    return ticket.priorityId.backgroundColor;
  };

  const getTicketStatus = (ticket: any) => {
    if (!ticket?.ticketStatusId) return "Unknown";
    return ticket.ticketStatusId.label || ticket.ticketStatusId.code;
  };

  const getTechnicianName = (technician: any) => {
    if (!technician?.personId) return "Unknown";
    const person = technician.personId;
    return `${person.firstName} ${person.middleName ? person.middleName + " " : ""}${person.lastName || ""}`.trim();
  };

  const getTechnicianSpecialization = (technician: any) => {
    if (
      !technician?.specializationIds ||
      !Array.isArray(technician.specializationIds)
    )
      return "General";
    if (technician.specializationIds.length > 0) {
      const firstSpec = technician.specializationIds[0];
      return typeof firstSpec === "object"
        ? firstSpec.MasterServiceType || "General"
        : "General";
    }
    return "General";
  };

  const getVehicleDetails = (ticket: any) => {
    const vehicle = ticket?.vehicleId;
    if (!vehicle) return "N/A";
    const brand = vehicle.vehicleBrandId?.brandName || "";
    const model = vehicle.vehicleModelId?.modelName || "";
    const year = vehicle.year || "";
    return `${brand} ${model} ${year ? `(${year})` : ""}`.trim();
  };

  const ticketOptions = tickets.map((t: any) => ({
    id: t._id,
    label: `${t.ticketCode} - ${getCustomerName(t)} (${getPriority(t)})`,
  }));

  const technicianOptions = technicians.map((tech: any) => ({
    id: tech._id,
    label: `${getTechnicianName(tech)} (${getTechnicianSpecialization(tech)})`,
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. SELECT SERVICE TICKET SECTION */}
      <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-[#4F39F6] font-bold">
          <Calendar size={20} />
          <span className="leading-none flex items-center gap-2 text-indigo-600">
            Select Service Ticket
          </span>
        </div>

        <div className="space-y-2">
          <label className=" font-medium text-sm tracking-widest">
            Service Ticket <span className="text-red-500">*</span>
          </label>
          <CustomSelectNoBorder
            options={ticketOptions}
            value={selectedTicketId}
            onChange={(id: any) => setValue("ticketId", id)}
            placeholder="Select a ticket..."
            error={!selectedTicketId}
          />
        </div>

        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 bg-[#F8FAFF] border border-blue-100 rounded-3xl p-6 space-y-4 overflow-hidden"
            >
              <div className="flex items-center gap-2 text-[#4F39F6] font-bold border-b border-blue-50 pb-3 mb-2">
                <FileText size={18} />
                <span className="text-sm">Selected Ticket Details</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Ticket ID
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    {selectedTicket.ticketCode}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Job ID
                  </p>
                  <p className="font-bold text-gray-800 text-sm">{jobId}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Priority
                  </p>
                  <span
                    className="inline-block text-white text-[10px] font-black px-3 py-1 rounded-lg mt-1"
                    style={{
                      backgroundColor: getPriorityColor(selectedTicket),
                    }}
                  >
                    {getPriority(selectedTicket)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Customer
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    {getCustomerName(selectedTicket)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Contact
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    {selectedTicket.customerId?.contactId?.mobileNumber ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                  Issue Description
                </p>
                <p className="font-bold text-gray-800 text-sm">
                  {selectedTicket.issue_Details || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Location
                  </p>
                  <p className="font-bold text-gray-800 text-sm capitalize">
                    {selectedTicket.location || "Workshop"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Created Date
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    {formatDateTime(selectedTicket.createdAt)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Status
                  </p>
                  <span className="inline-block bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black px-3 py-1 rounded-lg mt-1 capitalize">
                    {getTicketStatus(selectedTicket)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-[#4F39F6] font-bold">
          <Settings size={20} />
          <span className="leading-none flex items-center gap-2 text-indigo-600">
            Job Information
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="font-medium text-sm tracking-widest">
              Job ID
            </label>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
              {isGeneratingJobId ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4F39F6]"></div>
                  <span className="text-gray-500 text-sm">
                    Generating Job ID...
                  </span>
                </div>
              ) : (
                <span className="font-bold text-gray-800 text-sm">
                  {jobId || "Loading..."}
                </span>
              )}
            </div>
          </div>

          <FormDisplay
            label="Ticket id"
            value={selectedTicket?.ticketCode || "Select a ticket"}
          />

          <div className="space-y-2">
            <label className=" font-medium text-sm tracking-widest">
              Technician Name <span className="text-red-500">*</span>
            </label>
            <CustomSelectNoBorder
              options={technicianOptions}
              value={selectedTechnicianId}
              onChange={(id: any) => setValue("technicianId", id)}
              placeholder="Select Technician"
              className="border-0 focus:border-0 focus:ring-0 ring-0 outline-none shadow-none"
              error={!selectedTechnicianId}
            />
          </div>

          <FormDisplay
            label="Customer Name"
            value={
              selectedTicket ? getCustomerName(selectedTicket) : "john doe"
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-2">
            <label className=" font-medium text-sm  tracking-widest">
              Scooter model
            </label>
            <div className="px-4 bg-gray-50 flex items-center border h-9 border-gray-100 rounded-xl text-gray-500 font-bold text-center text-sm">
              {selectedTicket
                ? getVehicleDetails(selectedTicket)
                : "Select a ticket"}
            </div>
          </div>
          <FormDisplay
            label="Scooter model"
            value={
              selectedTicket
                ? getVehicleDetails(selectedTicket)
                : "Select a ticket"
            }
          />
        </div>

        <AnimatePresence mode="wait">
          {selectedTicket && (
            <motion.div
              key="fault-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#FFF8F4] border border-orange-100 rounded-3xl p-6 space-y-4 mb-6"
            >
              <div className="flex items-center gap-2 text-orange-700 text-lg">
                <AlertCircle size={18} />
                <span className="font-semibold">
                  Customer & Fault Information
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Customer Name
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    {getCustomerName(selectedTicket)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Vehicle
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    {selectedTicket.vehicleId?.vehicleBrandId?.brandName}{" "}
                    {selectedTicket.vehicleId?.vehicleModelId?.modelName}
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                  Reported Fault / Issue
                </p>
                <p className="font-bold text-gray-800 text-sm">
                  {selectedTicket.issue_Details || "No description provided"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Priority Level
                  </p>
                  <span
                    className="inline-block text-white text-[10px] font-black px-3 py-1 rounded-lg mt-1"
                    style={{
                      backgroundColor: getPriorityColor(selectedTicket),
                    }}
                  >
                    {getPriority(selectedTicket)}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Ticket Created
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    {formatDate(selectedTicket.createdAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {selectedTechnician && (
            <motion.div
              key="tech-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#F6FFF9] border border-emerald-100 rounded-3xl p-6 space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-[#10B981] font-bold">
                <UserCheck size={18} />
                <span className="text-sm">Selected Technician Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-emerald-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Name
                  </p>
                  <p className="font-bold text-gray-800 text-sm">
                    {getTechnicianName(selectedTechnician)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-emerald-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                    Phone
                  </p>
                  <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                    <Phone size={14} className="text-emerald-500" />
                    {selectedTechnician.contactId?.mobileNumber ||
                      selectedTechnician.contactId?.phoneNumber ||
                      "N/A"}
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-emerald-50/50 shadow-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                  Specialization
                </p>
                <p className="font-bold text-gray-800 text-sm">
                  {getTechnicianSpecialization(selectedTechnician)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center gap-2 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-[#4F39F6] text-[11px] font-bold">
          <AlertCircle size={16} />
          <span>Fields marked with * are required</span>
        </div>
      </div>
    </div>
  );
};
