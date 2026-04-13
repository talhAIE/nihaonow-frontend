"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { sessionsApi } from '@/lib/api'
import { apiClient } from '@/lib/http'
import { useNavigation } from '@/lib/navigation';
import { Play, Pause, Volume2 } from "lucide-react";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import { useAppContext } from "@/context/AppContext";
import AuthLanguageToggle from "@/components/auth/AuthLanguageToggle";

interface SessionFeedback {
  sessionId: string;
  username: string;
  overallScore: number;
  totalScenarios: number;
  completedCount: number;
  comprehensiveFeedback: string; // AI text
  feedbackAudioUrl?: string;
  strengths: {
    averagePronunciation: string | number;
    averageAccuracy: string | number;
    averageFluency: string | number;
    consistency: string | number;
  };
  improvements: {
    lowestScore?: string | number;
    highestScore?: string | number;
    improvementPotential?: string | number;
    areasNeedingWork?: string;
  };
  overallAssessment?: string;
  attempts: Array<{
    id?: string;
    scenarioId?: number;
    scenarioNumber?: number;
    audioUrl?: string;
    audioFeedbackUrl?: string;
    textualFeedback?: string;
    pronunciationScore?: number;
    accuracyScore?: number;
    fluencyScore?: number;
    completenessScore?: number;
    totalScore?: number;
  }>;
}

