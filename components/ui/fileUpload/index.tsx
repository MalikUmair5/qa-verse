'use client'
import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  FiUpload, 
  FiX, 
  FiFile, 
  FiImage,
  FiPaperclip,
  FiLoader
} from 'react-icons/fi'
import { uploadToCloudinary } from '@/lib/utils/cloudinary'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onFileUpload: (url: string, fileName: string) => void
  acceptedTypes?: string[]
  maxSizeMB?: number
  multiple?: boolean
  disabled?: boolean
  className?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  acceptedTypes = ['image/*', 'application/pdf', '.txt', '.doc', '.docx'],
  maxSizeMB = 10,
  multiple = false,
  disabled = false,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0] // For now, handle single file upload
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    try {
      setIsUploading(true)
      toast.loading('Uploading file...', { id: 'file-upload' })
      
      const uploadedUrl = await uploadToCloudinary(file)
      
      toast.success('File uploaded successfully!', { id: 'file-upload' })
      onFileUpload(uploadedUrl, file.name)
    } catch (error) {
      console.error('Upload error:', error)
      
      // Show specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Upload preset not found') || error.message.includes('preset')) {
          toast.error(
            'Upload configuration missing. Please check Cloudinary setup.', 
            { 
              id: 'file-upload',
              duration: 6000 
            }
          )
        } else {
          toast.error(error.message, { id: 'file-upload' })
        }
      } else {
        toast.error('Failed to upload file', { id: 'file-upload' })
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled || isUploading) return
    
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const openFileDialog = () => {
    if (disabled || isUploading) return
    fileInputRef.current?.click()
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <FiImage className="w-4 h-4" />
    }
    return <FiFile className="w-4 h-4" />
  }

  return (
    <>
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200 
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled || isUploading 
            ? 'cursor-not-allowed opacity-50' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
          ${className}
        `}
        onClick={openFileDialog}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: disabled || isUploading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isUploading ? 1 : 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          disabled={disabled || isUploading}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        <div className="flex flex-col items-center space-y-2">
          {isUploading ? (
            <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <FiUpload className="w-8 h-8 text-gray-400" />
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Max size: {maxSizeMB}MB
            </p>
          </div>
        </div>
        
        {dragActive && (
          <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none" />
        )}
      </motion.div>
    </>
  )
}

export default FileUpload