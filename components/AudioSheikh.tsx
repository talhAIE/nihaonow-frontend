"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Volume2, Pause } from "lucide-react";
import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface LanguageLearningInterfaceProps {
  scenarioImageUrl?: string;
  arabicAudioUrl?: string;
  chineseAudioUrl?: string;
  targetPhraseChinese?: string;
  targetPhrasePinyin?: string;
  showDiv?: boolean;
  onRecordingCompleted?: (type: "arabic" | "chinese") => void;
  /**
   * Called with a number 0-100 representing percent played of the currently-playing audio
   */
  onProgressUpdate?: (progress: number) => void;
  arabicCompleted?: boolean;
  chineseCompleted?: boolean;
  showChineseRecording?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  /**
   * When set to true, forces all audio playback to stop immediately
   */
  forceStopAudio?: boolean;
  hasSubmittedSuccessfully?: boolean;
}

export default function LanguageLearningInterface({
  scenarioImageUrl = "/images/shiekh2.png",
  arabicAudioUrl,
  chineseAudioUrl,
  targetPhraseChinese = "谢谢",
  targetPhrasePinyin = "xiè xiè",
  onRecordingCompleted,
  onProgressUpdate,
  arabicCompleted = false,
  chineseCompleted = false,
  showChineseRecording = true,
  showDiv = true,
  imageWidth = 360,
  imageHeight = 360,
  forceStopAudio = false,
  hasSubmittedSuccessfully = false,
}: LanguageLearningInterfaceProps) {
  const [isContextPlaying, setIsContextPlaying] = useState(false);
  const [isPronunciationPlaying, setIsPronunciationPlaying] = useState(false);
  const [localArabicCompleted, setLocalArabicCompleted] = useState(false);
  const [localChineseCompleted, setLocalChineseCompleted] = useState(false);
  const arabicAudioRef = useRef<HTMLAudioElement>(null);
  const chineseAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (forceStopAudio) {
      if (arabicAudioRef.current) {
        arabicAudioRef.current.pause();
        arabicAudioRef.current.currentTime = 0;
      }
      if (chineseAudioRef.current) {
        chineseAudioRef.current.pause();
        chineseAudioRef.current.currentTime = 0;
      }
      setIsContextPlaying(false);
      setIsPronunciationPlaying(false);
    }
  }, [forceStopAudio]);

  const handleContextPlay = () => {
    if (arabicAudioRef.current) {
      if (isContextPlaying) {
        arabicAudioRef.current.pause();
        arabicAudioRef.current.currentTime = 0;
        setIsContextPlaying(false);
      } else {
        pauseAllOtherAudios(arabicAudioRef.current);
        setIsPronunciationPlaying(false);
        if (chineseAudioRef.current) {
          chineseAudioRef.current.pause();
          chineseAudioRef.current.currentTime = 0;
        }
        arabicAudioRef.current.play();
        setIsContextPlaying(true);
      }
    }
  };

  const handlePronunciationPlay = () => {
    if (chineseAudioRef.current) {
      if (isPronunciationPlaying) {
        chineseAudioRef.current.pause();
        chineseAudioRef.current.currentTime = 0;
        setIsPronunciationPlaying(false);
      } else {
        pauseAllOtherAudios(chineseAudioRef.current);
        setIsContextPlaying(false);
        if (arabicAudioRef.current) {
          arabicAudioRef.current.pause();
          arabicAudioRef.current.currentTime = 0;
        }
        chineseAudioRef.current.play();
        setIsPronunciationPlaying(true);
      }
    }
  };

  useEffect(() => {
    const arabicAudio = arabicAudioRef.current;
    const chineseAudio = chineseAudioRef.current;

    const handleArabicEnd = () => {
      setIsContextPlaying(false);
      onProgressUpdate?.(100);
      if (!localArabicCompleted) {
        setLocalArabicCompleted(true);
        onRecordingCompleted?.("arabic");
      }
    };

    const handleChineseEnd = () => {
      setIsPronunciationPlaying(false);
      onProgressUpdate?.(100);
      if (!localChineseCompleted) {
        setLocalChineseCompleted(true);
        onRecordingCompleted?.("chinese");
      }
    };

    const handleArabicTime = () => {
      if (arabicAudio && arabicAudio.duration) {
        const progress = Math.min(100, Math.round((arabicAudio.currentTime / arabicAudio.duration) * 100));
        onProgressUpdate?.(progress);
      }
    };

    const handleChineseTime = () => {
      if (chineseAudio && chineseAudio.duration) {
        const progress = Math.min(100, Math.round((chineseAudio.currentTime / chineseAudio.duration) * 100));
        onProgressUpdate?.(progress);
      }
    };

    if (arabicAudio) {
      arabicAudio.addEventListener("ended", handleArabicEnd);
      arabicAudio.addEventListener("timeupdate", handleArabicTime);
    }
    if (chineseAudio) {
      chineseAudio.addEventListener("ended", handleChineseEnd);
      chineseAudio.addEventListener("timeupdate", handleChineseTime);
    }

    return () => {
      if (arabicAudio) {
        arabicAudio.removeEventListener("ended", handleArabicEnd);
        arabicAudio.removeEventListener("timeupdate", handleArabicTime);
      }
      if (chineseAudio) {
        chineseAudio.removeEventListener("ended", handleChineseEnd);
        chineseAudio.removeEventListener("timeupdate", handleChineseTime);
      }
    };
  }, [
    arabicAudioUrl,
    chineseAudioUrl,
    localArabicCompleted,
    localChineseCompleted,
    onRecordingCompleted,
    onProgressUpdate,
  ]);

  // When pausing other audios, reset progress to 0 so the top bar doesn't remain at a stale value
  const pauseAllOtherAudios = (exclude?: HTMLAudioElement | null) => {
    if (typeof document === "undefined") return;
    document.querySelectorAll("audio").forEach((audio) => {
      if (audio !== exclude) {
        try {
          (audio as HTMLAudioElement).pause();
          (audio as HTMLAudioElement).currentTime = 0;
        } catch (e) {
        }
      }
    });

    onProgressUpdate?.(0);
  };

  return (
    <div className={`flex flex-col items-center space-y-6 ${!showDiv ? "mb-8" : ""}`}>
      {arabicAudioUrl && (
        <audio ref={arabicAudioRef} src={arabicAudioUrl} preload="metadata" />
      )}
      {chineseAudioUrl && (
        <audio ref={chineseAudioRef} src={chineseAudioUrl} preload="metadata" />
      )}

      <button
        id="context-button"
        onClick={handleContextPlay}
        className={`bg-[#FFCB08] hover:bg-[#FFCB08] border-b-[4px] border-b-[#E5B607] active:border-b-0 active:translate-y-[2px] transition-all duration-150 rounded-full pl-2 pr-8 py-2 flex items-center justify-between gap-4 shadow-sm w-fit min-w-[12rem] h-14 ${!arabicCompleted && !hasSubmittedSuccessfully ? "animate-guide-glow" : ""
          }`}
        disabled={!arabicAudioUrl}
      >
        <span className="text-[#1F1F1F] font-bold text-lg whitespace-nowrap flex-shrink-0">جملة السياق</span>
        <div className="bg-white rounded-full p-1.5 w-9 h-9 flex items-center justify-center border-2 border-white">
          {isContextPlaying ? (
            <Pause className="h-4 w-4 text-[#F97316] fill-current" />
          ) : (
            <Play className="h-4 w-4 text-[#F97316] fill-current ml-0.5" />
          )}
        </div>
      </button>

      {/* Main Layout - Centered Vertical Stack */}
      <div className="w-full flex flex-col items-center justify-center gap-8 md:gap-10">

        {/* Character Image - Clean Card */}
        <div id="character-frame" className="relative w-64 h-64 md:w-[400px] md:h-[320px] max-w-full flex-shrink-0">
          <div className="absolute inset-0 bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
            <Image
              src={scenarioImageUrl}
              alt="Character"
              fill
              className="object-contain p-2"
            />
          </div>
        </div>

        {/* Phrase & Pronunciation - Centered Below */}
        <div 
          id="pronunciation-column" 
          className={`flex flex-col items-center gap-4 text-center transition-opacity duration-300 ${!showDiv ? "hidden" : "visible"}`}
        >
          {/* Main Phrase */}
          <h2 className="text-4xl md:text-5xl font-black text-[#22C55E] tracking-tight">{targetPhrasePinyin}</h2>

          {/* Audio & Pinyin Row */}
          <div className="flex items-center justify-center gap-3 text-gray-500 mt-2">
            <button
              onClick={handlePronunciationPlay}
              className={`w-10 h-10 rounded-full bg-[#35AB4E] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all ${isPronunciationPlaying ? "bg-[#298E3E]" : ""} ${arabicCompleted && !chineseCompleted && !hasSubmittedSuccessfully ? "animate-guide-glow" : ""}`}
            >
              {isPronunciationPlaying ? (
                <Pause className="w-5 h-5 text-white fill-current" />
              ) : (
                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
              )}
            </button>
            <span className="text-xl md:text-2xl font-medium text-gray-600 font-sans">{targetPhraseChinese}</span>
            <Volume2 className="w-6 h-6 opacity-40" />
          </div>
        </div>
      </div>


    </div >
  );
}