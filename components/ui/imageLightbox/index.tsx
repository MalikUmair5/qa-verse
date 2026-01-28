'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { 
  FiX, 
  FiDownload, 
  FiZoomIn,
  FiZoomOut
} from 'react-icons/fi'

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageName: string
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageName
}) => {
  const [isZoomed, setIsZoomed] = React.useState(false)

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scrolling when lightbox is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = imageName || 'image'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="bg-black/70 rounded-lg px-3 py-2">
            <p className="text-white text-sm font-medium truncate max-w-[300px]">
              {imageName || 'Image'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 bg-black/70 rounded-lg text-white hover:bg-black/80 transition-colors"
              title={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              {isZoomed ? <FiZoomOut className="w-5 h-5" /> : <FiZoomIn className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 bg-black/70 rounded-lg text-white hover:bg-black/80 transition-colors"
              title="Download image"
            >
              <FiDownload className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 bg-black/70 rounded-lg text-white hover:bg-black/80 transition-colors"
              title="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div 
          className={`transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
          style={{ transformOrigin: 'center' }}
        >
          <img
            src={imageUrl}
            alt={imageName || 'Image'}
            className="max-w-full max-h-[90vh] object-contain cursor-pointer"
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default ImageLightbox