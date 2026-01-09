"use client";

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, LogOut, X, Menu, GraduationCap, User } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/teacher', label: 'لوحة القيادة', Icon: LayoutDashboard },
  { href: '/teacher/students', label: 'طلابي', Icon: GraduationCap },
  { href: '/teacher/account', label: 'حساب المستخدم', Icon: User },
];

export default function TeacherSidebar() {
  const pathname = usePathname();
  const { state, sidebarOpen, setSidebarOpen, dir, mobileMenuOpen, setMobileMenuOpen, logout } = useAppContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const displayName = state?.authUser?.username || 'جون دو';
  const isRtl = dir === 'rtl';

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

  const toggleMobileMenu = () => {
    const open = !mobileMenuOpen;
    if (open) setSidebarOpen?.(false);
    setMobileMenuOpen?.(open);
  };

  const offscreenClass = isRtl
    ? (sidebarOpen ? 'translate-x-0' : 'translate-x-full')
    : (sidebarOpen ? 'translate-x-0' : '-translate-x-full');
  
  const posClasses = isRtl ? 'right-0' : 'left-0';

  return (
    <>
      {/* Mobile Menu Button - Fixed */}
      <div className={`lg:hidden fixed top-6 ${isRtl ? 'right-6' : 'left-6'} z-50 ${mobileMenuOpen ? 'hidden' : ''}`}>
        <button
          onClick={toggleMobileMenu}
          className="flex flex-row-reverse items-center gap-3 bg-[#FFCB08] text-[#8D1716] px-4 py-3 rounded-2xl shadow-xl border-2 border-[#DEA407] hover:scale-105 transition-transform"
        >
          <Menu size={24} />
          <span className="font-black text-sm truncate max-w-[120px]">{displayName}</span>
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen?.(false)}
      />

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-0 bottom-0 z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${offscreenClass} ${posClasses} lg:translate-x-0 w-[300px] bg-[#FFCB08] flex flex-col lg:static lg:h-[calc(100vh-2rem)] lg:rounded-[48px] lg:my-4 lg:mr-4 shadow-2xl shadow-yellow-200/50`}
      >
        {/* User Profile Section */}
        <div className="flex flex-col items-center pt-16 pb-12">
           <div className="w-28 h-28 rounded-[40px] bg-white border-8 border-[#FFD945] shadow-2xl flex items-center justify-center mb-6 relative overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
             {state?.authUser?.image ? (
                <Image src={state.authUser.image} alt="User" fill className="object-cover" />
             ) : (
                <div className="w-full h-full bg-[#8D1716] flex items-center justify-center text-white text-4xl font-black">
                    {displayName.charAt(0).toUpperCase()}
                </div>
             )}
           </div>
           <h2 className="text-[#8D1716] text-3xl font-black tracking-tight">{displayName}</h2>
           <div className="mt-1 px-3 py-1 bg-[#8D1716]/10 rounded-full">
              <span className="text-[#8D1716] text-[10px] font-black uppercase tracking-widest">معلم معتمد</span>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/teacher' && pathname.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen?.(false)}
                    className={`group flex flex-row-reverse items-center gap-5 px-6 py-5 rounded-[24px] transition-all duration-300 ${
                      isActive 
                        ? 'bg-white text-[#1F1F1F] shadow-2xl shadow-yellow-600/20 font-black scale-[1.02]' 
                        : 'text-[#8D1716]/70 hover:bg-white/30 hover:text-[#8D1716] font-bold'
                    }`}
                  >
                    <item.Icon size={26} className={isActive ? 'text-[#1F1F1F]' : 'text-current transition-transform group-hover:scale-110'} />
                    <span className="text-xl">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-8 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex flex-row-reverse items-center justify-center gap-4 bg-white/90 hover:bg-white text-[#CA495A] py-5 rounded-[28px] shadow-lg hover:shadow-xl transition-all font-bold group border-b-4 border-[#FBD4D3] active:border-b-0 active:translate-y-1"
          >
            <LogOut size={24} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-lg">تسجيل الخروج</span>
          </button>
        </div>

        {/* Close Button (Mobile) */}
        <button
          onClick={() => setSidebarOpen?.(false)}
          className="lg:hidden absolute top-6 left-6 p-3 text-[#8D1716] bg-white/20 hover:bg-white/40 rounded-2xl transition-colors"
        >
          <X size={28} />
        </button>
      </aside>
    </>
  );
}
