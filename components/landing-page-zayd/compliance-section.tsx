import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { Dumbbell, Shield, MapPin, ChevronRight } from "lucide-react";

const cards = [
  {
    icon: <Dumbbell className="w-10 h-10 text-white" />,
    title: "Zero Judgment",
    arabicTitle: "بدون أحكام",
    description: "The gym is open 24/7. Practice as much as you want, wherever you are.",
    arabicDescription: "النادي مفتوح 24/7. تدرب بقدر ما تريد، أينما كنت.",
    rotation: -6,
    shift: "-translateX(15%)",
  },
  {
    icon: <Shield className="w-10 h-10 text-white" />,
    title: "SDAIA Compliant",
    arabicTitle: "متوافق مع SDAIA",
    description: "Your voice and data stay secure within the Kingdom.",
    arabicDescription: "صوتك وبياناتك تبقى آمنة داخل المملكة.",
    rotation: 0,
    isCenter: true,
  },
  {
    icon: <MapPin className="w-10 h-10 text-white" />,
    title: "Local Roots",
    arabicTitle: "جذور محلية",
    description: "AI that actually understands the Saudi accent and provides better corrections.",
    arabicDescription: "ذكاء اصطناعي يفهم اللكنة السعودية ويقدم تصحيحات أفضل.",
    rotation: 6,
    shift: "translateX(15%)",
  },
];

export default function ComplianceSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const direction = isAr ? "rtl" : "ltr";

  // Responsive state for JS-based transforms
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1000);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <section id="compliance" className="py-32 bg-white relative" dir={direction}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header - Centered */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-[13px] font-bold mb-6">
            {isAr ? "انتصارات كبيرة" : "Big Wins"}
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-[#111827] mb-6 tracking-tight">
            {isAr ? "لماذا زيد؟" : "Why Zayd Wins"}
          </h2>

          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            {isAr ? "ابدأ رحلة نجاحك مع زيد" : "Start your winning journey with Zayd"}
          </p>
        </div>

        {/* Feature Cards - Stacked Layout */}
        <div className="relative flex flex-col min-[1000px]:flex-row items-center justify-center gap-12 min-[1000px]:gap-0 min-[1000px]:min-h-[500px] mb-24 max-w-6xl mx-auto">
          {cards.map((card, idx) => {
            const rotation = isAr ? -card.rotation : card.rotation;
            
            return (
              <div
                key={idx}
                className={`
                  relative w-full min-[1000px]:absolute
                  bg-[#F1F5F9] border border-gray-100 rounded-[48px] shadow-[0_10px_40px_rgba(0,0,0,0.03)]
                  flex flex-col items-center text-center
                  transition-all duration-500
                  ${card.isCenter 
                    ? "min-[1000px]:z-20 max-w-md min-[1000px]:max-w-[420px] p-10 min-[1000px]:p-14 min-[1000px]:scale-110 shadow-[0_30px_70px_rgba(0,0,0,0.08)]" 
                    : "min-[1000px]:z-10 max-w-md min-[1000px]:max-w-[350px] p-10 min-[1000px]:scale-[0.98] min-[1000px]:opacity-85"
                  }
                `}
                style={{
                  transform: isDesktop 
                    ? `translateX(${idx === 0 ? (isAr ? '100%' : '-100%') : idx === 2 ? (isAr ? '-100%' : '100%') : '0'}) rotate(${rotation}deg)` 
                    : `rotate(0deg)`
                }}
              >
                {/* Icon Circle */}
                <div 
                  className={`${(isDesktop && card.isCenter) ? "w-24 h-24" : "w-16 h-16"} rounded-full flex items-center justify-center shadow-lg shadow-blue-50/50 mb-6`}
                  style={{ background: "linear-gradient(135deg, #76ABF8 0%, #058BF4 48.56%, #63B3F6 80%)" }}
                >
                  <div className={(isDesktop && card.isCenter) ? "scale-125" : "scale-90"}>
                    {card.icon}
                  </div>
                </div>

                <div className={`${(isDesktop && card.isCenter) ? "space-y-4" : "space-y-2"}`}>
                  <h3 className={`${(isDesktop && card.isCenter) ? "text-3xl" : "text-2xl"} font-extrabold text-[#111827] tracking-tight`}>
                    {isAr ? card.arabicTitle : card.title}
                  </h3>
                  <p className={`${(isDesktop && card.isCenter) ? "text-lg" : "text-base"} text-gray-500 font-medium leading-relaxed`}>
                    {isAr ? card.arabicDescription : card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        <div className="flex justify-center">
          <a href="/login">
            <button
              className="group px-10 py-5 rounded-full bg-gradient-to-r from-[#76ABF8] via-[#058BF4] to-[#63B3F6] text-white font-extrabold text-lg md:text-xl shadow-[0_20px_40px_-10px_rgba(5,139,244,0.3)] flex items-center gap-3 active:scale-95 transition-all duration-300"
            >
              {isAr ? "تعلم مع زيد من اليوم" : "Learn With Zayd From Today"}
              <ChevronRight className={`w-6 h-6 transition-transform duration-300 ${isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
            </button>
          </a>
        </div>

      </div>
    </section>
  );
}
