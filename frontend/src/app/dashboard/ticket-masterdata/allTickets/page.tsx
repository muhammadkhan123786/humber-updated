"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  Clock,
  Settings,
  Globe,
  Calendar,
  Home,
  ChevronRight,
  Inbox,
  Phone,
  UserCheck,
  User,
  Trash2,
  Edit3,
  MoreVertical,
} from "lucide-react";
import { deleteItem, getAlls } from "../../../../helper/apiHelper";

const TicketListingPage = () => {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    urgency: "",
    source: "",
  });
  const router = useRouter();
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm?.trim()) params.append("searchTerm", searchTerm.trim());
      if (filters.status) params.append("ticketStatusId", filters.status);
      if (filters.urgency) params.append("priorityId", filters.urgency);
      if (filters.source) params.append("ticketSource", filters.source);

      const response = await getAlls(`/customer-tickets?${params.toString()}`);

      if (response && response.success && Array.isArray(response.data)) {
        const mappedData = response.data.map((t: any) => {
          return {
            ...t,
            customerName:
              t.userId?.name ||
              (t.userId?.email ? t.userId.email.split("@")[0] : "Unknown"),
            productName: t.vehicleId?.name || "Drive Scout",
            issue: t.issue_Details || "No details provided",
            status: t.ticketStatusId?.code || "in progress",
            urgency: t.priorityId?.serviceRequestPrioprity || "high",
            source: t.ticketSource || "Online",
            location: t.location || "Workshop",
            technician:
              t.assignedTechnicianId?.length > 0 ? "Assigned" : "Not Assigned",
            createdAt: t.createdAt
              ? new Date(t.createdAt).toLocaleDateString()
              : "N/A",
          };
        });
        setTickets(mappedData);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.warn("API Error:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTickets();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getSourceIcon = (source: string) => {
    const s = source?.toLowerCase();
    if (s?.includes("phone"))
      return <Phone size={14} className="text-gray-400" />;
    if (s?.includes("walk"))
      return <UserCheck size={14} className="text-gray-400" />;
    return <Globe size={14} className="text-gray-400" />;
  };

  const getStatusBadge = (status: string = "") => {
    const statusMap: Record<string, string> = {
      open: "bg-[#00A3FF]",
      "in progress": "bg-[#FF8A00]",
      completed: "bg-[#00C853]",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-white text-[10px] font-bold lowercase ${
          statusMap[status.toLowerCase()] || "bg-gray-400"
        }`}
      >
        {status}
      </span>
    );
  };

  const getUrgencyBadge = (urgency: string = "") => {
    const urgencyMap: Record<string, string> = {
      high: "bg-[#FF4D00]",
      medium: "bg-[#FFB800]",
      low: "bg-[#545F66]",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded text-white text-[9px] font-black uppercase ${
          urgencyMap[urgency.toLowerCase()] || "bg-gray-400"
        }`}
      >
        {urgency}
      </span>
    );
  };
  const handleEdit = (ticket: any) => {
    router.push(`createTicket?id=${ticket._id}`);

    console.log("Editing:", ticket);
  };
  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this ticket? This action cannot be undone.",
    );
    if (isConfirmed) {
      try {
        setLoading(true);

        const response = await deleteItem("/customer-tickets", id);

        if (response && response.success) {
          setTickets((prev) => prev.filter((ticket) => ticket._id !== id));

          console.log(response.message || "Ticket deleted successfully");
        } else {
          alert(response.message || "Failed to delete ticket");
        }
      } catch (err: any) {
        console.error("Delete Error:", err);
        alert(err.message || "An error occurred while deleting the ticket.");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="p-8 bg-[#F8F9FF] min-h-screen font-sans text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#6D28D9]">Service Tickets</h1>
          <p className="text-gray-500 text-xs font-medium">
            Manage and track all service tickets
          </p>
        </div>
        <Link href="/dashboard/ticket-masterdata/createTicket">
          <button className="flex items-end justify-center gap-2 text-white font-bold text-sm rounded-[10px] transition-all hover:opacity-90 shadow-[0_10px_15px_-3px_rgba(79,57,246,0.3)] bg-linear-to-r from-[#4F39F6] to-[#9810FA] pt-[12px] pr-[12px] pb-[13px] pl-[12px]">
            <Plus size={18} strokeWidth={3} />
            Create New Ticket
          </button>
        </Link>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            placeholder="Search tickets, customers, products..."
            className="w-full pl-12 pr-4 py-3 bg-[#F3F4F6]/50 rounded-xl border border-transparent focus:bg-white focus:border-purple-200 text-sm outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-[#F8F9FD] border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-600 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="695e62b94a0436aac0dd3944">Open</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="urgency"
            value={filters.urgency}
            onChange={handleFilterChange}
            className="bg-[#F8F9FD] border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-600 outline-none cursor-pointer"
          >
            <option value="">All Urgencies</option>
            <option value="6965f40cdac61db61224caaf">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            name="source"
            value={filters.source}
            onChange={handleFilterChange}
            className="bg-[#F8F9FD] border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-600 outline-none cursor-pointer"
          >
            <option value="">All Sources</option>
            <option value="phone">Phone</option>
            <option value="online">Online</option>
          </select>

          <div className="flex bg-[#F3F4F6] p-1 rounded-xl">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-all ${
                view === "grid"
                  ? "bg-[#6D28D9] text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-2 rounded-lg transition-all ${
                view === "table"
                  ? "bg-[#6D28D9] text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-gray-400 text-[11px] font-bold italic mb-6">
        Showing {tickets.length} of {tickets.length} tickets
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6D28D9] mb-4"></div>
          <p className="text-gray-500 font-medium">Fetching records...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
          <div className="bg-purple-50 p-6 rounded-full mb-6">
            <Inbox size={48} className="text-[#6D28D9]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No Tickets Found</h3>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({ status: "", urgency: "", source: "" });
            }}
            className="mt-4 text-[#6D28D9] font-bold text-sm underline"
          >
            Clear Filters
          </button>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {tickets.map((t) => (
            <div
              key={t._id}
              className="bg-white flex flex-col justify-between hover:shadow-lg transition-all border border-gray-50 relative overflow-hidden"
              style={{
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0px 10px 15px -3px rgba(79, 57, 246, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    "linear-gradient(90deg, #2B7FFF 0%, #00B8DB 100%)",
                }}
              />

              <div className="pt-2">
                {" "}
                <div className="flex justify-between items-center mb-2">
                  <div
                    className="flex items-center gap-2 font-semibold text-[13px]"
                    style={{ color: "#4F39F6" }}
                  >
                    <Clock size={16} strokeWidth={2.5} />
                    <span>{t.ticketCode || t.displayId}</span>
                  </div>
                  {getUrgencyBadge(t.urgency)}
                </div>
                <div className="mb-6">{getStatusBadge(t.status)}</div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F5F3FF] flex items-center justify-center text-[#6D28D9]">
                      <User size={18} />
                    </div>
                    <span className="text-[15px] font-bold text-gray-900">
                      {t.customerName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-9 h-9 flex items-center justify-center">
                      <Settings size={18} className="text-[#A78BFA]" />
                    </div>
                    <span className="text-[14px] font-medium">
                      {t.productName}
                    </span>
                  </div>
                </div>
                <div className="min-h-[60px] mb-6">
                  <p className="text-[14px] text-gray-600 leading-relaxed font-normal">
                    {t.issue}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-100/80">
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    {getSourceIcon(t.source)}
                    <span className="text-[12px] font-medium">{t.source}</span>
                  </div>

                  <div className="flex items-center gap-2 justify-end text-gray-400">
                    <Home size={14} className="text-orange-400" />
                    <span className="text-[12px] font-medium">
                      {t.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-[12px] font-medium">
                      {t.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <User size={14} style={{ color: "#4F39F6" }} />
                    <span
                      className="text-[12px] font-bold uppercase"
                      style={{ color: "#4F39F6" }}
                    >
                      {t.technician}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/ticket-masterdata/allTickets/${t._id}`}
                  className="w-full mt-6 font-bold text-[14px] flex items-center justify-end gap-1 hover:gap-2 transition-all cursor-pointer"
                  style={{ color: "#4F39F6" }}
                >
                  View Details <ChevronRight size={18} strokeWidth={3} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FD] text-[#6D28D9] text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Ticket ID</th>
                <th className="px-6 py-5 whitespace-nowrap">Customer</th>
                <th className="px-6 py-5 whitespace-nowrap">Product</th>
                <th className="px-6 py-5 whitespace-nowrap">Issue</th>
                <th className="px-6 py-5 whitespace-nowrap">Status</th>
                <th className="px-6 py-5 whitespace-nowrap">Urgency</th>
                <th className="px-6 py-5 whitespace-nowrap">Source</th>
                <th className="px-6 py-5 whitespace-nowrap">Location</th>
                <th className="px-6 py-5 whitespace-nowrap">Technician</th>
                <th className="px-6 py-5 whitespace-nowrap">Created</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tickets.map((t) => (
                <tr
                  key={t._id}
                  className="hover:bg-purple-50/30 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-[#6D28D9] text-xs whitespace-nowrap">
                    <Link
                      href={`/tickets/${t._id}`}
                      className="hover:underline"
                    >
                      {t.ticketCode || t.displayId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700 text-xs whitespace-nowrap">
                    {t.customerName}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {t.productName}
                  </td>
                  <td className="px-6 py-4 text-[11px] text-gray-400 italic max-w-xs truncate">
                    {t.issue}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                  <td className="px-6 py-4">{getUrgencyBadge(t.urgency)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase">
                      {getSourceIcon(t.source)} {t.source}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase">
                      <Home size={13} className="text-orange-300" />{" "}
                      {t.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-[9px] font-bold uppercase">
                        {typeof t.technician === "string"
                          ? t.technician.slice(0, 2)
                          : "UN"}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-white text-[9px] font-bold ${
                          t.technician && t.technician !== "Unassigned"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {t.technician}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-gray-500 font-bold whitespace-nowrap">
                    {t.createdAt}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === t._id ? null : t._id)
                      }
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {activeMenu === t._id && (
                      <>
                        <div
                          className="fixed inset-0 "
                          onClick={() => setActiveMenu(null)}
                        />

                        <div
                          className="absolute right-12 bottom-0 w-36 bg-white border border-gray-100 py-1 animate-in slide-in-from-bottom-2 duration-200"
                          style={{
                            borderRadius: "12px",
                            boxShadow:
                              "0px 10px 15px -3px rgba(79, 57, 246, 0.2)",
                          }}
                        >
                          <button
                            onClick={() => {
                              handleEdit(t);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50"
                          >
                            <Edit3 size={16} className="text-gray-400" />
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              handleDelete(t._id);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50 border-t border-gray-50"
                          >
                            <Trash2 size={16} className="text-red-400" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketListingPage;
