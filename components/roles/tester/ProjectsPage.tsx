'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/loader'

interface ProjectCardProps {
  title: string
  description: string
  participants: number
  bugs: number
  onView: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  participants,
  bugs,
  onView,
}) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 w-full max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center space-x-4">
            {/* Participants */}
            <div className="flex items-center space-x-1">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{participants}</span>
            </div>

            {/* Bugs */}
            <div className="flex items-center space-x-1">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{bugs}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
              Report Bug
            </button>
            <button 
              onClick={onView}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])
  
  const projects = [
    {
      id: '1',
      title: 'Quantum Leap CRM',
      description: 'A next-generation CRM for optimizing sales pipelines and...',
      participants: 12,
      bugs: 12,
    },
    {
      id: '2',
      title: 'Quantum Leap CRM',
      description: 'A next-generation CRM for optimizing sales pipelines and...',
      participants: 12,
      bugs: 12,
    },
  ]

  const handleViewProject = (projectId: string) => {
    router.push(`/tester/project-details/${projectId}?from=projects`)
  }

  // Show loader while loading
  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">Find the next exciting project to test and contribute to.</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard 
                {...project} 
                onView={() => handleViewProject(project.id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default ProjectsPage
