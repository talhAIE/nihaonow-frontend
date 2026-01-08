"use client";

import { CheckCircle2, TrendingUp, Star, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LessonSummary() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-2">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h2 className="text-4xl font-black text-gray-900">Lesson Complete!</h2>
        <p className="text-gray-500 text-lg">You&apos;ve mastered 5 new phrases today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-2">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Accuracy</p>
          <div className="text-3xl font-black text-blue-600">92%</div>
          <div className="flex items-center justify-center gap-1 text-xs text-green-600 font-bold">
            <TrendingUp className="h-3 w-3" />
            +4%
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-2">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Points</p>
          <div className="text-3xl font-black text-yellow-500">+150</div>
          <div className="text-xs text-gray-400 font-medium">Daily bonus active</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-2">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Time</p>
          <div className="text-3xl font-black text-purple-600">4:20</div>
          <div className="text-xs text-gray-400 font-medium">min:sec</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl text-white shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-1 italic">Knowledge Gained</h3>
          <p className="opacity-90">You unlocked the &quot;Polite Greetings&quot; badge!</p>
        </div>
        <Star className="h-12 w-12 text-yellow-400 fill-yellow-400 animate-pulse" />
      </div>

      <div className="flex gap-4">
        <Button className="flex-1 py-8 text-xl font-bold bg-gray-100 text-gray-900 hover:bg-gray-200 border-none transition-all active:scale-95 shadow-none">
          Review Mistakes
        </Button>
        <Link href="/dashboard" className="flex-1">
          <Button className="w-full py-8 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all active:scale-95 shadow-lg shadow-blue-200">
            Next Lesson
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
