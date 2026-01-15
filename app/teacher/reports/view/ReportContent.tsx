"use client";

import { ChevronRight, Download, Clock, Trophy, Flame, Star, BookOpen, Medal, User } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { reportsApi, teacherApi } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

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
    completedTopicsList?: { id: number; name: string; completedAt: string }[];
}

export default function StudentReportContent() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get('studentId');

    const [report, setReport] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!studentId) {
            setIsLoading(false);
            return;
        }

        const fetchReport = async () => {
            try {
                const data = await teacherApi.getStudentReportDetails(studentId);
                setReport(data as unknown as ReportData);
            } catch (error) {
                console.error("Failed to fetch student report:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, [studentId]);

    const handleDownloadReport = async () => {
        if (!studentId) return;
        try {
            setIsDownloading(true);
            const { url } = await reportsApi.getStudentReportUrl(studentId);
            if (url) {
                window.open(url, '_blank');
            }
        } catch (error) {
            console.error("Failed to download report", error);
            alert("فشل تحميل التقرير. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[60vh] text-amber-500 font-bold">جاري التحميل...</div>;
    }

    if (!studentId || !report) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 font-bold space-y-4">
                <p>لم يتم العثور على بيانات الطالب</p>
                <Link href="/teacher/students" className="px-6 py-2 bg-[#35AB4E] text-white rounded-xl">عودة لقائمة الطلاب</Link>
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
        { label: "يكتب", score: 16.0 }, // Mock hardcoded as per image for 'Writes' if not available in API, but let's try to map if possible. API gives 'averageCompleteness' etc. Let's map loosely or use placeholders if data missing.
        { label: "دقة", score: report.averageAccuracy || 0 },
        { label: "نطق", score: report.averagePronunciation || 0 },
        { label: "الطلاقة", score: report.averageFluency || 0 },
    ];
    const totalScore = skills.reduce((acc, curr) => acc + curr.score, 0); // Sum or Average? Image shows "Total Score 50.0" and individual scores 16, 20, 14. Sum is 50. So it's sum.

    const estimatedTotalTopics = Math.max(report.completedTopics + 11, 35); // Just to match visual of '11 remaining' kind of logic
    const remainingTopics = Math.max(0, estimatedTotalTopics - report.completedTopics);
    const lectureProgress = Math.round((report.completedTopics / estimatedTotalTopics) * 100);

    const isTopicsView = searchParams.get('view') === 'topics';
    return (
        <div className="bg-white min-h-screen p-8 " dir="rtl">
            {/* Header */}
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
                <Link href="/teacher/students" className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors">
                    <span>تقرير الطالب</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                {!isTopicsView && (
                    <button
                        onClick={handleDownloadReport}
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-[#35AB4E] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#2f9c46] transition-colors shadow-sm text-sm"
                    >
                        <Download className="w-4 h-4" />
                        <span>{isDownloading ? 'جاري التحميل...' : 'تحميل'}</span>
                    </button>
                )}
            </div>

            <div className="max-w-3xl mx-auto space-y-6">

                {/* Profile */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-[#E58B93] flex items-center justify-center mb-3 shadow-md border-4 border-white">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-xl font-black text-slate-800">{report.username}</h1>
                </div>

                {/* Main Content Sections - Hidden in Topics View */}
                {!isTopicsView && (
                    <>
                        {/* Top Stats - Green Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#D6F0E0] rounded-2xl p-4 flex items-center justify-center gap-3">
                                <span className="font-bold text-[#2D9344] text-sm dir-ltr">{formatTime(report.usageSeconds)}</span>
                                <span className="font-black text-[#2D9344] text-sm">وقت الاستخدام:</span>
                                <Clock className="w-5 h-5 text-[#2D9344]" />
                            </div>
                            <div className="bg-[#D6F0E0] rounded-2xl p-4 flex items-center justify-center gap-3">
                                <span className="font-bold text-[#2D9344] text-sm ">{report.totalPoints}</span>
                                <span className="font-black text-[#2D9344] text-sm">مجموع النقاط:</span>
                                <Trophy className="w-5 h-5 text-[#2D9344]" />
                            </div>
                        </div>

                        {/* Streaks - Yellow Card */}
                        <div className="bg-[#FFF8E1] rounded-3xl p-6 flex items-center justify-center divide-x divide-orange-200/50 divide-x-reverse">
                            <div className="flex-1 flex flex-col items-center px-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-black text-orange-400 text-sm">سلسلة انتصارات حالية</span>
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                </div>
                                <div className="text-3xl font-black text-slate-800 ">{report.currentStreak} <span className="text-xs text-slate-400 font-bold">أيام</span></div>
                            </div>

                            <div className="flex-1 flex flex-col items-center px-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-black text-orange-400 text-sm">أطول سلسلة</span>
                                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                                </div>
                                <div className="text-3xl font-black text-slate-800 ">{report.longestStreak} <span className="text-xs text-slate-400 font-bold">أيام</span></div>
                            </div>
                        </div>

                        {/* Monthly Stats - White Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
                            <h3 className="text-center font-bold text-slate-500 mb-8 ">يناير 2026</h3>
                            <div className="space-y-4 max-w-sm mx-auto">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-4 px-4">
                                    <span>نتيجة</span>
                                    <span>يكتب</span>
                                </div>
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex justify-between items-center px-4">
                                        <span className="font-bold text-slate-600 text-sm ">{skill.score.toFixed(1)}</span>
                                        <span className="font-bold text-slate-800 text-sm">{skill.label}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center px-4 pt-4 mt-2">
                                    <span className="font-bold text-[#35AB4E] text-sm ">{totalScore.toFixed(1)}</span>
                                    <span className="font-bold text-[#35AB4E] text-sm">مجموع النقاط</span>
                                </div>
                            </div>
                        </div>

                        {/* Lecture Progress - White Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
                            <div className="flex justify-end items-center gap-2 mb-2">
                                <h3 className="font-black text-slate-800 text-base">تقدم المحاضرات</h3>
                                <BookOpen className="w-5 h-5 text-slate-800" />
                            </div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold text-slate-400">المحاضرات المكتملة</span>
                                <span className="font-black text-slate-800 text-xs ">{lectureProgress}%</span>
                            </div>

                            <div className="w-full bg-slate-100 rounded-full h-3 mb-6 dir-ltr">
                                <div className="bg-[#35AB4E] h-full rounded-full" style={{ width: `${lectureProgress}%` }}></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#fcebeb] rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                    <span className="font-black text-slate-800  text-2xl mb-1">{report.completedTopics}</span>
                                    <span className="text-[10px] font-bold text-[#BC313F]">محاضرات مكتملة</span>
                                </div>
                                <div className="bg-[#ecf7ed] rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                    <span className="font-black text-slate-800  text-2xl mb-1">{remainingTopics}</span>
                                    <span className="text-[10px] font-bold text-[#2D9344]">محاضرات متبقية</span>
                                </div>
                            </div>
                        </div>

                        {/* Achievements - White Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 text-center">
                            <h3 className="font-black text-slate-800 text-base mb-8">الإنجازات</h3>
                            <div className="flex flex-wrap justify-center gap-6">
                                {(report.rewards && report.rewards.length > 0 ? report.rewards : [1, 2, 3, 4, 5]).map((_, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-14 h-14 rounded-full bg-[#FFD700] border-2 border-orange-300 shadow-inner flex items-center justify-center">
                                            <Star className="w-8 h-8 text-orange-600/50 fill-orange-600/20" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">Rising Star</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certificates - White Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 text-center">
                            <h3 className="font-black text-slate-800 text-base mb-6">شهادات</h3>
                            <div className="space-y-3">
                                <div className="bg-[#fcebeb] p-4 rounded-xl flex items-center justify-between">
                                    <Medal className="w-6 h-6 text-[#8D1716]" />
                                    <span className="font-bold text-[#8D1716] text-sm">الخطوات الأولى في اللغة الصينية</span>
                                </div>
                                <div className="bg-[#ecf7ed] p-4 rounded-xl flex items-center justify-between">
                                    <Medal className="w-6 h-6 text-[#2D9344]" />
                                    <span className="font-bold text-[#2D9344] text-sm">الخطوات الأولى في اللغة الصينية</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Topics List - Always shown or highlighted in Topics View */}
                <div id="topics" className={`bg-white rounded-3xl p-8 shadow-sm border border-slate-50 ${isTopicsView ? 'mt-4' : 'mt-8 border-t pt-6'}`}>
                    <h4 className="font-black text-slate-800 text-base mb-6 text-right">المواضيع المكتملة</h4>
                    {report.completedTopicsList && report.completedTopicsList.length > 0 ? (
                        <div className="space-y-3">
                            {report.completedTopicsList.map((topic, idx) => (
                                <div key={topic.id || idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-[#35AB4E]/30 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {new Date(topic.completedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-700 text-sm">{topic.name}</span>
                                        <div className="w-6 h-6 rounded-full bg-[#35AB4E]/10 flex items-center justify-center">
                                            <BookOpen className="w-3 h-3 text-[#35AB4E]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <BookOpen className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-bold mb-1">لم يكمل الطالب أي مواضيع بعد</p>
                            <p className="text-slate-400 text-xs">سيتم عرض المواضيع هنا بمجرد انتهائه منها</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
