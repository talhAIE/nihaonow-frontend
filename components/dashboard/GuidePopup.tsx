"use client";
import { useState, useLayoutEffect, useCallback } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { 
  ChevronLeft, 
  X, 
  Home, 
  BookOpen, 
  Trophy, 
  Medal, 
  User, 
  LogOut, 
  Sparkles, 
  BarChart3, 
  Star, 
  Flame, 
  TrendingUp,
  GraduationCap
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
  // Sidebar Items
  { id: 'sidebar-dashboard', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'لوحة التحكم', desc: 'استعرض ملخص تقدمك وإحصائياتك اليومية.' },
  { id: 'sidebar-units', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'الوحدات التدريبية', desc: 'ابدأ دروسك الصينية المنظمة حسب المستويات.' },
  { id: 'sidebar-leaderboard', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'قائمة المتفوقين', desc: 'نافس زملاءك وشاهد ترتيبك العالمي.' },
  { id: 'sidebar-achievements', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'الشارات التعليمية', desc: 'استعرض الإنجازات والأوسمة التي حصلت عليها.' },
  { id: 'sidebar-account', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'حساب المستخدم', desc: 'إدارة ملفك الشخصي وإعدادات حسابك.' },
  { id: 'sidebar-logout', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'تسجيل الخروج', desc: 'قم بتسجيل الخروج بأمان من حسابك.' },
  // Dashboard Cards (Fixed Sequence per implementation)
  { id: 'levels-card', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'المستوى التعليمي', desc: 'تتبع تقدمك للوصول إلى المستوى القادم من الباندا.' },
  { id: 'word-of-week-card', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'كلمة الأسبوع', desc: 'تعلم كلمة جديدة كل أسبوع مع النطق والمعنى.' },
  { id: 'metrics-card', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'مؤشرات الأداء', desc: 'تابع مهارات النطق والطلاقة والدقة بالتفصيل.' },
  { id: 'longest-streak-card', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'أطول خط للمتابعة', desc: 'هذا هو الرقم القياسي لأطول سلسلة تعلم متواصلة لديك.' },
  { id: 'current-streak-card', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'الخطالية', desc: 'حافظ على استمرارية التعلم يومياً لزيادة هذا الرقم!' },
  { id: 'topic-progress-container', icon: <Sparkles className="text-[#FFCB08]" size={24} />, title: 'التقدم في المحاضرات', desc: 'شاهد مدى تقدمك في كل درس ووحدة تدريبية.' },
  { id: null, type: 'final_completion' },
];

