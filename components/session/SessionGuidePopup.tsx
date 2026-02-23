"use client";
import { useState, useLayoutEffect, useCallback } from "react";
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
      case 5: return "feedback-button";
      case 6: return "user-guide-button";
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
    while (nextStep <= 6) {
      const id = getTargetId(nextStep);
      const element = id ? document.getElementById(id) : null;
      // Skip if explicitly returned null OR if ID exists but element is missing from DOM
      if (id === null || (id && !element)) {
        nextStep++;
        continue;
      }
      break;
    }

    if (nextStep <= 6) {
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
        if (rect.bottom > window.innerHeight || rect.top < 0) {
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

  if (!isOpen) return null;

  const tooltipPosition = () => {
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    
    const PADDING = 24;
    const TOOLTIP_WIDTH = 340;
    const TOOLTIP_HEIGHT = 320; // Increased to be safer
    const halfWidth = TOOLTIP_WIDTH / 2;

    let top = targetRect.top + targetRect.height + PADDING;
    let left = targetRect.left + targetRect.width / 2;
    let transform = "translateX(-50%)";

    // Check if it fits BELOW
    const fitsBelow = top + TOOLTIP_HEIGHT < window.innerHeight - 20;
    
    if (!fitsBelow) {
        // Try ABOVE
        top = targetRect.top - PADDING - TOOLTIP_HEIGHT;
        const fitsAbove = top > 20;
        
        if (!fitsAbove) {
            // FALLBACK: Centered in viewport
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
    }

    if (left < halfWidth + 20) {
        left = 20;
        transform = "none";
    } else if (left > window.innerWidth - halfWidth - 20) {
        left = window.innerWidth - TOOLTIP_WIDTH - 20;
        transform = "none";
    }

    return { 
        top, 
        left, 
        transform,
        width: TOOLTIP_WIDTH,
        maxWidth: "calc(100vw - 40px)"
    };
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
            className="absolute z-20 animate-in fade-in slide-in-from-bottom-5 duration-500 pointer-events-auto"
            style={tooltipPosition()}
          >
            <div className="bg-white rounded-[24px] shadow-2xl border-[1.5px] border-[#ECECEC] border-b-[4px] p-6 w-[calc(100vw-40px)] max-w-[340px] flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <button onClick={handleFinish} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center text-[#F97316]">
                    {step === 1 && <Volume2 className="w-6 h-6" />}
                    {step === 2 && <Sparkles className="w-6 h-6" />}
                    {step === 3 && <Languages className="w-6 h-6" />}
                    {step === 4 && <Mic className="w-6 h-6" />}
                    {step === 5 && <MessageSquare className="w-6 h-6" />}
                    {step === 6 && <BookOpen className="w-6 h-6" />}
                  </div>
                  <h3 className="font-almarai font-extrabold text-[20px] text-[#282828] text-right">
                      {step === 1 && "زر الاستماع"}
                      {step === 2 && "تحتاج مساعدة؟"}
                      {step === 3 && "النطق والصوت"}
                      {step === 4 && "حان دورك!"}
                      {step === 5 && "تحليل النطق"}
                      {step === 6 && "الدليل الشامل"}
                  </h3>
                </div>
              </div>
              
              <p className="text-right text-[#454545] text-lg font-semibold leading-relaxed font-almarai">
                  {step === 1 && "اسمع الكلمة قبل أن تنطقها لتتعرف على اللحن الصحيح!"}
                  {step === 2 && "الشيخ سيقوم بنطق الجملة لك بالصينية. استمع جيداً قبل المحاولة!"}
                  {step === 3 && "هنا تجد اللفظ الصحيح بالصينية (بينيين)."}
                  {step === 4 && "اضغط على الزر وسجل نطقك. سنقوم بتحليله وإعطائك النتيجة فوراً!"}
                  {step === 5 && "بعد التسجيل، انقر هنا لتعرف نقاط القوة والضعف في نطقك."}
                  {step === 6 && "هل نسيت شيئاً؟ يمكنك دائماً مراجعة هذا الدليل بالفيديو من هنا!"}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={step === 6 ? handleFinish : handleNext}
                  className="w-full bg-[#35AB4E] border-b-[4px] border-[#20672F] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#2f9c46] active:translate-y-1 active:border-b-0 transition-all font-nunito"
                >
                  <span>{step === 6 ? "حسناً، فلنبدأ!" : "التالي"}</span>
                  {step === 6 ? <Sparkles className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                </button>
                
                <div className="flex justify-center gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-[#35AB4E]" : "w-1.5 bg-slate-200"}`} 
                    />
                  ))}
              </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
