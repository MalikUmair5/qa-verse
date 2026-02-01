'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiUpload } from 'react-icons/fi'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBugReport, BugReportPayload, getBugReportById, updateBugReport } from '@/lib/api/tester/bugReport'
import toast from 'react-hot-toast';

function ReportBugPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [projectId, setProjectId] = useState<string>('')
  const [bugId, setBugId] = useState<string>('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    bugTitle: '',
    detailedDescription: '',
    stepsToReproduce: '',
    category: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    mediaFiles: null as File[] | null
  })

  useEffect(() => {
    const projectIdParam = searchParams.get('projectId')
    const bugIdParam = searchParams.get('bugId')
    
    if (projectIdParam) {
      setProjectId(projectIdParam)
    }
    
    if (bugIdParam) {
      setBugId(bugIdParam)
      setIsEditMode(true)
      fetchBugData(bugIdParam)
    }
  }, [searchParams])

  const fetchBugData = async (bugId: string) => {
    try {
      setFetchLoading(true)
      const bugData = await getBugReportById(bugId)
      
      // Prefill form with existing data
      setFormData({
        bugTitle: bugData.title,
        detailedDescription: bugData.description,
        stepsToReproduce: bugData.steps_to_reproduce,
        category: bugData.category,
        severity: bugData.severity as 'low' | 'medium' | 'high' | 'critical',
        mediaFiles: null // Attachments not supported in edit for now
      })
      
      // Set project ID from bug data
      setProjectId(bugData.project)
    } catch (error: any) {
      console.error('Error fetching bug data:', error)
      toast.error('Failed to load bug report data')
      router.push('/tester/projects')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        mediaFiles: Array.from(e.target.files!)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!projectId && !isEditMode) {
      toast.error('Project ID is required')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading(isEditMode ? 'Updating bug report...' : 'Submitting bug report...')

    try {
      const payload: BugReportPayload = {
        project: projectId,
        title: formData.bugTitle,
        description: formData.detailedDescription,
        steps_to_reproduce: formData.stepsToReproduce,
        category: formData.category as BugReportPayload['category'],
        severity: formData.severity
      }

      if (isEditMode && bugId) {
        await updateBugReport(bugId, payload)
        toast.dismiss(loadingToast)
        toast.success('Bug report updated successfully!')
      } else {
        await createBugReport(payload)
        toast.dismiss(loadingToast)
        toast.success('Bug report submitted successfully!')
      }
      
      // Redirect to tester projects page
      router.push('/tester/projects')
    } catch (error: any) {
      console.error('Error with bug report:', error)
      toast.dismiss(loadingToast)
      toast.error(error?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'submit'} bug report. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToProject = () => {
    router.back()
  }

  // Show loading while fetching bug data for edit mode
  if (fetchLoading) {
    return (
      <div className='min-h-screen bg-[#FFFCFB] flex items-center justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33C13]"></div>
      </div>
    )
  }

  return (
    <div className='flex-1 bg-[#FFFCFB] min-h-screen'>
      <div className='p-4 sm:p-6 md:p-8 max-w-4xl mx-auto'>
        {/* Back Button */}
        <motion.button
          onClick={handleBackToProject}
          className='flex items-center gap-2 text-[#171717] mb-4 sm:mb-6 hover:text-[#A33C13] transition-colors'
          whileHover={{ x: -5 }}
        >
          <FiChevronLeft size={20} />
          <span className='font-medium'>Back to Project</span>
        </motion.button>

        {/* Form Card */}
        <motion.div
          className='bg-white rounded-xl md:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className='mb-6 md:mb-8'>
            <h1 className='text-2xl sm:text-3xl font-bold text-[#171717] mb-2'>
              {isEditMode ? 'Edit Bug Report' : 'Report a Bug'}
            </h1>
            <p className='text-sm sm:text-base text-[#171717]'>
              {isEditMode ? 'Update your bug report details below.' : 'Help improve QuantumLeap CRM by reporting an issue.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Bug Title */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Bug Title
              </label>
              <input
                type='text'
                name='bugTitle'
                value={formData.bugTitle}
                onChange={handleInputChange}
                placeholder='e.g User login button is not working'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] placeholder:text-gray-400'
                required
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Detailed Description
              </label>
              <textarea
                name='detailedDescription'
                value={formData.detailedDescription}
                onChange={handleInputChange}
                placeholder='e.g User login button is not working'
                rows={5}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] placeholder:text-gray-400 resize-none'
                required
              />
            </div>

            {/* Steps to Reproduce */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Steps to Reproduce
              </label>
              <textarea
                name='stepsToReproduce'
                value={formData.stepsToReproduce}
                onChange={handleInputChange}
                placeholder='e.g User login button is not working'
                rows={5}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] placeholder:text-gray-400 resize-none'
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Category
              </label>
              <select
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] bg-white cursor-pointer'
                required
              >
                <option value=''>Select a category</option>
                <option value='ui'>UI/UX Issue</option>
                <option value='functionality'>Functionality</option>
                <option value='performance'>Performance</option>
                <option value='security'>Security</option>
                <option value='compatibility'>Compatibility</option>
                <option value='other'>Other</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Severity
              </label>
              <select
                name='severity'
                value={formData.severity}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] bg-white cursor-pointer'
                required
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
                <option value='critical'>Critical</option>
              </select>
            </div>

            {/* Attach Media */}
            {/* <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Attach Media (Optional)
              </label>
              <div className='relative'>
                <input
                  type='file'
                  id='file-upload'
                  name='mediaFiles'
                  onChange={handleFileChange}
                  multiple
                  accept='image/*,video/*'
                  className='hidden'
                />
                <label
                  htmlFor='file-upload'
                  className='flex items-center gap-3 w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-[#A33C13] transition-colors bg-white'
                >
                  <FiUpload className='text-gray-400' size={20} />
                  <span className='text-gray-400'>
                    {formData.mediaFiles && formData.mediaFiles.length > 0
                      ? `${formData.mediaFiles.length} file(s) selected`
                      : 'Upload screenshots'}
                  </span>
                </label>
              </div>
            </div> */}

            {/* Submit Button */}
            <div className='pt-4'>
              <button
                type='submit'
                disabled={loading || fetchLoading}
                className={`w-full sm:w-auto px-8 py-3 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors font-medium flex items-center justify-center gap-2 ${
                  loading || fetchLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{isEditMode ? 'Updating...' : 'Submitting...'}</span>
                  </>
                ) : (
                  isEditMode ? 'Update Bug Report' : 'Submit Bug Report'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ReportBugPage
