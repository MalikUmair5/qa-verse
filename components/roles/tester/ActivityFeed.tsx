'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi'
import { MdBugReport } from 'react-icons/md'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useAuth } from '@/hooks/useAuth'

interface ActivityItem {
  id: string
  type: 'bug_approved' | 'bug_rejected' | 'bug_submitted' | 'badge_earned' | 'xp_gained'
  title: string
  description: string
  date: string
  icon: React.ReactNode
  color: string
}

function ActivityFeed() {
  const { user } = useAuth()
  const { analytics } = useAnalytics(user?.id || '')

  // Transform recent activity from analytics
  const activities: ActivityItem[] = analytics?.recentActivity?.map((bug) => ({
    id: bug.id,
    type: bug.status === 'Approved' ? 'bug_approved' : bug.status === 'Rejected' ? 'bug_rejected' : 'bug_submitted',
    title: bug.title,
    description: `${bug.projectTitle} • ${bug.status}`,
    date: bug.createdDate,
    icon: bug.status === 'Approved' ? <FiCheckCircle /> : bug.status === 'Rejected' ? <FiXCircle /> : <MdBugReport />,
    color: bug.status === 'Approved' ? 'text-green-500' : bug.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'
  })) || []

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const activityDate = new Date(date)
    const diffMs = now.getTime() - activityDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return activityDate.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#171717]">Recent Activity</h2>
        <FiClock className="text-gray-400" size={20} />
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity</p>
          <p className="text-sm mt-2">Start testing projects to see your activity here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 10).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#171717] truncate">{activity.title}</p>
                <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.date)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activities.length > 10 && (
        <button className="w-full mt-4 text-[#A33C13] hover:text-[#8a2f0f] font-medium text-sm">
          View All Activity
        </button>
      )}
    </div>
  )
}

export default ActivityFeed
