import React from 'react'
import ProjectDetailsPage from '../../../../../components/shared/ProjectDetailsPage'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function Page({ params }: PageProps) {
  const { id } = await params

  return (
    <>
      <ProjectDetailsPage projectId={id} />
    </>
  )
}

export default Page