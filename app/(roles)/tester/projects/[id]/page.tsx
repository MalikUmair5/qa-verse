import React from 'react'
import ProjectDetailPage from '@/components/roles/tester/ProjectDetailPage'

interface PageProps {
  params: {
    id: string
  }
}

function Page({ params }: PageProps) {
  return (
    <>
      <ProjectDetailPage projectId={params.id} />
    </>
  )
}

export default Page
