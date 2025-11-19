'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useBugs } from '@/hooks/useBugs'
import { useAuth } from '@/hooks/useAuth'
import Loader from '@/components/ui/loader'
import { FiFilter, FiSearch } from 'react-icons/fi'

function MyBugReportsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { bugs, isLoading, error } = useBugs({
    testerId: user?.id,
    status: statusFilter,
    severity: severityFilter,
  })

  const filteredBugs = bugs.filter(bug =>
    bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bug.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      case 'Resolved': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500 text-white'
      case 'High': return 'bg-orange-500 text-white'
      case 'Medium': return 'bg-yellow-500 text-white'
      case 'Low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
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
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">My Bug Reports</h1>
          <p className="text-sm sm:text-base text-[#666]">Track and manage all your submitted bug reports</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bug reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13]"
            >
              <option value="all">All Severity</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Bug Reports List */}
        {filteredBugs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No bug reports found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBugs.map((bug, index) => (
              <motion.div
                key={bug.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/tester/my-bug-reports/${bug.id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(bug.severity)}`}>
                        {bug.severity}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(bug.status)}`}>
                        {bug.status}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[#171717] mb-2">{bug.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{bug.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span>Project: {bug.projectTitle}</span>
                      <span>Category: {bug.category}</span>
                      <span>Reported: {new Date(bug.createdDate).toLocaleDateString()}</span>
                      {bug.xpAwarded > 0 && (
                        <span className="text-yellow-600 font-semibold">+{bug.xpAwarded} XP</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="text-[#A33C13] hover:text-[#8B3410] font-semibold text-sm">
                      View Details →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Reports', value: bugs.length, color: 'bg-blue-500' },
            { label: 'Approved', value: bugs.filter(b => b.status === 'Approved').length, color: 'bg-green-500' },
            { label: 'Pending', value: bugs.filter(b => b.status === 'Pending').length, color: 'bg-yellow-500' },
            { label: 'Resolved', value: bugs.filter(b => b.status === 'Resolved').length, color: 'bg-purple-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-4 text-center"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl`}>
                {stat.value}
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default MyBugReportsPage
