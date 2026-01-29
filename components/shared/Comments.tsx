'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiMessageSquare,
  FiSend,
  FiEdit,
  FiTrash2,
  FiCornerDownRight,
  FiUser,
  FiMoreVertical
} from 'react-icons/fi'
import { CommentResponse, createComment, updateComment, deleteComment } from '@/lib/api/tester/comments'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

interface CommentsProps {
  bugReportId: string
  comments: CommentResponse[]
  onCommentsUpdated: (comments: CommentResponse[]) => void
}

interface CommentItemProps {
  comment: CommentResponse
  onReply: (parentId: string) => void
  onEdit: (comment: CommentResponse) => void
  onDelete: (commentId: string) => void
  isReply?: boolean
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  isReply = false
}) => {
  const [showActions, setShowActions] = useState(false)
  const currentUserEmail = useAuthStore().user?.email
  const isCurrentUser = currentUserEmail === comment.user.split(" ")[0]

  return (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div
        className={`rounded-lg p-4 hover:bg-gray-100 transition-colors ${
          isCurrentUser 
            ? 'bg-blue-50 border border-blue-200 ml-auto max-w-[80%]' 
            : 'bg-gray-50'
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCurrentUser 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-[#F5E6DD] text-[#A33C13]'
            }`}>
              <FiUser className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {isCurrentUser ? 'You' : comment.user.split(" ")[0]}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()} at{' '}
                {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2">
              {!isReply && (
                <button
                  onClick={() => onReply(comment.id)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Reply"
                >
                  <FiCornerDownRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onEdit(comment)}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Edit"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {comment.text}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Comments: React.FC<CommentsProps> = ({
  bugReportId,
  comments,
  onCommentsUpdated
}) => {
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<CommentResponse | null>(null)
  const [editText, setEditText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const refreshComments = async () => {
    // Trigger parent component to refetch the bug report data
    // This will update both bugReport and comments state
    onCommentsUpdated([]) // This will trigger the parent's handleCommentsUpdated
  }


  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a message')
      return
    }

    try {
      setIsSubmitting(true)
      const commentData = {
        bug_report: bugReportId,
        text: newComment.trim(),
        ...(replyTo && { parent: replyTo })
      }

      await createComment(commentData)
      setNewComment('')
      setReplyTo(null)
      toast.success('Comment added successfully!')

      // Refresh comments by triggering parent refetch
      await refreshComments()
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = async () => {
    if (!editText.trim() || !editingComment) return

    try {
      await updateComment(editingComment.id, { text: editText.trim() })
      setEditingComment(null)
      setEditText('')
      toast.success('Comment updated successfully!')

      // Refresh comments by triggering parent refetch
      await refreshComments()
    } catch (error) {
      console.error('Error updating comment:', error)
      toast.error('Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      await deleteComment(commentId)
      toast.success('Comment deleted successfully!')

      // Refresh comments by triggering parent refetch
      await refreshComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  const handleReply = (parentId: string) => {
    setReplyTo(parentId)
    // Focus on the input
    setTimeout(() => {
      const textarea = document.getElementById('comment-input')
      textarea?.focus()
    }, 100)
  }

  const handleEdit = (comment: CommentResponse) => {
    setEditingComment(comment)
    setEditText(comment.text)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4 mb-6">
          {comments
            .filter(comment => !comment.parent) // Only show top-level comments
            .map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDeleteComment}
              />
            ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-8 text-gray-400 mb-6'>
          <FiMessageSquare size={32} className="mb-2 opacity-50" />
          <p className="text-sm">No messages yet</p>
          <p className="text-xs text-gray-500 mt-1">Start the conversation!</p>
        </div>
      )}

      {/* Reply indicator */}
      {replyTo && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700 text-sm">
            <FiCornerDownRight className="w-4 h-4" />
            <span>Replying to comment</span>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Edit mode */}
      {editingComment && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700 text-sm mb-3">
            <FiEdit className="w-4 h-4" />
            <span>Editing comment</span>
          </div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Edit your comment..."
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEditComment}
              disabled={!editText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditingComment(null)
                setEditText('')
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* New Comment Input */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F5E6DD] flex items-center justify-center text-[#A33C13] flex-shrink-0 mt-1">
            <FiUser className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <textarea
              id="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A33C13] focus:border-transparent resize-none"
              rows={3}
              placeholder={replyTo ? "Write a reply..." : "Write a message..."}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">
                {replyTo ? 'Replying to comment' : 'Add a new message'}
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-[#A33C13] text-white rounded-lg hover:bg-[#8a2f0f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Send
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comments