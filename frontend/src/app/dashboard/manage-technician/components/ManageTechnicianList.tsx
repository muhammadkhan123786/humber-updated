import React, { useState } from "react";
import {
  Search,
  List,
  Phone,
  MapPin,
  Trash2,
  Star,
  Grid3X3,
  User,
  CheckCircle2,
  Ban,
  Mail,
  Edit3,
  Clock,
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
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 transition-colors group-focus-within:text-indigo-600"
            size={20}
          />
          <input
            type="text"
            placeholder="Search technicians by name, email, or phone..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-sm border-2 border-orange-100 outline-none transition-all
                     placeholder:text-gray-500
                     focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:shadow-sm"
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold ${viewMode === "grid" ? "bg-[#F54900] text-white" : "text-slate-500"}`}
          >
            <Grid3X3 size={16} /> Grid
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
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-1 w-full bg-linear-to-r from-orange-500 via-red-500 to-pink-500" />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
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
                    <th className="p-5 text-[11px] font-black text-slate-400 uppercase text-center">
                      Rating
                    </th>
                    <th className="p-5 text-[11px] font-black text-slate-400 uppercase text-center">
                      Jobs
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
                      className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="p-5">
                        <span className="bg-[#FFF8F5] text-orange-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-orange-100">
                          {tech.employeeId || "TECH-001"}
                        </span>
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-sm shrink-0">
                            <User size={20} />
                          </div>
                          <div className="min-w-fit">
                            <div className="text-sm font-bold text-slate-800 leading-none truncate max-w-[150px]">{`${tech.personId?.firstName} ${tech.personId?.lastName}`}</div>
                            <div className="text-[11px] text-slate-400 mt-1 truncate max-w-[150px]">
                              {tech.contactId?.emailId}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {tech.specializationIds?.map((s: any) => (
                            <span
                              key={s._id}
                              className="text-[9px] font-black uppercase px-2 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100 flex items-center gap-1"
                            >
                              <div className="w-1 h-1 rounded-full bg-purple-600" />
                              {s.MasterServiceType}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="text-[11px] text-slate-600 font-medium flex items-center gap-2 mb-1 whitespace-nowrap">
                          <Phone size={12} className="text-purple-500" />{" "}
                          {tech.contactId?.mobileNumber}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 whitespace-nowrap">
                          <MapPin size={12} className="text-slate-400" />{" "}
                          {tech.addressId?.address}
                        </div>
                      </td>

                      <td className="p-5">
                        <span
                          className={`text-[10px] font-black px-3 py-1.5 rounded-full border flex items-center gap-1 w-fit whitespace-nowrap ${
                            tech.technicianStatus === "Available"
                              ? "bg-green-50 text-green-600 border-green-100"
                              : "bg-orange-50 text-orange-600 border-orange-100"
                          }`}
                        >
                          {tech.technicianStatus === "Available" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {tech.technicianStatus}
                        </span>
                      </td>

                      <td className="p-5 text-center">
                        <div className="flex flex-col items-center">
                          <div className="flex text-yellow-400 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                fill={i < 4 ? "currentColor" : "none"}
                                className={i < 4 ? "" : "text-slate-200"}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700">
                            4.8
                          </span>
                        </div>
                      </td>

                      {/* 4. Jobs Styled as Boxes */}
                      <td className="p-5">
                        <div className="flex flex-col gap-1.5 items-center">
                          <div className="bg-[#FFF1F1] border border-red-50 px-3 py-1 rounded-xl flex flex-col items-center min-w-[55px]">
                            <span className="text-[8px] font-bold text-slate-500 uppercase">
                              Active
                            </span>
                            <span className="text-xs font-black text-red-600">
                              {tech.activeJobs}
                            </span>
                          </div>
                          <div className="bg-[#E6FFFA] border border-emerald-50 px-3 py-1 rounded-xl flex flex-col items-center min-w-[55px]">
                            <span className="text-[8px] font-bold text-slate-500 uppercase">
                              Done
                            </span>
                            <span className="text-xs font-black text-emerald-600">
                              156
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="text-purple-600 font-black text-sm whitespace-nowrap">
                          £{tech.salary?.toLocaleString()}
                        </div>
                        <div className="text-[9px] font-bold text-purple-400 uppercase">
                          {tech.paymentFrequency}
                        </div>
                      </td>

                      {/* 5. Fixed Actions Section */}
                      <td className="p-5">
                        <div className="flex justify-center gap-2 min-w-[180px]">
                          <button
                            onClick={() => onEdit(tech)}
                            className="flex items-center gap-1 px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-[11px] font-bold hover:bg-[#007bff] hover:text-white hover:border-[#007bff] transition-all"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => onDelete(tech._id)}
                            className="flex items-center gap-1 px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-[11px] font-bold hover:bg-[#e60050] hover:text-white hover:border-[#e60050] transition-all"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <div
              key={tech._id}
              className="relative bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border-t-0 hover:shadow-2xl transition-all overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-orange-500 via-red-500 to-pink-500" />

              <div className="flex justify-between items-start mb-4 mt-2">
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg">
                    <User size={28} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-950 text-lg leading-tight">
                      {tech.personId?.firstName} {tech.personId?.lastName}
                    </h4>
                    <div className="mt-1 inline-block px-2 py-0.5 bg-orange-50 rounded text-[10px] font-mono text-gray-500">
                      {tech.employeeId || "TECH-001"}
                    </div>
                  </div>
                </div>

                {/* 3. Status Badge: Updated logos for Available (✓) and Busy (⊘) */}
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm ${
                    tech.technicianStatus === "Available"
                      ? "bg-linear-to-r from-emerald-100 to-green-100 text-emerald-700"
                      : "bg-linear-to-r from-orange-100 to-red-100 text-red-600"
                  }`}
                >
                  {tech.technicianStatus === "Available" ? (
                    <>
                      <CheckCircle2 size={12} /> Available
                    </>
                  ) : (
                    <>
                      <Ban size={12} /> Busy
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < 4 ? "#facb15" : "none"}
                      className={i < 4 ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">4.8</span>
              </div>

              {/* 5. Specialization: Updated to Full Length with Figma Gradient */}
              <div className="w-full mb-5">
                <div className="w-full flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200/50">
                  <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span className="text-purple-700 text-xs font-bold">
                    {tech.specializationIds?.[0]?.MasterServiceType ||
                      "Electrical"}
                  </span>
                </div>
              </div>

              {/* Contact Info: Using soft gradients per Figma */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl text-xs text-gray-700 border border-blue-100/50">
                  <Mail size={14} className="text-blue-500" />
                  <span className="truncate">
                    {tech.contactId?.emailId || "john.smith@example.com"}
                  </span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2.5 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl text-xs text-gray-700 border border-purple-100/50">
                  <Phone size={14} className="text-purple-500" />
                  {tech.contactId?.mobileNumber || "+1 (555) 123-4567"}
                </div>
                <div className="flex items-center gap-3 px-3 py-2.5 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl text-xs text-gray-700 border border-green-100/50">
                  <MapPin size={14} className="text-green-500" />
                  <span className="truncate">
                    {tech.addressId?.address ||
                      "123 Tech Street, San Francisco"}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100">
                <div className="bg-linear-to-br from-orange-50 to-red-50 p-3 rounded-xl border border-orange-100/50">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">
                    Active Jobs
                  </div>
                  <div className="text-2xl font-black text-orange-600">
                    {tech.activeJobs}
                  </div>
                </div>
                <div className="bg-linear-to-br from-emerald-50 to-green-50 p-3 rounded-xl border border-green-100/50">
                  <div className="text-[10px] font-bold text-gray-500 uppercase">
                    Completed
                  </div>
                  <div className="text-2xl font-black text-emerald-600">
                    156
                  </div>
                </div>
              </div>

              {/* Salary & Actions */}
              <div className="flex justify-between items-center bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-4">
                <div className="w-full">
                  {/* Container for Label and Frequency */}
                  <div className="flex justify-between items-center w-full mb-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      Salary
                    </span>
                    {/* Frequency is now pushed to the right side */}
                    <span className="text-purple-600 text-[10px] font-black uppercase">
                      {tech.paymentFrequency || "Monthly"}
                    </span>
                  </div>

                  {/* Large Salary Value */}
                  <div className="text-2xl font-black text-purple-600">
                    £{tech.salary?.toLocaleString() || "0"}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(tech)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-slate-600 rounded-xl text-xs font-bold border border-slate-200 transition-all duration-300
    hover:bg-[#007bff] hover:text-white hover:border-[#007bff] hover:shadow-[0px_4px_12px_rgba(0,123,255,0.3)]"
                >
                  <Edit3 size={14} /> Edit
                </button>

                <button
                  onClick={() => onDelete(tech._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-slate-600 rounded-xl text-xs font-bold border border-slate-200 transition-all duration-300
    hover:bg-[#e60050] hover:text-white hover:border-[#e60050] hover:shadow-[0px_4px_12px_rgba(230,0,80,0.3)]"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTechnicianList;
