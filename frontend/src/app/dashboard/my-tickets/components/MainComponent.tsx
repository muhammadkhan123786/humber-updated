'use client'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import Searchbar from './Searchbar'
import ListData from './ListData'

const MainComponent = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  return (
    <div>
      <div className='pb-6'>
        <h2 className="text-3xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Service Tickets</h2>
        <p className='text-gray-600 mt-1'>Manage and track all service tickets</p>
      </div>
      <div className='space-y-6'>
        <Searchbar viewMode={viewMode} onViewModeChange={setViewMode} />
        <ListData viewMode={viewMode} />
      </div>
    </div>
  )
}

export default MainComponent
