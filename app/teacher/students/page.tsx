"use client";

import { Search, Filter, Download, ChevronLeft, BookOpen, FileText, User, Users, Moon, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { reportsApi, teacherApi } from '@/lib/api';
import { useAppContext } from '@/context/AppContext';
import AuthLanguageToggle from "@/components/auth/AuthLanguageToggle";

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
    const { dir } = useAppContext();
    const isAr = dir === "rtl";
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

    const t = isAr
        ? {
            results: "نتائج",
            sort: "الترتيب",
            sortBy: "ترتيب حسب",
            nameAsc: "الاسم (أ - ي)",
            nameDesc: "الاسم (ي - أ)",
            levelDesc: "المستوى (الأعلى أولاً)",
            pointsDesc: "النقاط (الأعلى أولاً)",
            downloadReports: "تحميل التقارير",
            searchPlaceholder: "البحث عن الطلاب هنا...",
            noStudents: "لا يوجد طلاب مطابقين للبحث",
            name: "الاسم",
            totalPoints: "مجموع النقاط",
            usage: "الاستخدام",
            view: "عرض",
            viewTopics: "عرض المواضيع",
            level: (n: number) => `مستوى ${n}`,
            loading: "جاري التحميل...",
            downloadFail: "فشل تحميل التقارير. يرجى المحاولة مرة أخرى.",
            reportFail: "فشل تحميل التقرير. يرجى المحاولة مرة أخرى.",
        }
        : {
            results: "Results",
            sort: "Sort",
            sortBy: "Sort by",
            nameAsc: "Name (A - Z)",
            nameDesc: "Name (Z - A)",
            levelDesc: "Level (High → Low)",
            pointsDesc: "Points (High → Low)",
            downloadReports: "Download reports",
            searchPlaceholder: "Search students...",
            noStudents: "No students match your search",
            name: "Name",
            totalPoints: "Total points",
            usage: "Usage",
            view: "View",
            viewTopics: "View topics",
            level: (n: number) => `Level ${n}`,
            loading: "Loading...",
            downloadFail: "Failed to download reports. Please try again.",
            reportFail: "Failed to download report. Please try again.",
        };

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
            alert(t.downloadFail);
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
            alert(t.reportFail);
            setCompilingId(null);
        }
    };

    const getLevelLabel = (level: number) => t.level(level);

    if (isLoading) {
        return <div className={`flex items-center justify-center min-h-[60vh] text-amber-500 ${isAr ? "font-bold" : "font-semibold"}`}>{t.loading}</div>;
    }

    return (
        <div className={`space-y-10 ${isAr ? "font-almarai" : "font-nunito"}`} dir={dir} lang={isAr ? "ar" : "en"}>
            <div className={`flex ${isAr ? "justify-start" : "justify-end"}`}>
                <AuthLanguageToggle activeBgClass="bg-[#FFCB08]" activeShadowClass="shadow-[0_2px_0_0_#DEA407]" />
            </div>
            {/* Results Section */}
            <div className="space-y-6">
                <div className="flex flex-col gap-4 px-2">
                    {/* Title Row */}
                    <div className={`flex items-center justify-center gap-2 ${isAr ? "lg:justify-end flex-row-reverse" : "lg:justify-start"}`}>
                        <div className="bg-slate-800 p-1 rounded-md text-white">
                            <FileText className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-black text-slate-800 text-base">{t.results}</span>
                    </div>

                    {/* Controls Row */}
                    <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-3 w-full">
                        {/* Left Group: Sort & Download Buttons */}
                        <div className="flex flex-row gap-3 w-full lg:w-auto">
                            {/* Sort Button */}
                            <div className="relative min-w-[120px] flex-1">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`flex items-center justify-center gap-1.5 w-full min-h-[32px] px-2 py-1 rounded-[8px] border-2 border-[#35AB4E] bg-[#35AB4E] text-white cursor-pointer font-bold ${isAr ? "text-[12px]" : "text-[12px]"} transition-all shadow-[0_2px_0_0_#20672F] whitespace-nowrap overflow-hidden text-ellipsis`}
                                >
                                    <Filter className="w-4 h-4" />
                                    <span>{t.sort}</span>
                                </button>

                                {isFilterOpen && (
                                    <div
                                        className={`absolute top-full mt-2 w-48 bg-white border-2 border-[#35AB4E] rounded-[8px] shadow-[0_2px_0_0_#20672F] z-50 overflow-hidden font-bold text-[10px] ${isAr ? "right-0" : "left-0"}`}
                                        dir={isAr ? "rtl" : "ltr"}
                                    >
                                        <div className="p-2 border-b border-[#35AB4E] bg-[#35AB4E]/10 text-[#35AB4E] text-[10px] uppercase">
                                            {t.sortBy}
                                        </div>
                                        <button
                                            onClick={() => { setSortBy("name"); setSortOrder("asc"); setIsFilterOpen(false); }}
                                            className={`w-full px-3 py-2 hover:bg-[#35AB4E]/10 transition-colors ${isAr ? "text-right" : "text-left"} ${sortBy === "name" && sortOrder === "asc" ? "bg-[#35AB4E] text-white" : "text-[#4B4B4B]"}`}
                                        >
                                            {t.nameAsc}
                                        </button>
                                        <button
                                            onClick={() => { setSortBy("name"); setSortOrder("desc"); setIsFilterOpen(false); }}
                                            className={`w-full px-3 py-2 hover:bg-[#35AB4E]/10 transition-colors ${isAr ? "text-right" : "text-left"} ${sortBy === "name" && sortOrder === "desc" ? "bg-[#35AB4E] text-white" : "text-[#4B4B4B]"}`}
                                        >
                                            {t.nameDesc}
                                        </button>
                                        <button
                                            onClick={() => { setSortBy("level"); setSortOrder("desc"); setIsFilterOpen(false); }}
                                            className={`w-full px-3 py-2 hover:bg-[#35AB4E]/10 transition-colors ${isAr ? "text-right" : "text-left"} ${sortBy === "level" && sortOrder === "desc" ? "bg-[#35AB4E] text-white" : "text-[#4B4B4B]"}`}
                                        >
                                            {t.levelDesc}
                                        </button>
                                        <button
                                            onClick={() => { setSortBy("points"); setSortOrder("desc"); setIsFilterOpen(false); }}
                                            className={`w-full px-3 py-2 hover:bg-[#35AB4E]/10 transition-colors ${isAr ? "text-right" : "text-left"} ${sortBy === "points" && sortOrder === "desc" ? "bg-[#35AB4E] text-white" : "text-[#4B4B4B]"}`}
                                        >
                                            {t.pointsDesc}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Download Button */}
                            <button
                                onClick={handleDownloadReports}
                                disabled={isDownloading || compilingId === -1}
                                className={`flex items-center justify-center gap-1.5 w-full min-h-[32px] px-2 py-1 rounded-[8px] border-2 border-[#35AB4E] bg-[#35AB4E] text-white cursor-pointer font-bold ${isAr ? "text-[12px]" : "text-[12px]"} transition-all shadow-[0_2px_0_0_#20672F] whitespace-nowrap overflow-hidden text-ellipsis disabled:opacity-50 disabled:cursor-not-allowed flex-1`}
                            >
                                {isDownloading || compilingId === -1 ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>{downloadProgress}%</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>{t.downloadReports}</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Search Bar - Far end on screens > 1024px */}
                        <div className="relative w-full lg:max-w-xs">
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                className={`w-full bg-white border border-[#35AB4E] border-b-[3px] border-b-[#298E3E] rounded-xl py-2 ${isAr ? "pl-10 pr-10 text-right" : "pl-10 pr-10 text-left"} focus:outline-none transition-all font-bold text-slate-600 text-sm h-10`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-[#35AB4E] w-4 h-4`} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 font-bold text-sm">{t.noStudents}</div>
                    ) : (
                        <>
                            {/* Table Headers */}
                            <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-gray-50 rounded-[20px] font-black text-slate-600 text-xs" dir={isAr ? "rtl" : "ltr"}>
                                <div className={isAr ? "text-right" : "text-left"}>{t.name}</div>
                                <div className="text-left">{t.totalPoints}</div>
                                <div className="text-left">{t.usage}</div>
                                <div className="text-left">{t.view}</div>
                            </div>
                            
                            {/* Student Cards */}
                            <div className="flex flex-col space-y-4">
                                {filteredStudents.map((student) => (
                                    <div key={student.id} className="group bg-white border border-slate-50 rounded-[20px] p-4 flex flex-col hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 gap-4">
                                        <div className="grid grid-cols-4 gap-4 w-full overflow-x-auto" dir={isAr ? "rtl" : "ltr"}>
                                            {/* Name and Level */}
                                            <div className={`flex items-center gap-3 min-w-0 ${isAr ? "flex-row" : "flex-row"}`}>
                                                <div className="w-8 h-8 min-w-8 min-h-8 max-w-8 max-h-8 flex-none rounded-[18px] bg-[#FBD4D3] border-2 border-white shadow-sm flex items-center justify-center text-[#BC313F] overflow-hidden relative rotate-3 group-hover:rotate-0 transition-transform max-[400px]:hidden">
                                                    <User className="w-4 h-4 opacity-50" />
                                                </div>
                                                <div className={isAr ? "text-right" : "text-left"}>
                                                    <h4 className="font-black text-[12px] text-slate-800 truncate max-w-[10rem] sm:max-w-none">{student.username}</h4>
                                                    <span className={`text-[9px] font-bold ${getStatusColor(student.level)}`}>{getLevelLabel(student.level)}</span>
                                                </div>
                                            </div>

                                            {/* Points */}
                                            <div className={`flex items-center ${isAr ? "justify-end" : "justify-start"}`}>
                                                <p className={`font-semibold text-slate-800 text-sm ${isAr ? "mr-2" : ""}`}>{student.totalPoints?.toLocaleString()}</p>
                                            </div>

                                            {/* Usage */}
                                            <div className={`flex items-center ${isAr ? "justify-end" : "justify-start"}`}>
                                                <p className={`font-semibold text-slate-800 text-sm ${isAr ? "mr-2" : ""}`}>{student.usageLabel}</p>
                                            </div>

                                            {/* View Button */}
                                            <div className={`flex items-center ${isAr ? "justify-end" : "justify-start"}`}>
                                                <Link
                                                    href={`/teacher/reports/view?studentId=${student.id}&view=topics`}
                                                    className="flex items-center justify-center h-8 w-8 rounded-xl bg-[#FBD4D3] hover:bg-[#F9C3C2] text-[#8D1716] transition-all"
                                                    aria-label={t.viewTopics}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
