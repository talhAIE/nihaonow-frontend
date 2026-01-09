"use client";

import { Search, ChevronLeft, BookOpen, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Mock Data
const stats = [
  { label: 'إجمالي الطلاب', value: 300, color: 'bg-[#D6F0E0]', textColor: 'text-[#2D9344]' },
  { label: 'مجموع المواضيع', value: 20, color: 'bg-[#FFF8E1]', textColor: 'text-[#D9A51F]' },
  { label: 'الاستخدام الإجمالي', value: '90%', color: 'bg-[#FFEEDA]', textColor: 'text-[#E38B29]', isCircular: true },
  { label: 'إجمالي المستخدمين', value: 2106080, color: 'bg-[#FBD4D3]', textColor: 'text-[#BC313F]' },
];

const students = [
  { id: 1, name: "سارة أحمد", status: "متوسط", statusColor: "text-amber-500", points: 9000000, usage: "80%" },
  { id: 2, name: "علي محمد", status: "مرتفع", statusColor: "text-green-500", points: 8500000, usage: "75%" },
  { id: 3, name: "ليلى حسن", status: "عالي", statusColor: "text-blue-500", points: 9500000, usage: "90%" },
  { id: 4, name: "عمر خالد", status: "ضعيف", statusColor: "text-red-500", points: 5000000, usage: "40%" },
];

export default function TeacherDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(s => s.name.includes(searchTerm));

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.color} rounded-2xl p-6 flex flex-col items-center justify-center h-32 md:h-40 shadow-sm transition-transform hover:scale-[1.02]`}>
            {stat.isCircular ? (
              <div className="relative flex items-center justify-center">
                 <div className="w-20 h-20 rounded-full border-4 border-[#E38B29] flex items-center justify-center">
                    <span className={`text-xl font-bold ${stat.textColor} font-nunito`}>{stat.value}</span>
                 </div>
                 <span className={`absolute -top-8 text-sm font-bold ${stat.textColor}`}>{stat.label}</span>
              </div>
            ) : (
                <>
                    <span className={`text-sm font-bold mb-2 ${stat.textColor}`}>{stat.label}</span>
                    <span className={`text-3xl md:text-4xl font-black ${stat.textColor} font-nunito`}>{stat.value.toLocaleString()}</span>
                </>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
         {/* Login Stats Header */}
         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-2 md:gap-4 rtl:flex-row-reverse">
                 {/* This section would need actual data props */}
                 {/* Placeholder for now based on design */}
            </div>
            
            <div className="flex gap-8 w-full md:w-auto justify-center md:justify-end">
                 <div className="text-center">
                    <div className="flex items-center gap-2 justify-center mb-1">
                        <span className="text-gray-400 font-bold text-sm">تم تسجيل الدخول</span>
                        <Users className="w-5 h-5 text-[#CA495A]" /> 
                    </div>
                    <div className="text-3xl font-black text-gray-800 font-nunito">3232</div>
                 </div>
                 <div className="h-12 w-[1px] bg-gray-200"></div>
                 <div className="text-center">
                    <div className="flex items-center gap-2 justify-center mb-1">
                        <span className="text-gray-400 font-bold text-sm">لم يسجل الدخول بعد</span>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div> {/* Moon icon representation */}
                    </div>
                    <div className="text-3xl font-black text-gray-800 font-nunito">752</div>
                 </div>
            </div>
         </div>

         {/* Search Filter */}
         <div className="relative mb-6">
            <input 
                type="text" 
                placeholder="البحث عن الطلاب هنا..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-10 text-right focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
         </div>

         {/* Results Label */}
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-bold text-gray-700">نتائج</span>
            </div>
         </div>

         {/* Student List */}
         <div className="space-y-3">
            {filteredStudents.map((student) => (
                <div key={student.id} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100 md:border-transparent">
                    {/* Student Info */}
                    <div className="flex items-center gap-4 w-full md:w-1/3 justify-end md:justify-end mb-4 md:mb-0 order-1 md:order-3">
                        <div className="text-right">
                             <h4 className="font-bold text-gray-800">{student.name}</h4>
                             <span className={`text-xs font-bold ${student.statusColor}`}>{student.status}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm text-gray-400">
                             <User className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Stats Middle */}
                    <div className="flex items-center justify-between w-full md:w-1/3 px-4 mb-4 md:mb-0 order-2 md:order-2">
                         <div className="text-center">
                             <div className="text-xs text-gray-400 font-bold mb-1">مجموع النقاط</div>
                             <div className="font-black text-gray-800 font-nunito">{student.points.toLocaleString()}</div>
                         </div>
                         <div className="text-center">
                             <div className="text-xs text-gray-400 font-bold mb-1">الاستخدام</div>
                             <div className="font-black text-gray-800 font-nunito">{student.usage}</div>
                         </div>
                    </div>

                    {/* Actions Left */}
                    <div className="flex gap-2 w-full md:w-1/3 order-3 md:order-1">
                        <Link href={`/teacher/reports/${student.id}`} className="flex-1">
                             <button className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-100 hover:border-slate-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-gray-50">
                                <ChevronLeft className="w-4 h-4" />
                                <span>عرض التقرير</span>
                             </button>
                        </Link>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-[#FBD4D3] hover:bg-[#F9C3C2] text-[#8D1716] py-2.5 rounded-xl text-sm font-bold transition-all">
                                <BookOpen className="w-4 h-4" />
                                <span className="truncate">عرض المواضيع المكتملة</span>
                        </button>
                    </div>
                </div>
            ))}
         </div>
         
         {/* View All Button */}
         <div className="mt-6 pt-4 border-t border-gray-100">
            <button className="w-full flex items-center justify-center gap-2 text-gray-500 font-bold hover:text-gray-700 transition-colors py-2">
                <ChevronLeft className="w-5 h-5" />
                <span>عرض الكل</span>
            </button>
         </div>
      </div>
    </div>
  );
}

// Helper icons
function User(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor" // Filled style as per design
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

function Users(props: any) {
    return (
        <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
    )
}
