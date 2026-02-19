import React, { Suspense } from 'react'
import CreateQuotationPage from './components/CreateQutation'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateQuotationPage />
    </Suspense>

  )
}

export default page
