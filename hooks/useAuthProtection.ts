'use client';

import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useNavigation } from '@/lib/navigation';

interface UseAuthProtectionOptions {
  redirectTo?: string;
  allowedRoles?: string[];
  unauthorizedRedirectTo?: string;
}

/**
 * Hook to protect routes that require authentication
 * Usage: useAuthProtection() at the top of your protected page component
 * 
 * @param options - Configuration options
 * @param options.redirectTo - Where to redirect if not authenticated (default: '/login')
 * @param options.allowedRoles - Array of allowed roles (future enhancement)
 * 
 * @returns An object with:
 * - isAuthenticated: boolean - Whether user is authenticated
 * - isLoading: boolean - Whether auth check is in progress
 * - user: User object or null
 */
export function useAuthProtection(options: UseAuthProtectionOptions = {}) {
  const { goTo, goToLogin } = useNavigation();
  const { state } = useAppContext();
  const { redirectTo, allowedRoles, unauthorizedRedirectTo } = options;

  useEffect(() => {
    // Only check after state is initialized
    // Delay to allow AppContext to load from storage
    const checkAuth = () => {
      if (!state.isAuthenticated) {
        redirectTo ? goTo(redirectTo) : goToLogin();
        return;
      }

      if (allowedRoles && allowedRoles.length > 0) {
        const userRole = String(state.authUser?.role || '').toLowerCase();
        const normalizedAllowed = allowedRoles.map((r) => String(r).toLowerCase());
        const isAllowed = normalizedAllowed.includes(userRole);

        if (!isAllowed) {
          if (unauthorizedRedirectTo) {
            goTo(unauthorizedRedirectTo);
          } else {
            goToLogin();
          }
        }
      }
    };

    // Small delay to ensure AppContext has loaded
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [state.isAuthenticated, state.authUser, redirectTo, allowedRoles, unauthorizedRedirectTo, goTo, goToLogin]);

  const userRole = String(state.authUser?.role || '').toLowerCase();
  const normalizedAllowed = (allowedRoles || []).map((r) => String(r).toLowerCase());
  const isAuthorized =
    state.isAuthenticated && (normalizedAllowed.length === 0 || normalizedAllowed.includes(userRole));

  return {
    isAuthenticated: state.isAuthenticated,
    isLoading: !state.isInitialized, // Check initialization status
    user: state.authUser,
    isAuthorized,
  };
}

/**
 * Hook to get current auth state (doesn't redirect)
 * Usage: const { isAuthenticated, user } = useAuth();
 */
export function useAuth() {
  const { state } = useAppContext();

  return {
    isAuthenticated: state.isAuthenticated,
    user: state.authUser,
    email: state.authUser?.email,
    username: state.authUser?.username,
  };
}

/**
 * Hook to handle logout
 * Usage: const { logout } = useLogout();
 */
export function useLogout() {
  const { goToLogin } = useNavigation();
  const { logout: contextLogout } = useAppContext();

  const logout = async () => {
    try {
      await contextLogout();
    } catch (err) {
      // ignore
    }
    goToLogin();
  };

  return { logout };
}
