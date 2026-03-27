"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Settings,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Eye,
  Edit,
  Trash2,
  Mail,
  MessageSquare,
  Send,
  Smartphone,
  Users,
  UserCheck,
} from "lucide-react";
import { getAll, deleteItem } from "@/helper/apiHelper";
import toast from "react-hot-toast";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";

const MessageAlertDashboard = () => {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRules, setTotalRules] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const PAGE_LIMIT = 8;
  const totalAlerts = rules.length;
  const activeAlerts = rules.filter((rule) => rule.isActive === true).length;
  const inactiveAlerts = rules.filter((rule) => rule.isActive === false).length;

  const uniqueModules = new Set(rules.map((rule) => rule.moduleId?._id)).size;

  const stats = [
    {
      title: "Total Alerts",
      count: totalAlerts,
      icon: <Bell size={28} />,
      gradient: "from-[#1E69FF] to-[#0047D6]",
    },
    {
      title: "Active Alerts",
      count: activeAlerts,
      icon: <CheckCircle2 size={28} />,
      gradient: "from-[#00BA63] to-[#009450]",
    },
    {
      title: "Inactive Alerts",
      count: inactiveAlerts,
      icon: <XCircle size={28} />,
      gradient: "from-[#FF5D24] to-[#E84A12]",
    },
    {
      title: "Form Modules",
      count: uniqueModules,
      icon: <Settings size={28} />,
      gradient: "from-[#B347FF] to-[#D61E9A]",
    },
  ];

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAll<any>(
        `/notification-rules?page=${currentPage}&limit=${PAGE_LIMIT}`,
      );
      setRules(response.data || []);
      setTotalRules(response.total || response.data?.length || 0);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load alert rules");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      try {
        await deleteItem("/notification-rules", id);
        toast.success("Rule deleted successfully");
        fetchRules();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete rule");
      }
    }
  };

  const handleEdit = (rule: any) => {
    router.push(`/dashboard/message-alert-setup?id=${rule._id}`);
  };

  const handleView = (rule: any) => {
    console.log("View rule:", rule);
    toast.success(`Viewing: ${rule.notificationRulesName}`);
  };
  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.notificationRulesName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.eventKeyId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && rule.isActive === true) ||
      (statusFilter === "inactive" && rule.isActive === false);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(totalRules / PAGE_LIMIT) || 1;
  const getChannelIcon = (channelName: string) => {
    const name = channelName?.toLowerCase() || "";
    if (name.includes("email")) return <Mail size={12} />;
    if (name.includes("sms")) return <MessageSquare size={12} />;
    if (name.includes("whatsapp")) return <Send size={12} />;
    if (name.includes("push")) return <Bell size={12} />;
    return <Smartphone size={12} />;
  };
  const getRecipientIcon = (recipient: string) => {
    const name = recipient?.toLowerCase() || "";
    if (name.includes("customer")) return <Users size={12} />;
    if (name.includes("admin")) return <Settings size={12} />;
    if (name.includes("technician")) return <UserCheck size={12} />;
    if (name.includes("staff")) return <UserCheck size={12} />;
    return <Users size={12} />;
  };

  return (
    <div className="p-8 bg-[#F8F9FD] min-h-screen font-sans">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#E440FF] p-3 rounded-2xl shadow-lg shadow-purple-100 text-white">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1E1F4B]">
              Message Alert Setup
            </h1>
            <p className="text-sm text-[#808191]">
              Manage automated notification configurations
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            console.log("Add new alert");
            toast.success("Opening alert setup form");
          }}
          className="flex items-center gap-2 bg-linear-to-r from-[#B347FF] to-[#D61E9A] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all"
        >
          <Plus size={18} />
          Add Message Alert Setup
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative overflow-hidden p-6 rounded-3xl text-white bg-linear-to-br ${stat.gradient} shadow-lg`}
          >
            <div className="relative z-10">
              <p className="text-xs font-medium opacity-80 mb-1">
                {stat.title}
              </p>
              <h3 className="text-3xl font-bold">{stat.count}</h3>
            </div>
            <div className="absolute right-4 bottom-4 opacity-30">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 flex flex-wrap items-center gap-4 mb-8">
        <div className="flex-1 min-w-[300px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ACB5BD]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F9FD] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter size={18} className="text-[#808191]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F9FD] border border-slate-100 rounded-xl px-4 py-2 text-sm text-[#1E1F4B] outline-none cursor-pointer font-medium"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center bg-[#F8F9FD] p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center  hover:bg-green-600 gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-[#B347FF] text-white shadow-sm"
                : "text-[#808191] hover:bg-slate-100"
            }`}
          >
            <LayoutGrid size={14} />
            Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 hover:bg-green-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "table"
                ? "bg-[#B347FF] text-white shadow-sm"
                : "text-[#808191] hover:bg-slate-100"
            }`}
          >
            <List size={14} />
            Table
          </button>
        </div>
      </div>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-[#808191]">
          Showing {filteredRules.length} of {totalRules} alerts
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No alert rules found</p>
          <button
            onClick={() => {
              console.log("Add new alert");
              toast.success("Opening alert setup form");
            }}
            className="mt-4 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <Plus size={16} />
            Create your first alert rule
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRules.map((rule: any) => (
            <div
              key={rule._id}
              className="bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col"
            >
              <div className="p-6 bg-[#FFF5F9] border-b border-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[17px] font-bold text-[#1E1F4B] leading-tight">
                    {rule.notificationRulesName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                      rule.isActive
                        ? "bg-[#00D26A] text-white"
                        : "bg-slate-400 text-white"
                    }`}
                  >
                    {rule.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-[12px] text-[#808191] font-medium opacity-80">
                  {rule.description || "Send notification alert"}
                </p>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-5 grow">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-wider">
                      Module
                    </p>
                    <span className="inline-block bg-[#F8F9FD] border border-slate-100 px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#1E1F4B]">
                      {rule.moduleId?.moduleName || "N/A"}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-wider">
                      Status
                    </p>
                    <span className="inline-block bg-[#E9F2FF] border border-[#B3D4FF] px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#1E69FF]">
                      {rule.eventKeyId?.name}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2.5 tracking-wider">
                    Channels
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rule.channels?.map((ch: any, idx: number) => (
                      <span
                        key={idx}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-[11px] font-bold shadow-sm ${
                          ch.channelId?.channelName.toLowerCase() === "whatsapp"
                            ? "bg-[#00D26A]"
                            : ch.channelId?.channelName.toLowerCase() === "sms"
                              ? "bg-[#1E69FF]"
                              : "bg-[#B347FF]"
                        }`}
                      >
                        {getChannelIcon(ch.channelId?.channelName)}
                        {ch.channelId?.channelName}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2.5 tracking-wider">
                    Recipients
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rule.recipients?.map((recipient: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-[#F4EAFF] text-[#B347FF] border border-[#E6CEFF] px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase"
                      >
                        {getRecipientIcon(recipient)}
                        {recipient}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Created:</span>
                    <span className="text-slate-500">
                      {new Date(rule.createdAt).toISOString().split("T")[0]}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Modified:</span>
                    <span className="text-slate-500">
                      {new Date(rule.updatedAt).toISOString().split("T")[0]}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => handleView(rule)}
                    className="flex-1 py-2.5 rounded-2xl border border-slate-100 text-[12px] font-bold text-[#1E1F4B] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <Eye size={16} className="text-[#1E69FF]" /> View
                  </button>
                  <button
                    onClick={() => handleEdit(rule)}
                    className="flex-1 py-2.5 rounded-2xl bg-[#F4EAFF] text-[#B347FF] text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-[#EBD6FF] transition-all shadow-sm"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rule._id)}
                    className="p-2.5 rounded-2xl border border-red-50 text-red-500 hover:bg-red-50 transition-all shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-[#FDFCFD]">
                <tr>
                  {[
                    "Form Name",
                    "Module",
                    "Status Trigger",
                    "Channels",
                    "Recipients",
                    "Status",
                    "Last Modified",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-5 text-left text-[13px] font-bold text-[#1E1F4B] tracking-tight"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-50">
                {filteredRules.map((rule) => (
                  <tr
                    key={rule._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-bold text-[#1E1F4B] mb-0.5">
                        {rule.notificationRulesName}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {rule.description || "Send notification alert"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block bg-[#F8F9FD] border border-slate-100 px-3 py-1 rounded-full text-[11px] font-medium text-slate-600">
                        {rule.moduleId?.moduleName || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block bg-[#E9F2FF] border border-[#B3D4FF] px-3 py-1 rounded-full text-[11px] font-medium text-[#1E69FF]">
                        {rule.eventKeyId?.name}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        {rule.channels?.map((ch: any, idx: number) => (
                          <div
                            key={idx}
                            className={`p-1.5 rounded-md text-white shadow-sm ${
                              ch.channelId?.channelName.toLowerCase() ===
                              "whatsapp"
                                ? "bg-[#00D26A]"
                                : ch.channelId?.channelName.toLowerCase() ===
                                    "sms"
                                  ? "bg-[#1E69FF]"
                                  : "bg-[#B347FF]"
                            }`}
                          >
                            {getChannelIcon(ch.channelId?.channelName)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {rule.recipients?.map(
                          (recipient: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#F4EAFF] text-[#B347FF] border border-[#E6CEFF]"
                            >
                              {recipient}
                            </span>
                          ),
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                          rule.isActive
                            ? "bg-[#00D26A] text-white"
                            : "bg-slate-400 text-white"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full bg-white ${rule.isActive ? "animate-pulse" : ""}`}
                        />
                        {rule.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[12px] font-medium text-slate-500">
                      {new Date(rule.updatedAt).toISOString().split("T")[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(rule)}
                          className="p-2 text-slate-400 hover:text-[#1E69FF] hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(rule)}
                          className="p-2 text-slate-400 hover:text-[#B347FF] hover:bg-purple-50 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(rule._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default MessageAlertDashboard;
