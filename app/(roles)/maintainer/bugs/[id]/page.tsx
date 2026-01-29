import React from 'react'
import ProjectDetailPage from '@/components/shared/ProjectDetailsPage'

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
