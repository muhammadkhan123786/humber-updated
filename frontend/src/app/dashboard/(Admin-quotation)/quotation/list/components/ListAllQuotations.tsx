"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Cards from "./Cards";
import QuotationTable from "./QuotationTable";
import View from "./View";
import DeleteConfirmModal from "../../../../my-tickets/components/DeleteConfirmModal";
import { getAlls, deleteItem } from "@/helper/apiHelper";
import { toast } from "react-hot-toast";
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export const QUOTATION_STATUS = [
  "SEND TO CUSTOMER",
  "SEND TO INSURANCE",
  "APPROVED",
  "REJECTED",
] as const;

const ListAllQuotations = () => {
  const router = useRouter();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [viewingQuotationId, setViewingQuotationId] = useState<string | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchData();
      hasFetchedRef.current = true;
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getAlls<any>("/technician-ticket-quotation");
      const quotationsData = Array.isArray(response.tickets)
        ? response.tickets
        : Array.isArray(response.data)
          ? response.data
          : [];

      setQuotations(quotationsData);
      setFilteredQuotations(quotationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };
  const filterQuotations = useCallback(() => {
    let filtered = [...quotations];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((q) => {
        const quotationNo = q.quotationAutoId?.toLowerCase() || "";
        const ticketNo = q.ticket?.ticketCode?.toLowerCase() || "";
        const customerName =
          `${q.customer?.firstName || ""} ${q.customer?.lastName || ""}`.toLowerCase();
        return (
          quotationNo.includes(query) ||
          ticketNo.includes(query) ||
          customerName.includes(query)
        );
      });
    }

    if (selectedStatus) {
      const statusFilter = selectedStatus.toUpperCase();
      filtered = filtered.filter((q) => {
        const qStatus = q.quotationStatus?.toUpperCase() || "";

        if (statusFilter === "SENT") {
          return (
            qStatus.includes("CUSTOMER") ||
            qStatus.includes("INSURANCE") ||
            qStatus.includes("ADMIN") ||
            qStatus.includes("SENT")
          );
        }

        return qStatus === statusFilter;
      });
    }
    setFilteredQuotations(filtered);
  }, [quotations, searchQuery, selectedStatus]);
  useEffect(() => {
    filterQuotations();
  }, [searchQuery, selectedStatus, quotations, filterQuotations]);
  const handleStatusChange = async (
    quotationId: string,
    newStatusName: string,
  ) => {
    try {
      setQuotations((prev) =>
        prev.map((q) =>
          q._id === quotationId ? { ...q, quotationStatus: newStatusName } : q,
        ),
      );

      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/update-technician-quotation-status`,
        {
          techncianQuotationId: quotationId,
          techncianQuotationStatusId: newStatusName,
        },

        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        },
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
      fetchData();
    }
  };

  const getCustomerName = (q: any) =>
    `${q.customer?.firstName || ""} ${q.customer?.lastName || ""}`.trim() ||
    "N/A";
  const getTicketNumber = (q: any) => q.ticket?.ticketCode || "N/A";

  const getStatusCounts = () => {
    const counts: { [key: string]: number } = {
      SENT: 0,
      APPROVED: 0,
      REJECTED: 0,
    };

    quotations.forEach((q) => {
      const status = q.quotationStatus?.toUpperCase() || "";
      if (
        status.includes("CUSTOMER") ||
        status.includes("INSURANCE") ||
        status.includes("ADMIN") ||
        status.includes("SENT")
      ) {
        counts["SENT"] = (counts["SENT"] || 0) + 1;
      } else if (status === "APPROVED") {
        counts["APPROVED"] = (counts["APPROVED"] || 0) + 1;
      } else if (status === "REJECTED") {
        counts["REJECTED"] = (counts["REJECTED"] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  };

  const handleFilterByStatus = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? "" : status));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="shadow-xl bg-white/80 backdrop-blur-sm border-t-4 border-indigo-600 p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-indigo-600" size={20} />
            <h1 className="text-lg font-semibold text-gray-900">
              All Quotations
            </h1>
          </div>
          <div className="text-right">
            <p className="border border-gray-200 rounded-md px-2 py-0.5 text-sm font-medium">
              {quotations.length} quotations
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by quotation number, ticket ID, or customer name..."
              className="w-full pl-12 pr-4 py-3 bg-[#f3f4f6] h-12 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <Cards
            statusCounts={getStatusCounts()}
            onFilterByStatus={handleFilterByStatus}
          />

          <QuotationTable
            quotations={filteredQuotations}
            onView={setViewingQuotationId}
            onEdit={(id) =>
              router.push(`/dashboard/qutations/create?mode=edit&id=${id}`)
            }
            onDelete={setDeletingId}
            getCustomerName={getCustomerName}
            getTicketNumber={getTicketNumber}
            onStatusChange={handleStatusChange}
          />
        </div>

        {viewingQuotationId && (
          <View
            quotationId={viewingQuotationId}
            onClose={() => setViewingQuotationId(null)}
          />
        )}

        <DeleteConfirmModal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={async () => {
            try {
              await deleteItem("/technician-ticket-quotation", deletingId!);
              setQuotations((prev) => prev.filter((q) => q._id !== deletingId));
              toast.success("Deleted successfully");
            } catch (e) {
              console.log("atat", e);
              toast.error("Delete failed");
            }
            setDeletingId(null);
          }}
          title="Delete Quotation"
          message="Are you sure you want to delete this?"
        />
      </div>
    </div>
  );
};

export default ListAllQuotations;
