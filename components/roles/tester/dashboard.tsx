"use client"
import ProjectCard from '@/components/ui/projectCard'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/loader'

function Dashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const projects = [
    {
      id: '1',
      title: 'QuantumLeap CRM',
      description: 'A next-generation CRM for optimizing sales pipelines and...',
      category: 'Functionality',
      difficulty: 'Medium' as const,
      participants: 12,
      bugs: 12,
      image: '/window.svg'
    },
    {
      id: '2',
      title: 'QuantumLeap CRM',
      description: 'A next-generation CRM for optimizing sales pipelines and...',
      category: 'Functionality',
      difficulty: 'Easy' as const,
      participants: 12,
      bugs: 12,
      image: '/window.svg'
    },
    {
      id: '3',
      title: 'QuantumLeap CRM',
      description: 'A next-generation CRM for optimizing sales pipelines and...',
      category: 'Functionality',
      difficulty: 'Hard' as const,
      participants: 12,
      bugs: 12,
      image: '/window.svg'
    },
    {
      id: '4',
      title: 'QuantumLeap CRM',
      description: 'A next-generation CRM for optimizing sales pipelines and...',
      category: 'Functionality',
      difficulty: 'Medium' as const,
      participants: 12,
      bugs: 12,
      image: '/window.svg'
    },
  ]

  const handleViewProject = (projectId: string) => {
    router.push(`/tester/project-details/${projectId}?from=dashboard`)
  }

  // Show loader while loading
  if (isLoading) {
    return <Loader />
  }

  return (
    <div className='flex-1 bg-[#FFFCFB] min-h-screen'>
      <div className='p-4 sm:p-6 md:p-8'>
        {/* Header Section */}
        <div className='mb-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-[#171717] mb-2'>Explore Project</h1>
          <p className='text-sm sm:text-base text-[#171717]'>Find the next exciting project to test and contribute to.</p>
        </div>

        {/* Search and Filters */}
        <div className='grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mb-6'>
          {/* Search Bar */}
          <div className='md:col-span-6 relative'>
            <FiSearch className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#9C9AA5] text-lg sm:text-xl' />
            <input
              type='text'
              placeholder='Search for projects'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-[#A33C13] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] focus:border-transparent text-[#171717] text-sm sm:text-base'
            />
          </div>

          {/* Filter by Category */}
          <div className='md:col-span-3'>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-[#171717] bg-white cursor-pointer hover:border-[#A33C13] transition-colors text-sm sm:text-base'
            >
              <option value='all'>Filter by Category</option>
              <option value='functionality'>Functionality</option>
              <option value='ui'>UI/UX</option>
              <option value='performance'>Performance</option>
              <option value='security'>Security</option>
            </select>
          </div>

          {/* Filter by Difficulty */}
          <div className='md:col-span-3'>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className='w-full px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A33C13] text-[#171717] bg-white cursor-pointer hover:border-[#A33C13] transition-colors text-sm sm:text-base'
            >
              <option value='all'>Filter by Difficulty</option>
              <option value='easy'>Easy</option>
              <option value='medium'>Medium</option>
              <option value='hard'>Hard</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                category={project.category}
                difficulty={project.difficulty}
                participants={project.participants}
                bugs={project.bugs}
                image={project.image}
                onView={() => handleViewProject(project.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard