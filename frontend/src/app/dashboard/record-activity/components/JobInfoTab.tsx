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

export const JobInfoTab = ({ form, tickets, technicians }: any) => {
  const { register, watch, setValue } = form;

  const selectedTicketId = watch("ticketId");
  const selectedTechnicianId = watch("technicianId");

  // 1. Initialize jobId once using a lazy initializer
  const [jobId] = useState<string>(() => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    return `JOB-${year}${month}${day}-${timestamp}`;
  });

  // 2. Derive state directly during render (No useEffect needed)
  const selectedTicket = useMemo(() => {
    return tickets.find((t: any) => t._id === selectedTicketId) || null;
  }, [selectedTicketId, tickets]);

  const selectedTechnician = useMemo(() => {
    return technicians.find((t: any) => t._id === selectedTechnicianId) || null;
  }, [selectedTechnicianId, technicians]);

  // 3. Handle side effects (like auto-setting tech ID)
  // only when the ticket actually changes
  React.useEffect(() => {
    if (selectedTicket?.assignedTechnicianId?.length > 0) {
      setValue("technicianId", selectedTicket.assignedTechnicianId[0]._id);
    }
  }, [selectedTicket, setValue]);

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. SELECT SERVICE TICKET SECTION */}
      <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-[#4F39F6] font-bold">
          <Calendar size={20} />
          <span className="text-sm">Select Service Ticket</span>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Service Ticket <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none transition-all cursor-pointer"
            {...register("ticketId")}
          >
            <option value="">Select a ticket...</option>
            {tickets.map((ticket: any) => (
              <option key={ticket._id} value={ticket._id}>
                {ticket.ticketCode} - {getCustomerName(ticket)} (
                {getPriority(ticket)})
              </option>
            ))}
          </select>
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
                    Ticket Source
                  </p>
                  <p className="font-bold text-gray-800 text-sm capitalize">
                    {selectedTicket.ticketSource || "N/A"}
                  </p>
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

      {/* 2. JOB INFORMATION SECTION */}
      <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-[#4F39F6] font-bold">
          <Settings size={20} />
          <span className="text-sm">Job Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Job ID <span className="text-red-500">*</span>
            </label>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm">
              {jobId}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Ticket ID <span className="text-red-500">*</span>
            </label>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm">
              {selectedTicket ? selectedTicket.ticketCode : "Select a ticket"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Technician Name <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none transition-all cursor-pointer text-sm"
              {...register("technicianId")}
            >
              <option value="">Select Technician</option>
              {technicians.map((tech: any) => (
                <option key={tech._id} value={tech._id}>
                  {getTechnicianName(tech)} ({getTechnicianSpecialization(tech)}
                  )
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Customer Name
            </label>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm">
              {selectedTicket
                ? getCustomerName(selectedTicket)
                : "Select a ticket"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Scooter model
            </label>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm">
              {selectedTicket
                ? getVehicleDetails(selectedTicket)
                : "Select a ticket"}
            </div>
          </div>
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
              <div className="flex items-center gap-2 text-[#E65100] font-bold">
                <AlertCircle size={18} />
                <span className="text-sm">Customer & Fault Information</span>
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
