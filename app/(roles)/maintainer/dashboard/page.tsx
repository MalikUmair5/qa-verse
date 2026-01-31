'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { aclonica } from '@/app/layout';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/ui/loader';
import { showToast } from '@/lib/utils/toast';
import { getMaintainerAnalytics, MaintainerAnalytics } from '@/lib/api/analytics';
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
import { IoBugSharp } from 'react-icons/io5';
import { FaCheckCircle, FaClipboardList, FaPlus } from 'react-icons/fa';
import { HiTrophy } from 'react-icons/hi2';

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

function MaintainerDashboard() {
  const router = useRouter()
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<MaintainerAnalytics | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getMaintainerAnalytics()
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

  // Calculate approval rate
  const approvalRate = analytics.total_bugs > 0 
    ? Math.round((analytics.approved_bugs / analytics.total_bugs) * 100)
    : 0

  // Chart configurations
  const bugStatusData = {
    labels: ['Approved', 'Pending Review'],
    datasets: [
      {
        data: [analytics.approved_bugs, analytics.total_bugs - analytics.approved_bugs],
        backgroundColor: ['#A33C13', '#374151'],
        borderColor: ['#A33C13', '#374151'],
        borderWidth: 2,
      },
    ],
  }

  const projectStatsData = {
    labels: ['Active Projects', 'Total Testers', 'Total Bugs', 'Approved Bugs'],
    datasets: [
      {
        label: 'Project Statistics',
        data: [
          analytics.total_active_projects,
          analytics.total_testers,
          analytics.total_bugs,
          analytics.approved_bugs
        ],
        backgroundColor: 'rgba(163, 60, 19, 0.8)',
        borderColor: '#A33C13',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const trendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'New Bugs',
        data: [8, 12, 6, 14], // Mock weekly data
        borderColor: '#A33C13',
        backgroundColor: 'rgba(163, 60, 19, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Approved Bugs',
        data: [5, 8, 4, 10], // Mock weekly data
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
      title: 'Active Projects', 
      value: analytics.total_active_projects.toString(), 
      icon: '🚀', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Currently running projects'
    },
    { 
      title: 'Total Testers', 
      value: analytics.total_testers.toString(), 
      icon: '👥', 
      color: 'from-green-500 to-emerald-500',
      description: 'Active testing community'
    },
    { 
      title: 'Bug Reports', 
      value: analytics.total_bugs.toString(), 
      icon: <IoBugSharp />
, 
      color: 'from-red-500 to-pink-500',
      description: 'Total bug reports received'
    },
    { 
      title: 'Approved Bugs', 
      value: analytics.approved_bugs.toString(), 
      icon: <FaCheckCircle />, 
      color: 'from-purple-500 to-violet-500',
      description: 'Validated bug reports'
    }
  ];

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
            Maintainer Dashboard
          </h1>
          <p className="text-[#171717]/70">Welcome back, {user?.fullname}!</p>
          <p className="text-sm text-[#171717]/60 mt-2">
            Bug Approval Rate: <span className="text-[#A33C13] font-semibold">{approvalRate}%</span>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white rounded-lg p-6 border border-gray-200 hover:border-[#A33C13] transition-all duration-300 overflow-hidden group shadow-sm hover:shadow-md"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className="text-3xl font-bold text-[#A33C13]">{stat.value}</span>
                </div>
                <h3 className="text-[#171717] font-semibold text-lg mb-1">{stat.title}</h3>
                <p className="text-[#171717]/60 text-sm">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bug Status Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-xl font-bold text-[#171717] mb-4">Bug Review Status</h3>
            <div className="h-64">
              <Doughnut data={bugStatusData} options={doughnutOptions} />
            </div>
          </motion.div>

          {/* Project Statistics Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-xl font-bold text-[#171717] mb-4">Project Overview</h3>
            <div className="h-64">
              <Bar data={projectStatsData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Trend Analysis Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-8"
        >
          <h3 className="text-xl font-bold text-[#171717] mb-4">Bug Report Trends</h3>
          <div className="h-64">
            <Line data={trendData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div 
            onClick={() => router.push('/maintainer/projects/create')}
            className="bg-gradient-to-r from-[#A33C13] to-red-600 rounded-lg p-6 cursor-pointer hover:from-red-600 hover:to-[#A33C13] transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3"><FaPlus /></span>
              <h3 className="text-xl font-bold text-white">New Project</h3>
            </div>
            <p className="text-white/90">Create a new testing project</p>
          </div>

          <div 
            onClick={() => router.push('/maintainer/projects')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3"><FaClipboardList /></span>
              <h3 className="text-xl font-bold text-white">All Projects</h3>
            </div>
            <p className="text-white/90">View and manage projects</p>
          </div>

          <div 
            onClick={() => router.push('/maintainer/bugs')}
            className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 cursor-pointer hover:from-teal-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3"><IoBugSharp /></span>
              <h3 className="text-xl font-bold text-white">Bug Reports</h3>
            </div>
            <p className="text-white/90">Review bug submissions</p>
          </div>

          <div 
            onClick={() => router.push('/maintainer/leader-board')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6 cursor-pointer hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3"><HiTrophy /></span>
              <h3 className="text-xl font-bold text-white">Leaderboard</h3>
            </div>
            <p className="text-white/90">Top performing testers</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <MaintainerDashboard />
  );
}