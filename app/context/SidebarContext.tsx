'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface SidebarContextType {
  isExpanded: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider');
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize state based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //  FIX: Use useCallback to keep function references stable
  const toggleSidebar = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  //  FIX: Use useCallback here too
  const closeSidebar = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};