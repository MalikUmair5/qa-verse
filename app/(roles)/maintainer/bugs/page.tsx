'use client'

import React, { Suspense } from 'react'
import BugReportsPage from '@/components/shared/BugReportsPage'

function BugReportsPageWithSuspense() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[rgb(255,252,251)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33C13]"></div>
      </div>
    }>
      <BugReportsPage />
    </Suspense>
  )
}

export default function Page() {
  return <BugReportsPageWithSuspense />
}