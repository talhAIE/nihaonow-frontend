"use client";
import { useState, useLayoutEffect, useCallback } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { 
  ChevronLeft, 
  X, 
  Sparkles
} from "lucide-react";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-nunito",
});

interface LeaderboardGuideProps {
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
  { 
    id: 'leaderboard-top-cards', 
    icon: <Sparkles className="text-[#FFCB08]" size={24} />, 
    title: 'أفضل 3 طلاب', 
    desc: 'هؤلاء هم الطلاب الأكثر نشاطاً هذا الشهر' 
  },
  { 
    id: 'leaderboard-all-students', 
    icon: <Sparkles className="text-[#FFCB08]" size={24} />, 
    title: 'جميع الطلاب', 
    desc: 'شاهد ترتيبك بين باقي الطلاب' 
  },
  { 
    id: 'leaderboard-sample-metrics', 
    icon: <Sparkles className="text-[#FFCB08]" size={24} />, 
    title: 'نشاطك', 
    desc: 'كلما تعلمت أكثر، ارتفع ترتيبك' 
  },
];

export function LeaderboardGuide({ isOpen, onClose }: LeaderboardGuideProps) {
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
    setTimeout(() => setStepIndex(0), 300);
  };

  if (!isOpen) return null;

  const tooltipPosition = () => {
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    
    let top = targetRect.top + targetRect.height / 2;
    let left = targetRect.left + targetRect.width / 2;
    let transform = "translate(-50%, -50%)";

    if (currentStep.id === 'leaderboard-top-cards') {
        top = targetRect.top + targetRect.height + 120;
    } else if (currentStep.id === 'leaderboard-all-students') {
        top = targetRect.top + 100;
        left = targetRect.left + 50;
    } else if (currentStep.id === 'leaderboard-sample-metrics') {
        top = targetRect.top - 120;
        left = targetRect.left + targetRect.width / 2;
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
              className="absolute z-10 rounded-[24px] transition-all duration-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] ring-4 ring-[#FFCB08]"
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            />
          )}

          {/* Content Wrapper */}
          <div 
            className="absolute z-20 animate-in fade-in zoom-in-95 duration-500 pointer-events-auto"
            style={tooltipPosition()}
          >
            <div className="flex flex-row items-center gap-[20px] transition-all duration-300">
              {/* Tooltip Card */}
              <div
                className="box-border flex flex-col items-center p-4 gap-[22px] w-[305px] h-fit min-h-[200px] bg-white border-[1.6px] border-[#ECECEC] border-b-[4px] shadow-[0px_4px_12px_rgba(0,0,0,0.2)]"
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
                      {stepIndex === STEPS.length - 1 ? 'رائع' : 'التالي'}
                    </span>
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>

                  {/* Pagination Indicator */}
                  <div className="flex flex-row items-center gap-1 w-full justify-center overflow-hidden">
                    {STEPS.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all ${i === stepIndex ? 'w-4 bg-[#35AB4E]' : 'w-1 bg-[#B1B1B1]'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
