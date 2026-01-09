"use client";

import React from "react";
import Image from "next/image";
import { Lock, Star } from "lucide-react";

interface AchievementNode {
  id: string | number;
  name: string;
  description: string;
  status: "earned" | "locked";
  pointValue: number;
  category: string;
}

interface MobileAwardsMapProps {
  achievements: AchievementNode[];
}

// Mobile path - vertical scrolling layout
interface MobileNode {
  y: number; // Vertical position (0-100)
  variant: "red" | "yellow" | "green" | "light_green" | "book" | "read" | "speak" | "star_gold" | "red_plain" | "pink_star" | "red_star" | "yellow_star" | "green_lock" | "yellow_lock" | "red_lock";
  size: "small" | "medium" | "large" | "xl";
  side?: "left" | "center" | "right"; // Position on the path
}

// Vertical mobile path matching the design
const MOBILE_PATH: MobileNode[] = [
  // Start at top
  { y: 5, variant: "red", size: "medium", side: "left" },
  { y: 12, variant: "yellow", size: "medium", side: "center" },
  { y: 19, variant: "green", size: "medium", side: "right" },
  { y: 26, variant: "book", size: "medium", side: "left" },
  { y: 33, variant: "yellow_star", size: "large", side: "center" },
  { y: 40, variant: "pink_star", size: "medium", side: "right" },
  { y: 47, variant: "green_lock", size: "medium", side: "left" },
  { y: 54, variant: "yellow_lock", size: "medium", side: "center" },
  { y: 61, variant: "star_gold", size: "xl", side: "center" },
  { y: 68, variant: "pink_star", size: "medium", side: "right" },
  { y: 75, variant: "yellow_star", size: "medium", side: "left" },
  { y: 82, variant: "green_lock", size: "medium", side: "center" },
  { y: 89, variant: "yellow_star", size: "large", side: "right" },
  { y: 95, variant: "pink_star", size: "medium", side: "center" },
];

// Mobile decorations - simplified for vertical layout
const MOBILE_DECORATIONS = [
  { y: 8, src: "/achievements/buildingfour 1.png", w: 60, h: 60, side: "right" },
  { y: 22, src: "/achievements/panda1 1.png", w: 50, h: 50, side: "left" },
  { y: 36, src: "/achievements/buildingthree 1.png", w: 70, h: 70, side: "right" },
  { y: 50, src: "/achievements/Building1 1.png", w: 60, h: 60, side: "left" },
  { y: 64, src: "/achievements/tiger 1.png", w: 60, h: 60, side: "right" },
  { y: 78, src: "/achievements/monkey1 1.png", w: 50, h: 50, side: "left" },
  { y: 92, src: "/achievements/Building2 1.png", w: 55, h: 55, side: "right" },
];

