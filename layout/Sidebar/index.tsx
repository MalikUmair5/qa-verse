'use client'
import React, { useEffect, Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { MdBugReport, MdDashboard, MdLeaderboard, MdOutlineDashboard, MdOutlineFindReplace } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { RiGitMergeLine, RiTrophyLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut, IoMdNotifications, IoMdSettings } from "react-icons/io";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation'
import { useSidebar } from '@/app/context/SidebarContext';
import logout from '@/lib/api/auth/logout';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/(roles)/layout'; // or wherever LoadingContext is defined
import { TbReportSearch } from "react-icons/tb";


interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

// 1. Define Role-Specific Menus
const TESTER_MENU: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <MdDashboard size={20} />,
    path: '/tester/dashboard'
  },
  {
    label: "Explore Projects",
    icon: <RiTrophyLine size={20} />,
    path: '/tester/explore-projects'
  },
  {
    label: "My Bug Reports",
    icon: <TbReportSearch size={20} />,
    path: '/tester/projects'
  },
  {
    label: "Leaderboard",
    icon: <MdLeaderboard size={20} />,
    path: '/tester/leader-board'
  },
  {
    label: "notifications",
    icon: <IoMdNotifications size={20} />,
    path: '/tester/notifications'
  },
  {
    label: "Profile",
    icon: <ImProfile size={20} />,
    path: '/tester/profile'
  }
]

const MAINTAINER_MENU: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <MdOutlineDashboard size={20} />,
    path: '/maintainer/dashboard'
  },
  {
    label: "Project Management",
    icon: <RiGitMergeLine size={20} />,
    path: '/maintainer/projects'
  },
  {
    label: "Bug Reports",
    icon: <MdBugReport size={20} />,
    path: '/maintainer/bugs'
  },
  {
    label: "Leaderboard",
    icon: <MdLeaderboard size={20} />,
    path: '/maintainer/leader-board'
  },
  {
    label: "Profile",
    icon: <ImProfile size={20} />,
    path: '/maintainer/profile'
  },
  {
    label: "notifications",
    icon: <IoMdNotifications size={20} />,
    path: '/maintainer/notifications'
  },
  {
    label: "Settings",
    icon: <IoMdSettings size={20} />,
    path: '/maintainer/settings'
  }
]
function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = useAuthStore().user?.role
  const [mounted, setMounted] = useState(false);
  const { setIsLoading } = useLoading(); // Get the global loader control
  const router = useRouter();

  //    FIX: Destructure closeSidebar from the context
  const { isExpanded, toggleSidebar, closeSidebar } = useSidebar();

  const fromParam = searchParams.get('from');



  // 3. Set mounted to true ONLY after the first render (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 4. Calculate menu items based on mounted state
  let currentMenuItems: MenuItem[] = [];

  if (mounted && role) {
    // Only run this logic if we are safely in the browser
    if (role === 'tester') {
      currentMenuItems = TESTER_MENU;
    } else if (role === 'maintainer') {
      currentMenuItems = MAINTAINER_MENU;
    }
  }

  //    FIX: Close sidebar ONLY when the path changes.
  // We removed 'isExpanded' from the dependency array to stop the open/close loop.
  useEffect(() => {
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  }, [pathname, closeSidebar]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isExpanded && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

  const handleLogout = () => {
    try {
      setIsLoading(true);
      logout();
      router.push('/signin');

    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoading(false); // Hide loader if something breaks
    }
  };

  const isActivePath = (itemPath: string) => {
    if (pathname === itemPath) return true;

    // Extract role from itemPath (tester/maintainer)
    const roleMatch = itemPath.match(/^\/(tester|maintainer)\//);
    const role = roleMatch ? roleMatch[1] : null;

    if (!role) return false;

    // Special detail/form pages that should use 'from' parameter for navigation context
    const specialPages = [
      `/${role}/project-details/`,
      `/${role}/report-bug`,
    ];

    // Check if current pathname is a special page that uses 'from' parameter
    const isInSpecialPage = specialPages.some(specialPage => 
      pathname.startsWith(specialPage)
    );

    // Handle special pages using 'from' parameter
    if (isInSpecialPage) {
      // Check if this menu item matches the 'from' parameter
      if (itemPath === `/${role}/projects` && (fromParam === 'projects' || fromParam === 'project-details')) return true;
      if (itemPath === `/${role}/dashboard` && fromParam === 'dashboard') return true;
      if (itemPath === `/${role}/explore-projects` && fromParam === 'explore-projects') return true;
      if (itemPath === `/${role}/leader-board` && fromParam === 'leader-board') return true;
      if (itemPath === `/${role}/notifications` && fromParam === 'notifications') return true;
      if (itemPath === `/${role}/profile` && fromParam === 'profile') return true;
      // Additional maintainer-specific paths
      if (itemPath === `/${role}/bugs` && fromParam === 'bugs') return true;
    }

    // For non-special pages, check if pathname starts with itemPath + '/'
    // This handles sub-paths like /maintainer/bugs/bug/id
    if (!isInSpecialPage && pathname.startsWith(itemPath + '/')) {
      return true;
    }

    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar} //    Use explicit close action
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`
          fixed left-0 top-0 bg-[#F3ECE9] flex flex-col shadow-lg h-screen
          transition-all duration-300
          ${isExpanded ? 'z-50' : 'z-30'}
          ${isExpanded ? 'w-80 translate-x-0' : 'w-80 -translate-x-full'}
          ${isExpanded ? 'lg:w-64 lg:translate-x-0' : 'lg:w-20 lg:translate-x-0'} 
          lg:z-30
        `}
        initial={false}
      >
        {/* Header / Logo */}
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

          {/* Mobile Close Button */}
          {isExpanded && (
            <motion.button
              onClick={closeSidebar} //    Use explicit close action
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-[#A33C13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </motion.div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {currentMenuItems.map((item) => (
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

        {/* Logout Button */}
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

function Sidebar() {
  return (
    <Suspense fallback={<div className="w-20 h-screen bg-[#F3ECE9] fixed left-0 top-0" />}>
      <SidebarContent />
    </Suspense>
  )
}

export default Sidebar