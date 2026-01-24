'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { aclonica } from '@/app/layout';
import { useAuthStore } from '@/store/authStore';

function MaintainerDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { title: 'Active Projects', value: '12', icon: '🚀' },
    { title: 'Total Testers', value: '48', icon: '👥' },
    { title: 'Bug Reports', value: '156', icon: '🐛' },
    { title: 'Completed Tests', value: '234', icon: '✅' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold text-white mb-2 ${aclonica.className}`}>
            Maintainer Dashboard
          </h1>
          <p className="text-gray-300">Welcome back, {user?.fullname}!</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-[#A33C13]/30 hover:border-[#A33C13] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <span className="text-2xl font-bold text-[#A33C13]">{stat.value}</span>
              </div>
              <h3 className="text-white font-semibold">{stat.title}</h3>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-[#A33C13]/30"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-[#A33C13] text-white p-4 rounded-lg hover:bg-[#8a2f0f] transition-colors">
              Create New Project
            </button>
            <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
              View All Projects
            </button>
            <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
              Manage Testers
            </button>
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