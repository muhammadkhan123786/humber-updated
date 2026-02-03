'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Search, Filter, Grid3x3, List, Check, ChevronDown } from 'lucide-react'
import { DropdownAnimation } from './Animation'

interface DropdownOption {
  label: string
  value: string
}

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [selectedUrgency, setSelectedUrgency] = useState('All Urgencies')
  const [selectedSource, setSelectedSource] = useState('All Sources')
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isUrgencyOpen, setIsUrgencyOpen] = useState(false)
  const [isSourceOpen, setIsSourceOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const closeAllDropdowns = () => {
    setIsStatusOpen(false)
    setIsUrgencyOpen(false)
    setIsSourceOpen(false)
  }

  const closeOthersExceptStatus = () => {
    setIsUrgencyOpen(false)
    setIsSourceOpen(false)
  }

  const closeOthersExceptUrgency = () => {
    setIsStatusOpen(false)
    setIsSourceOpen(false)
  }

  const closeOthersExceptSource = () => {
    setIsStatusOpen(false)
    setIsUrgencyOpen(false)
  }

  const statusOptions: DropdownOption[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Awaiting Parts', value: 'awaiting-parts' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  const urgencyOptions: DropdownOption[] = [
    { label: 'All Urgencies', value: 'all' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Emergency', value: 'emergency' },
  ]

  const sourceOptions: DropdownOption[] = [
    { label: 'All Sources', value: 'all' },
    { label: 'Phone', value: 'phone' },
    { label: 'Online', value: 'online' },
    { label: 'Walk In', value: 'walk-in' },
  ]

  const Dropdown = ({
    options,
    selected,
    onSelect,
    isOpen,
    setIsOpen,
    placeholder,
    closeOthers
  }: {
    options: DropdownOption[]
    selected: string
    onSelect: (value: string) => void
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    placeholder: string
    closeOthers: () => void
  }) => {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        setHoveredIndex(0) // Auto-hover first item when dropdown opens
      } else {
        setHoveredIndex(null)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, setIsOpen])

    const handleToggle = () => {
      if (!isOpen) {
        closeOthers()
      }
      setIsOpen(!isOpen)
    }

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleToggle}
          className={`flex items-center justify-between gap-2 px-4 py-2 bg-[#f3f4f6] border rounded-lg transition-all min-w-48 h-9 focus:outline-none ${
            isOpen 
              ? 'border-[#4f46e5] ring-2 ring-[#4f46e5]/50' 
              : 'border-gray-300 hover:border-gray-400 focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/50'
          }`}
        >
          <span className="text-sm text-gray-700">{selected}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <DropdownAnimation isOpen={isOpen}>
          <div className="p-1">
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.label)
                  setIsOpen(false)
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(0)}
                className={`w-full  px-3 py-1.5 text-left text-sm flex items-center justify-between transition-colors rounded-md ${
                  hoveredIndex === index
                    ? 'bg-[#10b981] text-white'
                    : 'text-gray-700'
                }`}
              >
                <span>{option.label}</span>
                {selected === option.label && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </DropdownAnimation>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* First Row: Search and Filters */}
      <div className="flex items-center gap-3 mb-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets, customers, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-10 pr-3 py-1 bg-[#f3f4f6] border border-gray-300 rounded-lg placeholder:text-[#6b7280] text-sm focus:outline-none focus:border focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/50 transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <Dropdown
          options={statusOptions}
          selected={selectedStatus}
          onSelect={setSelectedStatus}
          isOpen={isStatusOpen}
          setIsOpen={setIsStatusOpen}
          placeholder="All Statuses"
          closeOthers={closeOthersExceptStatus}
        />

        {/* Urgency Dropdown */}
        <Dropdown
          options={urgencyOptions}
          selected={selectedUrgency}
          onSelect={setSelectedUrgency}
          isOpen={isUrgencyOpen}
          setIsOpen={setIsUrgencyOpen}
          placeholder="All Urgencies"
          closeOthers={closeOthersExceptUrgency}
        />

        {/* Source Dropdown */}
        <Dropdown
          options={sourceOptions}
          selected={selectedSource}
          onSelect={setSelectedSource}
          isOpen={isSourceOpen}
          setIsOpen={setIsSourceOpen}
          placeholder="All Sources"
          closeOthers={closeOthersExceptSource}
        />

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1 ml-auto bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 px-2.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-[#10b981] hover:text-blue-600'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 px-2.5 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-[#10b981] hover:text-blue-600'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Second Row: Filter and Showing Count */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Filter className="w-4 h-4" />
        <span>Showing <span className="font-semibold text-indigo-600">3</span> of <span className="font-semibold text-gray-600">3</span> tickets</span>
      </div>
    </div>
  )
}

export default Searchbar
