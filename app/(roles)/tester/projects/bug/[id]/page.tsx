'use client'

import React, { Suspense } from 'react'
import BugReportDetailPage from '@/components/roles/tester/BugReportDetailPage'

interface BugReportPageProps {
  params: Promise<{
    id: string
  }>
}

function BugReportDetailWithSuspense({ params }: BugReportPageProps) {
  const [bugId, setBugId] = React.useState<string>('')

  React.useEffect(() => {
    const getBugId = async () => {
      const { id } = await params
      setBugId(id)
    }
    getBugId()
  }, [params])

  if (!bugId) {
    return (
      <div className="min-h-screen bg-[#FFFCFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33C13]"></div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFCFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33C13]"></div>
      </div>
    }>
      <BugReportDetailPage bugId={bugId} />
    </Suspense>
  )
}

export default function BugReportPage({ params }: BugReportPageProps) {
  return <BugReportDetailWithSuspense params={params} />
}