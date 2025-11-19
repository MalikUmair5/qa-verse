'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiEdit, FiLogOut } from 'react-icons/fi'
import { MdLockOutline } from 'react-icons/md'
import { useAuth } from '@/hooks/useAuth'
import { useAnalytics } from '@/hooks/useAnalytics'
import Loader from '@/components/ui/loader'

function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const { analytics, isLoading: analyticsLoading } = useAnalytics(user?.id || '')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (user) {
      setFullName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleEditProfile = () => {
    console.log('Edit Profile')
  }

  const handleChangeAvatar = () => {
    console.log('Change Avatar')
  }

  const handleChangePassword = () => {
    console.log('Change Password')
  }

  const handleLogout = () => {
    console.log('Logout')
  }

  // Show loader while loading
  if (authLoading || analyticsLoading) {
    return <Loader />
  }

  return (
    <div className='flex-1 bg-[#FFFCFB] min-h-screen'>
      <div className='p-4 sm:p-6 md:p-8'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-[#171717] mb-2'>My Profile</h1>
          <p className='text-sm sm:text-base text-[#171717]'>Manage your account setting and preferences</p>
        </div>

        {/* Profile Card */}
        <motion.div 
          className='bg-[#D9D9D9]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-5xl'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header with Avatar */}
          <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-300'>
            {/* Avatar */}
            <div className='relative mx-auto sm:mx-0'>
              <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300 overflow-hidden'>
                <Image
                  src='/next.svg'
                  alt='Profile'
                  width={96}
                  height={96}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>

            {/* User Info and Actions */}
            <div className='flex-1 w-full sm:w-auto text-center sm:text-left'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-1'>{fullName}</h2>
              <p className='text-[#171717] mb-4 text-sm sm:text-base'>{email}</p>
              
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={handleEditProfile}
                  className='flex items-center justify-center gap-2 px-4 py-2 bg-[#D4A574] text-[#171717] rounded-lg hover:bg-[#c49563] transition-colors font-medium text-sm sm:text-base'
                >
                  <FiEdit size={18} />
                  Edit Profile
                </button>
                <button
                  onClick={handleChangeAvatar}
                  className='px-4 py-2 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors font-medium text-sm sm:text-base'
                >
                  Change Avatar
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          {analytics && (
            <div className='mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-300'>
              <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4'>Your Statistics</h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='bg-white rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-[#A33C13]'>{analytics.totalBugs}</p>
                  <p className='text-sm text-gray-600'>Total Bugs</p>
                </div>
                <div className='bg-white rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-green-600'>{analytics.approvedBugs}</p>
                  <p className='text-sm text-gray-600'>Approved</p>
                </div>
                <div className='bg-white rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-yellow-600'>{analytics.pendingBugs}</p>
                  <p className='text-sm text-gray-600'>Pending</p>
                </div>
                <div className='bg-white rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-blue-600'>{analytics.successRate}%</p>
                  <p className='text-sm text-gray-600'>Success Rate</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8'>
            {/* Full Name */}
            <div>
              <label className='block text-[#171717] font-semibold mb-2 text-lg'>
                Full Name
              </label>
              <input
                type='text'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-[#171717]'
                placeholder='Enter full name'
              />
            </div>

            {/* Email */}
            <div>
              <label className='block text-[#171717] font-semibold mb-2 text-lg'>
                Email
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-[#171717]'
                placeholder='Enter email'
              />
            </div>
          </div>

          {/* Account Action Section */}
          <div>
            <h3 className='text-lg sm:text-xl font-bold text-[#171717] mb-4'>Account Action</h3>
            <div className='flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4'>
              <button
                onClick={handleChangePassword}
                className='flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-[#171717] rounded-lg hover:border-[#A33C13] hover:bg-gray-50 transition-all font-medium text-sm sm:text-base'
              >
                <MdLockOutline size={20} />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className='flex items-center justify-center gap-2 px-6 py-3 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors font-medium text-sm sm:text-base'
              >
                <FiLogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
