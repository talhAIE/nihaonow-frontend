'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { routes } from './navigation';
import { useAppContext } from '@/context/AppContext';

/**
 * Check if localStorage has essential data for the application
 * @returns boolean - true if localStorage has required data, false otherwise
 */
export function hasRequiredLocalStorageData(): boolean {
  if (typeof window === 'undefined') return true; // Skip check on server side
  
  try {
    // Check for essential authentication and user data
    const hasAuthToken = localStorage.getItem('authToken') !== null;
    const hasAuthUser = localStorage.getItem('authUser') !== null;
    const hasUserName = localStorage.getItem('userName') !== null;
    
    // If on login/register/forget-password pages, allow access without auth data
    const publicRoutes = [
      routes.login,
      routes.register,
      routes.forgetPassword,
      routes.home,
      routes.welcome,
      routes.comingSoon,
      routes.onboarding
    ];
    
    return hasAuthToken && hasAuthUser && hasUserName;
  } catch (error) {
    console.error('Error checking localStorage:', error);
    return false;
  }
}

/**
 * Hook to redirect to home page if localStorage is empty on protected routes
 * This should be used in layouts or pages that require authentication
 */
export function useLocalStorageRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useAppContext();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Skip check on server side
    if (typeof window === 'undefined') return;

    // Public routes that don't require localStorage data
    const publicRoutes = [
      routes.login,
      routes.register,
      routes.forgetPassword,
      routes.home,
      routes.welcome,
      routes.comingSoon,
      routes.onboarding
    ];

    // If current route is public, don't redirect
    if (publicRoutes.includes(pathname as any)) return;

    // Only check localStorage on protected routes (student/*, teacher/*)
    const isProtectedRoute = pathname.startsWith('/student/') || pathname.startsWith('/teacher/');
    
    if (!isProtectedRoute) return;

    // Wait a bit for AppContext to initialize after login
    const checkAuth = () => {
      // First check if AppContext says user is authenticated
      if (state.isAuthenticated && state.authUser) {
        console.log('User is authenticated according to AppContext, allowing access');
        setHasChecked(true);
        return;
      }

      // If AppContext says not authenticated, check localStorage as fallback
      if (!hasRequiredLocalStorageData()) {
        console.log('No localStorage data found on protected route, redirecting to home page');
        router.push(routes.home);
      } else {
        console.log('localStorage data found, allowing access');
      }
      setHasChecked(true);
    };

    // Add a small delay to allow AppContext to update after login
    const timer = setTimeout(checkAuth, 500);
    
    return () => clearTimeout(timer);
  }, [pathname, router, state.isAuthenticated, state.authUser]);

  return hasChecked;
}
