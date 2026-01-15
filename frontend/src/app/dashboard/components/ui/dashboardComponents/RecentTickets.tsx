import React from "react";
import { Zap, ArrowRight } from "lucide-react";
import { TicketListItem } from "./TicketListItem";

const RecentTickets = () => {
  const tickets = [
    {
      ticketId: "T-2026-001",
      status: "in progress",
      statusColor: "bg-orange-500",
      priority: "HIGH",
      priorityColor: "bg-red-500",
      customerName: "John Smith",
      equipment: "Pride Victory 10",
      description:
        "Battery not holding charge, scooter stops after 15 minutes of use",
      date: "08/01/2026",
      category: "phone",
    },
    {
      ticketId: "T-2026-002",
      status: "open",
      statusColor: "bg-cyan-500",
      priority: "MEDIUM",
      priorityColor: "bg-amber-500",
      customerName: "Mary Johnson",
      equipment: "Drive Scout",
      description: "Front wheel making grinding noise when turning left",
      date: "09/01/2026",
      category: "online",
    },
    {
      ticketId: "T-2026-003",
      status: "completed",
      statusColor: "bg-green-500",
      priority: "LOW",
      priorityColor: "bg-slate-500",
      customerName: "Robert Williams",
      equipment: "Golden Buzzaround XL",
      description:
        "Tiller steering column loose, needs adjustment and tightening",
      date: "05/01/2026",
      category: "walk-in",
    },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 w-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Zap
              className="text-indigo-500 w-6 h-6 fill-indigo-500/10"
              strokeWidth={2.5}
            />
          </div>
          <h2 className="text-[18px] font-extrabold text-[#1e293b] tracking-tight">
            Recent Tickets
          </h2>
        </div>

        <button className="flex items-center  gap-2 text-[#6366f1] font-bold text-sm hover:gap-1 hover:bg-gray-300 transition-all group">
          View All
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {tickets.map((ticket) => (
          <TicketListItem key={ticket.ticketId} {...ticket} />
        ))}
      </div>
    </div>
  );
};

export default RecentTickets;
