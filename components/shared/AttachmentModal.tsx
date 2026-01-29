'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiX, 
  FiUpload, 
  FiPaperclip 
} from 'react-icons/fi'
import FileUpload from '@/components/ui/fileUpload'
import { AttachmentList } from '@/components/ui/attachmentCard'
import { addAttachmentToBugReport, AttachmentResponse, removeAttachmentFromBugReport } from '@/lib/api/tester/bugReport'
import toast from 'react-hot-toast'
import EditAttachmentModal from '../roles/tester/EditAttachmentModal'

interface AttachmentModalProps {
  isOpen: boolean
  onClose: () => void
  bugReportId: string
  existingAttachments?: AttachmentResponse[]
  onAttachmentAdded: (attachment: AttachmentResponse) => void
  onAttachmentRemoved?: (attachmentId: string) => void
  onAttachmentUpdated?: (attachment: AttachmentResponse) => void
}

const AttachmentModal: React.FC<AttachmentModalProps> = ({
  isOpen,
  onClose,
  bugReportId,
  existingAttachments = [],
  onAttachmentAdded,
  onAttachmentRemoved,
  onAttachmentUpdated
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [editingAttachment, setEditingAttachment] = useState<AttachmentResponse | null>(null)

  const handleFileUpload = async (url: string, fileName: string) => {
    try {
      setIsUploading(true)
      toast.loading('Adding attachment...', { id: 'add-attachment' })
      
      const attachmentResponse = await addAttachmentToBugReport(bugReportId, {
        file_url: url,
        file_name: fileName
      })
      
      toast.success('Attachment added successfully!', { id: 'add-attachment' })
      onAttachmentAdded(attachmentResponse)
      onClose()
    } catch (error) {
      console.error('Error adding attachment:', error)
      toast.error('Failed to add attachment', { id: 'add-attachment' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleEditAttachment = (index: number) => {
    const attachment = existingAttachments[index]
    if (attachment) {
      setEditingAttachment(attachment)
    }
  }

  const handleAttachmentUpdated = (updatedAttachment: AttachmentResponse) => {
    if (onAttachmentUpdated) {
      onAttachmentUpdated(updatedAttachment)
    }
    setEditingAttachment(null)
  }

  const handleRemoveAttachment = async (index: number) => {
    const attachment = existingAttachments[index]
    if (!attachment || !onAttachmentRemoved) return

    try {
      toast.loading('Removing attachment...', { id: 'remove-attachment' })
      
      await removeAttachmentFromBugReport(attachment.id)
      
      toast.success('Attachment removed successfully!', { id: 'remove-attachment' })
      onAttachmentRemoved(attachment.id)
    } catch (error) {
      console.error('Error removing attachment:', error)
      toast.error('Failed to remove attachment', { id: 'remove-attachment' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiPaperclip className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Manage Attachments
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Existing Attachments */}
          {existingAttachments.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Attachments ({existingAttachments.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Click images to view • Use ✏️ to edit • Use ✕ to remove
                </p>
              </div>
              <AttachmentList
                attachments={existingAttachments.map((att, index) => ({
                  url: att.file_url,
                  fileName: att.file_name || `Attachment ${index + 1}`
                }))}
                size="md"
                showRemove={!!onAttachmentRemoved}
                onRemove={handleRemoveAttachment}
                showEdit={true}
                onEdit={handleEditAttachment}
              />
            </div>
          )}

          {/* Upload Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Upload New File
            </h3>
            <FileUpload
              onFileUpload={handleFileUpload}
              disabled={isUploading}
              acceptedTypes={['image/*', 'application/pdf', '.txt', '.doc', '.docx', '.json', '.log']}
              maxSizeMB={10}
            />
          </div>

          {/* Help Text */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Supported files:</strong> Images, PDFs, Documents, Logs (max 10MB)
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              <strong>Management:</strong> Click images to view full size • Use ✕ button to remove attachments
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </motion.div>

      {/* Edit Attachment Modal */}
      {editingAttachment && (
        <EditAttachmentModal
          isOpen={!!editingAttachment}
          onClose={() => setEditingAttachment(null)}
          attachment={editingAttachment}
          bugReportId={bugReportId}
          onAttachmentUpdated={handleAttachmentUpdated}
        />
      )}
    </div>
  )
}

export default AttachmentModal