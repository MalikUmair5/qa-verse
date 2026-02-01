'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  FiCalendar,
  FiClock,
  FiLayout,
  FiSettings,
  FiZap,
  FiShield,
  FiSmartphone,
  FiAlertCircle,
  FiCheckCircle,
  FiActivity,
  FiBox,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiArrowRight,
  FiUser,
  FiPaperclip,
  FiArrowLeft,
  FiSearch
  // FiBug removed as it does not exist in 'react-icons/fi'
} from 'react-icons/fi'
import { getBugReports, getBugReportsByProject, BugReportResponse, updateBugReport, deleteBugReport, AttachmentResponse } from '@/lib/api/tester/bugReport'
import { getProjects, ProjectInterface } from '@/lib/api/project-owner/projects'
import toast from 'react-hot-toast'
import Loader from '@/components/ui/loader'
import ConfirmDeleteModal from '@/components/roles/common/modals/confirmDelete'
import AttachmentModal from './AttachmentModal'
import { AttachmentList } from '@/components/ui/attachmentCard'
import { useAuthStore } from '@/store/authStore'

// Define the interface based on usage
interface BugReportCardProps {
  bugReport: {
    id: string
    title: string
    description: string
    severity: string
    status: string
    category: string
    created_at: string
    updated_at: string
    attachments: AttachmentResponse[]
  }
  onViewDetails: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAddAttachment: (id: string) => void
}

