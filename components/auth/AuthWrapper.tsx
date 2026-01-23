'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole?: 'tester' | 'maintainer' | 'project_owner';
  protectedRoute?: boolean;
  authRoute?: boolean; // signin/signup pages
}

export default function AuthWrapper({ 
  children, 
  requiredRole, 
  protectedRoute = false,
  authRoute = false 
}: AuthWrapperProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Immediate auth check without loading state
    if (protectedRoute) {
      if (!isAuthenticated) {
        toast.error('Please sign in to access this page', {
          style: {
            background: '#4a1f1f',
            color: '#ffffff',
            border: '1px solid #ef4444',
          },
        });
        router.replace('/signin');
        return;
      }
      
      // Role-based access control
      if (requiredRole) {
        const hasAccess = requiredRole === 'tester' && user?.role === 'tester' ||
                        requiredRole === 'maintainer' && (user?.role === 'maintainer' || user?.role === 'project_owner');
        
        if (!hasAccess) {
          toast.error(`Access denied. ${requiredRole} access required.`, {
            style: {
              background: '#4a1f1f',
              color: '#ffffff',
              border: '1px solid #ef4444',
            },
          });
          
          const redirectPath = user?.role === 'tester' ? '/tester/Dashboard' : 
                              (user?.role === 'maintainer' || user?.role === 'project_owner') ? '/maintainer/dashboard' : 
                              '/signin';
          router.replace(redirectPath);
          return;
        }
      }
    }
    
    if (authRoute && isAuthenticated) {
      // Silently redirect authenticated users away from auth pages
      const redirectPath = user?.role === 'tester' ? '/tester/Dashboard' : 
                          (user?.role === 'maintainer' || user?.role === 'project_owner') ? '/maintainer/dashboard' : '/';
      router.replace(redirectPath);
      return;
    }
  }, [isAuthenticated, user, router, protectedRoute, authRoute, requiredRole]);

  // Always render children immediately - no loading state
  return <>{children}</>;
}