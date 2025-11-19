"use client"
import ProjectCard from '@/components/ui/projectCard'
import ActivityFeed from './ActivityFeed'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi'
import { MdBugReport } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/loader'
import { useProjects } from '@/hooks/useProjects'
import { useAuth } from '@/hooks/useAuth'

function Dashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const { projects, isLoading, error } = useProjects({
    category: selectedCategory,
    difficulty: selectedDifficulty,
    search: searchQuery,
  })

  const handleViewProject = (projectId: string) => {
    router.push(`/tester/project-details/${projectId}?from=dashboard`)
  }

  // Show loader while loading
  if (isLoading) {
    return <Loader />
  }

  // Calculate stats from user data
  const testerStats = user?.role === 'tester' ? user.stats as { totalBugs: number; approvedBugs: number; projectsTested: number; successRate: number } : null
  const stats = {
    totalBugs: testerStats?.totalBugs || 0,
    approvedBugs: testerStats?.approvedBugs || 0,
    projectsTested: testerStats?.projectsTested || 0,
    successRate: testerStats?.successRate || 0,
  }

  return (
    <div className='flex-1 bg-[#FFFCFB] min-h-screen'>
      <div className='p-4 sm:p-6 md:p-8'>
        {/* Welcome Header */}
        <div className='mb-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-[#171717] mb-2'>
            Welcome back, {user?.name || 'Tester'}! 👋
          </h1>
          <p className='text-sm sm:text-base text-[#666]'>
            Here&apos;s your testing dashboard overview
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='bg-white rounded-lg shadow-md p-6 border-l-4 border-[#A33C13]'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm mb-1'>Total Bugs</p>
                <p className='text-2xl font-bold text-[#171717]'>{stats.totalBugs}</p>
              </div>
              <MdBugReport className='text-[#A33C13] text-3xl' />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm mb-1'>Approved Bugs</p>
                <p className='text-2xl font-bold text-[#171717]'>{stats.approvedBugs}</p>
              </div>
              <FiCheckCircle className='text-green-500 text-3xl' />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm mb-1'>Projects Tested</p>
                <p className='text-2xl font-bold text-[#171717]'>{stats.projectsTested}</p>
              </div>
              <FiAlertCircle className='text-blue-500 text-3xl' />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm mb-1'>Success Rate</p>
                <p className='text-2xl font-bold text-[#171717]'>{stats.successRate}%</p>
              </div>
              <FiTrendingUp className='text-purple-500 text-3xl' />
            </div>
          </motion.div>
        </div>

        {/* Projects Discovery Section Header */}
        <div className='mb-4'>
          <h2 className='text-xl sm:text-2xl font-bold text-[#171717] mb-2'>Discover Projects</h2>
          <p className='text-sm sm:text-base text-[#666]'>Find the next exciting project to test and contribute to.</p>
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
              <option value='all'>All Categories</option>
              <option value='Web'>Web</option>
              <option value='Mobile'>Mobile</option>
              <option value='Desktop'>Desktop</option>
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
              <option value='Easy'>Easy</option>
              <option value='Medium'>Medium</option>
              <option value='Hard'>Hard</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
            {error}
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Projects Grid - 3 columns */}
          {projects.length === 0 ? (
            <div className='lg:col-span-3 text-center py-12'>
              <p className='text-gray-500 text-lg'>No projects found</p>
            </div>
          ) : (
            <div className='lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
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
                    bugs={project.bugsFound}
                    image={project.image}
                    onView={() => handleViewProject(project.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Activity Feed Sidebar - 1 column */}
          <div className='lg:col-span-1'>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard