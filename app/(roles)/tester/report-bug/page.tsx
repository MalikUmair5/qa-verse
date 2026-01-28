'use client'

import React, { Suspense } from 'react'
import ReportBugPage from '@/components/roles/tester/ReportBugPage'

function ReportBugPageWithSuspense() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFCFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33C13]"></div>
      </div>
    }>
      <ReportBugPage />
    </Suspense>
  )
}

export default function ReportBugRoute() {
  return <ReportBugPageWithSuspense />
}
