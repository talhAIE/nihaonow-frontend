"use client";

import React from "react";
import Image from "next/image";
import { Lock, Star } from "lucide-react";

interface Topic {
  id: number;
  title: string;
  subtitle: string;
  status: "active" | "locked";
  percentage?: number;
}

interface TopicMapProps {
  topics: Topic[];
  onTopicClick: (topic: Topic) => void;
}

export default function TopicMap({ topics, onTopicClick }: TopicMapProps) {
  return (
    <div className="relative min-h-screen bg-[#FFFFFF] pb-20">


      {/* Decorative Illustrations Placeholder */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 opacity-20 transform -rotate-12">
           <Image src="/images/Road Vector - 2.png" alt="" width={100} height={100} />
        </div>
        <div className="absolute bottom-40 right-10 opacity-20 transform rotate-12">
           <Image src="/images/Road Vector -1.png" alt="" width={100} height={100} />
        </div>
      </div>

      {/* The Winding Path */}
      <div className="max-w-md mx-auto relative pt-12 px-8 flex flex-col gap-16">
        {topics.map((topic, index) => {
          // Staggering logic for winding effect
          const isEven = index % 2 === 0;
          const alignment = index % 4 === 0 ? "self-center" : 
                            index % 4 === 1 ? "self-end" : 
                            index % 4 === 2 ? "self-center" : "self-start";

          return (
            <div 
              key={topic.id} 
              className={`relative flex flex-col items-center gap-2 ${alignment}`}
            >
              {/* Connection Path Line (Simplified) */}
              {index < topics.length - 1 && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-16 border-l-2 border-dashed border-gray-300 -z-10"
                />
              )}

              {/* Topic Node */}
              <button
                onClick={() => onTopicClick(topic)}
                disabled={topic.status === "locked"}
                className={`relative group transition-transform hover:scale-110 active:scale-95 ${
                  topic.status === "locked" ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {/* Circle Container */}
                <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center shadow-xl overflow-hidden relative ${
                  topic.status === "active" 
                    ? "bg-white border-[#35AB4E]" 
                    : "bg-gray-200 border-gray-300"
                }`}>
                  {/* Topic Illustration Placeholder */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    topic.status === "active" ? "bg-green-50" : "bg-gray-100"
                  }`}>
                    {topic.status === "locked" ? (
                      <Lock className="w-8 h-8 text-gray-400" />
                    ) : (
                       <Image 
                         src={`/images/shiekh.png`} // Fallback to a known image
                         alt=""
                         width={60}
                         height={60}
                         className={topic.status === "active" ? "" : "grayscale"}
                       />
                    )}
                  </div>

                  {/* Stars / Status */}
                  {topic.status === "active" && (
                    <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-0.5 pb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-100 fill-yellow-100" />
                    </div>
                  )}
                </div>
              </button>

              {/* Label */}
              <div className="text-center">
                <p className={`font-black text-sm ${topic.status === "active" ? "text-gray-900" : "text-gray-400"}`}>
                  {topic.title}
                </p>
                <p className={`text-xs ${topic.status === "active" ? "text-gray-500" : "text-gray-300"}`}>
                  {topic.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
