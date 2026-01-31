'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Loader from '@/components/ui/loader'
import { getProjects, ProjectInterface, ProjectResponse } from '@/lib/api/project-owner/projects'
import { showToast } from '@/lib/utils/toast'

interface ProjectCardProps {
  project: ProjectInterface
  onView: (id: string) => void
  onReportBug: (id: string) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onView,
  onReportBug,
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
      <div className="relative h-40 bg-gradient-to-r from-[#A33C13] to-[#D4A574] overflow-hidden flex items-center justify-center">
        <div className="text-white text-2xl font-bold">
          {project.title.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Stats and Actions */}
        <div className="flex flex-col gap-3">
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            <span className="bg-[#A33C13]/10 text-[#A33C13] px-2 py-1 rounded-full text-xs font-medium capitalize">
              {project.category}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onReportBug(project.id)}
              className="flex-1 px-3 py-2 bg-[#A33C13] hover:bg-[#8a2f0f] text-white text-xs font-medium rounded-md transition-colors duration-200 whitespace-nowrap"
            >
              Report Bug
            </button>
            <button 
              onClick={() => onView(project.id)}
              className="flex-1 px-3 py-2 bg-[#D4A574] hover:bg-[#c49563] text-white text-xs font-medium rounded-md transition-colors duration-200"
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
  const [projects, setProjects] = useState<ProjectInterface[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [isSearching, setIsSearching] = useState(false)

  // Fetch projects function
  const fetchProjects = async (page: number = 1, search: string = '') => {
    try {
      setIsLoading(page === 1 && !search)
      setIsSearching(search !== '')
      
      const response = await getProjects({
        page,
        search: search || undefined,
        ordering: '-created_at' // Most recent first
      })
      
      setProjects(response.results)
      setTotalCount(response.count)
      setTotalPages(Math.ceil(response.count / 10)) // Assuming 10 items per page
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching projects:', error)
      showToast.error('Failed to load projects. Please try again.')
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchProjects(1, searchQuery)
  }, [])

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '') {
        fetchProjects(1, searchQuery)
      } else {
        fetchProjects(1, '')
      }
    }, 500) // 500ms delay

    return () => clearTimeout(timeoutId)
  }, [searchQuery])
  
  const handleViewProject = (projectId: string) => {
    router.push(`/tester/project-details/${projectId}?from=projects`)
  }

  const handleReportBug = (projectId: string) => {
    router.push(`/tester/report-bug?projectId=${projectId}&from=projects`)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchProjects(page, searchQuery)
    }
  }

  // Show loader while loading
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

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-[#A33C13] bg-white text-[#171717] placeholder-gray-500"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#A33C13]"></div>
                </div>
              )}
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {searchQuery ? (
                `Found ${totalCount} project${totalCount !== 1 ? 's' : ''} matching "${searchQuery}"`
              ) : (
                `Showing ${totalCount} project${totalCount !== 1 ? 's' : ''}`
              )}
            </p>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProjectCard 
                      project={project}
                      onView={handleViewProject}
                      onReportBug={handleReportBug}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  className="flex justify-center items-center space-x-4 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#171717] hover:bg-[#A33C13] hover:text-white border border-gray-300'
                    }`}
                  >
                    <FiChevronLeft size={20} />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[#A33C13] text-white'
                              : 'bg-white text-[#171717] hover:bg-[#A33C13] hover:text-white border border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#171717] hover:bg-[#A33C13] hover:text-white border border-gray-300'
                    }`}
                  >
                    Next
                    <FiChevronRight size={20} />
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No Projects Found' : 'No Projects Available'}
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                {searchQuery 
                  ? `No projects match your search for "${searchQuery}". Try different keywords.`
                  : 'There are no projects available for testing at the moment. Check back later for new opportunities.'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-6 py-2 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors font-medium"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectsPage
