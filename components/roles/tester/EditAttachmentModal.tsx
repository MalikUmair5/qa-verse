'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiX, 
  FiEdit,
  FiSave,
  FiUpload
} from 'react-icons/fi'
import { updateAttachment, AttachmentResponse } from '@/lib/api/tester/bugReport'
import FileUpload from '@/components/ui/fileUpload'
import toast from 'react-hot-toast'

interface EditAttachmentModalProps {
  isOpen: boolean
  onClose: () => void
  attachment: AttachmentResponse
  bugReportId: string
  onAttachmentUpdated: (attachment: AttachmentResponse) => void
}

const EditAttachmentModal: React.FC<EditAttachmentModalProps> = ({
  isOpen,
  onClose,
  attachment,
  bugReportId,
  onAttachmentUpdated
}) => {
  const [fileName, setFileName] = useState(attachment.file_name || '')
  const [fileUrl, setFileUrl] = useState(attachment.file_url || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (url: string, uploadedFileName: string) => {
    setFileUrl(url)
    if (!fileName.trim()) {
      setFileName(uploadedFileName)
    }
    toast.success('File uploaded successfully!')
  }
  const handleUpdate = async () => {
    if (!fileName.trim()) {
      toast.error('File name is required')
      return
    }

    if (!fileUrl.trim()) {
      toast.error('File URL is required')
      return
    }

    try {
      setIsUpdating(true)
      toast.loading('Updating attachment...', { id: 'update-attachment' })
      
      const updatedAttachment = await updateAttachment(attachment.id, {
        bug_report: bugReportId,
        file_url: fileUrl.trim(),
        file_name: fileName.trim()
      })
      
      toast.success('Attachment updated successfully!', { id: 'update-attachment' })
      onAttachmentUpdated(updatedAttachment)
      onClose()
    } catch (error) {
      console.error('Error updating attachment:', error)
      toast.error('Failed to update attachment', { id: 'update-attachment' })
    } finally {
      setIsUpdating(false)
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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiEdit className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Edit Attachment
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* File Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter file name"
              disabled={isUpdating}
            />
          </div>

          {/* File Upload or URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload New File (optional)
            </label>
            <FileUpload
              onFileUpload={handleFileUpload}
              disabled={isUpdating || isUploading}
              acceptedTypes={['image/*', 'application/pdf', '.txt', '.doc', '.docx', '.json', '.log']}
              maxSizeMB={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a new file to replace the current one, or keep the existing file
            </p>
          </div>

          {/* Current File URL (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current File URL
            </label>
            <input
              type="url"
              value={fileUrl}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm"
            />
          </div>

          {/* Preview */}
          {fileUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50">
                {fileUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|#|$)/i) ? (
                  <img 
                    src={fileUrl} 
                    alt={fileName || 'Preview'}
                    className="max-w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    File preview not available
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isUpdating || isUploading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating || isUploading || !fileName.trim() || !fileUrl.trim()}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : isUploading ? (
              <>
                <FiUpload className="w-4 h-4" />
                Uploading...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                Update Attachment
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default EditAttachmentModal