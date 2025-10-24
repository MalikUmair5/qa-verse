'use client'
import React, { use, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import ThemeButton from '@/components/ui/button'
import { MdOutlineDashboard } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { RiTrophyLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import { useSidebar } from '@/app/(roles)/layout'



interface MenuItem {
  label: "Dashboard" | "My Projects" | "Leaderboard" | "Profile";
  isActive: boolean;
  icon: React.ReactNode;
  path: string;
}


const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    isActive: true,
    icon: <MdOutlineDashboard size={20} />,
    path: '/tester/Dashboard'
  },
  {
    label: "My Projects",
    isActive: false,
    icon: <RiTrophyLine size={20} />,
    path: '/tester/projects'
  },
  {
    label: "Leaderboard",
    isActive: false,
    icon: <CgProfile size={20} />,
    path: '/tester/leader-board'
  },
  {
    label: "Profile",
    isActive: false,
    icon: <ImProfile size={20} />,
    path: '/tester/profile'
  }
]


function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isExpanded } = useSidebar();

  // Function to check if current path is active
  const isActivePath = (itemPath: string) => {
    return pathname === itemPath || pathname.startsWith(itemPath + '/');
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {}}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 bg-[#F3ECE9] flex flex-col shadow-lg h-screen z-30 transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-20'
        }`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo Section - Always show logo, hide text when collapsed */}
        <motion.div
          className={`p-6 border-b border-gray-200/50 ${!isExpanded ? 'flex justify-center' : ''}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`flex items-center ${isExpanded ? 'space-x-2' : 'justify-center'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/headerLogo.png"
              alt="QA-VERSE Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <AnimatePresence>
              {isExpanded && (
                <motion.h1
                  className="text-xl font-bold text-[#171717] whitespace-nowrap overflow-hidden"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  QA-VERSE
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link href={item.path} key={item.label}>
              <motion.div
                className={`
                  flex items-center px-3 py-3 rounded-xl transition-all duration-300
                  ${isActivePath(item.path)
                    ? 'bg-[#A33C13]/25 hover:bg-[#A33C13] hover:text-[#ffffff] text-[#A33C13] shadow-md'
                    : 'text-[#171717] hover:bg-white/50 hover:shadow-sm'
                  }
                  ${!isExpanded ? 'justify-center' : ''}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={!isExpanded ? item.label : ''}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      className="text-base font-medium ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Log Out Button */}
        <div className="p-4 border-t border-gray-200/50">
          <motion.button
            onClick={handleLogout}
            className={`
              w-full flex items-center px-3 py-3 rounded-xl transition-all duration-300
              bg-[#A33C13] text-white hover:bg-[#8a3010] shadow-md
              ${!isExpanded ? 'justify-center' : ''}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={!isExpanded ? 'Logout' : ''}
          >
            <IoIosLogOut size={20} />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  className="text-base font-medium ml-4 whitespace-nowrap"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
