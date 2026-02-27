"use client";
import { Briefcase, User, Car, AlertCircle, UserCheck, MapPin, Phone, Hash, FileText, Tag } from "lucide-react";

interface JobInfoProps {
  job: any;
}

const JobInfo = ({ job }: JobInfoProps) => {
  const customer = job?.ticketId?.customerId;
  const vehicle = job?.ticketId?.vehicleId;
  const ticket = job?.ticketId;
  const leadingTechnician = job?.leadingTechnicianId;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-indigo-600" size={28} />
            Job Details
          </h3>
          <p className="text-sm text-gray-500 mt-1">Complete job information and status</p>
        </div>
      </div>

      {/* Job & Ticket Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Info Card */}
        <div className="bg-linear-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Briefcase size={20} className="text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Job Information</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Hash size={18} className="text-indigo-600 mt-0.5" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Job ID</label>
                <p className="text-base font-bold text-gray-900">{job?.jobId || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText size={18} className="text-indigo-600 mt-0.5" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ticket Code</label>
                <p className="text-base font-semibold text-gray-900">{ticket?.ticketCode || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag size={18} className="text-indigo-600 mt-0.5" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                <p className="text-base font-semibold text-gray-900">{ticket?.ticketStatusId?.code || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Card */}
        <div 
          className="rounded-xl p-5 border shadow-sm text-white relative overflow-hidden"
          style={{ 
            background: ticket?.priorityId?.backgroundColor || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <AlertCircle size={20} className="text-white" />
              </div>
              <h4 className="text-lg font-bold">Priority Level</h4>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{ticket?.priorityId?.serviceRequestPrioprity || "N/A"}</p>
              <p className="text-sm text-white/80">Immediate attention required</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12"></div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-purple-600 rounded-lg">
            <User size={20} className="text-white" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Customer Information</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer Name</label>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {customer?.personId?.firstName} {customer?.personId?.lastName || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile Number</label>
            <div className="flex items-center gap-2 mt-1">
              <Phone size={16} className="text-purple-600" />
              <p className="text-base font-semibold text-gray-900">
                {customer?.contactId?.mobileNumber || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
            <div className="flex items-center gap-2 mt-1">
              <Phone size={16} className="text-purple-600" />
              <p className="text-base font-semibold text-gray-900">
                {customer?.contactId?.phoneNumber || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</label>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={16} className="text-purple-600" />
              <p className="text-base font-semibold text-gray-900">
                {customer?.addressId?.address || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-green-600 rounded-lg">
            <Car size={20} className="text-white" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Vehicle Information</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Product Name</label>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {vehicle?.productName || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehicle Type</label>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {vehicle?.vehicleType || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Model</label>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {vehicle?.vehicleModelId?.modelName || "N/A"}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Serial Number</label>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {vehicle?.serialNumber || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Leading Technician */}
      {leadingTechnician && (
        <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-600 rounded-lg">
              <UserCheck size={20} className="text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Leading Technician</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Technician Name</label>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {leadingTechnician?.personId?.firstName} {leadingTechnician?.personId?.lastName || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile Number</label>
              <div className="flex items-center gap-2 mt-1">
                <Phone size={16} className="text-orange-600" />
                <p className="text-base font-semibold text-gray-900">
                  {leadingTechnician?.contactId?.mobileNumber || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
              <div className="flex items-center gap-2 mt-1">
                <Phone size={16} className="text-orange-600" />
                <p className="text-base font-semibold text-gray-900">
                  {leadingTechnician?.contactId?.phoneNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue Details */}
      {ticket?.issue_Details && (
        <div className="bg-linear-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <AlertCircle size={20} className="text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Issue Details</h4>
          </div>
          <p className="text-base text-gray-700 leading-relaxed">
            {ticket.issue_Details}
          </p>
        </div>
      )}
    </div>
  );
};

export default JobInfo;
