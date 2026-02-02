"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Package,
  Activity,
  HelpCircle,
} from "lucide-react";

import { SummaryCard } from "./SummaryCard";
import StatCard from "./TicketCard";
import { getAlls } from "@/helper/apiHelper";

const DashboardHero = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response: any = await getAlls("/customer-tickets/ticket-count-status-wise");
        if (response.success) {
          setData(response);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getDynamicStyles = (code: string) => {
    const statusKey = code?.toUpperCase().replace(/\s+/g, "_");

    const styleMap: Record<string, any> = {
      OPEN: {
        title: "Open Tickets",
        icon: Ticket,
        color: "from-[#00B8DB] to-[#00BBA7]",
        bg: "bg-[#F0FDFF]",
      },
      CLOSED: {
        title: "Closed Tickets",
        icon: CheckCircle2,
        color: "from-[#00BC7D] to-[#7CCF00]",
        bg: "bg-[#F0FDF4]",
      },
      IN_PRORESS: {
        title: "In Progress",
        icon: Clock,
        color: "from-[#FF8C00] to-[#FF4500]",
        bg: "bg-[#FFF7ED]",
      },
      IN_PROGRESS: {
        title: "In Progress",
        icon: Clock,
        color: "from-[#FF8C00] to-[#FF4500]",
        bg: "bg-[#FFF7ED]",
      }
    };


    return styleMap[statusKey] || {
      title: code?.replace(/_/g, " ") || "Other Status",
      icon: HelpCircle,
      color: "from-[#4F39F6] to-[#9810FA]",
      bg: "bg-[#F5F3FF]",
    };
  };

  if (loading) return <div className="py-8 animate-pulse text-gray-400">Loading Dashboard...</div>;

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[32px] font-extrabold text-[#4F39F6] tracking-tight mb-1">Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome to Humber Mobility Scooter</p>
        </div>
        <Link href="/dashboard/ticket-masterdata/createTicket">
          <button className="flex items-center gap-3 px-7 py-4 font-bold text-white rounded-2xl bg-linear-to-r from-[#4F39F6] to-[#9810FA] shadow-[0_15px_35px_-5px_rgba(79,57,246,0.5)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 active:scale-95 cursor-pointer group">
            <Ticket size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="tracking-tight text-lg">Create New Ticket</span>
          </button>
        </Link>
      </div>

      {/* Top Row: Fully Dynamic Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data?.statusWise?.map((item: any) => {
          const ui = getDynamicStyles(item.statusCode);
          return (
            <StatCard
              key={item.statusId}
              {...({
                title: ui.title,
                value: (item.current ?? 0).toString(),
                percentage: `+${item.percentage || 0}%`,
                Icon: ui.icon,
                iconBgColor: ui.color,
                cardBgColor: ui.bg,
              } as any)}
            />
          );
        })}

        <StatCard
          {...({
            title: "Urgent",
            value: (data?.summary?.urgentTickets?.current ?? 0).toString(),
            percentage: `${data?.summary?.urgentTickets?.percentage ?? 0}%`,
            Icon: AlertCircle,
            iconBgColor: "from-[#FB64B6] to-[#FF6467]",
            cardBgColor: "bg-[#FFF1F2]",
          } as any)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard label="Total Customers" value={(data?.totalCustomer ?? 0).toString()} Icon={Users} iconBgColor="from-[#8E51FF] to-[#615FFF]" />
        <SummaryCard label="Registered Products" value={(data?.totalProducts ?? 0).toString()} Icon={Package} iconBgColor="from-[#E12AFB] to-[#FF2056]" />
        <SummaryCard label="Active Technicians" value={(data?.activeTechnicians ?? 0).toString()} Icon={Activity} iconBgColor="from-[#615FFF] to-[#00B8DB]" />
        <SummaryCard label="Total Tickets" value={(data?.summary?.totalTickets?.current ?? 0).toString()} Icon={Ticket} iconBgColor="from-[#00B8DB] to-[#00BC7D]" />
      </div>
    </div>
  );
};

export default DashboardHero;