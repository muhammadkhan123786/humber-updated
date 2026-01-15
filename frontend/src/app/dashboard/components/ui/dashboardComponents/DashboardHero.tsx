import React from "react";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Package,
  Activity,
} from "lucide-react";

import { SummaryCard } from "./SummaryCard";
import StatCard from "./TicketCard";

const DashboardHero = () => {
  return (
    <div className="py-8  ">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[32px] font-extrabold text-[#4F39F6] tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-gray-500 font-medium">
            Welcome to Humber Mobility Scooter
          </p>
        </div>

        <button
          className="
  /* Layout & Typography */
  flex items-center gap-3 px-7 py-4 font-bold text-white rounded-2xl

  /* Gradient Colors from Design Assets */
  bg-linear-to-r from-[#4F39F6] to-[#9810FA]

  /* The Neon Glow Effect (Layered Shadows) */
  shadow-[0_15px_35px_-5px_rgba(79,57,246,0.5),0_10px_20px_-5px_rgba(152,16,250,0.3)]


  transition-all duration-300 transform-gpu
  hover:scale-[1.03] hover:-translate-y-1
  hover:shadow-[0_20px_40px_-5px_rgba(79,57,246,0.6)]
  active:scale-95 cursor-pointer group antialiased
"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            className="group-hover:rotate-12 transition-transform duration-300"
          >
            <g clipPath="url(#clip0_1_155)">
              <path
                d="M1.33325 6.00065C1.86368 6.00065 2.37239 6.21136 2.74747 6.58644C3.12254 6.96151 3.33325 7.47022 3.33325 8.00065C3.33325 8.53108 3.12254 9.03979 2.74747 9.41486C2.37239 9.78994 1.86368 10.0007 1.33325 10.0007V11.334C1.33325 11.6876 1.47373 12.0267 1.72378 12.2768C1.97382 12.5268 2.31296 12.6673 2.66659 12.6673H13.3333C13.6869 12.6673 14.026 12.5268 14.2761 12.2768C14.5261 12.0267 14.6666 11.6876 14.6666 11.334V10.0007C14.1362 10.0007 13.6274 9.78994 13.2524 9.41486C12.8773 9.03979 12.6666 8.53108 12.6666 8.00065C12.6666 7.47022 12.8773 6.96151 13.2524 6.58644C13.6274 6.21136 14.1362 6.00065 14.6666 6.00065V4.66732C14.6666 4.3137 14.5261 3.97456 14.2761 3.72451C14.026 3.47446 13.6869 3.33398 13.3333 3.33398H2.66659C2.31296 3.33398 1.97382 3.47446 1.72378 3.72451C1.47373 3.97456 1.33325 4.3137 1.33325 4.66732V6.00065Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66675 3.33398V4.66732"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66675 11.334V12.6673"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.66675 7.33398V8.66732"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_155">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <span className="tracking-tight text-lg">Create New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Open Tickets"
          percentage="+12%"
          Icon={Ticket}
          iconBgColor="from-[#00B8DB] to-[#00BBA7]"
          cardBgColor="bg-[#F0FDFF]"
        />
        <StatCard
          title="In Progress"
          percentage="+8%"
          Icon={Clock}
          iconBgColor="from-[#FF8C00] to-[#FF4500]"
          cardBgColor="bg-[#FFF7ED]"
          percentageColor="text-emerald-500"
        />
        <StatCard
          title="Completed"
          percentage="+23%"
          Icon={CheckCircle2}
          iconBgColor="from-[#00BC7D] to-[#7CCF00]"
          cardBgColor="bg-[#F0FDF4]"
          percentageColor="text-[#00A63E]"
        />
        <StatCard
          title="Urgent"
          percentage="-5%"
          Icon={AlertCircle}
          iconBgColor="from-[#FB64B6] to-[#FF6467]"
          cardBgColor="bg-[#FFF1F2]"
          percentageColor="text-[#FF2056]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          label="Total Customers"
          value="3"
          Icon={Users}
          iconBgColor="from-[#8E51FF] to-[#615FFF]"
        />
        <SummaryCard
          label="Registered Products"
          value="3"
          Icon={Package}
          iconBgColor="from-[#E12AFB] to-[#FF2056]"
        />
        <SummaryCard
          label="Active Technicians"
          value="3"
          Icon={Activity}
          iconBgColor="from-[#615FFF] to-[#00B8DB]"
        />
        <SummaryCard
          label="Total Tickets"
          value="3"
          Icon={Ticket}
          iconBgColor="from-[#00B8DB] to-[#00BC7D]"
        />
      </div>
    </div>
  );
};

export default DashboardHero;
