'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useSidebar } from '@/app/(roles)/layout'

function SimpleFooter() {
  const { isExpanded } = useSidebar();

  return (
    <motion.footer 
      className={`bg-[#F3ECE9] border-t border-gray-200 transition-all duration-300 ${
        isExpanded ? 'ml-80' : 'ml-20'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-4 px-6">
        <p className="text-center text-sm text-gray-600">
          © {new Date().getFullYear()} QA-VERSE. All rights reserved.
        </p>
      </div>
    </motion.footer>
  )
}

export default SimpleFooter
