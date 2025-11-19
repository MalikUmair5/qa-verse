'use client'
import React, { useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { MdOutlineDashboard, MdBugReport, MdNotifications } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { RiTrophyLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut, IoMdSettings } from "react-icons/io";
import { FiMessageSquare, FiBarChart2, FiAward } from "react-icons/fi";
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSidebar } from '@/app/(roles)/layout'



interface MenuItem {
  label: string;
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
    label: "My Bug Reports",
    isActive: false,
    icon: <MdBugReport size={20} />,
    path: '/tester/my-bug-reports'
  },
  {
    label: "Leaderboard",
    isActive: false,
    icon: <CgProfile size={20} />,
    path: '/tester/leader-board'
  },
  {
    label: "Analytics",
    isActive: false,
    icon: <FiBarChart2 size={20} />,
    path: '/tester/analytics'
  },
  {
    label: "Achievements",
    isActive: false,
    icon: <FiAward size={20} />,
    path: '/tester/achievements'
  },
  {
    label: "Messages",
    isActive: false,
    icon: <FiMessageSquare size={20} />,
    path: '/tester/chat'
  },
  {
    label: "Notifications",
    isActive: false,
    icon: <MdNotifications size={20} />,
    path: '/tester/notifications'
  },
  {
    label: "Profile",
    isActive: false,
    icon: <ImProfile size={20} />,
    path: '/tester/profile'
  },
  {
    label: "Settings",
    isActive: false,
    icon: <IoMdSettings size={20} />,
    path: '/tester/settings'
  }
]


function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isExpanded, toggleSidebar } = useSidebar();

  // Get query parameter to check where user came from
  const fromParam = searchParams.get('from');

  // Close sidebar on navigation (mobile only)
  useEffect(() => {
    if (isExpanded && window.innerWidth < 1024) {
      toggleSidebar();
    }
  }, [pathname]); // Only depend on pathname, not isExpanded or toggleSidebar

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isExpanded && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

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
    
    // Check if it's a child route
    if (pathname.startsWith(itemPath + '/')) {
      // For My Bug Reports, handle the detail page
      if (itemPath === '/tester/my-bug-reports' && pathname.startsWith('/tester/my-bug-reports/')) {
        return true;
      }
      // For other pages, exclude special routes
      if (!pathname.startsWith('/tester/project-details/') && 
          !pathname.startsWith('/tester/report-bug')) {
        return true;
      }
    }
    
    // Special handling for project details - keep parent active based on origin
    if (pathname.startsWith('/tester/project-details/')) {
      // IMPORTANT: Check My Projects FIRST before Dashboard
      if (itemPath === '/tester/projects' && fromParam === 'projects') {
        return true;
      }
      // Only activate Dashboard if explicitly from dashboard
      if (itemPath === '/tester/Dashboard' && fromParam === 'dashboard') {
        return true;
      }
    }
    
    // Special handling for report-bug - keep parent active based on origin
    if (pathname.startsWith('/tester/report-bug')) {
      // Activate My Projects if coming from projects page
      if (itemPath === '/tester/projects' && fromParam === 'projects') {
        return true;
      }
      // Activate Dashboard if coming from dashboard
      if (itemPath === '/tester/Dashboard' && fromParam === 'dashboard') {
        return true;
      }
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
      {/* Backdrop for mobile - click to close sidebar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed left-0 top-0 bg-[#F3ECE9] flex flex-col shadow-lg h-screen
          transition-all duration-300
          ${isExpanded ? 'z-50' : 'z-30'}
          ${isExpanded ? 'w-80 translate-x-0' : 'w-80 -translate-x-full'}
          ${isExpanded ? 'lg:w-80 lg:translate-x-0' : 'lg:w-20 lg:translate-x-0'}
          lg:z-30
        `}
        initial={false}
      >
        {/* Logo Section - Always show logo, hide text when collapsed */}
        <motion.div
          className={`p-6 border-b border-gray-200/50 ${!isExpanded ? 'flex justify-center' : 'flex items-center justify-between'}`}
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

          {/* Close button for mobile */}
          {isExpanded && (
            <motion.button
              onClick={toggleSidebar}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <svg className="w-5 h-5 text-[#A33C13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
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
