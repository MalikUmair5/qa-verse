'use client'
import React, { use, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import ThemeButton from '@/components/ui/button'
import { MdOutlineDashboard } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { RiTrophyLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'



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
  const pathname = usePathname(); // Get current pathname from Next.js
  const router = useRouter();

  // Function to check if current path is active
  const isActivePath = (itemPath: string) => {
    console.log('Current Pathname:', pathname);
    console.log('Checking Path:', itemPath);
    return pathname === itemPath || pathname.startsWith(itemPath + '/');
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Add your logout logic here
      // For example: await signOut() or localStorage.clear()
      console.log('Logging out...');

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };



  return (
    <motion.aside
      className="bg-[#F3ECE9] w-80 flex flex-col shadow-lg h-screen min-h-screen"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >

      {/* Navigation Menu */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item, index) => (
          <Link href={item.path} key={item.label}>
            <div
              className={`
              flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300
              ${isActivePath(item.path)
                  ? 'bg-[#A33C13]/25 hover:bg-[#A33C13] hover:text-[#ffffff] text-[#A33C13] shadow-md'
                  : 'text-[#171717] hover:bg-white/50 hover:shadow-sm'
                }
              `}
          
            >
              {item.icon}
              <span className="text-lg font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>


      {/* Log Out Button */}
      <div className="p-6 border-t border-gray-200/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ThemeButton> Logout </ThemeButton>

        </motion.div>
      </div>
    </motion.aside>
  )
}

export default Sidebar
