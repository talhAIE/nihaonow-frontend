"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { CheckCircle2, Lock, Star } from "lucide-react";
import { Close } from "@radix-ui/react-toast";

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
  claimedAchievements?: Set<string>; // Add prop for claimed achievements
}

interface MapNode {
  x: number;
  mdX?: number; // 1022px X position
  lgX?: number; // 1024px X position
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
    lgX: 50,
    y: 24,
    pathId: "center",
    variant: "yellow",
    size: "medium",
  },
  {
    x: 50,
    mdX: 50,
    lgX: 50,
    y: 44,
    pathId: "center",
    variant: "yellow",
    size: "medium",
  },
  {
    x: 50,
    mdX: 50,
    lgX: 50,
    y: 64,
    pathId: "center",
    variant: "star_gold",
    size: "medium",
  },
  {
    x: 50,
    mdX: 50,
    lgX: 50,
    y: 84,
    pathId: "center",
    variant: "yellow",
    size: "medium",
  },

  // --- LEFT PATH (Streak - Red) ---
  { x: 30, mdX: 40, lgX: 35, y: 23, pathId: "left", variant: "red", size: "medium" },
  { x: 25, mdX: 30, lgX: 30, y: 44, pathId: "left", variant: "red", size: "medium" },
  { x: 15, mdX: 20, lgX: 20, y: 64, pathId: "left", variant: "speak", size: "medium" },
  { x: 15, mdX: 20, lgX: 20, y: 84, pathId: "left", variant: "red", size: "medium" },

  // --- RIGHT PATH (Topics - Green) ---
  { x: 70, mdX: 60, lgX: 65, y: 23, pathId: "right", variant: "green", size: "medium" },
  { x: 75, mdX: 70, lgX: 70, y: 44, pathId: "right", variant: "green", size: "medium" },
  { x: 85, mdX: 80, lgX: 80, y: 64, pathId: "right", variant: "read", size: "medium" },
  { x: 85, mdX: 80, lgX: 80, y: 84, pathId: "right", variant: "green", size: "medium" },
];

