'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/loader'

interface ProjectDetailPageProps {
  projectId: string
}

function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // 1 second loading time

    return () => clearTimeout(timer)
  }, [projectId])

  // Mock data - in a real app, you'd fetch this based on projectId
  const project = {
    id: projectId,
    title: 'QunatumLeap CRM',
    description: 'Project Pilot connects student testes with new software projects,Help Developers, build your skills and climb the leaderboard sn bands nba nbd ba bd abd bsa snbsa ndab daaasd a d dnb dnba sa nd ad asnd an na dna ndasn dna dnsa dna dn sab ba asdabsjdbaahdaj abjsd.',
    category: 'Functionality',
    difficulty: 'Hard' as const,
    bugsReported: 28,
    activeTesters: 42,
    maintainedBy: 'Dev Team Alpha',
    instructions: [
      'Clone the repo.',
      'Run `npm install`.',
      'Run `npm run dev`.',
      'Access at localhost:3000.'
    ],
    testingFocusAreas: ['Sales Funnel', 'Sales Funnel', 'Sales Funnel'],
    techStack: ['Python', 'Django', 'JSX'],
    userXp: '2,200 XP',
    userAvatar: '/next.svg'
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy':
        return 'bg-green-500'
      case 'Medium':
        return 'bg-yellow-500'
      case 'Hard':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Show loader while loading
  if (isLoading) {
    return <Loader />
  }

  return (
    <div className='min-h-screen bg-[#FFFCFB]'>

      <div className='p-6 max-w-7xl mx-auto'>
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-[#171717] mb-6 hover:text-[#A33C13] transition-colors'
          whileHover={{ x: -5 }}
        >
          <FiArrowLeft size={20} />
          <span className='font-medium'>Back</span>
        </motion.button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2'>
            {/* Title and Badges */}
            <div className='mb-6'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='px-3 py-1 bg-[#F5E6DD] text-[#171717] rounded-full text-sm font-medium'>
                  {project.category}
                </span>
                <span className={`px-3 py-1 ${getDifficultyColor(project.difficulty)} text-white rounded-full text-sm font-medium`}>
                  {project.difficulty}
                </span>
              </div>

              <h1 className='text-4xl font-bold text-[#171717] mb-4'>
                {project.title}
              </h1>

              <p className='text-[#171717] text-lg leading-relaxed'>
                {project.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 mb-8'>
              <motion.button
                className='px-6 py-3 bg-[#A33C13] text-white rounded-lg font-medium hover:bg-[#8a2f0f] transition-colors flex items-center gap-2'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Report Bug
              </motion.button>
              <motion.button
                className='px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors flex items-center gap-2'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>⏱️</span>
                Start Testing
              </motion.button>
              <motion.button
                className='px-6 py-3 border-2 border-[#171717] text-[#171717] rounded-lg font-medium hover:bg-[#171717] hover:text-white transition-colors flex items-center gap-2'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>↗</span>
                Github
              </motion.button>
            </div>

            {/* Instructions Section */}
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>📋</span>
                Instructions
              </h2>
              <div className='bg-[#F5F5F5] rounded-lg p-6'>
                <ol className='space-y-3'>
                  {project.instructions.map((instruction, index) => (
                    <li key={index} className='text-[#171717] flex gap-3'>
                      <span className='font-semibold'>{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Testing Focus Areas */}
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>🎯</span>
                Testing Focus Areas
              </h2>
              <div className='flex flex-wrap gap-3'>
                {project.testingFocusAreas.map((area, index) => (
                  <span
                    key={index}
                    className='px-4 py-2 bg-[#F5E6DD] text-[#171717] rounded-lg font-medium'
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>💻</span>
                Tech Stack
              </h2>
              <div className='flex flex-wrap gap-3'>
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className='px-4 py-2 bg-[#F5E6DD] text-[#171717] rounded-lg font-medium'
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Project Stats & Info */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-md p-6 sticky top-24'>
              <h3 className='text-xl font-bold text-[#171717] mb-6'>
                Maintained By
              </h3>
              <p className='text-[#A33C13] font-medium mb-6'>
                {project.maintainedBy}
              </p>

              <h3 className='text-xl font-bold text-[#171717] mb-4 flex items-center gap-2'>
                <span>📊</span>
                Project Stats
              </h3>

              <div className='space-y-4'>
                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xl'>🐛</span>
                    <span className='text-[#171717] font-medium'>Bugs Reported</span>
                  </div>
                  <span className='font-bold text-[#171717]'>{project.bugsReported}</span>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#F5F5F5] rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xl'>👥</span>
                    <span className='text-[#171717] font-medium'>Active Testers</span>
                  </div>
                  <span className='font-bold text-[#171717]'>{project.activeTesters}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
