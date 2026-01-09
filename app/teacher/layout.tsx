"use client";

import { useAuthProtection } from "@/hooks/useAuthProtection";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigation } from '@/lib/navigation';
import { useAppContext } from "@/context/AppContext";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuthProtection({
    redirectTo: "/login",
  });
  const { goToStudentDashboard } = useNavigation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
       if (!isAuthenticated) {
          return;
       }
       
       const userRole = String(user?.role || '').toLowerCase();
       if (userRole === 'student' && localStorage.getItem('userRole') !== 'teacher') {
           goToStudentDashboard();
       } else {
          setIsAuthorized(true);
       }
    }
  }, [isLoading, isAuthenticated, user, goToStudentDashboard]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Optional: Block rendering if not authorized (student trying to access)
//   if (!isAuthorized) return null; 

  return (
    <div className="flex min-h-screen bg-white" dir="rtl">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 ease-in-out w-full lg:w-[calc(100%-300px)]">
        <div className="p-4 md:p-10 w-full max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
