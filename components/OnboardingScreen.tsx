"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigation } from '@/lib/navigation';
import { useAppContext } from "@/context/AppContext";
import AuthLanguageToggle from "@/components/auth/AuthLanguageToggle";

interface OnboardingScreenProps {
  onComplete: (userName: string) => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [userName, setUserName] = useState("");
  const { goToStudentUnits, goToComingSoon } = useNavigation();
  const { dir } = useAppContext();
  const isAr = dir === "rtl";

  const copy = {
    ar: {
      greetingTitle: "مرحباً",
      greetingSubtitle: "صباح الخير",
      nameLabel: "اسمك",
      namePlaceholder: "أدخل اسمك",
      continue: "استمرار",
      comingSoon: "قريباً",
      brandLinePrimary: "الآن",
      brandLineSecondary: "ني هاو",
      brandLineAltPrimary: "الآن",
      brandLineAltSecondary: "نيهاو",
    },
    en: {
      greetingTitle: "Welcome",
      greetingSubtitle: "Good morning",
      nameLabel: "Your name",
      namePlaceholder: "Enter your name",
      continue: "Continue",
      comingSoon: "Coming Soon",
      brandLinePrimary: "Now",
      brandLineSecondary: "Ni Hao",
      brandLineAltPrimary: "Now",
      brandLineAltSecondary: "Ni Hao",
    },
  } as const;

  const t = isAr ? copy.ar : copy.en;

