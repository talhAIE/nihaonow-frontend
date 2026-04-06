import { motion } from "framer-motion";
import birdClock from "@/assets/landingpage-zayd/bird-with-clock.png";
import birdFire from "@/assets/landingpage-zayd/bird-wth-fire.png";
import { useLanguage } from "@/components/language-provider";
import { ChevronRight } from "lucide-react";

export default function CTASection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const direction = isAr ? "rtl" : "ltr";

  return (
    <section id="join-now" className="py-12 sm:py-24 bg-white relative" dir={direction}>
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-blue-50/30 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center">
          
          {/* Top Pill - Fixed Label as "Ready to Transform" */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="px-6 py-2 rounded-full border border-gray-100 bg-white text-gray-900 text-sm font-bold mb-6 shadow-sm"
          >
            {isAr ? "جاهز للتغيير" : "Ready to Transform"}
          </motion.div>

          {/* Main Headline - Now as "Ready to Transform" */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight leading-[1.1] px-4"
          >
            {isAr ? "جاهز للتغيير" : "Ready to Transform"}
          </motion.h2>

          {/* Subheader - "Ready for your first rep?" */}
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-6 sm:mb-8 tracking-tight leading-[1.1] px-4"
          >
            {isAr ? "جاهز لأول تمرين لك؟" : "Ready for your first rep?"}
          </motion.h3>

          {/* Body Text */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-base sm:text-xl lg:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-6"
          >
            {isAr ? (
              "انضم إلى آلاف الطلاب الذين يبنون الطلاقة والدقة والثقة من خلال التدريب اللغوي القائم على الذكاء الاصطناعي."
            ) : (
              "Join thousands of students building fluency, accuracy, and confidence through AI-powered language training."
            )}
          </motion.p>

          <a href="/login">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "circOut", delay: 0.3 }}
              className="mb-8 w-full sm:w-auto flex justify-center px-4"
            >
              <button className="w-full sm:w-auto group px-5 sm:px-10 py-3.5 sm:py-5 rounded-full bg-gradient-to-r from-[#76ABF8] via-[#058BF4] to-[#63B3F6] text-white font-extrabold text-base sm:text-lg md:text-xl shadow-[0_20px_40px_-10px_rgba(5,139,244,0.4)] flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 active:scale-95">
                {isAr ? "انضم إلى نادي زيد اليوم" : "Join The Zayd Gym Today"}
                <ChevronRight className={`w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 ${isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
              </button>
            </motion.div>
          </a>

          {/* Fine Print - Now with middle dots instead of bullets */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xs sm:text-sm text-gray-400 font-medium mb-12 px-4"
          >
            {isAr ? (
              "لا يلزم وجود بطاقة ائتمان · ابدأ التدريب في 60 ثانية"
            ) : (
              "No credit card required · Start training in 60 seconds"
            )}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: isAr ? 50 : -50, rotate: -10 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ 
            duration: 1, 
            type: "spring", 
            stiffness: 80,
            delay: 0.2 
          }}
          className="hidden lg:block absolute -left-6 xl:-left-36 -bottom-12 pointer-events-none select-none overflow-visible"
        >
          <img 
            src={birdClock.src} 
            alt="Mascot with clock" 
            className="w-[240px] xl:w-[320px] h-auto drop-shadow-2xl" 
            draggable={false}
          />
        </motion.div>
        {/* Right Bird - with fire */}
        <motion.div
          initial={{ opacity: 0, x: isAr ? -30 : 30, rotate: 10 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ 
            duration: 1, 
            type: "spring", 
            stiffness: 80,
            delay: 0.4 
          }}
          className="hidden lg:block absolute -right-6 xl:-right-24 -top-12 xl:-top-24 pointer-events-none select-none overflow-visible"
        >
          <img 
            src={birdFire.src} 
            alt="Mascot with fire" 
            className="w-[200px] xl:w-[240px] h-auto drop-shadow-2xl" 
            draggable={false}
          />
        </motion.div>

      </div>
    </section>
  );
}
