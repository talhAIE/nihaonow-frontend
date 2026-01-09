"use client";

import { Search, Filter, Download, ChevronLeft, BookOpen, FileText, User, Users, Moon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock Data
const students = [
  { id: 1, name: "سارة أحمد", status: "متوسط", statusColor: "text-amber-500", points: 9000000, usage: "80%" },
  { id: 2, name: "علي محمد", status: "مرتفع", statusColor: "text-green-500", points: 8500000, usage: "75%" },
  { id: 3, name: "ليلى حسن", status: "عالي", statusColor: "text-blue-500", points: 9500000, usage: "90%" },
  { id: 4, name: "عمر خالد", status: "ضعيف", statusColor: "text-red-500", points: 5000000, usage: "40%" },
];

export default function MyStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(s => s.name.includes(searchTerm));

  return (
    <div className="space-y-10" dir="rtl">
      
      {/* Login Status & Search Section */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-50 p-6 md:p-10 space-y-8">
          {/* Login Status Row */}
          <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-8">
              <div className="flex items-center gap-12">
                  <div className="text-center group">
                      <div className="flex items-center gap-2 justify-center mb-1">
                          <span className="text-slate-400 font-bold text-xs">تم تسجيل الدخول</span>
                          <Users className="w-4 h-4 text-[#CA495A]" />
                      </div>
                      <div className="text-4xl font-black text-slate-800 font-nunito">3232</div>
                  </div>

                  <div className="h-12 w-[1px] bg-slate-100 hidden md:block"></div>

                  <div className="text-center group">
                      <div className="flex items-center gap-2 justify-center mb-1">
                          <span className="text-slate-400 font-bold text-xs">لم يسجل الدخول بعد</span>
                          <Moon className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-4xl font-black text-slate-800 font-nunito">752</div>
                  </div>
              </div>

              {/* Search Bar - Green themed as per design */}
              <div className="relative w-full md:max-w-md">
                  <input
                      type="text"
                      placeholder="البحث عن الطلاب هنا..."
                      className="w-full bg-white border-2 border-[#35AB4E] rounded-2xl py-4 px-12 text-right focus:outline-none focus:ring-4 focus:ring-[#35AB4E]/10 transition-all font-bold text-slate-600"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#35AB4E] w-5 h-5" />
              </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-row-reverse gap-4">
               <button className="flex flex-row-reverse items-center justify-center gap-2 bg-white border-2 border-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-sm">
                  <Download className="w-5 h-5" />
                  <span>تحميل التقارير</span>
               </button>
               <button className="flex flex-row-reverse items-center justify-center gap-2 bg-white border-2 border-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-sm">
                  <Filter className="w-5 h-5" />
                  <span>المرشحات</span>
               </button>
          </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
          <div className="flex flex-row-reverse items-center gap-2 px-2">
               <div className="bg-slate-800 p-1 rounded-md text-white">
                  <FileText className="w-4 h-4" />
               </div>
               <span className="font-black text-slate-800 text-lg">نتائج</span>
          </div>

          <div className="space-y-4">
              {filteredStudents.map((student) => (
                  <div key={student.id} className="group bg-white border border-slate-50 rounded-[32px] p-6 flex flex-col md:flex-row-reverse items-center justify-between hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 gap-6">
                      
                      {/* Name and Level */}
                      <div className="flex flex-row-reverse items-center gap-5 w-full md:w-1/4">
                          <div className="w-16 h-16 rounded-3xl bg-[#FBD4D3] border-4 border-white shadow-sm flex items-center justify-center text-[#BC313F] overflow-hidden relative rotate-3 group-hover:rotate-0 transition-transform">
                              <User className="w-10 h-10 opacity-50" />
                          </div>
                          <div className="text-right">
                              <h4 className="font-black text-slate-800 text-xl">{student.name}</h4>
                              <span className={`text-sm font-bold ${student.statusColor}`}>{student.status}</span>
                          </div>
                      </div>

                      {/* Points */}
                      <div className="flex flex-col items-center md:items-end w-full md:w-1/6">
                          <p className="text-[10px] text-slate-400 font-black mb-1 uppercase tracking-wider">مجموع النقاط</p>
                          <p className="font-black text-slate-800 font-nunito text-xl">{student.points.toLocaleString()}</p>
                      </div>

                      {/* Usage */}
                      <div className="flex flex-col items-center md:items-end w-full md:w-1/6">
                          <p className="text-[10px] text-slate-400 font-black mb-1 uppercase tracking-wider">الاستخدام</p>
                          <p className="font-black text-slate-800 font-nunito text-xl">{student.usage}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-row-reverse gap-3 w-full md:w-1/3">
                          <button className="flex-1 flex flex-row-reverse items-center justify-center gap-2 px-4 py-4 bg-[#FBD4D3] hover:bg-[#F9C3C2] text-[#8D1716] rounded-2xl text-sm font-black transition-all">
                              <BookOpen className="w-4 h-4" />
                              <span className="truncate">عرض المواضيع المكتملة</span>
                          </button>
                          
                          <Link href={`/teacher/reports/${student.id}`} className="flex-1">
                              <button className="w-full h-full flex flex-row-reverse items-center justify-center gap-2 px-6 bg-white border-2 border-slate-100 rounded-2xl text-slate-700 text-sm font-black hover:bg-slate-50 transition-all">
                                  <span>عرض التقرير</span>
                                  <ChevronLeft className="w-4 h-4" />
                              </button>
                          </Link>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
