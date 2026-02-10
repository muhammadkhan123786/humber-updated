'use client'
import React from 'react'
import { X, User, Package, Wrench, Calendar, Phone, MapPin, Clock, FileText, AlertCircle } from 'lucide-react'
import { Ticket } from './TicketCard'
import { PopupAnimation } from './Animation'

interface TicketDetailsPopupProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
}

const TicketDetailsPopup: React.FC<TicketDetailsPopupProps> = ({ ticket, isOpen, onClose }) => {
  if (!ticket) return null

  const customerName = `${ticket.customer.firstName} ${ticket.customer.lastName}`
  const productName = ticket.vehicle.vehicleBrandId?.brandName && ticket.vehicle.vehicleModelId?.modelName
    ? `${ticket.vehicle.vehicleBrandId.brandName} ${ticket.vehicle.vehicleModelId.modelName}`
    : 'N/A'
  const formattedCreatedDate = new Date(ticket.createdAt).toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  const formattedUpdatedDate = new Date(ticket.updatedAt).toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-gradient-to-r from-blue-500 to-cyan-500'
      case 'in progress': return 'bg-gradient-to-r from-amber-500 to-orange-500'
      case 'awaiting parts': return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
      case 'completed': return 'bg-gradient-to-r from-green-500 to-emerald-500'
      case 'cancelled': return 'bg-gradient-to-r from-gray-400 to-gray-500'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-gradient-to-r from-orange-500 to-red-500'
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-amber-500'
      case 'low': return 'bg-gradient-to-r from-gray-500 to-gray-600'
      case 'emergency': return 'bg-gradient-to-r from-red-600 to-rose-700'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500'
    }
  }

  return (
    <PopupAnimation isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Ticket Details</h2>
              <p className="text-sm text-indigo-100">{ticket.ticketCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Status and Priority */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 font-medium text-sm text-white shadow-md ${getStatusColor(ticket.ticketStatus)}`}>
              {ticket.ticketStatus}
            </span>
            <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 font-medium text-sm text-white uppercase ${getUrgencyColor(ticket.priority)}`}>
              <AlertCircle className="w-4 h-4 mr-1" />
              {ticket.priority}
            </span>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Customer Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="text-sm font-medium text-gray-900">{customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm text-gray-700">{ticket.customer.email}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Vehicle Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Brand & Model</p>
                  <p className="text-sm font-medium text-gray-900">{productName}</p>
                </div>
                {ticket.vehicle.vehicleType && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="text-sm text-gray-700 capitalize">{ticket.vehicle.vehicleType}</p>
                  </div>
                )}
                {ticket.vehicle.serialNumber && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Serial Number</p>
                    <p className="text-sm text-gray-700">{ticket.vehicle.serialNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Issue Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-indigo-600" />
              Issue Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{ticket.issue_Details}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <MapPin className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{ticket.location}</p>
              </div>
            </div>

            {ticket.ticketSource && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <Phone className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{ticket.ticketSource}</p>
                </div>
              </div>
            )}

            {ticket.assignedTechnician && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <Wrench className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Assigned Technician</p>
                  <p className="text-sm font-medium text-gray-900">
                    {ticket.assignedTechnician.firstName} {ticket.assignedTechnician.lastName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm text-gray-700">{formattedCreatedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-700">{formattedUpdatedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            Edit Ticket
          </button>
        </div>
      </div>
    </PopupAnimation>
  )
}

export default TicketDetailsPopup
