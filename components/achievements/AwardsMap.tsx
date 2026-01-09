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

interface AwardsMapProps {
  achievements: AchievementNode[];
}

// Node definition for exact visual replication
interface MapNode {
  x: number;
  y: number;
  type: "node" | "dot";
  variant?: "red" | "yellow" | "green" | "light_green" | "book" | "read" | "speak" | "star_gold" | "red_plain" | "pink_star" | "red_star" | "yellow_star" | "green_lock" | "yellow_lock" | "red_lock";
  dotColor?: "red" | "yellow" | "green" | "light_green";
  size?: "small" | "medium" | "large" | "xl";
}

// Exact path from Rewards.png - Refined coordinates to fix overlap and flow
const PATH_POINTS: MapNode[] = [
  // --- ROW 1: Top Left to Right ---
  // 1. Red Start (Hand)
  { x: 30, y: 30, type: "node", variant: "red", size: "medium" },
  
  { x: 36, y: 33, type: "dot", dotColor: "red" },
  { x: 40, y: 35, type: "dot", dotColor: "red" },
  
  // 2. Yellow
  { x: 46, y: 36, type: "node", variant: "yellow", size: "medium" },
  
  { x: 52, y: 38, type: "dot", dotColor: "yellow" },
  { x: 56, y: 35, type: "dot", dotColor: "yellow" },
  
  // 3. Green
  { x: 62, y: 30, type: "node", variant: "green", size: "medium" },
  
  { x: 68, y: 32, type: "dot", dotColor: "green" },
  
  // 4. Book (Green)
  { x: 74, y: 35, type: "node", variant: "book", size: "medium" },
  
  { x: 76, y: 41, type: "dot", dotColor: "green" },
  
  // 5. Read (Big Green) - Just below Book
  { x: 76, y: 48, type: "node", variant: "read", size: "large" },
  
  // Winding Left from Read
  { x: 72, y: 55, type: "dot", dotColor: "green" },
  { x: 68, y: 58, type: "dot", dotColor: "green" },
  
  // 6. Light Green Lock
  { x: 62, y: 60, type: "node", variant: "light_green", size: "medium" },
  
  { x: 58, y: 56, type: "dot", dotColor: "green" },
  
  // 7. Green Lock (Left of 6)
  { x: 53, y: 53, type: "node", variant: "green_lock", size: "medium" },
  
  { x: 48, y: 56, type: "dot", dotColor: "green" },
  
  // 8. Speak (Yellow - Yatakallam) -> Positioned above/left of center star
  { x: 42, y: 58, type: "node", variant: "speak", size: "large" },
  
  { x: 42, y: 66, type: "dot", dotColor: "yellow" },

  // 9. Big Gold Star (Center)
  { x: 42, y: 74, type: "node", variant: "star_gold", size: "xl" },

  // Path continues LEFT from Speak (or star?)
  // Actually looks like path splits or comes from left to Speak?
  // Let's assume flow: 
  // ... Speak -> Star (Goal)
  
  // But there's a left side path too:
  // Red Temple -> Red Lock -> Pink Star -> Pink Star
  
  // Let's position the Left Side path explicitly:
  
  // 10. Red Temple Node (Far Left Middle)
  { x: 26, y: 52, type: "node", variant: "red_lock", size: "medium" },
  
  { x: 28, y: 60, type: "dot", dotColor: "red" },
  
  // 11. Red Lock (Below 10)
  { x: 30, y: 66, type: "node", variant: "red_plain", size: "medium" },

  // 12. Pink Star (Far Left Bottom)
  { x: 20, y: 74, type: "node", variant: "pink_star", size: "large" },
  
  { x: 25, y: 80, type: "dot", dotColor: "red" },
  
  // 13. Pink Star (Moving Right)
  { x: 32, y: 84, type: "node", variant: "pink_star", size: "large" },
  
  { x: 38, y: 86, type: "dot", dotColor: "red" },

  // 14. Pink Star (Center Bottom Left)
  { x: 46, y: 88, type: "node", variant: "pink_star", size: "large" },
  
  { x: 54, y: 86, type: "dot", dotColor: "yellow" },

  // 15. Yellow Star (Center Bottom Right)
  { x: 62, y: 84, type: "node", variant: "yellow_star", size: "medium" },
  
  { x: 68, y: 80, type: "dot", dotColor: "green" },

  // 16. Green Lock (Bottom Right)
  { x: 74, y: 76, type: "node", variant: "green_lock", size: "medium" },
  
  { x: 74, y: 68, type: "dot", dotColor: "green" },

  // 17. Green Lock (Above 16)
  { x: 70, y: 62, type: "node", variant: "green_lock", size: "medium" },
  
  // 18. Red Star (Far Left Top path?) 
  { x: 16, y: 64, type: "node", variant: "pink_star", size: "large" }, // Additional Star left
];

// Decorations - Adjusted to not overlap nodes
const DECORATIONS = [
  { x: 42, y: 22, src: "/achievements/Flagbase 1.png", w: 80, h: 30 },
  { x: 42, y: 18, src: "/achievements/Flag 1.png", w: 90, h: 50 },
  { x: 15, y: 45, src: "/achievements/buildingfour 1.png", w: 90, h: 90 }, // Temple Top Left
  { x: 35, y: 50, src: "/achievements/buildingthree 1.png", w: 100, h: 80 }, // Temple Red (Near Node 10)
  { x: 58, y: 48, src: "/achievements/Building1 1.png", w: 80, h: 80 }, // Tree Cluster Center
  { x: 65, y: 22, src: "/achievements/panda1 1.png", w: 70, h: 70 }, // Panda
  { x: 32, y: 72, src: "/achievements/tiger 1.png", w: 80, h: 80 }, // Tiger (Near Node 13)
  { x: 75, y: 60, src: "/achievements/monkey1 1.png", w: 60, h: 60 }, // Monkey
  { x: 10, y: 80, src: "/achievements/Building2 1.png", w: 70, h: 70 }, // Trees Left
];

