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

  const handleDownloadCertificate = async (certId: number, certName: string, description: string, awardedAt?: string) => {
    setDownloading(certId);
    try {
      const authUserId = state.authUser?.id;
      // Robust name extraction: API data > App state > LocalStorage > Default
      const userName = apiUserInfo?.username || state.authUser?.username || (typeof window !== 'undefined' ? localStorage.getItem('userName') : null) || "طالب نيهاو ناو";

      if (!authUserId) {
        toast({
          title: "خطأ",
          description: "معرف المستخدم غير متوفر.",
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
        title: "تم التحميل بنجاح",
        description: `تم تحميل شهادة ${certName}`,
      });
    } catch (err) {
      console.error("Error generating certificate PDF:", err);
      toast({
        title: "خطأ في التحميل",
        description: "تعذر إنشاء الشهادة حالياً",
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

      await achievementsApi.claimBadge(Number(authUserId), badgeKey);
      toast({
        title: "تم استلام المكافأة!",
        description: `لقد حصلت على مكافأة ${badgeName} بنجاح.`,
      });
      fetchData(); // Refresh data
    } catch (err: any) {
      console.error("Error claiming badge:", err);
      toast({
        title: "فشل استلام المكافأة",
        description: err.response?.data?.message || "حدث خطأ أثناء استلام المكافأة.",
        variant: "destructive",
      });
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

  // Pre-process achievements for the map view - Filter out certificates to show only rewards
  const mapData = achievements
    .filter(group => group.category !== 'certificates')
    .flatMap(group => [
      ...group.earned.map((b: any) => ({ ...b, status: 'earned', category: group.category })),
      ...group.available.map((b: any) => ({ ...b, status: 'locked', category: group.category }))
    ])
    .filter(a => !a.key.startsWith('cert_'))
    .sort((a, b) => {
      if (a.status === 'earned' && b.status === 'locked') return -1;
      if (a.status === 'locked' && b.status === 'earned') return 1;
      return (b.pointValue || 0) - (a.pointValue || 0);
    });

  const allAchievements = achievements
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
    <div className="flex-1 space-y-6 p-4 sm:p-6 pt-4 bg-white" dir="rtl">
      {/* Refined Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex-1 w-full sm:w-auto flex justify-center sm:justify-start">
          <div className="bg-white p-2 rounded-2xl flex items-center gap-3 shadow-sm border border-slate-100 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('awards')}
              className={`flex-1 sm:flex-none px-12 py-3 rounded-xl font-almarai-bold text-base transition-all duration-200 ${activeTab === 'awards'
                ? "bg-[#35AB4E] text-white border-b-[4px] border-b-[#298E3E] shadow-sm scale-[1.02]"
                : "bg-white text-[#4B4B4B] border border-[#E5E5E5] border-b-[4px] border-b-[#C4C4C4] hover:bg-slate-50"
                }`}
            >
              المكافآت
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 sm:flex-none px-12 py-3 rounded-xl font-almarai-bold text-base transition-all duration-200 ${activeTab === 'certificates'
                ? "bg-[#35AB4E] text-white border-b-[4px] border-b-[#298E3E] shadow-sm scale-[1.02]"
                : "bg-white text-[#4B4B4B] border border-[#E5E5E5] border-b-[4px] border-b-[#C4C4C4] hover:bg-slate-50"
                }`}
            >
              الشهادات
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'awards' ? (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 text-right">
          {/* Awards Map Section */}
          <div className="bg-white rounded-[32px] sm:rounded-[48px] p-4 sm:p-10 shadow-xl border-4 sm:border-8 border-[#F3F4F6]">
            {/* Unified Awards Map for all viewports */}
            <div className="w-full">
              <AwardsMap achievements={mapData} onClaim={handleClaimBadge} />
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Certificates Section */}
          <div className="grid gap-x-10 gap-y-16 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {certificates.earned.map((cert) => (
              <CertificateScroll
                key={`earned-${cert.id}`}
                id={cert.id}
                name={cert.name}
                description={cert.description}
                status="earned"
                awardedAt={cert.awardedAt || undefined}
                onDownload={() => handleDownloadCertificate(cert.id, cert.name, cert.description, cert.awardedAt || undefined)}
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
