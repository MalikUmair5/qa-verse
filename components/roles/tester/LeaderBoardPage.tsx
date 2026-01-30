'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Loader from '@/components/ui/loader'
import { getLeaderboard, type LeaderboardEntry } from '@/lib/api/tester/leaderboard'

interface TopTesterProps {
  name: string
  rank: number
  xp: number
  image?: string
  bgColor: string
}

interface TesterRowProps {
  rank: number
  name: string
  username: string
  xp: number
  image?: string
}

const TopTesterCard: React.FC<TopTesterProps> = ({ name, rank, xp, image, bgColor }) => {
  const getCardHeight = () => {
    if (rank === 1) return 'md:h-72'
    if (rank === 2) return 'md:h-64'
    return 'md:h-60'
  }

  return (
    <motion.div
      className={`${bgColor} rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg ${getCardHeight()} 
        flex md:flex-col items-center md:justify-center relative
        ${rank === 1 ? 'order-1 md:order-2' : rank === 2 ? 'order-2 md:order-1' : 'order-3 md:order-3'}`}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Crown Icon */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4">
        <svg className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Profile Image */}
      <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full bg-white md:mb-4 flex items-center justify-center overflow-hidden shadow-md flex-shrink-0
        ${rank === 1 ? 'ring-2 md:ring-4 ring-yellow-400' : ''}`}>
        {image ? (
          <Image src={image} alt={name} width={96} height={96} className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-300 rounded-full"></div>
        )}
      </div>

      {/* Info Section - horizontal on mobile, vertical on desktop */}
      <div className="flex-1 md:flex-none ml-3 md:ml-0 text-left md:text-center">
        {/* Name */}
        <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-2">{name}</h3>

        {/* Rank */}
        <div className="text-2xl md:text-5xl font-bold text-gray-900 mb-1 md:mb-3">{rank}</div>

        {/* XP */}
        <div className="flex items-center space-x-1 justify-start md:justify-center">
          <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm md:text-base font-semibold text-gray-900">{xp.toLocaleString()} XP</span>
        </div>
      </div>
    </motion.div>
  )
}

const TesterRow: React.FC<TesterRowProps> = ({ rank, name, username, xp, image }) => {
  return (
    <motion.div
      className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-lg py-3 px-3 md:px-4 flex items-center justify-between"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
      whileHover={{ x: 5 }}
    >
      {/* Left Side - Rank and Tester Info */}
      <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
        {/* Rank */}
        <div className="text-lg md:text-xl font-bold text-gray-700 w-6 md:w-8 flex-shrink-0">{rank}</div>

        {/* Profile Image */}
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
          {image ? (
            <Image src={image} alt={name} width={40} height={40} className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-400"></div>
          )}
        </div>

        {/* Name and Username */}
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 text-sm md:text-base truncate">{name}</div>
          <div className="text-xs md:text-sm text-gray-500 truncate">@{username}</div>
        </div>
      </div>

      {/* Right Side - XP Badge */}
      <div className="bg-gray-800 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center space-x-1 flex-shrink-0">
        <svg className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="font-bold text-xs md:text-sm">{xp}</span>
      </div>
    </motion.div>
  )
}

function LeaderBoardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)
        const data = await getLeaderboard()
        setLeaderboardData(data)
        setError(null)
      } catch (err) {
        setError('Failed to load leaderboard data')
        console.error('Error loading leaderboard:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // Transform data for display
  const topTesters = leaderboardData
    .slice(0, 3)
    .map((user, index) => ({
      name: user.fullname,
      rank: index + 1,
      xp: user.total_xp,
      bgColor: index === 0 ? 'bg-yellow-200' : index === 1 ? 'bg-gray-300' : 'bg-orange-200'
    }))

  // Show ALL users in table with proper ranking
  const allTesters = leaderboardData
    .map((user, index) => ({
      rank: index + 1,
      name: user.fullname,
      username: user.email.split('@')[0], // Use email prefix as username
      xp: user.total_xp
    }))

  // Show loader while loading
  if (isLoading) {
    return <Loader />
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFCFB] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Leaderboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  // Show empty state if no data
  if (leaderboardData.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFCFB] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600 mb-2">No Leaderboard Data</h2>
          <p className="text-gray-500">Be the first to earn XP and appear on the leaderboard!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFCFB]">
      <div className="p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">LeaderBoard</h1>
          <p className="text-sm sm:text-base text-[#171717]">
            See who&apos;s leading the pack of bug hunting and earning the most xp
          </p>
        </div>

        {/* Top 3 Podium - Horizontal on mobile, Vertical podium on desktop */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-center gap-3 md:gap-6 mb-6 md:mb-8 max-w-5xl mx-auto">
          {/* Cards will reorder using order-* classes */}
          {topTesters.length > 0 && topTesters.map((tester) => (
            <div key={tester.rank} className="w-full md:flex-1 md:max-w-xs">
              <TopTesterCard {...tester} />
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        {(leaderboardData.length > 0) && (
          <div className="max-w-5xl mx-auto pb-6">
            {/* Table Header */}
            <div className="bg-orange-700 text-white rounded-t-lg py-3 md:py-4 px-3 md:px-6 flex items-center justify-between font-bold text-sm md:text-lg">
              <div className="flex items-center space-x-2 md:space-x-4 flex-1">
                <span>Rank</span>
                <span className="ml-8 md:ml-12">Tester</span>
              </div>
              <span>XP</span>
            </div>

            {/* Table Body */}
            <div className="bg-white rounded-b-lg shadow-lg p-3 md:p-4 space-y-2">
              {allTesters.map((tester) => (
                <TesterRow key={tester.rank} {...tester} />
              ))}
            </div>
          </div>
        )}
        </motion.div>
      </div>
    </div>
  )
}

export default LeaderBoardPage