export default function MobileAwardsMap({ achievements }: MobileAwardsMapProps) {
  const getAssetForNode = (node: MobileNode, achievement: AchievementNode | null) => {
    const isLocked = !achievement || achievement.status === "locked";
    
    switch (node.variant) {
      case "book": return "/achievements/GreenBook 1.png";
      case "read": return "/achievements/ReadingGreenArabic 1.png";
      case "speak": return "/achievements/SpeakYellow 1.png";
      case "star_gold": return "/achievements/StarYellowAward 1.png";
      
      case "pink_star": return isLocked ? "/achievements/StarRedlocked 1.png" : "/achievements/StarRedAward 1.png";
      case "red_star": return isLocked ? "/achievements/StarRedlocked 1.png" : "/achievements/StarRedAward 1.png";
      case "yellow_star": return isLocked ? "/achievements/StarYellowlocked 1.png" : "/achievements/StarYellowAward 1.png";
      
      case "light_green": return isLocked ? "/achievements/LockedGreen 1.png" : "/achievements/minigreenplain 1.png";
      case "red": return isLocked ? "/achievements/LockedRed 1.png" : "/achievements/Redstar 1.png";
      
      case "red_plain": return isLocked ? "/achievements/LockedRed 1.png" : "/achievements/RedPlain 1.png";
      case "yellow": return isLocked ? "/achievements/LockedYellow 1.png" : "/achievements/YellowStar 1.png";
      case "green": return isLocked ? "/achievements/LockedGreen 1.png" : "/achievements/GreenStar 1.png";
      
      case "green_lock": return isLocked ? "/achievements/LockedGreen 1.png" : "/achievements/GreenStar 1.png";
      case "yellow_lock": return isLocked ? "/achievements/LockedYellow 1.png" : "/achievements/YellowStar 1.png";
      case "red_lock": return isLocked ? "/achievements/LockedRed 1.png" : "/achievements/Redstar 1.png";
      
      default: return isLocked ? "/achievements/LockedGreen 1.png" : "/achievements/GreenStar 1.png";
    }
  };

  const getSidePosition = (side?: string) => {
    switch (side) {
      case "left": return "left-[20%]";
      case "right": return "left-[80%]";
      case "center":
      default: return "left-[50%]";
    }
  };

  return (
    <div className="relative w-full min-h-[800px] bg-gradient-to-b from-[#FFFDF9] via-[#FFFFFF] to-[#F5E6CF] rounded-3xl overflow-hidden shadow-lg border-4 border-white/80 p-4">
      {/* Vertical Path Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-200 via-yellow-200 to-green-200 opacity-30 -translate-x-1/2" />
      
      {/* Decorations */}
      {MOBILE_DECORATIONS.map((dec, i) => (
        <div 
          key={i} 
          className={`absolute z-10 pointer-events-none ${getSidePosition(dec.side)}`}
          style={{ top: `${dec.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <Image src={dec.src} alt="" width={dec.w} height={dec.h} className="drop-shadow-md opacity-80" />
        </div>
      ))}

      {/* Connection Dots */}
      {MOBILE_PATH.map((node, i) => {
        if (i === MOBILE_PATH.length - 1) return null; // No dot after last node
        const nextNode = MOBILE_PATH[i + 1];
        const midY = (node.y + nextNode.y) / 2;
        
        return (
          <div
            key={`dot-${i}`}
            className="absolute w-2.5 h-2.5 rounded-full bg-yellow-300 border border-yellow-400 shadow-sm opacity-70 left-1/2 -translate-x-1/2"
            style={{ top: `${midY}%` }}
          />
        );
      })}

      {/* Nodes */}
      {MOBILE_PATH.map((node, index) => {
        const achievement = achievements[index] || null;
        const isEarned = achievement?.status === "earned";
        const assetUrl = getAssetForNode(node, achievement);
        
        const sizeClasses = {
          small: "w-12 h-12",
          medium: "w-16 h-16",
          large: "w-20 h-20",
          xl: "w-28 h-28",
        }[node.size];

        return (
          <div
            key={index}
            className={`absolute z-20 ${getSidePosition(node.side)}`}
            style={{ top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className={`relative flex items-center justify-center ${sizeClasses} transition-transform duration-300 active:scale-95`}>
              {/* Star Glow */}
              {node.variant?.includes('star') && (
                <div className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full animate-pulse" />
              )}
            
              <div className="relative w-full h-full flex items-center justify-center">
                <Image 
                  src={assetUrl} 
                  alt="" 
                  fill 
                  style={{ objectFit: "contain" }} 
                  className={`drop-shadow-md ${isEarned ? "" : "opacity-80 grayscale-[0.3]"}`}
                />
              </div>
              
              {/* Earned Check */}
              {isEarned && !node.variant?.includes('star') && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-green-50">
                  <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>

            {/* Achievement Name (Mobile) */}
            {achievement && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-center">
                <p className="text-[9px] font-bold text-gray-700 whitespace-nowrap max-w-[80px] truncate">
                  {achievement.name}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
