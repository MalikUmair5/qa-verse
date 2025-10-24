'use client'
import Header from "@/components/common/header";
import Sidebar from "@/components/common/Sidebar";
import SimpleFooter from "@/components/common/SimpleFooter";
import Loader from "@/components/ui/loader";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Create a loading context
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadProjects: () => Promise<void>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Create sidebar context
interface SidebarContextType {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Custom hook to use loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Custom hook to use sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Loading Provider component
const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Simulate project loading function
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically fetch projects from your API
      console.log('Projects loaded successfully');
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    setIsLoading,
    loadProjects
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Sidebar Provider component
const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };

  const value = {
    isExpanded,
    toggleSidebar
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoadingProvider>
      <SidebarProvider>
        <LayoutContent>{children}</LayoutContent>
      </SidebarProvider>
    </LoadingProvider>
  );
}

// Separate component to use the loading context
const LayoutContent = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useLoading();
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <>
      <Sidebar />
      <Header authenticated={true} hasSidebar={true} toggleSidebar={toggleSidebar} isExpanded={isExpanded} />
      <div className="flex">
        {/* Main content area with dynamic left margin based on sidebar state */}
        <div className={`flex-1 transition-all duration-300 pt-20 ${isExpanded ? 'ml-80' : 'ml-20'}`}>
          <main className="min-h-screen">
            {isLoading && (
              <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <Loader />
                  <p className="text-center mt-4 text-muted font-medium">Loading projects...</p>
                </div>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
      <SimpleFooter />
    </>
  );
};
