"use client";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Bike,
  Trash2,
  CheckCircle2,
  Calendar,
  Loader2,
  Star,
  Award,
  XCircle,
  AlertCircle,
  Clock,
  SquarePen,
  Pause,
  Play,
  CheckCheck,
  X,
  UserMinus,
  PauseCircle,
} from "lucide-react";
import { useRider } from "../../../../../hooks/useRider";
import Pagination from "../../../../../components/ui/Pagination";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface RiderTableProps {
  search?: string;
  activeStatus: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toUpperCase() || "PENDING";
  const styles: Record<string, { class: string; icon: React.ReactNode }> = {
    ACTIVE: {
      class: "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: <CheckCircle2 size={14} />,
    },
    APPROVED: {
      class: "bg-blue-50 text-blue-600 border-blue-100",
      icon: <CheckCircle2 size={14} />,
    },
    PENDING: {
      class: "bg-amber-50 text-amber-600 border-amber-100",
      icon: <Clock size={14} />,
    },
    REJECTED: {
      class: "bg-red-50 text-red-600 border-red-100",
      icon: <XCircle size={14} />,
    },
    TERMINATED: {
      class: "bg-slate-100 text-slate-600 border-slate-200",
      icon: <AlertCircle size={14} />,
    },
    "IN-ACTIVE": {
      class: "bg-gray-100 text-gray-500 border-gray-200",
      icon: <PauseCircle size={14} />,
    },
  };
  const currentStyle = styles[s] || styles["PENDING"];
  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border w-fit ${currentStyle.class}`}
    >
      {currentStyle.icon} {s}
    </span>
  );
};

const RiderTable: React.FC<RiderTableProps> = ({
  search = "",
  activeStatus,
}) => {
  const {
    riders,
    loading,
    totalRiders,
    fetchRiders,
    deleteRider,
    updateRiderStatus,
  } = useRider();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const router = useRouter();
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (debouncedSearch.trim()) {
      setTimeout(() => {
        if (currentPage !== 1) {
          setCurrentPage(1);
        }
      }, 0);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: limit,
    };
    if (activeStatus !== "All") {
      params.riderStatus = activeStatus.toUpperCase();
    }
    if (debouncedSearch.trim()) {
      params.search = debouncedSearch;
    }

    fetchRiders(params);
  }, [currentPage, activeStatus, fetchRiders, debouncedSearch]);
  const displayRiders = riders;

  const totalPages = Math.ceil(totalRiders / limit);

  const handleStatusUpdate = async (riderId: string, status: string) => {
    try {
      await updateRiderStatus(riderId, status);
      const params: any = {
        page: currentPage,
        limit: limit,
      };
      if (activeStatus !== "All") {
        params.riderStatus = activeStatus.toUpperCase();
      }
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch;
      }
      await fetchRiders(params);
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    toast.dismiss();
    const loadingToast = toast.loading("Deleting rider...");
    try {
      await deleteRider(id);
      const params: any = {
        page: currentPage,
        limit: limit,
      };
      if (activeStatus !== "All") {
        params.riderStatus = activeStatus.toUpperCase();
      }
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch;
      }
      await fetchRiders(params);

      toast.success("Rider deleted successfully!", {
        id: loadingToast,
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete rider.", {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  if (loading && riders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium">Loading Riders Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="overflow-x-auto shadow-sm rounded-3xl border border-gray-100">
        <table className="w-full bg-white border-collapse">
          <thead>
            <tr className="text-left bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-500">RIDER ID</th>
              <th className="p-4 text-xs font-bold text-gray-500">
                RIDER DETAILS
              </th>
              <th className="p-4 text-xs font-bold text-gray-500">CONTACT</th>
              <th className="p-4 text-xs font-bold text-gray-500">VEHICLE</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                Performance
              </th>
              <th className="p-4 text-xs font-bold text-gray-500">STATUS</th>
              <th className="p-4 text-xs font-bold text-gray-500 text-center">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayRiders.length > 0 ? (
              displayRiders.map((rider: any) => (
                <tr
                  key={rider._id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="text-sm font-bold text-blue-600">
                      {rider.riderAutoId || "N/A"}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Calendar size={12} />{" "}
                      {rider.createdAt
                        ? new Date(rider.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                        {rider.personId?.firstName?.charAt(0).toUpperCase() ||
                          "R"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 uppercase">
                          {rider.personId?.firstName} {rider.personId?.lastName}
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-gray-400">
                          <MapPin size={10} />{" "}
                          {rider.addressId?.city || "No City"}
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-gray-400">
                          {rider.employeementTypeId?.jobTypeName || "Standard"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <Mail size={12} className="text-gray-400" />{" "}
                      {rider.contactId?.emailId || "N/A"}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Phone size={12} className="text-gray-400" />{" "}
                      {rider.contactId?.mobileNumber || "N/A"}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
                        <Bike size={14} />{" "}
                        <span className="capitalize">
                          {rider.vehicleTypeId?.vehicleType || "N/A"}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium">
                        {rider.licensePlate || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <Star
                          size={14}
                          className="text-amber-500 fill-amber-500"
                        />{" "}
                        <span className="text-xs font-bold text-gray-900">
                          4.8
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award size={14} className="text-emerald-500" />{" "}
                        <span className="text-[10px] text-slate-500 font-medium">
                          145 deliveries
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={rider.riderStatus} />
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-40 mx-auto">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/AddRider?id=${rider._id}`)
                        }
                        className="p-2 text-blue-500 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-all shadow-sm"
                        title="Edit"
                      >
                        <SquarePen size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            rider._id,
                            rider.riderStatus === "ACTIVE"
                              ? "IN-ACTIVE"
                              : "ACTIVE",
                          )
                        }
                        className="p-2 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
                        title={
                          rider.riderStatus === "ACTIVE" ? "Pause" : "Play"
                        }
                      >
                        {rider.riderStatus === "ACTIVE" ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(rider._id, "APPROVED")
                        }
                        className="p-2 text-white bg-emerald-500 border border-emerald-600 rounded-xl hover:bg-emerald-600 transition-all shadow-sm"
                        title="Approve"
                      >
                        <CheckCheck size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(rider._id, "REJECTED")
                        }
                        className="p-2 text-red-500 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all shadow-sm"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(rider._id, "TERMINATED")
                        }
                        className="p-2 text-orange-500 bg-white border border-orange-200 rounded-xl hover:bg-orange-50 transition-all shadow-sm"
                        title="Terminate"
                      >
                        <UserMinus size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(rider._id)}
                        className="p-2 text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-all shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400">
                  {debouncedSearch
                    ? `No riders found matching "${debouncedSearch}"`
                    : "No riders match your selection."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {debouncedSearch && displayRiders.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Found {totalRiders} result(s) for {debouncedSearch} (Page{" "}
          {currentPage} of {totalPages})
        </div>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default RiderTable;
