'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ProjectCardProps {
  title: string
  description: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  participants: number
  bugs: number
  image?: string
  onView?: () => void
  className?: string
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  category,
  difficulty,
  participants,
  bugs,
  image = '/window.svg',
  onView,
  className = ''
}) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy':
        return 'bg-green-400/10 text-green-600 ring-green-400/20'
      case 'Medium':
        return 'bg-yellow-400/10 text-yellow-600 ring-yellow-400/20'
      case 'Hard':
        return 'bg-red-400/10 text-red-600 ring-red-400/20'
      default:
        return 'bg-gray-400/10 text-gray-600 ring-gray-400/20'
    }
  }

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 ${className} w-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Section */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <motion.div
          className="w-full h-full relative"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category and Difficulty */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{category}</span>

          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-xs mb-4 line-clamp-2">
          {description}
        </p>

        {/* Stats and View Button */}
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center space-x-4">
            {/* Participants */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-sm font-medium text-gray-600">{participants}</span>
            </div>

            {/* Bugs Found */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-600">{bugs}</span>
            </div>
          </div>

          {/* View Button */}
          <motion.button
            onClick={onView}
            className="flex items-center gap-1 text-[#171717] font-medium hover:text-[#A33C13] transition-colors group"
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">View</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
