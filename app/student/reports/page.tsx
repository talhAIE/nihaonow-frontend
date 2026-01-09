"use client";
import React, { useEffect, useState } from "react";
import { reportsApi } from "@/lib/api";
import { UsageChart, ProgressSummary, TopicDistribution } from "@/components/reports";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Filter, Loader2, TrendingUp, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSummary() {
      try {
        const data = await reportsApi.getSummary();
        setSummary(data);
      } catch (err) {
        console.error("Error fetching report summary:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      await reportsApi.exportReport();
      toast({
        title: "تم التحميل بنجاح",
        description: "تم تصدير تقريرك بصيغة PDF",
      });
    } catch (err) {
      toast({
        title: "خطأ في التحميل",
        description: "تعذر تصدير التقرير حالياً",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35AB4E]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900 font-almarai-extrabold">تقارير التقدم</h2>
          <p className="text-gray-500 mt-1">تحليل مفصل لرحلتك في تعلم اللغة العربية.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none flex items-center gap-2 rounded-xl border-slate-200 hover:bg-white shadow-sm transition-all hover:border-[#35AB4E]">
            <Calendar className="h-4 w-4 text-[#35AB4E]" />
            آخر 30 يوم
          </Button>
          <Button 
            disabled={exporting}
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center gap-2 bg-[#35AB4E] hover:bg-[#2f9c46] text-white rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Premium Header Section */}
      <section className="bg-white rounded-[32px] p-8 sm:p-10 border-2 border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 text-right">
          <div className="space-y-4 flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/30 text-xs font-bold text-white">
              <TrendingUp className="h-3 w-3" />
              نظرة عامة على الأداء
            </div>
            <h3 className="text-4xl font-black font-almarai-extrabold leading-tight">تحليل الإتقان<br/>والتطور المعرفي</h3>
            <p className="opacity-90 max-w-xl text-lg font-medium leading-relaxed">
              تتبع رحلة تعلمك من خلال مقاييس دقيقة توضح مناطق القوة والفرص القادمة للتحسين المستمر.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-center flex flex-col items-center justify-center min-w-[160px]">
              <p className="text-[10px] font-black opacity-80 mb-2 uppercase tracking-widest leading-none">مستوى الإتقان</p>
              <p className="text-4xl font-black leading-none">{summary?.averageScore || 92}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-center flex flex-col items-center justify-center min-w-[160px]">
              <p className="text-[10px] font-black opacity-80 mb-2 uppercase tracking-widest leading-none">تطور الأسبوع</p>
              <p className="text-4xl font-black leading-none">+{summary?.weeklyGain || 12}%</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ProgressSummary summary={summary} className="col-span-full lg:col-span-2 bg-white shadow-xl shadow-slate-100 border border-slate-100 rounded-3xl p-8" />
        <TopicDistribution className="bg-white shadow-xl shadow-slate-100 border border-slate-100 rounded-3xl p-8" />
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">تحليل الاستخدام</h3>
          <div className="flex gap-2">
            <button className="text-sm font-bold text-[#35AB4E] bg-green-50 px-3 py-1.5 rounded-lg transition-colors">يومي</button>
            <button className="text-sm font-bold text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg transition-colors">أسبوعي</button>
          </div>
        </div>
        <UsageChart />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white shadow-xl shadow-slate-100 border border-slate-100 rounded-3xl p-8">
          <h3 className="text-xl font-black mb-6 text-gray-900 font-almarai-extrabold text-right">المفردات المتقنة</h3>
          <div className="space-y-4">
            {[
                { zh: "你好", py: "Nǐ hǎo", en: "Hello", bg: 'bg-emerald-50', text: 'text-emerald-700' },
                { zh: "谢谢", py: "Xièxiè", en: "Thank you", bg: 'bg-green-50', text: 'text-green-700' },
                { zh: "再见", py: "Zàijiàn", en: "Goodbye", bg: 'bg-amber-50', text: 'text-amber-700' }
            ].map((word, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all hover:shadow-sm group">
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 ${word.bg} rounded-xl border border-white flex items-center justify-center font-black ${word.text} text-xl shadow-sm transition-transform group-hover:scale-110`}>{word.zh}</div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">{word.py}</p>
                    <p className="text-sm text-gray-400 font-bold">{word.en}</p>
                  </div>
                </div>
                <div className="bg-emerald-100/50 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200/50">
                  مكتمل
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white shadow-xl shadow-slate-100 border border-slate-100 rounded-3xl p-8">
          <h3 className="text-xl font-black mb-6 text-gray-900 font-almarai-extrabold text-right">الأهداف القادمة</h3>
          <div className="space-y-4">
            <div className="p-6 border border-green-100 bg-gradient-to-br from-green-50/80 to-[#E8F5E9]/80 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <p className="font-black text-green-900 text-lg mb-4 text-right">إنهاء الوحدة الرابعة</p>
              <div className="w-full bg-white h-3 rounded-full overflow-hidden p-0.5 border border-green-200/50 shadow-inner">
                <div className="bg-[#35AB4E] h-full w-3/4 rounded-full shadow-[0_0_12px_rgba(53,171,78,0.5)] transition-all duration-1000 group-hover:w-[80%]"></div>
              </div>
              <div className="flex justify-between items-center mt-3 font-black text-[10px] uppercase tracking-widest text-green-700/70">
                <span>متبقي درسان</span>
                <span>تم إنجاز 75%</span>
              </div>
            </div>
            
            <div className="p-6 border border-amber-100 bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-start justify-between">
                <div className="bg-white/60 p-2 rounded-lg">
                   <Trophy className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-right">
                  <p className="font-black text-amber-900 text-lg">سلسلة نشاط 10 أيام</p>
                  <p className="text-sm text-amber-700/70 mt-1 font-bold">أنت الآن في اليوم السابع، استمر!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
