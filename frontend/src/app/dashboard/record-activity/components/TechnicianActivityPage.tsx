"use client";
import { Briefcase, Save, Send } from "lucide-react";

import { ActivityHero } from "./ActivityHero";
import { JobInfoTab } from "./JobInfoTab";
import { useActivityRecordForm } from "../../../../hooks/useActivity";

const TechnicianActivityPage = () => {
  const { form, isLoading, technicians, quotations, handleSubmit } =
    useActivityRecordForm();

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

  return (
    <div className="min-h-screen bg-[#F8F9FF] p-4 md:p-8 pb-12">
      <ActivityHero
        actualServicesCount={0}
        actualPartsCount={0}
        completedInspections={0}
        totalInspectionTypes={0}
        totalMedia={0}
        totalDuration={0}
      />
      <div className="w-full bg-white rounded-2xl shadow-sm border p-6 md:p-10 border-gray-100 overflow-hidden">
        <div className="mb-8 pb-4 border-b border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Briefcase size={20} className="text-[#4F39F6]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Job Information</h2>
            <p className="text-sm text-gray-500">
              Record activity details for the assigned job
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="min-h-[300px]">
            <JobInfoTab
              form={form}
              technicians={technicians}
              quotations={quotations}
            />
          </div>
        </form>
      </div>

      <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 mt-8 flex items-center justify-end rounded-t-2xl shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
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
