"use client";

import React, { useState, useEffect } from "react";
import { levelsApi } from "@/lib/api";
import { Trophy, Star, BookOpen, Clock, ChevronRight, Lock, CheckCircle2, Loader2, Sparkles, Target } from "lucide-react";
import type { LevelDefinition, UserLevelResponse } from "@/lib/types";
import { useAppContext } from "@/context/AppContext";
import AuthLanguageToggle from "@/components/auth/AuthLanguageToggle";
import { useMemo } from "react";

export default function StudentLevelPage() {
  const { dir } = useAppContext();
  const isAr = dir === 'rtl';

  const [definitions, setDefinitions] = useState<LevelDefinition[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevelResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const copy = {
    ar: {
      loading: 'جاري التحميل...',
      heroTitle: 'مرحباً ببطلنا الصغير!',
      heroSub: (level: number) => `أنت الآن في المستوى ${level}. كل درس هو خطوة نحو الاحتراف!`,
      totalPoints: 'نقطة إجمالية',
      streak: 'سلسلة الإنجازات',
      nextGoal: 'هدفك القادم',
      reachLevel: (name: string) => `الوصول إلى ${name}`,
      roadmapTitle: 'مسار التطور التعليمي',
      levelLabel: (l: number) => `المستوى ${String(l).padStart(2, '0')}`,
      lessons: 'دروس',
      hours: 'ساعات',
      youAreHere: 'أنت هنا حالياً',
      progressTopics: (done: number, total: number) => `${done} / ${total} مواضيع`,
      progressLeft: (left: number) => `باقي ${left} دروس`,
    },
    en: {
      loading: 'Loading...',
      heroTitle: 'Welcome, Little Hero!',
      heroSub: (level: number) => `You are now at level ${level}. Every lesson is a step to mastery!`,
      totalPoints: 'Total Points',
      streak: 'Achievement Streak',
      nextGoal: 'Next Goal',
      reachLevel: (name: string) => `Reach ${name}`,
      roadmapTitle: 'Educational Progress Path',
      levelLabel: (l: number) => `Level ${String(l).padStart(2, '0')}`,
      lessons: 'Lessons',
      hours: 'Hours',
      youAreHere: 'You are here',
      progressTopics: (done: number, total: number) => `${done} / ${total} Topics`,
      progressLeft: (left: number) => `${left} lessons remaining`,
    }
  } as const;

  const t = isAr ? copy.ar : copy.en;

  const localizeName = (name: string) => {
    if (typeof name === 'string' && name.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(name);
        return isAr ? (parsed.ar || parsed.en) : (parsed.en || parsed.ar);
      } catch (e) {}
    }
    return name;
  };

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
      <div className={`flex-1 flex items-center justify-center h-[80vh] ${isAr ? 'font-almarai' : 'font-nunito'}`} dir={dir}>
        <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#35AB4E] mx-auto mb-4" />
            <p className="text-slate-600 font-bold">{t.loading}</p>
        </div>
      </div>
    );
  }

  const currentLevelNum = userLevel?.level.level || 1;
  const nextLevel = definitions.find(d => d.level === currentLevelNum + 1);

  return (
    <div className={`flex-1 space-y-8 p-4 sm:p-8 pt-6 max-w-5xl mx-auto ${isAr ? 'font-almarai text-right' : 'font-nunito text-left'}`} dir={dir}>
      <div className={`flex ${isAr ? 'justify-start' : 'justify-end'}`}>
        <AuthLanguageToggle />
      </div>
      {/* Refined Compact Header - HCI Best Practice: Balanced Proportions */}
      <section className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className={`flex flex-col items-center sm:items-start text-center ${isAr ? 'sm:text-right' : 'sm:text-left'} gap-3 z-10`}>
          <div className="inline-flex items-center gap-2 bg-[#D6F0E0] text-[#2D9344] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
            {localizeName(userLevel?.level.name || "")}
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-almarai-extrabold line-clamp-1">{t.heroTitle}</h1>
          <p className="text-slate-500 font-bold text-sm max-w-xs leading-relaxed">
            {t.heroSub(currentLevelNum)}
          </p>
        </div>

        {/* Improved Metric Cards - HCI: Scannability */}
        <div className="flex items-center gap-4 z-10 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none bg-slate-50/50 p-4 rounded-3xl flex flex-col items-center gap-1 min-w-[120px] border border-slate-100/80 hover:border-[#35AB4E]/30 transition-all hover:bg-white sm:hover:scale-105">
            <div className="bg-amber-100/50 p-2 rounded-xl mb-1">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xl font-black text-slate-800">{(userLevel?.stats?.totalPoints || 0).toLocaleString()}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{t.totalPoints}</span>
          </div>
          <div className="flex-1 sm:flex-none bg-slate-50/50 p-4 rounded-3xl flex flex-col items-center gap-1 min-w-[120px] border border-slate-100/80 hover:border-[#35AB4E]/30 transition-all hover:bg-white sm:hover:scale-105">
            <div className="bg-green-100/50 p-2 rounded-xl mb-1">
              <Star className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-xl font-black text-slate-800">{userLevel?.stats?.currentStreak ?? 0}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{t.streak}</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-40" />
      </section>

      {/* Target Level Banner - HCI: Clear Feedback */}
      {nextLevel && (
        <div className="bg-gradient-to-r from-white to-[#f0faf2] border border-green-100/50 rounded-[32px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_4px_20px_rgba(53,171,78,0.03)]">
          <div className="flex items-center gap-4">
            <div className={`bg-[#35AB4E] p-3 rounded-2xl shadow-lg shadow-green-100 ${isAr ? '' : 'order-first'}`}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className={isAr ? "text-right" : "text-left"}>
              <h4 className="font-black text-slate-800 text-lg">{t.nextGoal}</h4>
              <p className="text-slate-500 font-bold text-sm">{t.reachLevel(localizeName(nextLevel.name))}</p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-sm space-y-3">
            <div className="flex justify-between items-end text-[10px] font-black text-slate-400 px-1 uppercase tracking-widest">
              <span>{t.progressTopics(userLevel?.stats.topicsCompleted || 0, nextLevel.minTopics)}</span>
              <span className="text-[#35AB4E] animate-pulse">{t.progressLeft(Math.max(0, nextLevel.minTopics - (userLevel?.stats.topicsCompleted || 0)))}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/20">
              <div
                className="bg-[#35AB4E] h-full rounded-full shadow-[0_0_8px_rgba(53,171,78,0.2)] transition-all duration-1000"
                style={{ width: `${Math.min(100, ((userLevel?.stats.topicsCompleted || 0) / nextLevel.minTopics) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Level Roadmap - Balanced spacing and sizes */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-800 px-2 font-almarai-extrabold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-slate-400" />
          {t.roadmapTitle}
        </h3>
        <div className="grid gap-3">
          {definitions.map((def, index) => {
            const isUnlocked = currentLevelNum >= def.level;
            const isCurrent = currentLevelNum === def.level;
            const isNext = currentLevelNum + 1 === def.level;
            const isCompleted = isUnlocked && !isCurrent;

            return (
              <div key={def.key} className={`flex items-center gap-4 group transition-all duration-300 ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}>
                {/* Status Icon */}
                <div className={`flex flex-col items-center min-w-[32px] sm:min-w-[48px]`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isCurrent ? 'bg-[#35AB4E] border-[#35AB4E] shadow-md scale-110' :
                    isCompleted ? 'bg-white border-[#35AB4E] text-[#35AB4E]' :
                      'bg-white border-slate-200 text-slate-300'
                    }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                      isCurrent ? <Trophy className="w-4 h-4 text-white" /> :
                        <Lock className="w-4 h-4" />}
                  </div>
                </div>

                {/* Level Card - HCI: Visual Hierarchy */}
                <div className={`flex-1 p-4 sm:p-5 rounded-[24px] border transition-all duration-300 flex items-center justify-between gap-4 ${isCurrent
                  ? "bg-white border-[#35AB4E] shadow-[0_4px_25px_rgba(53,171,78,0.08)] scale-[1.01]"
                  : isUnlocked
                    ? "bg-white border-slate-100 hover:border-slate-200"
                    : "bg-slate-50/50 border-transparent"
                  }`}>
                  <div className={`flex flex-col ${isAr ? 'text-right' : 'text-left'}`}>
                    <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isUnlocked ? 'text-[#35AB4E]' : 'text-slate-400'}`}>
                      {t.levelLabel(def.level)}
                    </span>
                    <h5 className={`font-black text-base sm:text-lg ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                      {localizeName(def.name)}
                    </h5>

                    {isLocked(def.level) && (
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {def.minTopics} {t.lessons}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {def.minUsageHours} {t.hours}</span>
                      </div>
                    )}
                  </div>

                  {isCurrent && (
                    <div className="bg-green-50 text-[#35AB4E] px-4 py-1.5 rounded-full text-[10px] font-black border border-green-100 whitespace-nowrap animate-bounce-subtle">
                      {t.youAreHere}
                    </div>
                  )}

                  {!isUnlocked && isNext && (
                    <ChevronRight className={`w-5 h-5 text-slate-300 ${isAr ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  function isLocked(level: number) {
    return currentLevelNum < level;
  }
}
