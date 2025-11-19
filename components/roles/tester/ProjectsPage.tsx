'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import Loader from '@/components/ui/loader'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  participants: number
  bugs: number
  onView: () => void
  onReportBug: () => void
  viewLoading: boolean
  reportLoading: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  participants,
  bugs,
  onView,
  onReportBug,
  viewLoading,
  reportLoading,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      {/* Image Section */}
      <div className="relative h-40 bg-gray-100 overflow-hidden flex items-center justify-center">
        <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Stats and Actions */}
        <div className="flex flex-col gap-3">
          {/* Stats */}
          <div className="flex items-center space-x-3">
            {/* Participants */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-xs font-medium text-gray-700">{participants}</span>
            </div>

            {/* Bugs */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium text-gray-700">{bugs}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onReportBug}
              disabled={reportLoading}
              className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-md transition-colors duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {reportLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Report Bug'
              )}
            </button>
            <button 
              onClick={onView}
              disabled={viewLoading}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {viewLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'View'
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectsPage() {
  const router = useRouter()
  const { projects, isLoading } = useProjects({})
  const [viewLoadingId, setViewLoadingId] = useState<string | null>(null)
  const [reportLoadingId, setReportLoadingId] = useState<string | null>(null)

  const handleViewProject = (projectId: string) => {
    setViewLoadingId(projectId)
    router.push(`/tester/project-details/${projectId}?from=projects`)
  }

  const handleReportBug = (projectId: string) => {
    setReportLoadingId(projectId)
    router.push('/tester/report-bug?from=projects')
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-[#FFFCFB]">
      <div className="p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">My Projects</h1>
            <p className="text-sm sm:text-base text-[#171717]">Find the next exciting project to test and contribute to.</p>
          </div>

          {/* Empty State */}
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-600">You haven&apos;t enrolled in any projects. Start exploring projects to test!</p>
            </div>
          ) : (
            /* Projects Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProjectCard 
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    participants={project.participants || 0}
                    bugs={project.bugsFound || 0}
                    onView={() => handleViewProject(project.id)}
                    onReportBug={() => handleReportBug(project.id)}
                    viewLoading={viewLoadingId === project.id}
                    reportLoading={reportLoadingId === project.id}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectsPage
