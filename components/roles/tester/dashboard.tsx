"use client"
import ProjectCard from '@/components/ui/projectCard'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/loader'
import { getProjects, ProjectInterface } from '@/lib/api/project-owner/projects'
import { showToast } from '@/lib/utils/toast'

function Dashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<ProjectInterface[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getProjects()
        setProjects(response.results || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        setError('Failed to load projects. Please try again later.')
        showToast.error('Failed to load projects')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Get unique categories from actual data
  const availableCategories = [...new Set(projects.map(p => p.category))]

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || project.category.toLowerCase() === selectedCategory.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  const handleViewProject = (projectId: string) => {
    router.push(`/tester/project-details/${projectId}?from=dashboard`)
  }

  // Show loader while loading
  if (isLoading) {
    return <Loader />
  }

  // Show error state
  if (error) {
    return (
      <div className='flex-1 bg-[#FFFCFB] min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>Failed to Load Projects</h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='bg-[#A33C13] hover:bg-[#8a2f0f] text-white px-6 py-3 rounded-lg transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 bg-[#FFFCFB] min-h-screen'>
      <div className='p-4 sm:p-6 md:p-8'>
        {/* Header Section */}
        <div className='mb-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-[#171717] mb-2'>Explore Project</h1>
          <p className='text-sm sm:text-base text-[#171717]'>Find the next exciting project to test and contribute to.</p>
        </div>

        {/* Search and Filters */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6'>
          {/* Search Bar */}
          <div className='relative'>
            <FiSearch className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#9C9AA5] text-lg sm:text-xl' />
            <input
              type='text'
              placeholder='Search for projects'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-[#A33C13] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] text-sm sm:text-base'
            />
          </div>

          {/* Filter by Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-[#171717] bg-white cursor-pointer hover:border-[#A33C13] transition-colors text-sm sm:text-base'
            >
              <option value='all'>All Categories</option>
              {availableCategories.map(category => (
                <option key={category} value={category.toLowerCase()}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  category={project.category}
                  difficulty="Medium" // Simplified - all projects have same difficulty
                  participants={Math.floor(Math.random() * 20) + 5}
                  bugs={Math.floor(Math.random() * 15)}
                  image='/window.svg'
                  onView={() => handleViewProject(project.id)}
                />
              </motion.div>
            ))
          ) : (
            <div className='col-span-full flex flex-col items-center justify-center py-12'>
              <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4'>
                <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                {searchQuery || selectedCategory !== 'all' 
                  ? 'No Projects Found' 
                  : 'No Projects Available'
                }
              </h3>
              <p className='text-gray-600 text-center'>
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Check back later for new testing opportunities.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard