"use client";
import { useState, useLayoutEffect, useCallback, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  X,
  Sparkles,
  Rocket,
  PartyPopper,
  Hand,
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

const COPY = {
  ar: {
    welcome: {
      title: "مرحباً بك في Zayd AI Chinese",
      desc: "تعلم اللغة الصينية خطوة بخطوة وبطريقة ممتعة",
      button: "هيا نبدأ",
    },
    steps: {
      "levels-card": { title: "المستوى التعليمي", desc: "تتبع تقدمك للوصول إلى المستوى القادم من الباندا." },
      "word-of-week-card": { title: "كلمة الأسبوع", desc: "تعلم كلمة جديدة كل أسبوع مع النطق والمعنى." },
      "metrics-card": { title: "مؤشرات الأداء", desc: "تابع مهارات النطق والطلاقة والدقة بالتفصيل." },
      "longest-streak-card": { title: "أطول خط للمتابعة", desc: "هذا هو الرقم القياسي لأطول سلسلة تعلم متواصلة لديك." },
      "current-streak-card": { title: "الخط الحالية", desc: "حافظ على استمرارية التعلم يومياً لزيادة هذا الرقم!" },
      "topic-progress-container": { title: "التقدم في المحاضرات", desc: "شاهد مدى تقدمك في كل درس ووحدة تدريبية." },
      "sidebar-dashboard": { title: "لوحة التحكم", desc: "استعرض ملخص تقدمك وإحصائياتك اليومية." },
      "sidebar-units": { title: "الوحدات التدريبية", desc: "ابدأ دروسك الصينية المنظمة حسب المستويات." },
      "sidebar-leaderboard": { title: "قائمة المتفوقين", desc: "نافس زملاءك وشاهد ترتيبك العالمي." },
      "sidebar-achievements": { title: "الشارات التعليمية", desc: "استعرض الإنجازات والأوسمة التي حصلت عليها." },
      "sidebar-account": { title: "حساب المستخدم", desc: "إدارة ملفك الشخصي وإعدادات حسابك." },
      "sidebar-logout": { title: "تسجيل الخروج", desc: "قم بتسجيل الخروج بأمان من حسابك." },
    },
    final: {
      title: "استمتع بالتعلم!",
      desc: "تعلم قليلاً كل يوم وستصبح أفضل",
      button: "ابدأ التعلم",
    },
    common: {
      finish: "إنهاء الجولة",
      gotIt: "فهمت",
    }
  },
  en: {
    welcome: {
      title: "Welcome to Zayd AI Chinese",
      desc: "Learn Chinese step-by-step in a fun way",
      button: "Let's Start",
    },
    steps: {
      "levels-card": { title: "Learning Level", desc: "Track your progress to reach the next Panda level." },
      "word-of-week-card": { title: "Word of the Week", desc: "Learn a new word every week with pronunciation and meaning." },
      "metrics-card": { title: "Performance Metrics", desc: "Track your pronunciation, fluency, and accuracy skills in detail." },
      "longest-streak-card": { title: "Longest Streak", desc: "This is your record for the longest continuous learning streak." },
      "current-streak-card": { title: "Current Streak", desc: "Keep learning daily to increase this number!" },
      "topic-progress-container": { title: "Lesson Progress", desc: "See how much you've progressed in each lesson and unit." },
      "sidebar-dashboard": { title: "Dashboard", desc: "View a summary of your daily progress and statistics." },
      "sidebar-units": { title: "Learning Units", desc: "Start your Chinese lessons organized by levels." },
      "sidebar-leaderboard": { title: "Leaderboard", desc: "Compete with your peers and see your ranking." },
      "sidebar-achievements": { title: "Badges & Awards", desc: "View the achievements and medals you've earned." },
      "sidebar-account": { title: "User Account", desc: "Manage your profile and account settings." },
      "sidebar-logout": { title: "Logout", desc: "Safely log out of your account." },
    },
    final: {
      title: "Enjoy Learning!",
      desc: "Learn a little each day and you will get better",
      button: "Start Learning",
    },
    common: {
      finish: "Finish Tour",
      gotIt: "Got it",
    }
  }
};

const STEPS = [
  { id: null, type: "welcome" },
  { id: "levels-card" },
  { id: "word-of-week-card" },
  { id: "metrics-card" },
  { id: "longest-streak-card" },
  { id: "current-streak-card" },
  { id: "topic-progress-container" },
  { id: "sidebar-dashboard" },
  { id: "sidebar-units" },
  { id: "sidebar-leaderboard" },
  { id: "sidebar-achievements" },
  { id: "sidebar-account" },
  { id: "sidebar-logout" },
  { id: null, type: "final_completion" },
];

export default function GuidePopup({ isOpen, onClose }: GuidePopupProps) {
  const { dir } = useAppContext();
  const isAr = dir === "rtl";
  const t = isAr ? COPY.ar : COPY.en;

  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 305, height: 280 });

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
          const mobileNow = window.innerWidth < 1024;

          // Check if it's a sidebar element inside the scrollable nav
          if (currentStep.id.startsWith('sidebar-') && currentStep.id !== 'sidebar-logout') {
            const sidebarNav = element.closest('nav');
            if (sidebarNav) {
              const navRect = sidebarNav.getBoundingClientRect();
              const elRect = element.getBoundingClientRect();
              // Standard check: is it outside the nav's visible area?
              if (elRect.top < navRect.top || elRect.bottom > navRect.bottom) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
          } else {
            const rect = element.getBoundingClientRect();
            // On mobile: scroll every 2nd step (even stepIndex >= 2) so the element is
            // clearly visible without scrolling on every single card advance.
            // Steps 0 & 1 are already in view. Steps 2, 4, 6... trigger a scroll.
            if (mobileNow && stepIndex >= 2 && stepIndex % 2 === 0) {
              element.style.scrollMarginTop = "100px";
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (rect.top < 0 || rect.bottom > window.innerHeight) {
              // Desktop: scroll if any part of the element is off-screen
              element.style.scrollMarginTop = "100px";
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }

          // Wait for scroll to finish before updating rect
          const timer = setTimeout(updateTargetRect, 800);
          return () => clearTimeout(timer);
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


  // Measure tooltip size whenever step changes or it's opened
  useLayoutEffect(() => {
    if (isOpen && tooltipRef.current) {
      const { width, height } = tooltipRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setTooltipSize({ width, height });
      }
    }
  }, [isOpen, stepIndex, targetRect]);

  const handleNext = () => {
    let nextIdx = stepIndex + 1;

    // Skip sidebar steps on mobile since they might be hidden
    while (
      nextIdx < STEPS.length - 1 &&
      isMobile &&
      STEPS[nextIdx].id?.startsWith("sidebar-")
    ) {
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
  if (currentStep.type === "final_completion" && !showFinalCompletion()) {
    return null;
  }

  const tooltipPosition = () => {
    if (
      currentStep.type === "welcome" ||
      currentStep.type === "final_completion"
    )
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    if (!targetRect)
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    const PADDING = 24;
    const TOOLTIP_WIDTH = tooltipSize.width;
    const TOOLTIP_HEIGHT = tooltipSize.height;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Helper to check if a position overlaps with targetRect
    const overlaps = (t: number, l: number) => {
      const tooltipRect = {
        top: t - TOOLTIP_HEIGHT / 2,
        bottom: t + TOOLTIP_HEIGHT / 2,
        left: l - TOOLTIP_WIDTH / 2,
        right: l + TOOLTIP_WIDTH / 2,
      };

      const targetWithPadding = {
        top: targetRect.top - 20,
        bottom: targetRect.top + targetRect.height + 20,
        left: targetRect.left - 20,
        right: targetRect.left + targetRect.width + 20,
      };

      return !(
        tooltipRect.right < targetWithPadding.left ||
        tooltipRect.left > targetWithPadding.right ||
        tooltipRect.bottom < targetWithPadding.top ||
        tooltipRect.top > targetWithPadding.bottom
      );
    };

    if (isMobile) {
      // Try below the element
      const belowTop = targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2;
      const overlapsBelow = overlaps(belowTop, screenWidth / 2);
      if (
        belowTop + TOOLTIP_HEIGHT / 2 <= screenHeight - 20 &&
        !overlapsBelow
      ) {
        return { top: belowTop, left: "50%", transform: "translate(-50%, -50%)" };
      }

      // Try above the element
      const aboveTop = targetRect.top - PADDING - TOOLTIP_HEIGHT / 2;
      const overlapsAbove = overlaps(aboveTop, screenWidth / 2);
      if (
        aboveTop - TOOLTIP_HEIGHT / 2 >= 20 &&
        !overlapsAbove
      ) {
        return { top: aboveTop, left: "50%", transform: "translate(-50%, -50%)" };
      }

      // Neither below nor above works — pick the vertical half with more free space
      // and clamp the popup so it doesn't overlap.
      // However, if the element is at the top (typical for scrolled-to-start), prefer the bottom.
      const spaceBelow = screenHeight - (targetRect.top + targetRect.height);
      const spaceAbove = targetRect.top;

      // If the top is very close to screen top (e.g. scrolled to start), forcedly prefer bottom 
      // even if spaceBelow is negative (overlap least important part).
      const preferBottom = (targetRect.top < 60) || (spaceBelow >= spaceAbove);

      if (preferBottom) {
        // Anchor to bottom of screen
        const clampedTop = Math.min(
          screenHeight - TOOLTIP_HEIGHT / 2 - 20,
          Math.max(targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2, screenHeight - TOOLTIP_HEIGHT / 2 - 20)
        );
        return { top: clampedTop, left: "50%", transform: "translate(-50%, -50%)" };
      } else {
        // Anchor to top of screen
        const clampedTop = Math.max(
          TOOLTIP_HEIGHT / 2 + 20,
          Math.min(targetRect.top - PADDING - TOOLTIP_HEIGHT / 2, TOOLTIP_HEIGHT / 2 + 20)
        );
        return { top: clampedTop, left: "50%", transform: "translate(-50%, -50%)" };
      }
    }

    // Desktop strategies
    let positions: { top: number; left: number }[] = [];

    if (currentStep.id?.startsWith("sidebar-")) {
      // Preference for side position
      positions = [
        {
          top: targetRect.top + targetRect.height / 2,
          left:
            targetRect.left + targetRect.width + PADDING + TOOLTIP_WIDTH / 2,
        }, // Right
        {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left - PADDING - TOOLTIP_WIDTH / 2,
        }, // Left
        {
          top:
            targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2,
          left: targetRect.left + targetRect.width / 2,
        }, // Bottom
        {
          top: targetRect.top - PADDING - TOOLTIP_HEIGHT / 2,
          left: targetRect.left + targetRect.width / 2,
        }, // Top
      ];
    } else {
      // Preference for bottom/top
      positions = [
        {
          top:
            targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2,
          left: targetRect.left + targetRect.width / 2,
        }, // Bottom
        {
          top: targetRect.top - PADDING - TOOLTIP_HEIGHT / 2,
          left: targetRect.left + targetRect.width / 2,
        }, // Top
        {
          top: targetRect.top + targetRect.height / 2,
          left:
            targetRect.left + targetRect.width + PADDING + TOOLTIP_WIDTH / 2,
        }, // Right
        {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left - PADDING - TOOLTIP_WIDTH / 2,
        }, // Left
      ];
    }

    for (const pos of positions) {
      // Check if within screen and doesn't overlap
      const inScreen =
        pos.top - TOOLTIP_HEIGHT / 2 > 10 &&
        pos.top + TOOLTIP_HEIGHT / 2 < screenHeight - 10 &&
        pos.left - TOOLTIP_WIDTH / 2 > 10 &&
        pos.left + TOOLTIP_WIDTH / 2 < screenWidth - 10;

      if (inScreen && !overlaps(pos.top, pos.left)) {
        return {
          top: pos.top,
          left: pos.left,
          transform: "translate(-50%, -50%)",
        };
      }
    }

    // Last resort fallback: find best fit or center
    let top = targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2;
    let left = targetRect.left + targetRect.width / 2;

    if (top + TOOLTIP_HEIGHT / 2 > screenHeight - 20) {
      top = targetRect.top - PADDING - TOOLTIP_HEIGHT / 2;
    }

    if (
      top - TOOLTIP_HEIGHT / 2 < 20 ||
      top + TOOLTIP_HEIGHT / 2 > screenHeight - 20
    ) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: TOOLTIP_WIDTH,
        maxWidth: "calc(100vw - 40px)",
        maxHeight: "calc(100vh - 40px)",
        overflowY: "auto" as "auto",
      };
    }

    // Clamp values
    top = Math.max(
      TOOLTIP_HEIGHT / 2 + 20,
      Math.min(screenHeight - TOOLTIP_HEIGHT / 2 - 20, top),
    );
    left = Math.max(
      TOOLTIP_WIDTH / 2 + 20,
      Math.min(screenWidth - TOOLTIP_WIDTH / 2 - 20, left),
    );

    return { top, left, transform: "translate(-50%, -50%)" };
  };

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && handleFinish()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-transparent" />

        <DialogPrimitive.Content
          className={`fixed inset-0 z-[100] outline-none ${nunito.variable} pointer-events-none`}
        >
          <DialogPrimitive.Title className="sr-only">
            Guide
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            A guide to help you navigate the student dashboard.
          </DialogPrimitive.Description>
          {/* Hole Punch Highlight */}
          {targetRect && (
            <div
              className={`absolute z-10 rounded-[24px] transition-all duration-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] ring-4 ring-[#FFCB08] ${currentStep.id?.startsWith("sidebar-") ? "rounded-[16px]" : ""}`}
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            />
          )}

          {/* Welcome Screen Backdrop */}
          {currentStep.type === "welcome" && (
            <div className="absolute inset-0 bg-black/60 pointer-events-auto" />
          )}

          {/* Content Wrapper */}
          <div
            ref={tooltipRef}
            className="absolute z-20 animate-in fade-in zoom-in-95 duration-500 pointer-events-auto"
            style={tooltipPosition()}
          >
            {currentStep.type === "welcome" && (
              <div className="relative w-[calc(100vw-32px)] max-w-[480px] h-auto min-h-[496px] bg-white rounded-[16px] flex flex-col items-center justify-center p-8 sm:p-[41px_0px] gap-6 shadow-[0px_4px_12px_rgba(0,0,0,0.2)] border-[1.6px] border-[#ECECEC] border-b-[4px]">
                {/* Image */}
                <div className="w-[150px] h-[150px] sm:w-[190px] sm:h-[190px] relative flex-none order-0 flex-grow-0">
                  <Image
                    src="/images/3.png"
                    alt="Welcome"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/images/PANDA.png";
                    }}
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center gap-0 w-full px-4 sm:px-8">
                  <h2 className={`w-full text-center font-extrabold text-[22px] sm:text-[28px] leading-[30px] sm:leading-[36px] text-[#282828] mb-2 order-1 flex items-center justify-center gap-2 ${isAr ? 'font-almarai' : 'font-nunito'}`}>
                    {t.welcome.title}{" "}
                    <Hand className="text-[#FFCB08] animate-bounce" size={28} />
                  </h2>
                  <p className={`w-full text-center font-semibold text-[16px] sm:text-[18px] leading-[22px] sm:leading-[28px] text-[#454545] tracking-[-0.005em] order-2 flex items-center justify-center gap-2 ${isAr ? 'font-almarai' : 'font-nunito'}`}>
                    {t.welcome.desc}{" "}
                    <PartyPopper className="text-[#35AB4E]" size={20} />
                  </p>
                </div>

                {/* Button */}
                <button
                  onClick={handleNext}
                  className="flex flex-row justify-center items-center p-[16px_0px] gap-[10px] w-full max-w-[388px] h-[56px] bg-[#35AB4E] border-b-[3px] border-[#20672F] rounded-[12px] hover:bg-[#2f9c46] active:border-b-0 active:translate-y-[2px] transition-all order-3"
                >
                  {isAr ? <ChevronLeft className="w-6 h-6 text-white" /> : null}
                  <span className={`font-bold text-[16px] leading-[22px] text-white ${isAr ? 'font-almarai' : 'font-nunito'}`}>
                    {t.welcome.button}
                  </span>
                  {!isAr ? <ChevronLeft className="w-6 h-6 text-white rotate-180" /> : null}
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

            {currentStep.type === "final_completion" && (
              <div className="relative w-[calc(100vw-32px)] max-w-[420px] h-auto min-h-[280px] bg-white rounded-[24px] flex flex-col items-center justify-center p-8 gap-6 shadow-[0px_10px_30px_rgba(0,0,0,0.15)] border-[1.6px] border-[#ECECEC] border-b-[4px]">
                <div className="relative z-10 flex flex-col items-center gap-6 w-full">
                  <div className="flex flex-col items-center gap-3">
                    <h2 className={`font-extrabold text-[26px] sm:text-[30px] leading-tight text-[#282828] flex items-center gap-2 text-center ${isAr ? 'font-almarai' : 'font-nunito'}`}>
                      {t.final.title}{" "}
                      <Sparkles
                        className="text-[#FFCB08] animate-pulse"
                        size={28}
                      />
                    </h2>
                    <p className={`font-semibold text-[16px] sm:text-[17px] text-[#666666] text-center max-w-[280px] ${isAr ? 'font-almarai' : 'font-nunito'}`}>
                      {t.final.desc}
                    </p>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="flex flex-row justify-center items-center p-[12px_24px] gap-2 w-full max-w-[280px] h-[52px] bg-[#35AB4E] border-b-[4px] border-[#20672F] rounded-[14px] hover:bg-[#3dbb57] active:border-b-0 active:translate-y-[2px] transition-all group"
                  >
                    <span className={`font-extrabold text-[18px] text-white ${isAr ? 'font-almarai' : 'font-nunito'}`}>
                      {t.final.button}
                    </span>
                    <Rocket className={`w-5 h-5 text-white transition-transform ${isAr ? 'group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]' : 'group-hover:translate-x-[4px] group-hover:translate-y-[-4px]'}`} />
                  </button>
                </div>
              </div>
            )}

            {currentStep.type !== "welcome" &&
              currentStep.type !== "final_completion" && (
                <div className="flex flex-row items-center gap-[20px] transition-all duration-300">
                  {/* Tooltip Card */}
                  <div
                    className="box-border flex flex-col items-center p-4 gap-[22px] w-[calc(100vw-40px)] max-w-[305px] h-fit min-h-[220px] bg-white border-[1.6px] border-[#ECECEC] border-b-[4px] shadow-[0px_4px_12px_rgba(0,0,0,0.2)]"
                    style={{ borderRadius: "16px 16px 16px 16px" }}
                  >
                    {/* Header */}
                    <div className="flex flex-row items-center justify-between w-full h-[36px]">
                      <div className="flex flex-row items-center justify-center gap-2 flex-1">
                        <Sparkles className="text-[#FFCB08]" size={24} />
                        <h3 className={`font-bold text-[20px] sm:text-[22px] leading-[26px] sm:leading-[28px] text-[#282828] text-center ${isAr ? 'font-almarai' : 'font-nunito'}`}>
                          {(t.steps as any)[currentStep.id!]?.title}
                        </h3>
                      </div>
                      <button
                        onClick={handleFinish}
                        className="box-border flex items-center justify-center p-2 w-8 h-8 bg-[#E2E2E2] border border-[#ECECEC] rounded-[8px] hover:bg-gray-300 transition-colors shrink-0"
                      >
                        <X className="w-4 h-4 text-[#454545]" />
                      </button>
                    </div>

                    {/* Description */}
                    <div className={`w-full ${isAr ? 'text-right' : 'text-left'}`} dir={dir}>
                      <p className={`font-semibold text-[16px] leading-[22px] text-[#454545] tracking-[-0.0025em] ${isAr ? 'font-almarai' : 'font-nunito'}`}>
                        {(t.steps as any)[currentStep.id!]?.desc}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full mt-auto">
                      {/* Button */}
                      <button
                        onClick={handleNext}
                        className="box-border flex flex-row justify-center items-center p-[16px_0px] gap-2 w-full h-[56px] bg-[#35AB4E] border-b-[3px] border-[#20672F] rounded-[12px] hover:bg-[#2f9c46] transition-all"
                      >
                        {isAr ? <ChevronLeft className="w-6 h-6 text-white" /> : null}
                        <span className={`font-bold text-[16px] leading-[22px] text-white ${isAr ? 'font-almarai' : 'font-nunito'}`}>
                          {stepIndex === STEPS.length - 2
                            ? t.common.finish
                            : t.common.gotIt}
                        </span>
                        {!isAr ? <ChevronLeft className="w-6 h-6 text-white rotate-180" /> : null}
                      </button>

                      {/* Pagination Indicator */}
                      <div className="flex flex-row items-center gap-1 w-full justify-center overflow-hidden">
                        {STEPS.slice(1, -1).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${i + 1 === stepIndex ? "w-4 bg-[#35AB4E]" : "w-1 bg-[#B1B1B1]"}`}
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
