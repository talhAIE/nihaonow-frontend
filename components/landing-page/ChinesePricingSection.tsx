import Image from "next/image";
import { motion } from "framer-motion";
import EmojiIcon from "@/components/ui/emoji-icon";
import { useLanguage } from "@/components/language-provider";
import birdImg from "@/assets/landingpage/birdy-wings-up.png";
import checkMark from "@/assets/landingpage/checkmark.svg";

export default function ChinesePricingSection() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const plans = [
    {
      type: "school",
      title: isAr ? "للمدارس" : "For Schools",
      description: isAr ? "نشر كامل مع أدوات إدارة وتحليلات" : "Full deployment with management and analytics tools",
      icon: <EmojiIcon emoji="🏫" size={24} className="text-[#35AB4E]" />,
      features: isAr ? [
        "جميع ميزات الطلاب مشمولة",
        "لوحات تحكم للمعلمين والإدارة مع تحليلات",
        "دعم أولوية لشركاء التعليم"
      ] : [
        "All student features included",
        "Dashboards for teachers and admins with analytics",
        "Priority support for education partners"
      ],
    },
    {
      type: "student",
      title: isAr ? "للطلاب" : "For Students",
      description: isAr ? "متعلمين فرديين مستعدين لإتقان اللغة الإنجليزية أو الصينية" : "Individual learners ready to master English or Chinese",
      icon: <EmojiIcon emoji="🎓" size={24} className="text-[#35AB4E]" />,
      features: isAr ? [
        "الوصول إلى برامج اللغة الإنجليزية و/أو الصينية",
        "لوحة تحكم شخصية مع إنجازات ومكافآت",
        "شهادات وشارات للمعالم الهامة"
      ] : [
        "Access to English and/or Chinese language programs",
        "Personal dashboard with achievements and rewards",
        "Certificates and badges for key milestones"
      ],
    }
  ];

  return (
    <section id="pricing" className={`px-6 bg-white overflow-hidden ${isAr ? 'font-almarai' : 'font-nunito'} relative overflow-x-hidden`} dir={dir}>
      <div className="max-w-7xl mx-auto">
        {/* Top Mascot & Header */}
        <div className="flex flex-col items-center text-center mb-10 relative">
          <motion.div
            className="w-[clamp(12rem,20vw,18rem)] h-auto mb-8"
            initial={{ opacity: 0, scaleX: isAr ? 0.8 : -0.8, scaleY: 0.8 }}
            whileInView={{ opacity: 1, scaleX: isAr ? 1 : -1, scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
          >
            <Image
              src={birdImg}
              alt="Zayd AI Mascot"
              className="w-full h-auto"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-[#E5F3E9] text-[#35AB4E] px-6 py-2 rounded-full text-sm font-bold mb-6"
          >
            {isAr ? "أسعار مرنة" : "Flexible Pricing"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-[clamp(1.5rem,3.5vw,2.5rem)] font-black text-[#121212] mb-8"
          >
            {isAr ? "خطط للطلاب والمدارس" : "Plans for Students & Schools"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="text-[#6B7280] text-base sm:text-lg md:text-xl font-normal max-w-3xl leading-relaxed"
          >
            {isAr 
              ? "تقدم Zayd AI خططاً مرنة للمتعلمين الأفراد ونشر المدارس بالكامل. تشمل جميع الخطط الوصول إلى منصتنا الآمنة المعتمدة من SADAIA واستضافة محلية في السعودية."
              : "Zayd AI offers flexible plans for individual learners and full school deployments. All plans include access to our secure SADAIA-certified platform and local Saudi hosting."}
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isAr ? (i === 0 ? 50 : -50) : (i === 0 ? -50 : 50) }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 md:p-10 md:p-12 rounded-[24px] md:rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col items-center text-center"
            >
              {/* Logically Aligned Header: Title + Icon */}
              <div className="flex items-center justify-center gap-3 md:gap-4 mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                  {plan.icon}
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-[#121212] leading-none">{plan.title}</h3>
              </div>
              
              <p className="text-[#6B7280] text-base md:text-lg font-normal mb-6 md:mb-10 leading-relaxed">
                {plan.description}
              </p>

              <div className="space-y-3 md:space-y-4 w-full md:px-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className={`flex items-center justify-start gap-3 w-full py-1`}>
                    <img src={checkMark.src} alt="Saudi Flag" className="w-6 h-6 object-contain rounded-sm shadow-sm" />
                    <p className="text-[#121212] font-normal text-sm md:text-base lg:text-lg leading-snug text-start">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
