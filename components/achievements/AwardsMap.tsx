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
  mdX?: number; // 1022px X position
  y: number;
  pathId: "left" | "center" | "right";
  variant: "red" | "yellow" | "green" | "star_gold" | "book" | "read" | "speak";
  size: "small" | "medium" | "large";
}

// 4-4-4 (Streak-Usage-Topics) = 12 Nodes Total
// Order: Usage (Center 0-3), Streak (Left 4-7), Topics (Right 8-11)
const TRI_PATH_NODES: MapNode[] = [
  // --- CENTER PATH (Usage - Yellow) ---
  {
    x: 50,
    mdX: 50,
    y: 24,
    pathId: "center",
    variant: "yellow",
    size: "medium",
  },
  {
    x: 50,
    mdX: 50,
    y: 44,
    pathId: "center",
    variant: "yellow",
    size: "medium",
  },
  {
    x: 50,
    mdX: 50,
    y: 64,
    pathId: "center",
    variant: "star_gold",
    size: "medium",
  },
  {
    x: 50,
    mdX: 50,
    y: 84,
    pathId: "center",
    variant: "yellow",
    size: "medium",
  },

  // --- LEFT PATH (Streak - Red) ---
  { x: 25, mdX: 40, y: 23, pathId: "left", variant: "red", size: "medium" },
  { x: 20, mdX: 36, y: 44, pathId: "left", variant: "red", size: "medium" },
  { x: 15, mdX: 24, y: 64, pathId: "left", variant: "speak", size: "medium" },
  { x: 10, mdX: 10, y: 84, pathId: "left", variant: "red", size: "medium" },

  // --- RIGHT PATH (Topics - Green) ---
  { x: 75, mdX: 60, y: 23, pathId: "right", variant: "green", size: "medium" },
  { x: 80, mdX: 64, y: 44, pathId: "right", variant: "green", size: "medium" },
  { x: 85, mdX: 76, y: 64, pathId: "right", variant: "read", size: "medium" },
  { x: 90, mdX: 90, y: 84, pathId: "right", variant: "green", size: "medium" },
];

