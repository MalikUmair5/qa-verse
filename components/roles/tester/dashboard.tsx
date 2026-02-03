"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/loader'
import { showToast } from '@/lib/utils/toast'
import { useAuthStore } from '@/store/authStore'
import { getTesterAnalytics, TesterAnalytics } from '@/lib/api/analytics'
import { aclonica } from '@/app/layout'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { FaCheckCircle, FaClipboardList, FaStar } from 'react-icons/fa'
import { IoBugSharp } from 'react-icons/io5'
import { TbCirclePercentageFilled } from 'react-icons/tb'
import { HiTrophy } from 'react-icons/hi2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function Dashboard() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<TesterAnalytics | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getTesterAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setError('Failed to load analytics data')
        showToast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FFFCFB]">
        <Loader />
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-[#FFFCFB] p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl text-[#171717] mb-4">Error Loading Dashboard</h1>
          <p className="text-[#171717]/70">{error}</p>
        </div>
      </div>
    )
  }

  // Chart configurations
  const successRateData = {
    labels: ['Approved', 'Rejected'],
    datasets: [
      {
        data: [analytics.approved_bugs_count, analytics.bug_reports_count - analytics.approved_bugs_count],
        backgroundColor: ['#A33C13', '#374151'],
        borderColor: ['#A33C13', '#374151'],
        borderWidth: 2,
      },
    ],
  }

  const activityData = {
    labels: ['Total Reports', 'Approved Reports', 'Total XP'],
    datasets: [
      {
        label: 'Activity Stats',
        data: [analytics.bug_reports_count, analytics.approved_bugs_count, analytics.total_xp],
        backgroundColor: 'rgba(163, 60, 19, 0.8)',
        borderColor: '#A33C13',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Bug Reports',
        data: [2, 3, 1, 4], // Mock weekly data
        borderColor: '#A33C13',
        backgroundColor: 'rgba(163, 60, 19, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#171717',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#171717',
        },
        grid: {
          color: 'rgba(23, 23, 23, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#171717',
        },
        grid: {
          color: 'rgba(23, 23, 23, 0.1)',
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#171717',
        },
      },
    },
  }

  const stats = [
    { 
      title: 'Total XP', 
      value: analytics.total_xp.toString(), 
      icon: <FaStar />, 
      color: 'from-yellow-500 to-orange-500' 
    },
    { 
      title: 'Bug Reports', 
      value: analytics.bug_reports_count.toString(), 
      icon: <IoBugSharp />, 
      color: 'from-red-500 to-pink-500' 
    },
    { 
      title: 'Approved Bugs', 
      value: analytics.approved_bugs_count.toString(), 
      icon: <FaCheckCircle />
, 
      color: 'from-green-500 to-teal-500' 
    },
    { 
      title: 'Success Rate', 
      value: `${analytics.success_rate}%`, 
      icon: <TbCirclePercentageFilled />
, 
      color: 'from-blue-500 to-purple-500' 
    }
  ]

  return (
    <div className="min-h-screen bg-[#FFFCFB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold text-[#171717] mb-2 ${aclonica.className}`}>
            Tester Dashboard
          </h1>
          <p className="text-[#171717]/70">Welcome back, {user?.fullname}!</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white rounded-lg p-6 border border-gray-200 hover:border-[#A33C13] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className="text-3xl font-bold text-[#A33C13]">{stat.value}</span>
                </div>
                <h3 className="text-[#171717] font-semibold text-lg">{stat.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Success Rate Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-xl font-bold text-[#171717] mb-4">Bug Report Success Rate</h3>
            <div className="h-64">
              <Doughnut data={successRateData} options={doughnutOptions} />
            </div>
          </motion.div>

          {/* Activity Overview Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-xl font-bold text-[#171717] mb-4">Activity Overview</h3>
            <div className="h-64">
              <Bar data={activityData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Performance Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-8"
        >
          <h3 className="text-xl font-bold text-[#171717] mb-4">Weekly Performance Trend</h3>
          <div className="h-64">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* <div 
            onClick={() => router.push('/tester/report-bug')}
            className="bg-gradient-to-r from-[#A33C13] to-red-600 rounded-lg p-6 cursor-pointer hover:from-red-600 hover:to-[#A33C13] transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3"><IoBugSharp className='text-white' /></span>
              <h3 className="text-xl font-bold text-white">Report Bug</h3>
            </div>
            <p className="text-white/90">Found a new bug? Report it now!</p>
          </div> */}

          <div 
            onClick={() => router.push('/tester/explore-projects')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3"><FaClipboardList className='text-white'/></span>
              <h3 className="text-xl font-bold text-white">View Projects</h3>
            </div>
            <p className="text-white/90">Browse available testing projects</p>
          </div>

          <div 
            onClick={() => router.push('/tester/leader-board')}
            className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 cursor-pointer hover:from-teal-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3"><HiTrophy className='text-white'/></span>
              <h3 className="text-xl font-bold text-white">Leaderboard</h3>
            </div>
            <p className="text-white/90">See how you rank among testers</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard