'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiEdit, FiLogOut } from 'react-icons/fi'
import { MdLockOutline } from 'react-icons/md'

function ProfilePage() {
  const [fullName, setFullName] = useState('Jojo Smith')
  const [email, setEmail] = useState('shapiqi@example.com')

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

  return (
    <div className='flex-1 bg-[#FFFCFB] min-h-screen'>
      <div className='p-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-[#171717] mb-2'>My Profile</h1>
          <p className='text-[#171717] text-lg'>Manage your account setting and preferences</p>
        </div>

        {/* Profile Card */}
        <motion.div 
          className='bg-[#D9D9D9]/20 rounded-2xl p-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header with Avatar */}
          <div className='flex items-start gap-6 mb-8 pb-8 border-b border-gray-300'>
            {/* Avatar */}
            <div className='relative'>
              <div className='w-24 h-24 rounded-full bg-gray-300 overflow-hidden'>
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
            <div className='flex-1'>
              <h2 className='text-2xl font-bold text-[#171717] mb-1'>Jojo Smith</h2>
              <p className='text-[#171717] mb-4'>shapiqi@example.com</p>
              
              <div className='flex gap-3'>
                <button
                  onClick={handleEditProfile}
                  className='flex items-center gap-2 px-4 py-2 bg-[#D4A574] text-[#171717] rounded-lg hover:bg-[#c49563] transition-colors font-medium'
                >
                  <FiEdit size={18} />
                  Edit Profile
                </button>
                <button
                  onClick={handleChangeAvatar}
                  className='px-4 py-2 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors font-medium'
                >
                  Change Avatar
                </button>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
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
            <h3 className='text-xl font-bold text-[#171717] mb-4'>Account Action</h3>
            <div className='flex flex-wrap gap-4'>
              <button
                onClick={handleChangePassword}
                className='flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-[#171717] rounded-lg hover:border-[#A33C13] hover:bg-gray-50 transition-all font-medium'
              >
                <MdLockOutline size={20} />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className='flex items-center gap-2 px-6 py-3 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors font-medium'
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
