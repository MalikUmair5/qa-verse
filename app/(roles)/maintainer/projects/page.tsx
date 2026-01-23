'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { aclonica } from '@/app/layout';
import Link from 'next/link';
import AuthWrapper from '@/components/auth/AuthWrapper';

function MaintainerProjects() {
  // Mock data for demonstration
  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-featured online shopping platform with payment integration',
      technology_stack: 'React, Node.js, MongoDB',
      category: 'web',
      status: 'active',
      testing_url: 'https://ecommerce-demo.com',
      created_at: '2026-01-20T10:30:00Z'
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication',
      technology_stack: 'React Native, Firebase',
      category: 'mobile',
      status: 'active',
      testing_url: 'https://banking-app-demo.com',
      created_at: '2026-01-18T14:15:00Z'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className={`text-4xl font-bold text-white mb-2 ${aclonica.className}`}>
              My Projects
            </h1>
            <p className="text-gray-300">Manage your testing projects</p>
          </div>
          <Link href="/maintainer/create-project">
            <button className="bg-[#A33C13] text-white px-6 py-3 rounded-lg hover:bg-[#8a2f0f] transition-colors">
              + Create Project
            </button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-[#A33C13]/30 hover:border-[#A33C13] transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {project.status.toUpperCase()}
                </span>
              </div>
              
              <p className="text-gray-300 mb-4 text-sm line-clamp-3">{project.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#A33C13] font-medium">Tech:</span>
                  <span className="text-gray-300 text-sm">{project.technology_stack}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#A33C13] font-medium">Category:</span>
                  <span className="text-gray-300 text-sm capitalize">{project.category}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-[#A33C13] text-white py-2 px-4 rounded hover:bg-[#8a2f0f] transition-colors text-sm">
                  View Details
                </button>
                <button className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors text-sm">
                  Edit
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthWrapper protectedRoute={true} requiredRole="maintainer">
      <MaintainerProjects />
    </AuthWrapper>
  );
}