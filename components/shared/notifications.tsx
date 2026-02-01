'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiUser,
  FiX,
  FiRefreshCw,
  FiArrowRight,
  FiMessageCircle,
  FiActivity,
  FiAlertCircle
} from 'react-icons/fi'
import Loader from '@/components/ui/loader'
import ThemeButton from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type NotificationResponse,
  type NotificationsListResponse
} from '@/lib/api/notifications'
import { showToast } from '@/lib/utils/toast'

// Animation variants
const containerAnimation = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
}

// Notification Card Component
interface NotificationCardProps {
  notification: NotificationResponse
  onMarkAsRead: (id: number) => Promise<void>
  isMarking: boolean
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  isMarking
}) => {
  const router = useRouter()
  const userRole = useAuthStore().user?.role
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMins < 1) return 'Just now'
    if (diffInMins < 60) return `${diffInMins}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (verb: string) => {
    if (verb.includes('commented')) return <FiMessageCircle className="w-4 h-4" />
    if (verb.includes('updated status')) return <FiActivity className="w-4 h-4" />
    if (verb.includes('bug')) return <FiAlertCircle className="w-4 h-4" />
    return <FiBell className="w-4 h-4" />
  }

  const getNotificationColor = (verb: string) => {
    if (verb.includes('commented')) return 'bg-blue-50 border-blue-200 text-blue-700'
    if (verb.includes('approved')) return 'bg-green-50 border-green-200 text-green-700'
    if (verb.includes('resolved')) return 'bg-emerald-50 border-emerald-200 text-emerald-700'
    if (verb.includes('rejected')) return 'bg-red-50 border-red-200 text-red-700'
    return 'bg-gray-50 border-gray-200 text-gray-700'
  }

  const handleRoute = () => {
    // Navigate based on user role and what the target_object_id represents
    if (userRole === 'tester') {
      // For testers, target_object_id is bug id
      router.push(`/tester/projects/bug/${notification.target_object_id}`)
    } else if (userRole === 'maintainer') {
      if (notification.verb.includes('commented')) {
        // For maintainers, if it's a comment, go to bug detail
        router.push(`/maintainer/bugs/bug/${notification.target_object_id}`)
      }
      else if (notification.verb.includes('reported')){
        // For maintainers, if it's a new bug reported, go to bug detail
        router.push(`/maintainer/project-details/${notification.target_object_id}`)
      }
    }
  }

  return (
    <motion.div
      variants={itemAnimation}
      className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${notification.is_read
        ? 'bg-white border-gray-200'
        : 'bg-orange-50/50 border-orange-200 ring-1 ring-orange-100'
        }`}
    >
      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="absolute top-3 left-3 w-2 h-2 bg-orange-500 rounded-full" />
      )}

      {/* Main Content */}
      <div className={`flex items-start gap-3 ${!notification.is_read ? 'ml-4' : ''}`}>
        {/* Icon */}
        <div className={`p-2 rounded-lg ${getNotificationColor(notification.verb)}`}>
          {getNotificationIcon(notification.verb)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Actor and Action */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <span className="font-medium text-[#171717] text-sm">
                {notification.actor_email.split('@')[0]}
              </span>
              <span className="text-gray-600 text-sm ml-1">
                {notification.verb}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                {formatTimeAgo(notification.created_at)}
              </span>
            </div>
          </div>

          {/* Target Object ID */}
          <div className="text-xs text-gray-500 mb-3 font-mono bg-gray-100 px-2 py-1 rounded truncate max-w-xs">
            {userRole === 'maintainer' ? 'Project Name' : 'Report Name'}: {notification.object_name}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!notification.is_read && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMarkAsRead(notification.id)}
                disabled={isMarking}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors border border-green-200 disabled:opacity-50"
              >
                {isMarking ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                ) : (
                  <FiCheck className="w-3 h-3" />
                )}
                Mark as Read
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRoute}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors border border-gray-200"
            >
              View <FiArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function NotificationsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [notificationStats, setNotificationStats] = useState({ total: 0, unread: 0 })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const [markingIds, setMarkingIds] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [forceUpdate, setForceUpdate] = useState(0)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)

  // Fetch notifications
  const fetchNotifications = async (showLoader = true, page = 1) => {
    try {
      if (showLoader) setIsLoading(true)
      const response = await getNotifications({ page })
      setNotifications(response.results)
      setTotalCount(response.count)
      setHasNext(response.next !== null)
      setHasPrevious(response.previous !== null)

      // Calculate stats
      const unreadCount = response.results.filter(n => !n.is_read).length
      setNotificationStats({
        total: response.count,
        unread: unreadCount
      })
    } catch (error) {
      // For development - show mock data if API fails 
      showToast.error('Failed to load notifications')
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchNotifications(true, currentPage)

    // Set up auto-refresh every 30 seconds (only for current page)
    const interval = setInterval(() => {
      fetchNotifications(false, currentPage)
    }, 30000)

    return () => clearInterval(interval)
  }, [currentPage])

  // Pagination handlers
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

  const totalPages = Math.ceil(totalCount / 10) // Assuming 10 items per page

  // Refresh notifications
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchNotifications(false, currentPage)
    setIsRefreshing(false)
    showToast.success('Notifications refreshed')
  }

  // Mark individual notification as read
  const handleMarkAsRead = async (id: number) => {
    setMarkingIds(prev => new Set(prev).add(id))
    try {
      await markNotificationAsRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
      setNotificationStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }))
      showToast.success('Notification marked as read')
    } catch (error) {
      showToast.error('Failed to mark notification as read')
      console.error('Error marking notification as read:', error)
    } finally {
      setMarkingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true)
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setNotificationStats(prev => ({ ...prev, unread: 0 }))
      showToast.success('All notifications marked as read')
    } catch (error) {
      showToast.error('Failed to mark all notifications as read')
      console.error('Error marking all notifications as read:', error)
    } finally {
      setIsMarkingAll(false)
    }
  }

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read
    if (filter === 'read') return notification.is_read
    return true
  })

  // Show loader while loading
  if (isLoading) {
    return <Loader />
  }

  return (
    <div className='flex-1 bg-[#FFFCFB] min-h-screen'>
      <div className='p-4 sm:p-6 md:p-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-6'
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-[#171717] mb-2'>Notifications</h1>
              <p className='text-sm sm:text-base text-[#171717]'>
                Stay updated with the latest activity on your bug reports
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-[#171717] rounded-lg hover:border-[#A33C13] hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-[#171717]">{notificationStats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FiBell className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-orange-600">{notificationStats.unread}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <FiMail className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Read</p>
                  <p className="text-2xl font-bold text-green-600">{notificationStats.total - notificationStats.unread}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <FiMail className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filter Tabs and Mark All Read Button */}
          <div className="flex items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
              {(['all', 'unread', 'read'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => {
                    setFilter(filterOption)
                    setForceUpdate(prev => prev + 1)
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${filter === filterOption
                    ? 'bg-[#A33C13] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#A33C13] hover:bg-gray-50'
                    }`}
                >
                  {filterOption}
                  {filterOption === 'unread' && notificationStats.unread > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                      {notificationStats.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Mark All as Read Button */}
            {notificationStats.unread > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="flex items-center gap-2 px-4 py-2 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] transition-colors font-medium text-sm disabled:opacity-50 whitespace-nowrap"
              >
                {isMarkingAll ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiCheckCircle className="w-4 h-4" />
                )}
                Mark All Read
              </motion.button>
            )}
          </div>

          {/* Pagination Info */}
          {!isLoading && totalCount > 0 && (
            <div className='mt-4 flex items-center justify-between text-sm text-gray-600'>
              <p>
                Showing {notifications.length} of {totalCount} notifications
              </p>
              <p>
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </motion.div>

        {/* Notifications List */}
        <motion.div
          key={`notifications-${filter}-${forceUpdate}`}
          variants={containerAnimation}
          initial="initial"
          animate="animate"
          className="max-w-4xl"
        >
          {filteredNotifications.length === 0 ? (
            /* Empty State */
            <motion.div
              variants={itemAnimation}
              className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-3 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FiBell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#171717] mb-2">
                {filter === 'unread' ? 'No unread notifications' :
                  filter === 'read' ? 'No read notifications' : 'No notifications yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'unread' ? 'All caught up! Check back later for new updates.' :
                  filter === 'read' ? 'No notifications have been read yet.' :
                    'We\'ll notify you when there\'s activity on your bug reports.'}
              </p>
              {filter !== 'all' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter('all')}
                  className="text-[#A33C13] hover:text-[#8a2f0f] font-medium"
                >
                  View all notifications
                </motion.button>
              )}
            </motion.div>
          ) : (
            /* Notifications List */
            <div className="space-y-4">
              <AnimatePresence mode="wait" key={`${filter}-${forceUpdate}`}>
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    isMarking={markingIds.has(notification.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && totalCount > 0 && (
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

          {/* Total Notifications Info */}
          {!isLoading && totalCount > 0 && (
            <div className='text-center mt-4 text-sm text-gray-600'>
              Total: {totalCount} notifications
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
export default NotificationsPage