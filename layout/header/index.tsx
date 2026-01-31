'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import ThemeButton from '@/components/ui/button'
import { HiMenuAlt2 } from 'react-icons/hi'
import { IoMdNotifications } from 'react-icons/io'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { getTotalXP } from '@/lib/api/gamification'

interface HeaderProps {
  authenticated?: boolean
  hasSidebar?: boolean
  toggleSidebar?: () => void
  isExpanded?: boolean
}

function Header({ authenticated, hasSidebar = false, toggleSidebar, isExpanded = false }: HeaderProps) {
  const currentRole = useAuthStore().user?.role
  const router = useRouter();
  const user = useAuthStore().user;
  const [totalXP, setTotalXP] = useState<number>(0)
  const [isLoadingXP, setIsLoadingXP] = useState<boolean>(true)

  // Function to fetch total XP
  const fetchTotalXP = async () => {
    if (!authenticated || !user) return

    try {
      const response = await getTotalXP()
      setTotalXP(response.total_xp)
      setIsLoadingXP(false)
    } catch (error) {
      console.error('Error fetching total XP:', error)
      setIsLoadingXP(false)
    }
  }

  // Fetch XP on component mount and set up interval
  useEffect(() => {
    if (authenticated && user) {
      // Fetch immediately
      fetchTotalXP()

      // Set up interval to fetch every 10 seconds
      const interval = setInterval(fetchTotalXP, 10000)

      // Cleanup interval on unmount
      return () => clearInterval(interval)
    }
  }, [authenticated, user])

  const handleNavigate = () => {
    if (currentRole === 'tester') {
      router.push('/tester/notifications')
    }
    else if (currentRole === 'maintainer') {
      router.push('/maintainer/notifications')
    }
  }

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
              <div onClick={handleNavigate} className="cursor-pointer">
                <IoMdNotifications size={24} className="text-[#A33C13]" />
              </div>
              {user?.role === 'tester' && (
                <>
                  <img
                    src="/trophy.png"
                    alt="Trophy"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {isLoadingXP ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#A33C13] rounded-full animate-pulse"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      `${totalXP.toLocaleString()} XP`
                    )}
                  </span>
                </>
              )}
              <img
                src={user?.avatar_url || "/userAvatar.png"}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
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