import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import flagUK from "@/assets/svgs/flag-united-kingdom.svg";
import flagChina from "@/assets/svgs/flag-china.svg";
import { useLanguage } from "@/components/language-provider";

export default function LanguageTabSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"english" | "chinese">("english");
  
  // Dynamic colors based on current page
  const isChinesePage = pathname === "/" || pathname === "/chinese";
  
  // Dynamic gradient based on page
  const activeGradient = isChinesePage 
    ? "linear-gradient(90deg, #4CAF50 0%, #35AB4E 48.56%, #4CAF50 80%)"
    : "linear-gradient(90deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)";

  useEffect(() => {
    if (pathname === "/" || pathname === "/chinese") {
      setActiveTab("chinese");
    } else {
      setActiveTab("english");
    }
  }, [pathname]);

  const handleTabClick = (tab: "english" | "chinese") => {
    if (tab === "chinese") {
      router.push("/");
    } else {
      router.push("/english");
    }
  };

  return (
    <div className="flex justify-center mt-2 sm:mt-6 mb-4 sm:mb-8">
      <div className="inline-flex rounded-full bg-[#F3F4F6] p-1 border border-gray-100 shadow-sm">
        <motion.button
          className={`flex items-center gap-1 sm:gap-3 px-3 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-300 ${
            activeTab === "english"
              ? "text-white"
              : isChinesePage ? "text-green-600 hover:brightness-110" : "text-blue-500 hover:brightness-110"
          }`}
          style={{
            background: activeTab === "english" ? activeGradient : "transparent",
            boxShadow: activeTab === "english" 
              ? isChinesePage ? "0px 3px 0px #20672F" : "0px 3px 0px #0472C6"
              : "none"
          }}
          onClick={() => handleTabClick("english")}
          whileTap={{ scale: 0.98 }}
        >
          <img src={flagUK.src} alt="UK Flag" className="w-4 h-4 sm:w-5 sm:h-5" />
          {"English"}
        </motion.button>
        <motion.button
          className={`flex items-center gap-1 sm:gap-3 px-3 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-300 ${
            activeTab === "chinese"
              ? "text-white"
              : isChinesePage ? "text-green-600 hover:brightness-110" : "text-blue-500 hover:brightness-110"
          }`}
          style={{
            background: activeTab === "chinese" ? activeGradient : "transparent",
            boxShadow: activeTab === "chinese" 
              ? isChinesePage ? "0px 3px 0px #20672F" : "0px 3px 0px #0472C6"
              : "none"
          }}
          onClick={() => handleTabClick("chinese")}
          whileTap={{ scale: 0.98 }}
        >
          <img src={flagChina.src} alt="China Flag" className="w-4 h-4 sm:w-5 sm:h-5" />
          {"Chinese"}
        </motion.button>
      </div>
    </div>
  );
}
