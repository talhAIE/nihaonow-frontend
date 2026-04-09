"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

type AuthLanguageToggleProps = {
  className?: string;
};

export default function AuthLanguageToggle({ className }: AuthLanguageToggleProps) {
  const { dir, setDir } = useAppContext();
  const isAr = dir === "rtl";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = isAr ? "ar" : "en";
  }, [isAr]);

  return (
    <button
      type="button"
      onClick={() => setDir(isAr ? "ltr" : "rtl")}
      className={`text-sm text-gray-700 hover:text-[#35AB4E] transition-colors px-2 py-1 ${className ?? ""}`}
      aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
    >
      العربية | English
    </button>
  );
}
