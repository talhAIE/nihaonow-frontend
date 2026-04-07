import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBird from "@/assets/landingpage-zayd/hero bird 1.png";
import dumbbellImg from "@/assets/landingpage-zayd/Object.png";
import LanguageTabSwitcher from "@/components/landing-page-zayd/LanguageTabSwitcher";
import NextLink from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center bg-white px-4 pt-2 sm:pt-10 pb-4 sm:pb-14"
    >
      {/* Decorative Floating Images - Collision-free fluid positioning (Desktop lg+) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {/* Left: dumbbell - Responsive positioning and sizing */}
        <motion.div
          className="absolute left-[2vw] 2xl:left-[6vw] top-[45%] lg:top-[50%] -translate-y-1/2 z-0"
          style={{ width: "clamp(140px, 18vw, 340px)" }}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        >
          <img
            src={dumbbellImg.src}
            alt="Dumbbell"
            className="w-full h-auto object-contain"
            draggable={false}
          />
        </motion.div>

        {/* Right: bird - Responsive positioning and sizing */}
        <motion.div
          className="absolute right-[2vw] 2xl:right-[6vw] top-[45%] lg:top-[50%] -translate-y-1/2 z-0"
          style={{ width: "clamp(140px, 18vw, 340px)" }}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        >
          <img
            src={heroBird.src}
            alt="Zayd mascot lifting weights"
            className="w-full h-auto object-contain"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Main Content wrapper */}
      <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto relative z-10 px-4">


        {/* Centre: text — full width on mobile, fixed min-width on desktop */}
        <div className="flex flex-col items-center text-center z-10 flex-shrink-0 w-full xl:min-w-[620px] px-4 sm:px-0">
          {/* Language switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mb-7"
          >
            <LanguageTabSwitcher />
          </motion.div>

          {/* Headline — Font size adjusted for mobile */}
          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5 px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            The Language Gym for
            <br className="hidden sm:block" />
            the Modern Student.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base sm:text-lg lg:text-xl text-gray-500 leading-relaxed mb-8 max-w-lg px-6 sm:px-0"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
          >
            Just as the gym builds your muscles, Zayd builds your language.
            Practice English or Chinese with AI-driven training designed for
            fluency, accuracy, and perfect prosody.
          </motion.p>

          {/* Image for Mobile (Bird) — Appears between subtitle and CTA or below on mobile */}
          <motion.div
            className="lg:hidden block w-full max-w-[300px] mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
          >
            <img
              src={heroBird.src}
              alt="Zayd mascot lifting weights"
              className="w-full h-auto object-contain"
              draggable={false}
            />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <NextLink href="/login" className="w-full sm:w-auto inline-block">
              <button
                className="w-full sm:w-auto rounded-full px-8 py-[14px] text-[17px] font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-300 border-none"
                style={{
                  background: "linear-gradient(90deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)"
                }}
              >
                Start Practice
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </NextLink>
          </motion.div>

          {/* Social proof */}
          <motion.p
            className="mt-5 text-[10px] xs:text-xs sm:text-sm text-[#058BF4] font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            No credit card required&nbsp;•&nbsp;Join thousands of students
          </motion.p>
        </div>
      </div>
    </section>
  );
}
