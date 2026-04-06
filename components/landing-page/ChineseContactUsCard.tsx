import Image from "next/image";
import { motion } from "framer-motion";
import NextLink from "next/link";
import birdSide from "@/assets/landingpage/bird-side.png";
import { useLanguage } from "@/components/language-provider";


export default function ChineseContactUsCard() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const dir = language === "ar" ? "rtl" : "ltr";
    return (
        <section id="pricing" className={`py-4 px-6 bg-white overflow-hidden ${isAr ? 'font-almarai' : 'font-nunito'} relative overflow-x-hidden`} dir={dir}>
          <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="bg-[#E5F3E9] rounded-[48px] p-10 lg:p-20 relative overflow-hidden"
        >
          {/* Content Wrapper - Padded to avoid mascot overlap */}
          <div className="relative z-10 w-full flex justify-center">
            <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#121212] mb-4">
                {isAr ? "هل أنت مستعد للبدء؟" : "Are you ready to start?"}
              </h3>
              <p className="text-[#35AB4E] text-base sm:text-lg lg:text-xl font-medium mb-6 lg:mb-8">
                {isAr 
                  ? "شارك حجم مدرستك واحتياجاتك اللغوية، وسنوصي بأفضل خطة لك."
                  : "Share your school size and language needs, and we'll recommend the best plan for you."}
              </p>
              <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
                <NextLink href="/contact-us" className="w-[90%] max-w-[380px] lg:w-auto">
                  <button 
                    className="text-white px-6 lg:px-10 py-3 lg:py-5 font-extrabold flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 w-full text-sm sm:text-base lg:text-lg"
                    style={{
                      background: "#35AB4E",
                      boxShadow: "0px 3px 0px #20672F",
                      borderRadius: "12px",
                    }}
                  >
                    {isAr ? "اتصل بنا للحصول على الأسعار" : "Contact us for pricing"}
                  </button>
                </NextLink>
              </div>
            </div>
          </div>

          {/* Absolute Mascot - Centered on edge */}
          <motion.div
            className={`hidden lg:block absolute top-1/2 -translate-y-1/2 right-[0rem] 2xl:right-0 w-40 2xl:w-48 h-auto object-contain pointer-events-none z-0 transition-all duration-500`}
            initial={{ opacity: 0, x: 50, y: "-50%", scaleX: 1 }}
            whileInView={{ opacity: 1, x: 0, y: "-50%", scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.6,
              type: "spring",
              stiffness: 100,
            }}
          >
            <Image
              src={birdSide}
              alt="Owl Mascot"
              className="w-full h-auto object-contain scale-90 2xl:scale-100"
            />
          </motion.div>
        </motion.div>
    </section>
        
    );
}