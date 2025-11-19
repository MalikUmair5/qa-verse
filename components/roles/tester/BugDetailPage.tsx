'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import Loader from '@/components/ui/loader'
import Image from 'next/image'
import type { BugReport } from '@/lib/types'

function BugDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [bug, setBug] = useState<BugReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchBugDetails()
    }
  }, [params.id])

  const fetchBugDetails = async () => {
    setIsLoading(true)
    try {
      const response = await api.bugs.getById(params.id as string)
      if (response.success && response.data) {
        setBug(response.data as BugReport)
      }
    } catch (err) {
      console.error('Failed to fetch bug details:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim() || !user || !bug) return

    setSubmittingComment(true)
    try {
      const response = await api.bugs.addComment(bug.id, {
        userId: user.id,
        userName: user.name,
        userRole: user.role as 'tester' | 'maintainer',
        comment: comment.trim()
      })

      if (response.success) {
        setComment('')
        await fetchBugDetails() // Refresh to show new comment
      }
    } catch (err) {
      console.error('Failed to add comment:', err)
    } finally {
      setSubmittingComment(false)
    }
  }

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
  if (!bug) return <div className="p-8 text-center">Bug report not found</div>

  return (
    <div className="min-h-screen bg-[#FFFCFB] p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-[#A33C13] hover:text-[#8B3410] font-semibold flex items-center gap-2"
        >
          ← Back to Bug Reports
        </button>

        {/* Bug Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(bug.severity)}`}>
                  {bug.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(bug.status)}`}>
                  {bug.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                  {bug.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">{bug.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>Project: <span className="font-semibold">{bug.projectTitle}</span></span>
                <span>Reported: {new Date(bug.createdDate).toLocaleDateString()}</span>
                {bug.xpAwarded > 0 && (
                  <span className="text-yellow-600 font-bold">+{bug.xpAwarded} XP Earned</span>
                )}
              </div>
            </div>
          </div>

          {bug.status === 'Rejected' && bug.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-red-800 mb-2">Rejection Reason:</h3>
              <p className="text-red-700">{bug.rejectionReason}</p>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#171717] mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{bug.description}</p>
          </div>

          {/* Steps to Reproduce */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#171717] mb-2">Steps to Reproduce</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {bug.stepsToReproduce.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Expected vs Actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Expected Behavior</h3>
              <p className="text-green-700">{bug.expectedBehavior}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Actual Behavior</h3>
              <p className="text-red-700">{bug.actualBehavior}</p>
            </div>
          </div>

          {/* Attachments */}
          {bug.attachments && bug.attachments.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#171717] mb-3">Attachments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bug.attachments.map((attachment, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    {attachment.type === 'image' ? (
                      <div className="relative h-48 bg-gray-100">
                        <Image
                          src={attachment.url}
                          alt={attachment.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500">{attachment.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#171717] mb-4">Comments ({bug.comments.length})</h2>

          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {bug.comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-[#A33C13] pl-4 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-[#171717]">{comment.userName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    comment.userRole === 'maintainer' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {comment.userRole}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div>
            <h3 className="font-semibold text-[#171717] mb-2">Add a Comment</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] mb-3"
              rows={4}
            />
            <button
              onClick={handleAddComment}
              disabled={submittingComment || !comment.trim()}
              className="px-6 py-2 bg-[#A33C13] text-white rounded-lg hover:bg-[#8B3410] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default BugDetailPage
