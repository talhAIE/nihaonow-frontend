"use client";

import { ChevronLeft, Download, Clock, Trophy, Flame, Star, BookOpen, Medal, Scroll, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Mock Data
const studentData = {
    id: 1,
    name: "جون دو",
    avatarColor: "bg-[#FBD4D3]",
    avatarIconColor: "text-[#CA495A]",
    usageTime: "2h 45m",
    points: 9000,
    streak: 7, 
    longestStreak: 17,
    lectureProgress: 68,
    lectures: { completed: 24, remaining: 11, minutes: 156, exercises: 89 },
    skills: [
        { label: "دقة", score: 16.0 },
        { label: "نطق", score: 20.0 },
        { label: "الطلاقة", score: 14.0 },
    ],
    totalScore: 50.0,
    achievements: [1, 2, 3, 4, 5, 6],
    certificates: [
        { name: "الخطوات الأولى في اللغة الصينية", color: "bg-[#FBD4D3]", textColor: "text-[#8D1716]", icon: "chart" },
        { name: "الخطوات الأولى في اللغة الصينية", color: "bg-[#D6F0E0]", textColor: "text-[#2D9344]", icon: "award" }
    ]
};

export default function StudentReportContent({ studentId }: { studentId: string }) {
  const [user, setUser] = useState(studentData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [studentId]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-amber-500 font-bold">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-row-reverse justify-between items-center">
         <Link href="/teacher/students" className="flex flex-row-reverse items-center gap-3 text-slate-500 font-black hover:text-slate-700 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm">
                <ChevronLeft className="w-5 h-5 ml-1" />
            </span>
            <span className="text-xl">تقرير الطالب</span>
         </Link>
         <button className="flex flex-row-reverse items-center gap-2 bg-[#35AB4E] text-white px-7 py-3 rounded-2xl font-black hover:bg-[#2f9c46] shadow-lg shadow-green-100 transition-all">
            <Download className="w-5 h-5" />
            <span>تحميل</span>
         </button>
      </div>

      <div className="bg-white rounded-[48px] p-8 md:p-14 shadow-sm border border-slate-50 max-w-5xl mx-auto space-y-12">
        
        {/* User Profile */}
        <div className="flex flex-col items-center">
            <div className={`w-32 h-32 rounded-[40px] ${user.avatarColor} flex items-center justify-center mb-5 border-4 border-white shadow-xl rotate-3`}>
                <User className={`w-16 h-16 ${user.avatarIconColor} opacity-50`} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 font-almarai-extrabold">{user.name}</h1>
        </div>

        {/* Stats Summary Panel */}
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#D6F0E0] rounded-[28px] p-5 flex flex-row-reverse items-center justify-center gap-4 border-2 border-white shadow-sm">
                    <div className="bg-white p-2 rounded-xl">
                        <Clock className="w-5 h-5 text-[#2D9344]" />
                    </div>
                    <span className="font-black text-[#2D9344] text-lg">وقت الاستخدام: <span className="font-nunito">{user.usageTime}</span></span>
                </div>
                <div className="bg-[#D6F0E0] rounded-[28px] p-5 flex flex-row-reverse items-center justify-center gap-4 border-2 border-white shadow-sm">
                    <div className="bg-white p-2 rounded-xl">
                        <Trophy className="w-5 h-5 text-[#2D9344]" />
                    </div>
                    <span className="font-black text-[#2D9344] text-lg">مجموع النقاط: <span className="font-nunito">{user.points}</span></span>
                </div>
            </div>

            <div className="bg-[#FFF8E1] rounded-[32px] p-8 flex flex-col md:flex-row-reverse items-center justify-around gap-8 border-2 border-white shadow-sm">
                 <div className="flex flex-col items-center">
                    <div className="flex flex-row-reverse items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="font-black text-amber-900 text-sm">سلسلة انتصارات حالية</span>
                    </div>
                    <div className="text-5xl font-black text-slate-800 font-nunito">{user.streak} <span className="text-base font-bold text-slate-400">أيام</span></div>
                 </div>
                 
                 <div className="hidden md:block w-[1px] h-20 bg-amber-200/50"></div>
                 
                 <div className="flex flex-col items-center">
                    <div className="flex flex-row-reverse items-center gap-2 mb-2">
                         <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                        <span className="font-black text-amber-900 text-sm">أطول سلسلة</span>
                    </div>
                    <div className="text-5xl font-black text-slate-800 font-nunito">{user.longestStreak} <span className="text-base font-bold text-slate-400">أيام</span></div>
                 </div>
            </div>
        </div>

        {/* Detailed Breakdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Skills & Scores Card */}
            <div className="bg-white border-2 border-slate-50 rounded-[40px] p-8 space-y-8">
                <h3 className="text-center font-black text-slate-800 text-xl font-nunito">يناير 2026</h3>
                <div className="space-y-5">
                    <div className="flex flex-row-reverse justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-50">
                        <span>النتيجة</span>
                        <span>يكتب</span>
                    </div>
                    {user.skills.map((skill, i) => (
                        <div key={i} className="flex flex-row-reverse justify-between items-center group">
                             <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{skill.label}</span>
                             <span className="font-black text-slate-800 font-nunito text-xl">{skill.score.toFixed(1)}</span>
                        </div>
                    ))}
                    <div className="flex flex-row-reverse justify-between items-center pt-5 border-t-2 border-slate-50 mt-5">
                        <span className="font-black text-[#35AB4E] text-lg">مجموع النتائج</span>
                        <span className="font-black text-[#35AB4E] font-nunito text-3xl">{user.totalScore.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Topic Progress Card */}
            <div className="bg-white border-2 border-slate-50 rounded-[40px] p-8 space-y-8">
                <div className="flex flex-row-reverse justify-between items-center">
                    <h3 className="font-black text-slate-800 text-xl">تقدم المحاضرات</h3>
                    <div className="bg-slate-800 p-1 rounded-md text-white">
                        <BookOpen className="w-4 h-4" />
                    </div>
                </div>
                
                <div className="space-y-3">
                    <div className="flex flex-row-reverse justify-between text-xs font-black text-slate-400 uppercase">
                        <span>المحاضرات المكتملة</span>
                        <span className="font-nunito">{user.lectureProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-50 rounded-full h-3 border border-slate-100 overflow-hidden p-0.5">
                        <div className="bg-[#35AB4E] h-full rounded-full shadow-[0_0_10px_rgba(53,171,78,0.3)]" style={{ width: `${user.lectureProgress}%` }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FBD4D3]/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-24 border border-[#FBD4D3]">
                         <span className="font-black text-[#BC313F] font-nunito text-3xl leading-none mb-1">{user.lectures.completed}</span>
                         <span className="text-[10px] font-black text-[#BC313F]">محاضرات مكتملة</span>
                    </div>
                    <div className="bg-[#D6F0E0]/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-24 border border-[#D6F0E0]">
                         <span className="font-black text-[#2D9344] font-nunito text-3xl leading-none mb-1">{user.lectures.remaining}</span>
                         <span className="text-[10px] font-black text-[#2D9344]">محاضرات متبقية</span>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-24 border border-slate-100">
                         <span className="font-black text-slate-600 font-nunito text-3xl leading-none mb-1">{user.lectures.minutes}</span>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">دقائق التعلم</span>
                    </div>
                    <div className="bg-[#FFEEDA]/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-24 border border-[#FFEEDA]">
                         <span className="font-black text-[#E38B29] font-nunito text-3xl leading-none mb-1">{user.lectures.exercises}</span>
                         <span className="text-[10px] font-black text-[#E38B29]">تمارين مكتملة</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white border-2 border-slate-50 rounded-[40px] p-8 md:p-12 space-y-10">
            <h3 className="font-black text-slate-800 text-2xl text-center">الإنجازات</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-8 justify-items-center">
                {user.achievements.map((_, i) => (
                    <div key={i} className="flex flex-col items-center group">
                        <div className="w-20 h-20 rounded-[28px] bg-amber-400 flex items-center justify-center border-4 border-white shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                             <Star className="w-10 h-10 text-white fill-white" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Rising Star</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Certificates Section */}
        <div className="bg-white border-2 border-slate-50 rounded-[40px] p-8 md:p-12 space-y-10">
            <h3 className="font-black text-slate-800 text-2xl text-center">الشهادات</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {user.certificates.map((cert, i) => (
                    <div key={i} className={`${cert.color} p-6 rounded-[32px] flex flex-row-reverse items-center justify-between border-4 border-white shadow-sm hover:scale-[1.02] transition-transform cursor-pointer`}>
                        <div className="flex flex-row-reverse items-center gap-4">
                             <div className="bg-white p-3 rounded-2xl">
                                {cert.icon === 'award' ? <Medal className={`w-7 h-7 ${cert.textColor}`} /> : <Scroll className={`w-7 h-7 ${cert.textColor}`} />}
                             </div>
                             <span className={`font-black text-base ${cert.textColor}`}>{cert.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
