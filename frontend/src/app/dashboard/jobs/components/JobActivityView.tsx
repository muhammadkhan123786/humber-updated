"use client";
import { useState, useEffect } from "react";
import { Briefcase, Settings, Package, ClipboardList, FileText, ArrowLeft, X } from "lucide-react";
import TechnicianInspection from "./TechnicianInspectionModal";
import { jobsAnimations } from "./JobsAnimation";
import JobInfo from "./JobInfo";
import Services from "./Services";
import Parts from "./Parts";
import axios from "axios";
import TechniciansActivity from "./TechniciansActivity";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export type ActivityTabType = 'jobinfo' | 'services' | 'parts' | 'inspection' | 'notes' | 'technician-activities';

interface JobActivityViewProps {
  job: any;
  onClose: () => void;
}

const JobActivityView = ({ job, onClose }: JobActivityViewProps) => {
  const [activeTab, setActiveTab] = useState<ActivityTabType>('jobinfo');
  const [isAnimating, setIsAnimating] = useState(false);
  const [inspectionBadge, setInspectionBadge] = useState<string>('0/0');
  const [currentInspectionTime, setCurrentInspectionTime] = useState<"BEFORE SERVICE" | "AFTER SERVICE">("BEFORE SERVICE");

  useEffect(() => {
    // Trigger animation on mount
    setIsAnimating(true);
    // Load inspection counts
    loadInspectionCounts(currentInspectionTime);
  }, []);

  useEffect(() => {
    // Reset animation when tab changes
    setIsAnimating(false);
    const timer = setTimeout(() => setIsAnimating(true), 50);
    
    // When leaving inspection tab, show combined count
    if (activeTab !== 'inspection') {
      loadInspectionCounts();
    }
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleInspectionTimeChange = (time: "BEFORE SERVICE" | "AFTER SERVICE") => {
    setCurrentInspectionTime(time);
    loadInspectionCounts(time);
  };

  const loadInspectionCounts = async (inspectionTime?: "BEFORE SERVICE" | "AFTER SERVICE") => {
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "").trim();
      
      // Fetch total active inspection types
      const typesResponse = await axios.get(`${BASE_URL}/technician-inspection`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!typesResponse.data?.success) {
        return;
      }

      const totalTypes = typesResponse.data.data.filter((type: any) => type.isActive).length;

      // If inspectionTime is provided, show only that time's count
      if (inspectionTime) {
        try {
          const response = await axios.get(
            `${BASE_URL}/technician-vehicle-inspections/inspectionbyjobid?jobId=${job._id}&inspectionTIME=${inspectionTime}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.data?.success && response.data.data) {
            const completed = response.data.data.inspections.filter(
              (item: any) => item.status !== "PENDING"
            ).length;
            setInspectionBadge(`${completed}/${totalTypes}`);
          } else {
            setInspectionBadge(`0/${totalTypes}`);
          }
        } catch (error) {
          // No inspection yet for this time
          setInspectionBadge(`0/${totalTypes}`);
        }
      } else {
        // Default: show combined count from both before and after
        let beforeCompleted = 0;
        try {
          const beforeResponse = await axios.get(
            `${BASE_URL}/technician-vehicle-inspections/inspectionbyjobid?jobId=${job._id}&inspectionTIME=BEFORE SERVICE`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (beforeResponse.data?.success && beforeResponse.data.data) {
            beforeCompleted = beforeResponse.data.data.inspections.filter(
              (item: any) => item.status !== "PENDING"
            ).length;
          }
        } catch (error) {
          // No before service inspection yet
        }

        let afterCompleted = 0;
        try {
          const afterResponse = await axios.get(
            `${BASE_URL}/technician-vehicle-inspections/inspectionbyjobid?jobId=${job._id}&inspectionTIME=AFTER SERVICE`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (afterResponse.data?.success && afterResponse.data.data) {
            afterCompleted = afterResponse.data.data.inspections.filter(
              (item: any) => item.status !== "PENDING"
            ).length;
          }
        } catch (error) {
          // No after service inspection yet
        }

        const totalCompleted = beforeCompleted + afterCompleted;
        const totalPossible = totalTypes * 2;
        setInspectionBadge(`${totalCompleted}/${totalPossible}`);
      }
    } catch (error) {
      console.error("Failed to load inspection counts:", error);
      setInspectionBadge('0/0');
    }
  };

  const tabs = [
    {
      id: 'jobinfo' as ActivityTabType,
      label: 'Job Info',
      icon: Briefcase,
    },
    {
      id: 'services' as ActivityTabType,
      label: 'Services',
      icon: Settings,
    },
    {
      id: 'parts' as ActivityTabType,
      label: 'Parts',
      icon: Package,
    },
    {
      id: 'inspection' as ActivityTabType,
      label: 'Inspection',
      icon: ClipboardList,
      badge: inspectionBadge,
    },
    {
      id: 'notes' as ActivityTabType,
      label: 'Notes',
      icon: FileText,
    },
       {
      id: 'technician-activities' as ActivityTabType,
      label: 'Technicians Activities',
      icon: FileText,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'jobinfo':
        return <JobInfo job={job} />;
      
      case 'services':
        return <Services job={job} />;
      
      case 'parts':
        return <Parts job={job} />;
      
      case 'inspection':
        return (
          <TechnicianInspection 
            job={job} 
            onInspectionUpdate={() => loadInspectionCounts(currentInspectionTime)}
            onInspectionTimeChange={handleInspectionTimeChange}
          />
        );
      
      case 'notes':
        return (
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Notes</h3>
            <textarea
              placeholder="Add notes for this job..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={10}
            />
          </div>
        );
         case 'technician-activities':
        return <TechniciansActivity 
          jobId={job._id} 
          quotationId={typeof job.quotationId === 'object' && job.quotationId?._id 
            ? job.quotationId._id 
            : job.quotationId || job.ticketId} 
        />;
      
      default:
        return null;
    }
  };

  return (
    <>
      <style>{jobsAnimations}</style>
      <div className="min-h-screen bg-gray-50 animate-slideUp">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Activity</h1>
                <p className="text-sm text-gray-500">Job ID: {job?.jobId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-linear-to-b from-gray-50 to-white border-b border-gray-200 sticky top-[73px] z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-100 to-purple-100 rounded-xl shadow-sm p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center  gap-2 px-4 py-3 rounded-lg font-medium text-sm
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-white text-black shadow-md' 
                        : 'hover:bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-bold
                        ${isActive ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700'}
                      `}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`max-w-7xl mx-auto transition-all duration-300 ${isAnimating ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="bg-white shadow-sm rounded-xl m-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobActivityView;
