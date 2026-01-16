"use client";

import { Search, Filter, Download, ChevronLeft, BookOpen, FileText, User, Users, Moon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { reportsApi, teacherApi } from '@/lib/api';

interface StudentData {
    id: number;
    username: string;
    level: number;
    totalPoints: number;
    usageLabel: string;
    statusColor?: string;
    email?: string;
}

interface AnalyticsData {
    totalUsers: number;
    loggedInCount: number;
    yetToLogin: number;
}

export default function MyStudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [students, setStudents] = useState<StudentData[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalUsers: 0,
        loggedInCount: 0,
        yetToLogin: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [compilingId, setCompilingId] = useState<number | null>(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await teacherApi.getStudents({
                    limit: 200, // Fetch a larger batch for frontend sorting
                });

                if (data.students) {
                    setStudents(data.students);
                }

                if (data.analytics) {
                    setAnalytics({
                        totalUsers: data.analytics.totalUsers,
                        loggedInCount: data.analytics.loggedInCount,
                        yetToLogin: data.analytics.yetToLogin
                    });
                }
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []); // Only fetch once

    // Robust filtering and sorting on frontend
    const filteredStudents = [...students]
        .filter(s => (s.username || '').toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "name") {
                const nameA = (a.username || '').toLowerCase();
                const nameB = (b.username || '').toLowerCase();
                return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            }
            if (sortBy === "level") {
                return sortOrder === "asc" ? a.level - b.level : b.level - a.level;
            }
            if (sortBy === "points") {
                return sortOrder === "asc" ? a.totalPoints - b.totalPoints : b.totalPoints - a.totalPoints;
            }
            return 0;
        });

    const handleDownloadReports = async () => {
        let progressInterval: NodeJS.Timeout;
        try {
            setIsDownloading(true);
            setCompilingId(-1);
            setDownloadProgress(0);

            // Simulate progress
            progressInterval = setInterval(() => {
                setDownloadProgress(prev => {
                    if (prev >= 92) return prev;
                    const increment = Math.floor(Math.random() * 8) + 3;
                    return Math.min(prev + increment, 92);
                });
            }, 500);

            const { url } = await reportsApi.getBulkReportsUrl();

            clearInterval(progressInterval);
            setDownloadProgress(100);

            if (url) {
                window.open(url, '_blank');
                setCompilingId(null);
                setDownloadProgress(0);
                setIsDownloading(false);
            } else {
                setCompilingId(null);
                setIsDownloading(false);
            }
        } catch (error) {
            if (progressInterval!) clearInterval(progressInterval);
            console.error("Failed to download reports", error);
            alert("فشل تحميل التقارير. يرجى المحاولة مرة أخرى.");
            setCompilingId(null);
            setIsDownloading(false);
        }
    };

    const getStatusColor = (level: number) => {
        if (level >= 5) return "text-green-500";
        if (level >= 3) return "text-amber-500";
        return "text-slate-500";
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

    const getLevelLabel = (level: number) => `مستوى ${level}`;

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[60vh] text-amber-500 font-bold">جاري التحميل...</div>;
    }

    return (
        <div className="space-y-10" dir="rtl">
            {/* Results Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
                    {/* Left Group: Title & Download */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <div className="bg-slate-800 p-1 rounded-md text-white">
                                <FileText className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-black text-slate-800 text-base">نتائج</span>
                        </div>

                        <button
                            onClick={handleDownloadReports}
                            disabled={isDownloading || compilingId === -1}
                            className="flex flex-row-reverse items-center justify-center gap-2 bg-white border border-slate-100 text-slate-600 px-4 py-2 rounded-xl font-black hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs relative overflow-hidden h-10"
                        >
                            {isDownloading || compilingId === -1 ? (
                                <>
                                    <div
                                        className="absolute inset-0 bg-green-50 transition-all duration-300 -z-0"
                                        style={{ width: `${downloadProgress}%` }}
                                    />
                                    <div className="flex items-center gap-2 relative z-10 px-2">
                                        <div className="w-3 h-3 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                                        <span>{downloadProgress}%</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>تحميل التقارير</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right Group: Sort & Search */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="w-full sm:w-auto flex flex-row-reverse items-center justify-center gap-2 bg-white border border-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-black hover:bg-slate-50 transition-all shadow-sm text-xs h-10"
                            >
                                <Filter className="w-4 h-4" />
                                <span>الترتيب</span>
                            </button>

                            {isFilterOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden font-bold text-xs" dir="rtl">
                                    <div className="p-2 border-b border-slate-50 bg-slate-50/50 text-slate-400 text-[10px] uppercase">ترتيب حسب</div>
                                    <button
                                        onClick={() => { setSortBy("name"); setSortOrder("asc"); setIsFilterOpen(false); }}
                                        className={`w-full text-right px-4 py-2.5 hover:bg-slate-50 transition-colors ${sortBy === "name" && sortOrder === "asc" ? "text-green-600 bg-green-50/50" : "text-slate-600"}`}
                                    >
                                        الاسم (أ - ي)
                                    </button>
                                    <button
                                        onClick={() => { setSortBy("name"); setSortOrder("desc"); setIsFilterOpen(false); }}
                                        className={`w-full text-right px-4 py-2.5 hover:bg-slate-50 transition-colors ${sortBy === "name" && sortOrder === "desc" ? "text-green-600 bg-green-50/50" : "text-slate-600"}`}
                                    >
                                        الاسم (ي - أ)
                                    </button>
                                    <button
                                        onClick={() => { setSortBy("level"); setSortOrder("desc"); setIsFilterOpen(false); }}
                                        className={`w-full text-right px-4 py-2.5 hover:bg-slate-50 transition-colors ${sortBy === "level" && sortOrder === "desc" ? "text-green-600 bg-green-50/50" : "text-slate-600"}`}
                                    >
                                        المستوى (الأعلى أولاً)
                                    </button>
                                    <button
                                        onClick={() => { setSortBy("points"); setSortOrder("desc"); setIsFilterOpen(false); }}
                                        className={`w-full text-right px-4 py-2.5 hover:bg-slate-50 transition-colors ${sortBy === "points" && sortOrder === "desc" ? "text-green-600 bg-green-50/50" : "text-slate-600"}`}
                                    >
                                        النقاط (الأعلى أولاً)
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:max-w-xs group">
                            <input
                                type="text"
                                placeholder="البحث عن الطلاب هنا..."
                                className="w-full bg-white border border-[#35AB4E] border-b-[3px] border-b-[#298E3E] rounded-xl py-2 px-10 text-right focus:outline-none transition-all font-bold text-slate-600 text-sm h-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#35AB4E] w-4 h-4" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 font-bold text-sm">لا يوجد طلاب مطابقين للبحث</div>
                    ) : (
                        filteredStudents.map((student) => (
                            <div key={student.id} className="group bg-white border border-slate-50 rounded-[20px] p-4 flex flex-col md:flex-row items-center justify-between hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 gap-4">

                                {/* Name and Level */}
                                <div className="flex flex-row items-center gap-3 w-full md:w-1/4">
                                    <div className="w-12 h-12 rounded-[18px] bg-[#FBD4D3] border-2 border-white shadow-sm flex items-center justify-center text-[#BC313F] overflow-hidden relative rotate-3 group-hover:rotate-0 transition-transform">
                                        <User className="w-6 h-6 opacity-50" />
                                    </div>
                                    <div className="text-right">
                                        <h4 className="font-black text-slate-800 text-sm">{student.username}</h4>
                                        <span className={`text-[10px] font-bold ${getStatusColor(student.level)}`}>{getLevelLabel(student.level)}</span>
                                    </div>
                                </div>

                                {/* Points */}
                                <div className="flex flex-col items-center md:items-start w-full md:w-1/6">
                                    <p className="text-[9px] text-slate-400 font-black mb-0.5 uppercase tracking-wider">مجموع النقاط</p>
                                    <p className="font-black text-slate-800  text-base">{student.totalPoints?.toLocaleString()}</p>
                                </div>

                                {/* Usage */}
                                <div className="flex flex-col items-center md:items-start w-full md:w-1/6">
                                    <p className="text-[9px] text-slate-400 font-black mb-0.5 uppercase tracking-wider">الاستخدام</p>
                                    <p className="font-black text-slate-800  text-base">{student.usageLabel}</p>
                                </div>

                                <div className="flex flex-row-reverse gap-3 w-full md:w-1/3 justify-start">
                                    <Link href={`/teacher/reports/view?studentId=${student.id}&view=topics`} className="flex-1">
                                        <button className="w-5/6 h-full flex flex-row-reverse items-center justify-center gap-1.5 px-3 py-2 bg-[#FBD4D3] hover:bg-[#F9C3C2] text-[#8D1716] rounded-xl text-xs font-black transition-all">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span className="truncate">عرض المواضيع</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
