"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import Image from 'next/image';

import { Card, CardContent } from "@/components/ui/card"
import { leaderboardApi } from '@/lib/api'
import type { UnifiedLeaderboardEntry, UnifiedLeaderboardResponse } from '@/lib/types'
import { useAppContext } from '@/context/AppContext'
const toArabicNumerals = (num: number | string | undefined) => {
    if (num === undefined || num === null) return '';
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/\d/g, (d) => arabicDigits[parseInt(d)]);
};

// --- High Fidelity Ribbon Components ---

const Ribbon1st = () => (
    <div className="absolute top-0 -right-1 flex flex-col items-center">
        <div className="z-10 bg-[#F98D00] rounded-full h-10 w-10 flex items-center justify-center text-white font-almarai-bold text-lg shadow-md border-2 border-white">
            {toArabicNumerals(1)}
        </div>
        <svg width="34" height="26" viewBox="0 0 40 30" className="-mt-2">
            <path d="M10 0L5 30L20 22L35 30L30 0" fill="#F98D00" />
            <path d="M10 0L5 25L15 20L10 0" fill="#D87A00" />
            <path d="M30 0L35 25L25 20L30 0" fill="#D87A00" />
        </svg>
    </div>
);

const Ribbon2nd = () => (
    <div className="absolute -top-2 -right-1 flex flex-col items-center">
        <div className="z-10 bg-white border-2 border-[#A8D3E6] rounded-full h-8 w-8 flex items-center justify-center text-[#4B4B4B] font-almarai-bold text-base shadow-sm">
            {toArabicNumerals(2)}
        </div>
        <svg width="28" height="22" viewBox="0 0 34 26" className="-mt-1.5">
            <path d="M8 0L4 26L17 19L30 26L26 0" fill="#A8D3E6" />
            <path d="M8 0L4 22L13 17L8 0" fill="#8ABED6" />
            <path d="M26 0L30 22L21 17L26 0" fill="#8ABED6" />
        </svg>
    </div>
);

const Ribbon3rd = () => (
    <div className="absolute -top-2 -right-1 flex flex-col items-center">
        <div className="z-10 bg-[#CA495A] rounded-full h-8 w-8 flex items-center justify-center text-white font-almarai-bold text-base shadow-sm border-2 border-white">
            {toArabicNumerals(3)}
        </div>
        <svg width="28" height="22" viewBox="0 0 34 26" className="-mt-1.5">
            <path d="M8 0L4 26L17 19L30 26L26 0" fill="#CA495A" />
            <path d="M8 0L4 22L13 17L8 0" fill="#AD3E4D" />
            <path d="M26 0L30 22L21 17L26 0" fill="#AD3E4D" />
        </svg>
    </div>
);

