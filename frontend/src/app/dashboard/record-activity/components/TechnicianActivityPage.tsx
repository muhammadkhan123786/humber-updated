"use client";
import React, { useState } from "react";
import {
  ClipboardList, Wrench, Package, CheckSquare, FileText,
  Settings, Image as ImageIcon, Clock, Save, Send
} from "lucide-react";

import { ActivityHero } from "./ActivityHero";
import { JobInfoTab } from "./JobInfoTab";
import { ServicesTab } from "./ServicesTab";
import { PartsTab } from "./PartsTab";
import { InspectionTab } from "./InspectionTab";
import { NotesTab } from "./NotesTab";

const TechnicianActivityPage = () => {
  const [activeTab, setActiveTab] = useState("Job Info");

  const tabs = [
    { id: "Job Info", label: "Job Info", icon: ClipboardList },
    { id: "Services", label: "Services", icon: Wrench },
    { id: "Parts", label: "Parts", icon: Package, badge: "2" },
    { id: "Inspection", label: "Inspection", icon: CheckSquare, badge: "0/8", badgeColor: "bg-emerald-500" },
    { id: "Notes", label: "Notes", icon: FileText },
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      case "Job Info": return <JobInfoTab />;
      case "Services": return <ServicesTab />;
      case "Parts": return <PartsTab />;
      case "Inspection": return <InspectionTab />;
      case "Notes": return <NotesTab />;
      default: return <JobInfoTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] p-4 md:p-8 pb-12">
      <ActivityHero />

      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex justify-center items-center p-2 bg-gray-50/50 border-b border-gray-100">
          <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${isActive ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <tab.icon size={16} className={isActive ? "text-[#4F39F6]" : "text-gray-400"} />
                  <span className="text-sm">{tab.label}</span>
                  {tab.badge && (
                    <span className={`ml-1 px-2 py-0.5 text-[10px] text-white rounded-full font-black ${tab.badgeColor || "bg-[#9810FA]"}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-8 min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-t-2xl shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
          <div className="flex items-center gap-2"><Settings size={14} className="text-[#4F39F6]" /><span>0 Activities</span></div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2"><Package size={14} className="text-[#9810FA]" /><span>2 Parts</span></div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2"><ImageIcon size={14} className="text-[#615FFF]" /><span>0 Media</span></div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2"><Clock size={14} className="text-[#FF8C00]" /><span>0m</span></div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer text-sm">
            <Save size={18} /><span>Save Draft</span>
          </button>
          <button className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white bg-[#00BC7D] hover:bg-[#009e69] transition-all shadow-lg shadow-emerald-100 cursor-pointer text-sm">
            <Send size={18} /><span>Submit Activity</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianActivityPage;