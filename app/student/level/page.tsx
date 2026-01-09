"use client";
import React, { useState, useEffect } from "react";
import { teacherApi } from "@/lib/api";
import { StatCard } from "@/components/teacher/StatCard";
import { Award, Users, TrendingUp, Filter, Save, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function StudentLevelPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await teacherApi.getStudents();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const handleAssignLevel = (studentId: number, level: number) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, level } : s));
  };

  const saveChanges = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم تحديث مستويات الطلاب وتعيين المجموعات.",
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35AB4E]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-10 p-4 sm:p-8 pt-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 font-almarai-extrabold">مستوى الطلاب</h2>
          <p className="text-gray-500 mt-1">تحليل المقاييس وتعيين مستويات الطلاب للمجموعات الدراسية.</p>
        </div>
        <Button onClick={saveChanges} className="bg-[#35AB4E] hover:bg-[#2f9c46] text-white font-black h-12 px-8 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center gap-2">
          <Save className="h-5 w-5" />
          حفظ التغييرات
        </Button>
      </div>

      {/* Management Header Card */}
      <section className="bg-white rounded-[32px] p-8 sm:p-10 border-2 border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-right flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/30 text-xs font-bold">
              <Award className="h-4 w-4" />
              إدارة المستويات والكفاءة
            </div>
            <h3 className="text-4xl font-black font-almarai-extrabold leading-tight">تحليل القدرات<br/>وتخصيص المسارات</h3>
            <p className="opacity-90 max-w-xl text-lg font-medium leading-relaxed">
              استخدم هذه الواحدة لتحليل أداء طلابك بدقة وتعيينهم في المجموعات التي تتناسب مع مستواهم الحالي لضمان أفضل تجربة تعليمية.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
            {[
              { label: 'متوسط الإكمال', value: '78%', color: 'bg-white/15' },
              { label: 'المستويات', value: '5', color: 'bg-white/15' },
              { label: 'نشط الآن', value: '42', color: 'bg-yellow-400/20 text-yellow-300' }
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center justify-center p-6 rounded-[24px] backdrop-blur-md border border-white/10 min-w-[140px] ${stat.color} transition-all hover:bg-white/20`}>
                <p className="text-[10px] font-black opacity-80 mb-2 uppercase tracking-widest leading-none">{stat.label}</p>
                <p className="text-3xl font-black leading-none">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Analysis and Assignment Table */}
      <div className="bg-white shadow-2xl shadow-slate-100 rounded-[30px] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
              <Filter className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 font-almarai-extrabold">تحليل أداء الطلاب</h3>
              <p className="text-xs text-slate-400 font-bold mt-0.5">قم بفرز وتصنيف الطلاب حسب معايير الاستخدام</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                <th className="px-8 py-6">الطالب</th>
                <th className="px-8 py-6">ساعات الاستخدام</th>
                <th className="px-8 py-6">نسبة الإكمال</th>
                <th className="px-8 py-6">المستوى الحالي</th>
                <th className="px-8 py-6 text-center">تعيين المجموعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-400 shadow-inner group-hover:from-green-100 group-hover:to-green-200 group-hover:text-green-600 transition-all duration-300">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-black text-slate-700 text-lg group-hover:text-green-800 transition-colors">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black border border-blue-100/50 italic">
                      {student.usage || "0س"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2 min-w-[120px]">
                       <span className="font-black text-slate-500 text-[10px] uppercase tracking-wider">{student.progress || "0%"} مكتمل</span>
                       <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-50">
                         <div className="bg-[#35AB4E] h-full rounded-full shadow-[0_0_8px_rgba(53,171,78,0.3)] transition-all duration-1000" style={{ width: student.progress }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-amber-500 text-sm bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">المستوى {student.level}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                       <select 
                        value={student.level}
                        onChange={(e) => handleAssignLevel(student.id, parseInt(e.target.value))}
                        className="bg-white border-2 border-slate-100 rounded-[14px] px-5 py-2.5 font-black text-slate-600 outline-none focus:border-[#35AB4E] focus:ring-4 focus:ring-green-500/5 transition-all cursor-pointer shadow-sm hover:border-slate-300 text-sm"
                       >
                         <option value={1}>مجموعة المبتديين</option>
                         <option value={2}>مجموعة الأساسيات</option>
                         <option value={3}>مجموعة المتوسط</option>
                         <option value={4}>مجموعة المتقدمين</option>
                         <option value={5}>مجموعة المحترفين</option>
                       </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
