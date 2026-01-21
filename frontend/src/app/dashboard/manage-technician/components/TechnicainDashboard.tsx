"use client";
import { useEffect, useState } from "react";
import MetricCard from "../../customerDashboard/components/MetricCard";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { Plus, Users, UserCheck, Briefcase, Star, Wrench } from "lucide-react";
import ModalForm from "./ModalForm"; // Import your Modal component

const HEADER_GRADIENT = "from-[#F54900] via-[#E7000B] to-[#E60076]";

const TechnicianDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getValue = (key: string) =>
    loading ? "..." : stats?.[key]?.current || 0;
  const getPercentage = (key: string) => stats?.[key]?.percentage || 0;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* --- Modal Logic --- */}
      <AnimatePresence>
        {isModalOpen && <ModalForm onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>

      {/* Header Section */}
      <div
        className={`bg-linear-to-r ${HEADER_GRADIENT} rounded-[2.5rem] p-12 mb-10 flex flex-col md:flex-row justify-between items-center text-white shadow-2xl shadow-red-200 relative overflow-hidden`}
      >
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-8 z-10">
          <div className="bg-white/20 p-5 rounded-4xl backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Wrench size={48} strokeWidth={2.5} />
            </motion.div>
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight mb-2">
              Technician Management
            </h1>
            <p className="opacity-90 text-lg font-semibold tracking-wide">
              Manage your technical workforce and monitor performance
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-8 md:mt-0 bg-white text-[#E7000B] px-8 py-5 rounded-4xl font-black flex items-center gap-3 shadow-2xl hover:bg-slate-50 transition-all active:scale-95 z-10 group"
        >
          <Plus
            size={24}
            strokeWidth={3}
            className="transition-transform group-hover:rotate-90"
          />
          Register New Technician
        </button>
      </div>

      <div className="flex flex-wrap gap-6 mb-16">
        <MetricCard
          title="Total Technicians"
          value={getValue("total") || "12"}
          percentage={getPercentage("total") || "+8.5"}
          isPositive={true}
          icon={Users}
          gradient="bg-gradient-to-br from-[#FF512F] to-[#DD2476]"
        />
        <MetricCard
          title="Available Now"
          value={getValue("available") || "5"}
          percentage={getPercentage("available") || "+12.3"}
          isPositive={true}
          icon={UserCheck}
          gradient="bg-gradient-to-br from-[#11998e] to-[#38ef7d]"
        />
        <MetricCard
          title="Active Jobs"
          value={getValue("activeJobs") || "8"}
          percentage={getPercentage("activeJobs") || "-3.2"}
          isPositive={false}
          icon={Briefcase}
          gradient="bg-gradient-to-br from-[#2193b0] to-[#6dd5ed]"
        />
        <MetricCard
          title="Avg. Rating"
          value={getValue("rating") || "4.85"}
          percentage={getPercentage("rating") || "+2.1"}
          isPositive={true}
          icon={Star}
          gradient="bg-gradient-to-br from-[#ee0979] to-[#ff6a00]"
        />
      </div>
    </div>
  );
};

export default TechnicianDashboard;
