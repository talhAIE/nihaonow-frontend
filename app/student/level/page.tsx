"use client";
import React, { useState, useEffect } from "react";
import { levelsApi } from "@/lib/api";
import { Trophy, Star, BookOpen, Clock, ChevronRight, Lock, CheckCircle2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import type { LevelDefinition, UserLevelResponse } from "@/lib/types";

export default function StudentLevelPage() {
  const [definitions, setDefinitions] = useState<LevelDefinition[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevelResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [defs, myLevel] = await Promise.all([
          levelsApi.getDefinitions(),
          levelsApi.evaluateMe()
        ]);
        setDefinitions(defs);
        setUserLevel(myLevel);
      } catch (err) {
        console.error("Error fetching level data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#35AB4E]" />
      </div>
    );
  }

  const currentLevelNum = userLevel?.level.level || 1;

  return (
    <div className="flex-1 space-y-10 p-4 sm:p-8 pt-6 max-w-5xl mx-auto" dir="rtl">
      {/* Header Section */}
      <div className="text-right space-y-2">
        <h2 className="text-3xl font-black text-gray-900 font-almarai-extrabold">رحلتي التعليمية</h2>
        <p className="text-gray-500 font-bold">تتبع تقدمك واكتشف المستويات الجديدة التي يمكنك الوصول إليها.</p>
      </div>

      {/* Current Level Status Card */}
      {userLevel && (
        <section className="bg-gradient-to-br from-[#35AB4E] to-[#2D8F41] rounded-[40px] p-8 sm:p-12 text-white shadow-2xl shadow-green-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row-reverse items-center justify-between gap-10">
            <div className="flex-1 text-right space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/30 text-xs font-black uppercase tracking-wider">
                <Trophy className="h-4 w-4" />
                المستوى الحالي
              </div>
              <h1 className="text-5xl font-black font-almarai-extrabold">{userLevel.level.name}</h1>
              <p className="text-white/80 text-lg font-bold max-w-md">
                أنت الآن في مستوى {userLevel.level.name}. استمر في التقدم لفتح تحديات جديدة!
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/10 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase opacity-60 mb-1">المواضيع المكتملة</p>
                  <p className="text-2xl font-black">{userLevel.stats.topicsCompleted}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase opacity-60 mb-1">ساعات التعلم</p>
                  <p className="text-2xl font-black">{Math.floor(userLevel.stats.usageHours)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 relative">
               <div className="w-48 h-48 bg-white/10 rounded-[48px] border-4 border-white/20 flex items-center justify-center p-4">
                  <Trophy className="w-24 h-24 text-white drop-shadow-lg" />
               </div>
               <div className="absolute -bottom-4 -right-4 bg-amber-400 text-amber-900 w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl border-4 border-[#35AB4E] shadow-xl">
                 {currentLevelNum}
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Levels Timeline Roadmap */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-slate-800 font-almarai-extrabold">خريطة المستويات</h3>
        </div>

        <div className="relative space-y-6">
            {/* Timeline Line */}
            <div className="absolute top-0 bottom-0 right-7 sm:right-10 w-1 bg-slate-100 rounded-full"></div>

            {definitions.map((def, index) => {
                const isUnlocked = currentLevelNum >= def.level;
                const isCurrent = currentLevelNum === def.level;
                const isNext = currentLevelNum + 1 === def.level;

                return (
                    <div key={def.key} className="relative pr-16 sm:pr-24">
                        {/* Timeline Node */}
                        <div className={`absolute top-6 right-4 sm:right-6 w-8 h-8 rounded-full border-4 transition-all duration-500 z-10 ${
                            isUnlocked ? "bg-white border-[#35AB4E] scale-110" : "bg-slate-100 border-slate-200"
                        }`}>
                            {isUnlocked && <CheckCircle2 className="w-full h-full text-[#35AB4E] p-0.5" />}
                        </div>

                        {/* Level Card */}
                        <div className={`p-6 sm:p-8 rounded-[32px] border-2 transition-all duration-300 overflow-hidden relative ${
                             isCurrent 
                             ? "bg-white border-[#35AB4E] shadow-xl shadow-green-50 scale-[1.02]" 
                             : isUnlocked 
                             ? "bg-white border-slate-100 opacity-90" 
                             : "bg-slate-50 border-slate-100"
                        }`}>
                            {isCurrent && (
                                <div className="absolute top-0 right-0 py-1.2 px-4 bg-[#35AB4E] text-white text-[10px] font-black rounded-bl-2xl">
                                    مستواك الحالي
                                </div>
                            )}

                            <div className="flex flex-row-reverse items-start justify-between gap-4">
                                <div className="text-right flex-1">
                                    <div className="flex flex-row-reverse items-center gap-3 mb-2">
                                        <h4 className={`text-xl font-black ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                                            {def.name}
                                        </h4>
                                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black ${isUnlocked ? 'bg-green-50 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                            مستوى {def.level}
                                        </span>
                                    </div>
                                    <p className={`text-sm font-bold ${isUnlocked ? 'text-slate-500' : 'text-slate-400'} max-w-md`}>
                                        {isUnlocked ? "لقد وصلت إلى هذا المستوى الرائع!" : `المتطلبات: ${def.minTopics} مواضيع و ${def.minUsageHours} ساعات دراسة`}
                                    </p>

                                    {!isUnlocked && isNext && userLevel && (
                                        <div className="mt-6 space-y-3 max-w-sm ml-auto">
                                            <div className="flex flex-row-reverse justify-between text-[10px] font-black text-slate-400">
                                                <span>تقدم المواضيع</span>
                                                <span>{userLevel.stats.topicsCompleted} / {def.minTopics}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-amber-400 h-full rounded-full" 
                                                    style={{ width: `${Math.min(100, (userLevel.stats.topicsCompleted / def.minTopics) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={`p-4 rounded-2xl flex-shrink-0 ${
                                    isUnlocked ? 'bg-amber-50' : 'bg-slate-100'
                                }`}>
                                    {isUnlocked ? (
                                        <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                                    ) : (
                                        <Lock className="w-8 h-8 text-slate-300" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}
