"use client";

import AudioSheikh from "@/components/AudioSheikh";
import { Button } from "@/components/ui/button";
import {
  Play,
  Mic,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Loader2,
  X,
  Pause,
  Sparkles,
  Lightbulb,
  Target,
  Square,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { sessionsApi, Scenario } from "@/lib/api";
import { sessionUtils } from "@/lib/sessionUtils";
import { useSearchParams } from "next/navigation";
import { useNavigation } from "@/lib/navigation";
import { useMemo } from "react";
import { localizeChapter, localizeTopic } from "@/lib/db-localization";
import FeedbackPopup from "@/components/FeedbackPopup";
import VideoModal from "@/components/VideoModal";
import { useToast } from "@/hooks/use-toast";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import ProgressBar from "@/components/ui/progressBar";
import Image from "next/image";
import AnimatedWaveform from "@/components/scenario";
import SessionGuidePopup from "@/components/session/SessionGuidePopup";
import { useAppContext } from "@/context/AppContext";
import { guidePersistence } from "@/lib/guidePersistence";
import AuthLanguageToggle from "@/components/auth/AuthLanguageToggle";

export default function ScenarioPage() {
  useAuthProtection();
  const { state, dir } = useAppContext();
  const isAr = dir === "rtl";

  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [totalScenarios, setTotalScenarios] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] =
    useState(false);
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);
  const [arabicCompleted, setArabicCompleted] = useState(false);
  const [chineseCompleted, setChineseCompleted] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [lastAttemptScores, setLastAttemptScores] = useState<any>(null);
  const [lastTranscription, setLastTranscription] = useState<string>("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showSessionGuide, setShowSessionGuide] = useState(false);
  const [hasShownGuide, setHasShownGuide] = useState(false);
  const [hasShownRealGuide, setHasShownRealGuide] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 386);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Show guide if it's the user's first login and either:
    // 1. They haven't seen any guide yet.
    // 2. They've only seen the "intro" guide and are now on a real scenario.
    if (!state.authUser?.isFirstLogin || !state.isInitialized || !currentScenario) return;

    const isIntro = currentScenario.isIntroduction;
    const shouldShow = !hasShownGuide || (!hasShownRealGuide && !isIntro);

    if (shouldShow) {
      if (state.authUser?.id) {
        const isCompleted = guidePersistence.isCompleted(state.authUser.id, 'session');
        if (isCompleted) return;
      }
      setShowSessionGuide(true);
      setHasShownGuide(true);
      if (!isIntro) {
        setHasShownRealGuide(true);
      }
    }
  }, [state.authUser?.isFirstLogin, state.authUser?.id, state.isInitialized, currentScenario, hasShownGuide, hasShownRealGuide]);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [scenarioProgress, setScenarioProgress] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [showFeedbackWidget, setShowFeedbackWidget] = useState(false);
  const searchParams = useSearchParams();
  const { goToStudentScenario, goToStudentFeedback, goToStudentUnits } = useNavigation();
  const { toast } = useToast();
  const ContinueChevron = isAr ? ChevronLeft : ChevronRight;

  const copy = {
    ar: {
      back: "يعود",
      loadingNext: "جاري تحميل السيناريو التالي...",
      discard: "حذف التسجيل",
      play: "تشغيل",
      pause: "إيقاف",
      listenFirst: "الرجاء الاستماع للصوت أولاً",
      clickToStop: "انقر لإيقاف التسجيل",
      clickToRecord: "انقر للتسجيل",
      feedbackLabel: "تعليق",
      userGuide: "دليل المستخدم",
      feedback: "تغذية راجعة",
      submitting: "جاري الإرسال...",
      continue: "استمر",
      submit: "إرسال",
      speechErrorTitle: "خطأ في التعرف على النطق",
      errorTitle: "خطأ",
      submitError: "حدث خطأ أثناء إرسال التسجيل. يرجى المحاولة مرة أخرى.",
      guideTitle: "دليل المستخدم",
    },
    en: {
      back: "Back",
      loadingNext: "Loading next scenario...",
      discard: "Delete recording",
      play: "Play",
      pause: "Pause",
      listenFirst: "Please listen to the audio first",
      clickToStop: "Click to stop recording",
      clickToRecord: "Click to record",
      feedbackLabel: "Feedback",
      userGuide: "User Guide",
      feedback: "Feedback",
      submitting: "Submitting...",
      continue: "Continue",
      submit: "Submit",
      speechErrorTitle: "Speech recognition error",
      errorTitle: "Error",
      submitError: "An error occurred while submitting the recording. Please try again.",
      guideTitle: "User Guide",
    },
  } as const;

  const t = isAr ? copy.ar : copy.en;

  const isLanguageEn = dir === 'ltr';
  const currentLang = isLanguageEn ? 'en' : 'ar';

  const { currentTopic, currentChapter, currentChapterTitle, currentLessonTitle } = useMemo(() => {
    const topicRaw = sessionUtils.getCurrentTopic();
    const topic = topicRaw ? localizeTopic(topicRaw as any, currentLang) : null;
    const chapter = topic?.chapter ? localizeChapter(topic.chapter as any, currentLang) : null;
    
    return {
      currentTopic: topic,
      currentChapter: chapter,
      currentChapterTitle: chapter?.name || "",
      currentLessonTitle: topic?.name || "",
    };
  }, [dir, currentLang]);

  useEffect(() => {
    const scenarioId = searchParams.get("scenarioId");
    const sessionData = sessionUtils.getCurrentSession();

    if (sessionData && sessionData.scenarios) {
      const allScenarios = sessionData.scenarios;
      setTotalScenarios(allScenarios.filter(s => !s.isIntroduction).length);
      let scenarioToLoad: Scenario | undefined;

      if (scenarioId) {
        scenarioToLoad = allScenarios.find(
          (s) => s.id === parseInt(scenarioId, 10)
        );
      } else {
        scenarioToLoad = allScenarios[0];
      }

      if (scenarioToLoad) {
        setCurrentScenario(scenarioToLoad);
        setFeedbackScore(null);
        setHasSubmittedSuccessfully(false);
        setRecordedAudio(null);
        setIsPlaying(false);
        setArabicCompleted(false);
        setChineseCompleted(false);
        setIsLoadingScenario(false);
        setAudioProgress(0);

        // compute scenario-based progress: number of completed scenarios (those before current)
        const nonIntroScenarios = allScenarios.filter(s => !s.isIntroduction);
        const currentIndex = nonIntroScenarios.findIndex((s) => s.id === scenarioToLoad!.id);
        
        let progressValue = 0;
        if (scenarioToLoad.isIntroduction) {
            progressValue = 0;
        } else if (currentIndex !== -1) {
            progressValue = Math.round((currentIndex / nonIntroScenarios.length) * 100);
        }
        setScenarioProgress(progressValue);

        setLastAttemptScores(null);
        setLastTranscription("");
        setIsFeedbackOpen(false);
        setShowFeedbackWidget(false);
        setFeedback("");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    const handleAudioEnd = () => {
      setIsPlaying(false);
      setAudioProgress(100);
    };
    const handleAudioPause = () => {
      setIsPlaying(false);
      if (audio.currentTime === 0) setAudioProgress(0);
    };
    const handleAudioPlay = () => setIsPlaying(true);

    const handleTimeUpdate = () => {
      if (audio.duration && audio.currentTime >= 0) {
        setAudioProgress(Math.round((audio.currentTime / audio.duration) * 100));
      }
    };

    audio.addEventListener("ended", handleAudioEnd);
    audio.addEventListener("pause", handleAudioPause);
    audio.addEventListener("play", handleAudioPlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("ended", handleAudioEnd);
      audio.removeEventListener("pause", handleAudioPause);
      audio.removeEventListener("play", handleAudioPlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [recordedAudio]);

  const handleRecordingCompleted = (type: "arabic" | "chinese") => {
    if (type === "arabic") {
      setArabicCompleted(true);
    } else if (type === "chinese") {
      setChineseCompleted(true);
    }
  };

  const handleRecordClick = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        const mimeType = "audio/webm;codecs=opus";
        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const webmBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          const wavBlob = await convertToWav(webmBlob);
          setRecordedAudio(wavBlob);

          setHasSubmittedSuccessfully(false);
          setFeedbackScore(null);
          setLastAttemptScores(null);
          setLastTranscription("");
          setShowFeedbackWidget(false);
          setFeedback("");
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  const handlePlayClick = () => {
    if (!recordedAudio || !audioPlayerRef.current) return;

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioPlayerRef.current.src) {
        URL.revokeObjectURL(audioPlayerRef.current.src);
      }
      const audioUrl = URL.createObjectURL(recordedAudio);
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDiscardClick = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      if (audioPlayerRef.current.src) {
        URL.revokeObjectURL(audioPlayerRef.current.src);
        audioPlayerRef.current.src = "";
      }
    }
    setRecordedAudio(null);
    setIsPlaying(false);
  };

  const handleContinueClick = async () => {
    if (hasSubmittedSuccessfully) {
      const sessionData = sessionUtils.getCurrentSession();
      if (sessionData && sessionData.scenarios) {
        const currentScenarioId = currentScenario?.id;
        const allScenarios = sessionData.scenarios;
        const currentIndex = allScenarios.findIndex(
          (s) => s.id === currentScenarioId
        );

        let nextScenario = null;
        for (let i = currentIndex + 1; i < allScenarios.length; i++) {
          if (!allScenarios[i].isIntroduction) {
            nextScenario = allScenarios[i];
            break;
          }
        }

        if (nextScenario) {
          setIsLoadingScenario(true);
          goToStudentScenario(nextScenario.id);
        } else {
          console.log("All scenarios completed!");
        }
      }
      return;
    }

    if (!recordedAudio && !currentScenario?.isIntroduction) {
      return;
    }

    if (currentScenario?.isIntroduction) {
      setHasSubmittedSuccessfully(true);
      // Directly proceed to next scenario logic (recursive call or set state to trigger effect)
      // Since setHasSubmittedSuccessfully(true) will trigger the first block of this function on next click,
      // we can just return here and let the user click again? No, better UX is to just proceed.
      // Actually, let's just create a dummy "success" state for intro so it falls through to the next block?
      // Or better, just copy the logic to move to next scenario here.
      const sessionData = sessionUtils.getCurrentSession();
      if (sessionData && sessionData.scenarios) {
        const currentScenarioId = currentScenario?.id;
        const allScenarios = sessionData.scenarios;
        const currentIndex = allScenarios.findIndex(
          (s) => s.id === currentScenarioId
        );

        let nextScenario = null;
        for (let i = currentIndex + 1; i < allScenarios.length; i++) {
          if (!allScenarios[i].isIntroduction) {
            nextScenario = allScenarios[i];
            break;
          }
        }

        if (nextScenario) {
          setIsLoadingScenario(true);
          goToStudentScenario(nextScenario.id);
        } else {
          console.log("All scenarios completed!");
        }
      }
      return;
    }

    if (!recordedAudio) return;

    setIsSubmitting(true);
    try {
      const sessionId = sessionUtils.getSessionId();

      if (sessionId && currentScenario) {
        const response = await sessionsApi.submitAttempt(
          sessionId,
          currentScenario.id,
          recordedAudio
        );

        if (response && response.scores && typeof response.scores.total === 'number') {
          setFeedbackScore(response.scores.total);
          setHasSubmittedSuccessfully(true);

          setLastAttemptScores(response.scores);
          setLastTranscription(response.transcription || "");

          if (response.showTextFeedback && response.feedback?.textual) {
            setShowFeedbackWidget(true);
            setFeedback(response.feedback.textual);
          } else {
            setShowFeedbackWidget(false);
          }

          // Update session-based progress to include this completed scenario
          const sessionDataAfter = sessionUtils.getCurrentSession();
          const nonIntroAfter = sessionDataAfter?.scenarios?.filter((s: Scenario) => !s.isIntroduction) || [];
          const currentIndexAfter = nonIntroAfter.findIndex((s: Scenario) => s.id === currentScenario?.id);
          const progressAfter = nonIntroAfter.length > 0 ? Math.round(((currentIndexAfter + 1) / nonIntroAfter.length) * 100) : 0;
          setScenarioProgress(progressAfter);

          if (response.isLastScenario && response.overallFeedback) {
            sessionStorage.setItem(
              "sessionFeedback",
              JSON.stringify(response.overallFeedback)
            );
            goToStudentFeedback();
            return;
          }
        }

        setRecordedAudio(null);
      }
    } catch (error: any) {
      console.error("Error submitting attempt:", error);

      if (error?.response?.status === 400 && error?.response?.data?.message) {
        toast({
          title: t.speechErrorTitle,
          description: error.response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t.errorTitle,
          description: t.submitError,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertToWav = async (webmBlob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        try {
          const arrayBuffer = fileReader.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          const sampleRate = 16000;
          const length = Math.floor(audioBuffer.duration * sampleRate);
          const monoBuffer = audioContext.createBuffer(1, length, sampleRate);
          const monoData = monoBuffer.getChannelData(0);

          const sourceData = audioBuffer.getChannelData(0);
          const ratio = audioBuffer.sampleRate / sampleRate;

          for (let i = 0; i < length; i++) {
            const sourceIndex = Math.floor(i * ratio);
            monoData[i] = sourceData[sourceIndex] || 0;
          }

          const wavBlob = audioBufferToWav(monoBuffer);
          resolve(wavBlob);
        } catch (error) {
          reject(error);
        }
      };

      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(webmBlob);
    });
  };

  const audioBufferToWav = (audioBuffer: AudioBuffer): Blob => {
    const length = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, length * 2, true);

    const channelData = audioBuffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
      offset += 2;
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  };

  return (
    <div className={`relative top-4 h-screen flex flex-col md:pb-0 pb-8 w-full md:px-8 px-3 ${isAr ? "font-almarai" : "font-nunito"}`} dir={dir} lang={isAr ? "ar" : "en"}>
      <audio ref={audioPlayerRef} className="hidden" />
      <div className="mt-12">
        <ProgressBar
          key={dir}
          unit={currentChapterTitle}
          lesson={currentLessonTitle}
          progress={scenarioProgress}
          title={t.back}
          dir={dir}
          actionSlot={<AuthLanguageToggle />}
          onClick={() => {
            goToStudentUnits();
          }}
        />
      </div>
      <div className="flex-1 overflow-y-auto md:px-4 px-0 pb-24 overflow-x-hidden">
        <div className="flex flex-col items-center justify-center space-y-6">
          {isLoadingScenario ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-12 w-12 animate-spin text-green-500" />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                  {t.loadingNext}
                </p>
              </div>
            </div>
          ) : (
            <>
              {currentScenario && (
                <AudioSheikh
                  scenarioImageUrl={currentScenario.scenarioImageUrl}
                  arabicAudioUrl={currentScenario.arabicAudioUrl}
                  chineseAudioUrl={currentScenario.chineseAudioUrl}
                  targetPhraseChinese={currentScenario.targetPhraseChinese}
                  targetPhrasePinyin={currentScenario.targetPhrasePinyin}
                  onRecordingCompleted={handleRecordingCompleted}
                  onProgressUpdate={(p) => setAudioProgress(p)}
                  arabicCompleted={arabicCompleted}
                  chineseCompleted={chineseCompleted}
                  showChineseRecording={!currentScenario.isIntroduction}
                  showDiv={!currentScenario.isIntroduction}
                  imageWidth={360}
                  imageHeight={360}
                  forceStopAudio={isVideoModalOpen}
                  hasSubmittedSuccessfully={hasSubmittedSuccessfully}
                />
              )}
            </>
          )}

          {!isLoadingScenario && (
            <>
              <div className="w-full">
                {currentScenario?.isIntroduction ? (
                  <div className="h-16 w-full" /> // Standardized medium gap for introductory mode
                ) : (
                  <div className="w-full flex justify-center items-center py-4 sm:py-6 md:py-8">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 max-w-full">

                    {recordedAudio ? (
                      <>
                        {/* Playback Controls with Waveform */}
                        <div 
                          className="flex flex-row gap-3 md:gap-3 items-center justify-center px-2"
                          style={{
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            gap: isSmallScreen ? '1rem' : '0.75rem'
                          }}
                        >
                          {!isSmallScreen && (
                            <button
                              onClick={handleDiscardClick}
                              className="rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                              title={t.discard}
                            >
                              <Image
                                src="/images/cancel.svg"
                                alt="Discard"
                                width={80}
                                height={80}
                                className="w-18 h-18 sm:w-18 sm:h-18 md:w-18 md:h-18"
                              />
                            </button>
                          )}
                            <div 
                            className={`flex items-center justify-center gap-3 ${isAr ? "flex-row-reverse" : "flex-row"}`}
                            style={{
                              width: isSmallScreen ? 'auto' : '100%',
                              maxWidth: isSmallScreen ? '100%' : 'auto'
                            }}
                          >
                            <Image
                              src="/images/audioWave.png"
                              alt="Waveform"
                              width={310}
                              height={27}
                              className="max-w-[150px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-[310px] h-10 sm:h-10 md:h-12"
                            />
                            <button
                              onClick={handlePlayClick}
                              className="rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 active:border-b-0 active:translate-y-[2px] flex-shrink-0"
                              title={isPlaying ? t.pause : t.play}
                            >
                              {isPlaying ? (
                                <Image
                                  src="/images/pause.svg"
                                  alt="Pause"
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 sm:w-12 sm:h-12 md:w-12 md:h-12"
                                />
                              ) : (
                                <Image
                                  src="/images/play.svg"
                                  alt="Play"
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 sm:w-12 sm:h-12 md:w-12 md:h-12"
                                />
                              )}
                            </button>
                          </div>
                          {isSmallScreen && (
                            <button
                              onClick={handleDiscardClick}
                              className="rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                              title={t.discard}
                            >
                              <Image
                                src="/images/cancel.svg"
                                alt="Discard"
                                width={80}
                                height={80}
                                className="w-18 h-18 sm:w-18 sm:h-18 md:w-18 md:h-18"
                              />
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full max-w-full px-2">
                          <div className="w-full">
                            {
                              <button
                                id="record-button"
                                onClick={handleRecordClick}
                                disabled={!arabicCompleted}
                                className={`relative rounded-full flex items-center justify-center transition-all duration-300 w-full ${!arabicCompleted
                                  ? " cursor-not-allowed"
                                  : isRecording
                                    ? ""
                                    : arabicCompleted && chineseCompleted && !recordedAudio && !hasSubmittedSuccessfully
                                      ? "animate-guide-glow"
                                      : "active:scale-95 active:border-b-0 active:translate-y-[2px]"
                                  }`}
                                title={
                                  !arabicCompleted
                                    ? t.listenFirst
                                    : isRecording
                                      ? t.clickToStop
                                      : t.clickToRecord
                                }
                              >
                                {isRecording ? (
                                  <div className={`flex flex-row gap-2 md:gap-3 items-center justify-center w-full ${isAr ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className="flex-1 min-w-0 max-w-[150px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-[310px] h-10 sm:h-10 md:h-12 flex items-center">
                                      <AnimatedWaveform />
                                    </div>
                                    <div className="w-12 h-12 md:w-12 md:h-12 rounded-full bg-white border-[3px] border-[#FFCB08] flex items-center justify-center shadow-lg animate-pulse flex-shrink-0">
                                      <Square className="w-6 h-6 text-red-500" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className={`flex flex-row gap-2 md:gap-3 items-center justify-center w-full ${isAr ? "flex-row-reverse" : "flex-row"}`}>
                                    <Image
                                      src="/images/audioWave.png"
                                      alt="Record"
                                      width={310}
                                      height={67}
                                      className="max-w-[150px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-[310px] w-full h-10 sm:h-10 md:h-12 flex-1 min-w-0"
                                    />
                                    <Image
                                      src="/images/audio.svg"
                                      alt="Record"
                                      width={48}
                                      height={48}
                                      className="w-14 h-14 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0"
                                    />
                                  </div>
                                )}
                              </button>
                            }
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                )
                }
              </div>
            </>
          )}
        </div>
        {showFeedbackWidget && (
          <div className="w-full max-w-4xl mx-auto px-4 mb-6">
            {(() => {
              const score = feedbackScore || 0;
              const config = score >= 80 ? {
                container: "from-[#DCFCE7] to-[#F0FDF4] border-[#22C55E]",
                iconBg: "from-[#22C55E] to-[#16A34A]",
                label: "text-[#166534]",
                icon: <Sparkles className="w-6 h-6 text-white" />
              } : score >= 50 ? {
                container: "from-[#FFF9E6] to-[#FFF5CE] border-[#FFCB08]",
                iconBg: "from-[#FFCB08] to-[#E5B607]",
                label: "text-[#8B6914]",
                icon: <Lightbulb className="w-6 h-6 text-white" />
              } : {
                container: "from-[#FEE2E2] to-[#FEF2F2] border-[#EF4444]",
                iconBg: "from-[#EF4444] to-[#DC2626]",
                label: "text-[#991B1B]",
                icon: <Target className="w-6 h-6 text-white" />
              };

              return (
                <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r ${config.container} rounded-2xl shadow-sm border-r-4`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${config.iconBg} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    {config.icon}
                  </div>
                  <div className={`flex-1 w-full ${isAr ? "text-right" : "text-left"}`}>
                    <p className={`text-xs sm:text-sm ${config.label} mb-1 ${isAr ? "font-almarai-bold" : "font-nunito font-bold"}`}>{t.feedbackLabel}</p>
                    <p className={`text-sm sm:text-base text-gray-800 leading-relaxed break-words ${isAr ? "font-almarai" : "font-nunito"}`}>{feedback}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        <div
          className="px-4 pb-20 md:pb-24"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-full mx-auto">
            {/* Yellow User Guide Button */}
            <Button
              id="user-guide-button"
              onClick={() => setIsVideoModalOpen(true)}
              className={`w-full bg-[#FFCB08] h-14 hover:bg-[#FFCB08] text-[#1F1F1F] py-4 rounded-2xl flex items-center justify-center gap-2 md:gap-3 text-xs sm:text-sm md:text-lg border-b-[4px] border-b-[#DEA407] shadow-sm hover:scale-[1.02] active:translate-y-[2px] active:border-b-0 transition-all ${isAr ? "font-almarai-bold" : "font-nunito font-bold"}`}
            >
              <BookOpen className="h-3 w-3 md:h-5 md:w-5 stroke-[2.5px] flex-shrink-0" />
              <span className="truncate">{t.userGuide}</span>
            </Button>

            {/* Grey Feedback Button */}
            <Button
              id="feedback-button"
              onClick={() => setIsFeedbackOpen(true)}
              disabled={!lastAttemptScores}
              className={`w-full bg-[#E5E5E5] h-14 hover:bg-[#E5E5E5] text-[#1F1F1F] py-4 rounded-2xl flex items-center justify-center gap-2 md:gap-3 text-xs sm:text-sm md:text-lg border-b-[4px] border-b-[#C4C4C4] disabled:opacity-50 disabled:border-none shadow-sm hover:scale-[1.02] active:translate-y-[2px] active:border-b-0 transition-all ${isAr ? "font-almarai-bold" : "font-nunito font-bold"}`}
            >
              <div className='relative flex-shrink-0'>
                {lastAttemptScores && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>}
                <MessageSquare className="h-3 w-3 md:h-5 md:w-5 stroke-[2.5px]" />
              </div>
              <span className="truncate">{t.feedback}</span>
            </Button>


            {/* Green Continue Button */}
            <Button
              id="continue-button"
              onClick={handleContinueClick}
              disabled={
                isSubmitting ||
                !arabicCompleted ||
                (!currentScenario?.isIntroduction && !recordedAudio && !hasSubmittedSuccessfully)
              }
              className={`w-full col-span-2 md:col-span-1 bg-[#35AB4E] h-14 hover:bg-[#35AB4E] text-white py-4 flex items-center justify-center gap-3 text-sm sm:text-base md:text-lg rounded-2xl border-b-[4px] border-b-[#298E3E] disabled:opacity-50 disabled:cursor-not-allowed disabled:border-none shadow-sm hover:scale-[1.02] active:translate-y-[2px] active:border-b-0 transition-all ${isAr ? "font-almarai-bold" : "font-nunito font-bold"}`}
            >
              <span className="truncate">
                {isSubmitting
                  ? t.submitting
                  : hasSubmittedSuccessfully
                    ? t.continue
                    : t.submit}
              </span>
              {!isSubmitting && (
                <ContinueChevron className="h-5 w-5" />
              )}
              {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
            </Button>
          </div>
        </div>
      </div>



      <FeedbackPopup
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        scores={lastAttemptScores}
        transcription={lastTranscription}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://jfxedbnofpaezykdssmk.supabase.co/storage/v1/object/public/nihaonow-bucket/User-Guide/UserGuide-Video.mp4"
        title={t.guideTitle}
      />

      <SessionGuidePopup
        isOpen={showSessionGuide}
        onClose={() => {
          setShowSessionGuide(false);
          if (state.authUser?.id) {
            guidePersistence.setCompleted(state.authUser.id, 'session');
          }
        }}
        isIntroduction={currentScenario?.isIntroduction}
        isSecondStage={hasShownGuide && !currentScenario?.isIntroduction}
      />
    </div>
  );
}
