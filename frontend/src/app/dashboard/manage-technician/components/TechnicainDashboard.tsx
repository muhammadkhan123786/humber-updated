"use client";
import { useEffect, useState } from "react";
import MetricCard from "../../customerDashboard/components/MetricCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  UserCheck,
  Briefcase,
  Star,
  Loader2,
  Navigation,
  Files,
  Calendar,
  Settings,
} from "lucide-react";
import ModalForm from "./ModalForm";
import ManageTechnicianList from "./ManageTechnicianList";

const HEADER_GRADIENT = "from-[#F54900] via-[#E7000B] to-[#E60076]";

const TechnicianDashboard = () => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const [techRes, summaryRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/technicians`, {
          headers,
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/technicians/summary`, {
          headers,
        }),
      ]);

      const techResult = await techRes.json();
      const summaryResult = await summaryRes.json();

      if (techResult.success) setTechnicians(techResult.data);
      if (summaryResult) setSummary(summaryResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this technician?"))
      return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/technicians/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const result = await response.json();
      if (result.success) {
        setTechnicians((prev) => prev.filter((t) => t._id !== id));

        const summaryRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/technicians/summary`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const summaryData = await summaryRes.json();
        setSummary(summaryData);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (tech: any) => {
    setSelectedTechnician(tech);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTechnician(null);
    fetchData();
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <AnimatePresence>
        {isModalOpen && (
          <ModalForm
            onClose={handleCloseModal}
            initialData={selectedTechnician}
          />
        )}
      </AnimatePresence>

      <div
        className={`bg-linear-to-r ${HEADER_GRADIENT} rounded-4xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center text-white shadow-2xl shadow-red-200 relative overflow-hidden`}
      >
        <div className="absolute top-[-20%] right-[-10%] w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-6 z-10">
          <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-xl border border-white/30 shadow-xl overflow-hidden">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Settings size={40} strokeWidth={2.5} />
            </motion.div>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-1">
              Technician Management
            </h1>
            <p className="opacity-90 text-base font-semibold tracking-wide">
              Manage technical workforce and monitor performance
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedTechnician(null);
            setIsModalOpen(true);
          }}
          className="mt-6 md:mt-0 bg-white text-[#E7000B] px-6 py-4 rounded-3xl font-bold flex items-center gap-3 shadow-xl hover:bg-slate-50 transition-all active:scale-95 z-10 group"
        >
          <Plus
            size={20}
            strokeWidth={3}
            className="transition-transform group-hover:rotate-90"
          />
          Register New Technician
        </button>
      </div>
      <div className="mb-8 bg-white border border-orange-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 p-3 rounded-full text-white">
            <Users size={20} fill="white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Complete HR System
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Name fields • Google Places • Multi-upload • Duty roster • Salary
              • HR features
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100">
            <Navigation size={12} fill="currentColor" /> Auto-fill Address
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-bold border border-cyan-100">
            <Files size={12} fill="currentColor" /> Multi-Documents
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold border border-purple-100">
            <Calendar size={12} fill="currentColor" /> Weekly Schedule
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-100">
            <Settings size={12} fill="currentColor" /> Salary Config
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mb-16">
        <MetricCard
          title="Total Technicians"
          value={loading ? "..." : summary?.total?.current || 0}
          percentage={summary?.total?.percentage || "0"}
          isPositive={true}
          icon={Users}
          gradient="bg-gradient-to-br from-[#FF512F] to-[#DD2476]"
        />
        <MetricCard
          title="Available Now"
          value={loading ? "..." : summary?.status?.available || 0}
          percentage={summary?.active?.percentage || "0"}
          isPositive={true}
          icon={UserCheck}
          gradient="bg-gradient-to-br from-[#11998e] to-[#38ef7d]"
        />
        <MetricCard
          title="Active Jobs"
          value={loading ? "..." : summary?.active?.current || 0}
          percentage="0"
          isPositive={false}
          icon={Briefcase}
          gradient="bg-gradient-to-br from-[#2193b0] to-[#6dd5ed]"
        />
        <MetricCard
          title="Avg. Rating"
          value="4.85"
          percentage="+2.1"
          isPositive={true}
          icon={Star}
          gradient="bg-gradient-to-br from-[#ee0979] to-[#ff6a00]"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-red-500" size={48} />
          <p className="text-slate-400 font-bold">
            Fetching Technician Data...
          </p>
        </div>
      ) : (
        <ManageTechnicianList
          technicians={technicians}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default TechnicianDashboard;
