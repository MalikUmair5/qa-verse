'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiEdit, FiLogOut, FiSave, FiX, FiUpload } from 'react-icons/fi'
import { MdLockOutline } from 'react-icons/md'
import Loader from '@/components/ui/loader'
import { useAuthStore } from '@/store/authStore'
import { updateProfile, ProfileUpdateData } from '@/lib/api/auth/profile'
import { showToast } from '@/lib/utils/toast'
import { uploadToCloudinary } from '@/lib/utils/cloudinary'
import logout from '@/lib/api/auth/logout'
import { useRouter } from 'next/navigation'

function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const router = useRouter()
  
  // Helper function to safely decode email
  const decodeEmail = (email: string) => {
    try {
      // Try to decode as base64 first
      const decoded = atob(email)
      // Then decode URI component if needed
      return decodeURIComponent(decoded)
    } catch (error) {
      // If decoding fails, return the original email
      console.warn('Failed to decode email:', error)
      return email
    }
  }
  
  const [isEditMode, setIsEditMode] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [fullName, setFullName] = useState(user?.fullname || '')
  const [email, setEmail] = useState(user?.email ? decodeEmail(user.email) : '')
  const [bio, setBio] = useState(user?.bio || '')
  const [githubUrl, setGithubUrl] = useState(user?.github_url || '')
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedin_url || '')
  const [isLoading, setIsLoading] = useState(true)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleEditProfile = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    // Reset form to original values
    setFullName(user?.fullname || '')
    setEmail(user?.email ? decodeEmail(user.email) : '')
    setBio(user?.bio || '')
    setGithubUrl(user?.github_url || '')
    setLinkedinUrl(user?.linkedin_url || '')
    setIsEditMode(false)
  }

  const handleSaveProfile = async () => {
    setIsUpdating(true)
    try {
      const updateData: ProfileUpdateData = {
        email: email,
        fullname: fullName,
        bio: bio || undefined,
        github_url: githubUrl || undefined,
        linkedin_url: linkedinUrl || undefined
      }

      const updatedProfile = await updateProfile(updateData)
      
      // Update the auth store with the new user data
      updateUser({
        fullname: fullName,
        email: email,
        bio: bio,
        github_url: githubUrl,
        linkedin_url: linkedinUrl
      })
      
      showToast.success('Profile updated successfully!')
      setIsEditMode(false)
    } catch (error) {
      showToast.error('Failed to update profile. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangeAvatar = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast.error('Please select an image file')
        return
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        showToast.error('Image size must be less than 2MB')
        return
      }
      
      setAvatarFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadAvatar = async () => {
    if (!avatarFile) return

    setIsUploadingAvatar(true)
    const uploadingToast = showToast.loading('Uploading avatar...')

    try {
      const avatarUrl = await uploadToCloudinary(avatarFile, 'user-avatars')
      
      // Update profile with new avatar URL
      const updateData: ProfileUpdateData = {
        avatar: avatarUrl
      }
      
      await updateProfile(updateData)
      
      // Update auth store
      updateUser({
        avatar_url: avatarUrl
      })
      
      showToast.dismiss(uploadingToast)
      showToast.success('Avatar updated successfully!')
      
      // Clear preview
      setAvatarFile(null)
      setAvatarPreview(null)
      
    } catch (error) {
      showToast.dismiss(uploadingToast)
      showToast.error('Failed to upload avatar. Please try again.')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleChangePassword = () => {
    console.log('Change Password')
  }

  const handleLogout = () => {
    try {
      logout()
      router.push('/signin')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Show loader while loading
  if (isLoading) {
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
              <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300 overflow-hidden border-2 border-[#A33C13]'>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt='Avatar preview'
                    className='w-full h-full object-cover'
                  />
                ) : user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt='Profile Avatar'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-[#A33C13] text-white text-2xl font-bold'>
                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              {avatarPreview && (
                <div className='absolute -bottom-2 -right-2'>
                  <button
                    onClick={handleUploadAvatar}
                    disabled={isUploadingAvatar}
                    className='w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50'
                    title='Upload Avatar'
                  >
                    {isUploadingAvatar ? (
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    ) : (
                      <FiUpload size={14} />
                    )}
                  </button>
                </div>
              )}
            </div>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleAvatarChange}
              className='hidden'
            />

            {/* User Info and Actions */}
            <div className='flex-1 w-full sm:w-auto text-center sm:text-left'>
              <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-1'>{user?.fullname || 'User Name'}</h2>
              <p className='text-[#171717] mb-4 text-sm sm:text-base'>{user?.email ? decodeEmail(user.email) : 'user@example.com'}</p>
              
              <div className='flex flex-col sm:flex-row gap-3'>
                {!isEditMode ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className='flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <FiSave size={18} />
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className='flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <FiX size={18} />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
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
                disabled={!isEditMode}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-[#171717] ${
                  isEditMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                }`}
                placeholder={user?.fullname || 'Enter full name'}
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
                disabled={!isEditMode}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-[#171717] ${
                  isEditMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                }`}
                placeholder={user?.email ? decodeEmail(user.email) : 'Enter email'}
              />
            </div>

            {/* Bio */}
            <div className='lg:col-span-2'>
              <label className='block text-[#171717] font-semibold mb-2 text-lg'>
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isEditMode}
                rows={3}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-[#171717] resize-none ${
                  isEditMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                }`}
                placeholder='Tell us about yourself...'
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label className='block text-[#171717] font-semibold mb-2 text-lg'>
                GitHub URL
              </label>
              <input
                type='url'
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                disabled={!isEditMode}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-[#171717] ${
                  isEditMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                }`}
                placeholder='https://github.com/username'
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label className='block text-[#171717] font-semibold mb-2 text-lg'>
                LinkedIn URL
              </label>
              <input
                type='url'
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                disabled={!isEditMode}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-[#171717] ${
                  isEditMode ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                }`}
                placeholder='https://linkedin.com/in/username'
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