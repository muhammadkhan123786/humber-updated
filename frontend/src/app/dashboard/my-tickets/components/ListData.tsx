'use client'
import React from 'react'
import TicketCard, { Ticket } from './TicketCard'
import TicketTable from './TicketTable'

interface ListDataProps {
  viewMode: 'grid' | 'table'
  tickets: Ticket[]
  onViewDetails?: (ticket: Ticket) => void
  isLoading?: boolean
}

const ListData = ({ 
  viewMode, 
  tickets,
  onViewDetails,
  isLoading = false
}: ListDataProps) => {
  
  const handleViewDetails = (ticket: Ticket) => {
    console.log('View details:', ticket)
    onViewDetails?.(ticket)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">No tickets found</p>
      </div>
    )
  }

  if (viewMode === 'table') {
    return (
      <TicketTable
        tickets={tickets}
        onViewDetails={handleViewDetails}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket._id}
          ticket={ticket}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  )
}

export default ListData
