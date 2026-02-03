import { Search } from 'lucide-react'
import React from 'react'
import Searchbar from './Searchbar'

const MainComponent = () => {
  return (
    <div>
      <div className='pb-6'>
        <h2 className="text-3xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Service Tickets</h2>
        <p className='text-gray-600 mt-1'>Manage and track all service tickets</p>
      </div>
      <Searchbar />
    </div>
  )
}

export default MainComponent