  const handleContinue = () => {
    if (userName.trim()) {
      onComplete(userName.trim());
      goToStudentUnits();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove any numeric characters and special characters, keep only letters and spaces
    const filteredValue = value.replace(
      /[^a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g,
      ""
    );
    setUserName(filteredValue);
  };



  return (
    <div className={`relative h-screen bg-white flex flex-col overflow-hidden ${isAr ? "font-almarai" : "font-nunito"}`} dir={dir} lang={isAr ? "ar" : "en"}>
      <div className={`absolute top-4 ${isAr ? "left-4" : "right-4"} z-20`}>
        <AuthLanguageToggle />
      </div>
      {/* Mobile Layout - Stacked */}
      <div className="flex-1 flex flex-col md:hidden min-h-0">
        {/* White Upper Section */}
        <div className="h-[60vh] bg-white flex flex-col items-center justify-center px-4 py-3 sm:py-6 min-h-0 mt-2">
          <div className="text-center">
            <div className="flex gap-2 sm:gap-3 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-2 sm:mb-3 justify-center items-center">
              <span className="text-yellow-500">你</span>
              <span className="text-red-500">好</span>
            </div>
            <div className="flex gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold justify-center items-center">
              <span className="text-brand ml-1 sm:ml-2">{t.brandLinePrimary}</span>
              <span className="text-yellow-500">{t.brandLineSecondary}</span>
            </div>
          </div>

          {/* Character Illustration - Responsive sizing */}
          <div className="w-64 h-80 sm:w-80 sm:h-[28rem] md:w-[28rem] md:h-[32rem] lg:w-[32rem] lg:h-[36rem] flex items-end justify-center flex-shrink-0">
            <Image
              src="/images/shiekh.png"
              alt="Sheikh Character"
              width={256}
              height={320}
              className={`object-contain w-full h-full ${isAr ? "scale-x-[-1]" : ""}`}
              priority
            />
          </div>
        </div>

        {/* Brand Green Lower Section */}
        <div className="h-[40vh] bg-brand rounded-t-3xl px-4 py-3 sm:py-4 md:py-6 flex flex-col justify-center min-h-0">
          {/* Arabic Greetings */}
          <div className="text-center mb-3 sm:mb-4 md:mb-6">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
              {t.greetingTitle}
            </div>
            <div className="text-base sm:text-lg md:text-xl text-white">
              {t.greetingSubtitle}
            </div>
          </div>

          {/* Name Input Section */}
          <div className="space-y-2 sm:space-y-3 px-2 sm:px-4">
            {/* Input Field */}
            <div className="space-y-1 sm:space-y-2">
              {/* Label above input */}
              <label className={`block text-lg sm:text-xl md:text-2xl text-white font-medium ${isAr ? "text-right" : "text-left"}`}>
                {t.nameLabel}
              </label>
              <Input
                type="text"
                value={userName}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={t.namePlaceholder}
                className={`w-full h-10 sm:h-12 md:h-14 px-4 sm:px-6 bg-white text-black placeholder-gray-500 rounded-full border-0 ${isAr ? "text-right" : "text-left"} shadow-lg focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200 text-sm sm:text-base`}
                dir={dir}
                lang={isAr ? "ar" : "en"}
                autoComplete="name"
              />
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                disabled={!userName.trim()}
                className="py-1.5 sm:py-2 px-3 sm:px-4 mt-1 sm:mt-2 bg-white hover:bg-gray-50 text-black font-medium rounded-full border-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 text-sm sm:text-base"
              >
                {t.continue}
              </Button>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={goToComingSoon}
                variant="outline"
                className="py-2 px-6 bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand font-medium rounded-full transition-all duration-200 text-base"
              >
                {t.comingSoon}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Two Columns */}
      <div className={`hidden md:flex h-full ${isAr ? "flex-row-reverse" : "flex-row"}`}>
        {/* Left Column - Green Background */}
        <div className="flex-1 bg-brand flex flex-col items-center justify-center px-8 py-12">
          {/* Arabic Greetings */}
          <div className="text-center mb-12">
            <div className="text-4xl font-bold text-white mb-3">{t.greetingTitle}</div>
          </div>

          {/* Name Input Section */}
          <div className="w-full max-w-md space-y-6">
            {/* Input Field */}
            <div className="space-y-3">
              {/* Label above input */}
              <label className={`block text-2xl text-white font-medium ${isAr ? "text-right" : "text-left"}`}>
                {t.nameLabel}
              </label>
              <Input
                type="text"
                value={userName}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={t.namePlaceholder}
                className={`w-full h-16 px-6 bg-white text-black placeholder-gray-500 rounded-full border-0 ${isAr ? "text-right" : "text-left"} shadow-lg focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200 text-lg`}
                dir={dir}
                lang={isAr ? "ar" : "en"}
                autoComplete="name"
              />
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                disabled={!userName.trim()}
                className="py-3 px-8 bg-white hover:bg-gray-50 text-black font-medium rounded-full border-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 text-lg"
              >
                {t.continue}
              </Button>
            </div>

            {/* Coming Soon Button */}
            <div className="flex justify-center mt-4">
              <Button
                onClick={goToComingSoon}
                variant="outline"
                className="py-2 px-6 bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand font-medium rounded-full transition-all duration-200 text-base"
              >
                {t.comingSoon}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Off-white Background */}
        <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center px-8 py-12 relative">
          {/* Decorative shapes in bottom right */}
          <div className={`absolute bottom-8 ${isAr ? "left-8" : "right-8"} opacity-30`}>
            <div className="w-32 h-32 rounded-full bg-green-200 absolute -top-8 -left-8"></div>
            <div className="w-24 h-24 rounded-full bg-yellow-200 absolute top-4 left-4"></div>
            <div className="w-16 h-16 rounded-full bg-gray-300 absolute top-8 left-8"></div>
          </div>

          {/* Chinese Characters */}
          <div className="text-center mb-12">
            <div className="flex gap-3 text-8xl font-bold mb-4 justify-center items-center">
              <span className="text-yellow-500">你</span>
              <span className="text-red-500">好</span>
            </div>
            <div>
              <span className="text-2xl text-yellow-500 font-medium">
                {t.brandLineAltSecondary}{" "}
              </span>
              <span className="text-2xl text-brand font-medium">{t.brandLineAltPrimary}</span>
            </div>
          </div>

          {/* Character Illustration */}
          <div className="w-80 h-96 flex items-end justify-center">
            <Image
              src="/images/shiekh.png"
              alt="Sheikh Character"
              width={320}
              height={384}
              className={`object-contain ${isAr ? "scale-x-[-1]" : ""}`}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
