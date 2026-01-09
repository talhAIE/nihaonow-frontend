"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import AuthSidebar from '@/components/AuthSidebar'; // We will repurpose or import Sidebar directly
import Sidebar from '@/components/Sidebar';
import ConditionalHeader from '@/components/ConditionalHeader';
import { useAppContext } from '@/context/AppContext';
import { useAuthProtection } from '@/hooks/useAuthProtection';
import { Loader2 } from 'lucide-react';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useAppContext();
  
  // Protect Student Routes
  const { isAuthenticated, isLoading } = useAuthProtection({
    redirectTo: "/login",
  });

  if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      );
  }

  // We can render Sidebar directly here since we know it's the student area
  return (
    <div className="flex min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[280px] flex-shrink-0 m-4">
         <Sidebar />
      </div>

      {/* Mobile Header logic is inside ConditionalHeader or we can place it here */}
      
      <main className="flex-1 w-full transition-all duration-200 pt-0 px-4 md:px-8 py-8 overflow-x-hidden md:w-[calc(100%-280px)]" >
          {/* Mobile Header */}
          <div className="md:hidden mb-6">
             <ConditionalHeader />
          </div>
          
          <div className="max-w-full">
              {children}
          </div>
      </main>
    </div>
  );
}
