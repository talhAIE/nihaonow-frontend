"use client";

import React from "react";
import Image from "next/image";
import { Download, Loader2, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateScrollProps {
  id: number;
  name: string;
  description: string;
  status: "earned" | "locked";
  awardedAt?: string;
  onDownload: () => void;
  isDownloading: boolean;
}

export default function CertificateScroll({
  id,
  name,
  description,
  status,
  awardedAt,
  onDownload,
  isDownloading,
}: CertificateScrollProps) {
  const isLocked = status === "locked";

  return (
    <div className={`relative group transition-all duration-500 ${isLocked ? "opacity-90" : "hover:scale-[1.02]"}`}>
      {/* Scroll Background */}
      <div className="relative aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden rounded-[32px]">
        <Image
          src={isLocked ? "/images/Scrollclosed 1.png" : "/images/scrollopened.png"}
          alt="Certificate Scroll"
          fill
          style={{ objectFit: "contain" }}
          className="transition-transform duration-700"
        />

        {/* Text Overlay for opened scroll */}
        {!isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pt-12 text-center">
            <h5 className="text-[8px] sm:text-[10px] font-black text-amber-800/60 uppercase tracking-widest mb-1">الشهادة الرسمية</h5>
            <h4 className="text-sm sm:text-lg lg:text-xl font-black text-gray-900 mb-1 sm:mb-2 font-almarai-extrabold">{name}</h4>
            <div className="w-10 h-0.5 bg-amber-200 mb-2 sm:mb-4" />
            <p className="text-[9px] sm:text-[11px] text-gray-600 leading-relaxed font-bold px-2 sm:px-4">
              {description}
            </p>
            {awardedAt && (
              <p className="mt-2 sm:mt-4 text-[8px] sm:text-[10px] font-bold text-gray-400">
                صدرت في: {new Date(awardedAt).toLocaleDateString('ar-EG')}
              </p>
            )}

            <CheckCircle2 className="mt-4 sm:mt-6 w-6 h-6 sm:w-8 sm:h-8 text-green-500/30" />
          </div>
        )}

      </div>

      <div className="mt-8 px-4">
        <div
          onClick={(!isLocked && !isDownloading) ? onDownload : undefined}
          className={`bg-white border border-[#E5E5E5] rounded-[20px] px-5 py-3.5 flex items-center justify-between shadow-sm w-full min-h-[64px] transition-all ${isLocked ? "opacity-75 cursor-not-allowed" : isDownloading ? "opacity-50 cursor-wait" : "hover:border-slate-300 cursor-pointer active:scale-[0.99]"}`}
        >
          {/* Left: Download Icon (Only for Earned) */}
          <div className="flex items-center">
            {!isLocked && (
              <div className="p-2.5 bg-slate-50 rounded-xl transition-colors text-slate-600">
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </div>
            )}
          </div>

          {/* Right: Name + Icon */}
          <div className="flex items-center gap-2.5">
            <h3 className={`text-base sm:text-lg font-almarai-bold ${isLocked ? "text-gray-400" : "text-[#4B4B4B]"}`}>
              {name}
            </h3>

            {/* Category Icons based on name/status */}
            {!isLocked ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" />
              </svg>
            ) : name.includes("الخطوات الأولى") ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
