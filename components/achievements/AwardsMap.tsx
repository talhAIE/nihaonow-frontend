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
}

interface AwardsMapProps {
  achievements: AchievementNode[];
}

interface MapNode {
  x: number;
  y: number;
  pathId: "left" | "center" | "right";
  variant: "red" | "yellow" | "green" | "star_gold" | "book" | "read" | "speak";
  size: "small" | "medium" | "large";
}

// 6-6-6 (Red-Yellow-Green) = 18 Nodes Total
const TRI_PATH_NODES: MapNode[] = [
  // --- CENTER PATH (Yellow - Straight) ---
  { x: 50, y: 24, pathId: "center", variant: "yellow", size: "small" },
  { x: 50, y: 36, pathId: "center", variant: "yellow", size: "small" },
  { x: 50, y: 48, pathId: "center", variant: "yellow", size: "medium" },
  { x: 50, y: 60, pathId: "center", variant: "star_gold", size: "large" },
  { x: 50, y: 72, pathId: "center", variant: "yellow", size: "medium" },
  { x: 50, y: 84, pathId: "center", variant: "yellow", size: "small" },

  // --- LEFT PATH (Red - Curved Away) ---
  { x: 44.5, y: 24, pathId: "left", variant: "red", size: "small" },
  { x: 41, y: 36, pathId: "left", variant: "red", size: "small" },
  { x: 35, y: 48, pathId: "left", variant: "red", size: "medium" },
  { x: 26, y: 60, pathId: "left", variant: "speak", size: "large" },
  { x: 18, y: 72, pathId: "left", variant: "red", size: "medium" },
  { x: 10, y: 84, pathId: "left", variant: "red", size: "small" },

  // --- RIGHT PATH (Green - Curved Away) ---
  { x: 55.5, y: 24, pathId: "right", variant: "green", size: "small" },
  { x: 59, y: 36, pathId: "right", variant: "green", size: "small" },
  { x: 65, y: 48, pathId: "right", variant: "green", size: "medium" },
  { x: 74, y: 60, pathId: "right", variant: "read", size: "large" },
  { x: 82, y: 72, pathId: "right", variant: "green", size: "medium" },
  { x: 90, y: 84, pathId: "right", variant: "green", size: "small" },
];

export default function AwardsMap({ achievements }: AwardsMapProps) {
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

        {/* Left Path: Separated top start at 45, then curves to 10 */}
        <path d="M45,18 C45,34 40,50 10,84" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round" />
        {/* Right Path: Separated top start at 55, then curves to 90 */}
        <path d="M55,18 C55,34 60,50 90,84" fill="none" stroke="#22C55E" strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round" />
      </svg>

      {/* Single Starting Flag at the Top Apex - Enlarged and moved higher */}
      <div className="absolute left-[50%] top-4 sm:top-6 -translate-x-1/2 drop-shadow-2xl z-30 transition-transform duration-500 hover:scale-110">
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
            className="absolute group z-20"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
          >
            {achievement && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 sm:w-52 bg-slate-900 text-white rounded-2xl p-2 sm:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-50 scale-90 group-hover:scale-100">
                <p className="text-[10px] sm:text-sm font-black mb-1">{achievement.name}</p>
                <span className={`text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase ${isEarned ? "bg-green-500" : "bg-slate-700"}`}>
                  {isEarned ? "تم الإنجاز" : "مغلق"}
                </span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] sm:border-[10px] border-transparent border-t-slate-900" />
              </div>
            )}

            <div className={`relative flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${sizeClasses} ${isEarned ? "cursor-pointer" : "cursor-default opacity-90"} ${coloredShadows}`}>
              {/* Claimed Status Indicator */}
              {isEarned && (
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
              </div>

              {isEarned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none translate-y-5 sm:translate-y-7">
                  <div className="bg-green-600/95 text-white text-[7px] sm:text-[10px] font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg border border-white/20 uppercase">
                    Claimed
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
