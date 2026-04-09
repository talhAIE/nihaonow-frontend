"use client";
import FireSVG from "@/public/svgs/fire.svg";
import RedStarSVG from "@/public/svgs/redstar.svg";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Play,
  Pause,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigation } from "@/lib/navigation";
import { useSession } from "@/hooks/useSession";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import ArabicStatsChart from "@/components/dashboard/charts";
import { dashboardApi } from "@/lib/services/dashboard";
import { levelsApi } from "@/lib/services/levels";
import { wordOfWeekApi } from "@/lib/services/word-of-week";
import type {
  ConsolidatedDashboardResponse,
  UserLevelResponse,
  LevelDefinition,
} from "@/lib/types";
import GuidePopup from "@/components/dashboard/GuidePopup";
import { guidePersistence } from "@/lib/guidePersistence";
import AuthLanguageToggle from "@/components/auth/AuthLanguageToggle";

export default function Page() {
  const { goToStudentScenario } = useNavigation();
  const [dashboardData, setDashboardData] =
    useState<ConsolidatedDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState("weekly");
  const [startingSession, setStartingSession] = useState<number | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevelResponse | null>(null);
  const [levelDefinitions, setLevelDefinitions] = useState<LevelDefinition[]>(
    [],
  );
  const [isPronunciationPlaying, setIsPronunciationPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(
    null,
  );
  const [is1024Width, setIs1024Width] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { state, setState, dir } = useAppContext();
  const isAr = dir === "rtl";
  const fireOffsetPx = isAr ? -48 : 0;

  const copy = {
    ar: {
      loading: "جاري التحميل...",
      retry: "إعادة المحاولة",
      errorLoad: "تعذر تحميل لوحة التحكم",
      studentFallback: "الطالب",
      welcomeBack: "مرحبًا بعودتك يا",
      smallPanda: "الباندا الصغيرة",
      beginner: "مبتدئ",
      myLevel: "مستواي",
      wordOfWeek: "مفردة الأسبوع",
      startLearning: "بدء التعلم",
      metricsTitle: "المؤشرات الرئيسة للأداء",
      tabDaily: "يومي",
      tabWeekly: "إحصائيات أسبوعية",
      tabMonthly: "إحصائيات شهرية",
      pronunciation: "مهارة النطق",
      fluency: "مستوى الطلاقة",
      accuracy: "معدل الدقة",
      longestStreak: "أطول خط",
      currentStreak: "الخط الحالي",
      days: "أيام",
      progressTitle: "مدى التقدم في المحاضرات",
      noTopics: "لا توجد مواضيع متاحة حاليًا",
      lessonUnit1: "الوحدة 1: مهارات الترحيب",
      lessonUnit10: "الوحدة 10: مهارات التعبير عن الشكر",
      lessons: "درس",
      of: "من",
      loadingMore: "جاري التحميل...",
      continueProgress: "متابعة التقدم",
      wordFallback: "مرحباً",
      wordEnglishFallback: "Hello",
    },
    en: {
      loading: "Loading...",
      retry: "Try again",
      errorLoad: "Failed to load dashboard",
      studentFallback: "Student",
      welcomeBack: "Welcome back,",
      smallPanda: "Little Panda",
      beginner: "Beginner",
      myLevel: "My Level",
      wordOfWeek: "Word of the Week",
      startLearning: "Start Learning",
      metricsTitle: "Key Performance Metrics",
      tabDaily: "Daily",
      tabWeekly: "Weekly Stats",
      tabMonthly: "Monthly Stats",
      pronunciation: "Pronunciation",
      fluency: "Fluency",
      accuracy: "Accuracy",
      longestStreak: "Longest Streak",
      currentStreak: "Current Streak",
      days: "Days",
      progressTitle: "Lesson Progress",
      noTopics: "No topics available right now",
      lessonUnit1: "Unit 1: Greeting Skills",
      lessonUnit10: "Unit 10: Appreciation Skills",
      lessons: "lessons",
      of: "of",
      loadingMore: "Loading...",
      continueProgress: "Continue Progress",
      wordFallback: "Hello",
      wordEnglishFallback: "Hello",
    },
  } as const;

  const t = isAr ? copy.ar : copy.en;
  const LevelChevron = isAr ? ChevronLeft : ChevronRight;

  useEffect(() => {
    const checkWidth = () => {
      setIs1024Width(window.innerWidth >= 1024 && window.innerWidth < 1280);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    if (state.authUser?.id && state.authUser?.isFirstLogin && state.isInitialized) {
      // Check if already completed in localStorage
      const isCompleted = guidePersistence.isCompleted(state.authUser.id, 'dashboard');
      if (!isCompleted) {
        setShowGuide(true);
      }
    }
  }, [state.authUser, state.isInitialized]);

  const handleCloseGuide = () => {
    setShowGuide(false);
    if (state.authUser?.id) {
      guidePersistence.setCompleted(state.authUser.id, 'dashboard');
    }
  };

  const { startSession, startWordSession } = useSession();

  const handleContinue = async (topicId: number) => {
    try {
      setStartingSession(topicId);
      await startSession(topicId);
      goToStudentScenario();
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setStartingSession(null);
    }
  };

  const handlePronunciationPlay = () => {
    if (!wordOfTheWeek?.audioUrl) return;

    if (isPronunciationPlaying && audioInstance) {
      audioInstance.pause();
      setIsPronunciationPlaying(false);
      return;
    }

    const audio = new Audio(wordOfTheWeek.audioUrl);
    setAudioInstance(audio);
    audio.play();
    setIsPronunciationPlaying(true);
    audio.onended = () => setIsPronunciationPlaying(false);
  };

  const tabs = [
    { key: "daily", label: t.tabDaily },
    { key: "weekly", label: t.tabWeekly },
    { key: "monthly", label: t.tabMonthly },
  ];

  const fetchData = async () => {
    try {
      setError(null);
      const data = await dashboardApi.getDashboard(); // Always fresh
      setDashboardData(data);
      if (data.overview?.userName) {
        localStorage.setItem("userName", data.overview.userName);
      }
      // Fetch named level and definitions only if missing? Or always? Let's check complexity.
      // Usually infrequent changes, but let's keep it safe.
      const [levelData, defs] = await Promise.all([
        levelsApi.evaluateMe(),
        levelsApi.getDefinitions(), // Usually static, could be optimized
      ]);
      setUserLevel(levelData);
      setLevelDefinitions(defs);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(t.errorLoad);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    // Check if user has just completed a session (sessionFeedback exists in sessionStorage)
    const hasJustCompletedSession = !!sessionStorage.getItem("sessionFeedback");

    fetchData();
    // Add listener for focus to refetch data
    const onFocus = () => {
      fetchData();
    };
    // Add listener for storage events (triggered when user completes a session and clears session data)
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "sessionFeedback" && !e.newValue) {
        // Session feedback was cleared, meaning user returned from feedback page
        fetchData();
      }
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorageChange);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  if (loading && initialLoad) {
    return (
      <div
        className={`min-h-screen bg-white flex items-center justify-center ${isAr ? "font-almarai" : "font-nunito"}`}
        dir={dir}
        lang={isAr ? "ar" : "en"}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35AB4E] mx-auto mb-4"></div>
          <p className="text-slate-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen bg-white flex items-center justify-center ${isAr ? "font-almarai" : "font-nunito"}`}
        dir={dir}
        lang={isAr ? "ar" : "en"}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#35AB4E] text-white rounded-lg"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  // Use real data or fallback to cached/defaults
  const overview = dashboardData?.overview;
  const topicProgress = dashboardData?.progress?.topics || [];
  const metrics = dashboardData?.metrics;
  const userName =
    overview?.userName ||
    (typeof window !== "undefined" ? localStorage.getItem("userName") : null) ||
    t.studentFallback;
  const currentStreak = overview?.currentStreak || 0;
  const longestStreak = overview?.longestStreak || 0;
  const level = overview?.level || 1;
  const xp = overview?.xp || 0;
  const xpProgress = overview?.xpProgress || 0;
  const wordOfTheWeek = overview?.wordOfTheWeek;

  // Calculate Named Level progress
  const nextLevel = levelDefinitions.find(
    (d) => d.level === (userLevel?.level.level || 0) + 1,
  );
  let namedProgress = 0;
  if (userLevel && nextLevel) {
    // Calculate progress based on topics (could also factor in hours)
    const topicProgress =
      (userLevel.stats.topicsCompleted / nextLevel.minTopics) * 100;
    const hourProgress =
      (userLevel.stats.usageHours / nextLevel.minUsageHours) * 100;
    // Use the lower of the two or an average? Let's use topics as the main driver for the bar
    namedProgress = Math.min(100, topicProgress);
  } else if (userLevel?.level.level === levelDefinitions.length) {
    namedProgress = 100; // Max level
  }

  return (
    <div className={`relative min-h-screen bg-white ${isAr ? "font-almarai" : "font-nunito"}`} dir={dir} lang={isAr ? "ar" : "en"}>
      <div className="max-w-full mx-auto px-2 sm:px-6">
        <div className={`absolute top-4 ${isAr ? "left-4" : "right-4"} z-20`}>
          <AuthLanguageToggle />
        </div>
        <GuidePopup isOpen={showGuide} onClose={handleCloseGuide} />
        <div className="mt-4">&nbsp;</div>
        <h1
          className={`${isAr ? "text-right" : "text-left"} ${isAr ? "font-almarai" : "font-nunito"} mb-8 hidden sm:block`}
          style={{ fontSize: "22px" }}
        >
          {t.welcomeBack}{" "}
          <span className="text-red-600 font-bold">{userName}</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
          {/* Level Progress */}
          <div id="levels-card" className={`bg-white rounded-[24px] lg:rounded-[32px] border border-slate-100 p-0 shadow-sm flex flex-col ${isAr ? "sm:flex-row-reverse" : "sm:flex-row"} items-stretch overflow-hidden h-full`}>
            {/* Image decoration on the left - Hidden on mobile and tablet */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Clouds from design */}
              <div className="absolute top-6 right-8 z-10 w-10 opacity-80">
                <Image
                  src="/images/clouddd.png"
                  alt="cloud"
                  width={40}
                  height={20}
                  className="object-contain w-auto h-auto"
                />
              </div>

              <Image
                src="/images/Object.png"
                alt="Level Decoration"
                width={110}
                height={110}
                priority
                className="object-contain relative z-0 mt-4 w-auto h-auto"
              />
            </div>

            {/* Level Info on the right */}
            <div className={`flex-1 flex ${isAr ? "flex-row-reverse" : "flex-row"} items-center justify-between p-6 gap-6`}>
              <div className={`${isAr ? "text-right" : "text-left"} flex-1`}>
                <h3 className={`text-[#332902] ${isAr ? "font-almarai-extrabold" : "font-nunito"} text-xl lg:text-2xl mb-1 leading-tight`}>
                  {userLevel ? `${userLevel.level.name}` : t.smallPanda}
                </h3>
                <p className="text-[#35AB4E] font-bold text-sm mb-4">
                  {t.beginner}
                </p>

                <div className={`h-10 px-4 bg-[#35AB4E] text-white text-sm font-bold rounded-lg border-b-2 border-[#20672F] flex items-center gap-2 w-fit ${isAr ? "flex-row" : "flex-row-reverse"}`}>
                  <LevelChevron className="w-4 h-4" strokeWidth={3} />
                  <span>{t.myLevel}</span>
                </div>
              </div>

              {/* Level Icon/Placeholder Square from design */}
              <div className="relative w-20 h-20 lg:w-28 lg:h-28 bg-[#F0FDF4] rounded-[24px] flex-shrink-0 flex flex-col items-center justify-center overflow-hidden">
                <Image
                  src={
                    userLevel?.level?.level &&
                    userLevel.level.level >= 1 &&
                    userLevel.level.level <= 6
                      ? `/Levels/${userLevel.level.level}.svg`
                      : "/images/PANDA.png"
                  }
                  alt={`Level ${userLevel?.level?.level || "icon"}`}
                  width={90}
                  height={90}
                  className="object-contain w-full h-full p-2"
                />
              </div>
            </div>
          </div>
          {/* Word of the Week */}
          <div id="word-of-week-card" className="bg-white rounded-[24px] lg:rounded-[32px] border border-slate-100 p-6 flex flex-col shadow-sm relative overflow-hidden h-full">
            {/* Decorative Star */}
            <div className={`absolute top-4 ${isAr ? "left-4" : "right-4"}`}>
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>

            <div className={`w-full ${isAr ? "text-right" : "text-left"} mb-2`}>
              <h4 className={`${isAr ? "font-almarai-extrabold" : "font-nunito"} text-[#4B4B4B] text-sm lg:text-base`}>
                {t.wordOfWeek}
              </h4>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <div className="flex flex-row items-center justify-center gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <p className="text-5xl font-black text-[#35AB4E] mb-2 ">
                    {wordOfTheWeek?.chinese || t.wordFallback}
                  </p>
                  <p className="text-slate-600 font-bold text-lg mb-1">
                    {wordOfTheWeek?.pinyin || "Nǐ hǎo"}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {wordOfTheWeek?.english || t.wordEnglishFallback}
                  </p>
                </div>

                <button
                  onClick={handlePronunciationPlay}
                  disabled={!wordOfTheWeek?.audioUrl}
                  className={`w-10 h-10 rounded-full bg-[#35AB4E] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all ${isPronunciationPlaying ? "bg-[#298E3E]" : ""} ${!wordOfTheWeek?.audioUrl ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isPronunciationPlaying ? (
                    <Pause className="w-5 h-5 text-white fill-current" />
                  ) : (
                    <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                  )}
                </button>
              </div>

              <button
                onClick={async () => {
                  if (!wordOfTheWeek?.id) return;

                  try {
                    // Fetch topics for this word
                    const topics = await wordOfWeekApi.getWordTopics();
                    if (topics && topics.length > 0) {
                      // Start session with the first topic
                      const firstTopic = topics[0];
                      setStartingSession(firstTopic.id); // Or a negative number to indicate generic loading
                      await startWordSession(firstTopic.id);
                      goToStudentScenario();
                    } else {
                      console.warn("No topics found for this word");
                      // Fallback or toast
                    }
                  } catch (error) {
                    console.error("Failed to start word session:", error);
                  } finally {
                    setStartingSession(null);
                  }
                }}
                className="h-10 px-4 bg-[#35AB4E] hover:bg-[#2f9c46] text-white text-sm font-bold rounded-lg border-b-2 border-[#20672F] flex items-center gap-2 transition active:translate-y-[2px] active:border-b-0"
              >
                <span>{t.startLearning}</span>
                <div className="w-5 h-5 rounded-md flex items-center justify-center">
                  <Play className={`w-3 h-3 text-white fill-current ${isAr ? "ml-0.5 transform rotate-180" : "mr-0.5"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div
          id="streak-cards-container"
          className={`mt-4 grid gap-4 lg:gap-6 mb-8 items-stretch ${is1024Width ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"}`}
        >
          {/* Metrics Card - Always first */}
          <div id="metrics-card" className={`flex flex-col w-full min-h-[380px] sm:h-80 md:h-96 lg:h-[400px] px-6 py-6 gap-6 rounded-[24px] border border-slate-100 bg-white shadow-sm ${is1024Width ? 'max-w-2xl mx-auto' : 'col-span-2 sm:col-span-2 lg:col-span-1'}`}>
            <div className="flex flex-col items-start w-full">
              <h4 className={`${isAr ? "font-almarai-extrabold" : "font-nunito"} text-[#4B4B4B] text-base lg:text-lg mb-3`}>{t.metricsTitle}</h4>
              <div className="flex gap-1 sm:gap-2 flex-wrap justify-start w-full">
                {tabs.filter(t => t.key !== 'daily').map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActive(tab.key)}
                    className={`w-[80px] sm:w-[100px] px-3 sm:px-6 py-1.5 rounded-[8px] text-xs sm:text-sm font-bold transition-all border-2 ${active === tab.key
                                            ? 'bg-[#35AB4E] border-[#35AB4E] text-white shadow-[0_2px_0_0_#20672F]'
                                            : 'bg-white border-[#4B4B4B] text-[#4B4B4B]'
                                            }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {(() => {
              const currentMetrics =
                active === 'monthly' ? metrics?.monthly :
                  active === 'weekly' ? metrics?.weekly :
                    metrics?.daily;

              const chartData = [
                {
                  name: t.pronunciation,
                  value: currentMetrics?.pronunciationScore || 0,
                  color: '#F98D00',
                  labelColor: '#F98D00',
                  label: `${Math.round(currentMetrics?.pronunciationScore || 0)}%`
                },
                {
                  name: t.fluency,
                  value: currentMetrics?.fluencyScore || 0,
                  color: '#CA495A',
                  labelColor: '#00AEEF',
                  label: `${Math.round(currentMetrics?.fluencyScore || 0)}%`
                },
                {
                  name: t.accuracy,
                  value: currentMetrics?.accuracyScore || 0,
                  color: '#8BD9B7',
                  labelColor: '#35AB4E',
                  label: `${Math.round(currentMetrics?.accuracyScore || 0)}%`
                }
              ];
              return <div className="w-full flex-1 flex items-center justify-center pb-4 mb-2"><ArabicStatsChart data={chartData} /></div>;
            })()}
          </div>

          {/* Streak Cards - Show after metrics for all screen sizes */}
          {!is1024Width && (
            <>
              {/* Pink Card (Middle): Longest Streak */}
              <div id="longest-streak-card" className="box-border flex flex-row justify-center items-center p-[16px_0px] gap-[6px] w-full sm:w-[262.5px] h-[180px] sm:h-[291px] bg-[#FBD4D3] border-b-[4px] border-[#F9BEBE] rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] relative overflow-hidden">
                <div className="flex flex-col justify-center items-center gap-1 sm:gap-3">
                  <span className="font-nunito font-semibold text-[14px] sm:text-[16px] leading-tight sm:leading-[22px] text-[#2F0807]">
                    {t.longestStreak}
                  </span>
                  <span className="font-nunito font-extrabold text-[40px] sm:text-[56px] leading-tight sm:leading-[76px] text-[#2F0807]">
                    {longestStreak}
                  </span>
                  <span className="font-nunito font-semibold text-[14px] sm:text-[16px] leading-tight sm:leading-[22px] text-[#2F0807]">
                    {t.days}
                  </span>
                </div>
                {/* Red Star SVG */}
                <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-[60px] sm:w-[85px] h-auto z-10 pointer-events-none">
                  <Image src={RedStarSVG} alt="Red Star" />
                </div>
              </div>

              {/* Skin Card (Left): Current Streak */}
              <div id="current-streak-card" className="box-border flex flex-row justify-center items-center p-[16px_0px] gap-[17px] w-full sm:w-[262.5px] h-[180px] sm:h-[291px] bg-[#FFF5CE] border-b-[4px] border-[#FFEFB5] rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] relative overflow-hidden">
                <div className="flex flex-col justify-center items-center gap-1 sm:gap-3">
                  <span className="font-nunito font-semibold text-[14px] sm:text-[16px] leading-tight sm:leading-[22px] text-[#332902]">
                    {t.currentStreak}
                  </span>
                  <span className="font-nunito font-extrabold text-[40px] sm:text-[56px] leading-tight sm:leading-[76px] text-[#332902]">
                    {currentStreak}
                  </span>
                  <span className="font-nunito font-semibold text-[14px] sm:text-[16px] leading-tight sm:leading-[22px] text-[#332902]">
                    {t.days}
                  </span>
                </div>
                {/* Fire Icon Placeholder */}
                <div
                  className="absolute left-0 top-1/2 w-[70px] sm:w-[103px] h-auto z-10"
                  style={{ transform: `translate(${fireOffsetPx}px, -50%)` }}
                >
                  <Image src={FireSVG} alt="Fire" className="object-contain" />
                </div>
              </div>
            </>
          )}

          {/* Streak Cards - Show after metrics at 1024px width */}
          {is1024Width && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Pink Card (Middle): Longest Streak */}
              <div id="longest-streak-card" className="box-border flex flex-row justify-center items-center p-[16px_0px] gap-[6px] w-full sm:w-[262.5px] h-[180px] sm:h-[291px] bg-[#FBD4D3] border-b-[4px] border-[#F9BEBE] rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] relative overflow-hidden">
                <div className="flex flex-col justify-center items-center gap-1 sm:gap-3">
                  <span className="font-nunito font-semibold text-[14px] sm:text-[16px] leading-tight sm:leading-[22px] text-[#2F0807]">
                    {t.longestStreak}
                  </span>
                  <span className="font-nunito font-extrabold text-[40px] sm:text-[56px] leading-tight sm:leading-[76px] text-[#2F0807]">
                    {longestStreak} 
                  </span>
                  <span className="font-nunito font-semibold text-[14px] sm:text-[16px] leading-tight sm:leading-[22px] text-[#2F0807]">
                    {t.days}
                  </span>
                </div>
                {/* Red Star SVG */}
                <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-[60px] sm:w-[85px] h-auto z-10 pointer-events-none">
                  <Image src={RedStarSVG} alt="Red Star" />
                </div>
              </div>

              {/* Skin Card (Left): Current Streak */}
              <div id="current-streak-card" className="box-border flex flex-row justify-center items-center p-[16px_0px] gap-[17px] w-full sm:w-[262.5px] h-[180px] sm:h-[291px] bg-[#FFF5CE] border-b-[4px] border-[#FFEFB5] rounded-[16px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] relative overflow-hidden">
                <div className="flex flex-col justify-center items-center gap-1 sm:gap-3">
                  <span className="font-nunito font-semibold text-[14px] sm:text-[16px] leading-tight sm:leading-[22px] text-[#332902]">
                    {t.currentStreak}
                  </span>
                  <span className="font-nunito font-extrabold text-[40px] sm:text-[56px] leading-tight sm:leading-[76px] text-[#332902]">
                    {currentStreak}
                  </span>
                  <span className="font-nunito font-semibold text-[14px] sm:text-[16px] leading-tight sm:leading-[22px] text-[#332902]">
                    {t.days}
                  </span>
                </div>
                {/* Fire Icon */}
                <div
                  className="absolute left-0 top-1/2 w-[70px] sm:w-[103px] h-auto z-10"
                  style={{ transform: `translate(${fireOffsetPx}px, -50%)` }}
                >
                  <Image src={FireSVG} alt="Fire" className="object-contain" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div id="topic-progress-container" className="bg-transparent sm:bg-white sm:shadow-sm h-auto py-[10px] px-0 sm:px-[16px] gap-[12px] rounded-[13px] overflow-y-auto sm:border-2 sm:border-[#E5E5E5] flex flex-col justify-start">
          <h2 className={`${isAr ? "text-right" : "text-left"} text-xl sm:text-2xl font-bold text-slate-900 mb-6 px-2`}>
            {t.progressTitle}
          </h2>

          <div className="space-y-4">
            {topicProgress.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                {t.noTopics}
              </div>
            ) : (
              topicProgress.slice(0, 10).map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white shadow-sm h-auto py-5 px-4 rounded-[13px] border-2 border-[#E5E5E5] flex flex-col gap-4"
                >
                  <div className="flex flex-row items-center justify-between">
                    <div className={`${isAr ? "text-right" : "text-left"}`}>
                      <p className="text-lg font-bold text-[#4B4B4B]">
                        {topic.name === "الدرس 1 – التحيات"
                          ? t.lessonUnit1
                          : topic.name === "الدرس 10 – الشكر"
                            ? t.lessonUnit10
                            : topic.name}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <span>
                          {topic.completedScenarios} {t.of} {topic.totalScenarios}{" "}
                          {t.lessons}
                        </span>
                        <Image
                          src="/images/Frame.svg"
                          alt="Check"
                          width={14}
                          height={14}
                          className="inline-block"
                        />
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-[#FF9800]">
                        %{topic.percentage}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                    <div
                      className="bg-[#FF9800] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,152,0,0.4)]"
                      style={{ width: `${topic.percentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {[...Array(topic.totalScenarios)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i < topic.completedScenarios
                              ? "bg-[#35AB4E]"
                              : "bg-slate-200"
                          }`}
                        ></div>
                      ))}
                    </div>

                    {/* start button */}
                    <button
                      onClick={() => handleContinue(topic.id)}
                      disabled={startingSession === topic.id}
                      className={`h-10 px-4 bg-[#35AB4E] hover:bg-[#2f9c46] text-white text-sm font-bold rounded-lg border-b-2 border-[#20672F] flex items-center gap-2 transition active:translate-y-[1px] active:border-b-0 disabled:opacity-70 disabled:cursor-not-allowed ${isAr ? "flex-row" : "flex-row-reverse"}`}
                    >
                      {startingSession === topic.id
                        ? t.loadingMore
                        : t.continueProgress}
                      {isAr ? (
                        <ChevronLeft className="w-4 h-4 mr-[-4px]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 ml-[-4px]" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
