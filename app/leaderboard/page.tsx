"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import Image from 'next/image';

import { Card, CardContent } from "@/components/ui/card"
import { leaderboardApi } from '@/lib/api'
import type { UnifiedLeaderboardEntry, UnifiedLeaderboardResponse } from '@/lib/types'
import { useAppContext } from '@/context/AppContext'

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
        <div className="min-h-screen bg-white pt-4 sm:pt-6 pb-16" dir='rtl'>
            <div className="mx-auto w-full max-w-4xl">
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
                            <h3 className="text-lg font-bold text-gray-800">أفضل 3 طلاب</h3>
                        </div>

                        <div className="flex flex-row justify-center gap-3 sm:gap-14">
                            {topThree.length >= 1 && (
                                <>
                                    {/* 3rd Place */}
                                    {topThree[2] && (
                                        <div className="flex flex-col items-center">
                                            <div className="relative mb-2">
                                                <div className="h-20 w-20 rounded-full bg-white border-4 border-amber-300 flex items-center justify-center">
                                                    <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                                                        <span className="text-2xl font-bold text-amber-700">
                                                            {topThree[2].username?.charAt(0).toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="absolute -top-1.5 -right-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow-md">
                                                    3
                                                </div>
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800 mb-1 truncate w-full text-center">{topThree[2].username || '-'}</h4>
                                            <p className="text-xs text-amber-600 font-semibold mb-1">{topThree[2].score?.toFixed(1) || 0} نقطة</p>
                                            <p className="text-xs text-gray-700">{topThree[2].metrics?.topicsCompleted || 0} موضوع</p>
                                        </div>
                                    )}

                                    {/* 2nd Place */}
                                    {topThree[1] && (
                                        <div className="flex flex-col items-center">
                                            <div className="relative mb-2">
                                                <div className="h-20 w-20 rounded-full bg-white border-4 border-[#35AB4E] flex items-center justify-center">
                                                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <span className="text-2xl font-bold text-gray-700">
                                                            {topThree[1].username?.charAt(0).toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="absolute -top-1.5 -right-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-[#35AB4E] text-sm font-bold text-white shadow-md">
                                                    2
                                                </div>
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800 mb-1 truncate w-full text-center">{topThree[1].username || '-'}</h4>
                                            <p className="text-xs text-[#35AB4E] font-semibold mb-1">{topThree[1].score?.toFixed(1) || 0} نقطة</p>
                                            <p className="text-xs text-gray-700">{topThree[1].metrics?.topicsCompleted || 0} موضوع</p>
                                        </div>
                                    )}

                                    {/* 1st Place */}
                                    {topThree[0] && (
                                        <div className="flex flex-col items-center">
                                            <div className="relative mb-2">
                                                <div className="h-20 w-20 rounded-full bg-white border-4 border-yellow-400 flex items-center justify-center">
                                                    <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                                                        <span className="text-2xl font-bold text-yellow-700">
                                                            {topThree[0].username?.charAt(0).toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="absolute -top-1.5 -right-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-yellow-500 text-sm font-bold text-white shadow-md">
                                                    1
                                                </div>
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800 mb-1 truncate w-full text-center">{topThree[0].username || '-'}</h4>
                                            <p className="text-xs text-yellow-600 font-semibold mb-1">{topThree[0].score?.toFixed(1) || 0} نقطة</p>
                                            <p className="text-xs text-gray-700">{topThree[0].metrics?.topicsCompleted || 0} موضوع</p>
                                        </div>
                                    )}

                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* All Students Card */}
                <Card className="border-2 border-slate-200 rounded-2xl shadow-sm">
                    <CardContent className="p-4 sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">قائمة المتصدرين</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>ترتيبك: {student?.rank || '-'}</span>
                        {student?.positionChange && student.positionChange !== 0 && (
                            <span className={`flex items-center ${student.positionChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {student.positionChange > 0 ? '↑' : '↓'} {Math.abs(student.positionChange)}
                            </span>
                        )}
                    </div>
                </div>

                        <div className="space-y-3">
                            {loading && entries.length === 0 && (
                                <div className="p-8 text-center text-sm text-gray-500">جاري التحميل...</div>
                            )}
                            {error && (
                                <div className="p-6 text-center">
                                    <div className="text-sm text-red-600 mb-3">{error}</div>
                                    <button
                                        className="px-4 py-2 bg-[#35AB4E] text-white rounded-lg hover:bg-[#2f9c46] transition-colors"
                                        onClick={retry}
                                    >
                                        إعادة المحاولة
                                    </button>
                                </div>
                            )}
                            {!loading && !error && rest.map((entry, idx) => {
                                const isCurrentUser = entry.userId === student?.userId
                                const displayRank = entry.rank || (idx + 4)
                                
                                // Determine level based on score
                                const getLevel = (score: number) => {
                                    if (score >= 100) return { label: 'متقدم', color: 'text-blue-500' }
                                    if (score >= 50) return { label: 'متوسط', color: 'text-blue-500' }
                                    return { label: 'مبتدئ', color: 'text-blue-500' }
                                }
                                const level = getLevel(entry.score || 0)

                                return (
                                    <div
                                        key={entry.userId || entry.rank || idx}
                                        className={`flex justify-between items-center p-4 rounded-2xl ${isCurrentUser ? 'bg-green-50' : 'bg-white'}`}
                                    >
                                        {/* Right side - Name, Level, and Avatar */}
                                        <div className="flex items-center gap-3">
                                            
                                            <div className="relative">
                                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-bold">
                                                    {entry.username?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 border-2 border-white">
                                                    {displayRank}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-base font-medium text-gray-800">
                                                    {entry.username || '-'}
                                                </div>
                                                <div className={`text-sm text-blue-500 font-medium`}>
                                                    {level.label}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Left side - Usage Stats */}
                                        <div className="justify-center">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-base font-medium text-gray-700">
                                                    {Math.round(entry.metrics?.avgCompletionTime || 0)} ساعة
                                                </span>
                                                <span className="text-base font-medium text-gray-700">
                                                    {entry.metrics?.topicsCompleted || 0} موضوع
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {!loading && !error && rest.length === 0 && entries.length <= 3 && (
                                <div className="p-8 text-center text-sm text-gray-500">
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