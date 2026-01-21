import React, { useState } from "react";
import {
  Search,
  LayoutGrid,
  List,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Star,
} from "lucide-react";

interface ManageTechnicianListProps {
  technicians: any[];
  onEdit: (tech: any) => void;
  onDelete: (id: string) => void;
}

const ManageTechnicianList = ({
  technicians,
  onEdit,
  onDelete,
}: ManageTechnicianListProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 font-sans">
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search technicians..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold ${viewMode === "grid" ? "bg-[#F54900] text-white" : "text-slate-500"}`}
          >
            <LayoutGrid size={16} /> Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold ${viewMode === "table" ? "bg-[#F54900] text-white" : "text-slate-500"}`}
          >
            <List size={16} /> Table
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FFF8F5] border-b border-slate-100">
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase">
                  ID
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase">
                  Name
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase">
                  Specialization
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase">
                  Contact
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase">
                  Status
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase">
                  Salary
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((tech) => (
                <tr
                  key={tech._id}
                  className="border-b border-slate-50 hover:bg-slate-50/50"
                >
                  <td className="p-5">
                    <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-[10px] font-bold">
                      {tech.employeeId || "N/A"}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold uppercase">
                        {tech.personId?.firstName[0]}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 leading-none">{`${tech.personId?.firstName} ${tech.personId?.lastName}`}</div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {tech.contactId?.emailId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-1">
                      {tech.specializationIds?.map((s: any) => (
                        <span
                          key={s._id}
                          className="text-[9px] font-black uppercase px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full border border-purple-100"
                        >
                          {s.MasterServiceType}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                      <Phone size={12} /> {tech.contactId?.mobileNumber}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin size={12} /> {tech.addressId?.city}
                    </div>
                  </td>
                  <td className="p-5">
                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-full border ${tech.technicianStatus === "Available" ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}
                    >
                      {tech.technicianStatus}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="text-purple-600 font-black text-sm">
                      £{tech.salary?.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {tech.paymentFrequency}
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(tech)}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(tech._id)}
                        className="p-2 bg-slate-100 text-red-500 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={16} />
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
          {technicians.map((tech) => (
            <div
              key={tech._id}
              className="bg-white rounded-3xl border-t-4 border-t-orange-500 p-6 shadow-sm hover:shadow-xl transition-all"
            >
              {/* Header: Avatar, Name, and Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-xl uppercase">
                    {tech.personId?.firstName[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 leading-tight">
                      {tech.personId?.firstName} {tech.personId?.lastName}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {tech.employeeId || "TECH-000"}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-black px-2 py-1 rounded-full flex items-center gap-1 ${
                    tech.technicianStatus === "Available"
                      ? "bg-green-50 text-green-600"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {tech.technicianStatus === "Available"
                    ? "✓ Available"
                    : "⊘ Busy"}
                </span>
              </div>

              {/* NEW: Rating and Specialization */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < 4 ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-500">
                  4.8
                </span>
              </div>

              <div className="mb-4">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100 text-[10px] font-black uppercase">
                  {tech.specializationIds?.[0]?.MasterServiceType || "General"}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 px-3 py-2 bg-blue-50/50 rounded-xl text-[11px] text-slate-600">
                  <div className="text-blue-500">✉</div>
                  {tech.contactId?.emailId || "n/a@example.com"}
                </div>
                <div className="flex items-center gap-3 px-3 py-2 bg-pink-50/50 rounded-xl text-[11px] text-slate-600">
                  <Phone size={12} className="text-pink-500" />
                  {tech.contactId?.mobileNumber}
                </div>
                <div className="flex items-center gap-3 px-3 py-2 bg-green-50/50 rounded-xl text-[11px] text-slate-600">
                  <MapPin size={12} className="text-green-500" />
                  {tech.addressId?.city}, {tech.addressId?.address}
                </div>
              </div>

              {/* NEW: Stats Grid (Active Jobs & Completed) */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-orange-50/50 p-3 rounded-2xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    Active Jobs
                  </div>
                  <div className="text-lg font-black text-orange-600">3</div>
                </div>
                <div className="bg-green-50/50 p-3 rounded-2xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    Completed
                  </div>
                  <div className="text-lg font-black text-green-600">156</div>
                </div>
              </div>

              {/* Salary and Actions */}
              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                    Salary{" "}
                    <span className="ml-2 text-[9px] text-purple-400 uppercase">
                      {tech.paymentFrequency}
                    </span>
                  </div>
                  <div className="text-xl font-black text-purple-600">
                    £{tech.salary?.toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(tech)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-bold hover:bg-blue-100 transition-colors"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(tech._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTechnicianList;
