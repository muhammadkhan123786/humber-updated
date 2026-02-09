"use client";
import React from 'react';
import { FileText, Edit, User, Package } from 'lucide-react';
import PartsRequired from './PartsRequired';

interface Ticket {
  _id: string;
  ticketCode: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  vehicle: {
    serialNumber?: string;
    vehicleBrandId?: {
      _id: string;
      brandName: string;
    };
    vehicleModelId?: {
      _id: string;
      modelName: string;
    };
    vehicleType?: string;
    _id: string;
  };
  issue_Details: string;
  ticketStatus: string;
  priority: string;
  location: string;
  ticketSource?: string;
  assignedTechnician?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  technicianReport?: string;
  createdAt: string;
  updatedAt: string;
}

interface Part {
  _id: string;
  partName: string;
  partNumber: string;
  description?: string;
  unitCost?: number;
  stock?: number;
  isActive?: boolean;
}

interface SelectedPart extends Part {
  quantity: number;
}

interface TicketInformationProps {
  ticket: Ticket;
  onChangeTicket: () => void;
  selectedParts: SelectedPart[];
  onPartsChange: (parts: SelectedPart[]) => void;
}

const TicketInformation = ({ ticket, onChangeTicket, selectedParts, onPartsChange }: TicketInformationProps) => {
  const customerName = `${ticket.customer.firstName} ${ticket.customer.lastName}`;
  const productName = ticket.vehicle.vehicleBrandId?.brandName && ticket.vehicle.vehicleModelId?.modelName
    ? `${ticket.vehicle.vehicleBrandId.brandName} ${ticket.vehicle.vehicleModelId.modelName}`
    : 'N/A';

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'created':
        return 'bg-blue-500';
      case 'open':
        return 'bg-cyan-500';
      case 'in progress':
        return 'bg-amber-500';
      case 'awaiting parts':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-white rounded-b-2xl border-t-4 border-green-500 shadow-lg animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-10 ">
          <div className="flex items-center gap-2">
            <FileText className="text-green-600 w-5 h-5" />
            <h2 className="font-medium text-gray-900 leading-none">Ticket Information</h2>
          </div>
          <button
            onClick={onChangeTicket}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700  rounded-lg hover:text-white hover:bg-[#10b981]  transition-colors"
          >
            <Edit size={16} />
            <span>Change</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Ticket ID and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Ticket ID</p>
              <p className="text-base font-semibold text-gray-900">{ticket.ticketCode}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(ticket.ticketStatus)}`}>
                {ticket.ticketStatus}
              </span>
            </div>
          </div>

          {/* Customer and Product */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-600 ">Customer</p>
              <div className="flex items-center gap-1 rounded-lg ">
                <User className="w-3 h-3  shrink-0" />
                <span className="text-base font-medium text-gray-900">{customerName}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 ">Product</p>
              <div className="flex items-center gap-1 rounded-lg ">
                <Package className="w-3 h-3 \ shrink-0" />
                <span className="text-base font-medium  text-gray-900">{productName}</span>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Issue Description</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-line">
                {ticket.issue_Details || 'No issue details provided'}
              </p>
            </div>
          </div>

          {/* Technician Report */}
          {/* <div>
            <p className="text-sm text-gray-600 mb-2">Technician Report</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {ticket.technicianReport || 'Motor controller burnt out. Battery needs replacement. Front wheel bearing worn.'}
              </p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Parts Required Section */}
      <PartsRequired 
        selectedParts={selectedParts}
        onPartsChange={onPartsChange}
      />
    </div>
  );
};

export default TicketInformation;
