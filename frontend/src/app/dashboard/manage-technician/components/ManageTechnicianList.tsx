import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  Briefcase,
  Star,
  Search,
  LayoutGrid,
  List,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

const ManageTechnicianList = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  // Mock data based on your images
  const technicians = [
    {
      id: "TECH-001",
      name: "John Michael Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, 94102",
      specialization: "Electrical",
      status: "Available",
      rating: 4.8,
      activeJobs: 3,
      completedJobs: 156,
      salary: "£5,000",
      frequency: "MONTHLY",
    },
    {
      id: "TECH-002",
      name: "Sarah Jane Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, 94103",
      specialization: "Mechanical",
      status: "Busy",
      rating: 4.9,
      activeJobs: 5,
      completedJobs: 203,
      salary: "£250",
      frequency: "DAILY",
    },
  ];

  const stats = [
    {
      label: "TOTAL TECHNICIANS",
      value: "2",
      growth: "+8.5%",
      color: "from-[#F54900] to-[#E60076]",
      icon: <Users size={24} />,
    },
    {
      label: "AVAILABLE NOW",
      value: "1",
      growth: "+12.3%",
      color: "from-[#00CC66] to-[#00994C]",
      icon: <CheckCircle2 size={24} />,
    },
    {
      label: "ACTIVE JOBS",
      value: "8",
      growth: "-3.2%",
      color: "from-[#00B4DB] to-[#0083B0]",
      icon: <Briefcase size={24} />,
    },
    {
      label: "AVG. RATING",
      value: "4.85",
      growth: "+2.1%",
      color: "from-[#E60076] to-[#7A003F]",
      icon: <Star size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 font-sans">
      {/* 1. Gradient Header */}
      <div className="rounded-3xl p-8 bg-linear-to-r from-[#F54900] via-[#E7000B] to-[#E60076] text-white flex justify-between items-center shadow-2xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Technician Management
          </h1>
          <p className="opacity-90 font-medium">
            Manage your technical workforce
          </p>
        </div>
        <button className="bg-white text-[#E7000B] px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
          <Plus size={20} /> Register New Technician
        </button>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-3xl p-6 bg-linear-to-br ${stat.color} text-white shadow-xl group transition-all hover:-translate-y-1`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest opacity-80">
                {stat.label}
              </span>
              <div className="p-2 bg-white/20 rounded-xl">{stat.icon}</div>
            </div>
            <div className="text-4xl font-black mb-4">{stat.value}</div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                {stat.growth}
              </span>
              <span className="text-[10px] opacity-70">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filter & Toggle Bar */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search technicians by name, email, or phone..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "grid" ? "bg-[#F54900] text-white shadow-md" : "text-slate-500"}`}
          >
            <LayoutGrid size={16} /> Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "table" ? "bg-[#F54900] text-white shadow-md" : "text-slate-500"}`}
          >
            <List size={16} /> Table
          </button>
        </div>
      </div>

      {/* 4. Content Area */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF8F5] border-b border-slate-100">
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  ID
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Name
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Specialization
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Contact
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Jobs
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Salary
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((tech) => (
                <tr
                  key={tech.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-5 text-[11px] font-bold">
                    <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-lg">
                      {tech.id}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 leading-none">
                          {tech.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {tech.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100">
                      {tech.specialization}
                    </span>
                  </td>
                  <td className="p-5 space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <Phone size={12} /> {tech.phone}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <MapPin size={12} /> {tech.location}
                    </div>
                  </td>
                  <td className="p-5">
                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-full flex items-center w-fit gap-1 ${tech.status === "Available" ? "bg-green-50 text-green-600 border border-green-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`}
                    >
                      {tech.status === "Available" ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <Briefcase size={10} />
                      )}{" "}
                      {tech.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-2">
                      <div className="bg-orange-50 p-2 rounded-xl text-center min-w-[40px]">
                        <div className="text-[10px] text-orange-400 font-bold uppercase">
                          Active
                        </div>
                        <div className="text-sm font-black text-orange-600">
                          {tech.activeJobs}
                        </div>
                      </div>
                      <div className="bg-green-50 p-2 rounded-xl text-center min-w-[40px]">
                        <div className="text-[10px] text-green-400 font-bold uppercase">
                          Done
                        </div>
                        <div className="text-sm font-black text-green-600">
                          {tech.completedJobs}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-purple-600 font-black text-sm">
                      {tech.salary}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">
                      {tech.frequency}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 bg-slate-100 text-red-500 rounded-lg hover:bg-red-50 transition-all">
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
              key={tech.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl transition-all border-t-4 border-t-orange-500"
            >
              {/* Grid Card implementation */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800">
                      {tech.name}
                    </h4>
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">
                      {tech.id}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full ${tech.status === "Available" ? "bg-green-50 text-green-600 border border-green-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`}
                >
                  {tech.status}
                </span>
              </div>
              {/* Card details omitted for brevity, match the Table styling */}
              <div className="mt-6 flex gap-2">
                <button className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                  <Edit size={14} /> Edit
                </button>
                <button className="flex-1 py-2 bg-slate-50 text-red-500 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-50">
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
