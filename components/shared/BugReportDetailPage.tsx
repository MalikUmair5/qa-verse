'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  FiChevronLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiAlertCircle,
  // Additional icons for the new design elements
  FiCheckCircle,
  FiActivity,
  FiBox,
  FiImage,
  FiMessageSquare,
  FiCornerDownRight,
  FiArrowLeft,
  FiPaperclip,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiThumbsUp,
  FiThumbsDown,
  FiCheck
} from 'react-icons/fi'
import { getBugReportById, BugReportResponse, AttachmentResponse, deleteBugReport, approveBugReport, rejectBugReport, resolveBugReport } from '@/lib/api/tester/bugReport'
import { CommentResponse } from '@/lib/api/tester/comments'
import { getProjectById, ProjectInterface } from '@/lib/api/project-owner/projects'
import toast from 'react-hot-toast'
import Loader from '@/components/ui/loader'
import AttachmentModal from './AttachmentModal'
import { AttachmentList } from '@/components/ui/attachmentCard'
import Comments from './Comments'
import { useAuthStore } from '@/store/authStore'
import { MdOutlineReplayCircleFilled } from 'react-icons/md'
import { RiAttachmentFill } from 'react-icons/ri'
import { ImFolder } from 'react-icons/im'
import { IoChatboxEllipsesOutline } from "react-icons/io5";


interface BugReportDetailPageProps {
  bugId: string
}

// Consistent Animation Variants from ProjectDetailsPage
const contentAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeInOut" }
}

