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

// Exact path from Rewards.png - Scaled down to fit viewport properly
const PATH_POINTS: MapNode[] = [
  // --- Top Section: Left to Right ---
  // 1. Red Start (Top Left)
  { x: 15, y: 15, type: "node", variant: "red", size: "medium" },
  
  { x: 22, y: 17, type: "dot", dotColor: "red" },
  { x: 28, y: 18, type: "dot", dotColor: "red" },
  
  // 2. Yellow Star
  { x: 35, y: 19, type: "node", variant: "yellow", size: "medium" },
  
  { x: 42, y: 20, type: "dot", dotColor: "yellow" },
  { x: 48, y: 21, type: "dot", dotColor: "yellow" },
  
  // 3. Green Star
  { x: 55, y: 20, type: "node", variant: "green", size: "medium" },
  
  { x: 62, y: 21, type: "dot", dotColor: "green" },
  
  // 4. Book (Green)
  { x: 70, y: 23, type: "node", variant: "book", size: "medium" },
  
  { x: 72, y: 30, type: "dot", dotColor: "green" },
  
  // 5. Read (Big Green) - Below Book
  { x: 70, y: 37, type: "node", variant: "read", size: "large" },
  
  // Path winds left from Read
  { x: 64, y: 42, type: "dot", dotColor: "green" },
  { x: 58, y: 46, type: "dot", dotColor: "green" },
  
  // 6. Light Green Lock
  { x: 52, y: 50, type: "node", variant: "light_green", size: "medium" },
  
  { x: 46, y: 48, type: "dot", dotColor: "green" },
  
  // 7. Green Lock
  { x: 40, y: 46, type: "node", variant: "green_lock", size: "medium" },
  
  { x: 34, y: 48, type: "dot", dotColor: "green" },
  
  // 8. Speak (Yellow - Yatakallam)
  { x: 28, y: 50, type: "node", variant: "speak", size: "large" },
  
  { x: 28, y: 57, type: "dot", dotColor: "yellow" },
  { x: 28, y: 64, type: "dot", dotColor: "yellow" },

  // 9. Big Gold Star (Center)
  { x: 28, y: 72, type: "node", variant: "star_gold", size: "xl" },

  // Left side path branching from main path
  // 10. Red Temple Node (Left side)
  { x: 15, y: 38, type: "node", variant: "red_lock", size: "medium" },
  
  { x: 17, y: 44, type: "dot", dotColor: "red" },
  
  // 11. Red Lock
  { x: 19, y: 50, type: "node", variant: "red_plain", size: "medium" },

  // 12. Pink Star (Far Left Bottom)
  { x: 10, y: 58, type: "node", variant: "pink_star", size: "large" },
  
  { x: 15, y: 65, type: "dot", dotColor: "red" },
  
  // 13. Pink Star (Moving Right)
  { x: 22, y: 72, type: "node", variant: "pink_star", size: "large" },
  
  { x: 28, y: 78, type: "dot", dotColor: "red" },

  // 14. Pink Star (Center Bottom)
  { x: 35, y: 82, type: "node", variant: "pink_star", size: "large" },
  
  { x: 42, y: 80, type: "dot", dotColor: "yellow" },

  // 15. Yellow Star (Bottom Right)
  { x: 48, y: 78, type: "node", variant: "yellow_star", size: "medium" },
  
  { x: 54, y: 76, type: "dot", dotColor: "green" },

  // 16. Green Lock (Bottom Right)
  { x: 60, y: 72, type: "node", variant: "green_lock", size: "medium" },
  
  { x: 66, y: 68, type: "dot", dotColor: "green" },

  // 17. Green Lock (Upper Right)
  { x: 72, y: 64, type: "node", variant: "green_lock", size: "medium" },
  
  { x: 78, y: 60, type: "dot", dotColor: "green" },
  
  // 18. Additional decoration star (Far Right)
  { x: 84, y: 56, type: "node", variant: "pink_star", size: "large" },
];

// Decorations - Scaled down to fit properly
const DECORATIONS = [
  // Flags at top center
  { x: 35, y: 8, src: "/achievements/Flagbase 1.png", w: 35, h: 12 },
  { x: 35, y: 5, src: "/achievements/Flag 1.png", w: 40, h: 25 },
  
  // Buildings and structures - scaled down
  { x: 8, y: 25, src: "/achievements/buildingfour 1.png", w: 40, h: 40 }, // Temple Top Left
  { x: 18, y: 32, src: "/achievements/buildingthree 1.png", w: 45, h: 35 }, // Temple Red
  { x: 45, y: 28, src: "/achievements/Building1 1.png", w: 35, h: 35 }, // Tree Cluster Center
  { x: 75, y: 30, src: "/achievements/panda1 1.png", w: 25, h: 25 }, // Panda Right
  { x: 22, y: 68, src: "/achievements/tiger 1.png", w: 35, h: 35 }, // Tiger Bottom
  { x: 72, y: 45, src: "/achievements/monkey1 1.png", w: 20, h: 20 }, // Monkey Right
  { x: 5, y: 65, src: "/achievements/Building2 1.png", w: 30, h: 30 }, // Trees Far Left
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
    <div className="relative w-full aspect-[4/3] max-h-[600px] bg-[#FEF9EC] rounded-[40px] overflow-hidden shadow-xl border-[8px] border-white/80">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FFFFFF] to-[#F5E6CF] opacity-80" />
      
      {/* Decorations */}
      {DECORATIONS.map((dec, i) => (
        <div key={i} className="absolute z-10 pointer-events-none transition-transform hover:scale-105 duration-700"
             style={{ left: `${dec.x}%`, top: `${dec.y}%`, transform: "translate(-50%, -50%)" }}>
          <Image 
            src={dec.src} 
            alt="" 
            width={dec.w} 
            height={dec.h} 
            className="drop-shadow-lg" 
            style={{ width: 'auto', height: 'auto' }}
          />
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
             className={`absolute rounded-full w-2.5 h-2.5 border-2 shadow-sm opacity-90 ${dotColorClass}`}
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
          small: "w-10 h-10",
          medium: "w-12 h-12 md:w-14 md:h-14",
          large: "w-16 h-16 md:w-18 md:h-18",
          xl: "w-20 h-20 md:w-24 md:h-24",
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
