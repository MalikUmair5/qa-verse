'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useAnalytics } from '@/hooks/useAnalytics'
import Loader from '@/components/ui/loader'
import { FiCheckCircle, FiXCircle, FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'

function AnalyticsPage() {
  const { user } = useAuth()
  const { analytics, isLoading, error } = useAnalytics(user?.id || '')

  if (isLoading) return <Loader />
  if (!analytics) return <div className="p-8 text-center">No analytics data available</div>

  const stats = [
    { label: 'Total Bugs', value: analytics.totalBugs || 0, icon: FiAlertCircle, color: 'bg-blue-500' },
    { label: 'Approved', value: analytics.approvedBugs || 0, icon: FiCheckCircle, color: 'bg-green-500' },
    { label: 'Rejected', value: analytics.rejectedBugs || 0, icon: FiXCircle, color: 'bg-red-500' },
    { label: 'Pending', value: analytics.pendingBugs || 0, icon: FiClock, color: 'bg-yellow-500' },
  ]

  return (
    <div className="min-h-screen bg-[#FFFCFB] p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">Analytics & Statistics</h1>
          <p className="text-sm sm:text-base text-[#666]">Track your testing performance and progress</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
                <FiTrendingUp className="text-green-500 text-xl" />
              </div>
              <div className="text-3xl font-bold text-[#171717] mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Success Rate Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-[#171717] mb-4">Success Rate</h2>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#A33C13"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - (analytics.successRate || 0) / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#171717]">{analytics.successRate}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                Your bug reports have a {analytics.successRate}% approval rate
              </p>
              <p className="text-sm text-gray-500">
                {analytics.totalBugs} total reports • {analytics.approvedBugs} approved
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bugs by Severity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#171717] mb-4">Bugs by Severity</h2>
            <div className="space-y-4">
              {Object.entries(analytics.bugsBySeverity || {}).map(([severity, count]) => {
                const total = analytics.totalBugs || 1
                const percentage = ((count as number) / total) * 100
                const colors: Record<string, string> = {
                  Critical: 'bg-red-500',
                  High: 'bg-orange-500',
                  Medium: 'bg-yellow-500',
                  Low: 'bg-green-500'
                }
                return (
                  <div key={severity}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{severity}</span>
                      <span className="text-sm text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${colors[severity]} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bugs by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#171717] mb-4">Bugs by Category</h2>
            <div className="space-y-4">
              {Object.entries(analytics.bugsByCategory || {}).map(([category, count]) => {
                const total = analytics.totalBugs || 1
                const percentage = ((count as number) / total) * 100
                const colors: Record<string, string> = {
                  UI: 'bg-blue-500',
                  Functionality: 'bg-purple-500',
                  Performance: 'bg-indigo-500',
                  Security: 'bg-red-500'
                }
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{category}</span>
                      <span className="text-sm text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${colors[category]} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {analytics.recentActivity && analytics.recentActivity.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#171717] mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {analytics.recentActivity.slice(0, 5).map((bug) => (
                <div key={bug.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#171717] mb-1">{bug.title}</h4>
                    <p className="text-sm text-gray-600">{bug.projectTitle}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      bug.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      bug.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      bug.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {bug.status}
                    </span>
                    {bug.xpAwarded > 0 && (
                      <span className="text-yellow-600 font-semibold text-sm">+{bug.xpAwarded} XP</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AnalyticsPage
