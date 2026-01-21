"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface RankCardProps {
  title: string;
  rank: number;
  suffix?: string;
  trend?: 'up' | 'down';
  percentage?: number;
  icon: LucideIcon;
  isPoints?: boolean;
}

export function RankCard({ title, rank, suffix, trend, percentage, icon: Icon, isPoints }: RankCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-gray-900">{isPoints ? rank.toLocaleString() : rank}</span>
        <span className="text-sm font-bold text-gray-400">{suffix}</span>
      </div>

      {trend && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          <span>{percentage}% vs last week</span>
        </div>
      )}
    </Card>
  );
}
