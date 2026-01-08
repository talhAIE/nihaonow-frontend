"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Trophy, 
  Star, 
  Scroll, 
  Download, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Lock,
  RefreshCw,
  AlertCircle,
  Flame,
  Calendar as CalendarIcon,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { achievementsApi } from "@/lib/services/achievements";
import { useAppContext } from "@/context/AppContext";
import { Badge, Certificate } from "@/lib/types";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const categoryStyles: Record<string, { theme: string; primary: string; secondary: string; border: string; bg: string }> = {
  login: { theme: 'purple', primary: 'text-purple-600', secondary: 'bg-purple-50', border: 'border-purple-100', bg: 'bg-purple-600' },
  streak: { theme: 'orange', primary: 'text-orange-500', secondary: 'bg-orange-50', border: 'border-orange-100', bg: 'bg-orange-500' },
  topics: { theme: 'blue', primary: 'text-blue-600', secondary: 'bg-blue-50', border: 'border-blue-100', bg: 'bg-blue-600' },
  time: { theme: 'teal', primary: 'text-teal-600', secondary: 'bg-teal-50', border: 'border-teal-100', bg: 'bg-teal-600' },
  points: { theme: 'amber', primary: 'text-amber-500', secondary: 'bg-amber-50', border: 'border-amber-100', bg: 'bg-amber-500' },
};

const categoryNames: Record<string, string> = {
  login: "الاستمرارية",
  streak: "سلسلة النشاط",
  topics: "المواضيع المكتملة",
  time: "وقت التعلم",
  points: "النقاط المحصودة",
};

const categoryIcons: Record<string, any> = {
  login: CalendarIcon,
  streak: Flame,
  topics: BookOpen,
  time: Clock,
  points: Trophy,
};

