'use client'
import ThemeButton from '@/components/ui/button'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function Header() {
  return (
    <motion.header 
      className="bg-secondary border-b border-gray-200 shadow-sm bg-[#F3ECE9]"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">QA</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">QA-VERSE</h1>
          </motion.div>

    

          {/* CTA Button */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/login">
                <ThemeButton variant="secondary">
                  Login
                </ThemeButton>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/register">
                <ThemeButton variant="primary">
                  Get Started
                </ThemeButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header