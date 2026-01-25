'use client'
import Header from "@/layout/header";
import Sidebar from "@/layout/Sidebar";
import Loader from "@/components/ui/loader";
// Import from the new file
import { SidebarProvider, useSidebar } from "@/app/context/SidebarContext";
import { createContext, useContext, useState, ReactNode } from "react";

// ... (Remove the old SidebarContext/Provider code from this file) ...

// --- Loading Context ---

interface LoadingContextType { isLoading: boolean; setIsLoading: (loading: boolean) => void; }

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useLoading error');
  return context;
};

const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};




// Layout Content
const LayoutContent = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useLoading(); // Get global loading state
  const { isExpanded, toggleSidebar } = useSidebar();
  return (
    <>
      <Sidebar />
      <Header
        authenticated={true}
        hasSidebar={true}
        toggleSidebar={toggleSidebar}
        isExpanded={isExpanded}
      />

      <div className="flex">
        {/* The main content wrapper that respects sidebar width */}
        <div className={`
          flex-1 transition-all duration-300 pt-20
          ${isExpanded ? 'lg:ml-64' : 'lg:ml-20'} 
        `}>
          <main className="min-h-screen bg-[#FFFCFB]">
            {/* LOGIC: If loading, show Loader component. 
               Otherwise, show the page content (children).
               Since this is inside the flex-1 div, it won't overlap the sidebar.
            */}
            {isLoading ? (
              <Loader />
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <LoadingProvider>
      <SidebarProvider>
        <LayoutContent>{children}</LayoutContent>
      </SidebarProvider>
    </LoadingProvider>
  );
}