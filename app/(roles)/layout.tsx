'use client'
import Header from "@/components/common/header";
import Sidebar from "@/components/common/Sidebar";
import Footer from "@/components/common/footer";
import Loader from "@/components/ui/loader";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Create a loading context
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadProjects: () => Promise<void>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Custom hook to use loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoadingProvider>
      <LayoutContent>{children}</LayoutContent>
    </LoadingProvider>
  );
}

// Separate component to use the loading context
const LayoutContent = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useLoading();

  return (
    <>
      <Header authenticated={true} />
      <div className="flex relative">
        <Sidebar />
        <main className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <Loader />
                <p className="text-center mt-4 text-muted font-medium">Loading projects...</p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </>
  );
};
