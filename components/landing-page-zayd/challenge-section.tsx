import { motion } from "framer-motion";
import stopwatchImg from "@/assets/landingpage-zayd/clock.png";
import { useLanguage } from "@/components/language-provider";
import EmojiIcon from "@/components/ui/emoji-icon";

const features = [
  {
    emoji: "🔔",
    title: "Stay Accountable",
    arabicTitle: "ابقَ منضبطاً",
    description: "Get reminders and stay on track with your goals.",
    arabicDescription: "احصل على تذكيرات وحافظ على مسار أهدافك.",
  },
  {
    emoji: "💪",
    title: "Build the Habit",
    arabicTitle: "ابنِ العادة",
    description: "Track your weekly 60-minute goal on your dashboard.",
    arabicDescription: "تتبع هدفك الأسبوعي المكون من 60 دقيقة في لوحتك.",
  },
  {
    emoji: "📈",
    title: "See the Gains",
    arabicTitle: "شاهد التقدم",
    description: "Visualize your improvement and celebrate your wins.",
    arabicDescription: "شاهد تحسنك واحتفل بنجاحاتك.",
  },
];

export default function ClockworkSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const direction = isAr ? "rtl" : "ltr";

  return (
    <section id="challenge" className="py-12 sm:py-24 bg-white relative" dir={direction}>
      <div className="max-w-7xl mx-auto px-4">
        
            {/* Header - Centered */}
        <div className="text-center mb-12 sm:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center px-6 py-2 rounded-full border border-gray-100 bg-white text-gray-900 text-sm font-bold mb-6 sm:mb-8 shadow-sm"
          >
            {isAr ? "الطلاقة" : "Fluency"}
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 mb-6 sm:mb-8 tracking-tight leading-[1.1]"
          >
            {isAr ? "تحدي الـ 60 دقيقة" : "The 60-Minute Challenge"}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed px-6"
          >
            {isAr ? (
              "هل يمكنك منح مستقبلك ساعة واحدة في الأسبوع؟"
            ) : (
              "Can you give your future one hour a week?"
            )}
          </motion.p>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 max-w-5xl mx-auto">
          
          {/* Stopwatch Image Side */}
          <motion.div 
            className="flex-1 hidden lg:flex justify-center w-full"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: 1, 
              type: "spring", 
              stiffness: 80,
              delay: 0.2 
            }}
          >
            <div className="relative w-full max-w-[240px] sm:max-w-[380px]">
              <div className="absolute inset-0 bg-blue-100/20 blur-[60px] sm:blur-[100px] rounded-full scale-125" />
              <motion.img
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src={stopwatchImg.src}
                alt="60 Minute Challenge Stopwatch"
                className="relative w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                draggable={false}
              />
            </div>
          </motion.div>

          {/* Features Side */}
          <div className="flex-1 flex flex-col items-center lg:items-start w-full px-4 sm:px-0">
            <div className="flex flex-col gap-6 sm:gap-10 w-full max-w-sm sm:max-w-md lg:max-w-none items-start">
              {features.map((feature, idx) => {
                const isCenter = idx === 1;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 + idx * 0.1, ease: "circOut" }}
                    className={`flex items-start gap-4 sm:gap-6 group transition-all duration-300 ${
                      !isCenter ? (isAr ? "lg:mr-12" : "lg:ml-12") : "lg:scale-110"
                    }`}
                  >
                    <div 
                      className={`rounded-full shadow-lg shadow-blue-50/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${
                        isCenter ? "p-3 sm:p-4 lg:p-4 xl:p-5" : "p-3 sm:p-4"
                      }`}
                      style={{ background: "linear-gradient(135deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)" }}
                    >
                      <EmojiIcon emoji={feature.emoji} size={isCenter ? 24 : 24} className={`text-white sm:w-[32px] sm:h-[32px] ${isCenter ? "lg:w-[36px] lg:h-[36px]" : ""}`} />
                    </div>
                    <div className={isCenter ? "mt-0.5 sm:mt-1 lg:mt-1.5" : ""}>
                      <h3 className={`${isCenter ? "text-lg sm:text-2xl lg:text-xl lg:sm:text-3xl" : "text-lg sm:text-2xl"} font-extrabold text-gray-900 mb-1 sm:mb-2 leading-tight`}>
                        {isAr ? feature.arabicTitle : feature.title}
                      </h3>
                      <p className={`text-gray-500 font-medium leading-relaxed max-w-sm ${isCenter ? "text-sm sm:text-base lg:text-base lg:sm:text-lg" : "text-sm sm:text-base"}`}>
                        {isAr ? feature.arabicDescription : feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
