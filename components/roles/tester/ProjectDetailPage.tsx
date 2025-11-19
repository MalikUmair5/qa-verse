'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import type { Project } from '@/lib/types'
import Loader from '@/components/ui/loader'

interface ProjectDetailPageProps {
  projectId: string
}

function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [projectStats, setProjectStats] = useState({
    bugsReported: 0,
    activeTesters: 0
  })
  
  // Get the 'from' parameter to know where user came from
  const fromParam = searchParams.get('from') || 'dashboard'

  useEffect(() => {
    fetchProjectDetails()
  }, [projectId])

  const fetchProjectDetails = async () => {
    setIsLoading(true)
    try {
      const response = await api.projects.getById(projectId)
      if (response.success && response.data) {
        setProject(response.data as Project)
        // Calculate stats from project data
        setProjectStats({
          bugsReported: (response.data as Project).bugsFound || 0,
          activeTesters: (response.data as Project).participants || 0
        })
      }
    } catch (err) {
      console.error('Failed to fetch project:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy':
        return 'bg-green-500'
      case 'Medium':
        return 'bg-yellow-500'
      case 'Hard':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Show loader while loading
  if (isLoading || !project) {
    return <Loader />
  }

  return (
    <div className='min-h-screen bg-[#FFFCFB]'>

      <div className='p-4 sm:p-6 md:p-8 max-w-7xl mx-auto'>
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-[#171717] mb-4 sm:mb-6 hover:text-[#A33C13] transition-colors'
          whileHover={{ x: -5 }}
        >
          <FiArrowLeft size={20} />
          <span className='font-medium'>Back</span>
        </motion.button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2'>
            {/* Title and Badges */}
            <div className='mb-6'>
              <div className='flex flex-wrap items-center gap-2 sm:gap-3 mb-4'>
                <span className='px-3 py-1 bg-[#F5E6DD] text-[#171717] rounded-full text-xs sm:text-sm font-medium'>
                  {project.category}
                </span>
                <span className={`px-3 py-1 ${getDifficultyColor(project.difficulty)} text-white rounded-full text-xs sm:text-sm font-medium`}>
                  {project.difficulty}
                </span>
              </div>

              <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171717] mb-4'>
                {project.title}
              </h1>

              <p className='text-[#171717] text-sm sm:text-base lg:text-lg leading-relaxed'>
                {project.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8'>
              <motion.button
                onClick={() => router.push(`/tester/report-bug?from=${fromParam}&projectId=${projectId}`)}
                className='px-6 py-3 bg-[#A33C13] text-white rounded-lg font-medium hover:bg-[#8a2f0f] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Report Bug
              </motion.button>
              {project.testingUrl && (
                <motion.a
                  href={project.testingUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm sm:text-base'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiExternalLink size={18} />
                  Start Testing
                </motion.a>
              )}
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors flex items-center gap-2'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiGithub size={18} />
                  GitHub
                </motion.a>
              )}
            </div>

            {/* Testing Instructions */}
            {project.testingInstructions && (
              <div className='mb-6 sm:mb-8'>
                <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                  <span>📋</span>
                  Testing Instructions
                </h2>
                <div className='bg-[#F5F5F5] rounded-lg p-4 sm:p-6'>
                  <div className='prose prose-sm sm:prose max-w-none'>
                    {project.testingInstructions.split('\n').map((line, index) => (
                      <p key={index} className='text-[#171717] mb-2'>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Testing Focus Areas */}
            {project.focusAreas && project.focusAreas.length > 0 && (
              <div className='mb-6 sm:mb-8'>
                <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                  <span>🎯</span>
                  Testing Focus Areas
                </h2>
                <div className='flex flex-wrap gap-2 sm:gap-3'>
                  {project.focusAreas.map((area, index) => (
                    <span
                      key={index}
                      className='px-3 sm:px-4 py-2 bg-[#F5E6DD] text-[#171717] rounded-lg font-medium text-sm sm:text-base'
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className='mb-6 sm:mb-8'>
                <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                  <span>💻</span>
                  Tech Stack
                </h2>
                <div className='flex flex-wrap gap-2 sm:gap-3'>
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className='px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium text-sm sm:text-base'
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Project Stats & Info */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-24'>
              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4 sm:mb-6'>
                Maintained By
              </h3>
              <p className='text-[#A33C13] font-medium mb-4 sm:mb-6'>
                {project.maintainerName || 'Project Team'}
              </p>

              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>📊</span>
                Project Stats
              </h3>

              <div className='space-y-3 sm:space-y-4'>
                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg sm:text-xl'>🐛</span>
                    <span className='text-[#171717] font-medium text-sm sm:text-base'>Bugs Reported</span>
                  </div>
                  <span className='font-bold text-[#171717]'>{projectStats.bugsReported}</span>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg sm:text-xl'>👥</span>
                    <span className='text-[#171717] font-medium text-sm sm:text-base'>Active Testers</span>
                  </div>
                  <span className='font-bold text-[#171717]'>{projectStats.activeTesters}</span>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg sm:text-xl'>⚡</span>
                    <span className='text-[#171717] font-medium text-sm sm:text-base'>Bugs Found</span>
                  </div>
                  <span className='font-bold text-[#171717]'>{project.bugsFound || 0}</span>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg sm:text-xl'>✅</span>
                    <span className='text-[#171717] font-medium text-sm sm:text-base'>Bugs Resolved</span>
                  </div>
                  <span className='font-bold text-[#171717]'>{project.bugsResolved || 0}</span>
                </div>
              </div>

              {/* Quick Report Bug Button */}
              <motion.button
                onClick={() => router.push(`/tester/report-bug?from=${fromParam}&projectId=${projectId}`)}
                className='w-full mt-6 px-6 py-3 bg-gradient-to-r from-[#A33C13] to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Quick Report Bug
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