export default function FeedbackPage() {
  useAuthProtection();
  const { dir } = useAppContext();
  const isAr = dir === "rtl";

  // Normalize different shapes (session object vs. feedback object) into a stable SessionFeedback
  const normalizeSessionToFeedback = (sessionObj: any): SessionFeedback => {
    const fb = sessionObj?.feedback ?? {};
    const strengths = fb?.strengths ?? sessionObj?.strengths ?? {};
    const improvements = fb?.improvements ?? sessionObj?.improvements ?? {};
    const attemptsRaw = sessionObj?.attempts ?? [];

    const attempts = attemptsRaw.map((a: any) => ({
      id: a.id,
      scenarioId: a.scenarioId,
      scenarioNumber: a.scenario?.scenarioNumber ?? a.scenarioNumber ?? undefined,
      audioUrl: a.audioUrl,
      audioFeedbackUrl: a.audioFeedbackUrl,
      textualFeedback: a.textualFeedback,
      pronunciationScore: a.pronunciationScore,
      accuracyScore: a.accuracyScore,
      fluencyScore: a.fluencyScore,
      completenessScore: a.completenessScore,
      totalScore: a.totalScore,
    }))

    return {
      sessionId: sessionObj?.id ?? sessionObj?.sessionId ?? '',
      username: sessionObj?.user?.username ?? sessionObj?.username ?? localStorage.getItem('userName') ?? 'user',
      overallScore: sessionObj?.overallScore ?? 0,
      totalScenarios: sessionObj?.totalScenarios ?? (sessionObj?.topic?.scenarios?.length ?? 0) ?? 0,
      completedCount: sessionObj?.completedCount ?? 0,
      comprehensiveFeedback: fb?.aiFeedback ?? sessionObj?.comprehensiveFeedback ?? fb?.comprehensiveFeedback ?? '',
      feedbackAudioUrl: fb?.feedbackAudioUrl ?? sessionObj?.feedbackAudioUrl ?? '',
      strengths: {
        averagePronunciation: strengths?.averagePronunciation ?? 0,
        averageAccuracy: strengths?.averageAccuracy ?? 0,
        averageFluency: strengths?.averageFluency ?? 0,
        consistency: strengths?.consistency ?? 0,
      },
      improvements: {
        lowestScore: improvements?.lowestScore ?? 0,
        highestScore: improvements?.highestScore ?? 0,
        improvementPotential: improvements?.improvementPotential ?? 0,
        areasNeedingWork: improvements?.areasNeedingWork ?? '',
      },
      overallAssessment: fb?.overallAssessment ?? sessionObj?.overallAssessment ?? fb?.aiFeedback ?? '',
      attempts,
    }
  }

  const [feedback, setFeedback] = useState<SessionFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false);
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { goToStudentUnits, goToStudentDashboard } = useNavigation();

  const t = isAr
    ? {
        loading: "جاري تحميل التغذية الراجعة...",
        none: "لا توجد تغذية راجعة متاحة",
        backHome: "العودة للبداية",
        titlePrefix: "أحسنت يا ",
        subtitle: "لقد أكملت الدرس بنجاح. إليك تقييمك الشامل.",
        autoAssessment: "تقييم تلقائي",
        completion: "الاكتمال",
        accuracy: "الدقة",
        pronunciation: "النطق",
        fluency: "الطلاقة",
        pronAccuracy: "دقة النطق",
        pronRate: "نسبة النطق",
        speakingFluency: "سلاسة الكلام",
        overall: "التقييم العام",
        audioFeedback: "تغذية راجعة صوتية",
        showAttempts: (n: number) => `عرض المحاولات (${n})`,
        hideAttempts: "إخفاء المحاولات",
        attempts: "محاولات",
        scenario: "المشهد",
        metrics: (a: any) =>
          `نطق: ${a.pronunciationScore ?? 0}% • دقة: ${a.accuracyScore ?? 0}% • طلاقة: ${a.fluencyScore ?? 0}% • اكتمال: ${a.completenessScore ?? 0}%`,
        endSession: "انتهت الجلسة",
      }
    : {
        loading: "Loading feedback...",
        none: "No feedback available",
        backHome: "Back to start",
        titlePrefix: "Well done, ",
        subtitle: "You completed the lesson successfully. Here is your full assessment.",
        autoAssessment: "Automated Assessment",
        completion: "Completion",
        accuracy: "Accuracy",
        pronunciation: "Pronunciation",
        fluency: "Fluency",
        pronAccuracy: "Pronunciation accuracy",
        pronRate: "Pronunciation rate",
        speakingFluency: "Speaking fluency",
        overall: "Overall assessment",
        audioFeedback: "Audio feedback",
        showAttempts: (n: number) => `Show attempts (${n})`,
        hideAttempts: "Hide attempts",
        attempts: "Attempts",
        scenario: "Scenario",
        metrics: (a: any) =>
          `Pronunciation: ${a.pronunciationScore ?? 0}% • Accuracy: ${a.accuracyScore ?? 0}% • Fluency: ${a.fluencyScore ?? 0}% • Completion: ${a.completenessScore ?? 0}%`,
        endSession: "End session",
      };

  useEffect(() => {
    let mounted = true

    // Get feedback data from session storage and attempt to refresh from server
    const feedbackData = sessionStorage.getItem('sessionFeedback')
    if (feedbackData) {
      try {
        const parsed = JSON.parse(feedbackData)
        setFeedback(normalizeSessionToFeedback(parsed))
      } catch (error) {
        console.error('Error parsing feedback data:', error)
      }
    }

    const currentSession = sessionStorage.getItem('currentSession')
    let sessionId: string | null = null
    try {
      if (feedbackData) {
        const parsed = JSON.parse(feedbackData)
        sessionId = parsed?.sessionId ?? null
      }
    } catch (err) {
      // ignore
    }
    if (!sessionId && currentSession) {
      try {
        const parsed = JSON.parse(currentSession)
        sessionId = parsed?.sessionId ?? null
      } catch (err) {
        // ignore
      }
    }

    const loadFromServer = async (sid: string) => {
      setLoading(true)
      setError(null)
      try {
        const res = await sessionsApi.getById(sid)
        if (!mounted) return
        console.log('Fetched feedback from server for session', sid, res)
        // Prefer normalized response shape; ensure username
        if (res) {
          setFeedback(normalizeSessionToFeedback(res))
          try {
            sessionStorage.setItem('sessionFeedback', JSON.stringify(res))
          } catch (err) {
            // ignore storage errors
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch session feedback', err)
        setError(err?.message ?? 'Failed to load feedback')

        // Try generating feedback server-side if supported
        try {
          await apiClient.post(`/sessions/${sid}/complete`)
          // fetch again after generation
          const res2 = await sessionsApi.getById(sid)
          if (!mounted) return
          console.log('Fetched feedback after generation for session', sid, res2)
          if (res2) {
            setFeedback(normalizeSessionToFeedback(res2))
            try {
              sessionStorage.setItem('sessionFeedback', JSON.stringify(res2))
            } catch (err) {
              // ignore
            }
          }
        } catch (genErr) {
          console.error('Failed to generate or fetch feedback', genErr)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (sessionId) {
      // fetch fresh feedback from server
      loadFromServer(sessionId)
    } else {
      setLoading(false)
    }

    return () => { mounted = false }
  }, []);

  const [error, setError] = useState<string | null>(null)
  const [showAttempts, setShowAttempts] = useState(false)

  const handleFeedbackAudioPlay = () => {
    if (!feedback?.feedbackAudioUrl) return;

    if (isPlayingFeedback && currentPlayingUrl === feedback.feedbackAudioUrl) {
      audioRef.current?.pause();
      setIsPlayingFeedback(false);
      setCurrentPlayingUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(feedback.feedbackAudioUrl);
      audioRef.current.addEventListener('ended', () => {
        setIsPlayingFeedback(false);
        setCurrentPlayingUrl(null);
      });
      audioRef.current.play();
      setIsPlayingFeedback(true);
      setCurrentPlayingUrl(feedback.feedbackAudioUrl);
    }
  };

  const handleAttemptAudioPlay = (url?: string) => {
    if (!url) return

    // if same source, toggle play/pause
    if (currentPlayingUrl === url) {
      if (isPlayingFeedback) {
        audioRef.current?.pause()
        setIsPlayingFeedback(false)
        setCurrentPlayingUrl(null)
      } else {
        audioRef.current?.play()
        setIsPlayingFeedback(true)
        setCurrentPlayingUrl(url)
      }
      return
    }

    // switch source
    if (audioRef.current) {
      audioRef.current.pause()
    }
    audioRef.current = new Audio(url)
    audioRef.current.addEventListener('ended', () => {
      setIsPlayingFeedback(false)
      setCurrentPlayingUrl(null)
    })
    audioRef.current.play()
    setIsPlayingFeedback(true)
    setCurrentPlayingUrl(url)
  }

  const handleSessionEnd = () => {
    // Clear all session storage data
    sessionStorage.removeItem('currentSession');
    sessionStorage.removeItem('sessionFeedback');

    // Clear any other potential session data
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('session') || key.includes('scenario') || key.includes('attempt')) {
        sessionStorage.removeItem(key);
      }
    });

    // Clear all local storage data
    localStorage.clear();

    // Navigate to home page
    goToStudentUnits();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isAr ? "font-almarai" : "font-nunito"}`} dir={dir} lang={isAr ? "ar" : "en"}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isAr ? "font-almarai" : "font-nunito"}`} dir={dir} lang={isAr ? "ar" : "en"}>
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{t.none}</p>
          <Button onClick={goToStudentDashboard} className="bg-green-500 hover:bg-green-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base w-full sm:w-auto max-w-[200px] sm:max-w-none">
            {t.backHome}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className={`relative min-h-screen bg-white overflow-x-hidden ${isAr ? "font-almarai" : "font-nunito"}`} dir={dir} lang={isAr ? "ar" : "en"}>
      <div className={`absolute top-4 ${isAr ? "left-4" : "right-4"} z-20`}>
        <AuthLanguageToggle />
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-4 py-4 sm:py-6">
        {/* Page Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            <span>{t.titlePrefix}</span><span style={{ color: 'red' }}>{feedback.username || 'user'}</span>
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6 sm:gap-8 items-center max-w-6xl mx-auto">
          {/* Sheikh Character - Top on Mobile */}
          <div className="w-full max-w-[150px] sm:max-w-xs order-1 lg:hidden">
            <Image
              src="/images/shiekh.png"
              alt="Sheikh Character"
              width={150}
              height={200}
              className="object-contain w-full h-auto"
            />
          </div>

          {/* Feedback Card */}
          <div className="w-full max-w-2xl order-2">
            <div className="bg-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg">
              {/* Feedback Summary */}
              <div className={`${isAr ? "text-right" : "text-left"} mb-4 sm:mb-6`}>
                <h2 className="text-xl sm:text-2xl font-bold text-green-600">{t.autoAssessment}</h2>
                <p className="text-gray-700 mt-2 text-sm sm:text-base leading-relaxed">{feedback.comprehensiveFeedback}</p>
              </div>

              {/* Summary metrics */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className={`bg-white rounded-lg p-3 sm:p-4 shadow-sm ${isAr ? "text-right" : "text-left"}`}>
                  <div className="text-xs sm:text-sm text-gray-500">{t.completion}</div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-800">{Math.round(((feedback.completedCount ?? 0) / Math.max(1, feedback.totalScenarios ?? 1)) * 100)}%</div>
                  <div className="text-xs text-gray-400">{feedback.completedCount ?? 0} / {feedback.totalScenarios ?? 0}</div>
                </div>
                <div className={`bg-white rounded-lg p-3 sm:p-4 shadow-sm ${isAr ? "text-right" : "text-left"}`}>
                  <div className="text-xs sm:text-sm text-gray-500">{t.accuracy}</div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-800">{Number(feedback.strengths.averageAccuracy ?? 0)}%</div>
                  <div className="text-xs text-gray-400">{t.pronAccuracy}</div>
                </div>
                <div className={`bg-white rounded-lg p-3 sm:p-4 shadow-sm ${isAr ? "text-right" : "text-left"}`}>
                  <div className="text-xs sm:text-sm text-gray-500">{t.pronunciation}</div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-800">{Number(feedback.strengths.averagePronunciation ?? 0)}%</div>
                  <div className="text-xs text-gray-400">{t.pronRate}</div>
                </div>
                <div className={`bg-white rounded-lg p-3 sm:p-4 shadow-sm ${isAr ? "text-right" : "text-left"}`}>
                  <div className="text-xs sm:text-sm text-gray-500">{t.fluency}</div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-800">{Number(feedback.strengths.averageFluency ?? 0)}%</div>
                  <div className="text-xs text-gray-400">{t.speakingFluency}</div>
                </div>
              </div>

              <div className={`mb-3 sm:mb-4 ${isAr ? "text-right" : "text-left"}`}>
                <div className="text-xs sm:text-sm text-gray-500">{t.overall}</div>
                <div className="text-sm sm:text-lg font-semibold text-gray-800 leading-relaxed" >{feedback.overallAssessment ?? feedback.comprehensiveFeedback}</div>
              </div>

              {feedback.feedbackAudioUrl && (
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="bg-green-100 border border-green-200 rounded-xl sm:rounded-2xl lg:rounded-3xl px-3 sm:px-4 lg:px-6 py-2 w-full max-w-[90%] sm:max-w-[70%] lg:max-w-[60%]">
                    <div className={`flex items-center justify-between ${isAr ? "" : "flex-row-reverse"}`}>
                      <span className={`text-gray-800 font-medium text-xs sm:text-sm lg:text-lg truncate flex-1 ${isAr ? "mr-2" : "ml-2"}`}>{t.audioFeedback}</span>
                      <button
                        onClick={handleFeedbackAudioPlay}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
                        disabled={!feedback.feedbackAudioUrl}
                      >
                        {isPlayingFeedback && currentPlayingUrl === feedback.feedbackAudioUrl ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className={`${isAr ? "text-right" : "text-left"} mb-4 text-sm text-red-600`}>{error}</div>
              )}

              <div className={`${isAr ? "text-right" : "text-left"} mt-4`}>
                <button className="text-sm text-sky-600" onClick={() => setShowAttempts((v) => !v)}>
                  {showAttempts ? t.hideAttempts : t.showAttempts(feedback.attempts?.length ?? 0)} →
                </button>
              </div>

              {/* Attempts list (collapsible) */}
              {showAttempts && feedback.attempts && feedback.attempts.length > 0 && (
                <div className="space-y-2 sm:space-y-3 mt-4">
                  <h3 className={`${isAr ? "text-right" : "text-left"} font-semibold text-gray-700 mb-2 text-sm sm:text-base`}>{t.attempts}</h3>
                  {feedback.attempts.map((a) => (
                    <div key={a.id ?? a.scenarioId} className={`bg-white rounded-lg p-2 sm:p-3 shadow-sm flex items-center gap-2 sm:gap-3 ${isAr ? "" : "flex-row-reverse"}`}>
                      {/* Play button column - fixed width for alignment */}
                      <div className="flex-shrink-0 w-8 sm:w-10 flex justify-center">
                        {a.audioFeedbackUrl ? (
                          <button
                            onClick={() => handleAttemptAudioPlay(a.audioFeedbackUrl)}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-1.5 sm:p-2 transition-colors"
                            aria-label={`Play attempt ${a.scenarioNumber ?? a.scenarioId} feedback`}
                          >
                            {isPlayingFeedback && currentPlayingUrl === a.audioFeedbackUrl ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </button>
                        ) : (
                          <div className="w-6 h-6 sm:w-8 sm:h-8" /> /* Placeholder for alignment */
                        )}
                      </div>
                      {/* Score column - fixed width */}
                      <div className="flex-shrink-0 w-10 sm:w-12 text-center">
                        <div className="text-xs sm:text-sm font-medium text-gray-600">{a.totalScore ?? '-'}</div>
                      </div>
                      {/* Content column - flexible width */}
                      <div className={`flex-1 min-w-0 ${isAr ? "text-right" : "text-left"}`}>
                        <div className="font-medium text-sm sm:text-base truncate">{t.scenario} {a.scenarioNumber ?? a.scenarioId}</div>
                        {a.textualFeedback && <div className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{a.textualFeedback}</div>}
                        <div className="text-xs text-gray-500 mt-1 truncate">{t.metrics(a)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Session Ended Button */}
              <div className="text-center mt-6 sm:mt-8 pb-2 sm:pb-4">
                <Button
                  onClick={handleSessionEnd}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-xl font-medium text-xs sm:text-sm lg:text-base w-full sm:w-auto max-w-[200px] sm:max-w-none"
                >
                  {t.endSession}
                </Button>
              </div>
            </div>
          </div>

          {/* Sheikh Character - Bottom on Mobile, Right on Desktop */}
          <div className="w-full max-w-[150px] sm:max-w-xs order-3 hidden lg:block">
            <Image
              src="/images/shiekh.png"
              alt="Sheikh Character"
              width={150}
              height={200}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
