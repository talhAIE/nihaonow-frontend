"use client";

import ChineseNavbar from "@/components/landing-page/ChineseNavbar";
import ChineseHeroSection from "@/components/landing-page/HeroSection";
import ChineseFeatures from "@/components/landing-page/ChineseFeatures";
import ChineseSafetySection from "@/components/landing-page/ChineseSafetySection";
import ChinesePricingSection from "@/components/landing-page/ChinesePricingSection";
import { LanguageProvider, useLanguage } from "@/components/language-provider";
import { ReactLenis } from "@/components/lenis";
import ChineseContactUsCard from "@/components/landing-page/ChineseContactUsCard";

export default function ChineseMain() {
  return (
    <LanguageProvider defaultLanguage="en">
      <ChinesePublicLanding />
    </LanguageProvider>
  );
}

function ChinesePublicLanding() {
  const { language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        smoothWheel: true,
        duration: 1.2,
        wheelMultiplier: 1.2,
        touchMultiplier: 1.2,
        syncTouch: true,
      }}
    >
      <div className={`min-h-screen bg-white ${language === "ar" ? 'font-almarai' : 'font-nunito'}`} dir={dir}>
        <ChineseNavbar />
        <ChineseHeroSection />
        <ChineseFeatures />
        <ChineseSafetySection />
        <ChinesePricingSection />
        <ChineseContactUsCard />
      </div>
    </ReactLenis>
  );
}