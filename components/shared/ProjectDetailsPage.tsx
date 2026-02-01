'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Loader from '@/components/ui/loader'
import { getProjectById, ProjectInterface } from '@/lib/api/project-owner/projects'
import { showToast } from '@/lib/utils/toast'
import { FaBug, FaExternalLinkAlt } from "react-icons/fa";
import { CgCalendarDates, CgDetailsMore } from 'react-icons/cg'
import { HiCodeBracket } from "react-icons/hi2";



interface ProjectDetailsPageProps {
  projectId: string
}

// Simplified Animation Variant from Design
const contentAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeInOut" }
}

function ProjectDetailsPage({ projectId }: ProjectDetailsPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // State Management
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<ProjectInterface | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Detect user role from pathname
  const userRole = pathname.includes('/maintainer/') ? 'maintainer' : 'tester'

  // Get the 'from' parameter
  const fromParam = searchParams.get('from') || 'dashboard'

  // Fetch project data logic
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const projectData = await getProjectById(projectId)
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

  // Navigation Handlers
  const handleEditProject = () => {
    router.push(`/maintainer/projects/edit/${projectId}`)
  }

  const handleDeleteProject = () => {
    router.push(`/maintainer/projects?delete=${projectId}`)
  }

  const handleReportBug = () => {
    router.push(`/tester/report-bug?projectId=${projectId}&from=project-details`)
  }

  const handleStartTesting = () => {
    if (project?.testing_url) {
      window.open(project.testing_url, '_blank')
    }
  }

  const handleViewBugs = () => {
    if (userRole === 'maintainer') {
      router.push(`/maintainer/bugs?projectId=${projectId}&projectName=${encodeURIComponent(project?.title || 'Project')}&from=project-details`)
    } else {
      router.push(`/tester/bugs?projectId=${projectId}&projectName=${encodeURIComponent(project?.title || 'Project')}&from=project-details`)
    }
  }

  const getBackUrl = () => {
    if (userRole === 'maintainer') {
      return fromParam === 'projects' ? '/maintainer/projects' : '/maintainer/dashboard'
    } else {
      return fromParam === 'explore-projects' ? '/tester/explore-projects' : '/tester/dashboard'
    }
  }

  // Helper for difficulty (from original logic)
  const getDifficulty = (category: string): 'Easy' | 'Medium' | 'Hard' => {
    const categoryDifficultyMap: Record<string, 'Easy' | 'Medium' | 'Hard'> = {
      'web': 'Medium', 'mobile': 'Hard', 'api': 'Easy', 'desktop': 'Hard',
      'functionality': 'Medium', 'ui': 'Easy', 'performance': 'Hard', 'security': 'Hard'
    }
    return categoryDifficultyMap[category.toLowerCase()] || 'Medium'
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'bg-green-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (isLoading) return <Loader />

  if (error || !project) {
    return (
      <motion.div
        className='min-h-screen bg-[#FFFCFB] flex items-center justify-center'
        initial="initial" animate="animate" exit="exit" variants={contentAnimation}
      >
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-[#171717] mb-4'>Project Not Found</h2>
          <p className='text-[#171717] mb-6'>{error || "The project you're looking for could not be loaded."}</p>
          <button
            onClick={() => router.push(getBackUrl())}
            className='px-6 py-3 bg-[#A33C13] text-white rounded-lg font-medium hover:bg-[#8a2f0f] transition-all duration-300'
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    )
  }

  const difficulty = getDifficulty(project.category)
  const techStack = project.technology_stack ? project.technology_stack.split(',').map(t => t.trim()) : []

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
          onClick={() => router.push(getBackUrl())}
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
                <span className='px-3 py-1 bg-[#F5E6DD] text-[#171717] rounded-full text-xs sm:text-sm font-medium capitalize'>
                  {project.category}
                </span>
                <span className={`px-3 py-1 ${getDifficultyColor(difficulty)} text-white rounded-full text-xs sm:text-sm font-medium`}>
                  {difficulty}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white ${project.status === 'active' ? 'bg-green-500' :
                  project.status === 'completed' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>

              <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171717] mb-4'>
                {project.title}
              </h1>

              <p className='text-[#171717] text-sm sm:text-base lg:text-lg leading-relaxed'>
                {project.description}
              </p>
            </div>

            {/* Action Buttons - Role Based */}
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8'>
              {userRole === 'maintainer' ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEditProject}
                    className='px-6 py-3 bg-[#A33C13] text-white rounded-lg font-medium hover:bg-[#8a2f0f] transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm'
                  >
                    <FiEdit2 /> Edit Project
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteProject}
                    className='px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm'
                  >
                    <FiTrash2 /> Delete Project
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleViewBugs}
                    className='px-6 py-3 border-2 border-[#A33C13] text-[#A33C13] rounded-lg font-medium hover:bg-[#A33C13] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm'
                  >
                    <span><FaBug /></span> View Reported Bugs
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReportBug}
                    className='px-6 py-3 bg-[#A33C13] text-white rounded-lg font-medium hover:bg-[#8a2f0f] transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm'
                  >
                    Report Bug
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartTesting}
                    className='px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm'
                  >
                    <span>⏱️</span> Start Testing
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleViewBugs}
                    className='px-6 py-3 border-2 border-[#A33C13] text-[#A33C13] rounded-lg font-medium hover:bg-[#A33C13] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm'
                  >
                    <span><FaBug /></span> View Reported Bugs
                  </motion.button>
                </>
              )}

              {/* Optional Github Link - shown if available in maintainer data */}
              {project.maintainer?.github_url && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => project.maintainer.github_url && window.open(project.maintainer.github_url, '_blank')}
                  className='px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors duration-300 flex items-center gap-2 shadow-sm justify-center'
                >
                  <span>↗</span> Github
                </motion.button>
              )}
            </div>

            {/* Instructions Section */}
            <div className='mb-6 sm:mb-8'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span><CgDetailsMore /></span>
                {userRole === 'maintainer' ? 'Testing Instructions' : 'Instructions'}
              </h2>
              <div className='bg-[#F5F5F5] rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-300'>
                {project.instructions && project.instructions.length > 0 ? (
                  <ol className='space-y-3'>
                    {project.instructions.map((instruction, index) => (
                      <li key={index} className='text-[#171717] flex gap-2 sm:gap-3 text-sm sm:text-base'>
                        <span className='font-semibold flex-shrink-0'>{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className='text-gray-500 italic'>No specific instructions provided.</p>
                )}
              </div>
            </div>

            {/* Tech Stack */}
            <div className='mb-6 sm:mb-8'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span><HiCodeBracket size={30} /></span> Tech Stack
              </h2>
              <div className='flex flex-wrap gap-2 sm:gap-3'>
                {techStack.length > 0 ? techStack.map((tech, index) => (
                  <span
                    key={index}
                    className='px-3 sm:px-4 py-2 bg-[#F5E6DD] text-[#171717] rounded-lg font-medium text-sm sm:text-base'
                  >
                    {tech}
                  </span>
                )) : (
                  <span className='text-gray-500 italic'>Not specified</span>
                )}
              </div>
            </div>

            {/* Testing URL Display (Detailed view for context) */}
            <div className='mb-6 sm:mb-8'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span><FaExternalLinkAlt />
                </span> Testing URL
              </h2>
              <div className='bg-[#F5F5F5] rounded-lg p-4'>
                {project.testing_url ? (
                  <a
                    href={project.testing_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[#A33C13] hover:text-[#8a2f0f] font-medium hover:underline break-all'
                  >
                    {project.testing_url}
                  </a>
                ) : (
                  <p className='text-gray-500 italic'>No testing URL provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Project Stats & Info */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-24 hover:shadow-lg transition-shadow duration-300'>
              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4 sm:mb-6'>
                {userRole === 'maintainer' ? 'Your Project' : 'Maintained By'}
              </h3>

              <div className="mb-6">
                <p className='text-[#A33C13] font-medium text-lg'>
                  {project.maintainer.fullname}
                </p>
                <p className='text-gray-600 text-sm'>{project.maintainer.email}</p>
                {project.maintainer.bio && (
                  <p className='text-gray-500 text-xs mt-2 italic'>{project.maintainer.bio}</p>
                )}
              </div>

              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span><CgCalendarDates />
                </span> Project Dates
              </h3>

              <div className='space-y-3 sm:space-y-4'>
                <div className='flex flex-col p-3 bg-[#F5F5F5] rounded-lg hover:bg-[#F0E6DD] transition-colors duration-200'>
                  <span className='text-[#171717] font-medium text-sm sm:text-base'>Created</span>
                  <span className='font-bold text-[#171717]'>
                    {new Date(project.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}                  </span>
                </div>

                <div className='flex flex-col p-3 bg-[#F5F5F5] rounded-lg hover:bg-[#F0E6DD] transition-colors duration-200'>
                  <span className='text-[#171717] font-medium text-sm sm:text-base'>Last Updated</span>
                  <span className='font-bold text-[#171717]'>
                    {new Date(project.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectDetailsPage