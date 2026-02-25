"use client";
import { useState, useLayoutEffect, useCallback, useRef } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 305, height: 200 });

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
          const rect = element.getBoundingClientRect();
          // Only scroll if the TOP of the element is completely outside the viewport
          if (rect.top > window.innerHeight || rect.top < 0) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Measure tooltip size whenever step changes
  useLayoutEffect(() => {
    if (isOpen && tooltipRef.current) {
      const { width, height } = tooltipRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setTooltipSize({ width, height });
      }
    }
  }, [isOpen, stepIndex, targetRect]);

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

    // Desktop: try Right -> Left -> Top -> Bottom (sections are wide, side placement is best)
    const positions = [
      { top: targetRect.top + targetRect.height / 2, left: targetRect.left + targetRect.width + PADDING + TOOLTIP_WIDTH / 2 }, // Right
      { top: targetRect.top + targetRect.height / 2, left: targetRect.left - PADDING - TOOLTIP_WIDTH / 2 }, // Left
      { top: targetRect.top - PADDING - TOOLTIP_HEIGHT / 2, left: Math.min(targetRect.left + TOOLTIP_WIDTH / 2 + 20, screenWidth - TOOLTIP_WIDTH / 2 - 20) }, // Top (left-clamped)
      { top: targetRect.top + targetRect.height + PADDING + TOOLTIP_HEIGHT / 2, left: Math.min(targetRect.left + TOOLTIP_WIDTH / 2 + 20, screenWidth - TOOLTIP_WIDTH / 2 - 20) }, // Bottom (left-clamped)
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

    // Standard positions failed. Try top-right corner near the element first, then viewport corners.
    // This handles full-width tall sections where no standard placement fits.
    const cornerPositions = [
      { top: targetRect.top + TOOLTIP_HEIGHT / 2 + 20, left: screenWidth - TOOLTIP_WIDTH / 2 - 20 }, // Near-top right edge
      { top: targetRect.top + TOOLTIP_HEIGHT / 2 + 20, left: TOOLTIP_WIDTH / 2 + 20 }, // Near-top left edge
      { top: TOOLTIP_HEIGHT / 2 + 20, left: screenWidth - TOOLTIP_WIDTH / 2 - 20 }, // Top-right corner
      { top: TOOLTIP_HEIGHT / 2 + 20, left: TOOLTIP_WIDTH / 2 + 20 }, // Top-left corner
      { top: screenHeight - TOOLTIP_HEIGHT / 2 - 20, left: screenWidth - TOOLTIP_WIDTH / 2 - 20 }, // Bottom-right corner
      { top: screenHeight - TOOLTIP_HEIGHT / 2 - 20, left: TOOLTIP_WIDTH / 2 + 20 }, // Bottom-left corner
    ];

    for (const pos of cornerPositions) {
      const inScreen = pos.top - TOOLTIP_HEIGHT / 2 > 10 &&
                       pos.top + TOOLTIP_HEIGHT / 2 < screenHeight - 10 &&
                       pos.left - TOOLTIP_WIDTH / 2 > 10 &&
                       pos.left + TOOLTIP_WIDTH / 2 < screenWidth - 10;
      if (inScreen && !overlaps(pos.top, pos.left)) {
        return { top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" };
      }
    }

    // Absolute last resort: top-right corner (target truly fills the whole screen)
    return { top: TOOLTIP_HEIGHT / 2 + 20, left: screenWidth - TOOLTIP_WIDTH / 2 - 20, transform: "translate(-50%, -50%)" };

  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && handleFinish()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-transparent" />
        
        <DialogPrimitive.Content
          className={`fixed inset-0 z-[100] outline-none ${nunito.variable} pointer-events-none`}
        >
          <DialogPrimitive.Title className="sr-only">Leaderboard Guide</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">A guide to help you understand the leaderboard and ranking system.</DialogPrimitive.Description>
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
            ref={tooltipRef}
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
                <div className="flex flex-row items-center justify-between w-full h-[36px]">
                  <div className="flex flex-row items-center justify-center gap-2 flex-1">
                    <span className="">{currentStep.icon}</span>
                    <h3 className="font-almarai font-bold text-[20px] sm:text-[22px] leading-[26px] sm:leading-[28px] text-[#282828] text-center">
                      {currentStep.title}
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
