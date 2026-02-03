'use client'
import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, Eye } from 'lucide-react'

interface ActionMenuProps {
  onViewDetails?: () => void
}

const ActionMenu = ({ onViewDetails }: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-dropdown">
          {onViewDetails && (
            <button
              onClick={() => {
                onViewDetails()
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ActionMenu
