"use client";

import React from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Settings, 
  LogOut, 
  Bell, 
  Globe, 
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

export default function AccountPage() {
  const { state, logout, dir } = useAppContext();
  const user = state.authUser;
  const displayName = state.user || user?.username || "الطالب";
  const userEmail = user?.email || "user@example.com";

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex-1 space-y-10 p-4 sm:p-8 pt-6 bg-white" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-almarai-extrabold">حسابي</h2>
          <p className="text-gray-500 mt-1">إدارة معلوماتك الشخصية وإعدادات الحساب.</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <section className="bg-white rounded-[28px] p-8 sm:p-10 border-2 border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 p-1 bg-white/10 backdrop-blur-sm">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-inner">
                    <User size={64} className="text-white" />
                </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-[#35AB4E] border-2 border-white rounded-full p-2 shadow-lg">
                <Shield className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="text-center md:text-right space-y-2">
            <h3 className="text-4xl font-extrabold font-almarai-extrabold">{displayName}</h3>
            <p className="text-white/80 text-lg flex items-center justify-center md:justify-start gap-2">
              <Mail className="h-5 w-5" />
              {userEmail}
            </p>
            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/30 text-sm font-bold">
                    طالب نشط
                </span>
                <span className="bg-yellow-400/20 text-yellow-300 px-4 py-1.5 rounded-full backdrop-blur-md border border-yellow-400/30 text-sm font-bold">
                    مستوى المبتدئ
                </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Account Details */}
        <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 space-y-6">
                <h4 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4">المعلومات الشخصية</h4>
                
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-tighter">اسم المستخدم</label>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700 font-bold">
                            {displayName}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-tighter">البريد الإلكتروني</label>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700 font-bold">
                            {userEmail}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-tighter">لغة الواجهة</label>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700 font-bold flex items-center justify-between">
                            <span>العربية</span>
                            <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-tighter">حالة العضوية</label>
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-[#1E6E2F] font-bold flex items-center justify-between">
                            <span>نشط</span>
                            <Shield className="h-5 w-5 text-[#35AB4E]" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 space-y-6">
                <h4 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4">الأمان</h4>
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Lock className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">كلمة المرور</p>
                            <p className="text-sm text-gray-500">تم التحديث منذ 3 أشهر</p>
                        </div>
                    </div>
                    <Button variant="outline" disabled className="rounded-xl border-gray-200 opacity-50">تغيير</Button>
                </div>
            </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
            <section className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 space-y-6">
                <h4 className="text-xl font-black text-gray-900">الإعدادات العمة</h4>
                <div className="space-y-4">
                    {[
                        { icon: Bell, label: "التنبيهات", color: "text-purple-600", bg: "bg-purple-50" },
                        { icon: Globe, label: "اللغة والمنطقة", color: "text-blue-600", bg: "bg-blue-50" },
                        { icon: Shield, label: "الخصوصية", color: "text-teal-600", bg: "bg-teal-50" },
                        { icon: Settings, label: "خيارات العرض", color: "text-orange-600", bg: "bg-orange-50" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-default group">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 ${item.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                                    <item.icon className={`h-5 w-5 ${item.color}`} />
                                </div>
                                <span className="font-bold text-gray-700">{item.label}</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                        </div>
                    ))}
                </div>
                
                <div className="pt-6">
                    <Button 
                        onClick={handleLogout}
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-3 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white h-14 rounded-2xl font-black transition-all shadow-sm active:translate-y-0.5"
                    >
                        <LogOut className="h-5 w-5" />
                        تسجيل الخروج
                    </Button>
                </div>
            </section>

            {/* Premium Promo */}
            <section className="bg-white rounded-[28px] p-8 border-2 border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 space-y-4">
                    <h4 className="text-2xl font-black font-almarai-extrabold">نسخة المحترفين</h4>
                    <p className="text-white/90 text-sm leading-relaxed">استمتع بكافة المزايا وتخطى الحدود للوصول إلى الإتقان الكامل.</p>
                    <Button className="w-full bg-white text-orange-600 hover:bg-white/90 rounded-xl font-black shadow-md border-0">قريباً</Button>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}
