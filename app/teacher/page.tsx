"use client";

import { Search, ChevronLeft, BookOpen, FileText, Users, Moon, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/api';

// Types for the teacher dashboard
interface TeacherDashboardStats {
    totalStudents: number;
    totalTopics: number;
    overallUsage: number;
    totalUsers: number;
    loggedInCount: number;
    notLoggedInCount: number;
}

interface StudentSummary {
    id: number;
    name: string;
    level: string;
    points: number;
    usage: string;
    statusColor: string;
}

export default function TeacherDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    
    // Structure for future API integration
    const [stats, setStats] = useState<TeacherDashboardStats>({
        totalStudents: 300,
        totalTopics: 20,
        overallUsage: 90,
        totalUsers: 2106080,
        loggedInCount: 3232,
        notLoggedInCount: 752
    });

    const [students, setStudents] = useState<StudentSummary[]>([
        { id: 1, name: "سارة أحمد", level: "متوسط", statusColor: "text-amber-500", points: 9000000, usage: "80%" },
        { id: 2, name: "علي محمد", level: "جيد", statusColor: "text-green-500", points: 7500000, usage: "75%" },
        { id: 3, name: "فاطمة يوسف", level: "ضعيف", statusColor: "text-red-500", points: 5000000, usage: "50%" },
    ]);

    useEffect(() => {
        // Simulating API fetch
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const filteredStudents = students.filter(s => s.name.includes(searchTerm));

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[60vh] text-amber-500 font-bold">جاري التحميل...</div>;
    }

    return (
        <div className="space-y-10" dir="rtl">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Students */}
                <div className="bg-[#D6F0E0] rounded-[24px] p-6 flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-40 transition-transform hover:scale-[1.02]">
                    <span className="text-[#2D9344] font-black text-sm mb-2">إجمالي الطلاب</span>
                    <span className="text-[#2D9344] text-5xl font-black font-nunito">{stats.totalStudents}</span>
                </div>

                {/* Total Topics */}
                <div className="bg-[#FFF8E1] rounded-[24px] p-6 flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-40 transition-transform hover:scale-[1.02]">
                    <span className="text-[#D9A51F] font-black text-sm mb-2">مجموع المواضيع</span>
                    <span className="text-[#D9A51F] text-5xl font-black font-nunito">{stats.totalTopics}</span>
                </div>

                {/* Overall Usage (Circular) */}
                <div className="bg-[#FFEEDA] rounded-[24px] p-6 flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-40 transition-transform hover:scale-[1.02] relative overflow-hidden">
                    <span className="text-[#E38B29] font-black text-sm mb-4">الاستخدام الإجمالي</span>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="#FADBB1"
                                strokeWidth="6"
                                fill="transparent"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="#E38B29"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 36}
                                strokeDashoffset={2 * Math.PI * 36 * (1 - stats.overallUsage / 100)}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-[#E38B29] text-xl font-black font-nunito">{stats.overallUsage}%</span>
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-[#FBD4D3] rounded-[24px] p-6 flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-40 transition-transform hover:scale-[1.02]">
                    <span className="text-[#BC313F] font-black text-sm mb-2">إجمالي المستخدمين</span>
                    <span className="text-[#BC313F] text-4xl lg:text-3xl xl:text-4xl font-black font-nunito">{stats.totalUsers.toLocaleString()}</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-50 p-6 md:p-10 space-y-8">
                {/* Login Status Row */}
                <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-8">
                    <div className="flex items-center gap-12">
                        {/* Logged In */}
                        <div className="text-center group">
                            <div className="flex items-center gap-2 justify-center mb-1">
                                <span className="text-slate-400 font-bold text-xs group-hover:text-[#CA495A] transition-colors">تم تسجيل الدخول</span>
                                <Users className="w-4 h-4 text-[#CA495A]" />
                            </div>
                            <div className="text-4xl font-black text-slate-800 font-nunito">{stats.loggedInCount}</div>
                        </div>

                        <div className="h-12 w-[1px] bg-slate-100 hidden md:block"></div>

                        {/* Not Logged In */}
                        <div className="text-center group">
                            <div className="flex items-center gap-2 justify-center mb-1">
                                <span className="text-slate-400 font-bold text-xs group-hover:text-amber-400 transition-colors">لم يسجل الدخول بعد</span>
                                <Moon className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="text-4xl font-black text-slate-800 font-nunito">{stats.notLoggedInCount}</div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-md">
                        <input
                            type="text"
                            placeholder="البحث عن الطلاب هنا..."
                            className="w-full bg-[#F5F5F5] border-none rounded-2xl py-4 px-12 text-right focus:outline-none focus:ring-2 focus:ring-[#FFCB08] transition-all font-bold text-slate-600 placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    <div className="flex flex-row-reverse justify-between items-center">
                        <div className="flex flex-row-reverse items-center gap-2">
                             <div className="bg-slate-800 p-1 rounded-md text-white">
                                <FileText className="w-4 h-4" />
                             </div>
                             <span className="font-black text-slate-800 text-lg">نتائج</span>
                        </div>
                        <Link href="/teacher/students" className="px-5 py-2 bg-slate-100 text-slate-500 rounded-full text-xs font-black hover:bg-slate-200 transition-colors flex items-center gap-2">
                             <span>طلابي</span>
                             <ChevronLeft className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Student Rows */}
                    <div className="space-y-4">
                        {filteredStudents.map((student) => (
                            <div key={student.id} className="group bg-white border border-slate-50 rounded-[28px] p-5 flex flex-row-reverse items-center justify-between hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
                                {/* Student Info */}
                                <div className="flex flex-row-reverse items-center gap-5 w-1/3">
                                    <div className="w-14 h-14 rounded-full bg-[#FBD4D3] border-4 border-white shadow-sm flex items-center justify-center text-[#BC313F] overflow-hidden relative">
                                        <User className="w-8 h-8 opacity-50" />
                                    </div>
                                    <div className="text-right">
                                        <h4 className="font-black text-slate-800 text-lg">{student.name}</h4>
                                        <span className={`text-xs font-bold ${student.statusColor}`}>{student.level}</span>
                                    </div>
                                </div>

                                {/* Stats Info */}
                                <div className="hidden md:flex flex-row-reverse items-center justify-center gap-16 w-1/3">
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold mb-0.5">مجموع النقاط</p>
                                        <p className="font-black text-slate-700 font-nunito text-lg">{student.points.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="w-1/3 flex justify-start">
                                    <Link href={`/teacher/reports/${student.id}`}>
                                        <button className="flex flex-row-reverse items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-700 text-sm font-black hover:bg-slate-50 transition-all">
                                            <span>منظر</span>
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All */}
                    <div className="pt-4">
                        <Link href="/teacher/students">
                            <button className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-100 rounded-[24px] text-slate-800 font-black hover:bg-slate-50 transition-all group">
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span>عرض الكل</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
