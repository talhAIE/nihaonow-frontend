"use client";
import { useState, useLayoutEffect, useCallback, useEffect } from "react";
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

interface AchievementsGuideProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'awards' | 'certificates';
  onTabChange: (tab: 'awards' | 'certificates') => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const STEPS = [
  { 
    id: 'awards-map-container', 
    targetId: 'awards-map-container',
    tab: 'awards',
    title: 'رحلة التعلم', 
    desc: 'كل خطوة تقربك من إنجاز جديد' 
  },
  { 
    id: 'reward-claim', 
    targetId: 'reward-node-highlight',
    tab: 'awards',
    title: 'اضغط للاستلام', 
    desc: 'لا تنس استلام مكافآتك' 
  },
  { 
    id: 'certificates-intro', 
    targetId: 'certificates-grid',
    tab: 'certificates',
    title: 'شهاداتك', 
    desc: 'تحصل على شهادات عند إكمال الدروس، الحفاظ على السلسلة، والتقدم في المستويات' 
  },
  { 
    id: 'certificate-details', 
    targetId: 'certificate-scroll-highlight',
    tab: 'certificates',
    title: 'استلم شهادتك', 
    desc: 'يمكنك تحميلها أو مشاركتها مع الآخرين' 
  },
];

export function AchievementsGuide({ isOpen, onClose, activeTab, onTabChange }: AchievementsGuideProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const currentStep = STEPS[stepIndex] || STEPS[0];

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  // Sync tab with step requirements
  useEffect(() => {
    if (isOpen && currentStep.tab !== activeTab) {
      onTabChange(currentStep.tab as 'awards' | 'certificates');
    }
  }, [isOpen, stepIndex, currentStep.tab, activeTab, onTabChange]);

  const updateTargetRect = useCallback(() => {
    checkMobile();
    if (currentStep.targetId) {
      const element = document.getElementById(currentStep.targetId);
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
  }, [currentStep?.targetId, checkMobile]);

  useLayoutEffect(() => {
    if (isOpen) {
      if (currentStep.targetId) {
        const element = document.getElementById(currentStep.targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.bottom > window.innerHeight || rect.top < 0) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Wait for scroll and tab switch
            const timer = setTimeout(updateTargetRect, 600);
            return () => clearTimeout(timer);
          }
        }
      }

      // Give time for tab switch and rendering
      const timer = setTimeout(updateTargetRect, 400);
      window.addEventListener("resize", updateTargetRect);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateTargetRect);
      };
    }
  }, [isOpen, stepIndex, activeTab, updateTargetRect, currentStep?.targetId]);

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    onClose();
    localStorage.setItem('achievements_guide_seen', 'true');
    setTimeout(() => setStepIndex(0), 300);
  };

  if (!isOpen) return null;

  const tooltipPosition = () => {
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    
    const PADDING = 24;
    const TOOLTIP_WIDTH = 305;
    const TOOLTIP_HEIGHT = 200;

    if (isMobile) {
        let mobileTop = targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2;
        if (mobileTop + TOOLTIP_HEIGHT / 2 > window.innerHeight - 20) {
            mobileTop = targetRect.top - PADDING - TOOLTIP_HEIGHT / 2;
        }

        if (mobileTop < TOOLTIP_HEIGHT / 2 + 10) {
            return { 
                bottom: "10px", 
                left: "50%", 
                transform: "translateX(-50%)",
                top: "auto"
            };
        }

        return { 
            top: mobileTop, 
            left: "50%", 
            transform: "translate(-50%, -50%)"
        };
    }

    let top = targetRect.top + targetRect.height / 2;
    let left = targetRect.left + targetRect.width / 2;
    let transform = "translate(-50%, -50%)";

    // Default: try to place below
    top = targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2;
    
    // If it goes off screen bottom, place above
    if (top + TOOLTIP_HEIGHT / 2 > window.innerHeight - 20) {
        top = targetRect.top - PADDING - TOOLTIP_HEIGHT / 2;
    }

    // Specific tweaks
    if (currentStep.targetId === 'reward-node-highlight') {
        left = targetRect.left - 100;
    } else if (currentStep.targetId === 'certificate-scroll-highlight') {
        left = targetRect.left - 200;
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
          <DialogPrimitive.Title className="sr-only">Achievements Guide</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">A guide to help you understand your awards and certificates.</DialogPrimitive.Description>
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
                className="box-border flex flex-col items-center p-4 gap-[22px] w-[calc(100vw-40px)] max-w-[305px] h-fit min-h-[200px] bg-white border-[1.6px] border-[#ECECEC] border-b-[4px] shadow-[0px_4px_12px_rgba(0,0,0,0.2)]"
                style={{ borderRadius: "16px 16px 16px 16px" }}
              >
                {/* Header */}
                <div className="relative flex flex-row items-center w-full h-[36px]">
                  <button
                    onClick={handleFinish}
                    className="box-border flex items-center justify-center p-2 w-8 h-8 bg-[#E2E2E2] border border-[#ECECEC] rounded-[8px] hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4 text-[#454545]" />
                  </button>
                  <div className="flex flex-row items-center justify-center gap-2 w-full">
                    <Sparkles className="text-[#FFCB08]" size={24} />
                    <h3 className="font-almarai font-bold text-[20px] sm:text-[22px] leading-[26px] sm:leading-[28px] text-[#282828] text-center">
                      {currentStep.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="w-full text-right" dir="rtl" style={{ marginTop: '-10px' }}>
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
                      {stepIndex === 1 ? 'تم' : stepIndex === STEPS.length - 1 ? 'رائع' : 'التالي'}
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
