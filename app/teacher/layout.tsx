"use client";

import { useAuthProtection } from "@/hooks/useAuthProtection";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuthProtection({
    redirectTo: "/login",
  });
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
       if (!isAuthenticated) {
          return;
       }
       
       // Check user object or localStorage for role persistence
       // @ts-ignore
       if (user?.role === 'student' && localStorage.getItem('userRole') !== 'teacher') {
          router.push('/student/dashboard');
       } else {
          setIsAuthorized(true);
       }
    }
  }, [isLoading, isAuthenticated, user, router]);

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
      <main className="flex-1 transition-all duration-300 ease-in-out w-full md:w-[calc(100%-280px)]">
        <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
