"use client";

import { ChevronLeft, Download, Clock, Trophy, Flame, Star, BookOpen, Medal, Scroll } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock Data
const user = {
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
        { label: "كتابة", score: 16.0 },
        { label: "نطق", score: 20.0 },
        { label: "الطلاقة", score: 14.0 },
    ],
    totalScore: 50.0,
    achievements: [1, 2, 3, 4, 5, 6], // Just placeholders
    certificates: [
        { name: "الخطوات الأولى في اللغة الصينية", color: "bg-[#FBD4D3]", textColor: "text-[#8D1716]", icon: "chart" },
        { name: "الخطوات الأولى في اللغة الصينية", color: "bg-[#D6F0E0]", textColor: "text-[#2D9344]", icon: "award" }
    ]
};

export default function StudentReportContent({ studentId }: { studentId: string }) {
  // In real app, fetch user by studentId

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
         <Link href="/teacher/students" className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-700 transition-colors">
            <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <ChevronLeft className="w-5 h-5" />
            </span>
            <span>تقرير الطالب</span>
         </Link>
         <button className="flex items-center gap-2 bg-[#35AB4E] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#2f9c46] shadow-sm transition-all">
            <Download className="w-5 h-5" />
            <span>تحميل</span>
         </button>
      </div>

      <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-slate-100 max-w-4xl mx-auto">
        
        {/* User Profile */}
        <div className="flex flex-col items-center mb-8">
            <div className={`w-28 h-28 rounded-full ${user.avatarColor} flex items-center justify-center mb-4 border-4 border-white shadow-lg`}>
                <User className={`w-12 h-12 ${user.avatarIconColor}`} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 font-almarai-extrabold">{user.name}</h1>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4 mb-8">
            {/* Row 1: Time & Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#D6F0E0] rounded-2xl p-4 flex items-center justify-center gap-3">
                    <Clock className="w-5 h-5 text-[#2D9344]" />
                    <span className="font-bold text-[#2D9344] text-sm">وقت الاستخدام: <span className="font-nunito">{user.usageTime}</span></span>
                </div>
                <div className="bg-[#D6F0E0] rounded-2xl p-4 flex items-center justify-center gap-3">
                    <Trophy className="w-5 h-5 text-[#2D9344]" />
                    <span className="font-bold text-[#2D9344] text-sm md:text-base">مجموع النقاط: <span className="font-nunito">{user.points}</span></span>
                </div>
            </div>

            {/* Row 2: Streaks */}
            <div className="bg-[#FFF8E1] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-around gap-6">
                 <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-5 h-5 text-amber-500 fill-current" />
                        <span className="font-bold text-gray-700 text-sm">سلسلة انتصارات حالية</span>
                    </div>
                    <div className="text-3xl font-black text-gray-800 font-nunito">{user.streak} <span className="text-sm font-bold text-gray-500">أيام</span></div>
                 </div>
                 <div className="hidden md:block w-[1px] h-12 bg-amber-200"></div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                         <Flame className="w-5 h-5 text-orange-500 fill-current" />
                        <span className="font-bold text-gray-700 text-sm">أطول سلسلة</span>
                    </div>
                    <div className="text-3xl font-black text-gray-800 font-nunito">{user.longestStreak} <span className="text-sm font-bold text-gray-500">أيام</span></div>
                 </div>
            </div>
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Monthly Report Card */}
            <div className="border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-center font-bold text-gray-800 mb-6 font-nunito">يناير 2026</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-500 border-b border-gray-50 pb-2">
                        <span>النتيجة</span>
                        <span>يكتب</span>
                    </div>
                    {user.skills.map((skill, i) => (
                        <div key={i} className="flex justify-between items-center">
                             <span className="font-bold text-gray-700">{skill.label}</span>
                             <span className="font-black text-gray-800 font-nunito">{skill.score.toFixed(1)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                        <span className="font-bold text-[#35AB4E]">مجموع النقاط</span>
                        <span className="font-black text-[#35AB4E] font-nunito">{user.totalScore.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Lecture Progress Card */}
            <div className="border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800">تقدم المحاضرات</h3>
                    <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>المحاضرات المكتملة</span>
                        <span className="font-nunito">{user.lectureProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-[#35AB4E] h-2.5 rounded-full" style={{ width: `${user.lectureProgress}%` }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#FBD4D3] rounded-xl p-3 flex flex-col items-center justify-center text-center h-20">
                         <span className="font-black text-[#8D1716] font-nunito text-xl">{user.lectures.completed}</span>
                         <span className="text-[10px] font-bold text-[#8D1716]">محاضرات مكتملة</span>
                    </div>
                    <div className="bg-[#D6F0E0] rounded-xl p-3 flex flex-col items-center justify-center text-center h-20">
                         <span className="font-black text-[#2D9344] font-nunito text-xl">{user.lectures.remaining}</span>
                         <span className="text-[10px] font-bold text-[#2D9344]">محاضرات متبقية</span>
                    </div>
                    <div className="bg-[#EBEBEB] rounded-xl p-3 flex flex-col items-center justify-center text-center h-20">
                         <span className="font-black text-gray-600 font-nunito text-xl">{user.lectures.minutes}</span>
                         <span className="text-[10px] font-bold text-gray-600">دقائق التعلم</span>
                    </div>
                    <div className="bg-[#FFEEDA] rounded-xl p-3 flex flex-col items-center justify-center text-center h-20">
                         <span className="font-black text-[#E38B29] font-nunito text-xl">{user.lectures.exercises}</span>
                         <span className="text-[10px] font-bold text-[#E38B29]">تمارين مكتملة</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Achievements Section */}
        <div className="border border-slate-100 rounded-3xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-800 mb-6 text-center">الإنجازات</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 justify-start md:justify-center no-scrollbar">
                {user.achievements.map((_, i) => (
                    <div key={i} className="flex flex-col items-center min-w-[80px]">
                        <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center border-4 border-yellow-200 shadow-sm mb-2">
                             <Star className="w-8 h-8 text-yellow-700 fill-current" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">Rising Star</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Certificates Section */}
        <div className="border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 text-center">شهادات</h3>
            <div className="space-y-3">
                {user.certificates.map((cert, i) => (
                    <div key={i} className={`${cert.color} p-4 rounded-2xl flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                             {cert.icon === 'award' ? <Medal className={`w-6 h-6 ${cert.textColor}`} /> : <Scroll className={`w-6 h-6 ${cert.textColor}`} />}
                             <span className={`font-bold text-sm md:text-base ${cert.textColor}`}>{cert.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

function User(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor" 
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-user ${props.className}`}
        >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" fill="none" />
        <circle cx="12" cy="7" r="4" fill="currentColor" stroke="none" opacity="0.2" />
        <circle cx="12" cy="7" r="4" fill="none" />
        </svg>
    )
}
