import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import flagUK from "@/assets/svgs/flag-united-kingdom.svg";
import flagChina from "@/assets/svgs/flag-china.svg";
import { useLanguage } from "@/components/language-provider";

export default function ChineseLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"english" | "chinese">("chinese");

  useEffect(() => {
    if (pathname === "/" || pathname === "/") {
      setActiveTab("chinese");
    } else {
      setActiveTab("english");
    }
  }, [pathname]);

  const handleTabClick = (tab: "english" | "chinese") => {
    if (tab === "english") {
      router.push("/english");
    } else {
      window.location.href = "https://zayd.waaha.ai/";
    }
  };

  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full bg-[#D8EFE0] p-1.5 gap-2 border border-[#C1E2CE]">
        {/* Chinese Tab */}
        <motion.button
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-base font-bold transition-all duration-300 ${
            activeTab === "chinese"
              ? "bg-[#35AB4E] text-white shadow-[#20672F] shadow-[0px_3px_0px]"
              : "text-[#4B5563] hover:text-[#35AB4E] hover:brightness-110"
          }`}
          onClick={() => handleTabClick("chinese")}
          whileTap={{ scale: 0.98 }}
        >
          <img src={flagChina.src} alt="China Flag" className="w-6 h-6 rounded-full object-cover" />
          <span>{isAr ? "الصينية" : "Chinese"}</span>
        </motion.button>

        {/* English Tab */}
        <motion.button
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-base font-bold transition-all duration-300 ${
            activeTab === "english"
              ? "bg-[#35AB4E] text-white shadow-[#20672F] shadow-[0px_3px_0px]"
              : "text-[#4B5563] hover:text-[#35AB4E] hover:brightness-110"
          }`}
          onClick={() => handleTabClick("english")}
          whileTap={{ scale: 0.98 }}
        >
          <img src={flagUK.src} alt="UK Flag" className="w-6 h-6 rounded-full object-cover" />
          <span>{isAr ? "الإنجليزية" : "English"}</span>
        </motion.button>
      </div>
    </div>
  );
}
