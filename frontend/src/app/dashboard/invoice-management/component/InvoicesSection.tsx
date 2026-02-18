"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/ui/Pagination";

import {
  Search,
  List,
  Eye,
  Download,
  User,
  Calendar,
  Send,
  Table,
  Edit,
  Trash2,
} from "lucide-react";
import { CustomSelect } from "../../../common-form/CustomSelect";
import axios from "axios";
import toast from "react-hot-toast";
import { downloadInvoicePDF } from "./InvoicePDF";

const getAuthHeader = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return {};
  const cleanToken = token.replace(/^"|"$/g, "").trim();
  return { Authorization: `Bearer ${cleanToken}` };
};

const InvoicesSection = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewType, setViewType] = useState("grid");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 10;

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage]);

  const fetchInvoices = async (page = 1) => {
    try {
      setLoading(true);

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

      const response = await axios.get(
        `${baseUrl}/customer-invoices?page=${page}&limit=${limit}`,
        {
          headers: getAuthHeader(),
        },
      );

      if (response.data?.success) {
        setInvoices(response.data.data || []);
        setCurrentPage(response.data.page || 1);

        const total = response.data.total || 0;
        setTotalPages(Math.ceil(total / limit));
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/invoice-management/view/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/customer-invoice?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this invoice? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

      const response = await axios.delete(
        `${baseUrl}/customer-invoices/${id}`,
        {
          headers: getAuthHeader(),
        },
      );

      if (response.data?.success) {
        toast.success("Invoice deleted successfully");

        fetchInvoices();
      } else {
        toast.error("Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      setDownloadingId(id);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
      const response = await axios.get(`${baseUrl}/customer-invoices/${id}`, {
        headers: getAuthHeader(),
      });

      if (response.data?.success && response.data?.data) {
        const invoiceData = response.data.data;
        downloadInvoicePDF(invoiceData);
        toast.success("PDF downloaded successfully");
      } else {
        toast.error("Failed to fetch invoice details");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-700 border-green-300";
      case "SENT":
      case "ISSUED":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "DRAFT":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  const statusOptions = [
    { id: "all", label: "All Statuses" },
    { id: "ISSUED", label: "Sent" },
    { id: "PAID", label: "Paid" },
    { id: "DRAFT", label: "Draft" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  const sortOptions = [
    { id: "desc", label: "Amount (Highest)" },
    { id: "asc", label: "Amount (Lowest)" },
    { id: "newest", label: "Newest Date" },
  ];

  const filteredInvoices = invoices.filter((inv: any) => {
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;

    const matchesSearch = inv.invoiceId
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const sortedInvoices = [...filteredInvoices].sort((a: any, b: any) => {
    if (sortOrder === "desc") return b.netTotal - a.netTotal;
    if (sortOrder === "asc") return a.netTotal - b.netTotal;
    if (sortOrder === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-gray-500">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="w-full p-4 bg-white rounded-2xl border-2 border-indigo-100 flex flex-col lg:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by invoice number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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

      {sortedInvoices.length === 0 ? (
        <div className="w-full p-12 bg-white rounded-2xl border-2 border-indigo-100 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-lg">No invoices found</p>
        </div>
      ) : viewType === "table" ? (
        <div className="w-full overflow-x-auto bg-white rounded-2xl border-2 border-indigo-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-indigo-50 bg-slate-50/50">
                <th className="p-4 font-bold text-gray-900">Invoice No.</th>
                <th className="p-4 font-bold text-gray-900">Job ID</th>
                <th className="p-4 font-bold text-gray-900">Customer Name</th>
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
              {sortedInvoices.map((inv: any) => (
                <tr
                  key={inv._id}
                  className="border-b border-indigo-50 hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-indigo-600">
                    {inv.invoiceId}
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-mono">
                    {inv.jobId?.jobId || inv.jobId}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {inv.customerId?.personId?.firstName || "N/A"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {inv.customerId?.contactId?.emailId || ""}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatDate(inv.invoiceDate)}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="p-4 text-sm font-bold text-green-700 text-right">
                    £{formatCurrency(inv.netTotal)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${getStatusColor(inv.status)}`}
                    >
                      <Send size={10} /> {inv.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(inv._id)}
                        className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        title="View Invoice"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(inv._id)}
                        className="p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                        title="Edit Invoice"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(inv._id)}
                        disabled={deletingId === inv._id}
                        className={`p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ${
                          deletingId === inv._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title="Delete Invoice"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDownload(inv._id)}
                        disabled={downloadingId === inv._id}
                        className={`p-1.5 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors ${
                          downloadingId === inv._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title="Download PDF"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        className="p-1.5 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        title="Send Email"
                      >
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
          {sortedInvoices.map((inv: any) => (
            <InvoiceCard
              key={inv._id}
              id={inv.invoiceId}
              mongoId={inv._id}
              date={formatDate(inv.invoiceDate)}
              status={inv.status}
              customer={inv.customerId?.personId?.firstName || "N/A"}
              model={
                inv.jobId?.ticketId?.vehicleId?.vehicleModelId?.modelName ||
                "N/A"
              }
              jobId={inv.jobId?.jobId || inv.jobId}
              ticket={inv.jobId?.ticketId?.ticketCode || "N/A"}
              amount={formatCurrency(inv.netTotal)}
              dueDate={formatDate(inv.dueDate)}
              statusColor={
                inv.status === "PAID"
                  ? "green"
                  : inv.status === "DRAFT"
                    ? "gray"
                    : "blue"
              }
              onView={() => handleView(inv._id)}
              onEdit={() => handleEdit(inv._id)}
              onDelete={() => handleDelete(inv._id)}
              onDownload={() => handleDownload(inv._id)}
              isDownloading={downloadingId === inv._id}
              isDeleting={deletingId === inv._id}
            />
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
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
  onEdit,
  onDelete,
  onDownload,
  onEmail,
  isDownloading,
  isDeleting,
}: any) => {
  const colors: any = {
    blue: "bg-blue-100 border-blue-300 text-blue-700",
    green: "bg-green-100 border-green-300 text-green-700",
    red: "bg-red-100 border-red-300 text-red-700",
    gray: "bg-gray-100 border-gray-300 text-gray-700",
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
        <button
          onClick={onEdit}
          className="w-11 h-10 bg-amber-500 text-white rounded-[10px] flex items-center justify-center hover:bg-amber-600 transition-all"
          title="Edit Invoice"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className={`w-11 h-10 bg-red-500 text-white rounded-[10px] flex items-center justify-center hover:bg-red-600 transition-all ${
            isDeleting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Delete Invoice"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className={`w-11 h-10 bg-slate-50 border-2 border-indigo-100 rounded-[10px] flex items-center justify-center text-indigo-900 hover:bg-indigo-50 transition-all ${
            isDownloading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Download PDF"
        >
          <Download size={18} />
        </button>
        <button
          onClick={onEmail}
          className="w-11 h-10 bg-slate-50 border-2 border-emerald-100 rounded-[10px] flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition-all"
          title="Send Email"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default InvoicesSection;
