"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import Image from 'next/image';

import { Card, CardContent } from "@/components/ui/card"
import { leaderboardApi } from '@/lib/api'
import type { UnifiedLeaderboardEntry, UnifiedLeaderboardResponse } from '@/lib/types'
import { useAppContext } from '@/context/AppContext'
const getLevelInfo = (score: number) => {
    if (score >= 100) return { label: 'متقدم', color: 'text-[#35AB4E]' }
    if (score >= 50) return { label: 'متوسط', color: 'text-[#00AEEF]' }
    return { label: 'مبتدئ', color: 'text-[#35AB4E]' }
}

// --- High Fidelity Ribbon Components ---

const Ribbon1st = () => (
    <div className="absolute -top-1 -right-2 z-20">
        <Image
            src="/Leaderboardicons/first.svg"
            alt="1st Place"
            width={55}
            height={75}
            className="drop-shadow-md"
        />
    </div>
);

const Ribbon2nd = () => (
    <div className="absolute -top-1 -right-1 z-20">
        <Image
            src="/Leaderboardicons/second.svg"
            alt="2nd Place"
            width={45}
            height={65}
            className="drop-shadow-sm"
        />
    </div>
);

const Ribbon3rd = () => (
    <div className="absolute -top-1 -right-1 z-20">
        <Image
            src="/Leaderboardicons/Third.svg"
            alt="3rd Place"
            width={45}
            height={65}
            className="drop-shadow-sm"
        />
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
    
    // Pagination state for "All Students" section
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 15
    
    const displayedRest = useMemo(() => {
        const startIndex = (currentPage - 1) * usersPerPage
        const endIndex = startIndex + usersPerPage
        return rest.slice(startIndex, endIndex)
    }, [rest, currentPage])
    
    const totalPages = Math.ceil(rest.length / usersPerPage)
    
    // Reset page when tab changes
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedTab])

    return (
        <div className="min-h-screen w-[90%] bg-white mx-auto pt-4 sm:pt-6 pb-16" dir='rtl'>
            <div className="mx-auto w-full">
                {/* Tabs */}
                <div className="flex gap-1 sm:gap-2 flex-wrap justify-start w-full mb-6">
                    <button
                        type="button"
                        onClick={() => setSelectedTab('all')}
                        className={`w-[80px] sm:w-[100px] px-3 sm:px-6 py-1.5 rounded-[8px] text-xs sm:text-sm font-bold transition-all border-2 ${selectedTab === 'all'
                            ? 'bg-[#35AB4E] border-[#35AB4E] text-white shadow-[0_2px_0_0_#20672F]'
                            : 'bg-white border-[#4B4B4B] text-[#4B4B4B]'
                            }`}
                    >
                        شهري
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab('monthly')}
                        className={`w-[80px] sm:w-[100px] px-3 sm:px-6 py-1.5 rounded-[8px] text-xs sm:text-sm font-bold transition-all border-2 ${selectedTab === 'monthly'
                            ? 'bg-[#35AB4E] border-[#35AB4E] text-white shadow-[0_2px_0_0_#20672F]'
                            : 'bg-white border-[#4B4B4B] text-[#4B4B4B]'
                            }`}
                    >
                        سنوي
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab('weekly')}
                        className={`w-[80px] sm:w-[100px] px-3 sm:px-6 py-1.5 rounded-[8px] text-xs sm:text-sm font-bold transition-all border-2 ${selectedTab === 'weekly'
                            ? 'bg-[#35AB4E] border-[#35AB4E] text-white shadow-[0_2px_0_0_#20672F]'
                            : 'bg-white border-[#4B4B4B] text-[#4B4B4B]'
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
                            <div className="absolute top-0 left-0 bottom-0 w-[500px] -translate-x-24">
                                <Image
                                    src="/images/Road Vector - 2.png"
                                    alt=""
                                    width={400}
                                    height={500}
                                    className="w-full h-full object-cover"
                                    style={{ height: 'auto' }}
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
                                    style={{ height: 'auto' }}
                                />
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
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
                            <h3 className="text-lg sm:text-xl font-almarai-extrabold text-[#4B4B4B]">أفضل 3 طلاب</h3>
                        </div>

                        <div className="flex flex-row items-center justify-center gap-1 sm:gap-8 lg:gap-14 pt-4 sm:pt-10 px-2 sm:px-4">

                            {/* Rank 2 (Left) */}
                            {topThree[1] && (
                                <div className="flex flex-col items-center order-1 w-[80px] sm:w-[120px]">
                                    <div className="relative mb-4">
                                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden flex items-center justify-center aspect-square shadow-inner relative">
                                            {/* Avatar Background Circle */}
                                            <div className="absolute inset-0 z-0">
                                                <Image src="/Leaderboardicons/circle2.svg" alt="" fill className="object-contain" />
                                            </div>
                                            <span className="text-xl sm:text-3xl font-almarai-bold text-[#4B4B4B] relative z-10">
                                                {topThree[1].username?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <Ribbon2nd />
                                    </div>
                                    <div className="text-center w-full">
                                        <div className="min-h-[40px] sm:min-h-[52px] flex items-center justify-center mb-1">
                                            <h4 className="font-almarai-extrabold text-[#4B4B4B] text-[12px] sm:text-base truncate leading-tight max-w-full">
                                                {topThree[1].username}
                                            </h4>
                                        </div>
                                        <p className={`font-almarai-bold text-[10px] sm:text-sm mb-0.5 sm:mb-1 ${getLevelInfo(topThree[1].score || 0).color}`}>
                                            {getLevelInfo(topThree[1].score || 0).label}
                                        </p>
                                        <p className="font-almarai-regular text-[#4B4B4B] text-[10px] sm:text-sm">{topThree[1].metrics?.topicsCompleted || 0} موضوع</p>
                                    </div>
                                </div>
                            )}

                            {/* Rank 1 (Center) */}
                            {topThree[0] && (
                                <div className="flex flex-col items-center order-2 w-[130px] sm:w-[180px]">
                                    <div className="relative mb-4">
                                        <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden flex items-center justify-center aspect-square shadow-md relative">
                                            {/* Avatar Background Circle */}
                                            <div className="absolute inset-0 z-0">
                                                <Image src="/Leaderboardicons/circle1.svg" alt="" fill className="object-contain" />
                                            </div>
                                            <span className="text-2xl sm:text-4xl font-almarai-bold text-[#4B4B4B] relative z-10">
                                                {topThree[0].username?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <Ribbon1st />
                                    </div>
                                    <div className="text-center w-full">
                                        <div className="min-h-[40px] sm:min-h-[52px] flex items-center justify-center mb-1">
                                            <h4 className="font-almarai-extrabold text-[#4B4B4B] text-sm sm:text-lg truncate leading-tight max-w-full">
                                                {topThree[0].username}
                                            </h4>
                                        </div>
                                        <p className={`font-almarai-bold text-xs sm:text-base mb-0.5 sm:mb-1 ${getLevelInfo(topThree[0].score || 0).color}`}>
                                            {getLevelInfo(topThree[0].score || 0).label}
                                        </p>
                                        <p className="font-almarai-regular text-[#4B4B4B] text-xs sm:text-base">{topThree[0].metrics?.topicsCompleted || 0} مواضيع</p>
                                    </div>
                                </div>
                            )}

                            {/* Rank 3 (Right) */}
                            {topThree[2] && (
                                <div className="flex flex-col items-center order-3 w-[80px] sm:w-[120px]">
                                    <div className="relative mb-4">
                                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden flex items-center justify-center aspect-square shadow-inner relative">
                                            {/* Avatar Background Circle */}
                                            <div className="absolute inset-0 z-0">
                                                <Image src="/Leaderboardicons/circle3.svg" alt="" fill className="object-contain" />
                                            </div>
                                            <span className="text-xl sm:text-3xl font-almarai-bold text-[#4B4B4B] relative z-10">
                                                {topThree[2].username?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <Ribbon3rd />
                                    </div>
                                    <div className="text-center w-full">
                                        <div className="min-h-[40px] sm:min-h-[52px] flex items-center justify-center mb-1">
                                            <h4 className="font-almarai-extrabold text-[#4B4B4B] text-[12px] sm:text-base truncate leading-tight max-w-full">
                                                {topThree[2].username}
                                            </h4>
                                        </div>
                                        <p className={`font-almarai-bold text-[10px] sm:text-sm mb-0.5 sm:mb-1 ${getLevelInfo(topThree[2].score || 0).color}`}>
                                            {getLevelInfo(topThree[2].score || 0).label}
                                        </p>
                                        <p className="font-almarai-regular text-[#4B4B4B] text-[10px] sm:text-sm">{topThree[2].metrics?.topicsCompleted || 0} موضوع</p>
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
                            {!loading && !error && displayedRest.map((entry, idx) => {
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
                                        className={`grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto] gap-2 sm:gap-4 items-center p-3 sm:p-4 rounded-[16px] transition-colors border border-transparent ${isRank4 ? 'bg-[#EAF5ED]' : isCurrentUser ? 'bg-green-50' : 'bg-[#FFFFFF] border-[#F0F0F0]'}`}
                                    >
                                        {/* Right Section: Rank, Avatar, Name */}
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            {/* Rank Circle */}
                                            <div className={`h-8 w-8 rounded-full ${getRankColor(displayRank)} flex items-center justify-center text-white font-almarai-bold text-sm flex-shrink-0 shadow-sm`}>
                                                {displayRank}
                                            </div>

                                            {/* Avatar (Initials only as requested) */}
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-white aspect-square shadow-sm hidden xl:block">
                                                <div className="w-full h-full flex items-center justify-center bg-[#FDE68A] text-[#B45309] font-almarai-bold">
                                                    {entry.username?.charAt(0).toUpperCase()}
                                                </div>
                                            </div>

                                            {/* Name and Level */}
                                            <div className="flex flex-col text-right min-w-0 flex-1">
                                                <span 
                                                    className="font-almarai-extrabold text-[#4B4B4B] text-base truncate max-w-full"
                                                    dir={/[\u0600-\u06FF]/.test(entry.username) ? "rtl" : "ltr"}
                                                >
                                                    {entry.username}
                                                </span>
                                                <span className={`font-almarai-bold text-xs ${levelInfo.color}`}>
                                                    {levelInfo.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Far Right Section: Metrics */}
                                        <div className="flex flex-col items-center justify-center gap-1 border-x border-gray-100 px-2 h-full">
                                            <span className="font-almarai-bold text-[#E67E22] text-sm sm:text-base whitespace-nowrap">
                                                {Math.round(entry.metrics?.avgCompletionTime || 0)} ساعة
                                            </span>
                                            <span className="font-almarai-bold text-[#4B4B4B] text-xs sm:text-sm whitespace-nowrap">
                                                {entry.metrics?.topicsCompleted || 0} موضوع
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            {!loading && !error && rest.length === 0 && entries.length <= 3 && (
                                <div className="p-8 text-center text-sm text-gray-500 font-almarai-regular">
                                    لا يوجد المزيد من الطلاب
                                </div>
                            )}
                            {!loading && !error && rest.length > 0 && totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                                    {/* Next button (for RTL, this appears first) */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border-2 border-[#4B4B4B] text-[#4B4B4B] hover:bg-[#F5F5F5]'
                                        }`}
                                    >
                                        ‹
                                    </button>
                                    
                                    {/* Page numbers */}
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = totalPages - i; // Reverse for RTL
                                        } else if (currentPage <= 3) {
                                            pageNum = 5 - i; // Show 5,4,3,2,1 for RTL
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - (4 - i); // Show last 5 in reverse
                                        } else {
                                            pageNum = currentPage + 2 - i; // Show current+2 to current-2 in reverse
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                                                    currentPage === pageNum
                                                        ? 'bg-[#35AB4E] border-2 border-[#35AB4E] text-white shadow-[0_2px_0_0_#20672F]'
                                                        : 'bg-white border-2 border-[#4B4B4B] text-[#4B4B4B] hover:bg-[#F5F5F5]'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    
                                    {/* Previous button (for RTL, this appears last) */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border-2 border-[#4B4B4B] text-[#4B4B4B] hover:bg-[#F5F5F5]'
                                        }`}
                                    >
                                        ›
                                    </button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}