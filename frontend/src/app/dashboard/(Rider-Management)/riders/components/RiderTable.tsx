"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Bike,
  Truck,
  Edit2,
  PauseCircle,
  Trash2,
  CheckCircle2,
  Calendar,
  Loader2,
} from "lucide-react";
import { useRider } from "../../../../../hooks/useRider";
import Pagination from "../../../../../components/ui/Pagination";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface RiderTableProps {
  search?: string;
}

const StatusBadge = ({ isActive }: { isActive: boolean }) => {
  const status = isActive ? "ACTIVE" : "INACTIVE";
  const styles = {
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100",
    INACTIVE: "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}
    >
      {isActive ? <CheckCircle2 size={14} /> : <PauseCircle size={14} />}
      {status}
    </span>
  );
};

const RiderTable: React.FC<RiderTableProps> = ({ search = "" }) => {
  const { riders, loading, totalRiders, fetchRiders, deleteRider } = useRider();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const router = useRouter();
  useEffect(() => {
    fetchRiders({ page: currentPage, limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);
  const filteredRiders = useMemo(() => {
    if (!search.trim()) return riders;

    const query = search.toLowerCase();
    return riders.filter((rider: any) => {
      const firstName = rider.personId?.firstName || "";
      const lastName = rider.personId?.lastName || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();
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
              <th className="p-4 text-xs font-bold text-gray-500">
                EMPLOYMENT
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
                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                          <MapPin size={10} />{" "}
                          {rider.addressId?.city || "No City"}
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
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
                      {rider.vehicleTypeId?.vehicleType
                        ?.toLowerCase()
                        .includes("motar") ? (
                        <Bike size={14} />
                      ) : (
                        <Truck size={14} />
                      )}
                      <span className="capitalize">
                        {rider.vehicleTypeId?.vehicleType || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-semibold text-gray-700 capitalize">
                      {rider.employeementTypeId?.jobTypeName || "Standard"}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Exp: {rider.yearsOfExperience || 0} years
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge isActive={rider.isActive} />
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
                  No riders match your search.
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
