'use client'
import React from 'react'
import TicketCard, { Ticket } from './TicketCard'
import TicketTable from './TicketTable'

interface ListDataProps {
  viewMode: 'grid' | 'table'
  tickets?: Ticket[]
  onViewDetails?: (ticket: Ticket) => void
}

// Sample ticket data for demonstration
const sampleTickets: Ticket[] = [
  {
    id: '1',
    ticketId: 'T-2026-001',
    customer: 'John Smith',
    product: 'Pride Victory 10',
    issue: 'Battery not holding charge, scooter stops after 15 minutes of use',
    status: 'in progress',
    urgency: 'high',
    source: 'phone',
    location: 'workshop',
    technician: 'Mike Anderson',
    technicianAvatar: 'MA',
    created: '1/8/2026'
  },
  {
    id: '2',
    ticketId: 'T-2026-002',
    customer: 'Mary Johnson',
    product: 'Drive Scout',
    issue: 'Front wheel making grinding noise when turning left',
    status: 'open',
    urgency: 'medium',
    source: 'online',
    location: 'on-site',
    technician: undefined,
    created: '1/9/2026'
  },
  {
    id: '3',
    ticketId: 'T-2026-003',
    customer: 'Robert Williams',
    product: 'Golden Buzzaround XL',
    issue: 'Tiller steering column loose, needs adjustment and tightening',
    status: 'completed',
    urgency: 'low',
    source: 'walk-in',
    location: 'workshop',
    technician: 'Sarah Davis',
    technicianAvatar: 'SD',
    created: '1/5/2026'
  }
]

const ListData = ({ 
  viewMode, 
  tickets = sampleTickets,
  onViewDetails
}: ListDataProps) => {
  
  const handleViewDetails = (ticket: Ticket) => {
    console.log('View details:', ticket)
    onViewDetails?.(ticket)
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
          key={ticket.id}
          ticket={ticket}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  )
}

export default ListData
