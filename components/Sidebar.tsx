"use client";

import React, { useEffect } from 'react';
import { Trophy, User, LogOut, X, Medal, LayoutDashboard, BookCheck, Menu, Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/lib/navigation';
import Link from 'next/link';
import { userApi } from '@/lib/services/user';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/student/dashboard', label: 'لوحة التحكم', Icon: LayoutDashboard },
  { href: '/student/units', label: 'الوحدات التدريبية', Icon: BookCheck },
  { href: '/student/leaderboard', label: 'قائمة المتفوقين', Icon: Trophy },
  { href: '/student/achievements', label: 'الشارات التعليمية', Icon: Medal },
  { href: '/student/account', label: 'حساب المستخدم', Icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state, sidebarOpen, setSidebarOpen, dir, mobileMenuOpen, setMobileMenuOpen, logout, resetOnboarding } = useAppContext();
  const { goToLogin } = useNavigation();
  const [isReportLoading, setIsReportLoading] = React.useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      try {
        resetOnboarding();
      } catch (err) { }
      setSidebarOpen?.(false);
      setMobileMenuOpen?.(false);
      goToLogin();
      // Reset logout state after a short delay to ensure navigation completes
      setTimeout(() => {
        try {
          // This will be handled by the login page loading
        } catch (err) { }
      }, 100);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleReportClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isReportLoading) return;

    try {
      setIsReportLoading(true);
      const { url } = await userApi.getMyReportUrl();
      if (url) {
        window.location.href = url;
        toast({
          title: "تم التحميل",
          description: "يتم الآن عرض التقرير",
        });
      }
    } catch (error) {
      console.error("Failed to fetch report URL", error);
      toast({
        title: "خطأ في التحميل",
        description: "تعذر فتح التقرير حالياً",
        variant: "destructive",
      });
    } finally {
      setIsReportLoading(false);
    }
  };
  const displayName = state?.user || state?.authUser?.username || 'جون دو';
  const isRtl = dir === 'rtl';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      try {
        if (window.innerWidth >= 1024 && sidebarOpen) {
          setSidebarOpen?.(false);
        }
      } catch (err) {
        console.error('Error handling resize in Sidebar', err);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sidebarOpen, setSidebarOpen]);

  const offscreenClass = isRtl
    ? (sidebarOpen ? 'translate-x-0' : 'translate-x-full')
    : (sidebarOpen ? 'translate-x-0' : '-translate-x-full');
  const posClasses = isRtl ? 'right-0 md:right-4' : 'left-0 md:left-4';

  return (
    <>

      <div className={`lg:hidden border border-[blue] fixed top-4 ${isRtl ? 'right-4' : 'left-4'} z-60 ${mobileMenuOpen ? 'hidden' : ''}`}>
        <button
          onClick={() => {
            const open = !mobileMenuOpen;
            if (open) setSidebarOpen?.(false);
            setMobileMenuOpen?.(open);
          }}
          className="flex items-center gap-3 bg-[#35AB4E] text-white rounded-[14px] shadow-md"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="w-8 flex items-center justify-center">
            <Menu size={18} />
          </span>
          <span className="text-sm font-semibold truncate">{displayName}</span>
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center ml-2">
            <User size={18} className="text-[#35AB4E]" />
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-200 lg:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setSidebarOpen?.(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside
        id="sidebar-container"
        className={`fixed top-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out ${offscreenClass} ${posClasses} md:translate-x-0 w-[260px] md:w-[260px] lg:w-[280px] bg-[#35AB4E] shadow-lg overflow-hidden flex flex-col lg:h-fit lg:max-h-[calc(100vh-2rem)] lg:top-4 lg:rounded-[2.5rem]`}
      >
        <div className="flex flex-col items-center pt-8 pb-4 px-4 shrink-0">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-md">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
          </div>
          <div className="text-white font-bold text-xl mb-2 truncate">{displayName}</div>
        </div>

        <nav className="px-4 py-3 flex-1 overflow-y-auto min-h-0">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href === '/student/dashboard' && pathname === '/') ||
                (item.href === '/student/leaderboard' && pathname.startsWith('/student/leaderboard'));
              
              // Generate a safe ID suffix from the href
              const idSuffix = item.href.split('/').pop() || 'dashboard';

              return (
                <li key={item.href}>
                  <Link
                    id={`sidebar-${idSuffix}`}
                    href={item.href}
                    className={`flex items-center ${isRtl ? 'flex-row-reverse' : 'flex-row'} px-6 py-4 h-[60px] gap-4 rounded-xl transition-all ${isActive
                      ? 'bg-white text-[#30a849] shadow-md scale-[1.02]'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                    onClick={(e) => {
                      if (item.label === 'إصدار التقرير') {
                        handleReportClick(e);
                      }
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <span className={`${isRtl ? 'text-right' : 'text-left'} text-lg font-medium truncate flex-1`}>
                      {item.label}
                    </span>
                    <span className="w-8 h-8 flex items-center justify-center shrink-0">
                      {item.label === 'إصدار التقرير' && isReportLoading ? (
                        <Loader2 size={24} className="animate-spin text-white/80" />
                      ) : (
                        <item.Icon size={24} className={isActive ? 'text-[#30a849]' : 'text-white/80'} />
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
 
        <div className="p-4 pt-2 shrink-0">
          <button
            id="sidebar-logout"
            onClick={() => handleLogout()}
            aria-label="Logout"
            className={`w-full mx-auto min-h-[56px] flex items-center ${isRtl ? 'flex-row' : 'flex-row-reverse'} px-4 py-2 rounded-[16px] bg-white hover:bg-white/90 transition-colors text-[#eb2625] shadow-sm group mb-2 font-bold`}
          >
            <span className="text-[18px] font-bold leading-normal tracking-[0%] flex-1 text-ellipsis overflow-hidden">تسجيل الخروج</span>
            <span className="w-[28px] flex items-center justify-center shrink-0 whitespace-nowrap">
              <LogOut size={20} className="text-[#eb2625] group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} p-1 rounded hover:bg-white/10 lg:hidden text-white`}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </aside>
    </>
  );
}