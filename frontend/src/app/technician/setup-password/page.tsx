import React, { Suspense } from 'react'
import SetupPasswordPage from './components/SetupPassword'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetupPasswordPage />
    </Suspense>
  )
}

export default page
