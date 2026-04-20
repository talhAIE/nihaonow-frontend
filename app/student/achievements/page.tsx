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
import CertificateTemplate from "@/components/achievements/CertificateTemplate";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { AchievementsGuide } from "@/components/achievements/AchievementsGuide";
import { guidePersistence } from "@/lib/guidePersistence";
import AuthLanguageToggle from "@/components/auth/AuthLanguageToggle";

export default function AchievementsPage() {
  const { state, dir } = useAppContext();
  const userId = state.authUser?.id;
  const isRtl = dir === 'rtl';
  const t = isRtl ? {
    loading: 'جاري تحميل إنجازاتك...',
    loadError: 'فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.',
    sorry: 'عذراً، حدث خطأ',
    retry: 'إعادة المحاولة',
    awards: 'المكافآت',
    certificates: 'الشهادات',
    noCertificates: 'لا توجد شهادات حتى الآن',
    noCertificatesSub: 'استمر في التقدم لفتح شهادات التميز!',
    downloadSuccess: 'تم التحميل بنجاح',
    downloadSuccessDesc: (name: string) => `تم تحميل شهادة ${name}`,
    downloadError: 'خطأ في التحميل',
    downloadErrorDesc: 'تعذر إنشاء الشهادة حالياً',
    userIdMissing: 'معرف المستخدم غير متوفر.',
    error: 'خطأ',
    claimSuccess: 'تم استلام المكافأة!',
    claimSuccessDesc: (name: string) => `لقد حصلت على مكافأة ${name} بنجاح.`,
    claimFail: 'فشل استلام المكافأة',
  } : {
    loading: 'Loading your achievements...',
    loadError: 'Failed to load data. Please try again.',
    sorry: 'Something went wrong',
    retry: 'Try again',
    awards: 'Awards',
    certificates: 'Certificates',
    noCertificates: 'No certificates yet',
    noCertificatesSub: 'Keep progressing to unlock certificates.',
    downloadSuccess: 'Download complete',
    downloadSuccessDesc: (name: string) => `Downloaded certificate ${name}`,
    downloadError: 'Download failed',
    downloadErrorDesc: 'Could not generate the certificate right now.',
    userIdMissing: 'User ID is unavailable.',
    error: 'Error',
    claimSuccess: 'Reward claimed',
    claimSuccessDesc: (name: string) => `You claimed the reward for ${name}.`,
    claimFail: 'Claim failed',
  };

  const [achievements, setAchievements] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<{ earned: Certificate[]; locked: Certificate[] }>({ earned: [], locked: [] });
  const [userStats, setUserStats] = useState<any>(null);
  const [userLevel, setUserLevel] = useState<any>(null);
  const [levelDefs, setLevelDefs] = useState<LevelDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'awards' | 'certificates'>('awards');
  const [claimedAchievements, setClaimedAchievements] = useState<Set<string>>(new Set());
  const [initialLoad, setInitialLoad] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (state.authUser?.id && state.authUser?.isFirstLogin && state.isInitialized) {
      const isCompleted = guidePersistence.isCompleted(state.authUser.id, 'achievements');
      if (!isCompleted) {
        setShowGuide(true);
      }
    }
  }, [state.authUser, state.isInitialized]);

  const handleCloseGuide = () => {
    setShowGuide(false);
    if (state.authUser?.id) {
      guidePersistence.setCompleted(state.authUser.id, 'achievements');
    }
  };

  // State for frontend PDF generation
  const [certToGenerate, setCertToGenerate] = useState<{
    userName: string;
    certificateName: string;
    description: string;
    awardedAt?: string;
  } | null>(null);

  const { toast } = useToast();
  const [downloading, setDownloading] = useState<number | null>(null);
  const [apiUserInfo, setApiUserInfo] = useState<{ username: string; email: string } | null>(null);

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
      setApiUserInfo(certData.data?.user || null);
      setUserLevel(levelData);
      setLevelDefs(defs);
    } catch (err: any) {
      console.error("Error fetching achievements:", err);
      setError(t.loadError);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [state.authUser?.id, t.loadError]);

  useEffect(() => {
    if (state.authUser?.id) {
      fetchData();
    }
  }, [state.authUser?.id, fetchData]);

  const handleDownloadCertificate = async (certId: number, certName: string, description: string, awardedAt?: string) => {
    setDownloading(certId);
    try {
      const authUserId = state.authUser?.id;
      // Robust name extraction: API data > App state > LocalStorage > Default
      const userName = apiUserInfo?.username || state.authUser?.username || (typeof window !== 'undefined' ? localStorage.getItem('userName') : null) || "طالب نيهاو ناو";

      if (!authUserId) {
        toast({
          title: t.error,
          description: t.userIdMissing,
          variant: "destructive",
        });
        return;
      }

      // 1. Prepare data for the template
      setCertToGenerate({
        userName,
        certificateName: certName,
        description,
        awardedAt
      });

      // 2. Wait for the template to render and images to load
      await new Promise(resolve => setTimeout(resolve, 800)); // Increased wait for DOM stability

      const element = document.getElementById('certificate-download-template');
      if (!element) throw new Error("Template element not found");

      // Robust image load check
      const image = element.querySelector('img');
      if (image && !image.complete) {
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
          // Set a timeout just in case it takes too long
          setTimeout(() => reject(new Error("Image load timeout")), 5000);
        });
      }

      // 3. Capture the template
      const canvas = await html2canvas(element, {
        scale: 4, // High Resolution
        useCORS: true,
        logging: true, // Enable logging for debugging if it fails again
        backgroundColor: "#ffffff",
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      // 4. Generate PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${certName}.pdf`);

      toast({
        title: t.downloadSuccess,
        description: t.downloadSuccessDesc(certName),
      });
    } catch (err) {
      console.error("Error generating certificate PDF:", err);
      toast({
        title: t.downloadError,
        description: t.downloadErrorDesc,
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
      setCertToGenerate(null);
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

  const handleClaimBadge = async (badgeKey: string, badgeName: string) => {
    try {
      const authUserId = state.authUser?.id;
      if (!authUserId) return;

      // Optimistic update - add to local state immediately
      setClaimedAchievements(prev => new Set(prev).add(badgeKey));

      await achievementsApi.claimBadge(Number(authUserId), badgeKey);
      toast({
        title: t.claimSuccess,
        description: t.claimSuccessDesc(badgeName),
      });
      // Note: Removed fetchData() call to prevent full page reload
    } catch (err: any) {
      console.error("Error claiming badge:", err);
      // Revert optimistic update on error
      setClaimedAchievements(prev => {
        const newSet = new Set(prev);
        newSet.delete(badgeKey);
        return newSet;
      });
      toast({
        title: t.claimFail,
        description: err.response?.data?.message || (isRtl ? 'حدث خطأ أثناء استلام المكافأة.' : 'An error occurred while claiming the reward.'),
        variant: "destructive",
      });
    }
  };

  if (loading && initialLoad) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-almarai" dir={dir}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35AB4E] mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 h-[80vh]">
        <div className="text-center space-y-4 bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-red-900">{t.sorry}</h2>
          <p className="text-red-700">{error}</p>
          <Button onClick={fetchData} className="bg-red-600 hover:bg-red-700 text-white">
            {t.retry}
          </Button>
        </div>
      </div>
    );
  }

  const localizeText = <T extends { nameText?: any; descriptionText?: any; name: string; description: string }>(entry: T): T => {
    const language = isRtl ? 'ar' : 'en';
    
    // Attempt to parse name/description as JSON if they are strings
    const pickValue = (val: string | any, textVal: any) => {
      // Priority 1: Enriched text object from backend
      if (textVal && typeof textVal === 'object') {
         return language === 'en' ? textVal.en || textVal.variation || textVal.raw : textVal.ar || textVal.variation || textVal.raw;
      }
      
      // Priority 2: JSON string in the raw field
      if (typeof val === 'string' && val.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(val);
          if (parsed && typeof parsed === 'object') {
            return language === 'en' ? parsed.en || parsed.ar : parsed.ar || parsed.en;
          }
        } catch (e) {}
      }
      
      return val;
    };

    return {
      ...entry,
      name: pickValue(entry.name, entry.nameText),
      description: pickValue(entry.description, entry.descriptionText),
    };
  };

  const localizedAchievements = achievements.map((group: any) => ({
    ...group,
    earned: (group.earned || []).map(localizeText),
    available: (group.available || []).map(localizeText),
  }));


  const localizedCertificates = {
    earned: certificates.earned.map(localizeText),
    locked: certificates.locked.map(localizeText),
  };

  // Pre-process achievements for the map view - Filter out certificates to show only rewards
  // We strictly show 4 nodes per category as requested: Usage (Center), Streak (Left), Topics (Right)
  const usageGroup = localizedAchievements.find(g => g.category === 'time') || { earned: [], available: [] };
  const streakGroup = localizedAchievements.find(g => g.category === 'streak') || { earned: [], available: [] };
  const topicsGroup = localizedAchievements.find(g => g.category === 'topics') || { earned: [], available: [] };

  const getCategorizedData = (group: any, category: string) => [
    ...group.earned.map((b: any) => ({ ...b, status: 'earned', category })),
    ...group.available.map((b: any) => ({ ...b, status: 'locked', category }))
  ].slice(0, 4);

  // Combine in order: Center path (Usage 0-3), Left path (Streak 4-7), Right path (Topics 8-11)
  const mapData = [
    ...getCategorizedData(usageGroup, 'time'),
    ...getCategorizedData(streakGroup, 'streak'),
    ...getCategorizedData(topicsGroup, 'topics')
  ];

  const allAchievements = localizedAchievements
    .filter(group => group.category !== 'certificates')
    .flatMap(group => [
      ...group.earned.map((b: any) => ({ ...b, status: 'earned', category: group.category })),
      ...group.available.map((b: any) => ({ ...b, status: 'locked', category: group.category }))
    ])
    .filter(a => !a.key.startsWith('cert_'));

  const earnedAchievementsCount = allAchievements.filter(a => a.status === 'earned').length;
  const totalAchievementsCount = allAchievements.length;
  const progressPercentage = totalAchievementsCount > 0 ? (earnedAchievementsCount / totalAchievementsCount) * 100 : 0;

  return (
    <div className="flex-1 space-y-6 px-0 pt-4 bg-white" dir={dir}>
      <AchievementsGuide 
        isOpen={showGuide} 
        onClose={handleCloseGuide} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      {/* Refined Header & Tab Switcher */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 ${isRtl ? "sm:flex-row-reverse" : "sm:flex-row"}`}>
        <div className={`w-full sm:w-auto flex ${isRtl ? "justify-center sm:justify-start" : "justify-center sm:justify-end"}`}><AuthLanguageToggle /></div>
        <div className={`flex-1 w-full sm:w-auto flex ${isRtl ? "justify-center sm:justify-start" : "justify-center sm:justify-end"}`}>
          <div className="bg-slate-50/50 p-1 rounded-2xl flex items-center gap-1.5 shadow-inner border border-slate-100 w-full sm:w-auto overflow-hidden">
            <button
              id="awards-tab-btn"
              onClick={() => setActiveTab('awards')}
              className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-xl font-almarai-bold text-sm sm:text-base transition-all duration-200 ${activeTab === 'awards'
                ? "bg-[#35AB4E] text-white border-b-[4px] border-b-[#298E3E] shadow-md border border-[#35AB4E]"
                : "bg-transparent text-[#4B4B4B] hover:bg-slate-50 border border-slate-200/60"
                }`}
            >
              {t.awards}
            </button>
            <button
              id="certs-tab-btn"
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-xl font-almarai-bold text-sm sm:text-base transition-all duration-200 ${activeTab === 'certificates'
                ? "bg-[#35AB4E] text-white border-b-[4px] border-b-[#298E3E] shadow-md border border-[#35AB4E]"
                : "bg-transparent text-[#4B4B4B] hover:bg-slate-50 border border-slate-200/60"
                }`}
            >
              {t.certificates}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'awards' ? (
        <div id="awards-map-container" className="animate-in fade-in slide-in-from-bottom-3 duration-500 text-right">
          {/* Awards Map Section */}
            <AwardsMap achievements={mapData} onClaim={handleClaimBadge} claimedAchievements={claimedAchievements} dir={dir} />
        </div>
      ) : (
        <div id="certificates-grid" className="animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Certificates Section */}
          <div className="grid gap-x-10 gap-y-16 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {localizedCertificates.earned.map((cert, index) => (
              <CertificateScroll
                key={`earned-${cert.id}`}
                id={cert.id}
                name={cert.name}
                description={cert.description}
                status="earned"
                awardedAt={cert.awardedAt || undefined}
                onDownload={() => handleDownloadCertificate(cert.id, cert.name, cert.description, cert.awardedAt || undefined)}
                isDownloading={downloading === cert.id}
                customId={index === 0 ? "certificate-scroll-highlight" : undefined}
                dir={dir}
              />
            ))}

            {localizedCertificates.locked.map((cert, index) => (
              <CertificateScroll
                key={cert.id}
                id={cert.id}
                name={cert.name}
                description={cert.description}
                status="locked"
                onDownload={() => { }}
                isDownloading={false}
                customId={localizedCertificates.earned.length === 0 && index === 0 ? "certificate-scroll-highlight" : undefined}
                dir={dir}
              />
            ))}

            {localizedCertificates.earned.length === 0 && localizedCertificates.locked.length === 0 && (
              <div id="certificate-scroll-highlight" className="col-span-full py-20 text-center">
                <div className="bg-gray-100 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                  <Scroll className="w-12 h-12 text-gray-300" />
                </div>
                <h4 className="text-2xl font-black text-gray-400 mb-2">{t.noCertificates}</h4>
                <p className="text-gray-300 font-bold">{t.noCertificatesSub}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Hidden PDF Template */}
      {certToGenerate && (
        <CertificateTemplate
          userName={certToGenerate.userName}
          certificateName={certToGenerate.certificateName}
          description={certToGenerate.description}
          awardedAt={certToGenerate.awardedAt}
        />
      )}
    </div>
  );
}
