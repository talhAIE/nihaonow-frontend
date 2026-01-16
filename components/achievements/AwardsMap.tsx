"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, Lock, Star } from "lucide-react";

interface AchievementNode {
  id: string | number;
  name: string;
  description: string;
  status: "earned" | "locked";
  pointValue: number;
  category: string;
  rewardClaimed?: boolean;
  key: string;
}

interface AwardsMapProps {
  achievements: AchievementNode[];
  onClaim?: (key: string, name: string) => void;
}

interface MapNode {
  x: number;
  y: number;
  pathId: "left" | "center" | "right";
  variant: "red" | "yellow" | "green" | "star_gold" | "book" | "read" | "speak";
  size: "small" | "medium" | "large";
}

// 4-4-4 (Streak-Usage-Topics) = 12 Nodes Total
// Order: Usage (Center 0-3), Streak (Left 4-7), Topics (Right 8-11)
const TRI_PATH_NODES: MapNode[] = [
  // --- CENTER PATH (Usage - Yellow) ---
  { x: 50, y: 24, pathId: "center", variant: "yellow", size: "medium" },
  { x: 50, y: 44, pathId: "center", variant: "yellow", size: "medium" },
  { x: 50, y: 64, pathId: "center", variant: "star_gold", size: "medium" },
  { x: 50, y: 84, pathId: "center", variant: "yellow", size: "medium" },

  // --- LEFT PATH (Streak - Red) ---
  { x: 40, y: 23, pathId: "left", variant: "red", size: "medium" },
  { x: 36, y: 44, pathId: "left", variant: "red", size: "medium" },
  { x: 24, y: 64, pathId: "left", variant: "speak", size: "medium" },
  { x: 10, y: 84, pathId: "left", variant: "red", size: "medium" },

  // --- RIGHT PATH (Topics - Green) ---
  { x: 60, y: 23, pathId: "right", variant: "green", size: "medium" },
  { x: 64, y: 44, pathId: "right", variant: "green", size: "medium" },
  { x: 76, y: 64, pathId: "right", variant: "read", size: "medium" },
  { x: 90, y: 84, pathId: "right", variant: "green", size: "medium" },
];