export default function AchievementsPage() {
  const { state } = useAppContext();
  const userId = state.authUser?.id;
  
  const [achievements, setAchievements] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<{ earned: Certificate[]; locked: Certificate[] }>({ earned: [], locked: [] });
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const [downloading, setDownloading] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const authUserId = state.authUser?.id;
      if (!authUserId) return;

      setLoading(true);
      setError(null);

      const [achData, certData] = await Promise.all([
        achievementsApi.getAchievements(Number(authUserId)),
        achievementsApi.getCertificates(Number(authUserId))
      ]);

      setAchievements(achData.achievements || []);
      setUserStats(achData.userStats || {});
      setCertificates(certData.certificates || { earned: [], locked: [] });
    } catch (err: any) {
      console.error("Error fetching achievements:", err);
      setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [state.authUser?.id]);

  useEffect(() => {
    if (state.authUser?.id) {
      fetchData();
    }
  }, [state.authUser?.id, fetchData]);

  const handleDownloadCertificate = async (certId: number, certName: string) => {
    setDownloading(certId);
    try {
      const authUserId = state.authUser?.id;
      if (!authUserId) {
        toast({
          title: "خطأ",
          description: "معرف المستخدم غير متوفر.",
          variant: "destructive",
        });
        return;
      }

      await achievementsApi.downloadCertificate(Number(authUserId), certId);

      toast({
        title: "تم التحميل بنجاح",
        description: `تم تحميل شهادة ${certName}`,
      });
    } catch (err) {
      console.error("Error downloading certificate:", err);
      toast({
        title: "خطأ في التحميل",
        description: "تعذر تحميل الشهادة حالياً",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleSync = async () => {
    const authUserId = state.authUser?.id;
    if (!authUserId || syncing) return;
    try {
      setSyncing(true);
      await achievementsApi.syncAchievements(Number(authUserId));
      await fetchData();
    } catch (err) {
      console.error("Error syncing achievements:", err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 h-[80vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35AB4E] mx-auto"></div>
          <p className="text-gray-500 font-medium">جاري تحميل إنجازاتك...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 h-[80vh]">
        <div className="text-center space-y-4 bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-red-900">عذراً، حدث خطأ</h2>
          <p className="text-red-700">{error}</p>
          <Button onClick={fetchData} className="bg-red-600 hover:bg-red-700 text-white">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  const totalBadgesEarned = achievements.reduce((sum, cat) => sum + cat.earned.length, 0);
  const totalBadgesAvailable = achievements.reduce((sum, cat) => sum + (cat.earned.length + cat.available.length), 0);
  const masteryProgress = totalBadgesAvailable > 0 
    ? Math.round((totalBadgesEarned / totalBadgesAvailable) * 100) 
    : 0;

  return (
    <div className="flex-1 space-y-10 p-4 sm:p-8 pt-6 bg-gray-50/30" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-almarai-extrabold">الإنجازات</h2>
          <p className="text-gray-500 mt-1">احتفل بتقدمك وقم بتحميل شهاداتك المعتمدة.</p>
        </div>
        <Button 
          onClick={handleSync} 
          disabled={syncing}
          variant="outline" 
          className="flex items-center gap-2 border-slate-200 hover:bg-white shadow-sm transition-all hover:border-[#35AB4E] rounded-xl px-6"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'جاري المزامنة...' : 'تحديث البيانات'}
        </Button>
      </div>

      {/* Summary Card */}
      <section className="bg-gradient-to-br from-[#1E6E2F] via-[#35AB4E] to-[#8DD09B] rounded-[28px] p-8 sm:p-10 text-white shadow-xl shadow-green-900/10 overflow-hidden relative border-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-right flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/30 text-sm font-bold">
              <Trophy className="h-4 w-4" />
              إنجازات الطالب
            </div>
            <h3 className="text-4xl font-extrabold font-almarai-extrabold">طريق الإتقان</h3>
            <p className="opacity-90 max-w-xl text-lg leading-relaxed">
              لقد قطعت شوطاً رائعاً في رحلتك التعليمية! استمر في التقدم لفتح المزيد من الأوسمة والشهادات الاحترافية التي توثق مهاراتك.
            </p>
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white/80">نسبة التقدم الكلية</span>
                <span className="font-black text-2xl">{masteryProgress}%</span>
              </div>
              <div className="w-full bg-black/10 h-5 rounded-full overflow-hidden p-1 border border-white/10">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.8)] relative" 
                  style={{ width: `${masteryProgress || 5}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
            {[
              { label: 'الأوسمة', value: totalBadgesEarned, color: 'bg-white/15' },
              { label: 'الشهادات', value: certificates.earned.length, color: 'bg-white/15' },
              { label: 'النقاط', value: userStats?.totalPoints || userStats?.xp || 0, color: 'bg-yellow-400/20 text-yellow-300' }
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center justify-center p-6 rounded-[22px] backdrop-blur-md border border-white/20 min-w-[140px] ${stat.color}`}>
                <p className="text-sm font-bold opacity-80 mb-1">{stat.label}</p>
                <p className="text-4xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <Trophy className="absolute -bottom-20 -left-20 h-80 w-80 text-white/10 rotate-12 pointer-events-none" />
      </section>

      {/* Badges by Category */}
      <div className="space-y-16">
        {achievements.map((group) => {
          const Icon = categoryIcons[group.category] || Star;
          const style = categoryStyles[group.category] || { primary: 'text-gray-600', secondary: 'bg-gray-50', border: 'border-gray-100', theme: 'gray' };
          
          return (
            <section key={group.category} className="space-y-8">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className={`p-4 ${style.secondary} rounded-2xl shadow-sm border ${style.border}`}>
                  <Icon className={`h-8 w-8 ${style.primary}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900 font-almarai-extrabold">{categoryNames[group.category] || group.category}</h3>
                  <p className="text-gray-500 text-sm">مجموعة {categoryNames[group.category] || group.category} والمهارات المكتسبة</p>
                </div>
                <div className="mr-auto text-left">
                   <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-tighter">الحالة العامة</div>
                   <span className={`text-sm font-black ${style.secondary} ${style.primary} px-4 py-2 rounded-full border ${style.border}`}>
                    {group.earned.length} / {group.earned.length + group.available.length} إنجاز
                  </span>
                </div>
              </div>
              
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Earned Badges */}
                {group.earned.map((badge: Badge) => (
                  <div key={badge.id} className={`group bg-white border-2 hover:border-${style.theme}-400 rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-5 relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 w-24 h-24 ${style.secondary} opacity-40 blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-60 transition-opacity`} />
                    
                    <div className="relative">
                      <div className={`${style.secondary} ${style.primary} p-6 rounded-full ring-8 ring-${style.theme}-50 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="h-12 w-12" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 z-10">
                      <h4 className="font-black text-xl text-gray-900 group-hover:text-[#35AB4E] transition-colors">{badge.name}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{badge.description}</p>
                    </div>
                    
                    <div className="pt-4 w-full flex justify-between items-center z-10">
                      <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg border border-yellow-100 font-black text-xs">
                        <Star className="h-3 w-3 fill-yellow-400" />
                        +{badge.pointValue} XP
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إنجاز مكتمل</span>
                    </div>
                  </div>
                ))}

                {/* Available Badges */}
                {group.available.map((badge: Badge) => (
                  <div key={badge.id} className="bg-white/50 border-2 border-dashed border-gray-100 rounded-[24px] p-8 flex flex-col items-center text-center space-y-5 opacity-70 grayscale hover:grayscale-0 transition-all duration-300 group">
                    <div className="relative">
                      <div className="bg-gray-100 text-gray-300 p-6 rounded-full group-hover:bg-gray-200 transition-colors">
                        <Icon className="h-12 w-12" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-sm">
                        <Lock className="h-6 w-6 text-gray-300" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-xl text-gray-400">{badge.name}</h4>
                      <p className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors">{badge.description}</p>
                    </div>
                    <div className="pt-4 w-full flex justify-between items-center">
                      <div className="bg-gray-50 text-gray-400 px-3 py-1 rounded-lg border border-gray-100 font-bold text-xs uppercase">
                        +{badge.pointValue} XP
                      </div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">غير مكتمل</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Certificates Section */}
      <section className="space-y-8 mt-10">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="p-4 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
            <Scroll className="h-8 w-8 text-blue-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-gray-900 font-almarai-extrabold">الشهادات المعتمدة</h3>
            <p className="text-gray-500 text-sm">توثيق رسمي لرحلتك التعليمية وإتقانك للغة العربية</p>
          </div>
        </div>

        <div className="grid gap-6">
          {certificates.earned.map((cert) => (
            <div key={cert.id} className="bg-white border-2 border-blue-50 rounded-[28px] p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 transition-all hover:shadow-xl hover:border-blue-200 group relative overflow-hidden">
               <div className="absolute top-0 left-0 w-3 lg:w-4 h-full bg-blue-500" />
               
              <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-right flex-1">
                <div className="relative">
                  <div className="h-24 w-24 bg-blue-50 rounded-[22px] flex items-center justify-center border border-blue-100 shadow-inner group-hover:scale-110 transition-transform">
                    <Scroll className="h-14 w-14 text-blue-600" />
                  </div>
                  <CheckCircle2 className="absolute -top-2 -right-2 h-8 w-8 text-green-500 bg-white rounded-full p-1 shadow-md" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-gray-900 font-almarai-extrabold">{cert.name}</h4>
                  <p className="text-gray-500 text-lg">{cert.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-bold bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100">
                      صدرت في {cert.awardedAt ? new Date(cert.awardedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '---'}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                disabled={downloading === cert.id}
                onClick={() => handleDownloadCertificate(cert.id, cert.name)}
                className="w-full lg:w-auto flex items-center gap-3 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white bg-white h-14 px-8 rounded-2xl font-black transition-all shadow-sm active:translate-y-0.5"
              >
                {downloading === cert.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                تحميل شهادة PDF
              </Button>
            </div>
          ))}

          {/* Locked Certificates */}
          {certificates.locked.map((cert) => (
            <div key={cert.id} className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[28px] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 opacity-60 group">
              <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-right flex-1">
                <div className="h-24 w-24 bg-gray-100 rounded-[22px] flex items-center justify-center border border-gray-200">
                  <Lock className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-gray-400 font-almarai-extrabold">{cert.name}</h4>
                  <p className="text-gray-400">{cert.description}</p>
                  <p className="text-sm font-bold text-gray-400 italic bg-gray-100/50 inline-block px-4 py-1 rounded-full">
                    أكمل المتطلبات لفتح هذه الشهادة المتميزة
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-auto text-center bg-gray-100 px-8 py-4 rounded-2xl">
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">قيد الانتظار</p>
              </div>
            </div>
          ))}

          {certificates.earned.length === 0 && certificates.locked.length === 0 && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[32px] p-20 text-center">
              <div className="bg-white p-6 rounded-full shadow-sm border border-gray-50 inline-block mb-6">
                <Scroll className="h-20 w-20 text-gray-200" />
              </div>
              <p className="text-gray-500 font-black text-2xl mb-2">لا توجد شهادات متاحة حالياً</p>
              <p className="text-gray-400 text-lg">استمر في رحلة التعلم والتقدم لفتح الشهادات المعتمدة التي تليق بمستواك.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
