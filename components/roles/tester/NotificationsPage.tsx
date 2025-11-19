'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import Loader from '@/components/ui/loader'
import { FiBell, FiCheck, FiMessageCircle, FiAward, FiAlertCircle } from 'react-icons/fi'
import { Notification as AppNotification } from '@/lib/types'

function NotificationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { notifications, unreadCount, isLoading, markAsRead } = useNotifications(user?.id || '', false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bug_approved': return <FiCheck className="text-green-500" />
      case 'bug_rejected': return <FiAlertCircle className="text-red-500" />
      case 'comment': return <FiMessageCircle className="text-blue-500" />
      case 'badge_earned': return <FiAward className="text-yellow-500" />
      default: return <FiBell className="text-gray-500" />
    }
  }

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.read) {
      await markAsRead(String(notification.id))
    }

    // Navigate based on notification type
    if (notification.relatedType === 'bug') {
      router.push(`/tester/my-bug-reports/${notification.relatedId}`)
    } else if (notification.relatedType === 'badge') {
      router.push('/tester/achievements')
    }
  }

  if (isLoading) return <Loader />

  return (
    <div className="min-h-screen bg-[#FFFCFB] p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">Notifications</h1>
            <p className="text-sm sm:text-base text-[#666]">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="relative">
            <FiBell className="text-4xl text-[#A33C13]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FiBell className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                  !notification.read ? 'border-l-4 border-[#A33C13]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-[#171717]">{notification.title}</h3>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-[#A33C13] rounded-full mt-2"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default NotificationsPage
