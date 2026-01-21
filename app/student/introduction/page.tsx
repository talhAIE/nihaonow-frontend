"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import VideoModal from "@/components/VideoModal";
import LanguageLearningInterface from "@/components/AudioSheikh";
import { sessionUtils } from "@/lib/sessionUtils";
import { Scenario } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useNavigation } from "@/lib/navigation";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import LogoutButton from "@/components/LogoutButton";
import ProgressBar from "@/components/ui/progressBar";
import { sessionsApi } from "@/lib/api";

export default function SheikhPage() {
  useAuthProtection();

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [introductionScenario, setIntroductionScenario] =
    useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [arabicCompleted, setArabicCompleted] = useState(false);
  const [chineseCompleted, setChineseCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [skipIntro, setSkipIntro] = useState(false);

  const { goToStudentScenario, goToStudentUnits } = useNavigation();
  const searchParams = useSearchParams();
  const topicIdParam = searchParams.get("topicId");

  useEffect(() => {
    async function loadData() {
      const currentTopic = sessionUtils.getCurrentTopic();

      // If we have a topicId in URL but no session or different topic in session
      if (topicIdParam && (!currentTopic || currentTopic.id.toString() !== topicIdParam)) {
        try {
          setLoading(true);
          const session = await sessionsApi.start({ topicId: parseInt(topicIdParam) });
          sessionUtils.setCurrentSession(session);
        } catch (error) {
          console.error("Failed to start session from topicId:", error);
        }
      }

      const scenarios = sessionUtils.getScenarios();
      const introScenario = scenarios.find((scenario) => scenario.isIntroduction);

      if (introScenario) {
        setIntroductionScenario(introScenario);
      }
      setLoading(false);
    }

    loadData();
  }, [topicIdParam]);

  const handleUserGuideClick = () => {
    setIsVideoModalOpen(true);
  };

  const handleBackClick = () => {
    // Navigate back to units page to avoid skipping scenarios
    goToStudentUnits();
  };

  // intro shows only Arabic recording — change this if the intro scenario requires Chinese as well
  const showChineseRecording = false;

  // During the introduction we don't base the progress bar on audio playback.
  // Keep it unchanged while audio plays; only set to 100% when the entire introduction is complete.
  const handleAudioProgress = (_audioPct: number) => {
    // no-op: audio playback should not affect the introduction progress bar
  };

  const handleRecordingCompleted = (type: "arabic" | "chinese") => {
    if (type === "arabic") {
      setArabicCompleted(true);
    } else if (type === "chinese") {
      setChineseCompleted(true);
    }

    // compute completion based on updated values (use 'type' to infer the immediate change)
    const arabicDone = type === "arabic" ? true : arabicCompleted;
    const chineseDone = type === "chinese" ? true : chineseCompleted;
    const introCompleteNow = arabicDone && (!showChineseRecording ? true : chineseDone);

    if (introCompleteNow) {
      setProgress(100);
    }
  };

  const handleNextClick = async () => {
    setIsNavigating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // reset progress while navigating
    setProgress(0);

    const scenarios = sessionUtils.getScenarios();
    const nextScenario = scenarios.find((scenario) => !scenario.isIntroduction);

    if (nextScenario) {
      goToStudentScenario(nextScenario.id);
    } else {
      goToStudentScenario();
    }
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const introComplete = arabicCompleted && (!showChineseRecording || chineseCompleted);

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <div className="px-4 py-6">
        <ProgressBar
          unit={sessionUtils.getCurrentTopic()?.chapter?.name || ""}
          lesson={sessionUtils.getCurrentTopic()?.name || ""}
          progress={progress}
          title="يعود"
          onBackClick={() => goToStudentUnits()}
        />

        {/* Topic Title Section */}
        <div className="mt-8 mb-4 text-center">
          <h2 className="text-3xl font-almarai-black text-gray-900 font-almarai-extrabold">
            {sessionUtils.getCurrentTopic()?.name || "المقدمة"}
          </h2>
          <p className="text-gray-500 font-almarai-medium mt-2">
            {sessionUtils.getCurrentTopic()?.subtitle || "استعد لبدء الدرس الجديد"}
          </p>
        </div>

        <div className="mb-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : introductionScenario ? (
            <LanguageLearningInterface
              scenarioImageUrl={introductionScenario.scenarioImageUrl}
              arabicAudioUrl={introductionScenario.arabicAudioUrl}
              chineseAudioUrl={introductionScenario.chineseAudioUrl}
              targetPhraseChinese={introductionScenario.targetPhraseChinese}
              targetPhrasePinyin={introductionScenario.targetPhrasePinyin}
              onRecordingCompleted={handleRecordingCompleted}
              onProgressUpdate={handleAudioProgress}
              arabicCompleted={arabicCompleted}
              chineseCompleted={chineseCompleted}
              showChineseRecording={false}
              showDiv={false}
              imageWidth={360}
              imageHeight={360}
              forceStopAudio={isVideoModalOpen}
            />
          ) : (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <p className="text-gray-500 font-almarai-medium">
                {sessionUtils.getScenarios().length > 0
                  ? "لا يوجد مقدمة لهذا الدرس."
                  : "عذراً، لا يوجد محتوى لهذا الدرس حالياً."}
              </p>
              {sessionUtils.getScenarios().length > 0 && (
                <Button
                  onClick={handleNextClick}
                  className="bg-[#35AB4E] hover:bg-[#2f9c46] text-white px-8 py-2 rounded-xl font-almarai-bold transition-all"
                >
                  <span className="flex items-center gap-2">
                    ابدأ الدرس
                    <ChevronLeft className="h-4 w-4" />
                  </span>
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full max-w-full mx-auto">
          {/* Yellow User Guide Button */}
          <Button
            onClick={handleUserGuideClick}
            className="w-full bg-[#FFCB08] h-14 hover:bg-[#FFCB08] text-[#1F1F1F] py-4 flex items-center justify-center gap-2 md:gap-3 text-xs sm:text-sm md:text-lg font-almarai-bold border-b-[4px] border-b-[#DEA407] shadow-sm hover:scale-[1.02] active:translate-y-[2px] active:border-b-0 transition-all font-almarai"
          >
            <BookOpen className="h-4 w-4 md:h-5 md:w-5 stroke-[2.5px] flex-shrink-0" />
            <span className="truncate">دليل المستخدم</span>
          </Button>

          {/* Green Continue Button */}
          <Button
            onClick={handleNextClick}
            disabled={isNavigating || (!introComplete && !skipIntro)}
            className="w-full bg-[#35AB4E] h-14 hover:bg-[#35AB4E] text-white py-4 flex items-center justify-center gap-3 text-sm sm:text-base md:text-lg font-almarai-bold rounded-2xl border-b-[4px] border-b-[#298E3E] disabled:opacity-50 disabled:cursor-not-allowed disabled:border-none shadow-sm hover:scale-[1.02] active:translate-y-[2px] active:border-b-0 transition-all font-almarai"
          >
            <span className="truncate">
              {isNavigating ? "جاري التحميل..." : "استمر"}
            </span>
            {isNavigating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        videoUrl="https://jfxedbnofpaezykdssmk.supabase.co/storage/v1/object/public/nihaonow-bucket/User-Guide/UserGuide-Video.mp4"
        title="دليل المستخدم"
      />
    </div>
  );
}
