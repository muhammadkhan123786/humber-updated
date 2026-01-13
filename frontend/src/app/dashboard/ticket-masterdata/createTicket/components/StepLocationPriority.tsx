"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  Check,
  Wrench,
  Home,
  Truck,
  User,
  MapPin,
  Info,
} from "lucide-react";

const StepLocationPriority = ({
  onBack,
  onCreate,
}: {
  onBack: () => void;
  onCreate: () => void;
}) => {
  const [location, setLocation] = useState("workshop");
  const [urgency, setUrgency] = useState("low");
  const [technician, setTechnician] = useState("mike");
  const [address, setAddress] = useState("");

  const locations = [
    {
      id: "workshop",
      label: "Workshop",
      sub: "Bring to our facility",
      icon: Wrench,
      color: "bg-[#00D3F2]",
    },
    {
      id: "onsite",
      label: "On-Site",
      sub: "At customer location",
      icon: Home,
      color: "bg-linear-to-br from-[#C27AFF] to-[#FA1085]",
    },
    {
      id: "mobile",
      label: "Mobile Service",
      sub: "Send technician",
      icon: Truck,
      color: "bg-[#00D5BE]",
    },
  ];

  const urgencyLevels = [
    { id: "low", label: "Low", desc: "Can wait a few days" },
    { id: "medium", label: "Medium", desc: "Within 2-3 days" },
    { id: "high", label: "High", desc: "Needs attention within 24 hours" },
    {
      id: "emergency",
      label: "Emergency",
      desc: "Immediate attention required",
    },
  ];

  return (
    <div className="flex flex-col animate-in slide-in-from-right-8 duration-500 pb-10">
      <div className="bg-[#00C950] p-8 text-white rounded-t-3xl">
        <h2 className="text-xl font-bold tracking-tight">
          Location & Priority
        </h2>
        <p className="opacity-90 text-sm font-medium">
          Set repair location and urgency
        </p>
      </div>

      <div className="p-10 space-y-12">
        <section className="space-y-4">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest">
            Repair Location *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setLocation(loc.id)}
                className={`flex items-start gap-4 p-6 rounded-3xl border transition-all ${
                  location === loc.id
                    ? `${loc.color} text-white shadow-lg scale-[1.02] border-transparent`
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl ${
                    location === loc.id ? "bg-white/20" : "bg-gray-50"
                  }`}
                >
                  <loc.icon size={24} />
                </div>
                <div className="text-left">
                  <p className="font-black text-sm uppercase tracking-tight">
                    {loc.label}
                  </p>
                  <p
                    className={`text-[10px] font-bold ${
                      location === loc.id ? "text-white/80" : "text-gray-400"
                    }`}
                  >
                    {loc.sub}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {(location === "onsite" || location === "mobile") && (
          <section className="space-y-4 animate-in slide-in-from-top-4 duration-500">
            <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-2">
              <MapPin size={16} className="text-[#00D5BE]" /> Job Location
              Address *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter the specific address (e.g., 123 Main St, Springfield)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-5 rounded-2xl bg-[#F8FAFF] border border-[#EEF2FF] text-[#1E293B] font-bold outline-none focus:ring-2 ring-[#00D5BE]/20 transition-all"
              />
            </div>
            <p className="text-gray-400 text-[10px] font-bold flex items-center gap-1 uppercase tracking-tighter">
              <Info size={12} /> Technician will use this address for navigation
            </p>
          </section>
        )}
        <section className="space-y-4">
          <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest">
            Urgency Level *
          </label>
          <div className="space-y-3">
            {urgencyLevels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setUrgency(lvl.id)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  urgency === lvl.id
                    ? "bg-[#334155] border-transparent text-white shadow-md"
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
              >
                <div className="text-left">
                  <p className="font-black text-sm uppercase">{lvl.label}</p>
                  <p
                    className={`text-xs font-bold ${
                      urgency === lvl.id ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    {lvl.desc}
                  </p>
                </div>
                {urgency === lvl.id && (
                  <Check size={20} className="text-white" />
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-2">
              <User size={16} className="text-[#AD46FF]" /> Assign Technician
              (Optional)
            </label>
            <button
              onClick={() => setTechnician("")}
              className="text-[10px] font-black text-gray-400 uppercase tracking-tighter hover:text-red-500 transition-colors"
            >
              Clear Selection
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setTechnician("mike")}
              className={`relative p-6 rounded-4xl border-2 transition-all text-left ${
                technician === "mike"
                  ? "bg-[#AD46FF] border-[#AD46FF] text-white shadow-xl shadow-purple-100 scale-[1.02]"
                  : "bg-white border-gray-50 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-black text-lg">
                  MA
                </div>
                <div>
                  <p className="font-black text-sm tracking-tight uppercase">
                    Mike Anderson
                  </p>
                  <span className="bg-white/20 px-3 py-0.5 rounded-full text-[9px] font-black uppercase">
                    Available
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {["Electrical", "Battery"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[8px] bg-white/10 px-2 py-1 rounded-md font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {technician === "mike" && (
                <Check className="absolute top-4 right-4" size={16} />
              )}
            </button>
          </div>
        </section>
        <section className="p-8 rounded-4xl bg-[#F0FDF4] border border-[#00D5BE]/10 space-y-4">
          <h4 className="text-[#00D5BE] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
            <Check size={16} /> Review Your Ticket
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "Customer:", value: "Mary Johnson" },
              { label: "Location:", value: location.toUpperCase() },
              {
                label: "Address:",
                value:
                  location === "workshop"
                    ? "Bring to Shop"
                    : address || "Not Provided",
              },
              { label: "Urgency:", value: urgency.toUpperCase() },
              {
                label: "Technician:",
                value: technician === "mike" ? "Mike Anderson" : "Pending",
              },
            ].map((row, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b border-[#00D5BE]/5 pb-2"
              >
                <span className="text-[11px] font-black text-[#00D5BE] uppercase">
                  {row.label}
                </span>
                <span className="text-[13px] font-bold text-gray-600 truncate max-w-[200px]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>
        <div className="flex justify-between items-center pt-8 border-t border-gray-50">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <button
            onClick={onCreate}
            style={{
              background: "linear-gradient(90deg, #00C950 0%, #00BC7D 100%)",
              boxShadow: "0 10px 15px -3px rgba(0, 201, 80, 0.2)",
            }}
            className="flex items-center gap-2 px-8 py-3 rounded-[10px] font-bold text-white transition-all hover:scale-[1.05] active:scale-95 text-sm"
          >
            Create Ticket <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepLocationPriority;
