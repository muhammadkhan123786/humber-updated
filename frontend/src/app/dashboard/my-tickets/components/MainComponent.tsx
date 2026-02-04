'use client'
import React, { useState, useEffect, useMemo } from 'react'
import Searchbar from './Searchbar'
import ListData from './ListData'
import { fetchTechnicianTickets } from '@/services/ticketService'
import { Ticket } from './TicketCard'

const MainComponent = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [allTickets, setAllTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{ status?: string; urgency?: string; source?: string }>({})

  // Load all tickets once
  const loadTickets = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetchTechnicianTickets({ page: 1, limit: 1000 })
      setAllTickets(response.tickets)
    } catch (err: any) {
      setError(err.message || 'Failed to load tickets')
      console.error('Error loading tickets:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  // Client-side filtering - no loading states!
  const filteredTickets = useMemo(() => {
    let result = [...allTickets]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(ticket => 
        ticket.ticketCode.toLowerCase().includes(query) ||
        ticket.customer.firstName.toLowerCase().includes(query) ||
        ticket.customer.lastName.toLowerCase().includes(query) ||
        ticket.customer.email.toLowerCase().includes(query) ||
        ticket.issue_Details.toLowerCase().includes(query) ||
        ticket.vehicle.vehicleBrandId?.brandName.toLowerCase().includes(query) ||
        ticket.vehicle.vehicleModelId?.modelName.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (filters.status) {
      result = result.filter(ticket => 
        ticket.ticketStatus.toLowerCase() === filters.status?.toLowerCase()
      )
    }

    // Urgency filter
    if (filters.urgency) {
      result = result.filter(ticket => 
        ticket.priority.toLowerCase() === filters.urgency?.toLowerCase()
      )
    }

    // Source filter
    if (filters.source) {
      result = result.filter(ticket => 
        ticket.ticketSource?.toLowerCase() === filters.source?.toLowerCase()
      )
    }

    return result
  }, [allTickets, searchQuery, filters])

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
  }

  const handleFiltersChange = (newFilters: { status?: string; urgency?: string; source?: string }) => {
    setFilters(newFilters)
  }

  const handleViewDetails = (ticket: Ticket) => {
    console.log('View ticket details:', ticket)
    // TODO: Implement view details modal or navigation
  }

  return (
    <div>
      <div className='pb-6'>
        <h2 className="text-3xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Service Tickets</h2>
        <p className='text-gray-600 mt-1'>Manage and track all service tickets</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <div className='space-y-6'>
        <Searchbar 
          viewMode={viewMode} 
          onViewModeChange={setViewMode}
          onSearchChange={handleSearchChange}
          onFiltersChange={handleFiltersChange}
          totalTickets={allTickets.length}
          displayedTickets={filteredTickets.length}
        />
        <ListData 
          viewMode={viewMode} 
          tickets={filteredTickets}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  )
}

export default MainComponent
