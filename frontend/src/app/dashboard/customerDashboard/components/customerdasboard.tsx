"use client";
import { useEffect, useState, Suspense } from "react"; // 1. Added Suspense
import MetricCard from "./MetricCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  User,
  Building2,
  Calendar,
  History,
  CircleUserRound,
} from "lucide-react";
import CustomerGrowthAnalytics from "./CustomerGrowthAnalytics";
import { useSearchParams } from "next/navigation";
import CustomerManagementList from "./CustomerManagementList";
import ModalForm from "./ModalForm";
import { getAlls } from "../../../../helper/apiHelper";

// 2. Move your existing logic into a separate internal component
const CustomerDashboardContent = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const registerAction = searchParams.get("create");
    if (registerAction === "true") {
      setIsModalOpen(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const handleDataChange = () => setRefreshTrigger((prev) => prev + 1);
  const handleEditCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAlls("/customers/summary/dashboard");
        if (response) setStats(response);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [refreshTrigger]);

  const getValue = (key: string) =>
    loading ? "..." : stats?.[key]?.current || 0;
  const getPercentage = (key: string) => stats?.[key]?.percentage || 0;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <AnimatePresence>
        {isModalOpen && (
          <ModalForm
            customerId={selectedCustomerId}
            onClose={handleCloseModal}
            onSuccess={handleDataChange}
          />
        )}
      </AnimatePresence>

      <div className="w-full h-auto md:h-32 pl-8 pr-8 py-6 md:py-0 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl flex flex-col md:flex-row justify-between items-center overflow-hidden relative mb-8">
        <div className="flex items-center gap-6 z-10">
          <div className="w-20 h-20 rotate-[19.51deg] bg-white/20 rounded-2xl shadow-xl flex justify-center items-center backdrop-blur-sm border border-white/20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center"
            >
              <Users size={40} strokeWidth={2.5} className="text-white" />
            </motion.div>
          </div>

          <div className="flex flex-col justify-start items-start">
            <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Customer Management
            </h1>
            <p className="text-white/90 text-base md:text-lg font-normal leading-7">
              Search and manage customer records
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 px-6 py-3 bg-white rounded-[10px] shadow-2xl flex items-center gap-3 group transition-all active:scale-95 z-10"
        >
          <Plus
            size={20}
            strokeWidth={3}
            className="text-indigo-600 transition-transform group-hover:rotate-90"
          />
          <span className="text-indigo-600 text-lg ">
            Register New Customer
          </span>
        </button>
      </div>

      {/* Grid Container - Isme se shadow, background aur overflow-hidden remove kar diya gaya hai */}
      <div className="grid grid-cols-1 pt-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10 rounded-4xl">
        <MetricCard
          title="TOTAL CUSTOMERS"
          value={getValue("total")}
          percentage={getPercentage("total")}
          isPositive={getPercentage("total") >= 0}
          icon={User}
          gradient="bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-500 "
        />
        <MetricCard
          title="DOMESTIC CUSTOMERS"
          value={getValue("domestic")}
          percentage={getPercentage("domestic")}
          isPositive={getPercentage("domestic") >= 0}
          icon={CircleUserRound}
          gradient="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
        />
        <MetricCard
          title="CORPORATE CUSTOMERS"
          value={getValue("corporate")}
          percentage={getPercentage("corporate")}
          isPositive={getPercentage("corporate") >= 0}
          icon={Building2}
          gradient="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600"
        />
        <MetricCard
          title="ACTIVE CUSTOMERS"
          value={getValue("active")}
          percentage={getPercentage("active")}
          isPositive={getPercentage("active") >= 0}
          icon={Calendar}
          gradient="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600"
        />
        <MetricCard
          title="AVG. SERVICE HISTORY"
          value="4.2"
          percentage="5.8"
          isPositive
          icon={History}
          gradient="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500"
        />
      </div>
      <div>
        <CustomerGrowthAnalytics />
      </div>
      <div className="mt-2">
        <CustomerManagementList
          onEdit={handleEditCustomer}
          refreshTrigger={refreshTrigger}
          onDataChange={handleDataChange}
        />
      </div>
    </div>
  );
};

const CustomerDashboard = () => {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center font-bold">Loading Dashboard...</div>
      }
    >
      <CustomerDashboardContent />
    </Suspense>
  );
};

export default CustomerDashboard;
