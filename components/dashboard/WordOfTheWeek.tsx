"use client";

import { Card } from "@/components/ui/card";
import { Languages, Volume2, BookOpen } from "lucide-react";

export function WordOfTheWeek() {
  return (
    <Card className="bg-white border-none shadow-sm p-6 overflow-hidden relative group cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-blue-600">
          <Languages className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Word of the Week</span>
        </div>
        <button className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
          <Volume2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="text-4xl font-bold text-gray-900">梦想</h3>
        <p className="text-xl text-gray-500 font-medium italic">Mèngxiǎng</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <p className="text-gray-700 font-semibold mb-1">Dream / Aspiration</p>
        <p className="text-sm text-gray-500 line-clamp-2">&quot;Following your dreams is the key to happiness.&quot;</p>
      </div>

      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <BookOpen className="h-24 w-24 text-blue-600 rotate-12" />
      </div>
    </Card>
  );
}
