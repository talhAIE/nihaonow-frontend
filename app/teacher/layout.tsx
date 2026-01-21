"use client";

import { useAuthProtection } from "@/hooks/useAuthProtection";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import TeacherHeader from "@/components/teacher/TeacherHeader";
import { Loader2 } from "lucide-react";
import { routes } from "@/lib/navigation";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, isAuthorized } = useAuthProtection({
    redirectTo: "/login",
    allowedRoles: ["teacher"],
    unauthorizedRedirectTo: routes.student.dashboard,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

    return (
        <div className="flex min-h-screen bg-white" dir="rtl">
            {/* Desktop Sidebar - Hidden on mobile/tablet */}
            <div className="hidden lg:block w-[300px] flex-shrink-0 pt-4 pr-4">
                <TeacherSidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full transition-all duration-300 ease-in-out lg:w-[calc(100%-300px)]">
                {/* Mobile/Tablet Header */}
                <div className="mb-6">
                    <TeacherHeader />
                </div>

                <div className="px-4 md:px-6 w-full max-w-full mx-auto pb-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