function BugReportDetailPage({ bugId }: BugReportDetailPageProps) {
  const router = useRouter()
  const userRole = useAuthStore().user?.role
  const [isLoading, setIsLoading] = useState(true)
  const [bugReport, setBugReport] = useState<BugReportResponse | null>(null)
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [project, setProject] = useState<ProjectInterface | null>(null)
  const [projectLoading, setProjectLoading] = useState(false)

  // Action states
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isResolving, setIsResolving] = useState(false)

  // Attachment modal state
  const [showAttachmentModal, setShowAttachmentModal] = useState(false)

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchBugReport = async () => {
      try {
        setIsLoading(true)
        const response = await getBugReportById(bugId)
        setBugReport(response)

        // Set comments from the bug report response
        if (response.comments) {
          setComments(response.comments)
        }

        // Fetch project details
        if (response.project) {
          setProjectLoading(true)
          try {
            const projectData = await getProjectById(response.project)
            setProject(projectData)
          } catch (projectError) {
            console.error('Error fetching project details:', projectError)
          } finally {
            setProjectLoading(false)
          }
        }
      } catch (error) {
        console.error('Error fetching bug report:', error)
        toast.error('Failed to load bug report details')
        if (userRole === 'tester') {
          router.push('/tester/projects')
        } else if (userRole === 'maintainer') {
          router.push('/maintainer/bugs')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (bugId) {
      fetchBugReport()
    }
  }, [bugId, router])

  // --- Visual Helpers (Updated for Elegant Design) ---

  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <FiAlertCircle /> }
      case 'high': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: <FiActivity /> }
      case 'medium': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <FiActivity /> }
      case 'low': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <FiCheckCircle /> }
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: <FiBox /> }
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'in-progress': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'closed': return 'bg-gray-50 text-gray-500 border-gray-200'
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200' // Pending
    }
  }

  const handleBack = () => {
    if (userRole === 'tester') {
      router.push('/tester/projects')
    } else if (userRole === 'maintainer') {
      router.push('/maintainer/bugs')
    } else {
      router.back()
    }
  }

  const handleAttachmentAdded = (attachment: AttachmentResponse) => {
    // Update the bug report with the new attachment
    setBugReport(prev => prev ? {
      ...prev,
      attachments: [...(prev.attachments || []), attachment]
    } : null)
  }

  const handleAttachmentRemoved = (attachmentId: string) => {
    // Remove the attachment from the bug report
    setBugReport(prev => prev ? {
      ...prev,
      attachments: (prev.attachments || []).filter(att => att.id !== attachmentId)
    } : null)
  }

  const handleAttachmentUpdated = (updatedAttachment: AttachmentResponse) => {
    // Update the attachment in the bug report
    setBugReport(prev => prev ? {
      ...prev,
      attachments: (prev.attachments || []).map(att =>
        att.id === updatedAttachment.id ? updatedAttachment : att
      )
    } : null)
  }

  const handleCommentsUpdated = async (updatedComments: CommentResponse[]) => {
    setComments(updatedComments)

    // Also refetch the bug report to ensure we have the latest data
    try {
      const response = await getBugReportById(bugId)
      setBugReport(response)
      if (response.comments) {
        setComments(response.comments)
      }
    } catch (error) {
      console.error('Error refetching bug report:', error)
    }
  }

  const handleAddAttachment = () => {
    setShowAttachmentModal(true)
  }

  const handleEdit = () => {
    if (bugReport) {
      if (userRole === 'tester') {
        router.push(`/tester/report-bug?bugId=${bugReport.id}`)
      } else if (userRole === 'maintainer') {
        router.push(`/maintainer/bugs/bug/${bugReport.id}/edit`)
      }
    }
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!bugReport) return

    try {
      setIsDeleting(true)
      await deleteBugReport(bugReport.id)
      toast.success('Bug report deleted successfully!')
      if (userRole === 'tester') {
        router.push('/tester/projects')
      } else if (userRole === 'maintainer') {
        router.push('/maintainer/bugs')
      }
    } catch (error) {
      console.error('Error deleting bug report:', error)
      toast.error('Failed to delete bug report')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleApprove = async () => {
    if (!bugReport) return

    try {
      setIsApproving(true)
      await approveBugReport(bugReport.id)
      toast.success('Bug report approved successfully!')
      // Refetch bug report to get updated status
      const updatedReport = await getBugReportById(bugId)
      setBugReport(updatedReport)
    } catch (error) {
      console.error('Error approving bug report:', error)
      toast.error('Failed to approve bug report')
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!bugReport) return

    try {
      setIsRejecting(true)
      await rejectBugReport(bugReport.id)
      toast.success('Bug report rejected successfully!')
      // Refetch bug report to get updated status
      const updatedReport = await getBugReportById(bugId)
      setBugReport(updatedReport)
    } catch (error) {
      console.error('Error rejecting bug report:', error)
      toast.error('Failed to reject bug report')
    } finally {
      setIsRejecting(false)
    }
  }

  const handleResolve = async () => {
    if (!bugReport) return

    try {
      setIsResolving(true)
      await resolveBugReport(bugReport.id)
      toast.success('Bug report resolved successfully!')
      // Refetch bug report to get updated status
      const updatedReport = await getBugReportById(bugId)
      setBugReport(updatedReport)
    } catch (error) {
      console.error('Error resolving bug report:', error)
      toast.error('Failed to resolve bug report')
    } finally {
      setIsResolving(false)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (!bugReport) {
    return (
      <motion.div
        className="min-h-screen bg-[#FFFCFB] flex items-center justify-center"
        initial="initial" animate="animate" exit="exit" variants={contentAnimation}
      >
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#171717] mb-2">Bug Report Not Found</h2>
          <p className="text-gray-600 mb-4">The requested bug report could not be found.</p>
          <button
            onClick={handleBack}
            className="bg-[#A33C13] hover:bg-[#8a2f0f] text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Back to Bug Reports
          </button>
        </div>
      </motion.div>
    )
  }

  const severityStyle = getSeverityStyles(bugReport.severity)

  return (
    <motion.div
      className="min-h-screen bg-[#FFFCFB]"
      initial="initial" animate="animate" exit="exit" variants={contentAnimation}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#171717] mb-6 hover:text-[#A33C13] transition-colors group"
        >
          <div className='group-hover:-translate-x-1 transition-transform duration-300'>
            <FiArrowLeft size={20} />
          </div>
          <span className="font-medium">Back to Bug Reports</span>
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>

          {/* --- Left Column: Main Content --- */}
          <div className='lg:col-span-2'>

            {/* Header Section */}
            <div className='mb-6'>
              {/* Badges Row */}
              <div className='flex flex-wrap items-center gap-2 sm:gap-3 mb-4'>
                {/* Category Badge */}
                <span className='flex items-center gap-1.5 px-3 py-1 bg-[#F5E6DD] text-[#A33C13] rounded-full text-xs sm:text-sm font-medium capitalize border border-[#E8D4C5]'>
                  <FiBox className="w-3.5 h-3.5" />
                  {bugReport.category}
                </span>

                {/* Severity Badge */}
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border}`}>
                  {severityStyle.icon}
                  <span className="capitalize">{bugReport.severity}</span>
                </span>

                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border capitalize ${getStatusStyles(bugReport.status)}`}>
                  {bugReport.status.replace('-', ' ')}
                </span>
              </div>

              <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171717] mb-4 leading-tight'>
                {bugReport.title}
              </h1>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 sm:mb-8">
              <h2 className='text-xl font-bold text-[#171717] mb-4'>Description</h2>
              <div className="prose prose-gray max-w-none text-[#171717] leading-relaxed whitespace-pre-wrap opacity-90">
                {bugReport.description}
              </div>
            </div>

            {/* Steps to Reproduce Card */}
            <div className='mb-6 sm:mb-8'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span><MdOutlineReplayCircleFilled /></span> Steps to Reproduce
              </h2>
              <div className='bg-[#F5F5F5] rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100'>
                <pre className="text-[#171717] leading-relaxed whitespace-pre-wrap font-sans">
                  {bugReport.steps_to_reproduce}
                </pre>
              </div>
            </div>

            {/* Attachments / Evidence */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className='text-xl sm:text-2xl font-bold text-[#171717] flex items-center gap-2'>
                  <span><RiAttachmentFill />
                  </span> Evidence & Attachments
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddAttachment}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors border border-green-200"
                  title="Add Attachment"
                >
                  <FiPlus size={14} />
                  Add Attachment
                </motion.button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {bugReport.attachments && bugReport.attachments.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-6">
                      {bugReport.attachments.length} attachment{bugReport.attachments.length === 1 ? '' : 's'} uploaded
                    </p>
                    <AttachmentList
                      attachments={bugReport.attachments
                        .filter(att => att && att.file_url) // Filter out invalid attachments
                        .map((att, index) => ({
                          url: att.file_url,
                          fileName: att.file_name || `Attachment ${index + 1}`
                        }))
                      }
                      size="lg"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiPaperclip className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No attachments uploaded yet</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddAttachment}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#A33C13] text-white rounded-lg text-sm font-medium hover:bg-[#8a2f0f] transition-colors"
                    >
                      <FiPlus size={16} />
                      Add First Attachment
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-6 sm:mb-8">
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span><IoChatboxEllipsesOutline /></span> Messages
              </h2>
              <Comments
                bugReportId={bugReport.id}
                comments={comments}
                onCommentsUpdated={handleCommentsUpdated}
              />
            </div>

          </div>

          {/* --- Right Column: Sidebar Stats & Actions --- */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-24 hover:shadow-lg transition-shadow duration-300'>

              {/* Reporter Info */}
              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                Reported By
              </h3>
              <div className="mb-6 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5E6DD] flex items-center justify-center text-[#A33C13]">
                  <FiUser className="w-5 h-5" />
                </div>
                <div>
                  <p className='text-[#171717] font-medium'>
                    {bugReport.tester}
                  </p>
                  <p className='text-gray-500 text-xs mt-1'>Tester</p>
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              {/* Project Info */}
              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span><ImFolder />
                </span> Project Details
              </h3>
              {projectLoading ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : project ? (
                <div className="mb-6 space-y-3">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">{project.title}</h4>
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">{project.description}</p>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium capitalize">
                          {project.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${project.status === 'active' ? 'bg-green-100 text-green-700' :
                          project.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {project.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tech Stack</span>
                        <span className="text-xs text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                          {project.technology_stack}
                        </span>
                      </div>

                      {project.testing_url && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Testing URL</span>
                          <a
                            href={project.testing_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 underline truncate max-w-[150px]"
                          >
                            {project.testing_url}
                          </a>
                        </div>
                      )}

                      <div className="pt-2 border-t border-blue-200">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Maintainer</span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="w-3 h-3 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{project.maintainer.fullname}</p>
                            <p className="text-xs text-gray-500">{project.maintainer.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Project ID</p>
                    <p className="text-[#171717] font-mono text-xs break-all">{bugReport.project}</p>
                  </div> */}
                </div>
              ) : (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Project ID</p>
                  <p className="text-[#171717] font-mono text-sm break-all">{bugReport.project}</p>
                  <p className="text-xs text-red-500 mt-1">Project details unavailable</p>
                </div>
              )}

              {/* Timestamps */}
              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>⏳</span> Timeline
              </h3>

              <div className='space-y-3 mb-6'>
                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg'>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FiClock /> <span>Reported</span>
                  </div>
                  <span className='font-medium text-[#171717] text-sm'>
                    {new Date(bugReport.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg'>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FiActivity /> <span>Updated</span>
                  </div>
                  <span className='font-medium text-[#171717] text-sm'>
                    {new Date(bugReport.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                {userRole === 'maintainer' ? (
                  // Maintainer Actions
                  <>
                    {bugReport.status === 'pending' ? (
                      // Show action buttons for pending status
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleApprove}
                          disabled={isApproving}
                          className='w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50'
                        >
                          {isApproving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <FiThumbsUp />
                          )}
                          {isApproving ? 'Approving...' : 'Approve Bug'}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleResolve}
                          disabled={isResolving}
                          className='w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50'
                        >
                          {isResolving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <FiCheck />
                          )}
                          {isResolving ? 'Resolving...' : 'Resolve Bug'}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleReject}
                          disabled={isRejecting}
                          className='w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50'
                        >
                          {isRejecting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <FiThumbsDown />
                          )}
                          {isRejecting ? 'Rejecting...' : 'Reject Bug'}
                        </motion.button>
                      </>
                    ) : (
                      // Show status display for non-pending status
                      <div className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">Current Status</p>
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusStyles(bugReport.status)}`}>
                            {bugReport.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Tester Actions
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEdit}
                      className='w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm'
                    >
                      <FiEdit /> Edit Bug Report
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDelete}
                      className='w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm'
                    >
                      <FiTrash2 /> Delete Bug Report
                    </motion.button>
                  </>
                )}

                {/* Optional View Project Link */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (userRole === 'tester') {
                      router.push('/tester/projects')
                    } else if (userRole === 'maintainer') {
                      router.push('/maintainer/bugs')
                    }
                  }}
                  className='w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2'
                >
                  <FiCornerDownRight /> {userRole === 'maintainer' ? 'Back to Bugs' : 'View Project'}
                </motion.button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Attachment Modal */}
      {bugReport && (
        <AttachmentModal
          isOpen={showAttachmentModal}
          onClose={() => setShowAttachmentModal(false)}
          bugReportId={bugReport.id}
          existingAttachments={bugReport.attachments || []}
          onAttachmentAdded={handleAttachmentAdded}
          onAttachmentRemoved={handleAttachmentRemoved}
          onAttachmentUpdated={handleAttachmentUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <FiTrash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Delete Bug Report
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{bugReport?.title}"? This will permanently remove the bug report and all its attachments.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default BugReportDetailPage