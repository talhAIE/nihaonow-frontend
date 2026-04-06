import { motion } from "framer-motion";
import { useState } from "react";
import birdWithBook from "@/assets/landingpage-zayd/bird-with-book.png";
import orangeBird from "@/assets/landingpage-zayd/orange-bird.png"; // Assuming parrot for chinese based on previous assets
import { useLanguage } from "@/components/language-provider";
import EmojiIcon from "@/components/ui/emoji-icon";
import flagUK from "@/assets/svgs/flag-united-kingdom.svg";
import flagChina from "@/assets/svgs/flag-china.svg";

const tutors = {
  english: {
    specialty: "English Specialist",
    arabicSpecialty: "متخصص الإنجليزية",
    image: birdWithBook,
    features: [
      {
        emoji: "🎓",
        title: "The Persona",
        arabicTitle: "الشخصية",
        description: "Meet Zayd, your mentor in the dark blue thobe.",
        arabicDescription: "قابل زيد، مرشدك بالثوب الأزرق الداكن.",
      },
      {
        emoji: "🎯",
        title: "The Focus",
        arabicTitle: "التركيز",
        description: "Academic mastery of the Saudi Curriculum (Mega Goal / Super goal).",
        arabicDescription: "إتقان أكاديمي للمنهج السعودي (Mega Goal / Super Goal).",
      },
      {
        emoji: "💪",
        title: "The Workout",
        arabicTitle: "التدريب",
        description: "High-frequency practice that turns school lessons into real-world confidence.",
        arabicDescription: "ممارسة مكثفة تحول الدروس المدرسية إلى ثقة في العالم الحقيقي.",
      },
    ],
  },
  chinese: {
    specialty: "Chinese Specialist",
    arabicSpecialty: "متخصص الصينية",
    image: orangeBird,
    features: [
      {
        emoji: "🏮",
        title: "Cultural Context",
        arabicTitle: "السياق الثقافي",
        description: "Experience Chinese as it's spoken in real social contexts.",
        arabicDescription: "اختبر اللغة الصينية كما يتم التحدث بها في السياقات الاجتماعية الحقيقية.",
      },
      {
        emoji: "🥢",
        title: "Guided Learning",
        arabicTitle: "التعلم الموجه",
        description: "Learn through structured lessons and improve with real-time feedback.",
        arabicDescription: "تعلم من خلال الدروس المنظمة وحسّن مستواك من خلال التقييم الفوري.",
      },
      {
        emoji: "🏯",
        title: "Daily Practice",
        arabicTitle: "التدريب اليومي",
        description: "Practice every day to strengthen your skills and move toward fluency.",
        arabicDescription: "تدرب كل يوم لتقوية مهاراتك والتقدم نحو الطلاقة.",
      },
    ],
  },
};

export default function TutorSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [activeTutor, setActiveTutor] = useState<"english" | "chinese">("english");

  const tutor = tutors[activeTutor];

  return (
    <section id="tutors" className="py-12 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header - Centered */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-[13px] font-bold mb-6"
          >
            {isAr ? "المعلمون" : "The Tutors"}
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold text-[#111827] mb-6 tracking-tight leading-tight px-4"
          >
            {isAr ? "مدربو اللغة العاملون بالذكاء الاصطناعي" : "Your AI Language Coaches"}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-sm sm:text-base lg:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed px-6"
          >
            {isAr ? (
              "معلمان متخصصان، كل منهما مصمم لإتقان مجاله. اختر مدربك وابدأ التدريب."
            ) : (
              "Two specialized tutors, each designed to master their domain. Choose your coach and start training."
            )}
          </motion.p>
        </div>

        {/* Tutor Switcher */}
        <motion.div 
          className="flex justify-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <div className="bg-gray-50/80 p-1 rounded-full flex items-center gap-1 border border-gray-100 shadow-sm max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveTutor("english")}
              className={`whitespace-nowrap px-4 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                activeTutor === "english" 
                ? "bg-gradient-to-r from-[#76ABF8] to-[#058BF4] text-white shadow-md" 
                : "text-blue-500 hover:bg-gray-100"
              }`}
            >
              <img src={flagUK.src} alt="UK" className="w-4 h-4 sm:w-5 sm:h-5" />
              {isAr ? "الإنجليزية" : "English"}
            </button>
            <button
              onClick={() => setActiveTutor("chinese")}
              className={`whitespace-nowrap px-4 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                activeTutor === "chinese" 
                ? "bg-gradient-to-r from-[#76ABF8] to-[#058BF4] text-white shadow-md" 
                : "text-blue-500 hover:bg-gray-100"
              }`}
            >
              <img src={flagChina.src} alt="China" className="w-4 h-4 sm:w-5 sm:h-5" />
              {isAr ? "الصينية" : "Chinese"}
            </button>
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div 
          key={activeTutor}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto rounded-[32px] sm:rounded-[48px] border border-gray-100 bg-white p-6 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-center gap-10 lg:gap-20"
        >
          {/* Left Side: Mascot + Specialty Tag */}
          <div className="flex-1 flex flex-col items-center gap-6 sm:gap-8 w-full">
            <motion.div 
              className="relative w-full max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 100,
                delay: 0.2 
              }}
            >
              <div className="absolute inset-0 bg-blue-100/20 blur-[60px] sm:blur-[80px] rounded-full scale-125 pointer-events-none" />
              <img
                src={tutor.image.src}
                alt={activeTutor}
                className="relative w-full h-auto object-contain"
              />
            </motion.div>
            
            {/* Specialty Tag Footer */}
            <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-1.5 sm:py-2 rounded-full border border-gray-50 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
              <img src={activeTutor === "english" ? flagUK.src : flagChina.src} alt="Flag" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                {isAr ? tutor.arabicSpecialty : tutor.specialty}
              </span>
            </div>
          </div>

          {/* Right Side: Feature List */}
          <div className="flex-1 space-y-8 sm:space-y-12 w-full">
            {tutor.features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-4 sm:gap-6 group"
              >
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#E0F2FE]/50 shadow-sm flex items-center justify-center shrink-0">
                  <EmojiIcon emoji={feature.emoji} size={24} className="sm:w-[28px] sm:h-[28px]" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg sm:text-[22px] font-extrabold text-gray-900 mb-1 sm:mb-2 leading-tight">
                    {isAr ? feature.arabicTitle : feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed max-w-sm">
                    {isAr ? feature.arabicDescription : feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
