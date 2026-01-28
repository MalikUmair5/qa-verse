'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import { useRouter, useSearchParams } from 'next/navigation'
import Loader from '@/components/ui/loader'
import { ProjectInterface } from '@/lib/api/project-owner/projects'

interface ProjectDetailPageProps {
  projectId: string
  projectData?: ProjectInterface | null
  onBack?: () => void
}

// Simplified Animation Variant
const contentAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeInOut" }
}

function ProjectDetailPage({ projectId, projectData, onBack }: ProjectDetailPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(!projectData)

  const fromParam = searchParams.get('from') || 'dashboard'

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  useEffect(() => {
    if (!projectData) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [projectId, projectData])

  if (!projectData && !isLoading) {
    return (
      <motion.div
        className='min-h-screen bg-[#FFFCFB] flex items-center justify-center'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.4, ease: "easeInOut"
        }}
      >
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-[#171717] mb-4'>
            Project Not Found
          </h2>
          <p className='text-[#171717] mb-6'>
            The project you're looking for could not be loaded.
          </p>
          <button
            onClick={handleBack}
            className='px-6 py-3 bg-[#A33C13] text-white rounded-lg font-medium hover:bg-[#8a2f0f] transition-all duration-300'
          >
            Go Back
          </button>
        </div>
      </motion.div >
    )
  }

  const project = projectData ? {
    id: projectData.id.toString(),
    title: projectData.title,
    description: projectData.description,
    category: projectData.category,
    difficulty: 'Medium' as const,
    bugsReported: 0,
    activeTesters: 0,
    maintainedBy: projectData.maintainer.fullname,
    maintainerEmail: projectData.maintainer.email,
    githubUrl: projectData.maintainer.github_url,
    linkedinUrl: projectData.maintainer.linkedin_url,
    instructions: projectData.instructions || [
      'Visit the project URL below',
      'Test the application functionality', 
      'Report any bugs you find',
      'Provide detailed feedback'
    ],
    testingFocusAreas: [projectData.category],
    techStack: projectData.technology_stack.split(',').map(tech => tech.trim()),
    testing_url: projectData.testing_url,
    status: projectData.status,
    created_at: projectData.created_at
  } : null

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'bg-green-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (isLoading || !project) {
    return <Loader />
  }

  return (
    <motion.div
      className='min-h-screen bg-[#FFFCFB]'
      initial="initial"
      animate="animate"
      exit="exit"
      variants={contentAnimation}
    >
      <div className='p-4 sm:p-6 md:p-8 max-w-7xl mx-auto'>
        {/* Back Button */}
        <button
          onClick={handleBack}
          className='flex items-center gap-2 text-[#171717] mb-4 sm:mb-6 hover:text-[#A33C13] transition-all duration-300 group'
        >
          <div className='group-hover:-translate-x-1 transition-transform duration-300'>
            <FiArrowLeft size={20} />
          </div>
          <span className='font-medium'>Back</span>
        </button>

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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/tester/report-bug?from=${fromParam}`)}
                className='px-6 py-3 bg-[#A33C13] text-white rounded-lg font-medium hover:bg-[#8a2f0f] transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm'
              >
                Report Bug
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(project.testing_url, '_blank')}
                className='px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm'
              >
                <span>⏱️</span>
                Start Testing
              </motion.button>

              {project.githubUrl && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => project.githubUrl && window.open(project.githubUrl, '_blank')}
                  className='px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors duration-300 flex items-center gap-2 shadow-sm'
                >
                  <span>↗</span>
                  Github
                </motion.button>
              )}
            </div>

            {/* Instructions Section */}
            <div className='mb-6 sm:mb-8'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>📋</span>
                Instructions
              </h2>
              <div className='bg-[#F5F5F5] rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-300'>
                <ol className='space-y-3'>
                  {project.instructions.map((instruction, index) => (
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
                {project.testingFocusAreas.map((area, index) => (
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
                {project.techStack.map((tech, index) => (
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
            <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-24 hover:shadow-lg transition-shadow duration-300'>
              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4 sm:mb-6'>
                Maintained By
              </h3>
              <p className='text-[#A33C13] font-medium mb-4 sm:mb-6'>
                {project.maintainedBy}
              </p>

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
                    {project.bugsReported}
                  </span>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg hover:bg-[#F0E6DD] transition-colors duration-200'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg sm:text-xl'>👥</span>
                    <span className='text-[#171717] font-medium text-sm sm:text-base'>Active Testers</span>
                  </div>
                  <span className='font-bold text-[#171717]'>
                    {project.activeTesters}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectDetailPage