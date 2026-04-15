"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

type AuthLanguageToggleProps = {
  className?: string;
  activeBgClass?: string;
  activeShadowClass?: string;
};

export default function AuthLanguageToggle({ className, activeBgClass, activeShadowClass }: AuthLanguageToggleProps) {
  const { dir, setDir } = useAppContext();
  const isAr = dir === "rtl";
  const activeBg = activeBgClass ?? "bg-[#35AB4E]";
  const activeShadow = activeShadowClass ?? "shadow-[0_2px_0_0_#20672F]";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = isAr ? "ar" : "en";
  }, [isAr]);

  return (
    <button
      type="button"
      onClick={() => setDir(isAr ? "ltr" : "rtl")}
      className={`inline-flex items-center gap-1 rounded-xl border border-[#E5E5E5] bg-white p-1 shadow-sm transition-colors ${className ?? ""}`}
      aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
    >
      <span
        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
          isAr
            ? `${activeBg} text-white ${activeShadow}`
            : "bg-white text-[#4B4B4B]"
        }`}
      >
        العربية
      </span>
      <span
        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
          !isAr
            ? `${activeBg} text-white ${activeShadow}`
            : "bg-white text-[#4B4B4B]"
        }`}
      >
        English
      </span>
    </button>
  );
}
