"use client";
import { useEffect, useState } from "react";
import MetricCard from "./MetricCard";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, User, Building2, Calendar, History } from "lucide-react";
import CustomerGrowthAnalytics from "./CustomerGrowthAnalytics";
import CustomerManagementList from "./CustomerManagementList";
import ModalForm from "./ModalForm";
import { getAlls } from "../../../../helper/apiHelper";

const CustomerDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );

  const handleDataChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
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

      <div className="bg-linear-to-r from-[#4F46E5] via-[#9333EA] to-[#E11DBC] rounded-4xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-56 h-56 bg-white/10 rounded-full blur-3xl" />

        <div className="flex items-center gap-6 z-10">
          <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-xl border border-white/30 shadow-xl overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center"
            >
              <Users size={40} strokeWidth={2.5} />
            </motion.div>
          </div>

          <div>
            <h1 className="text-4xl font-black tracking-tight mb-1">
              Customer Management
            </h1>
            <p className="opacity-90 text-base font-semibold tracking-wide">
              Search and manage customer records
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 md:mt-0 bg-white text-[#4F46E5] px-6 py-4 rounded-3xl font-bold flex items-center gap-3 shadow-xl hover:bg-slate-50 transition-all active:scale-95 z-10 group"
        >
          <Plus
            size={20}
            strokeWidth={3}
            className="transition-transform group-hover:rotate-90"
          />
          Register New Customer
        </button>
      </div>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-10 rounded-4xl overflow-hidden shadow-lg border border-white/10">
  <MetricCard
    title="TOTAL CUSTOMERS"
    value={getValue("total")}
    percentage={getPercentage("total")}
    isPositive={getPercentage("total") >= 0}
    icon={Users}
    gradient="bg-gradient-to-br from-[#00C6FB] to-[#005BEA]"
    className="w-full"
  />
  <MetricCard
    title="DOMESTIC CUSTOMERS"
    value={getValue("domestic")}
    percentage={getPercentage("domestic")}
    isPositive={getPercentage("domestic") >= 0}
    icon={User}
    gradient="bg-gradient-to-br from-[#9D50BB] to-[#6E48AA]"
    className="w-full border-l border-white/10"
  />
  <MetricCard
    title="CORPORATE CUSTOMERS"
    value={getValue("corporate")}
    percentage={getPercentage("corporate")}
    isPositive={getPercentage("corporate") >= 0}
    icon={Building2}
    gradient="bg-gradient-to-br from-[#F093FB] to-[#F5576C]"
    className="w-full border-l border-white/10"
  />
  <MetricCard
    title="ACTIVE CUSTOMERS"
    value={getValue("active")}
    percentage={getPercentage("active")}
    isPositive={getPercentage("active") >= 0}
    icon={Calendar}
    gradient="bg-gradient-to-br from-[#0BA360] to-[#3CBA92]"
    className="w-full border-l border-white/10"
  />
  <MetricCard
    title="AVG. SERVICE HISTORY"
    value="4.2"
    percentage="5.8"
    isPositive
    icon={History}
    gradient="bg-gradient-to-br from-[#FA709A] to-[#FEE140]"
    className="w-full border-l border-white/10"
  />
</div>
      <div>
        <CustomerGrowthAnalytics />
      </div>
      <div className="mt-2">
        {/* Yahan onEdit prop pass kiya hai */}
        <CustomerManagementList
          onEdit={handleEditCustomer}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;
