"use client";

import React, { useEffect } from 'react';
import { Home, Trophy, Award, Users, User, LogOut, X ,Medal,LayoutDashboard,BookCheck,TrophyIcon, Menu } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/student/dashboard', label: 'لوحة القيادة', Icon: LayoutDashboard },
  { href: '/units', label: 'الوحدات', Icon: BookCheck },
  // { href: '/achievements', label: 'الإنجازات', Icon: TrophyIcon },
  { href: '/leaderboard', label: 'المتصدرين', Icon: Medal },
  { href: '/account', label: 'حساب المستخدم', Icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state, sidebarOpen, setSidebarOpen, dir, mobileMenuOpen, setMobileMenuOpen, logout, resetOnboarding } = useAppContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      try {
        resetOnboarding();
      } catch (err) { }
      setSidebarOpen?.(false);
      setMobileMenuOpen?.(false);
      router.push('/login');
      // Reset logout state after a short delay to ensure navigation completes
      setTimeout(() => {
        try {
          // This will be handled by the login page loading
        } catch (err) {}
      }, 100);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  const displayName = state?.user || state?.authUser?.username || 'جون دو';
  const isRtl = dir === 'rtl';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      try {
        if (window.innerWidth >= 768 && sidebarOpen) {
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
      
      <div className={`md:hidden border border-[blue] fixed top-4 ${isRtl ? 'right-4' : 'left-4'} z-60 ${mobileMenuOpen ? 'hidden' : ''}`}> 
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
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-200 md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setSidebarOpen?.(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`fixed top-4 z-50 transform transition-transform duration-300 ease-in-out ${offscreenClass} ${posClasses} md:translate-x-0 w-[280px] md:w-[260px] lg:w-[280px] bg-[#35AB4E] rounded-[20px] shadow-lg overflow-hidden flex flex-col`}
        style={{ height: 'fit-content' }}
      >
          <div className="flex flex-col items-center pt-6 pb-4 px-4">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-md">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
          </div>
          <div className="text-white font-bold text-xl mb-2 truncate">{displayName}</div>
        </div>

        <nav className="px-4 py-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                             (item.href === '/student/dashboard' && pathname === '/') ||
                             (item.href === '/leaderboard' && pathname.startsWith('/leaderboard'));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center ${isRtl ? 'flex-row-reverse' : 'flex-row'} px-6 py-4 h-[70px] gap-4 rounded-xl transition-all ${isActive
                      ? 'bg-white/10 text-white shadow-md scale-[1.02]'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <span className={`${isRtl ? 'text-right' : 'text-left'} text-lg font-medium truncate flex-1`}>
                      {item.label}
                    </span>
                    <span className="w-8 h-8 flex items-center justify-center shrink-0">
                      <item.Icon size={24} className={isActive ? 'text-white' : 'text-white/80'} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3">
          <button
            onClick={() => handleLogout()}
            aria-label="Logout"
            className={`w-[90%] mx-auto min-h-[56px] flex items-center ${isRtl ? 'flex-row' : 'flex-row-reverse'} px-4 py-2 rounded-[12px] bg-[#FBD4D3] text-[#8D1716] transition-colors`}
          >
            <span className="text-[18px] font-semibold leading-normal tracking-[0%] flex-1 text-ellipsis overflow-hidden">تسجيل الخروج</span>
            <span className="w-[28px] flex items-center justify-center shrink-0 whitespace-nowrap">
              <LogOut size={20} className="text-[#8D1716]" />
            </span>
          </button>
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} p-1 rounded hover:bg-white/10 md:hidden text-white`}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </aside>
    </>
  );
}