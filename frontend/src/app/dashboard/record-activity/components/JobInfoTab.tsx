"use client";
import React, { useState } from "react";
import {
  Calendar,
  Settings,
  AlertCircle,
  UserCheck,
  Phone,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const JobInfoTab = () => {
  const [selectedTicket, setSelectedTicket] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");

  const ticketDetails = {
    id: "TKT-2024-003",
    jobId: "JOB-2024-003",
    customer: "Patricia Wilson",
    model: "TGA Breeze S4",
    fault: "Brake system making unusual noise",
    priority: "HIGH",
    date: "09/01/2026",
    status: "ASSIGNED"
  };

  const technicianDetails = {
    name: "Emily Davis",
    specialization: "Diagnostics",
    phone: "07700 900126"
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
            value={selectedTicket}
            onChange={(e) => setSelectedTicket(e.target.value)}
          >
            <option value="">Select a ticket...</option>
            <option value="TKT-003">TKT-2024-003 - Patricia Wilson (HIGH)</option>
          </select>
        </div>

        {/* SAME-TO-SAME SELECTED TICKET DETAILS CARD */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 bg-[#F8FAFF] border border-blue-100 rounded-3xl p-6 space-y-4 overflow-hidden"
            >
              <div className="flex items-center gap-2 text-[#4F39F6] font-bold border-b border-blue-50 pb-3 mb-2">
                <FileText size={18} />
                <span className="text-sm">Selected Ticket Details</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Ticket ID</p>
                  <p className="font-bold text-gray-800 text-sm">{ticketDetails.id}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Job ID</p>
                  <p className="font-bold text-gray-800 text-sm">{ticketDetails.jobId}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Priority</p>
                  <span className="inline-block bg-orange-50 border border-orange-200 text-orange-600 text-[10px] font-black px-3 py-1 rounded-lg mt-1">
                    {ticketDetails.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Customer</p>
                  <p className="font-bold text-gray-800 text-sm">{ticketDetails.customer}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Scooter Model</p>
                  <p className="font-bold text-gray-800 text-sm">{ticketDetails.model}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Issue Description</p>
                <p className="font-bold text-gray-800 text-sm">{ticketDetails.fault}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Created Date</p>
                  <p className="font-bold text-gray-800 text-sm">{ticketDetails.date}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                  <span className="inline-block bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black px-3 py-1 rounded-lg mt-1">
                    {ticketDetails.status}
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
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job ID <span className="text-red-500">*</span></label>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm">
              {selectedTicket ? ticketDetails.jobId : "JOB-001"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticket ID <span className="text-red-500">*</span></label>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm">
              {selectedTicket ? ticketDetails.id : "TKT-2024-001"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Technician Name <span className="text-red-500">*</span></label>
            <select
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#4F39F6] outline-none transition-all cursor-pointer text-sm"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
            >
              <option value="">Select Technician</option>
              <option value="Emily">Emily Davis (Diagnostics)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Name</label>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm">
              {selectedTicket ? ticketDetails.customer : "Jane Doe"}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scooter Model</label>
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm">
             {selectedTicket ? ticketDetails.model : "Pride Mobility Go-Go Elite"}
          </div>
        </div>

        {/* CUSTOMER & FAULT INFO CARD (Orange) */}
        <AnimatePresence mode="wait">
          {selectedTicket && (
            <motion.div
              key="fault-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFF8F4] border border-orange-100 rounded-3xl p-6 space-y-4 mb-6"
            >
              <div className="flex items-center gap-2 text-[#E65100] font-bold">
                <AlertCircle size={18} />
                <span className="text-sm">Customer & Fault Information</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Customer Name</p>
                  <p className="font-bold text-gray-800 text-sm">{ticketDetails.customer}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Scooter Model</p>
                  <p className="font-bold text-gray-800 text-sm">{ticketDetails.model}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Reported Fault / Issue</p>
                <p className="font-bold text-gray-800 text-sm">{ticketDetails.fault}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Priority Level</p>
                  <span className="inline-block bg-[#E65100] text-white text-[10px] font-black px-3 py-1 rounded-lg mt-1">
                    {ticketDetails.priority}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-orange-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Ticket Created</p>
                  <p className="font-bold text-gray-800 text-sm">{ticketDetails.date}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TECHNICIAN DETAILS CARD (Green) */}
        <AnimatePresence mode="wait">
          {selectedTechnician && (
            <motion.div
              key="tech-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#F6FFF9] border border-emerald-100 rounded-3xl p-6 space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-[#10B981] font-bold">
                <UserCheck size={18} />
                <span className="text-sm">Selected Technician Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-emerald-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Name</p>
                  <p className="font-bold text-gray-800 text-sm">{technicianDetails.name}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-emerald-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Specialization</p>
                  <p className="font-bold text-gray-800 text-sm">{technicianDetails.specialization}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-emerald-50/50 shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Phone</p>
                  <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                    <Phone size={14} className="text-emerald-500" />
                    {technicianDetails.phone}
                  </div>
                </div>
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