export default function AwardsMap({ achievements }: AwardsMapProps) {
  const nodes = PATH_POINTS.filter(p => p.type === "node");

  const getAssetForNode = (node: MapNode, achievement: AchievementNode | null) => {
    const isLocked = !achievement || achievement.status === "locked";
    
    switch (node.variant) {
      case "book": return "/achievements/GreenBook 1.png";
      case "read": return "/achievements/ReadingGreenArabic 1.png";
      case "speak": return "/achievements/SpeakYellow 1.png";
      case "star_gold": return "/achievements/StarYellowAward 1.png";
      
      // FIXED: Use correct locked/unlocked star assets
      case "pink_star": return isLocked ? "/achievements/StarRedlocked 1.png" : "/achievements/StarRedAward 1.png";
      case "red_star": return isLocked ? "/achievements/StarRedlocked 1.png" : "/achievements/StarRedAward 1.png";
      case "yellow_star": return isLocked ? "/achievements/StarYellowlocked 1.png" : "/achievements/StarYellowAward 1.png";
      
      case "light_green": return isLocked ? "/achievements/LockedGreen 1.png" : "/achievements/minigreenplain 1.png";
      // Start is explicitly RedStar or Start asset
      case "red": return isLocked ? "/achievements/LockedRed 1.png" : "/achievements/Redstar 1.png"; // Start node
      
      case "red_plain": return isLocked ? "/achievements/LockedRed 1.png" : "/achievements/RedPlain 1.png";
      case "yellow": return isLocked ? "/achievements/LockedYellow 1.png" : "/achievements/YellowStar 1.png";
      case "green": return isLocked ? "/achievements/LockedGreen 1.png" : "/achievements/GreenStar 1.png";
      
      case "green_lock": return isLocked ? "/achievements/LockedGreen 1.png" : "/achievements/GreenStar 1.png";
      case "yellow_lock": return isLocked ? "/achievements/LockedYellow 1.png" : "/achievements/YellowStar 1.png";
      case "red_lock": return isLocked ? "/achievements/LockedRed 1.png" : "/achievements/Redstar 1.png";
      
      default: return isLocked ? "/achievements/LockedGreen 1.png" : "/achievements/GreenStar 1.png";
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] max-h-[1000px] bg-[#FEF9EC] rounded-[60px] overflow-hidden shadow-2xl border-[12px] border-white/80">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FFFFFF] to-[#F5E6CF] opacity-80" />
      
      {/* Decorations */}
      {DECORATIONS.map((dec, i) => (
        <div key={i} className="absolute z-10 pointer-events-none transition-transform hover:scale-105 duration-700"
             style={{ left: `${dec.x}%`, top: `${dec.y}%`, transform: "translate(-50%, -50%)" }}>
          <Image src={dec.src} alt="" width={dec.w} height={dec.h} className="drop-shadow-lg" />
        </div>
      ))}

      {/* Connection Dots (Stepping Stones) */}
      {PATH_POINTS.filter(p => p.type === "dot").map((p, i) => {
        const dotColorClass = {
          red: "bg-[#F3A5A5] border-[#E57373]",
          yellow: "bg-[#FDE68A] border-[#FCD34D]",
          green: "bg-[#A7F3D0] border-[#6EE7B7]",
          light_green: "bg-[#D1FAE5] border-[#A7F3D0]"
        }[p.dotColor || "green"];

        return (
           <div 
             key={`dot-${i}`}
             className={`absolute rounded-full w-3.5 h-3.5 border-2 shadow-sm opacity-90 ${dotColorClass}`}
             style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
           />
        );
      })}

      {/* Nodes */}
      {nodes.map((point, index) => {
        const achievement = achievements[index] || null;
        const isEarned = achievement?.status === "earned";
        const assetUrl = getAssetForNode(point, achievement);
        
        const sizeClasses = {
          small: "w-16 h-16",
          medium: "w-20 h-20 md:w-24 md:h-24",
          large: "w-28 h-28 md:w-32 md:h-32",
          xl: "w-36 h-36 md:w-44 md:h-44",
        }[point.size || "medium"];

        return (
          <div
            key={index}
            className="absolute z-20 group"
            style={{ left: `${point.x}%`, top: `${point.y}%`, transform: "translate(-50%, -50%)" }}
          >
            {/* Tooltip */}
            {achievement && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white/95 backdrop-blur-md rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl border border-gray-100 text-center z-50">
                 <p className="text-xs font-black text-gray-800 mb-1">{achievement.name}</p>
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isEarned ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                   {isEarned ? "مكتمل" : "مغلق"}
                 </span>
                 <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/95" />
              </div>
            )}

            <div className={`relative flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:-translate-y-2 ${sizeClasses} ${isEarned ? "cursor-pointer" : "cursor-default"}`}>
              {/* Star Glow */}
              {(point.variant?.includes('star')) && (
                 <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full scale-75 animate-pulse" />
              )}
            
              <div className={`relative w-full h-full flex items-center justify-center`}>
                <Image 
                  src={assetUrl} 
                  alt="" 
                  fill 
                  style={{ objectFit: "contain" }} 
                  className={`drop-shadow-lg ${isEarned || point.variant === 'book' || point.variant === 'read' || point.variant === 'speak' ? "" : "opacity-90 grayscale-[0.2]"}`}
                />
              </div>
              
              {/* Earned Check */}
              {isEarned && !point.variant?.includes('star') && (
                 <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-green-50">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                 </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
