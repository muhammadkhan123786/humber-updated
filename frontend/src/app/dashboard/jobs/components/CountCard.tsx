"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface CountCardProps {
  refreshTrigger?: number;
}

const CountCard = ({ refreshTrigger = 0 }: CountCardProps) => {
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedJobsCount = async () => {
      try {
        setLoading(true);
        const rawToken = localStorage.getItem("token");
        const cleanToken = rawToken ? rawToken.replace(/"/g, "").trim() : "";

        const response = await axios.put(
          `${BASE_URL}/technician-job-completed-count`,
          {},
          {
            headers: { Authorization: `Bearer ${cleanToken}` },
          }
        );

        if (response.data?.success) {
          setCompletedCount(response.data.data || 0);
        }
      } catch (error: any) {
        console.error("Error fetching completed jobs count:", error);
        toast.error("Failed to load completed jobs count");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobsCount();
  }, [refreshTrigger]);

  return (
    <div className="w-full h-24 bg-linear-to-br from-emerald-500 to-green-600 rounded-2xl p-4 flex justify-between items-center shadow-lg transition-transform hover:scale-105 cursor-pointer">
      <div className="flex flex-col justify-between h-full">
        <span className="text-white/90 text-xs font-semibold tracking-wide">
         Completed Jobs
        </span>
        {loading ? (
          <div className="h-8 w-16 bg-white/20 rounded animate-pulse"></div>
        ) : (
          <span className="text-white text-3xl font-bold leading-none">
            {completedCount}
          </span>
        )}
      </div>

      <div className="text-white/80">
        <CheckCircle2 size={32} strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default CountCard;
