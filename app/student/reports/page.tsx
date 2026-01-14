"use client";

import { ChevronRight, Download, Clock, Trophy, Flame, Star, BookOpen, Medal, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

// Types
interface ReportData {
  id: number;
  username: string;
  totalPoints: number;
  completedTopics: number;
  usageHours: number;
  usageSeconds: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: string | null;
  certificates: any[];
  rewards: any[];
  averagePronunciation: number;
  averageAccuracy: number;
  averageFluency: number;
  averageCompleteness: number;
}

export default function StudentReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await userApi.getMyReportDetails();
        setReport(data as unknown as ReportData);
      } catch (error) {
        console.error("Failed to fetch student report:", error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "تعذر جلب تفاصيل التقرير حالياً",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [toast]);

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      const { url } = await userApi.getMyReportUrl();
      if (url) {
        window.open(url, '_blank');
        toast({
          title: "تم التحميل",
          description: "يتم الآن فتح التقرير في نافذة جديدة",
        });
      }
    } catch (error) {
      console.error("Failed to download report", error);
      toast({
        title: "خطأ في التحميل",
        description: "تعذر تصدير التقرير حالياً",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35AB4E]"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 font-bold space-y-4">
        <p>لم يتم العثور على بيانات التقرير</p>
        <Link href="/student" className="px-6 py-2 bg-[#35AB4E] text-white rounded-xl">العودة للرئيسية</Link>
      </div>
    );
  }

  // Derived data for UI
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const skills = [
    { label: "يكتب", score: 16.0 },
    { label: "دقة", score: report.averageAccuracy || 0 },
    { label: "نطق", score: report.averagePronunciation || 0 },
    { label: "الطلاقة", score: report.averageFluency || 0 },
  ];
  const totalScore = skills.reduce((acc, curr) => acc + curr.score, 0);

  const estimatedTotalTopics = Math.max(report.completedTopics + 11, 35);
  const remainingTopics = Math.max(0, estimatedTotalTopics - report.completedTopics);
  const lectureProgress = Math.round((report.completedTopics / estimatedTotalTopics) * 100);

  return (
    <div className="bg-white min-h-screen p-4 sm:p-8 font-sans transition-all flex-1" dir="rtl">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-700 font-bold text-sm">
          <span>تقرير التقدم الخاص بك</span>
          <ChevronRight className="w-4 h-4 text-slate-400 rotate-180 sm:rotate-0" />
        </div>
        <button
          onClick={handleDownloadReport}
          disabled={isDownloading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#35AB4E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2f9c46] transition-all shadow-lg shadow-green-100 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
          {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          <span>{isDownloading ? 'جاري التحضير...' : 'تحميل التقرير الكامل'}</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* Profile */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[#E58B93] flex items-center justify-center mb-4 shadow-xl border-4 border-white">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 font-almarai-extrabold">{report.username}</h1>
        </div>

        {/* Top Stats - Green Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#D6F0E0] rounded-2xl p-6 flex flex-row-reverse items-center justify-center gap-4">
            <Clock className="w-6 h-6 text-[#2D9344]" />
            <div className="flex flex-col items-end">
              <span className="font-black text-[#2D9344] text-sm uppercase tracking-wider">وقت الاستخدام</span>
              <span className="font-bold text-slate-800 text-lg dir-ltr">{formatTime(report.usageSeconds)}</span>
            </div>
          </div>
          <div className="bg-[#D6F0E0] rounded-2xl p-6 flex flex-row-reverse items-center justify-center gap-4">
            <Trophy className="w-6 h-6 text-[#2D9344]" />
            <div className="flex flex-col items-end">
              <span className="font-black text-[#2D9344] text-sm uppercase tracking-wider">مجموع النقاط</span>
              <span className="font-bold text-slate-800 text-lg">{report.totalPoints.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Streaks - Yellow Card */}
        <div className="bg-[#FFF8E1] rounded-[32px] p-8 flex flex-col sm:flex-row items-center justify-center gap-8 sm:divide-x sm:divide-orange-200/50 sm:divide-x-reverse">
          <div className="flex-1 flex flex-col items-center px-4 w-full">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-black text-orange-400 text-sm whitespace-nowrap">سلسلة انتصارات حالية</span>
            </div>
            <div className="text-4xl font-black text-slate-800">{report.currentStreak} <span className="text-sm text-slate-400 font-bold">أيام</span></div>
          </div>

          <div className="flex-1 flex flex-col items-center px-4 w-full">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className="font-black text-orange-400 text-sm whitespace-nowrap">أطول سلسلة</span>
            </div>
            <div className="text-4xl font-black text-slate-800">{report.longestStreak} <span className="text-sm text-slate-400 font-bold">أيام</span></div>
          </div>
        </div>

        {/* Monthly Stats - White Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
          <h3 className="text-center font-bold text-slate-500 mb-10 text-lg">يناير 2026</h3>
          <div className="space-y-6 max-w-sm mx-auto">
            <div className="flex justify-between items-center text-xs font-black text-slate-400 mb-4 px-4 uppercase tracking-widest">
              <span>نتيجة</span>
              <span>المجالات</span>
            </div>
            {skills.map((skill, i) => (
              <div key={i} className="flex justify-between items-center px-4 border-b border-slate-50 pb-4">
                <span className="font-bold text-slate-600 text-base">{skill.score.toFixed(1)}</span>
                <span className="font-bold text-slate-800 text-base">{skill.label}</span>
              </div>
            ))}
            <div className="flex justify-between items-center px-4 pt-4 mt-2 bg-green-50/50 rounded-2xl p-4 border border-green-100/50">
              <span className="font-black text-[#35AB4E] text-xl">{totalScore.toFixed(1)}</span>
              <span className="font-black text-[#35AB4E] text-base">مجموع النقاط</span>
            </div>
          </div>
        </div>

        {/* Lecture Progress - White Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
          <div className="flex justify-end items-center gap-3 mb-6">
            <h3 className="font-black text-slate-800 text-xl font-almarai-extrabold">تقدم المحاضرات</h3>
            <div className="bg-slate-100 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-slate-800" />
            </div>
          </div>

          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-bold text-slate-400">المحاضرات المكتملة</span>
            <span className="font-black text-[#35AB4E] text-sm">{lectureProgress}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-4 mb-10 overflow-hidden dir-ltr p-1 border border-slate-200/50">
            <div className="bg-[#35AB4E] h-full rounded-full shadow-[0_0_12px_rgba(53,171,78,0.2)] transition-all duration-1000" style={{ width: `${lectureProgress}%` }}></div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#fcebeb] rounded-3xl p-8 flex flex-col items-center justify-center text-center group transition-transform hover:scale-[1.02]">
              <span className="font-black text-slate-800 text-4xl mb-2">{report.completedTopics}</span>
              <span className="text-xs font-black text-[#BC313F] uppercase tracking-wider">محاضرات مكتملة</span>
            </div>
            <div className="bg-[#ecf7ed] rounded-3xl p-8 flex flex-col items-center justify-center text-center group transition-transform hover:scale-[1.02]">
              <span className="font-black text-slate-800 text-4xl mb-2">{remainingTopics}</span>
              <span className="text-xs font-black text-[#2D9344] uppercase tracking-wider">محاضرات متبقية</span>
            </div>
          </div>
        </div>

        {/* Achievements - White Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 text-center">
          <h3 className="font-black text-slate-800 text-xl font-almarai-extrabold mb-10">إنجازاتك</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {(report.rewards && report.rewards.length > 0 ? report.rewards : [1, 2, 3, 4, 5, 6]).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full bg-[#FFD700] border-4 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <Star className="w-10 h-10 text-orange-600/50 fill-orange-600/20" />
                </div>
                <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50 uppercase tracking-widest">Rising Star</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates - White Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 text-center">
          <h3 className="font-black text-slate-800 text-xl font-almarai-extrabold mb-8">شهاداتك المكتسبة</h3>
          <div className="space-y-4">
            <div className="bg-[#fcebeb] p-6 rounded-2xl flex items-center justify-between border border-red-100/50 hover:bg-[#fbdada] transition-colors cursor-pointer group">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Medal className="w-6 h-6 text-[#8D1716]" />
              </div>
              <span className="font-black text-[#8D1716] text-base">دورة الخطوات الأولى في اللغة الصينية - المستوى الأول</span>
              <Download className="w-5 h-5 text-[#8D1716] opacity-30 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="bg-[#ecf7ed] p-6 rounded-2xl flex items-center justify-between border border-green-100/50 hover:bg-[#dff0e1] transition-colors cursor-pointer group">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Medal className="w-6 h-6 text-[#2D9344]" />
              </div>
              <span className="font-black text-[#2D9344] text-base">شهادة إتقان أساسيات المحادثة الصينية</span>
              <Download className="w-5 h-5 text-[#2D9344] opacity-30 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
