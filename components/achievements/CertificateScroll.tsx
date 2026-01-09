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
    <div className={`relative group transition-all duration-500 ${isLocked ? "opacity-75" : "hover:scale-[1.02]"}`}>
      {/* Scroll Background */}
      <div className="relative aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden rounded-[32px] shadow-2xl">
        <Image
          src={isLocked ? "/images/ScrollClosed.png" : "/images/scrollopened.png"}
          alt="Certificate Scroll"
          fill
          style={{ objectFit: "contain" }}
          className="transition-transform duration-700 bg-[#FAF7F2] p-4"
        />

        {/* Text Overlay for opened scroll */}
        {!isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 pt-16 text-center">
            <h5 className="text-[10px] font-black text-amber-800/60 uppercase tracking-widest mb-1">الشهادة الرسمية</h5>
            <h4 className="text-xl font-black text-gray-900 mb-2 font-almarai-extrabold">{name}</h4>
            <div className="w-12 h-0.5 bg-amber-200 mb-4" />
            <p className="text-[11px] text-gray-600 leading-relaxed font-bold px-4">
              {description}
            </p>
            {awardedAt && (
              <p className="mt-4 text-[10px] font-bold text-gray-400">
                 صدرت في: {new Date(awardedAt).toLocaleDateString('ar-EG')}
              </p>
            )}
            
            <CheckCircle2 className="mt-6 w-8 h-8 text-green-500/30" />
          </div>
        )}

        {/* Lock Overlay for closed scroll */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/5">
             <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Lock className="w-8 h-8 text-gray-400" />
             </div>
          </div>
        )}
      </div>

      {/* Action Area Below Scroll */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="text-center mb-1">
           <h3 className={`text-lg font-black ${isLocked ? "text-gray-400" : "text-gray-900"}`}>{name}</h3>
           {isLocked && <p className="text-xs font-bold text-gray-400 mt-1 italic">أكمل المهام لفتح الشهادة</p>}
        </div>

        <Button
          onClick={onDownload}
          disabled={isLocked || isDownloading}
          className={`h-12 px-8 rounded-full font-black text-sm flex items-center gap-2 transition-all shadow-lg border-b-4 tracking-tight ${
            isLocked 
              ? "bg-gray-100 text-gray-300 border-none opacity-50" 
              : "bg-[#35AB4E] hover:bg-[#2f9c46] text-white border-[#298E3E] active:border-b-0 active:translate-y-1"
          }`}
        >
          {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          <span>تحميل الشهادة</span>
        </Button>
      </div>
    </div>
  );
}
