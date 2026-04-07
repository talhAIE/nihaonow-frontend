"use client";

import Navbar from "@/components/landing-page-zayd/navbar-new";
import HeroSection from "@/components/landing-page-zayd/hero-section-new";
import FeatureSection from "@/components/landing-page-zayd/feature-section-new";
import TutorSection from "@/components/landing-page-zayd/tutor-section";
import ChallengeSection from "@/components/landing-page-zayd/challenge-section";
import { ReactLenis } from "@/components/lenis";
import { LanguageProvider, useLanguage } from "@/components/language-provider";
import ComplianceSection from "@/components/landing-page-zayd/compliance-section";
import JoinNowSection from "@/components/landing-page-zayd/join-now-section";
import Footer from "@/components/landing-page-zayd/footer-new";

export default function Main() {
  return (
    <LanguageProvider defaultLanguage="en">
      <PublicLanding />
    </LanguageProvider>
  );
}

function PublicLanding() {
  const { language } = useLanguage();
  const direction = language === "ar" ? "rtl" : "ltr";

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
      <div
        className="min-h-screen font-geist-sans overflow-clip"
        dir={direction}
        lang={language}
      >
        <Navbar />
        <HeroSection />
        <FeatureSection />
        <TutorSection />
        <ChallengeSection />
        <ComplianceSection />
        <JoinNowSection />
        <Footer />
      </div>
    </ReactLenis>
  );
}
