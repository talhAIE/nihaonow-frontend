'use client';
import React from 'react'
import { usePathname } from 'next/navigation';
import AuthSidebar from './AuthSidebar'
import ConditionalHeader from './ConditionalHeader'
import { useAppContext } from '@/context/AppContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { state } = useAppContext();
    const isScenarioPath = pathname?.includes("/scenario");
    const isPublicAuthPath =
      pathname &&
      (pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/welcome") ||
        pathname.startsWith("/forget-password") ||
        pathname.startsWith("/reset-password"));
    const shouldShowSidebar = !isScenarioPath && !isPublicAuthPath;

    return (
        <div className="flex min-h-screen">
            {shouldShowSidebar && !state.isLoggingOut && (
                <div className="hidden md:block w-[32px] flex-shrink-0">
                    <AuthSidebar />
                </div>
            )}
            <main className="flex-1 w-full transition-all bg-white duration-200 pt-0 px-4 md:pl-6 md:pr-8 overflow-x-hidden" >
                {!state.isLoggingOut && <ConditionalHeader />}
                <div className="max-w-full">
                    {!state.isLoggingOut && children}
                </div>
            </main>
        </div>
    )
}

export default Layout