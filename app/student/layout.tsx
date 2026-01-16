"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import ConditionalHeader from '@/components/ConditionalHeader';
import { useAuthProtection } from '@/hooks/useAuthProtection';
import { Loader2 } from 'lucide-react';
import { routes } from '@/lib/navigation';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="flex min-h-screen bg-white">
      {/* Desktop Sidebar - Hidden on tablets to prevent cramped layout */}
      <div className="hidden lg:block w-[280px] flex-shrink-0 m-4">
         <Sidebar />
      </div>

      {/* Mobile Header logic is inside ConditionalHeader or we can place it here */}
      
      <main className="flex-1 w-full transition-all duration-200 pt-0 px-4 md:px-8 py-8 overflow-x-hidden lg:w-[calc(100%-280px)]" >
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
