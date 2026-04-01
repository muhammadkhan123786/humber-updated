"use client";
import React from "react";
import { Eye, UserPlus, FileText, SquarePen } from "lucide-react";

const CallRecordsTable = () => {
  const records = [
    {
      id: "CL-1001",
      customer: "Robert Johnson",
      phone: "+44 7700 900123",
      type: "Support",
      purpose: "Mobility scooter battery issue",
      agent: "John Smith",
      duration: "12:34",
      priority: "High",
      status: "Resolved",
      date: "2026-03-10",
      time: "09:15 AM",
    },
    {
      id: "CL-1002",
      customer: "Emily Davis",
      phone: "+44 7700 900456",
      type: "Inquiry",
      purpose: "Product information request",
      agent: "Sarah Wilson",
      duration: "08:21",
      priority: "Medium",
      status: "In Progress",
      date: "2026-03-10",
      time: "09:45 AM",
    },
    {
      id: "CL-1003",
      customer: "Michael Brown",
      phone: "+44 7700 900789",
      type: "Complaint",
      purpose: "Delayed service appointment",
      agent: "Mike Johnson",
      duration: "15:47",
      priority: "Critical",
      status: "Escalated",
      date: "2026-03-10",
      time: "10:20 AM",
    },
    {
      id: "CL-1004",
      customer: "Jessica Miller",
      phone: "+44 7700 900321",
      type: "Sales Lead",
      purpose: "New scooter purchase inquiry",
      agent: "Emma Davis",
      duration: "18:56",
      priority: "Low",
      status: "Follow-Up",
      date: "2026-03-10",
      time: "11:05 AM",
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-linear-to-br from-pink-400 to-purple-500 text-white shadow-sm">
          <FileText size={20} />
        </div>
        <h2 className="text-gray-800 font-bold text-lg">Call Records (8)</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm font-semibold border-b border-gray-50">
              <th className="px-6 py-4">Call ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Call Type</th>
              <th className="px-6 py-4">Purpose</th>
              <th className="px-6 py-4">Agent</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4 text-center">Priority</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {records.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-6 py-5 text-sm font-bold text-gray-800">
                  {row.id}
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-gray-700">
                  {row.customer}
                </td>
                <td className="px-6 py-5 text-sm text-gray-500">{row.phone}</td>
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getTypeStyles(row.type)}`}
                  >
                    {row.type}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600 max-w-[200px] truncate">
                  {row.purpose}
                </td>
                <td className="px-6 py-5 text-sm text-gray-700 font-medium">
                  {row.agent}
                </td>
                <td className="px-6 py-5 text-sm text-gray-500 font-mono">
                  {row.duration}
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${getPriorityStyles(row.priority)}`}
                    >
                      {row.priority}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusStyles(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div className="font-medium text-gray-600">{row.date}</div>
                    <div>{row.time}</div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200">
                      <SquarePen size={16} />
                    </button>
                    <button className="p-2 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100">
                      <UserPlus size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const getTypeStyles = (type: string) => {
  switch (type) {
    case "Support":
      return "bg-blue-50 text-blue-500 border-blue-200";
    case "Inquiry":
      return "bg-indigo-50 text-indigo-500 border-indigo-200";
    case "Complaint":
      return "bg-sky-50 text-sky-500 border-sky-200";
    case "Sales Lead":
      return "bg-blue-50 text-blue-500 border-blue-200";
    default:
      return "bg-gray-50 text-gray-500 border-gray-200";
  }
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-orange-50 text-orange-600 border border-orange-200";
    case "Medium":
      return "bg-yellow-50 text-yellow-600 border border-yellow-200";
    case "Critical":
      return "bg-red-50 text-red-600 border border-red-200";
    case "Low":
      return "bg-blue-50 text-blue-600 border border-blue-200";
    default:
      return "bg-gray-50 text-gray-500";
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    case "In Progress":
      return "bg-blue-50 text-blue-600 border border-blue-200";
    case "Escalated":
      return "bg-red-50 text-red-600 border border-red-200";
    case "Follow-Up":
      return "bg-amber-50 text-amber-600 border border-amber-200";
    default:
      return "bg-gray-50 text-gray-500";
  }
};

export default CallRecordsTable;
