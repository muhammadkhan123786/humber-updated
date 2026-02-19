import React, { Suspense } from 'react'
import Topbar from './components/Topbar'
import ListAllQuotations from './list/components/ListAllQuotations'

const page = () => {
  return (
    <div>
      <Topbar />
      <Suspense fallback={<div>Loading...</div>}>
        <ListAllQuotations />
      </Suspense>
    </div>
  )
}

export default page
