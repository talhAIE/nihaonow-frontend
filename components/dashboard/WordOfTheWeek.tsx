"use client";

import { Card } from "@/components/ui/card";
import { Languages, Volume2, BookOpen } from "lucide-react";
import type { WordOfTheWeek as WordOfTheWeekType } from "@/lib/types";

interface WordOfTheWeekProps {
  word?: WordOfTheWeekType | null;
  onNavigate?: () => void;
}

export function WordOfTheWeek({ word, onNavigate }: WordOfTheWeekProps) {
  // Fallback data if no word is provided
  const displayWord = word || {
    id: -1,
    chinese: "梦想",
    pinyin: "Mèngxiǎng",
    english: "Dream / Aspiration",
    audioUrl: null,
    exampleSentence: "Following your dreams is the key to happiness.",
  };

  const handleAudioPlay = () => {
    if (!displayWord.audioUrl) return;
    
    const audio = new Audio(displayWord.audioUrl);
    audio.play().catch(err => {
      console.error("Failed to play audio:", err);
    });
  };

  return (
    <Card 
      className="bg-white border-none shadow-sm p-6 overflow-hidden relative group cursor-pointer hover:shadow-md transition-shadow"
      onClick={onNavigate}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-blue-600">
          <Languages className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Word of the Week</span>
        </div>
        {displayWord.audioUrl && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAudioPlay();
            }}
            className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-4xl font-bold text-gray-900">{displayWord.chinese}</h3>
        {displayWord.pinyin && (
          <p className="text-xl text-gray-500 font-medium italic">{displayWord.pinyin}</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        {displayWord.english && (
          <p className="text-gray-700 font-semibold mb-1">{displayWord.english}</p>
        )}
        {displayWord.exampleSentence && (
          <p className="text-sm text-gray-500 line-clamp-2">&quot;{displayWord.exampleSentence}&quot;</p>
        )}
      </div>

      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <BookOpen className="h-24 w-24 text-blue-600 rotate-12" />
      </div>
    </Card>
  );
}