export default function AwardsMap({ achievements, onClaim }: AwardsMapProps) {
  // Find the last earned achievement's position
  const earnedIndices = achievements
    .map((a, i) => (a.status === "earned" ? i : -1))
    .filter((i) => i !== -1);
  const lastEarnedIndex =
    earnedIndices.length > 0 ? Math.max(...earnedIndices) : -1;
  const progressNode =
    lastEarnedIndex !== -1 ? TRI_PATH_NODES[lastEarnedIndex] : null;

  const getAssetForNode = (
    node: MapNode,
    achievement: AchievementNode | null
  ) => {
    const isLocked = !achievement || achievement.status === "locked";

    switch (node.variant) {
      case "read":
        return "/achievements/ReadingGreenArabic 1.png";
      case "speak":
        return "/achievements/SpeakYellow 1.png";
      case "star_gold":
        return "/achievements/StarYellowAward 1.png";
      case "red":
        return isLocked
          ? "/achievements/LockedRed 1.png"
          : "/achievements/Redstar 1.png";
      case "yellow":
        return isLocked
          ? "/achievements/LockedYellow 1.png"
          : "/achievements/YellowStar 1.png";
      case "green":
        return isLocked
          ? "/achievements/LockedGreen 1.png"
          : "/achievements/GreenStar 1.png";
      default:
        return isLocked
          ? "/achievements/LockedGreen 1.png"
          : "/achievements/GreenStar 1.png";
    }
  };

  return (
    <div className="relative w-full min-h-[600px] sm:min-h-[800px] min-[1022px]:min-h-[1000px] bg-[#FEF9EC] rounded-[32px] sm:rounded-[48px] overflow-hidden shadow-2xl border-[8px] sm:border-[14px] border-white transition-all duration-500 mb-10 pt-16 sm:pt-20 pb-32 sm:pb-48">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF9] via-[#FFFFFF] to-[#FDF4E5]" />

      {/* MOBILE SVG (Wide Paths) - Visible only on mobile */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 min-[1022px]:hidden"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1="50"
          y1="18"
          x2="50"
          y2="84"
          stroke="#EAB308"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d="M25,18 C25,34 20,50 10,84"
          fill="none"
          stroke="#EF4444"
          strokeWidth="1"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        <path
          d="M75,18 C75,34 80,50 90,84"
          fill="none"
          stroke="#22C55E"
          strokeWidth="1"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      </svg>

      {/* DESKTOP SVG (Narrow Paths) - Visible only on md+ */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden min-[1022px]:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1="50"
          y1="18"
          x2="50"
          y2="84"
          stroke="#EAB308"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d="M40,18 C40,34 38,50 10,84"
          fill="none"
          stroke="#EF4444"
          strokeWidth="1"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        <path
          d="M60,18 C60,34 62,50 90,84"
          fill="none"
          stroke="#22C55E"
          strokeWidth="1"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      </svg>

      {/* Single Starting Flag at the Top Apex - Enlarged and moved higher */}
      <div className="absolute left-[50%] top-4 sm:top-6 -translate-x-1/2 drop-shadow-2xl z-0 transition-transform duration-500 hover:scale-110">
        <div className="relative w-20 h-16 sm:w-32 sm:h-24 min-[1022px]:w-44 min-[1022px]:h-32">
          <Image
            src="/achievements/Flag 1.png"
            alt="Start"
            fill
            className="object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* DYNAMIC PROGRESS BOOK MARKER */}
      {progressNode && (
        <div
          className="absolute z-40 pointer-events-none transition-all duration-1000 ease-in-out -translate-y-[80%] -translate-x-1/2"
          style={{
            left: `${progressNode.x}%`,
            top: `${progressNode.y}%`,
            // @ts-ignore
            "--mob-x": `${progressNode.x}%`,
            "--md-x": `${progressNode.mdX ?? progressNode.x}%`,
          }}
        >
          <style jsx>{`
            div[style*="--mob-x"] {
              left: var(--mob-x) !important;
            }
            @media (min-width: 1022px) {
              div[style*="--md-x"] {
                left: var(--md-x) !important;
              }
            }
          `}</style>
          <div className="relative w-8 h-8 sm:w-16 sm:h-16 animate-bounce-subtle me-0.5 mb-4 sm:mb-10">
            <Image
              src="/achievements/GreenBook 1.png"
              alt="Current Progress"
              fill
              className="object-contain drop-shadow-2xl"
            />
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
          small: "w-8 h-8 sm:w-14 sm:h-14 min-[1022px]:w-16 min-[1022px]:h-16",
          medium:
            "w-11 h-11 sm:w-18 sm:h-18 min-[1022px]:w-20 min-[1022px]:h-20",
          large:
            "w-14 h-14 sm:w-24 sm:h-24 min-[1022px]:w-30 min-[1022px]:h-30",
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
            style={{
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
              // @ts-ignore
              "--node-mob-x": `${node.x}%`,
              "--node-md-x": `${node.mdX ?? node.x}%`,
            }}
          >
            <style jsx>{`
              div[style*="--node-mob-x"] {
                left: var(--node-mob-x);
              }
              @media (min-width: 1022px) {
                div[style*="--node-md-x"] {
                  left: var(--node-md-x);
                }
              }
            `}</style>
            {achievement && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-56 sm:w-64 bg-slate-900/95 backdrop-blur-md text-white rounded-[24px] p-4 sm:p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 z-50 scale-90 group-hover:scale-100 origin-bottom">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-xs sm:text-[15px] font-almarai-extrabold leading-tight text-white whitespace-nowrap overflow-hidden text-ellipsis">
                    {achievement.name}
                  </p>
                  <Star
                    className={`w-4 h-4 shrink-0 ${
                      isEarned
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-500"
                    }`}
                  />
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mb-4 leading-relaxed line-clamp-2">
                  {achievement.description ||
                    "أكمل المهام المطلوبة للحصول على هذه المكافأة الرائعة!"}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[9px] sm:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${
                      isEarned
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-slate-700/50 text-slate-400 border border-slate-600/30"
                    }`}
                  >
                    {isEarned ? "تم الإنجاز" : "مغلق"}
                  </span>
                  {!isEarned && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-black text-yellow-400">
                        {achievement.pointValue}
                      </span>
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
              className={`relative flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${sizeClasses} ${
                isEarned ? "cursor-pointer" : "cursor-default opacity-90"
              } ${coloredShadows}`}
            >

              {isEarned && pointLight(node.variant)}

              <div className="relative w-full h-full flex items-center justify-center filter">
                <Image
                  src={assetUrl}
                  alt=""
                  fill
                  style={{ objectFit: "contain" }}
                  className={`transition-all duration-700 ${
                    isEarned
                      ? "brightness-110 contrast-125 scale-110"
                      : "grayscale opacity-60"
                  }`}
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
                  <div
                    className={`${
                      achievement?.rewardClaimed
                        ? "bg-green-600/95"
                        : "bg-yellow-500/95"
                    } text-white text-[7px] sm:text-[10px] font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg border border-white/20 uppercase`}
                  >
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
  if (variant.includes("star") || variant === "star_gold") {
    return (
      <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full animate-pulse" />
    );
  }
  return null;
}
