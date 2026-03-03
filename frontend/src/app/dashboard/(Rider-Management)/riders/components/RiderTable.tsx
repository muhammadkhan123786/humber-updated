"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Bike,
  Edit2,
  PauseCircle,
  Trash2,
  CheckCircle2,
  Calendar,
  Loader2,
  Star,
  Award,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useRider } from "../../../../../hooks/useRider";
import Pagination from "../../../../../components/ui/Pagination";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface RiderTableProps {
  search?: string;
  activeStatus: string; // New Prop added
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
  const { riders, loading, totalRiders, fetchRiders, deleteRider } = useRider();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const router = useRouter();

  // FIX: Dependency array mein activeStatus add kiya aur params set kiye
  useEffect(() => {
    const params: any = { page: currentPage, limit };
    if (activeStatus !== "All") {
      params.riderStatus = activeStatus.toUpperCase();
    }
    fetchRiders(params);
  }, [currentPage, activeStatus, fetchRiders]); // Ye activeStatus ke change hone par ab chalega

  const filteredRiders = useMemo(() => {
    if (!search.trim()) return riders;
    const query = search.toLowerCase();
    return riders.filter((rider: any) => {
      const fullName =
        `${rider.personId?.firstName || ""} ${rider.personId?.lastName || ""}`.toLowerCase();
      const email = (rider.contactId?.emailId || "").toLowerCase();
      const riderId = (rider.riderAutoId || "").toLowerCase();
      return (
        fullName.includes(query) ||
        email.includes(query) ||
        riderId.includes(query)
      );
    });
  }, [search, riders]);

  const totalPages = Math.ceil(totalRiders / limit);

  const handleDelete = async (id: string) => {
    toast.dismiss();
    const loadingToast = toast.loading("Deleting rider...");
    try {
      await deleteRider(id);
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
              <th className="p-4 text-xs font-bold text-gray-500">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRiders.length > 0 ? (
              filteredRiders.map((rider: any) => (
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/AddRider?id=${rider._id}`)
                        }
                        className="p-1.5 text-blue-500 bg-blue-50 rounded-md border border-blue-100 hover:bg-blue-100 transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(rider._id)}
                        className="p-1.5 text-red-500 bg-red-50 rounded-md border border-red-100 hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400">
                  No riders match your selection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default RiderTable;
