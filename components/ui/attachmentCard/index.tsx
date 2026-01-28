'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiFile, 
  FiImage, 
  FiDownload, 
  FiExternalLink,
  FiX,
  FiEdit
} from 'react-icons/fi'
import ImageLightbox from '../imageLightbox'

interface AttachmentProps {
  url: string
  fileName: string
  onRemove?: () => void
  showRemove?: boolean
  size?: 'sm' | 'md' | 'lg'
  onEdit?: () => void
  showEdit?: boolean
}

const AttachmentCard: React.FC<AttachmentProps> = ({
  url,
  fileName,
  onRemove,
  showRemove = false,
  size = 'md',
  onEdit,
  showEdit = false
}) => {
  // Handle invalid props gracefully
  if (!url || typeof url !== 'string') {
    return null
  }

  const [showLightbox, setShowLightbox] = useState(false)

  // Debug log to help troubleshoot
  useEffect(() => {
    console.log('AttachmentCard:', { url, fileName, isImage: isImage() })
  }, [url, fileName])
  const getFileIcon = () => {
    if (!fileName || typeof fileName !== 'string') {
      return <FiFile className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-blue-500`} />
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return <FiImage className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-green-500`} />
    }
    return <FiFile className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-blue-500`} />
  }

  const isImage = () => {
    if (!fileName && !url) {
      return false
    }
    
    // Check file extension from filename
    if (fileName && typeof fileName === 'string') {
      const extension = fileName.split('.').pop()?.toLowerCase()
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
        return true
      }
    }
    
    // Check URL patterns for Cloudinary and other image services
    if (url && typeof url === 'string') {
      // Cloudinary image URLs
      if (url.includes('cloudinary.com') && (url.includes('/image/') || url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i))) {
        return true
      }
      
      // Other image URL patterns
      if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|#|$)/i)) {
        return true
      }
    }
    
    return false
  }

  const openFile = () => {
    if (isImage()) {
      setShowLightbox(true)
    } else {
      window.open(url, '_blank')
    }
  }

  const downloadFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!url) return
    
    const link = document.createElement('a')
    link.href = url
    link.download = fileName || 'attachment'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        relative group cursor-pointer hover:shadow-lg transition-all duration-200
        ${isImage() 
          ? 'bg-white border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600'
        }
        ${sizeClasses[size]}
      `}
      onClick={openFile}
    >
      {/* Full Image Preview */}
      {isImage() && url ? (
        <div className="w-full">
          <div className={`${size === 'sm' ? 'h-24' : size === 'lg' ? 'h-48' : 'h-40'} w-full overflow-hidden rounded-md mb-3 bg-gray-100`}>
            <img 
              src={url} 
              alt={fileName || 'Attachment'}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                    </div>
                  `;
                }
              }}
            />
          </div>
          
          {/* Image info overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1 bg-black/70 rounded-md px-2 py-1">
              {showEdit && onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                  className="p-1 rounded-md hover:bg-blue-500/20 text-blue-400 hover:text-blue-300"
                  title="Edit attachment"
                >
                  <FiEdit className="w-3 h-3" />
                </button>
              )}
              
              {showRemove && onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                  }}
                  className="p-1 rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300"
                  title="Remove attachment"
                >
                  <FiX className="w-3 h-3" />
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openFile()
                }}
                className="p-1 rounded-md hover:bg-white/20 text-white"
                title="View full size"
              >
                <FiExternalLink className="w-3 h-3" />
              </button>
              
              <button
                onClick={downloadFile}
                className="p-1 rounded-md hover:bg-white/20 text-white"
                title="Download"
              >
                <FiDownload className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* File name at bottom */}
          <div className="px-1">
            <p className={`${textSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300 truncate text-center`}>
              {fileName || 'Attachment'}
            </p>
          </div>
        </div>
      ) : (
        // Non-image files - keep card format
        <div className="flex items-center space-x-2">
          {getFileIcon()}
          <div className="flex-1 min-w-0">
            <p className={`${textSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300 truncate`}>
              {fileName || 'Attachment'}
            </p>
          </div>
          
          {/* Action buttons for non-images */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {showEdit && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className="p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-500 hover:text-blue-700"
                title="Edit attachment"
              >
                <FiEdit className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                openFile()
              }}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              title="Open file"
            >
              <FiExternalLink className="w-4 h-4" />
            </button>
            
            <button
              onClick={downloadFile}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              title="Download file"
            >
              <FiDownload className="w-4 h-4" />
            </button>

            {showRemove && onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
                className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:text-red-700"
                title="Remove attachment"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Image Lightbox */}
      {isImage() && (
        <ImageLightbox
          isOpen={showLightbox}
          onClose={() => setShowLightbox(false)}
          imageUrl={url}
          imageName={fileName || 'Attachment'}
        />
      )}
    </motion.div>
  )
}

interface AttachmentListProps {
  attachments: Array<{
    url: string
    fileName: string
  }>
  onRemove?: (index: number) => void
  showRemove?: boolean
  onEdit?: (index: number) => void
  showEdit?: boolean
  size?: 'sm' | 'md' | 'lg'
  maxDisplay?: number
}

export const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments = [], // Provide default empty array
  onRemove,
  showRemove = false,
  onEdit,
  showEdit = false,
  size = 'md',
  maxDisplay
}) => {
  // Filter out invalid attachments
  const validAttachments = attachments.filter(att => att && att.url)
  const displayAttachments = maxDisplay ? validAttachments.slice(0, maxDisplay) : validAttachments
  const remainingCount = maxDisplay && validAttachments.length > maxDisplay 
    ? validAttachments.length - maxDisplay 
    : 0

  if (validAttachments.length === 0) {
    return null
  }

  return (
    <div>
      <div className={`grid gap-3 ${
        size === 'sm' 
          ? 'grid-cols-2 sm:grid-cols-3' 
          : size === 'lg'
          ? 'grid-cols-1 sm:grid-cols-2' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {displayAttachments.map((attachment, index) => (
          <AttachmentCard
            key={`${attachment.url}-${index}`}
            url={attachment.url}
            fileName={attachment.fileName}
            onRemove={onRemove ? () => onRemove(index) : undefined}
            showRemove={showRemove}
            onEdit={onEdit ? () => onEdit(index) : undefined}
            showEdit={showEdit}
            size={size}
          />
        ))}
      </div>
      
      {remainingCount > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          +{remainingCount} more attachment{remainingCount === 1 ? '' : 's'}
        </p>
      )}
    </div>
  )
}

export default AttachmentCard