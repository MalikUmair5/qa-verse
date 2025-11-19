'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBell, FiLock, FiUser, FiMail, FiSave } from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth'
import Loader from '@/components/ui/loader'

function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    university: '',
    skills: ''
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailBugApproved: true,
    emailBugRejected: true,
    emailNewComment: true,
    emailBadgeEarned: true,
    emailWeeklyReport: false,
    pushNotifications: true,
    desktopNotifications: false
  })

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showStats: true,
    showBadges: true,
    allowMessages: true
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: '',
        university: '',
        skills: ''
      })
    }
  }, [user])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }))
  }

  const handlePrivacyChange = (key: string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof privacy]
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Profile updated successfully!')
    setIsSaving(false)
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Notification preferences updated!')
    setIsSaving(false)
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!')
      return
    }
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Password changed successfully!')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setIsSaving(false)
  }

  const handleSavePrivacy = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Privacy settings updated!')
    setIsSaving(false)
  }

  if (authLoading) return <Loader />

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell size={18} /> },
    { id: 'security', label: 'Security', icon: <FiLock size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <FiMail size={18} /> }
  ]

  return (
    <div className="min-h-screen bg-[#FFFCFB] p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">Settings</h1>
          <p className="text-sm sm:text-base text-[#666]">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                    activeTab === tab.id
                      ? 'bg-[#A33C13] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-[#171717] mb-4">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                      <input
                        type="text"
                        name="university"
                        value={profileData.university}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                      <input
                        type="text"
                        name="skills"
                        value={profileData.skills}
                        onChange={handleProfileChange}
                        placeholder="JavaScript, Testing, UI/UX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
                      />
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors disabled:opacity-50"
                    >
                      <FiSave size={18} />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-[#171717] mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Email Notifications</h3>
                      {Object.entries(notifications).filter(([key]) => key.startsWith('email')).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded">
                          <span className="text-gray-700">{key.replace('email', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleNotificationChange(key)}
                            className="w-5 h-5 text-[#A33C13] rounded focus:ring-[#A33C13]"
                          />
                        </label>
                      ))}
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Other Notifications</h3>
                      {Object.entries(notifications).filter(([key]) => !key.startsWith('email')).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded">
                          <span className="text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleNotificationChange(key)}
                            className="w-5 h-5 text-[#A33C13] rounded focus:ring-[#A33C13]"
                          />
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={handleSaveNotifications}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors disabled:opacity-50"
                    >
                      <FiSave size={18} />
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-[#171717] mb-4">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
                      />
                    </div>
                    <button
                      onClick={handleChangePassword}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors disabled:opacity-50"
                    >
                      <FiLock size={18} />
                      {isSaving ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-bold text-[#171717] mb-4">Privacy Settings</h2>
                  <div className="space-y-4">
                    <p className="text-gray-600 mb-4">Control what information is visible to other users</p>
                    {Object.entries(privacy).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-3 rounded border-b">
                        <div>
                          <span className="text-gray-800 font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <p className="text-sm text-gray-500">
                            {key === 'showProfile' && 'Allow others to view your profile'}
                            {key === 'showStats' && 'Display your testing statistics publicly'}
                            {key === 'showBadges' && 'Show your earned badges on your profile'}
                            {key === 'allowMessages' && 'Allow other users to send you messages'}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handlePrivacyChange(key)}
                          className="w-5 h-5 text-[#A33C13] rounded focus:ring-[#A33C13]"
                        />
                      </label>
                    ))}
                    <button
                      onClick={handleSavePrivacy}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors disabled:opacity-50 mt-6"
                    >
                      <FiSave size={18} />
                      {isSaving ? 'Saving...' : 'Save Privacy Settings'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsPage
