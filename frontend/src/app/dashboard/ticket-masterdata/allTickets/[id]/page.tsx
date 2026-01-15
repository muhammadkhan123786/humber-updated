"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { User, Package, ClipboardList, ArrowLeft } from "lucide-react";
import { getAlls } from "../../../../../helper/apiHelper";

const TicketDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketData = async () => {
      if (!id) return;
      try {
        // Use the exact helper and endpoint from your listing page
        const response = await getAlls(`/customer-tickets/${id}`);
        if (response && response.success) {
          setTicket(response.data);
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketData();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!ticket) return <div className="p-10 text-center">Ticket not found.</div>;

  const tabs = [
    "Issue Details",
    "Coverage",
    "Parts",
    "Invoice",
    "Activity Log",
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FF] p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-10">
          <button
            onClick={() => router.back()}
            className="mt-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              {/* DISPLAYING TICKET CODE FROM DB */}
              <h1 className="text-4xl font-bold text-[#1A1C1E] tracking-tight">
                {ticket.ticketCode}
              </h1>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#5E5CE6] text-white text-[10px] font-bold rounded-full uppercase">
                  {ticket.isActive ? "open" : "closed"}
                </span>
                <span className="px-3 py-1 bg-[#A282F1] text-white text-[10px] font-bold rounded-full uppercase">
                  medium
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Customer Card */}
          <div className="bg-white p-8 rounded-3xlshadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-6 text-gray-800 font-bold">
              <User size={20} className="text-gray-400" />
              <span>Customer</span>
            </div>
            <div className="space-y-1 text-sm text-gray-500">
              <p className="text-gray-900 font-bold text-lg mb-2">
                Mary Johnson
              </p>
              <p>mary.j@email.com</p>
              <p>555-0102</p>
              <p className="pt-2">456 Oak Ave, Springfield, IL 62702</p>
            </div>
          </div>

          {/* Product Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-6 text-gray-800 font-bold">
              <Package size={20} className="text-gray-400" />
              <span>Product</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="text-gray-900 font-bold text-lg mb-2">
                Drive Scout
              </p>
              <p>
                <span className="text-gray-400">Make:</span> Drive Medical
              </p>
              <p>
                <span className="text-gray-400">Model:</span> Scout Compact
              </p>
              <p>
                <span className="text-gray-400">S/N:</span> DM-SC-2024-045
              </p>
            </div>
          </div>

          {/* Ticket Info Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-6 text-gray-800 font-bold">
              <ClipboardList size={20} className="text-gray-400" />
              <span>Ticket Info</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="text-gray-400">Source:</span>{" "}
                <span className="text-gray-900 font-semibold ml-1">
                  {ticket.ticketSource}
                </span>
              </p>
              <p>
                <span className="text-gray-400">Location:</span>{" "}
                <span className="text-gray-900 font-semibold ml-1">
                  {ticket.location}
                </span>
              </p>
              <p>
                <span className="text-gray-400">Urgency:</span>{" "}
                <span className="text-gray-900 font-semibold ml-1">Medium</span>
              </p>
              <p>
                <span className="text-gray-400">Coverage:</span>{" "}
                <span className="text-gray-400 italic ml-1">Not Set</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-2xl w-fit mb-8">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                index === 0
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Issue Details Content Area */}
      </div>
    </div>
  );
};

export default TicketDetailPage;
