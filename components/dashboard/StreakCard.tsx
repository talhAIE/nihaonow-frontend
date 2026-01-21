"use client";

import { Card } from "@/components/ui/card";
import { Flame, TrendingUp, Calendar } from "lucide-react";

export function StreakCard() {
  return (
    <Card className="bg-white border-none shadow-sm p-6 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Your Streak</h3>
        <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold uppercase">
          <Flame className="h-3.5 w-3.5" />
          On Fire
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500 font-medium">Current Streak</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-gray-900">7</span>
            <span className="text-sm font-bold text-gray-400">days</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500 font-medium">Longest Streak</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-blue-600">14</span>
            <span className="text-sm font-bold text-gray-400">days</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-1 overflow-hidden">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
              i < 5 ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-400"
            }`}>
              {i < 5 ? <Flame className="h-4 w-4" /> : day}
            </div>
            <span className="text-[10px] font-bold text-gray-400">{day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
