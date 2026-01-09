"use client";

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Users, LogOut, X, Menu, GraduationCap, User } from 'lucide-react';
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

  const displayName = state?.authUser?.username || 'المعلم';
  const isRtl = dir === 'rtl';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen?.(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sidebarOpen, setSidebarOpen]);

  // Mobile menu toggle logic
  const toggleMobileMenu = () => {
    const open = !mobileMenuOpen;
    if (open) setSidebarOpen?.(false);
    setMobileMenuOpen?.(open);
  };

  const offscreenClass = isRtl
    ? (sidebarOpen ? 'translate-x-0' : 'translate-x-full')
    : (sidebarOpen ? 'translate-x-0' : '-translate-x-full');
  
  const posClasses = isRtl ? 'right-0 md:right-0' : 'left-0 md:left-0';

  return (
    <>
      {/* Mobile Menu Button - Fixed */}
      <div className={`md:hidden fixed top-4 ${isRtl ? 'right-4' : 'left-4'} z-50 ${mobileMenuOpen ? 'hidden' : ''}`}>
        <button
          onClick={toggleMobileMenu}
          className="flex items-center gap-2 bg-[#FFCB08] text-[#8D1716] px-3 py-2 rounded-xl shadow-md border-2 border-[#DEA407]"
        >
          <Menu size={20} />
          <span className="font-bold text-sm truncate max-w-[100px]">{displayName}</span>
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen?.(false)}
      />

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out ${offscreenClass} ${posClasses} md:translate-x-0 w-[280px] bg-[#FFCB08] shadow-xl flex flex-col md:static md:h-screen md:rounded-l-[32px] md:my-4 md:mr-4`}
      >
        {/* User Profile Section */}
        <div className="flex flex-col items-center pt-10 pb-8">
           <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center mb-4 relative overflow-hidden">
             {/* Placeholder Avatar or User Image */}
             {state?.authUser?.image ? (
                <Image src={state.authUser.image} alt="User" fill className="object-cover" />
             ) : (
                <div className="w-full h-full bg-[#8D1716] flex items-center justify-center text-white text-3xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                </div>
             )}
           </div>
           <h2 className="text-white text-2xl font-black">{displayName}</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/teacher' && pathname.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen?.(false)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-[#1F1F1F] shadow-md font-bold' 
                        : 'text-[#8D1716]/80 hover:bg-white/20 hover:text-[#8D1716] font-medium'
                    }`}
                  >
                    <item.Icon size={24} className={isActive ? 'text-[#1F1F1F]' : 'text-current'} />
                    <span className="text-lg">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-6 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-white/90 hover:bg-white text-[#CA495A] py-3 rounded-xl shadow-sm transition-all font-bold group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* Close Button (Mobile) */}
        <button
          onClick={() => setSidebarOpen?.(false)}
          className="md:hidden absolute top-4 left-4 p-2 text-[#8D1716] hover:bg-black/10 rounded-full"
        >
          <X size={24} />
        </button>
      </aside>
    </>
  );
}
