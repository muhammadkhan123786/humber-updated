"use client";
import  { useState, useEffect, useRef } from "react";
import { Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Cards from "./Cards";
import QuotationTable from "./QuotationTable";
import View from "./View";
import DeleteConfirmModal from "../../../my-tickets/components/DeleteConfirmModal";
import { getAlls, deleteItem, updateItem } from "@/helper/apiHelper";
import { toast } from "react-hot-toast";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface QuotationFromBackend {
  _id: string;
  ticketId: any;
  ticketCode: string;
  quotationStatus: string;
  quotationStatusId?: string;
  quotationAutoId?: string;
  ticket: {
    _id: string;
    ticketCode: string;
    [key: string]: any;
  };
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  partsList?: any[];
  labourTime?: number;
  labourRate?: number;
  partTotalBill?: number;
  labourTotalBill?: number;
  subTotalBill?: number;
  taxAmount?: number;
  netTotal?: number;
  aditionalNotes?: string;
  validityDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface QuotationStatus {
  _id: string;
  ticketQuationStatus: string;
  statusColor: string;
  statusIcon?: string;
  isActive: boolean;
  canChooseTechnician?: boolean;
}

const ListAllQuotations = () => {
  const router = useRouter();
  const [quotations, setQuotations] = useState<QuotationFromBackend[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<QuotationFromBackend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [viewingQuotationId, setViewingQuotationId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [quotationStatuses, setQuotationStatuses] = useState<QuotationStatus[]>([]);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchData();
      hasFetchedRef.current = true;
    }
  }, []);

  useEffect(() => {
    filterQuotations();
  }, [searchQuery, selectedStatus, quotations]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch quotations from technician endpoint
      const quotationsRes: any = await getAlls<any>(
        "/technician-ticket-quotation"
      );
      
      // Fetch ticket quotation statuses
      const statusesRes: any = await getAlls<QuotationStatus>(
        "/ticket-quotation-status"
      );
      
      // The backend returns "tickets" not "data" for this endpoint
      const quotationsData = Array.isArray(quotationsRes.tickets) ? quotationsRes.tickets : [];
      const statusesData = Array.isArray(statusesRes.data) ? statusesRes.data.filter((s: QuotationStatus) => s.isActive && s.canChooseTechnician) : [];
      
      // Map quotationStatus name to quotationStatusId for each quotation
      const mappedQuotations = (quotationsRes.data || []).map((quotation: QuotationFromBackend) => {
        if (!quotation.quotationStatusId && quotation.quotationStatus) {
          // Find the matching status ID from the status name
          const matchedStatus = statusesData.find(
            (s: QuotationStatus) => 
              s.ticketQuationStatus?.toLowerCase() === quotation.quotationStatus?.toLowerCase()
          );
          if (matchedStatus) {
            return { ...quotation, quotationStatusId: matchedStatus._id };
          }
        }
        return quotation;
      });
      
      setQuotations(mappedQuotations);
      setFilteredQuotations(quotationsData);
      setQuotationStatuses(statusesData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  const filterQuotations = () => {
    let filtered = [...quotations];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((q) => {
        const quotationNo = q.quotationAutoId?.toLowerCase() || "";
        const ticketNo = q.ticketCode?.toLowerCase() || "";
        const customerName = `${q.customer?.firstName || ""} ${q.customer?.lastName || ""}`.toLowerCase();
        
        return (
          quotationNo.includes(query) ||
          ticketNo.includes(query) ||
          customerName.includes(query)
        );
      });
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((q) => {
        const quotationStatusLower = q.quotationStatus?.toLowerCase() || "";
        const selectedStatusLower = selectedStatus.toLowerCase();
        
        // Match by checking if the status contains the filter text
        return quotationStatusLower.includes(selectedStatusLower) ||
               (selectedStatusLower === "sent" && quotationStatusLower.includes("send")) ||
               (selectedStatusLower === "draft" && quotationStatusLower.includes("draft")) ||
               (selectedStatusLower === "approved" && quotationStatusLower.includes("approve")) ||
               (selectedStatusLower === "rejected" && quotationStatusLower.includes("reject"));
      });
    }

    setFilteredQuotations(filtered);
  };

  const getCustomerName = (quotation: any): string => {
    // customer is directly on the quotation object from backend
    if (quotation?.customer) {
      const firstName = quotation.customer.firstName || "";
      const lastName = quotation.customer.lastName || "";
      return `${firstName} ${lastName}`.trim() || "Unknown Customer";
    }
    return "Unknown Customer";
  };

  const getTicketNumber = (quotation: any): string => {
    // ticketCode is directly on the quotation object from backend
    return quotation?.ticket?.ticketCode || "N/A";
  };

  const getStatusInfo = (quotation: any): { name: string; color: string; bgColor: string; statusColor?: string } => {
    // quotationStatus is already populated from backend as a string
    const statusName = quotation?.quotationStatus || "Unknown";
    
    // Find matching status from fetched statuses
    const matchedStatus = quotationStatuses.find(
      (s) => s?.ticketQuationStatus && statusName && s.ticketQuationStatus.toLowerCase() === statusName.toLowerCase()
    );
    
    if (matchedStatus && matchedStatus.statusColor) {
      return {
        name: statusName,
        color: "text-white",
        bgColor: ``,
        statusColor: matchedStatus.statusColor,
      };
    }
    
    // Fallback to default colors if no match found
    const statusLower = String(statusName).toLowerCase();

    if (statusLower.includes("sent") || statusLower.includes("send")) {
      return {
        name: statusName,
        color: "text-blue-700",
        bgColor: "bg-blue-100",
      };
    } else if (statusLower.includes("approved") || statusLower.includes("approve")) {
      return {
        name: statusName,
        color: "text-green-700",
        bgColor: "bg-green-100",
      };
    } else if (statusLower.includes("draft")) {
      return {
        name: statusName,
        color: "text-gray-700",
        bgColor: "bg-gray-100",
      };
    } else if (statusLower.includes("reject")) {
      return {
        name: statusName,
        color: "text-red-700",
        bgColor: "bg-red-100",
      };
    }

    return {
      name: statusName,
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    };
  };

  const getStatusCounts = () => {
    const counts: { [key: string]: number } = {};
    
    quotations.forEach((q) => {
      const statusInfo = getStatusInfo(q);
      const statusName = statusInfo.name;
      counts[statusName] = (counts[statusName] || 0) + 1;
    });

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
    }));
  };

  const handleView = (id: string) => {
    setViewingQuotationId(id);
  };

  const handleCloseView = () => {
    setViewingQuotationId(null);
  };

  const handleEdit = (id: string) => {
    // Navigate to edit page with quotation ID
    router.push(`/dashboard/qutations/create?mode=edit&id=${id}`);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteItem("/technician-ticket-quotation", deletingId);
      toast.success("Quotation deleted successfully");
      // Update state directly instead of re-fetching
      setQuotations(prev => prev.filter(q => q._id !== deletingId));
      setFilteredQuotations(prev => prev.filter(q => q._id !== deletingId));
    } catch (error) {
      console.error("Error deleting quotation:", error);
      toast.error("Failed to delete quotation");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFilterByStatus = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus("");
    } else {
      setSelectedStatus(status);
    }
  };

  const handleStatusChange = async (quotationId: string, newStatusId: string) => {
    try {
      // Find the status from the status ID
      const selectedStatus = quotationStatuses.find(s => s._id === newStatusId);
      if (!selectedStatus) {
        toast.error("Invalid status selected");
        return;
      }

      // Optimistically update local state first for immediate UI feedback
      const updatedQuotation = {
        quotationStatus: selectedStatus.ticketQuationStatus,
        quotationStatusId: newStatusId
      };

      setQuotations(prevQuotations =>
        prevQuotations.map(q =>
          q._id === quotationId ? { ...q, ...updatedQuotation } : q
        )
      );
      
      setFilteredQuotations(prevFiltered =>
        prevFiltered.map(q =>
          q._id === quotationId ? { ...q, ...updatedQuotation } : q
        )
      );

      // Update the quotation status in backend using the specific endpoint
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/update-technician-quotation-status`,
        {
          techncianQuotationId: quotationId,
          techncianQuotationStatusId: newStatusId,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
      // Revert the change on error
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="shadow-xl bg-white/80 backdrop-blur-sm border-t-4 border-indigo-600 p-6 animate-fadeIn">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header with Count */}
        <div className="mb-8 animate-slideUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="">
                <FileText className="text-indigo-600" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  All Quotations
                </h1>
              </div>
            </div>
            <div className="text-right">
              <p className="border border-gray-200 rounded-md px-2 py-0.5 text-sm  font-medium">
                {quotations.length} quotations
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="space-y-4 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by quotation number, ticket ID, or customer name..."
              className="w-full pl-12 pr-4 py-3 bg-[#f3f4f6] h-12 rounded-lg placeholder:text-[#6b7280] text-sm focus:outline-none focus:border focus:border-[#4f46e5] focus:ring-[3px] focus:ring-[#4f46e5]/50 transition-all"
            />
          </div>
        
            {/* Status Cards */}
        <Cards
          statusCounts={getStatusCounts()}
          onFilterByStatus={handleFilterByStatus}
        />

        {/* Quotations Table */}
        <QuotationTable
          quotations={filteredQuotations}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getCustomerName={getCustomerName}
          getTicketNumber={getTicketNumber}
          getStatusInfo={getStatusInfo}
          quotationStatuses={quotationStatuses}
          onStatusChange={handleStatusChange}
        />       
        </div>
        {/* View Modal */}
        {viewingQuotationId && (
          <View
            quotationId={viewingQuotationId}
            onClose={handleCloseView}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={confirmDelete}
          title="Delete Quotation"
          message="Are you sure you want to delete this quotation? This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default ListAllQuotations;
