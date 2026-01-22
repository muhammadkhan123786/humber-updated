"use client";
import React, { useEffect, useState } from "react";
import { getAlls } from "@/helper/apiHelper";
import { User, Mail, Phone, ChevronRight } from "lucide-react";

const TechnicianAssignment = () => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [techRes, ticketRes]: any = await Promise.all([
          getAlls("/technicians"),
          getAlls("/customer-tickets/unassigned-technician-tickets"),
        ]);

        if (techRes.success) setTechnicians(techRes.data);
        if (ticketRes.success) setTickets(ticketRes.data);
      } catch (error) {
        console.error("Error fetching assignment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold">
        Loading Assignment Data...
      </div>
    );

  return (
    <div className="p-6 bg-[#F8F9FD] min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B]">
          Technician Assignment
        </h1>
        <p className="text-gray-500 text-sm">
          Assign tickets to available technicians
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {technicians.map((tech) => (
          <div
            key={tech._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative overflow-hidden"
          >
            <div
              className={`absolute top-0 left-0 w-full h-1 ${tech.technicianStatus === "Available"}`}
            ></div>

            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 leading-tight">
                    {tech.personId?.firstName} {tech.personId?.lastName}
                  </h3>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-bold">
                    {tech.employeeId}
                  </span>
                </div>
              </div>
              <div
                className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${tech.technicianStatus === "Available" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${tech.technicianStatus === "Available" ? "bg-green-500" : "bg-orange-500"}`}
                ></div>
                {tech.technicianStatus}
              </div>
            </div>

            {/* Specializations Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tech.specializationIds?.map((spec: any) => (
                <span
                  key={spec._id}
                  className="text-[10px] border border-purple-100 bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium"
                >
                  {spec.MasterServiceType}
                </span>
              ))}
            </div>

            <div className="space-y-2 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-400" />{" "}
                {tech.contactId?.emailId}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-400" />{" "}
                {tech.contactId?.mobileNumber}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">
                  Active Jobs
                </p>
                <p className="text-lg font-bold text-gray-700">
                  {tech.dutyRoster?.length || 0}
                </p>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:underline">
                View Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
          <h2 className="font-bold text-gray-700">
            Unassigned / In-Progress Tickets
          </h2>
        </div>

        <div className="divide-y divide-gray-50">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-5 hover:bg-blue-50/20 transition-colors flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-blue-600">
                      {ticket.ticketCode}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white bg-purple-500`}
                    >
                      {ticket.ticketStatusId?.label}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-600`}
                    >
                      {ticket.priorityId?.serviceRequestPrioprity}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">
                    {ticket.customerId?.companyName} -{" "}
                    {ticket.vehicleId?.vehicleType}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-1 italic">
                    {ticket.issue_Details}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="min-w-[200px]">
                    <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                      <option>Assign to...</option>
                      {technicians.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.personId?.firstName} ({t.dutyRoster?.length || 0}{" "}
                          jobs)
                        </option>
                      ))}
                    </select>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-400 italic">
              No unassigned tickets found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianAssignment;
