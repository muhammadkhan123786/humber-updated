'use client'
import React from 'react'
import { Wrench, User, Eye } from 'lucide-react'
import { Ticket } from './TicketCard'

interface TicketTableProps {
  tickets: Ticket[]
  onViewDetails?: (ticket: Ticket) => void
}

const TicketTable = ({ tickets, onViewDetails }: TicketTableProps) => {

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
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => {
                const customerName = `${ticket.customer.firstName} ${ticket.customer.lastName}`
                const productName = ticket.vehicle.vehicleBrandId?.brandName && ticket.vehicle.vehicleModelId?.modelName 
                  ? `${ticket.vehicle.vehicleBrandId.brandName} ${ticket.vehicle.vehicleModelId.modelName}`
                  : 'N/A'
                const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
                
                return (
                <tr key={ticket._id} className="hover:bg-linear-to-r hover:from-gray-50 hover:to-transparent transition-all">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{ticket.ticketCode}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{customerName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{productName}</span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <span className="text-sm text-gray-600 line-clamp-2">{ticket.issue_Details}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 font-medium w-fit whitespace-nowrap text-xs text-white border-0 shadow-md ${getStatusColor(ticket.ticketStatus)}`}>
                      {ticket.ticketStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase text-white ${getUrgencyColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wrench className="w-4 h-4 text-purple-600" />
                      <span className="capitalize">{ticket.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-600 capitalize">{ticket.ticketSource || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {ticket.assignedTechnician ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm text-indigo-600 font-medium">{ticket.assignedTechnician.firstName} {ticket.assignedTechnician.lastName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{formattedDate}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onViewDetails?.(ticket)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TicketTable