export default function AwardsMap({ achievements, onClaim, claimedAchievements = new Set() }: AwardsMapProps) {
  // Local state for claimed achievements to show immediate UI feedback
  const [localClaimed, setLocalClaimed] = useState<Set<string>>(claimedAchievements);
  const [activePopup, setActivePopup] = useState<AchievementNode | null>(null);

  useEffect(() => {
    setLocalClaimed(new Set(claimedAchievements));
  }, [claimedAchievements]);

  // Optimistic claim handler - updates UI immediately
  const handleOptimisticClaim = useCallback((key: string, name: string) => {
    if (localClaimed.has(key)) return; // Prevent double claims

    // Update local state immediately for instant UI feedback
    setLocalClaimed(prev => new Set(prev).add(key));

    // Call parent handler for backend update
    onClaim?.(key, name);
  }, [localClaimed, onClaim]);

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
    const isEarned = achievement?.status === "earned";
    const isClaimed = !!(achievement?.rewardClaimed || (achievement && localClaimed.has(achievement.key)));

    const lockedAssetByPath: Record<MapNode["pathId"], string> = {
      left: "/achievements/LockedRed 1.png",
      center: "/achievements/LockedYellow 1.png",
      right: "/achievements/LockedGreen 1.png",
    };

    switch (node.variant) {
      case "read":
        return "/achievements/ReadingGreenArabic 1.png";
      case "speak":
        return "/achievements/SpeakYellow 1.png";
      case "star_gold":
        return "/achievements/StarYellowAward 1.png";
      case "red":
        if (isLocked) {
          return "/achievements/LockedRed 1.png";
        } else if (isEarned && !isClaimed) {
          return "/achievements/StarRedAward 1.png";
        } else if (isEarned && isClaimed) {
          return "/achievements/StarRedAward 1.png";
        } else {
          return "/achievements/Redstar 1.png";
        }
      case "yellow":
        if (isLocked) {
          return "/achievements/LockedYellow 1.png";
        } else if (isEarned && !isClaimed) {
          return "/achievements/StarYellowAward 1.png";
        } else if (isEarned && isClaimed) {
          return "/achievements/StarYellowAward 1.png";
        } else {
          return "/achievements/YellowStar 1.png";
        }
      case "green":
        if (isLocked) {
          return "/achievements/LockedGreen 1.png";
        } else if (isEarned && !isClaimed) {
          return "/achievements/StarGreenAward 1.png";
        } else if (isEarned && isClaimed) {
          return "/achievements/StarGreenAward 1.png";
        } else {
          return "/achievements/GreenStar 1.png";
        }
      default:
        if (isLocked) {
          return "/achievements/LockedGreen 1.png";
        } else if (isEarned && !isClaimed) {
          return "/achievements/GreenStar 1.png";
        } else if (isEarned && isClaimed) {
          return "/achievements/StarGreenAward 1.png";
        } else {
          return "/achievements/GreenStar 1.png";
        }
    }
  };

  return (
    <div className="relative w-full min-h-[500px] sm:min-h-[700px] min-[1022px]:min-h-[900px] overflow-hidden transition-all duration-500 pt-16 sm:pt-20 pb-16 sm:pb-24 rounded-[32px] sm:rounded-[48px]">
      {/* Background SVG */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[32px] sm:rounded-[48px]">
        <Image
          src="/achievements/bg.svg"
          alt="Background"
          fill
          className="object-cover object-top"
          style={{ objectPosition: 'top center' }}
        />
      </div>

      {/* Backdrop overlay */}
      {activePopup && (
        <div
          className="fixed inset-0 bg-black/50 z-[9998]"
          onClick={() => setActivePopup(null)}
        />
      )}

      {activePopup && (
        <div
          className="fixed w-72 sm:w-80 md:w-96 max-w-[92vw] bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[9999] rounded-[24px]"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Close Button Top Right */}
          <button
            type="button"
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-20"
            onClick={() => setActivePopup(null)}
            aria-label="إغلاق"
          >
            ✕
          </button>

          {/* Content Group: Star + Text */}
          <div className="flex items-center justify-center gap-3 mb-5 mt-2 relative z-10">
            <Star
              className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rotate-12 ${activePopup.status === "earned"
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400 fill-gray-400"
                }`}
            />
            <div className="flex flex-col items-start text-right">
              <h3 className="text-base sm:text-lg font-almarai-extrabold leading-tight text-gray-900">
                {activePopup.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed break-words max-w-[200px]">
                {activePopup.description ||
                  "أكمل المهام المطلوبة للحصول على هذه المكافأة الرائعة!"}
              </p>
            </div>
          </div>

          {/* Footer with points and status */}
          <div className="flex items-center justify-between gap-3 relative z-10">
            {/* Status button - moved to left */}
            <button
              className={`text-xs sm:text-sm font-almarai-bold px-4 py-2 rounded-xl transition-colors ${activePopup.status === "earned"
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                }`}
            >
              {activePopup.status === "earned" ? "تم الإنجاز" : "مغلق"}
            </button>

            {/* Points display - moved to right */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 rounded-xl border border-yellow-200">
              <span className="text-sm sm:text-base font-black text-gray-900">
                {activePopup.pointValue || 0}
              </span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        </div>
      )}

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
          d="M35,18 Q 25,41 15,64 L 15,84"
          fill="none"
          stroke="#EF4444"
          strokeWidth="1"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        <path
          d="M65,18 Q 75,41 85,64 L 85,84"
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
          d="M40,18 Q 30,41 20,64 L 20,84"
          fill="none"
          stroke="#EF4444"
          strokeWidth="1"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        <path
          d="M60,18 Q 70,41 80,64 L 80,84"
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

      {/* Nodes Distribution */}
      {TRI_PATH_NODES.map((node, index) => {
        const achievement = achievements[index] || null;
        const isEarned = achievement?.status === "earned";
        const isClaimed = !!achievement?.rewardClaimed || localClaimed.has(achievement.key);
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

        const getFloatingCoin = (variant: string) => {
          if (variant === "red") return "/achievements/Redstar 1.png";
          if (variant === "yellow" || variant === "star_gold" || variant === "speak")
            return "/achievements/YellowStar 1.png";
          if (variant === "green" || variant === "read")
            return "/achievements/GreenStar 1.png";
          return null;
        };

        const floatingCoin = isEarned && !isClaimed ? getFloatingCoin(node.variant) : null;

        return (
          <div
            key={index}
            id={index === 0 ? "reward-node-highlight" : undefined}
            className="absolute group z-20 hover:z-50"
            style={{
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
              // @ts-ignore
              "--node-mob-x": `${node.x}%`,
              "--node-md-x": `${node.mdX ?? node.x}%`,
              "--node-lg-x": `${node.lgX ?? node.mdX ?? node.x}%`,
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
              @media (min-width: 1024px) {
                div[style*="--node-lg-x"] {
                  left: var(--node-lg-x);
                }
              }
            `}</style>
            <div
              onClick={() => {
                // Toggle centered popup
                setActivePopup(prev => (prev?.key === achievement.key ? null : achievement));

                // Handle claim if needed
                if (isEarned && !isClaimed) {
                  handleOptimisticClaim(achievement.key, achievement.name);
                }
              }}
              className={`relative flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${sizeClasses} ${isEarned ? "cursor-pointer" : "cursor-default opacity-90"
                } ${coloredShadows}`}
            >

              {isEarned && pointLight(node.variant)}

              {/* Main Award Image */}
              <div className="relative w-full h-full flex items-center justify-center filter">
                <Image
                  src={assetUrl}
                  alt=""
                  fill
                  style={{ objectFit: "contain" }}
                  className={`transition-all duration-700 ${isEarned
                    ? "brightness-110 contrast-125 scale-110"
                    : "grayscale opacity-60"
                    }`}
                />
              </div>

              {/* Float Coin (Static) for Unclaimed Awards */}
              {floatingCoin && (
                <div className="absolute -top-9 w-12 h-12 sm:w-14 sm:h-14 pointer-events-none z-10">
                  <Image
                    src={floatingCoin}
                    alt="Collect"
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
              )}

              {isEarned && isClaimed && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none translate-y-5 sm:translate-y-7">
                  <div className="relative">
                    <div className="bg-green-600/95 text-white rounded-full shadow-lg border border-white/20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-slate-900/95 text-white text-[10px] sm:text-[11px] font-almarai-bold px-3 py-1.5 rounded-full shadow-lg border border-white/10 whitespace-nowrap">
                        تمت المطالبة به
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Decorative Images in Empty Spaces */}

      <div className="absolute top-[26%] right-[5%] w-16 h-16 min-[700px]:w-28 min-[700px]:h-36 z-0">
        <Image
          src="/achievements/panda1 1.png"
          alt="panda1"
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute top-[26%] left-[5%] w-16 h-16 min-[700px]:w-28 min-[700px]:h-36 z-0">
        <Image
          src="/achievements/Building2 1.png"
          alt="Building2"
          fill
          className="object-contain"
        />
      </div>

      <div className="min-[700px]:block hidden">

        <div className="absolute top-[75%] right-[25%] w-14 h-14 sm:w-20 sm:h-20 z-0">
          <Image
            src="/achievements/Building1 1.png"
            alt="Building 1"
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute top-[70%] left-[25%] w-20 h-20 sm:w-28 sm:h-28 z-0">
          <Image
            src="/achievements/tiger 1.png"
            alt="tiger"
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute top-[52%] right-[28%] w-22 h-22 sm:w-28 sm:h-28 z-0">
          <Image
            src="/achievements/monkey1 1.png"
            alt="monkey1"
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute top-[50%] left-[30%] w-20 h-20 sm:w-24 sm:h-24 z-0">
          <Image
            src="/achievements/miniforesttwo 1.png"
            alt="Forest 1"
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute top-[30%] left-[34%] w-20 h-20 sm:w-24 sm:h-24 z-0">
          <Image
            src="/achievements/miniforestone 1.png"
            alt="Forest 1"
            fill
            className="object-contain"
          />
        </div>
      </div>
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
