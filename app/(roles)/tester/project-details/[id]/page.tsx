import React from 'react'
import ProjectDetailPage from '@/components/roles/tester/ProjectDetailPage'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function Page({ params }: PageProps) {
  const { id } = await params
  
  return (
    <>
      <ProjectDetailPage projectId={id} />
    </>
  )
}

export default Page
