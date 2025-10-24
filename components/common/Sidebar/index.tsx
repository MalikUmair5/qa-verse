'use client'
import React, { useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { MdOutlineDashboard } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { RiTrophyLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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


function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isExpanded } = useSidebar();

  // Get query parameter to check where user came from
  const fromParam = searchParams.get('from');

  // Debug logging
  useEffect(() => {
    if (pathname.startsWith('/tester/project-details/')) {
      console.log('🔍 Debug - Current pathname:', pathname);
      console.log('🔍 Debug - fromParam:', fromParam);
    }
  }, [pathname, fromParam]);

  // Function to check if current path is active
  const isActivePath = (itemPath: string) => {
    // Direct match
    if (pathname === itemPath) return true;
    
    // Check if it's a child route (but not project-details which is handled separately)
    if (!pathname.startsWith('/tester/project-details/') && pathname.startsWith(itemPath + '/')) {
      return true;
    }
    
    // Special handling for project details - keep parent active based on origin
    if (pathname.startsWith('/tester/project-details/')) {
      // IMPORTANT: Check My Projects FIRST before Dashboard
      if (itemPath === '/tester/projects' && fromParam === 'projects') {
        console.log('✅ Activating My Projects');
        return true;
      }
      // Only activate Dashboard if explicitly from dashboard
      if (itemPath === '/tester/Dashboard' && fromParam === 'dashboard') {
        console.log('✅ Activating Dashboard');
        return true;
      }
      // No default activation - return false if no match
    }
    
    return false;
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      router.push('/signin');
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

// Main Sidebar component with Suspense boundary
function Sidebar() {
  return (
    <Suspense fallback={<div className="w-20 h-screen bg-[#F3ECE9] fixed left-0 top-0" />}>
      <SidebarContent />
    </Suspense>
  )
}

export default Sidebar
