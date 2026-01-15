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
  Loader2,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { achievementsApi } from "@/lib/services/achievements";
import { levelsApi } from "@/lib/services/levels";
import { useAppContext } from "@/context/AppContext";
import { Badge, Certificate, LevelDefinition, UserLevelResponse } from "@/lib/types";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import AwardsMap from "@/components/achievements/AwardsMap";
import CertificateScroll from "@/components/achievements/CertificateScroll";

export default function AchievementsPage() {
  const { state } = useAppContext();
  const userId = state.authUser?.id;

  const [achievements, setAchievements] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<{ earned: Certificate[]; locked: Certificate[] }>({ earned: [], locked: [] });
  const [userStats, setUserStats] = useState<any>(null);
  const [userLevel, setUserLevel] = useState<any>(null);
  const [levelDefs, setLevelDefs] = useState<LevelDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'awards' | 'certificates'>('awards');

  const { toast } = useToast();
  const [downloading, setDownloading] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const authUserId = state.authUser?.id;
      if (!authUserId) return;

      setLoading(true);
      setError(null);

      const [achData, certData, levelData, defs] = await Promise.all([
        achievementsApi.getAchievements(Number(authUserId)),
        achievementsApi.getCertificates(Number(authUserId)),
        levelsApi.evaluateMe(),
        levelsApi.getDefinitions()
      ]);

      setAchievements(achData.data?.achievements || []);
      setUserStats(achData.data?.userStats || {});
      setCertificates(certData.data?.certificates || { earned: [], locked: [] });
      setUserLevel(levelData);
      setLevelDefs(defs);
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

  // Pre-process achievements for the map view
  const mapData = achievements.flatMap(group => [
    ...group.earned.map((b: any) => ({ ...b, status: 'earned', category: group.category })),
    ...group.available.map((b: any) => ({ ...b, status: 'locked', category: group.category }))
  ]).sort((a, b) => {
    if (a.status === 'earned' && b.status === 'locked') return -1;
    if (a.status === 'locked' && b.status === 'earned') return 1;
    return (b.pointValue || 0) - (a.pointValue || 0);
  });

  const allAchievements = achievements.flatMap(group => [
    ...group.earned.map((b: any) => ({ ...b, status: 'earned', category: group.category })),
    ...group.available.map((b: any) => ({ ...b, status: 'locked', category: group.category }))
  ]);
  const earnedAchievementsCount = allAchievements.filter(a => a.status === 'earned').length;
  const totalAchievementsCount = allAchievements.length;
  const progressPercentage = totalAchievementsCount > 0 ? (earnedAchievementsCount / totalAchievementsCount) * 100 : 0;

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 pt-4 bg-white" dir="rtl">
      {/* Premium Stat Card */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/40 p-6 rounded-[32px] backdrop-blur-sm border border-white/60">
        <div className="flex items-center gap-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg ring-4 ring-yellow-400/20">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 font-almarai-extrabold tracking-tight">إنجازاتي</h2>
            <p className="text-slate-500 font-bold">تتبع تقدمك وافتح جوائز جديدة كل يوم!</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الجوائز المكتسبة</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-800">
                  {earnedAchievementsCount}
                </span>
                <span className="text-slate-300 font-bold">/</span>
                <span className="text-lg font-bold text-slate-400">{totalAchievementsCount}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-yellow-400/10" />
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
      {/* Refined Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex-1 w-full sm:w-auto flex justify-center sm:justify-start">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('awards')}
              className={`px-8 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${activeTab === 'awards'
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                }`}
            >
              المكافآت
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-8 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${activeTab === 'certificates'
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                }`}
            >
              الشهادات
            </button>
          </div>
        </div>

        <Button
          onClick={handleSync}
          disabled={syncing}
          variant="outline"
          className="rounded-2xl border-slate-200 font-bold hover:bg-slate-50 gap-2 h-11"
        >
          {syncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          تحديث الإنجازات
        </Button>
      </div>

      {/* Level Progress Banner */}
      {userLevel && (() => {
        const nextLevel = levelDefs.find(d => d.level === userLevel.level.level + 1);
        const isMaxLevel = !nextLevel;

        return (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-100 rounded-3xl p-6 mb-8 flex flex-col md:flex-row-reverse items-center justify-between gap-6 shadow-sm">
            <div className="flex flex-row-reverse items-center gap-4 text-right">
              <div className="bg-white p-4 rounded-2xl shadow-inner border border-amber-100">
                <Trophy className="w-10 h-10 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-amber-900 mb-1">{userLevel.level.name}</h3>
                <p className="text-amber-700/70 font-bold text-sm">أنت تحرز تقدماً رائعاً في رحلتك!</p>
              </div>
            </div>

            {!isMaxLevel ? (
              <div className="flex-1 w-full max-w-md">
                <div className="flex flex-row-reverse justify-between text-xs font-bold text-amber-700 mb-2">
                  <span>المستوى التالي: {nextLevel.level} ({nextLevel.name})</span>
                  <span>{userLevel.stats.topicsCompleted} / {nextLevel.minTopics} مواضيع</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-3 border border-amber-100 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(5, Math.min(100, (userLevel.stats.topicsCompleted / (nextLevel.minTopics || 1)) * 100))}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-amber-600 mt-2 text-right font-bold">
                  {Math.floor(userLevel.stats.usageHours)} ساعات من الاستخدام من أصل {nextLevel.minUsageHours} ساعة مطلوبة للمستوى التالي
                </p>
              </div>
            ) : (
              <div className="flex-1 text-right">
                <p className="text-amber-600 font-black">لقد وصلت إلى أقصى مستوى! تهانينا 🎉</p>
              </div>
            )}
          </div>
        );
      })()}

      {activeTab === 'awards' ? (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 text-right">
          {/* Awards Map Section */}
          <div className="bg-white rounded-[32px] sm:rounded-[48px] p-4 sm:p-10 shadow-xl border-4 sm:border-8 border-[#F3F4F6]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-0">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">خريطة الجوائز</h2>
                <p className="text-sm sm:text-base text-slate-500 font-medium">تتبع تقدمك وافتح مكافآت جديدة في رحلتك التعليمية</p>
              </div>
              <div className="bg-yellow-50 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-yellow-200">
                <span className="text-yellow-700 font-bold block sm:inline">إجمالي الجوائز: {achievements.length}</span>
              </div>
            </div>

            {/* Unified Awards Map for all viewports */}
            <div className="w-full">
              <AwardsMap achievements={mapData} />
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Certificates Section */}
          <div className="mb-10 p-10 bg-gradient-to-br from-blue-50 to-indigo-50/30 border-2 border-blue-100/50 rounded-[40px] text-right relative overflow-hidden shadow-sm">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl" />
            <Scroll className="absolute bottom-[-30px] left-[-30px] w-64 h-64 text-blue-200/30 -rotate-12 pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <h3 className="text-3xl font-black text-slate-800 font-almarai-extrabold tracking-tight">الشهادات المكتسبة</h3>
              <p className="text-slate-600 font-bold max-w-lg leading-relaxed">
                هذه الشهادات هي توثيق رسمي لتقدمك الأكاديمي وتميزك في المهارات اللغوية.
                يمكنك تحميلها والمشاركة في فخر نجاحك.
              </p>
            </div>
          </div>

          <div className="grid gap-x-10 gap-y-16 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {certificates.earned.map((cert) => (
              <CertificateScroll
                key={cert.id}
                id={cert.id}
                name={cert.name}
                description={cert.description}
                status="earned"
                awardedAt={cert.awardedAt || undefined}
                onDownload={() => handleDownloadCertificate(cert.id, cert.name)}
                isDownloading={downloading === cert.id}
              />
            ))}

            {certificates.locked.map((cert) => (
              <CertificateScroll
                key={cert.id}
                id={cert.id}
                name={cert.name}
                description={cert.description}
                status="locked"
                onDownload={() => { }}
                isDownloading={false}
              />
            ))}

            {certificates.earned.length === 0 && certificates.locked.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="bg-gray-100 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                  <Scroll className="w-12 h-12 text-gray-300" />
                </div>
                <h4 className="text-2xl font-black text-gray-400 mb-2">لا توجد شهادات حتى الآن</h4>
                <p className="text-gray-300 font-bold">استمر في التقدم لفتح شهادات التميز!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
