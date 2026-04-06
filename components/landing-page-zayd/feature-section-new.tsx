import { motion } from "framer-motion";
import dumbbellRack from "@/assets/landingpage-zayd/dumbbell-rack.png";
import { useLanguage } from "@/components/language-provider";
import EmojiIcon from "@/components/ui/emoji-icon";

const cards = [
  {
    title: "Pronunciation",
    arabicTitle: "النطق",
    description: "Sharp, clear, and native-like.",
    arabicDescription: "واضح، دقيق، وكأنك تتحدث لغتك الأم.",
    emoji: "🗣️",
  },
  {
    title: "Fluency",
    arabicTitle: "الطلاقة",
    description: "Speak without the 'mental lag.'",
    arabicDescription: "تحدث بطلاقة دون تردد أو تفكير طويل.",
    emoji: "📈",
  },
  {
    title: "Accuracy",
    arabicTitle: "الدقة",
    description: "Perfect grammar through active use, not memorization.",
    arabicDescription: "قواعد لغوية مثالية من خلال الممارسة العملية.",
    emoji: "🎯",
  },
  {
    title: "Prosody",
    arabicTitle: "العروض اللغوي",
    description: "Master the rhythm, stress, and music of the language.",
    arabicDescription: "أتقن إيقاع ونبرات وموسيقى اللغة.",
    emoji: "🎶",
  },
];

export default function LanguageGymSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const direction = isAr ? "rtl" : "ltr";

  return (
    <section 
      id="features" 
      className="py-6 sm:py-24 bg-white relative" 
      dir={direction}
    >
      {/* Background Decorative Element (Optional, based on design) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-[-10%] w-[40%] h-[40%] bg-blue-50/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Pill */}
        <div className="flex justify-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-6 py-2 rounded-full border border-gray-100 text-sm font-bold text-gray-900 shadow-sm bg-white"
          >
            {isAr ? "نادي اللغة" : "The Language Gym"}
          </motion.div>
        </div>

        {/* Headline & Subtext - Centered */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 mb-6 sm:mb-8 tracking-tight leading-[1.1]"
          >
            {isAr ? "توقف عن الدراسة. ابدأ التدريب." : "Stop Studying. Start Training."}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-gray-500 leading-relaxed font-medium max-w-3xl mx-auto px-4"
          >
            {isAr ? (
              <>
                لا يمكنك الحصول على جسم رياضي بمجرد مشاهدة الآخرين يرفعون الأثقال. <br className="hidden sm:block" />
                تحصل على اللياقة بالممارسة الفعلية. «زيد» هو مدربك الشخصي لـ:
              </>
            ) : (
              <>
                You don't get fit by watching others lift weights. You get fit by
                doing the reps. Zayd is your personal trainer for:
              </>
            )}
          </motion.p>
        </div>

        {/* Cards Grid - Centered in the layout */}
        <div className="flex justify-center w-full relative z-10 px-2 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full max-w-4xl">
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                className="group p-5 sm:p-8 lg:p-10 rounded-[28px] sm:rounded-[40px] border border-gray-100/50 bg-[#F1F5F9] 
                           shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] 
                           hover:-translate-y-2 transition-all duration-500 cursor-default"
              >
                <div className="flex flex-col items-start gap-4 sm:gap-6">
                  {/* Gradient Icon background */}
                  <div 
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-50/50"
                    style={{ background: "linear-gradient(135deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)" }}
                  >
                    <EmojiIcon emoji={card.emoji} size={24} className="sm:size-[28px] text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">
                      {isAr ? card.arabicTitle : card.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
                      {isAr ? card.arabicDescription : card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Dumbbell Rack Image - Positioned to the right edge as per design */}
      <motion.div
        className="hidden min-[1225px]:block absolute top-1/2 right-0 pointer-events-none select-none z-0 overflow-visible"
        style={{ width: "clamp(180px, 20vw, 320px)" }}
        initial={{ opacity: 0, x: isAr ? -80 : 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ 
          duration: 0.9, 
          ease: "easeOut", 
          delay: 0.4,
          type: "spring",
          stiffness: 100 
        }}
      >
        <div className={`relative transform ${isAr ? '-translate-x-[5%]' : 'translate-x-[5%]'} -translate-y-[20%]`}>
            <img
                src={dumbbellRack.src}
                alt="Dumbbell Rack"
                className="w-full h-auto object-contain drop-shadow-xl"
                draggable={false}
            />
        </div>
      </motion.div>
    </section>
  );
}
