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
  }, []);

  const getValue = (key: string) =>
    loading ? "..." : stats?.[key]?.current || 0;
  const getPercentage = (key: string) => stats?.[key]?.percentage || 0;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <AnimatePresence>
        {isModalOpen && <ModalForm onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>

      <div className="bg-linear-to-r from-[#4F46E5] via-[#9333EA] to-[#E11DBC] rounded-[2.5rem] p-12 mb-10 flex flex-col md:flex-row justify-between items-center text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-8 z-10">
          <div className="bg-white/20 p-5 rounded-4xl backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center"
            >
              <Users size={48} strokeWidth={2.5} />
            </motion.div>
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight mb-2">
              Customer Management
            </h1>
            <p className="opacity-90 text-lg font-semibold tracking-wide">
              Search and manage customer records
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-8 md:mt-0 bg-white text-[#4F46E5] px-8 py-5 rounded-4xl font-black flex items-center gap-3 shadow-2xl hover:bg-slate-50 transition-all active:scale-95 z-10 group"
        >
          <Plus
            size={24}
            strokeWidth={3}
            className="transition-transform group-hover:rotate-90"
          />
          Register New Customer
        </button>
      </div>

      <div className="flex flex-wrap gap-6 mb-16">
        <MetricCard
          title="Total Customers"
          value={getValue("total")}
          percentage={getPercentage("total")}
          isPositive={getPercentage("total") >= 0}
          icon={Users}
          gradient="bg-gradient-to-br from-[#00C6FB] to-[#005BEA]"
        />
        <MetricCard
          title="Domestic Customers"
          value={getValue("domestic")}
          percentage={getPercentage("domestic")}
          isPositive={getPercentage("domestic") >= 0}
          icon={User}
          gradient="bg-gradient-to-br from-[#9D50BB] to-[#6E48AA]"
        />
        <MetricCard
          title="Corporate Customers"
          value={getValue("corporate")}
          percentage={getPercentage("corporate")}
          isPositive={getPercentage("corporate") >= 0}
          icon={Building2}
          gradient="bg-gradient-to-br from-[#F093FB] to-[#F5576C]"
        />
        <MetricCard
          title="Active Customers"
          value={getValue("active")}
          percentage={getPercentage("active")}
          isPositive={getPercentage("active") >= 0}
          icon={Calendar}
          gradient="bg-gradient-to-br from-[#0BA360] to-[#3CBA92]"
        />
        <MetricCard
          title="Avg. Service History"
          value="4.2"
          percentage="5.8"
          isPositive
          icon={History}
          gradient="bg-gradient-to-br from-[#FA709A] to-[#FEE140]"
        />
      </div>

      <div>
        <CustomerGrowthAnalytics />
      </div>
      <div className="mt-2">
        <CustomerManagementList />
      </div>
    </div>
  );
};

export default CustomerDashboard;