export default function AwardsMap({ achievements, onClaim }: AwardsMapProps) {
  // Find the last earned achievement's position
  const earnedIndices = achievements.map((a, i) => a.status === "earned" ? i : -1).filter(i => i !== -1);
  const lastEarnedIndex = earnedIndices.length > 0 ? Math.max(...earnedIndices) : -1;
  const progressNode = lastEarnedIndex !== -1 ? TRI_PATH_NODES[lastEarnedIndex] : null;

  const getAssetForNode = (node: MapNode, achievement: AchievementNode | null) => {
    const isLocked = !achievement || achievement.status === "locked";

    switch (node.variant) {
      case "read": return "/achievements/ReadingGreenArabic 1.png";
      case "speak": return "/achievements/SpeakYellow 1.png";
      case "star_gold": return "/achievements/StarYellowAward 1.png";
      case "red": return isLocked ? "/achievements/LockedRed 1.png" : "/achievements/Redstar 1.png";
      case "yellow": return isLocked ? "/achievements/LockedYellow 1.png" : "/achievements/YellowStar 1.png";
      case "green": return isLocked ? "/achievements/LockedGreen 1.png" : "/achievements/GreenStar 1.png";
      default: return isLocked ? "/achievements/LockedGreen 1.png" : "/achievements/GreenStar 1.png";
    }
  };

  return (
    <div className="relative w-full min-h-[600px] sm:min-h-[800px] md:min-h-[1000px] bg-[#FEF9EC] rounded-[32px] sm:rounded-[48px] overflow-hidden shadow-2xl border-[8px] sm:border-[14px] border-white transition-all duration-500 mb-10 pt-16 sm:pt-20 pb-32 sm:pb-48">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF9] via-[#FFFFFF] to-[#FDF4E5]" />

      {/* Tri-Path SVG Layout - Terms at 84 to match nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* CENTER PATH - Straight Yellow */}
        <line x1="50" y1="18" x2="50" y2="84" stroke="#EAB308" strokeWidth="1" strokeDasharray="4 4" />

        {/* Left Path: Separated top start at 40, then curves to 10 */}
        <path d="M40,18 C40,34 38,50 10,84" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round" />
        {/* Right Path: Separated top start at 60, then curves to 90 */}
        <path d="M60,18 C60,34 62,50 90,84" fill="none" stroke="#22C55E" strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round" />
      </svg>

      {/* Single Starting Flag at the Top Apex - Enlarged and moved higher */}
      <div className="absolute left-[50%] top-4 sm:top-6 -translate-x-1/2 drop-shadow-2xl z-0 transition-transform duration-500 hover:scale-110">
        <div className="relative w-24 h-20 sm:w-32 sm:h-24 md:w-44 md:h-32">
          <Image src="/achievements/Flag 1.png" alt="Start" fill className="object-contain drop-shadow-lg" />
        </div>
      </div>

      {/* DYNAMIC PROGRESS BOOK MARKER */}
      {progressNode && (
        <div
          className="absolute z-40 pointer-events-none transition-all duration-1000 ease-in-out -translate-y-[80%] -translate-x-1/2"
          style={{ left: `${progressNode.x}%`, top: `${progressNode.y}%` }}
        >
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 animate-bounce-subtle">
            <Image src="/achievements/GreenBook 1.png" alt="Current Progress" fill className="object-contain drop-shadow-2xl" />
          </div>
        </div>
      )}

      {/* Nodes Distribution */}
      {TRI_PATH_NODES.map((node, index) => {
        const achievement = achievements[index] || null;
        const isEarned = achievement?.status === "earned";
        const assetUrl = getAssetForNode(node, achievement);

        // Slightly larger node sizes
        const sizeClasses = {
          small: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
          medium: "w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20",
          large: "w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30",
        }[node.size];

        // Path-specific colored shadows
        const coloredShadows = {
          left: "drop-shadow-[0_6px_8px_rgba(239,68,68,0.45)]",
          center: "drop-shadow-[0_6px_8px_rgba(234,179,8,0.45)]",
          right: "drop-shadow-[0_6px_8px_rgba(34,197,94,0.45)]",
        }[node.pathId];

        return (
          <div
            key={index}
            className="absolute group z-20 hover:z-50"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
          >
            {achievement && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-56 sm:w-64 bg-slate-900/95 backdrop-blur-md text-white rounded-[24px] p-4 sm:p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 z-50 scale-90 group-hover:scale-100 origin-bottom">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-xs sm:text-[15px] font-almarai-extrabold leading-tight text-white whitespace-nowrap overflow-hidden text-ellipsis">{achievement.name}</p>
                  <Star className={`w-4 h-4 shrink-0 ${isEarned ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`} />
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mb-4 leading-relaxed line-clamp-2">
                  {achievement.description || "أكمل المهام المطلوبة للحصول على هذه المكافأة الرائعة!"}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9px] sm:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${isEarned ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-slate-700/50 text-slate-400 border border-slate-600/30"}`}>
                    {isEarned ? "تم الإنجاز" : "مغلق"}
                  </span>
                  {!isEarned && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-black text-yellow-400">{achievement.pointValue}</span>
                    </div>
                  )}
                </div>

                {/* Improved Triangle Pointer */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 overflow-hidden -mt-0.5">
                  <div className="w-2.5 h-2.5 bg-slate-900/95 rotate-45 transform origin-top-left translate-x-1/2 border-r border-b border-white/10" />
                </div>
              </div>
            )}

            <div
              onClick={() => {
                if (isEarned && !achievement?.rewardClaimed && onClaim) {
                  onClaim(achievement.key, achievement.name);
                }
              }}
              className={`relative flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${sizeClasses} ${isEarned ? "cursor-pointer" : "cursor-default opacity-90"} ${coloredShadows}`}>
              {/* Claimed Status Indicator - Only show if actually claimed in DB */}
              {isEarned && achievement?.rewardClaimed && (
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-30 bg-green-500 text-white rounded-full p-1 sm:p-1.5 shadow-2xl border-2 border-white animate-bounce-subtle">
                  <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
              )}

              {isEarned && pointLight(node.variant)}

              <div className="relative w-full h-full flex items-center justify-center filter">
                <Image
                  src={assetUrl}
                  alt=""
                  fill
                  style={{ objectFit: "contain" }}
                  className={`transition-all duration-700 ${isEarned ? "brightness-110 contrast-125 scale-110" : "grayscale opacity-60"}`}
                />
                {/* Star overlay for star variants - Always show for testing */}
                {(node.variant.includes('star') || node.variant === 'star_gold') && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <Star className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${isEarned ? "text-yellow-300 fill-yellow-300 drop-shadow-lg animate-pulse" : "text-gray-400 fill-gray-400 opacity-50"}`} />
                  </div>
                )}
              </div>

              {isEarned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none translate-y-5 sm:translate-y-7">
                  <div className={`${achievement?.rewardClaimed ? "bg-green-600/95" : "bg-yellow-500/95"} text-white text-[7px] sm:text-[10px] font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg border border-white/20 uppercase`}>
                    {achievement?.rewardClaimed ? "تم الاستلام" : "استلم الآن"}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function pointLight(variant: string) {
  if (variant.includes('star') || variant === 'star_gold') {
    return <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full animate-pulse" />;
  }
  return null;
}
