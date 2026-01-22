"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Clock,
  AlertCircle,
  Users,
  Package,
  Activity,
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
        const response: any = await getAlls(
          "/customer-tickets/ticket-count-status-wise",
        );
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

  const getStatusUI = (status: any) => {
    const displayId =
      typeof status.statusId === "object"
        ? status.statusId.name || status.statusId.code
        : status.statusId;

    const config = {
      title: displayId || "Status ID Missing",
      icon: Ticket,
      color: "from-[#4F39F6] to-[#9810FA]",
      bg: "bg-[#F5F3FF]",
    };
    if (displayId === "695e61d64a0436aac0dd3921") {
      config.icon = Ticket;
      config.color = "from-[#00B8DB] to-[#00BBA7]";
      config.bg = "bg-[#F0FDFF]";
    } else if (displayId === "695e62a44a0436aac0dd393f") {
      config.icon = Clock;
      config.color = "from-[#FF8C00] to-[#FF4500]";
      config.bg = "bg-[#FFF7ED]";
    }

    return config;
  };

  if (loading)
    return (
      <div className="py-8 animate-pulse text-gray-400">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[32px] font-extrabold text-[#4F39F6] tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-gray-500 font-medium">
            Welcome to Humber Mobility Scooter
          </p>
        </div>
        <Link href="/dashboard/ticket-masterdata/createTicket">
          <button className="flex items-center gap-3 px-7 py-4 font-bold text-white rounded-2xl bg-linear-to-r from-[#4F39F6] to-[#9810FA] shadow-[0_15px_35px_-5px_rgba(79,57,246,0.5)] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 active:scale-95 cursor-pointer group">
            <Ticket
              size={20}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="tracking-tight text-lg">Create New Ticket</span>
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data?.statusWise?.map((statusItem: any, index: number) => {
          const ui = getStatusUI(statusItem);
          return (
            <StatCard
              key={statusItem.statusId || index}
              {...({
                title: ui.title,
                value: (statusItem.current ?? 0).toString(),
                percentage: statusItem.percentage
                  ? `+${statusItem.percentage}%`
                  : "0%",
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
        <SummaryCard
          label="Total Customers"
          value={(data?.totalCustomer ?? 0).toString()}
          Icon={Users}
          iconBgColor="from-[#8E51FF] to-[#615FFF]"
        />
        <SummaryCard
          label="Registered Products"
          value={(data?.totalProducts ?? 0).toString()}
          Icon={Package}
          iconBgColor="from-[#E12AFB] to-[#FF2056]"
        />
        <SummaryCard
          label="Active Technicians"
          value={(data?.activeTechnicians ?? 0).toString()}
          Icon={Activity}
          iconBgColor="from-[#615FFF] to-[#00B8DB]"
        />
        <SummaryCard
          label="Total Tickets"
          value={(data?.summary?.totalTickets?.current ?? 0).toString()}
          Icon={Ticket}
          iconBgColor="from-[#00B8DB] to-[#00BC7D]"
        />
      </div>
    </div>
  );
};

export default DashboardHero;
