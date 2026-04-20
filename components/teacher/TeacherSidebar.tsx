"use client";

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, LogOut, X, Menu, GraduationCap, User } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/lib/navigation';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/teacher', label: { ar: 'لوحة القيادة', en: 'Dashboard' }, Icon: LayoutDashboard },
  { href: '/teacher/students', label: { ar: 'طلابي', en: 'Students' }, Icon: GraduationCap },
  { href: '/teacher/account', label: { ar: 'حساب المستخدم', en: 'Account' }, Icon: User },
];

export default function TeacherSidebar() {
  const pathname = usePathname();
  const { state, sidebarOpen, setSidebarOpen, dir, mobileMenuOpen, setMobileMenuOpen, logout } = useAppContext();
  const { goToLogin } = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      setSidebarOpen?.(false);
      setMobileMenuOpen?.(false);
      goToLogin();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isRtl = dir === 'rtl';
  const displayName = state?.authUser?.username || (isRtl ? 'المعلم' : 'Teacher');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) {
        setSidebarOpen?.(false);
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
      {/* Floating Mobile Toggle (Matches Student Sidebar) */}
      <div className={`lg:hidden border border-transparent fixed top-4 ${isRtl ? 'right-4' : 'left-4'} z-50 ${mobileMenuOpen ? 'hidden' : ''}`}> 
        <button
          onClick={() => {
            const open = !mobileMenuOpen;
            if (open) setSidebarOpen?.(false);
            setMobileMenuOpen?.(open);
          }}
          className="flex items-center gap-3 bg-[#FFCB08] text-[#8D1716] rounded-[14px] shadow-md px-3 py-2"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="w-8 flex items-center justify-center">
            <Menu size={18} />
          </span>
          <span className="text-sm font-semibold truncate max-w-[100px]">{displayName}</span>
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center ml-2 border border-[#DEA407]">
            <User size={18} className="text-[#8D1716]" />
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-200 lg:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen?.(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`fixed top-4 z-50 transform transition-transform duration-300 ease-in-out ${offscreenClass} ${posClasses} md:translate-x-0 w-[260px] md:w-[260px] lg:w-[280px] bg-[#FFCB08] rounded-[20px] shadow-lg overflow-hidden flex flex-col`}
        style={{ height: 'fit-content', maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* User Profile Section */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4">
           <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-md border-4 border-[#FFD945]">
             <div className="w-16 h-16 rounded-full bg-[#8D1716] flex items-center justify-center text-white overflow-hidden">
                {state?.authUser?.image ? (
                    <Image src={state.authUser.image} alt="User" width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                    <User size={32} />
                )}
             </div>
           </div>
           <div className="text-[#8D1716] font-bold text-xl mb-2 truncate">{displayName}</div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/teacher' && pathname.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center ${isRtl ? 'flex-row-reverse' : 'flex-row'} px-6 py-4 h-[70px] gap-4 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-white text-[#1F1F1F] shadow-md scale-[1.02] font-black' 
                        : 'text-[#8D1716]/70 hover:bg-white/30 hover:text-[#8D1716] font-bold'
                    }`}
                    onClick={() => {
                        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                            setSidebarOpen?.(false);
                        }
                    }}
                  >
                    {isRtl ? (
                      <>
                        <span className="w-8 h-8 flex items-center justify-center shrink-0">
                          <item.Icon size={24} className={isActive ? 'text-[#1F1F1F]' : 'text-current'} />
                        </span>
                        <span className="text-right text-lg font-medium truncate flex-1">
                          {item.label.ar}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-8 h-8 flex items-center justify-center shrink-0">
                          <item.Icon size={24} className={isActive ? 'text-[#1F1F1F]' : 'text-current'} />
                        </span>
                        <span className="text-left text-lg font-medium truncate flex-1">
                          {item.label.en}
                        </span>
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 mt-auto">
          <button
            onClick={handleLogout}
            className={`w-[90%] mx-auto min-h-[56px] flex items-center ${isRtl ? 'flex-row' : 'flex-row'} px-4 py-2 rounded-[12px] bg-[#FBD4D3] text-[#8D1716] transition-colors border-b-4 border-[#F9C3C2] active:border-b-0 active:translate-y-1`}
          >
            <span className="w-[28px] flex items-center justify-center shrink-0 whitespace-nowrap">
              <LogOut size={20} className="text-[#8D1716]" />
            </span>
            <span className={`text-[18px] font-semibold leading-normal tracking-[0%] flex-1 text-ellipsis overflow-hidden ${isRtl ? "text-right" : "text-left"}`}>
              {isRtl ? 'تسجيل الخروج' : 'Log out'}
            </span>
          </button>
        </div>

        {/* Close Button (Mobile) */}
        <button
          onClick={() => setSidebarOpen?.(false)}
          className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} p-1 rounded hover:bg-black/10 lg:hidden text-[#8D1716]`}
        >
          <X size={20} />
        </button>
      </aside>
    </>
  );
}