const BugReportCard: React.FC<BugReportCardProps> = ({ bugReport, onViewDetails, onEdit, onDelete, onAddAttachment }) => {

  const user = useAuthStore().user
  // Elegant/Subtle Severity Styling
  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // Status Badge Logic
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'closed': return 'bg-gray-100 text-gray-600 border-gray-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  // Professional Icons instead of Emojis
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'ui': return <FiLayout />
      case 'functionality': return <FiSettings />
      case 'performance': return <FiZap />
      case 'security': return <FiShield />
      case 'compatibility': return <FiSmartphone />
      // Fallback to FiAlertCircle since FiBug does not exist in 'fi'
      default: return <FiAlertCircle />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewDetails = () => {
    onViewDetails(bugReport.id)
  }

  const handleEdit = () => {
    onEdit(bugReport.id)
  }

  const handleDelete = () => {
    onDelete(bugReport.id)
  }

  const handleAddAttachment = () => {
    onAddAttachment(bugReport.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#A33C13]/30 transition-all duration-300 flex flex-col h-full"
    >
      {/* Top Right Action Icons */}
      {user?.role === 'tester' && (
        <div className="absolute top-1 right-1 flex flex-col-reverse gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); handleAddAttachment(); }}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Add Attachment"
          >
            <FiPaperclip size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-4 pr-16"> {/* pr-16 prevents title overlapping icons */}
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(bugReport.status)}`}>
            {bugReport.status.replace('-', ' ')}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityStyles(bugReport.severity)}`}>
            {bugReport.severity}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-[#A33C13] transition-colors">
          {bugReport.title}
        </h3>
      </div>

      {/* Meta Data (Date & Tester) */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <FiCalendar className="text-gray-400" />
          <span>{formatDate(bugReport.created_at)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiUser className="text-gray-400" />
          <span className="truncate max-w-[100px]">You</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
        {bugReport.description}
      </p>

      {/* Tags Section */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs">
          {getCategoryIcon(bugReport.category)}
          <span className="font-semibold text-gray-700">Category:</span>
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] capitalize">
            {bugReport.category}
          </span>
        </div>

        {/* Attachment Count */}
        {bugReport.attachments && bugReport.attachments.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <FiPaperclip className="text-gray-400" />
            <span className="font-semibold text-gray-700">Attachments:</span>
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px]">
              {bugReport.attachments.length}
            </span>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <button
        onClick={handleViewDetails}
        className="w-full mt-auto flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 px-4 rounded-lg hover:bg-[#A33C13] active:scale-95 transition-all duration-200 text-sm font-medium"
      >
        View Details
        <FiArrowRight />
      </button>
    </motion.div>
  )
}

function BugReportsPage() {
  const router = useRouter()
  // const userRole = useAuthStore().user?.role
  const userRole = useAuthStore().user?.role


  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [bugReports, setBugReports] = useState<BugReportResponse[]>([])

  // Pagination and filtering states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchQuery, setActiveSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedOrdering, setSelectedOrdering] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [projects, setProjects] = useState<ProjectInterface[]>([])

  // Get project filtering parameters
  const projectId = searchParams.get('projectId')
  const projectName = searchParams.get('projectName')
  const fromParam = searchParams.get('from')

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [bugToDelete, setBugToDelete] = useState<{ id: string, title: string } | null>(null)

  // Attachment modal state
  const [showAttachmentModal, setShowAttachmentModal] = useState(false)
  const [selectedBugForAttachment, setSelectedBugForAttachment] = useState<string | null>(null)


  // Fetch projects for filtering (only when not viewing project-specific bugs)
  useEffect(() => {
    const fetchProjects = async () => {
      if (!projectId) { // Only fetch projects if not viewing project-specific bugs
        try {
          const response = await getProjects()
          setProjects(response.results || [])
        } catch (error) {
          console.error('Error fetching projects:', error)
        }
      }
    }

    fetchProjects()
  }, [projectId])

  useEffect(() => {
    const fetchBugReports = async () => {
      try {
        setIsLoading(true)
        if (projectId) {
          // Fetch bugs for specific project (no pagination for project-specific)
          const response = await getBugReportsByProject(projectId)
          setBugReports(response)
          setTotalCount(response.length)
          setHasNext(false)
          setHasPrevious(false)
        } else {
          // Fetch all user's bugs with pagination
          const response = await getBugReports({
            page: currentPage,
            search: activeSearchQuery.trim() || undefined,
            project: selectedProject !== 'all' ? selectedProject : undefined,
            ordering: selectedOrdering || undefined
          })
          setBugReports(response.results || [])
          setTotalCount(response.count)
          setHasNext(response.next !== null)
          setHasPrevious(response.previous !== null)
        }
      } catch (error) {
        console.error('Error fetching bug reports:', error)
        toast.error('Failed to load bug reports')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBugReports()
  }, [projectId, currentPage, activeSearchQuery, selectedProject, selectedOrdering])

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setActiveSearchQuery('')
    setSelectedProject('all')
    setSelectedOrdering('')
    setCurrentPage(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleNextPage = () => {
    if (hasNext) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (hasPrevious) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleBack = () => {
    const backUrl = userRole === 'maintainer'
      ? `/maintainer/project-details/${projectId}?from=${fromParam}`
      : `/tester/project-details/${projectId}?from=${fromParam}`
    router.push(backUrl)
  }

  const totalPages = Math.ceil(totalCount / 10) // Assuming 20 items per page

  const handleViewBugDetails = (bugId: string) => {
    if (userRole == 'tester')
      router.push(`/tester/projects/bug/${bugId}`)
    else if (userRole == 'maintainer')
      router.push(`/maintainer/bugs/bug/${bugId}`)
  }

  const handleEditBug = (bugId: string) => {
    router.push(`/tester/report-bug?bugId=${bugId}`)
  }

  const handleDeleteBug = async (bugId: string) => {
    const bugToDelete = bugReports.find(bug => bug.id === bugId)
    if (bugToDelete) {
      setBugToDelete({ id: bugToDelete.id, title: bugToDelete.title })
      setShowDeleteModal(true)
    }
  }

  const handleAddAttachment = (bugId: string) => {
    setSelectedBugForAttachment(bugId)
    setShowAttachmentModal(true)
  }

  const handleAttachmentAdded = (attachment: AttachmentResponse) => {
    // Update the bug reports list with the new attachment
    setBugReports(prev => prev.map(bug =>
      bug.id === attachment.bug_report
        ? { ...bug, attachments: [...(bug.attachments || []), attachment] }
        : bug
    ))
  }

  const handleAttachmentRemoved = (attachmentId: string) => {
    // Remove the attachment from the bug reports list
    setBugReports(prev => prev.map(bug => ({
      ...bug,
      attachments: (bug.attachments || []).filter(att => att.id !== attachmentId)
    })))
  }

  const confirmDeleteBug = async () => {
    if (!bugToDelete) return

    setDeleteLoading(true)
    const loadingToast = toast.loading('Deleting bug report...')

    try {
      await deleteBugReport(bugToDelete.id)
      toast.dismiss(loadingToast)
      toast.success(`Bug report "${bugToDelete.title}" deleted successfully!`)

      // Remove bug report from list and close modal
      setBugReports(prev => prev.filter(bug => bug.id !== bugToDelete.id))
      setShowDeleteModal(false)
      setBugToDelete(null)
    } catch (error: any) {
      console.error('Error deleting bug report:', error)
      toast.dismiss(loadingToast)
      toast.error(error?.response?.data?.message || 'Failed to delete bug report. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCreateNewBugReport = () => {
    router.push('/tester/report-bug')
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
          <div className="mb-8">
            {/* Back Button - only show when viewing project-specific bugs */}
            {projectId && fromParam && (
              <button
                onClick={handleBack}
                className='flex items-center gap-2 text-[#171717] mb-6 hover:text-[#A33C13] transition-all duration-300 group'
              >
                <div className='group-hover:-translate-x-1 transition-transform duration-300'>
                  <FiArrowLeft size={20} />
                </div>
                <span className='font-medium'>Back to Project</span>
              </button>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#171717] mb-3">
                  {projectId ? `${projectName || 'Project'} Bug Reports` : 'My Bug Reports'}
                </h1>
                <p className="text-base text-gray-600">
                  {projectId ? 'All bugs reported for this project' : 'Track and manage all your reported bugs'}
                </p>
              </div>
              {/* {!projectId && (
                <button
                  onClick={handleCreateNewBugReport}
                  className="bg-[#A33C13] hover:bg-[#8a2f0f] text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center gap-2 shadow-sm"
                >
                  <FiPlus className="w-4 h-4" />
                  Report New Bug
                </button>
              )} */}
            </div>

            {/* Search and Filters - Only show when not viewing project-specific bugs */}
            {!projectId && (
              <div className='space-y-4 mb-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {/* Search Bar */}
                  <div className='flex gap-2'>
                    <div className='relative flex-1'>
                      <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg' />
                      <input
                        type='text'
                        placeholder='Search bug reports...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className='w-full pl-10 pr-4 py-2.5 border-2 border-[#A33C13] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-sm'
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className='bg-[#A33C13] hover:bg-[#8a2f0f] text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm whitespace-nowrap'
                    >
                      Search
                    </button>
                  </div>

                  {/* Project Filter */}
                  {/* <div>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-sm bg-white cursor-pointer hover:border-[#A33C13] transition-colors'
                    >
                      <option value='all'>All Projects</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  {/* Ordering */}
                  <div>
                    <select
                      value={selectedOrdering}
                      onChange={(e) => setSelectedOrdering(e.target.value)}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-sm bg-white cursor-pointer hover:border-[#A33C13] transition-colors'
                    >
                      <option value=''>Default Order</option>
                      <option value='created_at'>Oldest First</option>
                      <option value='-created_at'>Newest First</option>
                      <option value='severity'>Severity (Low to High)</option>
                      <option value='-severity'>Severity (High to Low)</option>
                      <option value='status'>Status</option>
                      <option value='title'>Title (A-Z)</option>
                      <option value='-title'>Title (Z-A)</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(activeSearchQuery || selectedProject !== 'all' || selectedOrdering) && (
                  <div className='flex justify-end'>
                    <button
                      onClick={handleClearFilters}
                      className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center gap-2'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Results Count Info - Only show when not viewing project-specific bugs */}
            {!projectId && !isLoading && (
              <div className='mb-4 flex items-center justify-between text-sm text-gray-600'>
                <p>
                  Showing {bugReports.length} of {totalCount} bug reports
                  {activeSearchQuery && <span> matching "{activeSearchQuery}"</span>}
                </p>
                <p>
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="text-2xl font-bold text-[#171717]">{bugReports.length}</div>
                <div className="text-sm text-gray-500 font-medium">Total Reports</div>
              </motion.div>
              <motion.div
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-2xl font-bold text-gray-600">
                  {bugReports.filter(bug => bug.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-500 font-medium">Pending</div>
              </motion.div>
              {/* <motion.div
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-2xl font-bold text-blue-600">
                  {bugReports.filter(bug => bug.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-500 font-medium">In Progress</div>
              </motion.div> */}
              <motion.div
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="text-2xl font-bold text-green-600">
                  {bugReports.filter(bug => bug.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-500 font-medium">Approved</div>
              </motion.div>
              <motion.div
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="text-2xl font-bold text-red-600">
                  {bugReports.filter(bug => bug.status === 'rejected').length}
                </div>
                <div className="text-sm text-gray-500 font-medium">Rejected</div>
              </motion.div>
            </div>
          </div>

          {/* Bug Reports Grid */}
          {bugReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bugReports.map((bugReport, index) => (
                <motion.div
                  key={bugReport.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BugReportCard
                    bugReport={bugReport}
                    onViewDetails={handleViewBugDetails}
                    onEdit={handleEditBug}
                    onDelete={handleDeleteBug}
                    onAddAttachment={handleAddAttachment}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FiAlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {projectId ? 'No Bug Reports for this Project' : 'No Bug Reports Yet'}
              </h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                {projectId
                  ? 'No bugs have been reported for this project yet. Testers can start testing to identify issues.'
                  : 'Start testing projects and report bugs to help improve software quality.'
                }
              </p>
              {!projectId && (
                <button
                  onClick={handleCreateNewBugReport}
                  className="bg-[#A33C13] hover:bg-[#8a2f0f] text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Report Your First Bug
                </button>
              )}
            </motion.div>
          )}

          {/* Pagination Controls - Only show when not viewing project-specific bugs */}
          {!projectId && !isLoading && totalCount > 0 && (
            <div className='flex items-center justify-center mt-8 space-x-4'>
              <button
                onClick={handlePreviousPage}
                disabled={!hasPrevious}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${hasPrevious
                  ? 'bg-[#A33C13] text-white hover:bg-[#8a2f0f]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Previous
              </button>

              <span className='px-4 py-2 text-[#171717] font-medium'>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={!hasNext}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${hasNext
                  ? 'bg-[#A33C13] text-white hover:bg-[#8a2f0f]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Next
              </button>
            </div>
          )}

          {/* Pagination Info - Only show when not viewing project-specific bugs */}
          {!projectId && !isLoading && totalCount > 0 && (
            <div className='text-center mt-4 text-sm text-gray-600'>
              Total: {totalCount} bug reports
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!deleteLoading) {
            setShowDeleteModal(false)
            setBugToDelete(null)
          }
        }}
        onConfirm={confirmDeleteBug}
        projectName={bugToDelete?.title || ''}
        loading={deleteLoading}
      />

      {/* Attachment Modal */}
      {selectedBugForAttachment && (
        <AttachmentModal
          isOpen={showAttachmentModal}
          onClose={() => {
            setShowAttachmentModal(false)
            setSelectedBugForAttachment(null)
          }}
          bugReportId={selectedBugForAttachment}
          existingAttachments={bugReports.find(bug => bug.id === selectedBugForAttachment)?.attachments || []}
          onAttachmentAdded={handleAttachmentAdded}
          onAttachmentRemoved={handleAttachmentRemoved}
        />
      )}
    </div>
  )
}

export default BugReportsPage