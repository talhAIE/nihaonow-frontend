"use client";

import { Search, Filter, Download, ChevronLeft, BookOpen, FileText, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Mock Data (same as Dashboard for consistency)
const students = [
  { id: 1, name: "سارة أحمد", status: "متوسط", statusColor: "text-amber-500", points: 9000000, usage: "80%" },
  { id: 2, name: "علي محمد", status: "مرتفع", statusColor: "text-green-500", points: 8500000, usage: "75%" },
  { id: 3, name: "ليلى حسن", status: "عالي", statusColor: "text-blue-500", points: 9500000, usage: "90%" },
  { id: 4, name: "عمر خالد", status: "ضعيف", statusColor: "text-red-500", points: 5000000, usage: "40%" },
  { id: 5, name: "فاطمة يوسف", status: "ضعيف", statusColor: "text-red-500", points: 500000, usage: "30%" },
  { id: 6, name: "أحمد كمال", status: "متوسط", statusColor: "text-amber-500", points: 800000, usage: "60%" },
];

export default function MyStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(s => s.name.includes(searchTerm));

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
         {/* Search Bar */}
         <div className="relative w-full md:w-1/2">
            <input 
                type="text" 
                placeholder="البحث عن الطلاب هنا..." 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-10 text-right focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
         </div>
         
         {/* Buttons */}
         <div className="flex gap-2 w-full md:w-auto">
             <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 shadow-sm flex-1 md:flex-none">
                 <Filter className="w-5 h-5" />
                 <span>المرشحات</span>
             </button>
             <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 shadow-sm flex-1 md:flex-none">
                 <Download className="w-5 h-5" />
                 <span>تحميل التقارير</span>
             </button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
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
      </div>
    </div>
  );
}
