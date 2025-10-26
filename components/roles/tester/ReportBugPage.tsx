'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiUpload } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

function ReportBugPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    bugTitle: '',
    detailedDescription: '',
    stepsToReproduce: '',
    category: '',
    mediaFiles: null as File[] | null
  })

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Bug Report Submitted:', formData)
    // Handle form submission
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
              Help improve QuantumLeap CRM by reporting an issue.
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
                <option value=''>e.g User login button is not working</option>
                <option value='ui'>UI/UX Issue</option>
                <option value='functionality'>Functionality</option>
                <option value='performance'>Performance</option>
                <option value='security'>Security</option>
                <option value='compatibility'>Compatibility</option>
                <option value='other'>Other</option>
              </select>
            </div>

            {/* Attach Media */}
            <div>
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
            </div>

            {/* Submit Button */}
            <div className='pt-4'>
              <button
                type='submit'
                className='w-full sm:w-auto px-8 py-3 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors font-medium'
              >
                Submit Bug Report
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ReportBugPage
