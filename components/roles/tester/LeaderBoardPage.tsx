'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Loader from '@/components/ui/loader'

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
    if (rank === 1) return 'h-72'
    if (rank === 2) return 'h-64'
    return 'h-60'
  }

  return (
    <motion.div
      className={`${bgColor} rounded-3xl p-6 shadow-lg ${getCardHeight()} flex flex-col items-center justify-center relative`}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Crown Icon */}
      <div className="absolute top-4 right-4">
        <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Profile Image */}
      <div className={`w-24 h-24 rounded-full bg-white mb-4 flex items-center justify-center overflow-hidden shadow-md ${rank === 1 ? 'ring-4 ring-yellow-400' : ''}`}>
        {image ? (
          <Image src={image} alt={name} width={96} height={96} className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-300 rounded-full"></div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>

      {/* Rank */}
      <div className="text-5xl font-bold text-gray-900 mb-3">{rank}</div>

      {/* XP */}
      <div className="flex items-center space-x-1">
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="font-semibold text-gray-900">{xp.toLocaleString()} XP</span>
      </div>
    </motion.div>
  )
}

const TesterRow: React.FC<TesterRowProps> = ({ rank, name, username, xp, image }) => {
  return (
    <motion.div
      className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-lg py-3 px-4 flex items-center justify-between"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
      whileHover={{ x: 5 }}
    >
      {/* Left Side - Rank and Tester Info */}
      <div className="flex items-center space-x-4 flex-1">
        {/* Rank */}
        <div className="text-xl font-bold text-gray-700 w-8">{rank}</div>

        {/* Profile Image */}
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
          {image ? (
            <Image src={image} alt={name} width={40} height={40} className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-400"></div>
          )}
        </div>

        {/* Name and Username */}
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">@{username}</div>
        </div>
      </div>

      {/* Right Side - XP Badge */}
      <div className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-1">
        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="font-bold text-sm">{xp}</span>
      </div>
    </motion.div>
  )
}

function LeaderBoardPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const topTesters = [
    { name: 'Jam Smith', rank: 2, xp: 1200, bgColor: 'bg-gray-300' },
    { name: 'Jojo Smith', rank: 1, xp: 2200, bgColor: 'bg-yellow-200' },
    { name: 'John Smith', rank: 3, xp: 800, bgColor: 'bg-orange-200' },
  ]

  const otherTesters = [
    { rank: 4, name: 'Henrietta O&apos;Connell', username: 'enrietta', xp: 750 },
    { rank: 5, name: 'Henrietta O&apos;Connell', username: 'enrietta', xp: 624 },
  ]

  // Show loader while loading
  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LeaderBoard</h1>
          <p className="text-gray-700 text-lg">
            See who&apos;s leading the pack of bug hunting and earning the most xp
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-6 mb-8 max-w-5xl mx-auto">
          {/* Second Place */}
          <div className="flex-1 max-w-xs">
            <TopTesterCard {...topTesters[0]} />
          </div>

          {/* First Place (taller, centered) */}
          <div className="flex-1 max-w-xs">
            <TopTesterCard {...topTesters[1]} />
          </div>

          {/* Third Place */}
          <div className="flex-1 max-w-xs">
            <TopTesterCard {...topTesters[2]} />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="max-w-5xl mx-auto pb-6">
          {/* Table Header */}
          <div className="bg-orange-700 text-white rounded-t-lg py-4 px-6 flex items-center justify-between font-bold text-lg">
            <div className="flex items-center space-x-4 flex-1">
              <span>Rank</span>
              <span className="ml-12">Tester</span>
            </div>
            <span>XP</span>
          </div>

          {/* Table Body */}
          <div className="bg-white rounded-b-lg shadow-lg p-4 space-y-2">
            {otherTesters.map((tester) => (
              <TesterRow key={tester.rank} {...tester} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LeaderBoardPage
