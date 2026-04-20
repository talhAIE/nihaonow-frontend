"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import AuthSidebar from '@/components/AuthSidebar'; // We will repurpose or import Sidebar directly
import Sidebar from '@/components/Sidebar';
import ConditionalHeader from '@/components/ConditionalHeader';
import { useAppContext } from '@/context/AppContext';
import { useAuthProtection } from '@/hooks/useAuthProtection';
import { Loader2 } from 'lucide-react';
import { routes } from '@/lib/navigation';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, dir } = useAppContext();
  const isRtl = dir === "rtl";
  
  // Protect Student Routes
  const { isAuthenticated, isLoading, isAuthorized } = useAuthProtection({
    redirectTo: "/login",
    allowedRoles: ["student"],
    unauthorizedRedirectTo: routes.teacher.dashboard,
  });

  if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      );
  }

  if (!isAuthenticated || !isAuthorized) {
    return null;
  }

  // We can render Sidebar directly here since we know it's the student area
  return (
    <div className="flex min-h-screen bg-white" dir={dir} lang={isRtl ? "ar" : "en"}>
      {/* Desktop Sidebar - Hidden on tablets to prevent cramped layout */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Header logic is inside ConditionalHeader or we can place it here */}
      
      <main className={`flex-1 w-full transition-all duration-200 pt-0 px-4 md:px-8 py-8 overflow-x-hidden ${isRtl ? "lg:pr-[320px]" : "lg:pl-[320px]"}`}>
          {/* Mobile/Tablet Header */}
          <div className="lg:hidden mb-6">
             <ConditionalHeader />
          </div>
          
          <div className="max-w-full">
              {children}
          </div>
      </main>
    </div>
  );
}
