"use client"
import DashboardCard from "@/components/dashboard/card"
import { ChevronLeft, ChevronRight, BookOpen, Trophy, Star, Play, Pause } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigation } from '@/lib/navigation'
import { useSession } from "@/hooks/useSession"
import Image from "next/image"
import ArabicStatsChart from "@/components/dashboard/charts"
import { dashboardApi } from "@/lib/services/dashboard"
import { levelsApi } from "@/lib/services/levels"
import { sessionsApi } from "@/lib/api"
import { wordOfWeekApi } from "@/lib/services/word-of-week"
import { sessionUtils } from "@/lib/sessionUtils"
import type { ConsolidatedDashboardResponse, TopicProgress, UserLevelResponse, LevelDefinition } from "@/lib/types"

export default function Page() {
    const { goToStudentIntroduction, goToStudentLevel } = useNavigation()
    const [dashboardData, setDashboardData] = useState<ConsolidatedDashboardResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [initialLoad, setInitialLoad] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [active, setActive] = useState('daily')
    const [startingSession, setStartingSession] = useState<number | null>(null)
    const [userLevel, setUserLevel] = useState<UserLevelResponse | null>(null)
    const [levelDefinitions, setLevelDefinitions] = useState<LevelDefinition[]>([])
    const [isPronunciationPlaying, setIsPronunciationPlaying] = useState(false)
    const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null)

    const { startSession, startWordSession } = useSession();

    const handleContinue = async (topicId: number) => {
        try {
            setStartingSession(topicId)
            await startSession(topicId)
            goToStudentIntroduction()
        } catch (error) {
            console.error("Failed to start session:", error)
        } finally {
            setStartingSession(null)
        }
    }

    const handlePronunciationPlay = () => {
        if (!wordOfTheWeek?.audioUrl) return

        if (isPronunciationPlaying && audioInstance) {
            audioInstance.pause()
            setIsPronunciationPlaying(false)
            return
        }

        const audio = new Audio(wordOfTheWeek.audioUrl)
        setAudioInstance(audio)
        audio.play()
        setIsPronunciationPlaying(true)
        audio.onended = () => setIsPronunciationPlaying(false)
    }

    const tabs = [
        { key: 'daily', label: 'يومي' },
        { key: 'weekly', label: 'أسبوعي' },
        { key: 'monthly', label: 'شهري' },
    ]

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setError(null)

                // Single API call instead of multiple
                const data = await dashboardApi.getDashboard()
                setDashboardData(data)

                // Sync username to localStorage so other pages have the latest
                if (data.overview?.userName) {
                    localStorage.setItem('userName', data.overview.userName)
                }

                // Fetch named level and definitions
                const [levelData, defs] = await Promise.all([
                    levelsApi.evaluateMe(), // Force fresh evaluation
                    levelsApi.getDefinitions()
                ])
                setUserLevel(levelData)
                setLevelDefinitions(defs)
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err)
                setError('Failed to load dashboard data')
            } finally {
                setLoading(false)
                setInitialLoad(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading && initialLoad) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35AB4E] mx-auto mb-4"></div>
                    <p className="text-slate-600">جاري التحميل...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#35AB4E] text-white rounded-lg"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        )
    }

    // Use real data or fallback to cached/defaults
    const overview = dashboardData?.overview
    const topicProgress = dashboardData?.progress?.topics || []
    const metrics = dashboardData?.metrics
    const userName = overview?.userName || (typeof window !== 'undefined' ? localStorage.getItem('userName') : null) || 'الطالب'
    const currentStreak = overview?.currentStreak || 0
    const longestStreak = overview?.longestStreak || 0
    const level = overview?.level || 1
    const xp = overview?.xp || 0
    const xpProgress = overview?.xpProgress || 0
    const wordOfTheWeek = overview?.wordOfTheWeek

    // Calculate Named Level progress
    const nextLevel = levelDefinitions.find(d => d.level === (userLevel?.level.level || 0) + 1)
    let namedProgress = 0
    if (userLevel && nextLevel) {
        // Calculate progress based on topics (could also factor in hours)
        const topicProgress = (userLevel.stats.topicsCompleted / nextLevel.minTopics) * 100
        const hourProgress = (userLevel.stats.usageHours / nextLevel.minUsageHours) * 100
        // Use the lower of the two or an average? Let's use topics as the main driver for the bar
        namedProgress = Math.min(100, topicProgress)
    } else if (userLevel?.level.level === levelDefinitions.length) {
        namedProgress = 100 // Max level
    }

    return (
        <div className="min-h-screen bg-white" dir="rtl">
            <div className="max-w-full mx-auto px-2 sm:px-6">
                <div className="mt-4">&nbsp;</div>
                <h1 className="text-right font-almarai-extrabold-28 mb-8 hidden sm:block">مرحبًا بعودتك يا <span className="text-red-600">{userName}</span></h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
                    {/* Level Progress */}
                    <div className="bg-white rounded-[24px] lg:rounded-[32px] border border-slate-100 p-0 shadow-sm flex flex-col sm:flex-row-reverse items-stretch overflow-hidden h-full">
                        {/* Image decoration on the left - Hidden on mobile and tablet */}
                        <div className="relative hidden lg:flex items-center justify-center">
                            {/* Clouds from design */}
                            <div className="absolute top-6 right-8 z-10 w-10 opacity-80">
                                <Image src="/images/clouddd.png" alt="cloud" width={40} height={20} className="object-contain w-auto h-auto" />
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
                        <div className="flex-1 flex flex-row-reverse items-center justify-between p-6 gap-6">
                            <div className="text-right flex-1">
                                <h3 className="text-[#332902] font-almarai-extrabold text-xl lg:text-2xl mb-1 leading-tight">
                                    {userLevel ? `${userLevel.level.name}` : `الباندا الصغيرة`}
                                </h3>
                                <p className="text-[#35AB4E] font-bold text-sm mb-4">
                                    {`مبتدئ`}
                                </p>
                                
                                <button 
                                    onClick={goToStudentLevel}
                                    className="h-10 px-4 bg-[#35AB4E] hover:bg-[#2f9c46] text-white text-sm font-bold rounded-lg border-b-2 border-[#20672F] flex items-center gap-2 transition active:translate-y-[2px] active:border-b-0"
                                >
                                     <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
                                     <span>مستواي</span>
                                </button>
                            </div>
                            
                            {/* Level Icon/Placeholder Square from design */}
                            <div className="w-20 h-20 lg:w-28 lg:h-28 bg-[#F0FDF4] rounded-[24px] flex-shrink-0 flex flex-col items-center justify-center border-2 border-green-50 shadow-inner">
                                <span className="text-[10px] lg:text-xs font-black text-[#35AB4E] uppercase tracking-wider mb-0.5">المستوى</span>
                                <span className="text-3xl lg:text-5xl font-black text-[#35AB4E] leading-none">
                                    {userLevel?.level.level || level || '1'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Word of the Week */}
                    <div className="bg-white rounded-[24px] lg:rounded-[32px] border border-slate-100 p-6 flex flex-col shadow-sm relative overflow-hidden h-full">
                        {/* Decorative Star */}
                        <div className="absolute top-4 left-4">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </div>

                        <div className="w-full text-right mb-2">
                             <h4 className="font-almarai-extrabold text-[#4B4B4B] text-sm lg:text-base">كلمة الأسبوع</h4>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center w-full">
                            <div className="flex flex-row items-center justify-center gap-6 mb-6">
                                <div className="flex flex-col items-center">
                                    <p className="text-5xl font-black text-[#35AB4E] mb-2 font-nunito">{wordOfTheWeek?.chinese || "مرحباً"}</p>
                                    <p className="text-slate-600 font-bold text-lg mb-1">{wordOfTheWeek?.pinyin || "Nǐ hǎo"}</p>
                                    <p className="text-slate-400 text-sm">{wordOfTheWeek?.english || "Hello"}</p>
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
                                            goToStudentIntroduction();
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
                                 <span>ابدأ التعلم</span>
                                 <div className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center">
                                     <Play className="w-3 h-3 text-white fill-current ml-0.5" />
                                 </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 items-stretch">
                    <div className="flex flex-col w-full col-span-2 sm:col-span-2 lg:col-span-1 h-auto sm:h-56 md:h-60 lg:h-64 px-4 py-6 gap-6 rounded-2xl border-2 border-slate-200 bg-white shadow-lg overflow-hidden">
                        <div className="text-right flex md:flex-row flex-col flex-shrink-0 justify-between items-start md:items-center w-full gap-3">
                            <div>
                                <h4 className="font-almarai-extrabold text-base">المقاييس الرئيسية</h4>
                            </div>
                            <div className="flex gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActive(tab.key)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active === tab.key
                                            ? 'bg-[#35AB4E] text-white'
                                            : 'bg-[#E5E5E5] text-slate-700'
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
                                    name: 'النطق',
                                    value: currentMetrics?.averageScore || 0,
                                    color: '#FF9800',
                                    label: `${Math.round(currentMetrics?.averageScore || 0)}%`
                                },
                                {
                                    name: 'الطلاقة',
                                    value: currentMetrics?.averageScore || 0,
                                    color: '#D05872',
                                    label: `${Math.round(currentMetrics?.averageScore || 0)}%`
                                },
                                {
                                    name: 'الدقة',
                                    value: currentMetrics?.averageScore || 0,
                                    color: '#8BD9B7',
                                    label: `${Math.round(currentMetrics?.averageScore || 0)}%`
                                }
                            ];
                            return <ArabicStatsChart data={chartData} />;
                        })()}


                    </div>

                    <div className="relative flex flex-col items-center justify-center text-center w-full h-[140px] sm:h-56 md:h-60 lg:h-64 py-4 gap-3 rounded-[16px] border-2 border-transparent bg-[#FBD4D3] shadow-sm pl-0">
                        <Image
                            src="/images/start.png"
                            alt="decor"
                            width={70}
                            height={56}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-auto sm:w-[70px] sm:h-auto w-auto h-auto"
                        />
                        <div className="relative z-10">
                            <p className="text-sm sm:text-base font-bold mb-1">أطول خط</p>
                            <h3 className="text-4xl sm:text-5xl font-extrabold mb-1">{longestStreak}</h3>
                            <p className="text-sm sm:text-base">أيام</p>
                        </div>
                    </div>

                    <div className="relative flex flex-col items-center justify-center text-center w-full h-[140px] sm:h-56 md:h-60 lg:h-64 py-4 gap-3 rounded-[16px] border-2 border-transparent bg-[#FFF5CE] shadow-sm pl-0">
                        <Image
                            src="/images/fire.png"
                            alt="decor"
                            width={70}
                            height={56}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-auto sm:w-[70px] sm:h-auto w-auto h-auto"
                        />
                        <div className="relative z-10">
                            <p className="text-sm sm:text-base font-bold mb-1">الخط الحالي</p>
                            <h3 className="text-4xl sm:text-5xl font-extrabold mb-1">{currentStreak}</h3>
                            <p className="text-sm sm:text-base">أيام</p>
                        </div>
                    </div>
                </div>

                <div className="bg-transparent sm:bg-white sm:shadow-sm h-auto py-[10px] px-0 sm:px-[16px] gap-[12px] rounded-[13px] overflow-y-auto sm:border-2 sm:border-[#E5E5E5] flex flex-col justify-start">
                    <h2 className="text-right text-xl sm:text-2xl font-bold text-slate-900 mb-6 px-2">تقدم المحاضرات</h2>

                    <div className="space-y-4">
                        {topicProgress.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                لا توجد مواضيع متاحة حاليًا
                            </div>
                        ) : (
                            topicProgress.slice(0, 10).map((topic) => (
                                <div key={topic.id} className="bg-white shadow-sm h-auto py-5 px-4 rounded-[13px] border-2 border-[#E5E5E5] flex flex-col gap-4">
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-[#4B4B4B]">{topic.name}</p>
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <span>{topic.completedScenarios} من {topic.totalScenarios} درس</span>
                                                <Image src="/images/Frame.svg" alt="Check" width={14} height={14} className="inline-block" />
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-xl font-bold text-[#FF9800]">%{topic.percentage}</span>
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
                                                    className={`w-2 h-2 rounded-full transition-colors ${i < topic.completedScenarios ? "bg-[#35AB4E]" : "bg-slate-200"
                                                        }`}
                                                ></div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleContinue(topic.id)}
                                            disabled={startingSession === topic.id}
                                            className={`h-10 px-4 bg-[#35AB4E] hover:bg-[#2f9c46] text-white text-sm font-bold rounded-lg border-b-2 border-[#20672F] flex items-center gap-2 transition active:translate-y-[1px] active:border-b-0 ${startingSession === topic.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {startingSession === topic.id ? 'جاري التحميل...' : 'متابعة'}
                                            <ChevronLeft className="w-4 h-4 mr-[-4px]" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
