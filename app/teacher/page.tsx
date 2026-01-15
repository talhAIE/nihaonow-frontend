"use client";

import { ChevronLeft, FileText, User, Search, Users, Moon } from 'lucide-react'; // Removing unused icons
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { reportsApi, teacherApi } from '@/lib/api'; // Use reportsApi and teacherApi
import { useAppContext } from "@/context/AppContext";

// Types for the teacher dashboard
interface TeacherDashboardStats {
    totalStudents: number;
    totalTopics: number;
    overallUsage: number; // Percentage for progress
    totalUsageHours: number;
    totalPoints: number;
    totalUsers: number;
    loggedInCount: number;
    notLoggedInCount: number;
    mostUsedMode?: string;
}

interface StudentSummary {
    id: number;
    username: string; // Changed from name to match API
    level: number; // Changed to number
    totalPoints: number; // Changed from points
    usageLabel: string; // Changed from usage
    statusColor?: string; // Derived
}

export default function TeacherDashboard() {
    const { state } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [compilingId, setCompilingId] = useState<number | null>(null);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const [stats, setStats] = useState<TeacherDashboardStats>({
        totalStudents: 0,
        totalTopics: 0,
        overallUsage: 0,
        totalUsageHours: 0,
        totalPoints: 0,
        totalUsers: 0,
        loggedInCount: 0,
        notLoggedInCount: 0
    });

    const [students, setStudents] = useState<StudentSummary[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch students with analytics (limit 5 for preview)
                const data = await teacherApi.getStudents({ limit: 5 });

                // Map Analytics
                if (data.analytics) {
                    const totalUsers = data.analytics.totalUsers || 0;
                    const loggedInCount = data.analytics.loggedInCount || 0;
                    const usagePercent = totalUsers > 0 ? Math.round((loggedInCount / totalUsers) * 100) : 0;

                    setStats({
                        totalStudents: totalUsers,
                        totalTopics: data.analytics.totalTopics || 0,
                        overallUsage: usagePercent,
                        totalUsageHours: data.analytics.totalUsageHours || 0,
                        totalPoints: data.analytics.totalPoints || 0,
                        totalUsers: totalUsers,
                        loggedInCount: loggedInCount,
                        notLoggedInCount: data.analytics.yetToLogin || 0,
                        mostUsedMode: data.analytics.mostUsedMode
                    });
                }

                // Map Students
                if (data.students) {
                    setStudents(data.students);
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to determine status color based on level or points (since we don't have explicit status)
    const getStatusColor = (level: number) => {
        if (level >= 5) return "text-green-500";
        if (level >= 3) return "text-amber-500";
        return "text-slate-500"; // Default or 'weak'
    };

    const getLevelLabel = (level: number) => {
        return `مستوى ${level}`;
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? "صباح الخير" : "مساء الخير";
    };

    const handleReportDownload = async (studentId: number) => {
        let progressInterval: NodeJS.Timeout;
        try {
            setCompilingId(studentId);
            setDownloadProgress(0);

            // Simulate progress
            progressInterval = setInterval(() => {
                setDownloadProgress(prev => {
                    if (prev >= 92) return prev;
                    const increment = Math.floor(Math.random() * 8) + 5;
                    return Math.min(prev + increment, 92);
                });
            }, 400);

            const { url } = await reportsApi.getStudentReportUrl(studentId);

            clearInterval(progressInterval);
            setDownloadProgress(100);

            if (url) {
                window.open(url, '_blank');
                setCompilingId(null);
                setDownloadProgress(0);
            } else {
                setCompilingId(null);
            }
        } catch (error) {
            if (progressInterval!) clearInterval(progressInterval);
            console.error("Failed to download report", error);
            alert("فشل تحميل التقرير. يرجى المحاولة مرة أخرى.");
            setCompilingId(null);
        }
    };

    const displayName = state?.authUser?.username || 'المعلم';

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[60vh] text-amber-500 font-bold">جاري التحميل...</div>;
    }

    const filteredStudents = students.filter(s => (s.username || '').toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6" dir="rtl">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Students - Green */}
                <div className="bg-[#E2F2E9] rounded-[24px] p-6 flex flex-col items-center justify-center transition-transform hover:scale-[1.02] border border-green-50">
                    <span className="text-[#35AB4E] font-bold text-sm mb-4">إجمالي الطلاب</span>
                    <span className="text-[#35AB4E] text-4xl font-black">{stats.totalStudents}</span>
                </div>

                {/* Total Topics - Yellow */}
                <div className="bg-[#FFF9E1] rounded-[24px] p-6 flex flex-col items-center justify-center transition-transform hover:scale-[1.02] border border-amber-50">
                    <span className="text-[#C69400] font-bold text-sm mb-4">مجموع المواضيع</span>
                    <span className="text-[#C69400] text-4xl font-black">{stats.totalTopics}</span>
                </div>

                {/* Overall Usage - Orange with Circular Progress */}
                <div className="bg-[#FFF0E2] rounded-[24px] p-2 flex flex-col items-center justify-center transition-transform hover:scale-[1.02] border border-orange-50 relative group">
                    <span className="text-[#EF8D32] font-bold text-sm mb-1 mt-4">الاستخدام الإجمالي</span>
                    <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                        {/* SVG Circular Progress */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="36"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-orange-100"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="36"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={226.2}
                                strokeDashoffset={226.2 - (226.2 * stats.overallUsage) / 100}
                                strokeLinecap="round"
                                className="text-[#EF8D32] transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-2xl font-black text-[#EF8D32]">{stats.overallUsage}%</span>
                    </div>
                </div>

                {/* Total Usage - Pink */}
                <div className="bg-[#FFE4E4] rounded-[24px] p-6 flex flex-col items-center justify-center transition-transform hover:scale-[1.02] border border-red-50">
                    <span className="text-[#BC313F] font-bold text-sm mb-4">إجمالي الاستخدام</span>
                    <div className="flex flex-row items-center gap-1">
                        <span className="text-[#BC313F] text-3xl font-black">
                            {stats.totalUsageHours}
                        </span>
                        <span className="text-[#BC313F] text-xs font-bold mt-2">ساعة</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 p-6 space-y-6">
                {/* Login Status Row */}
                <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-6">
                    <div className="flex items-center gap-8">
                        {/* Logged In */}
                        <div className="text-center group">
                            <div className="flex items-center gap-1.5 justify-center mb-0.5">
                                <span className="text-slate-400 font-bold text-[10px] group-hover:text-[#CA495A] transition-colors">تم تسجيل الدخول</span>
                                <Users className="w-3.5 h-3.5 text-[#CA495A]" />
                            </div>
                            <div className="text-2xl font-black text-slate-800 ">{stats.loggedInCount}</div>
                        </div>

                        <div className="h-8 w-[1px] bg-slate-100 hidden md:block"></div>

                        {/* Not Logged In */}
                        <div className="text-center group">
                            <div className="flex items-center gap-1.5 justify-center mb-0.5">
                                <span className="text-slate-400 font-bold text-[10px] group-hover:text-amber-400 transition-colors">لم يسجل الدخول بعد</span>
                                <Moon className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <div className="text-2xl font-black text-slate-800 ">{stats.notLoggedInCount}</div>
                        </div>
                    </div>

                    <div className="flex flex-row-reverse justify-between items-center">
                        <div className="flex flex-row-reverse items-center gap-2">

                            <span className="font-black flex-row-reverse text-slate-800 text-base">نتائج</span>
                            <div className="bg-slate-800 p-1 rounded-md text-white">
                                <FileText className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    {/* Student Rows */}
                    <div className="space-y-3">
                        {filteredStudents.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 font-bold text-sm">لا يوجد طلاب مطابقين للبحث</div>
                        ) : (
                            filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    onClick={() => handleReportDownload(student.id)}
                                    className="group bg-white border border-slate-50 rounded-[20px] p-4 flex flex-col md:flex-row items-center justify-between hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 gap-4 w-full cursor-pointer"
                                >
                                    {/* Student Info */}
                                    <div className="flex flex-row items-center gap-3 w-full md:w-1/3 text-right">
                                        <div className="w-10 h-10 rounded-full bg-[#FBD4D3] border-2 border-white shadow-sm flex items-center justify-center text-[#BC313F] overflow-hidden relative rotate-3 group-hover:rotate-0 transition-transform">
                                            <User className="w-5 h-5 opacity-50" />
                                        </div>
                                        <div className="text-right">
                                            <h4 className="font-black text-slate-800 text-sm">{student.username}</h4>
                                            <span className={`text-[10px] font-bold ${getStatusColor(student.level)}`}>{getLevelLabel(student.level)}</span>
                                        </div>
                                    </div>

                                    {/* Stats Info */}
                                    <div className="hidden md:flex flex-col items-center md:items-start w-full md:w-1/3">
                                        <p className="text-[9px] text-slate-400 font-bold mb-0.5">مجموع النقاط</p>
                                        <p className="font-black text-slate-700  text-base">{student.totalPoints?.toLocaleString()}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="w-full md:w-1/3 flex justify-end">
                                        <div className="flex flex-row items-center gap-1.5 px-4 py-2 bg-white border border-slate-100 rounded-xl text-slate-700 text-xs font-black group-hover:bg-slate-50 transition-all relative overflow-hidden">
                                            {compilingId === student.id ? (
                                                <>
                                                    <div
                                                        className="absolute inset-0 bg-green-50 transition-all duration-300 -z-1"
                                                        style={{ width: `${downloadProgress}%` }}
                                                    />
                                                    <div className="flex items-center gap-2 relative z-10">
                                                        <div className="w-3.5 h-3.5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="">{downloadProgress}%</span>
                                                        <span>جاري التجهيز...</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span>عرض التقرير</span>
                                                    <ChevronLeft className="w-3.5 h-3.5" />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* View All */}
                    <div className="pt-2">
                        <Link href="/teacher/students">
                            <button className="w-full flex items-center justify-center gap-1.5 py-3 bg-white border border-slate-100 rounded-[20px] text-slate-700 text-sm font-black hover:bg-slate-50 transition-all group">
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span>عرض الكل</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
