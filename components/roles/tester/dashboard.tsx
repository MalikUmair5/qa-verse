"use client"
import ProjectCard from '@/components/ui/projectCard'
import React from 'react'

function Dashboard() {
  return (
    <>
      <div className='flex p-8 bg-background min-h-screen flex-wrap gap-8 justify-start'>
        <ProjectCard
          title='QuantumLeap CRM'
          description='A CRM tool for managing customer relationships'
          category='Functionality'
          difficulty='Medium'
          participants={12}
          bugs={8}
          image='/window.svg'
          onView={() => console.log('View Project')}
        />
        <ProjectCard
          title='QuantumLeap CRM'
          description='A CRM tool for managing customer relationships'
          category='Functionality'
          difficulty='Medium'
          participants={12}
          bugs={8}
          image='/window.svg'
          onView={() => console.log('View Project')}
        />
      </div>
    </>
  )
}

export default Dashboard