export default function GuidePopup({ isOpen, onClose }: GuidePopupProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const currentStep = STEPS[stepIndex];

  const updateTargetRect = useCallback(() => {
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
  }, [currentStep.id]);

  useLayoutEffect(() => {
    if (isOpen) {
      const timer = setTimeout(updateTargetRect, 100);
      window.addEventListener("resize", updateTargetRect);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateTargetRect);
      };
    }
  }, [isOpen, stepIndex, updateTargetRect]);

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    onClose();
    localStorage.setItem('dashboard_guide_seen', 'true');
    setTimeout(() => setStepIndex(0), 300);
  };

  if (!isOpen) return null;

  const showFinalCompletion = () => {
    const leaderboardSeen = typeof window !== 'undefined' ? localStorage.getItem('leaderboard_guide_seen') : null;
    const achievementsSeen = typeof window !== 'undefined' ? localStorage.getItem('achievements_guide_seen') : null;
    return leaderboardSeen === 'true' && achievementsSeen === 'true';
  };

  // If it's the final completion step, check if requirements are met
  if (currentStep.type === 'final_completion' && !showFinalCompletion()) {
    return null; 
  }

  const tooltipPosition = () => {
    if (currentStep.type === 'welcome' || currentStep.type === 'final_completion') return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    
    let top = targetRect.top + targetRect.height / 2;
    let left = targetRect.left + targetRect.width / 2;
    let transform = "translate(-50%, -50%)";

    if (currentStep.id?.startsWith('sidebar-')) {
        left = targetRect.left - 180;
        top = targetRect.top + targetRect.height / 2;
    } else if (currentStep.id === 'word-of-week-card') {
        top = targetRect.top + targetRect.height + 140;
    } else if (currentStep.id === 'metrics-card') {
        top = targetRect.top + targetRect.height + 100;
    } else if (currentStep.id?.includes('streak')) {
        top = targetRect.top - 120;
    } else if (currentStep.id === 'levels-card') {
        top = targetRect.top + targetRect.height + 140;
    } else if (currentStep.id === 'topic-progress-container') {
        top = targetRect.top - 160;
    }

    // Safety checks for screen boundaries
    if (top < 150) top = 150;
    if (top > window.innerHeight - 150) top = window.innerHeight - 150;
    if (left < 170) left = 170;
    if (left > window.innerWidth - 170) left = window.innerWidth - 170;

    return { top, left, transform };
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && handleFinish()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-transparent" />
        
        <DialogPrimitive.Content
          className={`fixed inset-0 z-[100] outline-none ${nunito.variable} pointer-events-none`}
        >
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
              <div className="relative w-[480px] h-[496px] bg-white rounded-[16px] flex flex-col items-center justify-center p-[41px_0px] gap-6 shadow-[0px_4px_12px_rgba(0,0,0,0.2)] border-[1.6px] border-[#ECECEC] border-b-[4px]">
                {/* Image */}
                <div className="w-[190px] h-[190px] relative flex-none order-0 flex-grow-0">
                  <Image src="/images/3.png" alt="Welcome" width={190} height={190} className="object-contain" onError={(e) => { e.currentTarget.src = "/images/PANDA.png"; }} />
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center gap-0 w-full px-8">
                  <h2 className="w-full text-center font-almarai font-extrabold text-[28px] leading-[36px] text-[#282828] mb-2 order-1">
                    مرحباً بك في Zayd AI Chinese 👋
                  </h2>
                  <p className="w-full text-center font-nunito font-semibold text-[18px] leading-[28px] text-[#454545] tracking-[-0.005em] order-2 font-sans">
                    تعلم اللغة الصينية خطوة بخطوة وبطريقة ممتعة 🎉
                  </p>
                </div>

                {/* Button */}
                <button
                  onClick={handleNext}
                  className="flex flex-row justify-center items-center p-[16px_0px] gap-[10px] w-[388px] h-[56px] bg-[#35AB4E] border-b-[3px] border-[#20672F] rounded-[12px] hover:bg-[#2f9c46] active:border-b-0 active:translate-y-[2px] transition-all order-3"
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
              <div className="relative w-[480px] h-[350px] bg-white rounded-[16px] flex flex-col items-center justify-center p-[41px_0px] gap-8 shadow-[0px_4px_12px_rgba(0,0,0,0.2)] border-[1.6px] border-[#ECECEC] border-b-[4px]">
                <div className="absolute inset-0 bg-black/60 pointer-events-none rounded-[16px] -m-1" />
                <div className="relative z-10 flex flex-col items-center gap-6 w-full">
                  <div className="flex flex-col items-center gap-2">
                    <h2 className="font-almarai font-extrabold text-[32px] leading-[40px] text-[#282828] flex items-center gap-2">
                      استمتع بالتعلم! <Sparkles className="text-[#FFCB08]" size={32} />
                    </h2>
                    <p className="font-nunito font-semibold text-[18px] text-[#454545]">
                      تعلم قليلاً كل يوم وستصبح أفضل
                    </p>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="flex flex-row justify-center items-center p-[16px_0px] gap-[10px] w-[300px] h-[56px] bg-[#35AB4E] border-b-[3px] border-[#20672F] rounded-[12px] hover:bg-[#2f9c46] active:border-b-0 active:translate-y-[2px] transition-all"
                  >
                    <span className="font-nunito font-bold text-[18px] text-white">
                      ابدأ التعلم 🚀
                    </span>
                  </button>
                </div>
              </div>
            )}

            {currentStep.type !== 'welcome' && currentStep.type !== 'final_completion' && (
              <div className="flex flex-row items-center gap-[20px] transition-all duration-300">
                {/* Tooltip Card */}
                <div
                  className="box-border flex flex-col items-center p-4 gap-[22px] w-[305px] h-fit min-h-[220px] bg-white border-[1.6px] border-[#ECECEC] border-b-[4px] shadow-[0px_4px_12px_rgba(0,0,0,0.2)]"
                  style={{ borderRadius: "16px 16px 16px 0px" }}
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
                      <span className="me-6">{currentStep.icon}</span>
                      <h3 className="me-16 font-almarai font-bold text-[22px] leading-[28px] text-[#282828] text-center">
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
