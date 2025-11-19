'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import Loader from '@/components/ui/loader'
import type { Achievement } from '@/lib/types'

function AchievementsPage() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (user) {
      fetchAchievements()
    }
  }, [user])

  const fetchAchievements = async () => {
    setIsLoading(true)
    try {
      const response = await api.achievements.getAll(user?.id)
      if (response.success && response.data) {
        setAchievements(response.data as Achievement[])
      }
    } catch (err) {
      console.error('Failed to fetch achievements:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : filter === 'earned'
    ? achievements.filter(a => a.earned)
    : achievements.filter(a => !a.earned)

  const earnedCount = achievements.filter(a => a.earned).length
  const totalCount = achievements.length

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'bg-blue-100 text-blue-800'
      case 'discovery': return 'bg-green-100 text-green-800'
      case 'specialty': return 'bg-purple-100 text-purple-800'
      case 'competitive': return 'bg-red-100 text-red-800'
      case 'collaboration': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level: number) => {
    if (level === 1) return 'bg-gray-400'
    if (level === 2) return 'bg-blue-400'
    if (level === 3) return 'bg-purple-400'
    return 'bg-yellow-400'
  }

  if (isLoading) return <Loader />

  return (
    <div className="min-h-screen bg-[#FFFCFB] p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">Achievements & Badges</h1>
          <p className="text-sm sm:text-base text-[#666]">
            You&apos;ve earned {earnedCount} out of {totalCount} badges
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-[#171717]">Overall Progress</span>
            <span className="text-sm text-gray-600">{Math.round((earnedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#A33C13] to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { value: 'all', label: 'All Badges' },
            { value: 'earned', label: 'Earned' },
            { value: 'locked', label: 'Locked' }
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === btn.value
                  ? 'bg-[#A33C13] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-lg shadow-md p-6 relative overflow-hidden ${
                !achievement.earned ? 'opacity-60' : ''
              }`}
            >
              {/* Level Badge */}
              <div className={`absolute top-2 right-2 w-8 h-8 ${getLevelColor(achievement.level)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {achievement.level}
              </div>

              {/* Icon */}
              <div className="text-6xl mb-4 text-center">
                {achievement.earned ? achievement.icon : '🔒'}
              </div>

              {/* Name and Category */}
              <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-[#171717] mb-2">{achievement.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(achievement.category)}`}>
                  {achievement.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 text-center mb-4">{achievement.description}</p>

              {/* Status */}
              <div className="text-center">
                {achievement.earned ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Earned!</span>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    {achievement.xpRequired > 0 ? `Requires ${achievement.xpRequired} XP` : 'Keep testing to unlock!'}
                  </div>
                )}
              </div>

              {/* Shimmer effect for earned badges */}
              {achievement.earned && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" 
                     style={{ 
                       transform: 'translateX(-100%)',
                       animation: 'shimmer 3s infinite'
                     }} 
                />
              )}
            </motion.div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No achievements found</p>
          </div>
        )}
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export default AchievementsPage
