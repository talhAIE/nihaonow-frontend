"use client";
import { useState, useLayoutEffect, useCallback, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, X, Sparkles, Volume2, Languages, Mic, MessageSquare, BookOpen } from "lucide-react";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-nunito",
});

interface SessionGuidePopupProps {
  isOpen: boolean;
  onClose: () => void;
  isIntroduction?: boolean;
  isSecondStage?: boolean;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function SessionGuidePopup({
  isOpen,
  onClose,
  isIntroduction = false,
  isSecondStage = false,
}: SessionGuidePopupProps) {
  const [step, setStep] = useState(1);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 340, height: 320 });

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  const getTargetId = useCallback((currentStep: number) => {
    // If this is the "Stage 2" guide (triggered on first real scenario after intro),
    // only show the pronunciation and record steps (3 and 4).
    if (isSecondStage) {
      if (currentStep !== 3 && currentStep !== 4) return null;
    }
    
    // On introductory scenarios, always skip the pronunciation column (3).
    if (isIntroduction && currentStep === 3) return null;
    
    switch (currentStep) {
      case 1: return "context-button";
      case 2: return "character-frame";
      case 3: return "pronunciation-column";
      case 4: return "record-button";
      case 5: return "continue-button";
      case 6: return "feedback-button";
      case 7: return "user-guide-button";
      default: return null;
    }
  }, [isIntroduction, isSecondStage]);

  const updateTargetRect = useCallback(() => {
    checkMobile();
    const id = getTargetId(step);
    if (id) {
      const element = document.getElementById(id);
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
  }, [step, getTargetId, checkMobile]);

  const handleFinish = useCallback(() => {
    onClose();
    setTimeout(() => setStep(1), 300);
  }, [onClose]);

  const handleNext = useCallback(() => {
    let nextStep = step + 1;
    while (nextStep <= 7) {
      const id = getTargetId(nextStep);
      const element = id ? document.getElementById(id) : null;
      // Skip if explicitly returned null OR if ID exists but element is missing from DOM
      if (id === null || (id && !element)) {
        nextStep++;
        continue;
      }
      break;
    }

    if (nextStep <= 7) {
      setStep(nextStep);
    } else {
      handleFinish();
    }
  }, [step, getTargetId, handleFinish]);

  useLayoutEffect(() => {
    if (isOpen) {
      const id = getTargetId(step);
      const element = id ? document.getElementById(id) : null;
      
      // If the target element for current step doesn't exist (or step is skipped), find next valid step
      if (id === null || (id && !element)) {
        handleNext();
        return;
      }

      if (element) {
        const rect = element.getBoundingClientRect();
        const mobileNow = window.innerWidth < 1024;

        // On mobile: always scroll the target element into view so it's clearly visible
        // and properly highlighted below the mobile header. Desktop: only scroll if off-screen.
        if (mobileNow) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const timer = setTimeout(updateTargetRect, 500);
          return () => clearTimeout(timer);
        } else if (rect.top < 0 || rect.bottom > window.innerHeight) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const timer = setTimeout(updateTargetRect, 500);
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
  }, [isOpen, step, updateTargetRect, getTargetId, handleNext]);


  // Measure tooltip size
  useLayoutEffect(() => {
    if (isOpen && tooltipRef.current) {
      const { width, height } = tooltipRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setTooltipSize({ width, height });
      }
    }
  }, [isOpen, step, targetRect]);

  if (!isOpen) return null;

  const tooltipPosition = () => {
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    
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
        right: l + TOOLTIP_WIDTH / 2
      };
      
      const targetWithPadding = {
        top: targetRect.top - 20,
        bottom: targetRect.top + targetRect.height + 20,
        left: targetRect.left - 20,
        right: targetRect.left + targetRect.width + 20
      };

      return !(tooltipRect.right < targetWithPadding.left || 
               tooltipRect.left > targetWithPadding.right || 
               tooltipRect.bottom < targetWithPadding.top || 
               tooltipRect.top > targetWithPadding.bottom);
    };

    if (isMobile) {
        // Try below the element
        const belowTop = targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2;
        if (
          belowTop + TOOLTIP_HEIGHT / 2 <= screenHeight - 20 &&
          !overlaps(belowTop, screenWidth / 2)
        ) {
          return { top: belowTop, left: "50%", transform: "translate(-50%, -50%)" };
        }

        // Try above the element
        const aboveTop = targetRect.top - PADDING - TOOLTIP_HEIGHT / 2;
        if (
          aboveTop - TOOLTIP_HEIGHT / 2 >= 20 &&
          !overlaps(aboveTop, screenWidth / 2)
        ) {
          return { top: aboveTop, left: "50%", transform: "translate(-50%, -50%)" };
        }

        // Pick the vertical half with the most free space
        const spaceBelow = screenHeight - (targetRect.top + targetRect.height);
        const spaceAbove = targetRect.top;
        if (spaceBelow >= spaceAbove) {
          const clampedTop = Math.min(
            screenHeight - TOOLTIP_HEIGHT / 2 - 20,
            Math.max(targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2, screenHeight - TOOLTIP_HEIGHT / 2 - 20)
          );
          return { top: clampedTop, left: "50%", transform: "translate(-50%, -50%)" };
        } else {
          const clampedTop = Math.max(
            TOOLTIP_HEIGHT / 2 + 20,
            Math.min(targetRect.top - PADDING - TOOLTIP_HEIGHT / 2, TOOLTIP_HEIGHT / 2 + 20)
          );
          return { top: clampedTop, left: "50%", transform: "translate(-50%, -50%)" };
        }
    }

    // Desktop strategies: Preference for bottom/top for session guide
    const positions = [
        { top: targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2, left: targetRect.left + targetRect.width / 2 }, // Bottom
        { top: targetRect.top - PADDING - TOOLTIP_HEIGHT / 2, left: targetRect.left + targetRect.width / 2 }, // Top
        { top: targetRect.top + targetRect.height / 2, left: targetRect.left + targetRect.width + PADDING + TOOLTIP_WIDTH / 2 }, // Right
        { top: targetRect.top + targetRect.height / 2, left: targetRect.left - PADDING - TOOLTIP_WIDTH / 2 } // Left
    ];

    for (const pos of positions) {
        const inScreen = pos.top - TOOLTIP_HEIGHT / 2 > 10 && 
                         pos.top + TOOLTIP_HEIGHT / 2 < screenHeight - 10 &&
                         pos.left - TOOLTIP_WIDTH / 2 > 10 &&
                         pos.left + TOOLTIP_WIDTH / 2 < screenWidth - 10;
        
        if (inScreen && !overlaps(pos.top, pos.left)) {
            return { top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" };
        }
    }

    // Last resort fallback
    let top = targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2;
    let left = targetRect.left + targetRect.width / 2;

    if (top + TOOLTIP_HEIGHT / 2 > screenHeight - 20) {
        top = targetRect.top - PADDING - TOOLTIP_HEIGHT / 2;
    }

    if (top - TOOLTIP_HEIGHT / 2 < 20 || top + TOOLTIP_HEIGHT / 2 > screenHeight - 20) {
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

    top = Math.max(TOOLTIP_HEIGHT / 2 + 20, Math.min(screenHeight - TOOLTIP_HEIGHT / 2 - 20, top));
    left = Math.max(TOOLTIP_WIDTH / 2 + 20, Math.min(screenWidth - TOOLTIP_WIDTH / 2 - 20, left));

    return { top, left, transform: "translate(-50%, -50%)" };
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && handleFinish()}>
      <DialogPrimitive.Portal>
        {/* Transparent Overlay to handle clicks but avoid double darkening */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-transparent" />
        
        <DialogPrimitive.Content
          className={`fixed inset-0 z-[100] outline-none ${nunito.variable} pointer-events-none`}
        >
          <DialogPrimitive.Title className="sr-only">Session Guide</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">A guide to help you understand the scenario session interface.</DialogPrimitive.Description>
          {/* Hole Punch Highlight - This handles the background darkening */}
          {targetRect && (
            <div
              className="absolute z-10 rounded-xl transition-all duration-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] ring-4 ring-[#FFCB08]"
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            />
          )}

          {/* Tooltip Content - Needs pointer-events-auto to be clickable */}
          <div 
            ref={tooltipRef}
            className="absolute z-20 animate-in fade-in slide-in-from-bottom-5 duration-500 pointer-events-auto"
            style={tooltipPosition()}
          >
            <div className="bg-white rounded-[24px] shadow-2xl border-[1.5px] border-[#ECECEC] border-b-[4px] p-6 w-[calc(100vw-40px)] max-w-[340px] flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#FFCB08]" />
                  </div>
                  <h3 className="font-almarai font-extrabold text-[20px] text-[#282828] text-right">
                      {step === 1 && "زر الاستماع"}
                      {step === 2 && "تحتاج مساعدة؟"}
                      {step === 3 && "النطق والصوت"}
                      {step === 4 && "حان دورك!"}
                      {step === 5 && "إرسال إجابتك"}
                      {step === 6 && "تحليل النطق"}
                      {step === 7 && "الدليل الشامل"}
                  </h3>
                </div>
                <button onClick={handleFinish} className="p-2 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <p className="text-right text-[#454545] text-lg font-semibold leading-relaxed font-almarai">
                  {step === 1 && "اسمع الكلمة قبل أن تنطقها لتتعرف على اللحن الصحيح!"}
                  {step === 2 && "الشيخ سيقوم بنطق الجملة لك بالصينية. استمع جيداً قبل المحاولة!"}
                  {step === 3 && "هنا تجد اللفظ الصحيح بالصينية (بينيين)."}
                  {step === 4 && "اضغط على الزر وسجل نطقك. سنقوم بتحليله وإعطائك النتيجة فوراً!"}
                  {step === 5 && "بعد التسجيل، اضغط هنا لإرسال إجابتك وتلقي التقييم."}
                  {step === 6 && "بعد التسجيل، انقر هنا لتعرف نقاط القوة والضعف في نطقك."}
                  {step === 7 && "هل نسيت شيئاً؟ يمكنك دائماً مراجعة هذا الدليل بالفيديو من هنا!"}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={step === 7 ? handleFinish : handleNext}
                  className="w-full bg-[#35AB4E] border-b-[4px] border-[#20672F] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#2f9c46] active:translate-y-1 active:border-b-0 transition-all font-nunito"
                >
                  <span>{step === 7 ? "حسناً، فلنبدأ!" : "التالي"}</span>
                  {step === 7 ? <Sparkles className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                </button>
                
                {/* Pagination dots — derived from the actual visible step sequence for this mode */}
                {(() => {
                  // Build the ordered list of step numbers that will actually be shown
                  const visibleSteps = [1, 2, 3, 4, 5, 6, 7].filter((s) => {
                    const id = getTargetId(s);
                    if (id === null) return false;
                    // Also check the element exists in DOM (same logic as handleNext)
                    const el = document.getElementById(id);
                    return !!el;
                  });
                  const currentIndex = visibleSteps.indexOf(step);
                  return (
                    <div className="flex justify-center gap-1.5 mt-1">
                      {visibleSteps.map((s, i) => (
                        <div
                          key={s}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === currentIndex ? "w-6 bg-[#35AB4E]" : "w-1.5 bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
