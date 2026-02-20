"use client";
import { useState, useLayoutEffect, useCallback } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { 
  ChevronLeft, 
  X,
  Sparkles, 
  Rocket,
  PartyPopper,
  Hand
} from "lucide-react";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-nunito",
});

interface GuidePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const STEPS = [
  { id: null, type: 'welcome' },
  // Dashboard Cards (Fixed Sequence per implementation)
  { id: 'levels-card', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'المستوى التعليمي', desc: 'تتبع تقدمك للوصول إلى المستوى القادم من الباندا.' },
  { id: 'word-of-week-card', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'كلمة الأسبوع', desc: 'تعلم كلمة جديدة كل أسبوع مع النطق والمعنى.' },
  { id: 'metrics-card', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'مؤشرات الأداء', desc: 'تابع مهارات النطق والطلاقة والدقة بالتفصيل.' },
  { id: 'longest-streak-card', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'أطول خط للمتابعة', desc: 'هذا هو الرقم القياسي لأطول سلسلة تعلم متواصلة لديك.' },
  { id: 'current-streak-card', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'الخطالية', desc: 'حافظ على استمرارية التعلم يومياً لزيادة هذا الرقم!' },
  { id: 'topic-progress-container', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'التقدم في المحاضرات', desc: 'شاهد مدى تقدمك في كل درس ووحدة تدريبية.' },
  // Sidebar Items
  { id: 'sidebar-dashboard', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'لوحة التحكم', desc: 'استعرض ملخص تقدمك وإحصائياتك اليومية.' },
  { id: 'sidebar-units', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'الوحدات التدريبية', desc: 'ابدأ دروسك الصينية المنظمة حسب المستويات.' },
  { id: 'sidebar-leaderboard', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'قائمة المتفوقين', desc: 'نافس زملاءك وشاهد ترتيبك العالمي.' },
  { id: 'sidebar-achievements', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'الشارات التعليمية', desc: 'استعرض الإنجازات والأوسمة التي حصلت عليها.' },
  { id: 'sidebar-account', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'حساب المستخدم', desc: 'إدارة ملفك الشخصي وإعدادات حسابك.' },
  { id: 'sidebar-logout', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'تسجيل الخروج', desc: 'قم بتسجيل الخروج بأمان من حسابك.' },
  { id: null, type: 'final_completion' },
];

