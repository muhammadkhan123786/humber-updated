"use client";
import { useEffect, useState } from "react";
import MetricCard from "../../customerDashboard/components/MetricCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  UserCheck,
  Briefcase,
  Star,
  Loader2,
  Settings,
  User,
  UserStar,
} from "lucide-react";
import ModalForm from "./ModalForm";
import ManageTechnicianList from "./ManageTechnicianList";
import Pagination from "@/components/ui/Pagination";

const HEADER_GRADIENT = "from-[#F54900] via-[#E7000B] to-[#E60076]";

const TechnicianDashboard = () => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const [techRes, summaryRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/technicians?page=${page}&limit=${limit}`,
          {
            headers,
          },
        ),
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
    fetchData(1);
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
  console.log("reponse data", setCurrentPage, setTotalPages);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTechnician(null);
    fetchData();
  };

  return (
    <div className="p-2 bg-slate-50 min-h-screen">
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
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Technician Management
            </h1>
            <p className="opacity-90 text-base font-semibold tracking-wide">
              Manage your technical workforce
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
      <div className="w-full h-20 pl-4 bg-linear-to-r from-orange-50 via-red-50 to-pink-50 rounded-2xl shadow-lg border-l-4 border-orange-500 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex justify-center items-center shadow-md">
            <UserStar size={20} className="text-white" fill="white" />
          </div>

          <div className="flex flex-col">
            <h3 className="text-gray-800 text-sm font-bold font-sans leading-tight">
              Complete HR System
            </h3>
            <p className="text-gray-600 text-xs font-normal font-sans leading-tight">
              Name fields • Google Places • Multi-upload • Duty roster • Salary
              • HR features
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 pr-4">
          <div className="px-3 py-1 bg-blue-100 rounded-full flex items-center gap-1.5 border border-blue-200">
            <span className="text-[10px]">📍</span>
            <span className="text-blue-700 text-xs font-medium font-sans">
              Auto-fill Address
            </span>
          </div>

          <div className="px-3 py-1 bg-cyan-100 rounded-full flex items-center gap-1.5 border border-cyan-200">
            <span className="text-[10px]">📎</span>
            <span className="text-cyan-700 text-xs font-medium font-sans">
              Multi-Documents
            </span>
          </div>

          <div className="px-3 py-1 bg-purple-100 rounded-full flex items-center gap-1.5 border border-purple-200">
            <span className="text-[10px]">📅</span>
            <span className="text-purple-700 text-xs font-medium font-sans">
              Weekly Schedule
            </span>
          </div>

          <div className="px-3 py-1 bg-green-100 rounded-full flex items-center gap-1.5 border border-green-200">
            <span className="text-[10px]">💰</span>
            <span className="text-green-700 text-xs font-medium font-sans">
              Salary Config
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4  gap-4 mb-16 mt-4 ">
        <MetricCard
          title="Total Technicians"
          value={loading ? "..." : summary?.total?.current || 0}
          percentage={summary?.total?.percentage || "0"}
          isPositive={true}
          icon={User}
          gradient="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"
          height="h-48"
        />
        <MetricCard
          title="Available Now"
          value={loading ? "..." : summary?.status?.available || 0}
          percentage={summary?.active?.percentage || "0"}
          isPositive={true}
          icon={UserCheck}
          gradient="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500"
          height="h-48"
        />
        <MetricCard
          title="Active Jobs"
          value={loading ? "..." : summary?.active?.current || 0}
          percentage="0"
          isPositive={false}
          icon={Briefcase}
          gradient="bg-gradient-to-br from-[#2193b0] to-[#6dd5ed]"
          height="h-48"
        />
        <MetricCard
          title="Avg. Rating"
          value="4.85"
          percentage="2.1"
          isPositive={true}
          icon={Star}
          gradient="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500"
          height="h-48"
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
      {!loading && technicians.length > 0 && totalPages > 1 && (
        <div className=" flex justify-end border-t border-slate-200  pb-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchData(page)}
          />
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;
