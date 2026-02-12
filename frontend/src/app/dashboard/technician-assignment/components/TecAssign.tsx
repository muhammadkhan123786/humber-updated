"use client";
import React, { useEffect, useState } from "react";
import { getAlls, updateItem } from "@/helper/apiHelper";
import { User, Mail, Phone } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import toast from "react-hot-toast";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const TechnicianAssignment = () => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(
    null,
  );
  const limit = 10;
  const ENDPOINT = "/job-statistics";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [techRes, ticketRes]: any = await Promise.all([
          getAlls("/technicians"),
          getAlls(
            `/customer-tickets/unassigned-technician-tickets?page=${currentPage}&limit=${limit}`,
          ),
        ]);

        if (techRes.success) setTechnicians(techRes.data);

        if (ticketRes.success) {
          setTickets(ticketRes.data);
          setTotalPages(Math.ceil(ticketRes.total / limit));
        }
      } catch (error) {
        console.error("Error fetching assignment data:", error);
        toast.error("Failed to load assignment data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleAssignTechnician = async (
    ticketId: string,
    technicianId: string,
  ) => {
    if (!technicianId) {
      toast.error("Please select a technician");
      return;
    }

    try {
      setAssigningTicketId(ticketId);
      const response = await updateItem<any>(ENDPOINT, ticketId, {
        technicianId,
      });
      const result = response as ApiResponse;

      if (result?.success) {
        toast.success("Technician assigned successfully!");

        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket._id !== ticketId),
        );

        setTotalPages(() => Math.ceil((tickets.length - 1) / limit));
      } else {
        toast.error(result?.message || "Failed to assign technician");
      }
    } catch (error: any) {
      console.error("Error assigning technician:", error);
      toast.error(error?.message || "Failed to assign technician");
    } finally {
      setAssigningTicketId(null);
    }
  };

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
              className={`absolute top-0 left-0 w-full h-1 ${
                tech.technicianStatus === "Available"
                  ? "bg-green-500"
                  : "bg-orange-500"
              }`}
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
                className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                  tech.technicianStatus === "Available"
                    ? "bg-green-50 text-green-600"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    tech.technicianStatus === "Available"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                ></div>
                {tech.technicianStatus}
              </div>
            </div>

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
        <div className="px-6 pt-6 pb-3">
          <h4 className="font-semibold">Unassigned / In-Progress Tickets</h4>
        </div>

        <div className="space-y-3 bg-white p-6 rounded-xl">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="rounded-xl border border-indigo-600/10 px-4 pt-4 pb-2 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">
                        {ticket.ticketCode}
                      </span>

                      <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500 text-white capitalize">
                        {ticket.ticketStatusId?.label}
                      </span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white capitalize">
                        {ticket.priorityId?.serviceRequestPrioprity}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 mt-1">
                      {ticket.customerId?.personId?.firstName} –{" "}
                      {ticket.vehicleId?.vehicleType}
                    </span>
                  </div>

                  <div className="bg-gray-100 rounded-[10px] px-3 h-9 flex items-center min-w-[220px]">
                    <select
                      id={`technician-select-${ticket._id}`}
                      value=""
                      onChange={(e) => {
                        const technicianId = e.target.value;
                        if (technicianId) {
                          handleAssignTechnician(ticket._id, technicianId);
                        }
                      }}
                      disabled={assigningTicketId === ticket._id}
                      className="bg-transparent text-sm text-indigo-950 w-full outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {assigningTicketId === ticket._id
                          ? "Assigning..."
                          : "Assign to..."}
                      </option>
                      {technicians.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.personId?.firstName} ({t.dutyRoster?.length || 0}{" "}
                          jobs) - {t.technicianStatus}
                        </option>
                      ))}
                    </select>
                    {assigningTicketId === ticket._id && (
                      <div className="ml-2">
                        <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{ticket.issue_Details}</p>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-400 italic bg-white rounded-xl">
              No unassigned tickets found.
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default TechnicianAssignment;