export default function GuidePopup({ isOpen, onClose }: GuidePopupProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const currentStep = STEPS[stepIndex] || STEPS[0];

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  const updateTargetRect = useCallback(() => {
    checkMobile();
    if (currentStep.id) {
      const element = document.getElementById(currentStep.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep?.id, checkMobile]);

  useLayoutEffect(() => {
    if (isOpen) {
      if (currentStep.id) {
        const element = document.getElementById(currentStep.id);
        if (element) {
          // Check if element is below current viewport
          const rect = element.getBoundingClientRect();
          if (rect.bottom > window.innerHeight || rect.top < 0) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Wait for scroll to finish before updating rect
            const timer = setTimeout(updateTargetRect, 500);
            return () => clearTimeout(timer);
          }
        }
      }
      
      const timer = setTimeout(updateTargetRect, 100);
      window.addEventListener("resize", updateTargetRect);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateTargetRect);
      };
    }
  }, [isOpen, stepIndex, updateTargetRect, currentStep?.id]);

  const handleNext = () => {
    let nextIdx = stepIndex + 1;
    
    // Skip sidebar steps on mobile since they might be hidden
    while (nextIdx < STEPS.length - 1 && isMobile && STEPS[nextIdx].id?.startsWith('sidebar-')) {
      nextIdx++;
    }

    if (nextIdx < STEPS.length) {
      setStepIndex(nextIdx);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    onClose();
    setTimeout(() => setStepIndex(0), 300);
  };

  if (!isOpen) return null;

  const showFinalCompletion = () => {
    return true; 
  };

  // If it's the final completion step, check if requirements are met
  if (currentStep.type === 'final_completion' && !showFinalCompletion()) {
    return null; 
  }

  const tooltipPosition = () => {
    if (currentStep.type === 'welcome' || currentStep.type === 'final_completion') return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    
    const PADDING = 24;
    const TOOLTIP_WIDTH = 305;
    const TOOLTIP_HEIGHT = 280; // Safer height for measurement

    if (isMobile) {
        // ... (Mobile logic is already okay but let's harden it with a centered fallback too)
        let mobileTop = targetRect.top + targetRect.height + PADDING;
        if (mobileTop + TOOLTIP_HEIGHT > window.innerHeight - 20) {
            mobileTop = targetRect.top - PADDING - TOOLTIP_HEIGHT;
        }

        if (mobileTop < 20 || mobileTop + TOOLTIP_HEIGHT > window.innerHeight - 20) {
            return { 
                top: "50%", 
                left: "50%", 
                transform: "translate(-50%, -50%)",
                width: TOOLTIP_WIDTH,
                maxWidth: "calc(100vw - 40px)",
                maxHeight: "calc(100vh - 40px)",
                overflowY: "auto" as "auto"
            };
        }

        return { 
            top: mobileTop + TOOLTIP_HEIGHT / 2, 
            left: "50%", 
            transform: "translate(-50%, -50%)"
        };
    }

    let top = targetRect.top + targetRect.height / 2;
    let left = targetRect.left + targetRect.width / 2;
    let transform = "translate(-50%, -50%)";

    // Strategic positioning to avoid overlap
    if (currentStep.id?.startsWith('sidebar-')) {
        const spaceRight = window.innerWidth - (targetRect.left + targetRect.width);
        const spaceLeft = targetRect.left;

        if (spaceLeft > spaceRight && spaceLeft > TOOLTIP_WIDTH + PADDING + 20) {
            left = targetRect.left - PADDING - TOOLTIP_WIDTH / 2;
        } else if (spaceRight > TOOLTIP_WIDTH + PADDING + 20) {
            left = targetRect.left + targetRect.width + PADDING + TOOLTIP_WIDTH / 2;
        } else {
            // Fallback to centered if neither side fits
            return { 
                top: "50%", 
                left: "50%", 
                transform: "translate(-50%, -50%)",
                width: TOOLTIP_WIDTH,
                maxWidth: "calc(100vw - 40px)",
                maxHeight: "calc(100vh - 40px)",
                overflowY: "auto" as "auto"
            };
        }
        top = targetRect.top + targetRect.height / 2;
    } else {
        // Default: try to place below
        top = targetRect.top + targetRect.height + PADDING;
        
        // If it goes off screen bottom, place above
        if (top + TOOLTIP_HEIGHT > window.innerHeight - 20) {
            top = targetRect.top - PADDING - TOOLTIP_HEIGHT;
        }

        // Safety check for centered fallback
        if (top < 20 || top + TOOLTIP_HEIGHT > window.innerHeight - 20) {
            return { 
                top: "50%", 
                left: "50%", 
                transform: "translate(-50%, -50%)",
                width: TOOLTIP_WIDTH,
                maxWidth: "calc(100vw - 40px)",
                maxHeight: "calc(100vh - 40px)",
                overflowY: "auto" as "auto"
            };
        }
        
        // Center the calculated point
        top = top + TOOLTIP_HEIGHT / 2;
    }

    // Safety checks for screen boundaries
    const halfWidth = TOOLTIP_WIDTH / 2;
    const halfHeight = TOOLTIP_HEIGHT / 2;

    if (top < halfHeight + 20) top = halfHeight + 20;
    if (top > window.innerHeight - halfHeight - 20) top = window.innerHeight - halfHeight - 20;
    if (left < halfWidth + 20) left = halfWidth + 20;
    if (left > window.innerWidth - halfWidth - 20) left = window.innerWidth - halfWidth - 20;

    return { top, left, transform };
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && handleFinish()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-transparent" />
        
        <DialogPrimitive.Content
          className={`fixed inset-0 z-[100] outline-none ${nunito.variable} pointer-events-none`}
        >
          <DialogPrimitive.Title className="sr-only">Guide</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">A guide to help you navigate the student dashboard.</DialogPrimitive.Description>
          {/* Hole Punch Highlight */}
          {targetRect && (
            <div
              className={`absolute z-10 rounded-[24px] transition-all duration-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] ring-4 ring-[#FFCB08] ${currentStep.id?.startsWith('sidebar-') ? 'rounded-[16px]' : ''}`}
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            />
          )}

          {/* Welcome Screen Backdrop */}
          {currentStep.type === 'welcome' && (
            <div className="absolute inset-0 bg-black/60 pointer-events-auto" />
          )}

          {/* Content Wrapper */}
          <div 
            className="absolute z-20 animate-in fade-in zoom-in-95 duration-500 pointer-events-auto"
            style={tooltipPosition()}
          >
            {currentStep.type === 'welcome' && (
              <div className="relative w-[calc(100vw-32px)] max-w-[480px] h-auto min-h-[496px] bg-white rounded-[16px] flex flex-col items-center justify-center p-8 sm:p-[41px_0px] gap-6 shadow-[0px_4px_12px_rgba(0,0,0,0.2)] border-[1.6px] border-[#ECECEC] border-b-[4px]">
                {/* Image */}
                <div className="w-[150px] h-[150px] sm:w-[190px] sm:h-[190px] relative flex-none order-0 flex-grow-0">
                  <Image src="/images/3.png" alt="Welcome" fill className="object-contain" onError={(e) => { e.currentTarget.src = "/images/PANDA.png"; }} />
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center gap-0 w-full px-4 sm:px-8">
                  <h2 className="w-full text-center font-almarai font-extrabold text-[22px] sm:text-[28px] leading-[30px] sm:leading-[36px] text-[#282828] mb-2 order-1 flex items-center justify-center gap-2">
                    مرحباً بك في Zayd AI Chinese <Hand className="text-[#FFCB08] animate-bounce" size={28} />
                  </h2>
                  <p className="w-full text-center font-nunito font-semibold text-[16px] sm:text-[18px] leading-[22px] sm:leading-[28px] text-[#454545] tracking-[-0.005em] order-2 font-sans flex items-center justify-center gap-2">
                    تعلم اللغة الصينية خطوة بخطوة وبطريقة ممتعة <PartyPopper className="text-[#35AB4E]" size={20} />
                  </p>
                </div>

                {/* Button */}
                <button
                  onClick={handleNext}
                  className="flex flex-row justify-center items-center p-[16px_0px] gap-[10px] w-full max-w-[388px] h-[56px] bg-[#35AB4E] border-b-[3px] border-[#20672F] rounded-[12px] hover:bg-[#2f9c46] active:border-b-0 active:translate-y-[2px] transition-all order-3"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                  <span className="font-nunito font-bold text-[16px] leading-[22px] text-white">
                    هيا نبدأ
                  </span>
                </button>

                {/* Pagination Dots (Capped for space) */}
                <div className="flex flex-row items-center p-0 gap-[8px] width-[64px] h-[8px] order-4">
                  <div className="w-[32px] h-[8px] bg-[#35AB4E] rounded-[100px]" />
                  <div className="w-[8px] h-[8px] bg-[#B1B1B1] rounded-[100px]" />
                  <div className="w-[8px] h-[8px] bg-[#B1B1B1] rounded-[100px]" />
                  <div className="w-[8px] h-[8px] bg-[#B1B1B1] rounded-[100px]" />
                </div>
              </div>
            )}

            {currentStep.type === 'final_completion' && (
              <div className="relative w-[calc(100vw-32px)] max-w-[420px] h-auto min-h-[280px] bg-white rounded-[24px] flex flex-col items-center justify-center p-8 gap-6 shadow-[0px_10px_30px_rgba(0,0,0,0.15)] border-[1.6px] border-[#ECECEC] border-b-[4px]">
                <div className="relative z-10 flex flex-col items-center gap-6 w-full">
                  <div className="flex flex-col items-center gap-3">
                    <h2 className="font-almarai font-extrabold text-[26px] sm:text-[30px] leading-tight text-[#282828] flex items-center gap-2 text-center">
                      استمتع بالتعلم! <Sparkles className="text-[#FFCB08] animate-pulse" size={28} />
                    </h2>
                    <p className="font-nunito font-semibold text-[16px] sm:text-[17px] text-[#666666] text-center max-w-[280px]">
                      تعلم قليلاً كل يوم وستصبح أفضل
                    </p>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="flex flex-row justify-center items-center p-[12px_24px] gap-2 w-full max-w-[280px] h-[52px] bg-[#35AB4E] border-b-[4px] border-[#20672F] rounded-[14px] hover:bg-[#3dbb57] active:border-b-0 active:translate-y-[2px] transition-all group"
                  >
                    <span className="font-nunito font-extrabold text-[18px] text-white">
                      ابدأ التعلم
                    </span>
                    <Rocket className="w-5 h-5 text-white group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {currentStep.type !== 'welcome' && currentStep.type !== 'final_completion' && (
              <div className="flex flex-row items-center gap-[20px] transition-all duration-300">
                {/* Tooltip Card */}
                <div
                  className="box-border flex flex-col items-center p-4 gap-[22px] w-[calc(100vw-40px)] max-w-[305px] h-fit min-h-[220px] bg-white border-[1.6px] border-[#ECECEC] border-b-[4px] shadow-[0px_4px_12px_rgba(0,0,0,0.2)]"
                  style={{ borderRadius: "16px 16px 16px 16px" }}
                >
                  {/* Header */}
                  <div className="relative flex flex-row items-center w-full h-[36px]">
                    <button
                      onClick={handleFinish}
                      className="ms-10 absolute left-0 box-border flex items-center justify-center p-2 w-8 h-8 bg-[#E2E2E2] border border-[#ECECEC] rounded-[8px] hover:bg-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4 text-[#454545]" />
                    </button>
                    <div className="flex flex-row items-center justify-center gap-2 w-full">
                      <span className="">{currentStep.icon}</span>
                      <h3 className="font-almarai font-bold text-[20px] sm:text-[22px] leading-[26px] sm:leading-[28px] text-[#282828] text-center">
                        {currentStep.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="w-full text-right" dir="rtl">
                    <p className="font-nunito font-semibold text-[16px] leading-[22px] text-[#454545] tracking-[-0.0025em]">
                      {currentStep.desc}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 w-full mt-auto">
                    {/* Button */}
                    <button
                      onClick={handleNext}
                      className="box-border flex flex-row justify-center items-center p-[16px_0px] gap-2 w-full h-[56px] bg-[#35AB4E] border-b-[3px] border-[#20672F] rounded-[12px] hover:bg-[#2f9c46] transition-all"
                    >
                      <span className="font-nunito font-bold text-[16px] leading-[22px] text-white">
                        {stepIndex === STEPS.length - 1 ? 'إنهاء الجولة' : 'فهمت'}
                      </span>
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    {/* Pagination Indicator */}
                    <div className="flex flex-row items-center gap-1 w-full justify-center overflow-hidden">
                      {STEPS.slice(1).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 rounded-full transition-all ${i + 1 === stepIndex ? 'w-4 bg-[#35AB4E]' : 'w-1 bg-[#B1B1B1]'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
