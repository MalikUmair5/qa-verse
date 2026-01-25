'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import { useRouter, useSearchParams } from 'next/navigation'
import Loader from '@/components/ui/loader'
import { getProjectById, ProjectResponse } from '@/lib/api/project-owner/projects'
import { showToast } from '@/lib/utils/toast'

interface ProjectDetailPageProps {
  projectId: string
}

function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<ProjectResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Get the 'from' parameter to know where user came from
  const fromParam = searchParams.get('from') || 'dashboard'

  // Fetch project data from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const projectData = await getProjectById(parseInt(projectId))
        setProject(projectData)
      } catch (error) {
        console.error('Error fetching project:', error)
        setError('Failed to load project details. Please try again later.')
        showToast.error('Failed to load project details')
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    } else {
      setIsLoading(false)
      setError('No project ID provided')
    }
  }, [projectId])

  // Helper function to determine difficulty based on category
  const getDifficulty = (category: string): 'Easy' | 'Medium' | 'Hard' => {
    const categoryDifficultyMap: Record<string, 'Easy' | 'Medium' | 'Hard'> = {
      'web': 'Medium',
      'mobile': 'Hard',
      'api': 'Easy',
      'desktop': 'Hard',
      'functionality': 'Medium',
      'ui': 'Easy',
      'performance': 'Hard',
      'security': 'Hard'
    }
    return categoryDifficultyMap[category.toLowerCase()] || 'Medium'
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
  if (isLoading) {
    return <Loader />
  }

  // Show error state
  if (error || !project) {
    return (
      <div className='min-h-screen bg-[#FFFCFB] flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>Project Not Found</h2>
          <p className='text-gray-600 mb-4'>{error || 'The project you\'re looking for could not be loaded.'}</p>
          <div className='flex gap-3 justify-center'>
            <button
              onClick={() => router.back()}
              className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors'
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className='bg-[#A33C13] hover:bg-[#8a2f0f] text-white px-6 py-3 rounded-lg transition-colors'
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Map API data to display format
  const difficulty = getDifficulty(project.category)
  const instructions = [
    'Visit the testing URL provided below',
    'Test all major functionalities of the application',
    'Report any bugs or issues you encounter',
    'Provide detailed feedback about user experience'
  ]
  const testingFocusAreas = [project.category]
  const techStack = project.technology_stack.split(',').map(tech => tech.trim())

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
                <span className={`px-3 py-1 ${getDifficultyColor(difficulty)} text-white rounded-full text-xs sm:text-sm font-medium`}>
                  {difficulty}
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
                onClick={() => router.push(`/tester/report-bug?from=${fromParam}`)}
                className='px-6 py-3 bg-[#A33C13] text-white rounded-lg font-medium hover:bg-[#8a2f0f] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Report Bug
              </motion.button>
              <motion.button
                className='px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm sm:text-base'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>⏱️</span>
                Start Testing
              </motion.button>
              <motion.button
                className='px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors flex items-center gap-2'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>↗</span>
                Github
              </motion.button>
            </div>

            {/* Instructions Section */}
            <div className='mb-6 sm:mb-8'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>📋</span>
                Instructions
              </h2>
              <div className='bg-[#F5F5F5] rounded-lg p-4 sm:p-6'>
                <ol className='space-y-3'>
                  {instructions.map((instruction, index) => (
                    <li key={index} className='text-[#171717] flex gap-2 sm:gap-3 text-sm sm:text-base'>
                      <span className='font-semibold flex-shrink-0'>{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Testing Focus Areas */}
            <div className='mb-6 sm:mb-8'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>🎯</span>
                Testing Focus Areas
              </h2>
              <div className='flex flex-wrap gap-2 sm:gap-3'>
                {testingFocusAreas.map((area, index) => (
                  <span
                    key={index}
                    className='px-3 sm:px-4 py-2 bg-[#F5E6DD] text-[#171717] rounded-lg font-medium text-sm sm:text-base'
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className='mb-6 sm:mb-8'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>💻</span>
                Tech Stack
              </h2>
              <div className='flex flex-wrap gap-2 sm:gap-3'>
                {techStack.map((tech, index) => (
                  <span
                    key={index}
                    className='px-3 sm:px-4 py-2 bg-[#F5E6DD] text-[#171717] rounded-lg font-medium text-sm sm:text-base'
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Project Stats & Info */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-24'>
              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4 sm:mb-6'>
                Maintained By
              </h3>
              <div className='mb-4 sm:mb-6'>
                <p className='text-[#A33C13] font-medium mb-2'>
                  {project.maintainer.fullname}
                </p>
                <p className='text-sm text-gray-600'>
                  {project.maintainer.email}
                </p>
                {project.maintainer.bio && (
                  <p className='text-sm text-gray-700 mt-2'>
                    {project.maintainer.bio}
                  </p>
                )}
              </div>

              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>📊</span>
                Project Stats
              </h3>

              <div className='space-y-3 sm:space-y-4'>
                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg hover:bg-[#F0E6DD] transition-colors duration-200'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg sm:text-xl'>🐛</span>
                    <span className='text-[#171717] font-medium text-sm sm:text-base'>Bugs Reported</span>
                  </div>
                  <span className='font-bold text-[#171717]'>
                    {Math.floor(Math.random() * 50)}
                  </span>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg hover:bg-[#F0E6DD] transition-colors duration-200'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg sm:text-xl'>👥</span>
                    <span className='text-[#171717] font-medium text-sm sm:text-base'>Active Testers</span>
                  </div>
                  <span className='font-bold text-[#171717]'>
                    {Math.floor(Math.random() * 30) + 10}
                  </span>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg hover:bg-[#F0E6DD] transition-colors duration-200'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg sm:text-xl'>📅</span>
                    <span className='text-[#171717] font-medium text-sm sm:text-base'>Created</span>
                  </div>
                  <span className='font-bold text-[#171717]'>
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg hover:bg-[#F0E6DD] transition-colors duration-200'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg sm:text-xl'>🎯</span>
                    <span className='text-[#171717] font-medium text-sm sm:text-base'>Status</span>
                  </div>
                  <span className={`font-bold px-2 py-1 rounded text-xs ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
