import React from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Search,
  FileText,
  CheckCircle,
  File,
  AlertCircle,
  User,
  Calendar,
} from "lucide-react";

type Status = "sent" | "approved" | "draft" | "rejected";

interface Quotation {
  id: string;
  ticket: string;
  customer: string;
  date: string;
  amount: string;
  status: Status;
}

const QuotationTable: React.FC = () => {
  const data: Quotation[] = [
    {
      id: "QUO-1738654321001",
      ticket: "TKT001",
      customer: "John Smith",
      date: "01 Feb 2024",
      amount: "£ 389.40",
      status: "sent",
    },
    {
      id: "QUO-1738654321002",
      ticket: "TKT002",
      customer: "Mary Johnson",
      date: "02 Feb 2024",
      amount: "£ 156.00",
      status: "approved",
    },
    {
      id: "QUO-1738654321003",
      ticket: "TKT003",
      customer: "David Brown",
      date: "03 Feb 2024",
      amount: "£ 159.60",
      status: "draft",
    },
    {
      id: "QUO-1738654321004",
      ticket: "TKT005",
      customer: "Michael Davis",
      date: "05 Feb 2024",
      amount: "£ 234.00",
      status: "rejected",
    },
  ];

  const getStatusStyle = (status: Status): string => {
    const styles: Record<Status, string> = {
      sent: "bg-blue-50 text-blue-500 border-blue-200",
      approved: "bg-green-50 text-green-500 border-green-200",
      draft: "bg-gray-50 text-gray-500 border-gray-200",
      rejected: "bg-red-50 text-red-500 border-red-200",
    };
    return styles[status];
  };

  return (
    <div className="p-8  bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-600">
      <div className="h-1 bg-linear-to-r from-indigo-500  to-purple-500 rounded-md" />
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="leading-none flex items-center gap-2 font-bold">
            <FileText size={20} className="text-[#6366F1]" />
            All Quotations
          </div>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-xs font-semibold border border-slate-200">
            4 quotations
          </span>
        </div>

        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by quotation number, ticket ID, or customer name..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#8B5CF6] text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Quotation No.
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Ticket No.
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Created Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="inline-flex items-center justify-center rounded-md  px-2 py-0.5 font-medium w-fit   bg-indigo-50 font-mono text-xs">
                      {row.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-50 px-2 py-1 font-medium rounded border border-slate-200 text-[11px] text-slate-500">
                      {row.ticket}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      {row.customer}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {row.date}
                    </div>
                  </td>
                  <td className="p-4 text-[#4F46E5] font-bold text-base">
                    {row.amount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getStatusStyle(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 border border-indigo-200 text-indigo-600 rounded-md text-xs font-semibold hover:bg-indigo-50 transition-all">
                        <Eye size={14} /> View
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 border border-blue-200 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-50 transition-all">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="p-1.5 border border-red-200 text-red-500 rounded-md hover:bg-red-50 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <SummaryCard
            icon={<FileText size={16} />}
            label="Sent"
            count="1"
            color="blue"
          />
          <SummaryCard
            icon={<CheckCircle size={16} />}
            label="Approved"
            count="1"
            color="green"
          />
          <SummaryCard
            icon={<File size={16} />}
            label="Draft"
            count="1"
            color="slate"
          />
          <SummaryCard
            icon={<AlertCircle size={16} />}
            label="Rejected"
            count="1"
            color="red"
          />
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  icon: React.ReactNode;
  label: string;
  count: string;
  color: "blue" | "green" | "slate" | "red";
}
const SummaryCard: React.FC<CardProps> = ({ icon, label, count, color }) => {
  const colors = {
    blue: {
      container: "bg-[#EFF6FF] border-[#DBEAFE]",
      iconText: "text-[#2563EB]",
      count: "text-[#1E40AF]",
    },
    green: {
      container: "bg-[#F0FDF4] border-[#DCFCE7]",
      iconText: "text-[#16A34A]",
      count: "text-[#166534]",
    },
    slate: {
      container: "bg-[#F8FAFC] border-[#E2E8F0]",
      iconText: "text-[#475569]",
      count: "text-[#1E293B]",
    },
    red: {
      container: "bg-[#FEF2F2] border-[#FEE2E2]",
      iconText: "text-[#DC2626]",
      count: "text-[#991B1B]",
    },
  };

  const style = colors[color];

  return (
    <div className={`p-4 rounded-xl border ${style.container}`}>
      <div
        className={`flex items-center gap-2 text-xs font-bold mb-2 ${style.iconText}`}
      >
        {icon} {label}
      </div>
      <div className={`text-2xl font-bold ${style.count}`}>{count}</div>
    </div>
  );
};

export default QuotationTable;
