'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import ThemeButton from '@/components/ui/button'
import { HiMenuAlt2 } from 'react-icons/hi'

interface HeaderProps {
  authenticated?: boolean
  hasSidebar?: boolean
  toggleSidebar?: () => void
  isExpanded?: boolean
}

function Header({ authenticated, hasSidebar = false, toggleSidebar, isExpanded = false }: HeaderProps) {

  return (
    <motion.header
      className={`
        fixed top-0 bg-secondary border-b border-gray-200 shadow-sm bg-[#F3ECE9] z-40 
        transition-all duration-300
        ${hasSidebar && isExpanded ? 'left-0 lg:left-64' : hasSidebar ? 'left-0 lg:left-20' : 'left-0'}
        right-0
      `}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Toggle Button - Only show when sidebar exists */}
          {hasSidebar && (
            <motion.button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiMenuAlt2 size={24} className="text-[#A33C13]" />
            </motion.button>
          )}
          
          {/* Logo for non-sidebar pages */}
          {!hasSidebar && (
            <Link href="/">
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src="/headerLogo.png"
                  alt="QA-VERSE Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <h1 className="text-xl font-bold text-[#171717]">QA-VERSE</h1>
              </motion.div>
            </Link>
          )}

          {authenticated ? (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Image
                src="/trophy.png"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-foreground">2,200 XP</span>
              <Image
                src="/userAvatar.png"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link href="/signin">
                <ThemeButton variant="secondary">
                  Login
                </ThemeButton>
              </Link>
              <Link href="/signup">
                <ThemeButton variant="primary">
                  Get Started
                </ThemeButton>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Header