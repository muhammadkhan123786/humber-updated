"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  List,
  Eye,
  Download,
  User,
  Calendar,
  Send,
  Table,
} from "lucide-react";
import { CustomSelect } from "../../../common-form/CustomSelect";

const InvoicesSection = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewType, setViewType] = useState("table");

  const handleView = (id: any) => {
    router.push(`/dashboard/invoice-management/view/${id}`);
  };

  const statusOptions = [
    { id: "all", label: "All Statuses" },
    { id: "sent", label: "Sent" },
    { id: "paid", label: "Paid" },
    { id: "overdue", label: "Overdue" },
    { id: "draft", label: "Draft" },
  ];

  const sortOptions = [
    { id: "desc", label: "Amount (Highest)" },
    { id: "asc", label: "Amount (Lowest)" },
    { id: "newest", label: "Newest Date" },
  ];

  const invoicesData = [
    {
      id: "INV-2026-0002",
      jobId: "JOB-2024-002",
      ticket: "TKT-2024-002",
      customer: "John Davies",
      email: "john.davies@email.com",
      model: "Invacare Colibri",
      date: "11/01/2026",
      dueDate: "25/01/2026",
      amount: "634.11",
      status: "Sent",
    },
    {
      id: "INV-2026-0004",
      jobId: "JOB-2024-004",
      ticket: "TKT-2024-004",
      customer: "Robert Johnson",
      email: "robert.j@email.com",
      model: "Kymco Midi XLS",
      date: "11/01/2026",
      dueDate: "25/01/2026",
      amount: "425.50",
      status: "Sent",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* Search and Filters Section */}
      <div className="w-full p-4 bg-white rounded-2xl border-2 border-indigo-100 flex flex-col lg:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by invoice number, customer..."
            className="w-full h-10 pl-10 pr-4 bg-gray-100 border-2 border-indigo-50 rounded-[10px] text-sm outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="min-w-40">
            <CustomSelect
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Select Status"
            />
          </div>
          <div className="min-w-[180px]">
            <CustomSelect
              options={sortOptions}
              value={sortOrder}
              onChange={setSortOrder}
              placeholder="Sort By"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewType("grid")}
              className={`p-2.5 rounded-[10px] border transition-all ${viewType === "grid" ? "bg-indigo-600 text-white" : "bg-slate-50 border-indigo-100 text-indigo-900"}`}
            >
              <Table size={18} />
            </button>
            <button
              onClick={() => setViewType("table")}
              className={`p-2.5 rounded-[10px] border transition-all ${viewType === "table" ? "bg-indigo-600 text-white" : "bg-slate-50 border-indigo-100 text-indigo-900"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewType === "table" ? (
        <div className="w-full overflow-x-auto bg-white rounded-2xl border-2 border-indigo-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-indigo-50 bg-slate-50/50">
                <th className="p-4 font-bold text-gray-900">Invoice No.</th>
                <th className="p-4 font-bold text-gray-900">Job ID</th>
                <th className="p-4 font-bold text-gray-900">Ticket No.</th>
                <th className="p-4 font-bold text-gray-900">Customer Name</th>
                <th className="p-4 font-bold text-gray-900">Scooter Model</th>
                <th className="p-4 font-bold text-gray-900">Invoice Date</th>
                <th className="p-4 font-bold text-gray-900">Due Date</th>
                <th className="p-4 font-bold text-gray-900 text-right">
                  Amount
                </th>
                <th className="p-4 font-bold text-gray-900">Status</th>
                <th className="p-4 font-bold text-gray-900 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invoicesData.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-indigo-50 hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-indigo-600">
                    {inv.id}
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-mono">
                    {inv.jobId}
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-mono">
                    {inv.ticket}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {inv.customer}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {inv.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{inv.model}</td>
                  <td className="p-4 text-sm text-gray-600">{inv.date}</td>
                  <td className="p-4 text-sm text-gray-600">{inv.dueDate}</td>
                  <td className="p-4 text-sm font-bold text-green-700 text-right">
                    £{inv.amount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit
                      ${inv.status === "Sent" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      <Send size={10} /> {inv.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(inv.id)}
                        className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50">
                        <Download size={14} />
                      </button>
                      <button className="p-1.5 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50">
                        <Send size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoicesData.map((inv) => (
            <InvoiceCard
              key={inv.id}
              {...inv}
              onView={() => handleView(inv.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
const InvoiceCard = ({
  id,
  date,
  status,
  customer,
  model,
  jobId,
  ticket,
  amount,
  dueDate,
  statusColor = "blue",
  onView,
}: any) => {
  const colors: any = {
    blue: "bg-blue-100 border-blue-300 text-blue-700",
    green: "bg-green-100 border-green-300 text-green-700",
    red: "bg-red-100 border-red-300 text-red-700",
  };

  return (
    <div className="w-full bg-white rounded-2xl border-2 hover:border-blue-500 border-indigo-100 p-6 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-medium text-indigo-600">{id}</h4>
          <span className="text-gray-500 text-sm">{date}</span>
        </div>
        <div
          className={`px-2.5 py-1 border rounded-[10px] flex items-center gap-1.5 ${colors[statusColor]}`}
        >
          <Send size={12} className="text-current" />
          <span className="text-xs font-normal leading-4">{status}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="p-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-indigo-600" />
            <span className="font-semibold text-gray-900">{customer}</span>
          </div>
          <p className="text-xs text-gray-600">{model}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 bg-purple-50 border border-purple-100 rounded-xl">
            <span className="text-[10px] text-gray-600 mb-1 block">Job ID</span>
            <span className="font-mono text-sm font-semibold text-purple-700">
              {jobId}
            </span>
          </div>
          <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl">
            <span className="text-gray-500 text-[10px] uppercase block mb-1">
              Ticket
            </span>
            <span className="font-mono text-sm font-semibold text-green-700">
              {ticket}
            </span>
          </div>
        </div>

        <div className="p-4 bg-linear-to-r from-green-600 to-emerald-600 rounded-lg text-white">
          <span className="text-sm opacity-90 block mb-1">Total Amount</span>
          <span className="text-3xl font-bold tracking-tight">£{amount}</span>
        </div>

        <div className="flex items-center gap-2 px-1">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-gray-600">Due:</span>
          <span className="text-gray-900 text-sm font-semibold">{dueDate}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onView}
          className="flex-1 h-10 bg-indigo-600 text-white rounded-[10px] flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
        >
          <Eye size={16} />
          <span className="text-sm font-medium">View</span>
        </button>
        <button className="w-11 h-10 bg-slate-50 border-2 border-indigo-100 rounded-[10px] flex items-center justify-center text-indigo-900 hover:bg-indigo-50 transition-all">
          <Download size={18} />
        </button>
        <button className="w-11 h-10 bg-slate-50 border-2 border-emerald-100 rounded-[10px] flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition-all">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default InvoicesSection;
