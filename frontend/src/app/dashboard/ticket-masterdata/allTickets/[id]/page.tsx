"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  User,
  Package,
  ClipboardList,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Wrench,
  CheckCircle,
  Clock,
  Briefcase,
  Building,
  Car,
  Tag,
  Hash,
  Palette,
} from "lucide-react";
import { getAlls } from "../../../../../helper/apiHelper";

interface Vehicle {
  _id: string;
  userId: string;
  isActive: boolean;
  isDeleted: boolean;
  isDefault: boolean;
  vehicleBrandId: string | any;
  vehicleModelId: string | any;
  serialNumber: string;
  vehicleType: string;
  purchaseDate: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  vehiclePhoto: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  vehicleRegistrationNumber?: string;
  color?: string;
  yearOfManufacture?: string;
}

interface Technician {
  _id: string;
  personId?: {
    firstName: string;
    lastName: string;
  };
  technicianStatus: string;
  employeeId: string;
  departmentId?: {
    departmentName: string;
  };
  contractTypeId?: {
    contractType: string;
  };
  specializationIds?: Array<{ MasterServiceType: string }>;
}
interface Ticket {
  ticketCode: string;
  ticketStatusId?: { label: string };
  priorityId?: { serviceRequestPrioprity: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ticketSource: string;
  location: string;
  address?: string;
  issue_Details?: string;
  vehicleRepairImages?: string[];
  userId?: { email: string };
  customerId?: string;
  vehicleId?: string | Vehicle;
  assignedTechnicianId?: Array<string | Technician>;
}

interface CustomerDetails {
  personId?: {
    firstName: string;
    lastName: string;
  };
  contactId?: {
    emailId: string;
    mobileNumber: string;
  };
  addressId?: {
    address: string;
    city: string;
    zipCode: string;
  };
}

interface BrandDetails {
  brandName: string;
}

interface ModelDetails {
  modelName: string;
}

const TicketDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetails | null>(null);
  const [vehicleDetails, setVehicleDetails] = useState<Vehicle | null>(null);
  const [technicianDetails, setTechnicianDetails] = useState<Technician[]>([]);
  const [activeTab, setActiveTab] = useState("Issue Details");
  const [brandDetails, setBrandDetails] = useState<BrandDetails | null>(null);
  const [modelDetails, setModelDetails] = useState<ModelDetails | null>(null);
  console.log(setBrandDetails, setModelDetails);
  useEffect(() => {
    const fetchTicketData = async () => {
      if (!id) return;
      try {
        const response = await getAlls(`/customer-tickets/${id}`);
        if (response && response.success) {
          const ticketData: any = response.data;
          setTicket(ticketData);
          if (ticketData.customerId) {
            if (
              typeof ticketData.customerId === "object" &&
              ticketData.customerId !== null
            ) {
              setCustomerDetails({
                personId: ticketData.customerId.personId,
                contactId: ticketData.customerId.contactId,
                addressId: ticketData.customerId.addressId,
              });
            } else {
              try {
              } catch (err) {
                console.warn("Could not fetch customer details:", err);
              }
            }
          }

          const fetchVehicleData = async () => {
            if (!ticketData.vehicleId) return;

            try {
              let vehicleData: any = null;

              if (
                typeof ticketData.vehicleId === "object" &&
                ticketData.vehicleId !== null &&
                ticketData.vehicleId._id
              ) {
                vehicleData = ticketData.vehicleId;
              } else {
                const vehicleRes: any = await getAlls(
                  `/customer-vehicle-register/${ticketData.vehicleId}`,
                );

                if (vehicleRes && vehicleRes.success) {
                  vehicleData = Array.isArray(vehicleRes.data)
                    ? vehicleRes.data[0]
                    : vehicleRes.data;
                }
              }

              if (vehicleData) {
                setVehicleDetails(vehicleData);

                if (vehicleData.vehicleBrandId) {
                  try {
                  } catch (err) {
                    console.warn("Could not fetch brand details:", err);
                  }
                }

                if (vehicleData.vehicleModelId) {
                  try {
                  } catch (err) {
                    console.warn("Could not fetch model details:", err);
                  }
                }
              }
            } catch (err) {
              console.warn("Could not fetch vehicle details:", err);
            }
          };

          fetchVehicleData();

          if (
            ticketData.assignedTechnicianId &&
            Array.isArray(ticketData.assignedTechnicianId)
          ) {
            const techPromises = ticketData.assignedTechnicianId.map(
              (tech: any) => getAlls(`/technicians/${tech._id || tech}`),
            );
            try {
              const techResults = await Promise.all(techPromises);
              setTechnicianDetails(
                techResults.filter((res) => res.success).map((res) => res.data),
              );
            } catch (err) {
              console.warn("Could not fetch technician details:", err);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );

  if (!ticket)
    return (
      <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Ticket Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The ticket you looking for does not exist.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const tabs = [
    "Issue Details",
    "Coverage",
    "Parts",
    "Invoice",
    "Activity Log",
  ];
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-[#00A3FF] text-white"; // Bright Blue
      case "in progress":
        return "bg-[#FF8A00] text-white"; // Orange
      case "completed":
        return "bg-[#00C853] text-white"; // Success Green
      case "pending":
        return "bg-[#FFB800] text-white"; // Yellow-Orange (Same as Medium)
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-gradient-to-r from-[#FF8A00] to-[#FF3D00] text-white";
      case "medium":
        return "bg-gradient-to-r from-[#FFB800] to-[#FF8A00] text-white";
      case "low":
        return "bg-[#4B5563] text-white"; // Dark slate/grey for Low
      default:
        return "bg-gray-400 text-white";
    }
  };
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getVehicleInfo = () => {
    if (!vehicleDetails) return { brand: "Unknown", model: "", type: "" };

    const brand =
      brandDetails?.brandName ||
      (typeof vehicleDetails.vehicleBrandId === "object"
        ? vehicleDetails.vehicleBrandId?.brandName
        : "Unknown Brand");
    const model =
      modelDetails?.modelName ||
      (typeof vehicleDetails.vehicleModelId === "object"
        ? vehicleDetails.vehicleModelId?.modelName
        : "");
    const type = vehicleDetails.vehicleType || "";

    return { brand, model, type };
  };

  const { brand, model, type } = getVehicleInfo();

  return (
    <div className="min-h-screen bg-[#F8F9FF] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <button
            onClick={() => router.back()}
            className="mt-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1C1E] tracking-tight">
                {ticket.ticketCode || "TKT-N/A"}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${getStatusColor(
                    ticket.ticketStatusId?.label,
                  )}`}
                >
                  {ticket.ticketStatusId?.label || "Unknown"}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${getPriorityColor(
                    ticket.priorityId?.serviceRequestPrioprity,
                  )}`}
                >
                  {ticket.priorityId?.serviceRequestPrioprity || "Normal"}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Created: {formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>Updated: {formatDate(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Customer Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-6 text-gray-800 font-bold">
              <User size={20} className="text-blue-500" />
              <span>Customer</span>
            </div>
            <div className="space-y-3">
              {customerDetails ? (
                <>
                  <p className="text-gray-900 font-bold text-lg mb-1">
                    {customerDetails.personId?.firstName || ""}{" "}
                    {customerDetails.personId?.lastName || ""}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span>{customerDetails.contactId?.emailId || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>
                        {customerDetails.contactId?.mobileNumber || "N/A"}
                      </span>
                    </div>
                    {customerDetails.addressId && (
                      <div className="flex items-start gap-2 pt-2">
                        <MapPin size={14} className="text-gray-400 mt-0.5" />
                        <span>
                          {customerDetails.addressId.address}
                          {customerDetails.addressId.city &&
                            `, ${customerDetails.addressId.city}`}
                          {customerDetails.addressId.zipCode &&
                            `, ${customerDetails.addressId.zipCode}`}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <User size={32} className="mx-auto mb-2" />
                  <p>Customer details not available</p>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-6 text-gray-800 font-bold">
              <Car size={20} className="text-green-500" />
              <span>Product</span>
            </div>
            <div className="space-y-3">
              {vehicleDetails ? (
                <>
                  <div className="mb-2">
                    <p className="text-gray-900 font-bold text-lg">
                      {brand} {model}
                    </p>
                    {type && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {type}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-gray-400" />
                      <span>
                        <span className="text-gray-400">Make:</span> {brand}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-gray-400" />
                      <span>
                        <span className="text-gray-400">Model:</span> {model}
                      </span>
                    </div>

                    {/* Vehicle Details */}
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-gray-400" />
                      <span>
                        <span className="text-gray-400">S/N:</span>{" "}
                        {vehicleDetails.serialNumber || "N/A"}
                      </span>
                    </div>

                    {vehicleDetails.vehicleRegistrationNumber && (
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-gray-400" />
                        <span>
                          <span className="text-gray-400">Registration:</span>{" "}
                          {vehicleDetails.vehicleRegistrationNumber}
                        </span>
                      </div>
                    )}
                    {vehicleDetails.color && (
                      <div className="flex items-center gap-2">
                        <Palette size={14} className="text-gray-400" />
                        <span>
                          <span className="text-gray-400">Color:</span>{" "}
                          {vehicleDetails.color}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <Car size={32} className="mx-auto mb-2" />
                  <p>Vehicle details not available</p>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Info Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-6 text-gray-800 font-bold">
              <ClipboardList size={20} className="text-purple-500" />
              <span>Ticket Info</span>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Source:</span>
                <span className="text-gray-900 font-semibold">
                  {ticket.ticketSource}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Location:</span>
                <span className="text-gray-900 font-semibold">
                  {ticket.location}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Urgency:</span>
                <span
                  className={`px-2 py-1 text-gray-900 font-semibold
                  )}`}
                >
                  {ticket.priorityId?.serviceRequestPrioprity || "Normal"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Coverage:</span>
                <span className="text-gray-900 font-semibold">warranty</span>
              </div>
            </div>
          </div>
        </div>
        {technicianDetails.length > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-50 mb-12">
            <div className="flex items-center gap-3 mb-6 text-gray-800 font-bold">
              <Wrench size={20} className="text-orange-500" />
              <span>Assigned Technicians</span>
              <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {technicianDetails.length} assigned
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicianDetails.map((tech, index) => (
                <div
                  key={tech._id || index}
                  className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {tech.personId?.firstName?.[0]}
                      {tech.personId?.lastName?.[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        {tech.personId?.firstName} {tech.personId?.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            tech.technicianStatus === "Available"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tech.technicianStatus || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {tech.employeeId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Briefcase size={12} />
                      <span>
                        {tech.departmentId?.departmentName || "No Department"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building size={12} />
                      <span>
                        {tech.contractTypeId?.contractType || "No Contract"}
                      </span>
                    </div>
                    {tech.specializationIds &&
                      tech.specializationIds.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tech.specializationIds
                            .slice(0, 2)
                            .map((spec: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded"
                              >
                                {spec.MasterServiceType}
                              </span>
                            ))}
                          {tech.specializationIds.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              +{tech.specializationIds.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-2xl w-fit mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-50">
          {activeTab === "Issue Details" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={20} className="text-red-500" />
                <h3 className="text-lg font-bold text-gray-800">
                  Issue Details
                </h3>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {ticket.issue_Details || "No issue details provided."}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-400">Created By:</span>{" "}
                    <span className="font-medium">
                      {ticket.userId?.email || "System"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Updated:</span>{" "}
                    <span className="font-medium">
                      {formatDate(ticket.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Coverage" && (
            <div className="text-center py-12">
              <CheckCircle size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Coverage Information
              </h3>
              <p className="text-gray-600">
                Coverage details will be displayed here when available.
              </p>
            </div>
          )}

          {activeTab === "Parts" && (
            <div className="text-center py-12">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Parts Information
              </h3>
              <p className="text-gray-600">
                Parts details will be displayed here when available.
              </p>
            </div>
          )}

          {activeTab === "Invoice" && (
            <div className="text-center py-12">
              <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Invoice Details
              </h3>
              <p className="text-gray-600">
                Invoice information will be displayed here when available.
              </p>
            </div>
          )}

          {activeTab === "Activity Log" && (
            <div className="text-center py-12">
              <Clock size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Activity Log
              </h3>
              <p className="text-gray-600">
                Activity log will be displayed here when available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
