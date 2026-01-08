"use client";

import { useState, useEffect } from "react";
import { Mic, Square, Volume2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AudioInteraction() {
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setShowFeedback(true);
    } else {
      setIsRecording(true);
      setShowFeedback(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-12 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Pronounce the phrase</h3>
        <p className="text-gray-500 italic">&quot;Nǐ hǎo, wǒ de péngyǒu&quot;</p>
      </div>

      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 bg-red-100 rounded-full animate-ping opacity-75"></div>
            <div className="h-40 w-40 bg-red-50 rounded-full animate-pulse opacity-50 absolute"></div>
          </div>
        )}
        
        <button
          onClick={toggleRecording}
          className={`relative h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
            isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isRecording ? (
            <Square className="h-8 w-8 text-white fill-white" />
          ) : (
            <Mic className="h-10 w-10 text-white" />
          )}
        </button>
      </div>

      <div className="flex flex-col items-center">
        {isRecording ? (
          <div className="flex gap-1 h-8 items-center">
            {[1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 1].map((h, i) => (
              <div 
                key={i} 
                className="bg-red-400 w-1 rounded-full animate-bounce" 
                style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        ) : (
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
            {showFeedback ? "Processing Audio..." : "Tap to record"}
          </p>
        )}
      </div>

      {showFeedback && (
        <div className="w-full max-w-sm bg-white p-4 rounded-xl shadow-sm border border-blue-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-tight">AI Analysis</span>
          </div>
          <p className="text-gray-900 font-medium mb-1">Excellent tones! 🌟</p>
          <p className="text-xs text-gray-500">Your &quot;hǎo&quot; (3rd tone) was particularly clear. Practice the pinyin &quot;péng&quot; a bit more for 95%+ score.</p>
        </div>
      )}
    </div>
  );
}
