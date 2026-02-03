'use client'
import React from 'react'
import { Clock, User, Package, Wrench, Calendar } from 'lucide-react'

export interface Ticket {
  _id: string
  ticketCode: string
  customer: {
    firstName: string
    lastName: string
    email: string
  }
  vehicle: {
    make?: string
    model?: string
    year?: number
  }
  issue_Details: string
  ticketStatus: string
  priority: string
  location: string
  assignedTechnicianId: string[]
  createdAt: string
  updatedAt: string
}

interface TicketCardProps {
  ticket: Ticket
  onViewDetails?: (ticket: Ticket) => void
}

const TicketCard = ({ ticket, onViewDetails }: TicketCardProps) => {
  const customerName = `${ticket.customer.firstName} ${ticket.customer.lastName}`
  const productName = ticket.vehicle.make && ticket.vehicle.model 
    ? `${ticket.vehicle.make} ${ticket.vehicle.model}${ticket.vehicle.year ? ` (${ticket.vehicle.year})` : ''}`
    : 'N/A'
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-gradient-to-r from-orange-500 to-red-500'
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-amber-500'
      case 'low': return 'bg-gradient-to-r from-gray-500 to-gray-600'
      case 'emergency': return 'bg-gradient-to-r from-red-600 to-rose-700'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/30'
      case 'in progress': return 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/30'
      case 'awaiting parts': return 'bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-yellow-500/30'
      case 'completed': return 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30'
      case 'cancelled': return 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-500/30'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-500/30'
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ">
        {/* Top Gradient Border */}
        <div className="h-1 bg-linear-to-r from-blue-500 to-cyan-500"></div>
        
        <div className="p-5 pt-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-indigo-600">
                {ticket.ticketCode}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium uppercase ${getUrgencyColor(ticket.priority)} text-white`}>
                {ticket.priority}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 gap-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent ${getStatusColor(ticket.ticketStatus)} text-white border-0 shadow-md text-xs`}>
              {ticket.ticketStatus}
            </span>
          </div>

        {/* Customer & Product */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4 text-indigo-600 " />
            <span className="font-medium text-sm bg-linear-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">{customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="h-4 w-4 text-purple-600" />
            <span className="text-sm">{productName}</span>
          </div>
        </div>

        {/* Issue Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.issue_Details}</p>

        {/* Footer Info */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-gray-600" />
            <span className="capitalize">{ticket.location}</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <Calendar className="w-3.5 h-3.5 text-gray-600" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-3 border-t border-gray-100">
          <button 
            onClick={() => onViewDetails?.(ticket)}
            className="text-sm font-medium bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-indigo-600 flex items-center gap-1 transition-all"
          >
            View Details
            <span className="ml-1">→</span>
          </button>
        </div>
      </div>

    </div>
    </>
  )
}
export default TicketCard;
