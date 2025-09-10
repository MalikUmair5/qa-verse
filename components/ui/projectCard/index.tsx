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
      className={`bg-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${className} w-[300px] h-[450px]`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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
      <div className="p-6">
        {/* Category and Difficulty */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center rounded-2xl bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">{category}</span>

          <span className={`inline-flex items-center rounded-2xl px-2 py-1 text-xs font-medium ring-1 ring-inset ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        {/* Title */}
        <motion.h3
          className="text-xl font-bold text-foreground mb-3 line-clamp-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-muted text-sm mb-4 line-clamp-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {description}
        </motion.p>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

          {/* Stats */}
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              {/* Participants */}
              <div className="flex items-center space-x-1">
                <motion.span
                  className="text-lg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  👥
                </motion.span>
                <span className="text-sm font-medium text-foreground">{participants}</span>
              </div>

              {/* Bugs Found */}
              <div className="flex items-center space-x-1">
                <motion.span
                  className="text-lg"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                >
                  🐛
                </motion.span>
                <span className="text-sm font-medium text-foreground">{bugs}</span>
              </div>
            </div>
          </motion.div>

          {/* View Button */}
          <motion.button
            onClick={onView}
            className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 flex items-center justify-center space-x-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <span>View</span>
            <motion.span
              className="text-lg group-hover:translate-x-1 transition-transform duration-200"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 3 }}
            >
              →
            </motion.span>
          </motion.button>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default ProjectCard
