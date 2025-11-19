import React, { Suspense } from 'react'
import ProjectDetailPage from '@/components/roles/tester/ProjectDetailPage'
import Loader from '@/components/ui/loader'

interface PageProps {
  params: {
    id: string
  }
}

function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<Loader />}>
      <ProjectDetailPage projectId={params.id} />
    </Suspense>
  )
}

export default Page
