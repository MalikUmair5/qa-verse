'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiUpload, FiAlertCircle } from 'react-icons/fi'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBugs } from '@/hooks/useBugs'
import api from '@/lib/api'

function ReportBugPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { bugs } = useBugs({})
  const projectId = searchParams.get('projectId') || ''
  
  const [formData, setFormData] = useState({
    bugTitle: '',
    detailedDescription: '',
    stepsToReproduce: '',
    testingURL: '',
    category: '',
    severity: '',
    mediaFiles: null as File[] | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null)

  // Check for duplicate bugs when title changes
  useEffect(() => {
    if (formData.bugTitle.length > 10) {
      const similarBugs = bugs.filter(bug => 
        bug.projectId === projectId && 
        bug.title.toLowerCase().includes(formData.bugTitle.toLowerCase().substring(0, 15))
      )
      if (similarBugs.length > 0) {
        setDuplicateWarning(`${similarBugs.length} similar bug(s) found. Please check before submitting.`)
      } else {
        setDuplicateWarning(null)
      }
    }
  }, [formData.bugTitle, bugs, projectId])

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
    setIsSubmitting(true)
    
    try {
      const bugData = {
        projectId,
        testerId: user?.id || '',
        title: formData.bugTitle,
        description: formData.detailedDescription,
        stepsToReproduce: formData.stepsToReproduce.split('\n').filter(step => step.trim()),
        testingURL: formData.testingURL,
        category: formData.category as 'UI' | 'Functionality' | 'Performance' | 'Security',
        severity: formData.severity as 'Low' | 'Medium' | 'High' | 'Critical',
        status: 'Pending' as const,
        // In real implementation, upload files to Cloudinary first
        attachments: []
      }
      
      const response = await api.bugs.create(bugData)
      
      if (response.success) {
        alert('Bug report submitted successfully!')
        router.back()
      } else {
        alert('Failed to submit bug report')
      }
    } catch (error) {
      console.error('Error submitting bug:', error)
      alert('An error occurred while submitting')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToProject = () => {
    router.back()
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
            <h1 className='text-2xl sm:text-3xl font-bold text-[#171717] mb-2'>Report a Bug</h1>
            <p className='text-sm sm:text-base text-[#171717]'>
              Help improve the project by reporting an issue.
            </p>
          </div>

          {/* Duplicate Warning */}
          {duplicateWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3'
            >
              <FiAlertCircle className='text-yellow-600 flex-shrink-0 mt-0.5' size={20} />
              <div className='text-sm text-yellow-800'>{duplicateWarning}</div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Bug Title */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Bug Title <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='bugTitle'
                value={formData.bugTitle}
                onChange={handleInputChange}
                placeholder='Brief, descriptive title of the issue'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] placeholder:text-gray-400'
                required
              />
            </div>

            {/* Testing URL */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Testing URL <span className='text-red-500'>*</span>
              </label>
              <input
                type='url'
                name='testingURL'
                value={formData.testingURL}
                onChange={handleInputChange}
                placeholder='https://example.com/page-where-bug-occurred'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] placeholder:text-gray-400'
                required
              />
            </div>

            {/* Severity Level */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Severity Level <span className='text-red-500'>*</span>
              </label>
              <select
                name='severity'
                value={formData.severity}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] bg-white cursor-pointer'
                required
              >
                <option value=''>Select severity level</option>
                <option value='Low'>Low - Minor issue, cosmetic</option>
                <option value='Medium'>Medium - Moderate functionality issue</option>
                <option value='High'>High - Major functionality broken</option>
                <option value='Critical'>Critical - System crashes or data loss</option>
              </select>
            </div>

            {/* Detailed Description */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Detailed Description <span className='text-red-500'>*</span>
              </label>
              <textarea
                name='detailedDescription'
                value={formData.detailedDescription}
                onChange={handleInputChange}
                placeholder='Describe the bug in detail. What happened? What did you expect to happen?'
                rows={6}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] placeholder:text-gray-400 resize-none'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>Minimum 20 characters</p>
            </div>

            {/* Steps to Reproduce */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Steps to Reproduce <span className='text-red-500'>*</span>
              </label>
              <textarea
                name='stepsToReproduce'
                value={formData.stepsToReproduce}
                onChange={handleInputChange}
                placeholder='1. Go to login page&#10;2. Enter credentials&#10;3. Click login button&#10;4. Error appears'
                rows={6}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] placeholder:text-gray-400 resize-none font-mono text-sm'
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Category <span className='text-red-500'>*</span>
              </label>
              <select
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] bg-white cursor-pointer'
                required
              >
                <option value=''>Select bug category</option>
                <option value='UI'>UI/UX Issue</option>
                <option value='Functionality'>Functionality</option>
                <option value='Performance'>Performance</option>
                <option value='Security'>Security</option>
              </select>
            </div>

            {/* Attach Media */}
            <div>
              <label className='block text-[#A33C13] font-medium mb-2'>
                Attach Media (Screenshots/Videos)
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
                  className='flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#A33C13] transition-colors bg-gray-50 hover:bg-white'
                >
                  <FiUpload className='text-gray-400' size={20} />
                  <span className='text-gray-600'>
                    {formData.mediaFiles && formData.mediaFiles.length > 0
                      ? `${formData.mediaFiles.length} file(s) selected`
                      : 'Click to upload screenshots or screen recordings'}
                  </span>
                </label>
                <p className='text-xs text-gray-500 mt-1'>Max 10MB per file. Supported: JPG, PNG, GIF, MP4, MOV</p>
              </div>
              {formData.mediaFiles && formData.mediaFiles.length > 0 && (
                <div className='mt-3 space-y-2'>
                  {Array.from(formData.mediaFiles).map((file, index) => (
                    <div key={index} className='text-sm text-gray-600 flex items-center gap-2'>
                      <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className='pt-4 flex gap-3'>
              <button
                type='button'
                onClick={handleBackToProject}
                className='px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='flex-1 sm:flex-none px-8 py-3 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ReportBugPage