export default function LeaderboardPage() {
    const { dir } = useAppContext()
    const isRtl = dir == 'rtl'

    // Track if we had initial cached data to avoid dependency on entries.length
    const hadInitialCachedData = useRef(false)

    // Initialize state with cached data if available (instant load)
    const [entries, setEntries] = useState<UnifiedLeaderboardEntry[]>(() => {
        const cached = leaderboardApi.getCachedLeaderboard(100, 0)
        const cachedEntries = cached?.leaderboard ?? []
        hadInitialCachedData.current = cachedEntries.length > 0
        return cachedEntries
    })
    const [loading, setLoading] = useState(false)
    const [student, setStudent] = useState<UnifiedLeaderboardEntry | null>(() => {
        const cached = leaderboardApi.getCachedLeaderboard(100, 0)
        if (cached?.userRank) return cached.userRank
        // Only use getCachedStudentLevel if it matches UnifiedLeaderboardEntry shape
        const studentLevel = leaderboardApi.getCachedStudentLevel()
        if (
            studentLevel &&
            typeof studentLevel === 'object' &&
            'score' in studentLevel &&
            'metrics' in studentLevel
        ) {
            return studentLevel as UnifiedLeaderboardEntry
        }
        return null
    })
    const [error, setError] = useState<string | null>(null)
    const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly' | 'all'>('all')

    useEffect(() => {
        let mounted = true
        const controller = new AbortController()

        const loadAll = async () => {
            // If we already have cached data, don't show loading
            const hasCachedData = hadInitialCachedData.current
            if (!hasCachedData) {
                setLoading(true)
            }
            setError(null)

            const leaderboardPromise = leaderboardApi.getLeaderboard(100, 0, undefined, { signal: controller.signal })
            const studentPromise = leaderboardApi.getStudentLevel({ signal: controller.signal })

            try {
                const [lbResult, studentResult] = await Promise.allSettled([leaderboardPromise, studentPromise])

                if (!mounted) return

                if (lbResult.status === 'fulfilled') {
                    const resp = lbResult.value as UnifiedLeaderboardResponse
                    setEntries(resp.leaderboard ?? [])
                    if (resp.userRank) setStudent(resp.userRank)
                } else {
                    // Only show error if we don't have cached data
                    if (!hasCachedData) {
                        console.error('Failed loading leaderboard', lbResult.reason)
                        setError((lbResult.reason as Error)?.message ?? 'Failed to load leaderboard')
                    }
                }

                if (studentResult.status === 'fulfilled') {
                    const s: any = studentResult.value
                    if (s) setStudent((prev) => prev ?? s)
                } else {
                    console.warn('Failed loading student level', studentResult.reason)
                }
            } catch (err) {
                if (!mounted) return
                // Only show error if we don't have cached data
                if (!hasCachedData) {
                    console.error('Unexpected error loading leaderboard', err)
                    setError((err as Error)?.message ?? 'An unexpected error occurred')
                }
            } finally {
                if (mounted) setLoading(false)
            }
        }

        loadAll()

        return () => {
            mounted = false
            controller.abort()
        }
    }, [])

    const retry = useCallback(() => {
        setError(null)
        setLoading(true)
        const controller = new AbortController()

            ; (async () => {
                try {
                    // Force refresh to bypass cache on manual retry
                    const resp = await leaderboardApi.refreshLeaderboard(100, 0, undefined, { signal: controller.signal })
                    setEntries(resp.leaderboard ?? [])
                    if (resp.userRank) setStudent(resp.userRank)
                } catch (err) {
                    console.error('Retry failed', err)
                    setError((err as Error)?.message ?? 'Failed to load leaderboard')
                } finally {
                    setLoading(false)
                }
            })()
    }, [])

    const topThree = useMemo(() => entries.slice(0, 3), [entries])
    const rest = useMemo(() => entries.slice(3), [entries])

    return (
        <div className="min-h-screen w-[90%] bg-white mx-auto pt-4 sm:pt-6 pb-16" dir='rtl'>
            <div className="mx-auto w-full">
                {/* Tabs */}
                <div className="flex gap-3 justify-start mb-6 px-4 sm:px-0">
                    <button
                        type="button"
                        onClick={() => setSelectedTab('all')}
                        className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${selectedTab === 'all'
                            ? 'bg-[#35AB4E] text-white shadow-md'
                            : 'bg-[#F5F5F5] text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        شهري
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab('monthly')}
                        className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${selectedTab === 'monthly'
                            ? 'bg-[#35AB4E] text-white shadow-md'
                            : 'bg-[#F5F5F5] text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        سنوي
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab('weekly')}
                        className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${selectedTab === 'weekly'
                            ? 'bg-[#35AB4E] text-white shadow-md'
                            : 'bg-[#F5F5F5] text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        أسبوعي
                    </button>
                </div>

                {/* Top 3 Students Card */}
                <Card className="mb-6 border-0 rounded-2xl shadow-sm relative overflow-hidden">
                    {/* Background gradient */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-yellow-100"
                        style={{
                            backgroundImage: 'linear-gradient(135deg, #FDE68A 0%, #FFFFFF 100%)'
                        }}
                    >
                        <div className="hidden xl:block">
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 bottom-0 w-80 -translate-x-20">
                                <Image
                                    src="/images/Road Vector - 2.png"
                                    alt=""
                                    width={320}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute top-0 left-0 bottom-0 w-48 translate-x-3">
                                <Image
                                    src="/images/cup.png"
                                    alt=""
                                    width={65}
                                    height={65}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 translate-y-52 translate-x-16">
                                <Image
                                    src="/images/Road Vector -1.png"
                                    alt=""
                                    width={320}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-6 sm:p-8 relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8">
                                <Image
                                    src="/images/podium.png"
                                    alt="Leaderboard"
                                    width={30}
                                    height={30}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h3 className="text-lg sm:text-xl font-almarai-extrabold text-[#4B4B4B]">أفضل {toArabicNumerals(3)} طلاب</h3>
                        </div>

                        <div className="flex flex-row items-center justify-center gap-2 sm:gap-14 pt-4 sm:pt-10">

                            {/* Rank 2 (Left) */}
                            {topThree[1] && (
                                <div className="flex flex-col items-center order-1 w-[80px] sm:w-[120px]">
                                    <div className="relative mb-4">
                                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-[6px] border-[#A8D3E6] bg-[#DCEBF4] overflow-hidden flex items-center justify-center aspect-square shadow-inner">
                                            {topThree[1].avatarUrl ? (
                                                <Image src={topThree[1].avatarUrl} alt="" width={112} height={112} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl sm:text-3xl font-almarai-bold text-[#4B4B4B]">
                                                    {topThree[1].username?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <Ribbon2nd />
                                    </div>
                                    <div className="text-center w-full">
                                        <div className="min-h-[40px] sm:min-h-[52px] flex items-center justify-center mb-1">
                                            <h4 className="font-almarai-extrabold text-[#4B4B4B] text-[12px] sm:text-base line-clamp-2 leading-tight">
                                                {topThree[1].username}
                                            </h4>
                                        </div>
                                        <p className="font-almarai-bold text-[#35AB4E] text-[10px] sm:text-sm mb-0.5 sm:mb-1">متقدم</p>
                                        <p className="font-almarai-regular text-[#4B4B4B] text-[10px] sm:text-sm">{toArabicNumerals(topThree[1].metrics?.topicsCompleted || 0)} موضوع</p>
                                    </div>
                                </div>
                            )}

                            {/* Rank 1 (Center) */}
                            {topThree[0] && (
                                <div className="flex flex-col items-center order-2 w-[110px] sm:w-[150px]">
                                    <div className="relative mb-4">
                                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-[6px] border-[#F98D00] bg-[#FFF5E6] overflow-hidden flex items-center justify-center aspect-square shadow-md">
                                            {topThree[0].avatarUrl ? (
                                                <Image src={topThree[0].avatarUrl} alt="" width={112} height={112} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl sm:text-3xl font-almarai-bold text-[#4B4B4B]">
                                                    {topThree[0].username?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <Ribbon1st />
                                    </div>
                                    <div className="text-center w-full">
                                        <div className="min-h-[40px] sm:min-h-[52px] flex items-center justify-center mb-1">
                                            <h4 className="font-almarai-extrabold text-[#4B4B4B] text-sm sm:text-lg line-clamp-2 leading-tight">
                                                {topThree[0].username}
                                            </h4>
                                        </div>
                                        <p className="font-almarai-bold text-[#35AB4E] text-xs sm:text-base mb-0.5 sm:mb-1">مبتدئ</p>
                                        <p className="font-almarai-regular text-[#4B4B4B] text-xs sm:text-base">{toArabicNumerals(topThree[0].metrics?.topicsCompleted || 0)} مواضيع</p>
                                    </div>
                                </div>
                            )}

                            {/* Rank 3 (Right) */}
                            {topThree[2] && (
                                <div className="flex flex-col items-center order-3 w-[80px] sm:w-[120px]">
                                    <div className="relative mb-4">
                                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-[6px] border-[#CA495A] bg-[#FEF2F2] overflow-hidden flex items-center justify-center aspect-square shadow-inner">
                                            {topThree[2].avatarUrl ? (
                                                <Image src={topThree[2].avatarUrl} alt="" width={112} height={112} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl sm:text-3xl font-almarai-bold text-[#4B4B4B]">
                                                    {topThree[2].username?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <Ribbon3rd />
                                    </div>
                                    <div className="text-center w-full">
                                        <div className="min-h-[40px] sm:min-h-[52px] flex items-center justify-center mb-1">
                                            <h4 className="font-almarai-extrabold text-[#4B4B4B] text-[12px] sm:text-base line-clamp-2 leading-tight">
                                                {topThree[2].username}
                                            </h4>
                                        </div>
                                        <p className="font-almarai-bold text-[#35AB4E] text-[10px] sm:text-sm mb-0.5 sm:mb-1">متوسط</p>
                                        <p className="font-almarai-regular text-[#4B4B4B] text-[10px] sm:text-sm">{toArabicNumerals(topThree[2].metrics?.topicsCompleted || 0)} موضوع</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* All Students Card */}
                <Card className="border-0 rounded-2xl shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-8">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5 19H19" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h2 className="text-lg sm:text-xl font-almarai-extrabold text-[#4B4B4B]">جميع الطلاب</h2>
                        </div>

                        <div className="space-y-4">
                            {loading && entries.length === 0 && (
                                <div className="p-8 text-center text-sm text-gray-500 font-almarai-regular">جاري التحميل...</div>
                            )}
                            {error && (
                                <div className="p-6 text-center">
                                    <div className="text-sm text-red-600 mb-3 font-almarai-regular">{error}</div>
                                    <button
                                        className="px-4 py-2 bg-[#35AB4E] text-white rounded-lg hover:bg-[#2f9c46] transition-colors font-almarai-bold"
                                        onClick={retry}
                                    >
                                        إعادة المحاولة
                                    </button>
                                </div>
                            )}
                            {!loading && !error && rest.map((entry, idx) => {
                                const isCurrentUser = entry.userId === student?.userId
                                const displayRank = entry.rank || (idx + 4)

                                // Specific background for rank 4 as per design
                                const isRank4 = displayRank === 4

                                // Determine level label and trend color
                                const getLevelInfo = (score: number) => {
                                    if (score >= 100) return { label: 'متقدم', color: 'text-[#35AB4E]' }
                                    if (score >= 50) return { label: 'متوسط', color: 'text-[#00AEEF]' }
                                    return { label: 'مبتدئ', color: 'text-[#35AB4E]' }
                                }
                                const levelInfo = getLevelInfo(entry.score || 0)

                                // Mock trend for design compliance
                                const getTrend = (rank: number) => {
                                    if (rank === 4) return { icon: <span className="text-[#35AB4E] text-xl">↑</span>, type: 'up' }
                                    if (rank === 7) return { icon: <span className="text-[#CA495A] text-xl">↓</span>, type: 'down' }
                                    return { icon: <span className="text-gray-400 text-xl">—</span>, type: 'neutral' }
                                }
                                const trend = getTrend(displayRank)

                                // Rank circle color
                                const getRankColor = (rank: number) => {
                                    if (rank === 4) return 'bg-[#8BD9B7]'
                                    if (rank === 5) return 'bg-[#FFB74D]'
                                    if (rank === 6) return 'bg-[#FFCC80]'
                                    return 'bg-[#C5E1A5]'
                                }

                                return (
                                    <div
                                        key={entry.userId || entry.rank || idx}
                                        className={`grid grid-cols-[1fr_85px_30px] sm:grid-cols-[1fr_100px_40px] gap-2 sm:gap-4 items-center p-3 sm:p-4 rounded-[16px] transition-colors border border-transparent ${isRank4 ? 'bg-[#EAF5ED]' : isCurrentUser ? 'bg-green-50' : 'bg-[#FFFFFF] border-[#F0F0F0]'}`}
                                    >
                                        {/* Right Section: Rank, Avatar, Name */}
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            {/* Rank Circle */}
                                            <div className={`h-8 w-8 rounded-full ${getRankColor(displayRank)} flex items-center justify-center text-white font-almarai-bold text-sm flex-shrink-0 shadow-sm`}>
                                                {toArabicNumerals(displayRank)}
                                            </div>

                                            {/* Avatar */}
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-white aspect-square shadow-sm">
                                                {entry.avatarUrl ? (
                                                    <Image src={entry.avatarUrl} alt="" width={48} height={48} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#FDE68A] text-[#B45309] font-almarai-bold">
                                                        {entry.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name and Level */}
                                            <div className="flex flex-col text-right min-w-0">
                                                <span className="font-almarai-extrabold text-[#4B4B4B] text-base truncate">
                                                    {entry.username}
                                                </span>
                                                <span className={`font-almarai-bold text-xs ${levelInfo.color}`}>
                                                    {levelInfo.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Middle Section: Metrics (Fixed width for consistency) */}
                                        <div className="flex flex-col items-center justify-center gap-1 border-x border-gray-100 px-2 h-full">
                                            <span className="font-almarai-bold text-[#E67E22] text-sm sm:text-base whitespace-nowrap">
                                                {toArabicNumerals(Math.round(entry.metrics?.avgCompletionTime || 0))} ساعة
                                            </span>
                                            <span className="font-almarai-bold text-[#4B4B4B] text-xs sm:text-sm whitespace-nowrap">
                                                {toArabicNumerals(entry.metrics?.topicsCompleted || 0)} موضوع
                                            </span>
                                        </div>

                                        {/* Left Section: Trend Indicator (Fixed width) */}
                                        <div className="flex items-center justify-center h-full">
                                            {trend.icon}
                                        </div>
                                    </div>
                                )
                            })}
                            {!loading && !error && rest.length === 0 && entries.length <= 3 && (
                                <div className="p-8 text-center text-sm text-gray-500 font-almarai-regular">
                                    لا يوجد المزيد من الطلاب
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}