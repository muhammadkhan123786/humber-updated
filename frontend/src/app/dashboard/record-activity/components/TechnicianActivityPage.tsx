"use client";
import React, { useState } from "react";
import {
  Package,
  CheckSquare,
  FileText,
  Settings,
  Image as ImageIcon,
  Clock,
  Save,
  Send,
  Briefcase,
} from "lucide-react";

import { ActivityHero } from "./ActivityHero";
import { JobInfoTab } from "./JobInfoTab";
import { ServicesTab } from "./ServicesTab";
import { PartsTab } from "./PartsTab";
import { InspectionTab } from "./InspectionTab";
import { NotesTab } from "./NotesTab";
import { useActivityRecordForm } from "../../../../hooks/useActivity";

const TechnicianActivityPage = () => {
  const [activeTab, setActiveTab] = useState("Job Info");

  const {
    form,
    isLoading,
    error,
    success,
    tickets,
    technicians,
    serviceTypes,
    parts,
    inspectionTypes,
    jobStatuses,
    serviceFields,
    partFields,

    addService,
    removeService,
    addPart,
    removePart,

    calculatePartTotal,
    handleJobNotesImageUpload,
    removeJobNotesImage,
    addMessage,
    removeMessage,
    handleSubmit,
    totalDuration,
    totalPartsCost,
    completedInspections,
    totalMedia,
  } = useActivityRecordForm();

  const actualPartsCount = partFields.filter(
    (part) => part.partId && part.partId.trim() !== "",
  ).length;

  const actualServicesCount = serviceFields.filter(
    (service) => service.activityId && service.activityId.trim() !== "",
  ).length;

  const tabs = [
    { id: "Job Info", label: "Job Info", icon: Briefcase },
    {
      id: "Services",
      label: "Services",
      icon: Settings,
    },
    {
      id: "Parts",
      label: "Parts",
      icon: Package,

      badgeColor: "bg-[#A855F7]",
    },
    {
      id: "Inspection",
      label: "Inspection",
      icon: CheckSquare,
      badge: `${completedInspections}/${inspectionTypes.length}`,
      badgeColor: "bg-emerald-500",
    },
    {
      id: "Notes",
      label: "Notes",
      icon: FileText,
    },
  ];

  const formatTotalTime = (total: number) => {
    if (total < 60) return `${total}m`;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h}h ${m}m`;
  };

  const handleFormSubmit = async () => {
    const data = form.getValues();
    try {
      const result = await handleSubmit(data);
      if (result?.success) {
        console.log("Activity submitted successfully!");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleSaveDraft = () => {
    const formData = form.getValues();
    localStorage.setItem("activityDraft", JSON.stringify(formData));
    console.log("Draft saved locally");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Job Info":
        return (
          <JobInfoTab
            form={form}
            tickets={tickets}
            technicians={technicians}
            jobStatuses={jobStatuses}
          />
        );
      case "Services":
        return (
          <ServicesTab
            form={form}
            serviceTypes={serviceTypes}
            serviceFields={serviceFields}
            addService={addService}
            removeService={removeService}
            totalDuration={totalDuration}
          />
        );
      case "Parts":
        return (
          <PartsTab
            form={form}
            parts={parts}
            partFields={partFields}
            addPart={addPart}
            removePart={removePart}
            calculatePartTotal={calculatePartTotal}
            totalPartsCost={totalPartsCost}
          />
        );
      case "Inspection":
        return <InspectionTab form={form} inspectionTypes={inspectionTypes} />;
      case "Notes":
        return (
          <NotesTab
            form={form}
            handleJobNotesImageUpload={handleJobNotesImageUpload}
            removeJobNotesImage={removeJobNotesImage}
            addMessage={addMessage}
            removeMessage={removeMessage}
          />
        );
      default:
        return (
          <JobInfoTab form={form} tickets={tickets} technicians={technicians} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] p-4 md:p-8 pb-12">
      {/* Pass the props to ActivityHero */}
      <ActivityHero
        actualServicesCount={actualServicesCount}
        actualPartsCount={actualPartsCount}
        completedInspections={completedInspections}
        totalInspectionTypes={inspectionTypes.length}
        totalMedia={totalMedia}
        totalDuration={totalDuration}
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-600 font-medium">
          {success}
        </div>
      )}

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

                  {tab.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 text-[9px] text-white rounded-md font-black ${
                        tab.badgeColor || "bg-[#9810FA]"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
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
            <Settings size={14} className="text-[#4F39F6]" />
            <span>{actualServicesCount} Activities</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Package size={14} className="text-[#9810FA]" />
            <span>{actualPartsCount} Parts</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <ImageIcon size={14} className="text-[#615FFF]" />
            <span>{totalMedia} Media</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#FF8C00]" />
            <span>{formatTotalTime(totalDuration)}</span>
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
