'use client'
import React, { useState, useEffect } from 'react'
import Searchbar from './Searchbar'
import ListData from './ListData'
import { fetchTechnicianTickets, TicketFilters } from '@/services/ticketService'
import { Ticket } from './TicketCard'

const MainComponent = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    limit: 10,
    search: '',
  })
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  })

  const loadTickets = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetchTechnicianTickets(filters)
      setTickets(response.tickets)
      setPagination(response.pagination)
    } catch (err: any) {
      setError(err.message || 'Failed to load tickets')
      console.error('Error loading tickets:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [filters])

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleFiltersChange = (newFilters: { status?: string; urgency?: string; source?: string }) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
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
          totalTickets={pagination.total}
          displayedTickets={tickets.length}
        />
        <ListData 
          viewMode={viewMode} 
          tickets={tickets}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  )
}

export default MainComponent
