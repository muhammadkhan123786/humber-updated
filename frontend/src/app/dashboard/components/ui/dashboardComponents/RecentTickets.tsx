"use client";
import React, { useEffect, useState } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { TicketListItem } from "./TicketListItem";
import { getAlls } from "@/helper/apiHelper";
import Link from "next/link";

const RecentTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getColorConfig = (type: string, value: string) => {
    const val = value?.toLowerCase();
    if (type === "status") {
      if (val === "open") return "bg-cyan-500";
      if (val === "in progress") return "bg-orange-500";
      if (val === "closed" || val === "completed") return "bg-green-500";
      return "bg-slate-500";
    }
    if (type === "priority") {
      if (val === "high") return "bg-red-500";
      if (val === "medium") return "bg-amber-500";
      if (val === "low") return "bg-slate-500";
      return "bg-blue-500";
    }
    return "bg-gray-500";
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response: any = await getAlls("/customer-tickets");
        if (response.success && Array.isArray(response.data)) {
          const mappedTickets = response.data.map((item: any) => ({
            id: item._id, // Keep the DB ID for linking
            ticketId: item.ticketCode,
            status: item.ticketStatusId?.label || "Unknown",
            statusColor: getColorConfig("status", item.ticketStatusId?.label),
            priority:
              item.priorityId?.serviceRequestPrioprity?.toUpperCase() ||
              "NORMAL",
            priorityColor: getColorConfig(
              "priority",
              item.priorityId?.serviceRequestPrioprity,
            ),
            // FIX: Access nested personId OR companyName
            customerName:
              item.customerId?.personId?.firstName ||
              item.customerId?.companyName ||
              "N/A",
            equipment: item.vehicleId?.vehicleType || "General Equipment",
            description: item.issue_Details,
            date: new Date(item.createdAt).toLocaleDateString("en-GB"),
            category: item.ticketSource?.toLowerCase(),
          }));
          setTickets(mappedTickets);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 w-full flex justify-center">
        <p className="text-gray-400 animate-pulse font-bold">
          Loading Recent Tickets...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 w-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Zap
            className="text-indigo-500 w-6 h-6 fill-indigo-500/10"
            strokeWidth={2.5}
          />
          <h2 className="text-[18px] font-extrabold text-[#1e293b] tracking-tight">
            Recent Tickets
          </h2>
        </div>
        {/* FIX: Link to the general list, not a specific item ID that doesn't exist here */}
        <Link href="/dashboard/ticket-masterdata/allTickets">
          <button className="flex items-center gap-2 text-[#6366f1] font-bold text-sm hover:gap-1 transition-all group">
            View All
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-5">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/dashboard/ticket-masterdata/allTickets/${ticket.id}`}
            >
              <TicketListItem {...ticket} />
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400 py-10 italic">
            No tickets found.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentTickets;
