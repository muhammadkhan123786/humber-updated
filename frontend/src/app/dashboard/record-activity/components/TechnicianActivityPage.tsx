"use client";
import { useState } from "react";
import {
  Briefcase,
  Settings,
  Package,
  CheckSquare,
  FileText,
  Clock,
  Save,
  Send,
  Image as ImageIcon,
} from "lucide-react";

import { ActivityHero } from "./ActivityHero";
import { JobInfoTab } from "./JobInfoTab";
import { useActivityRecordForm } from "../../../../hooks/useActivity";

const TechnicianActivityPage = () => {
  const [activeTab, setActiveTab] = useState("Job Info");

  const { form, isLoading, technicians, quotations, handleSubmit } =
    useActivityRecordForm();

  const tabs = [
    { id: "Job Info", label: "Job Info", icon: Briefcase },
    { id: "Services", label: "Services", icon: Settings },
    { id: "Parts", label: "Parts", icon: Package },
    { id: "Inspection", label: "Inspection", icon: CheckSquare },
    { id: "Notes", label: "Notes", icon: FileText },
  ];

  const handleFormSubmit = async () => {
    const data = form.getValues();
    try {
      await handleSubmit(data);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleSaveDraft = () => {
    const formData = form.getValues();
    localStorage.setItem("activityDraft", JSON.stringify(formData));
    console.log("Draft saved locally");
  };
  const ComingSoon = ({ tabName }: { tabName: string }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6">
        {tabName === "Services" && (
          <Settings size={36} className="text-[#4F39F6] opacity-50" />
        )}
        {tabName === "Parts" && (
          <Package size={36} className="text-[#4F39F6] opacity-50" />
        )}
        {tabName === "Inspection" && (
          <CheckSquare size={36} className="text-[#4F39F6] opacity-50" />
        )}
        {tabName === "Notes" && (
          <FileText size={36} className="text-[#4F39F6] opacity-50" />
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {tabName} no data
      </h3>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Job Info":
        return (
          <JobInfoTab
            form={form}
            technicians={technicians}
            quotations={quotations}
          />
        );
      case "Services":
        return <ComingSoon tabName="Services" />;
      case "Parts":
        return <ComingSoon tabName="Parts" />;
      case "Inspection":
        return <ComingSoon tabName="Inspection" />;
      case "Notes":
        return <ComingSoon tabName="Notes" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] p-4 md:p-8 pb-12">
      {/* Hero Section (Static values for now to preserve design) */}
      <ActivityHero
        actualServicesCount={0}
        actualPartsCount={0}
        completedInspections={0}
        totalInspectionTypes={0}
        totalMedia={0}
        totalDuration={0}
      />

      <div className="w-full bg-white rounded-2xl shadow-sm border p-5 py-12 border-gray-100 overflow-hidden">
        <div className="flex justify-center items-center p-2 bg-linear-to-r from-blue-100 to-purple-100 rounded-2xl overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center gap-2 p-1 rounded-2xl">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon
                    size={14}
                    className={isActive ? "text-[#4F39F6]" : "text-gray-400"}
                  />
                  <span className="text-[13px]">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form>
          <div className="py-4 min-h-[400px]">{renderTabContent()}</div>
        </form>
      </div>

      <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-t-2xl shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-[#4F39F6]" />
            <span>Job Information</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-gray-400" />
            <span>0 Activities</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Package size={14} className="text-gray-400" />
            <span>0 Parts</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <ImageIcon size={14} className="text-gray-400" />
            <span>0 Media</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <span>0m</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white bg-[#00BC7D] hover:bg-[#009e69] transition-all shadow-lg shadow-emerald-100 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            <span>{isLoading ? "Submitting..." : "Submit Activity"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianActivityPage;
