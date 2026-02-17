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
}: SessionGuidePopupProps) {
  const [step, setStep] = useState(1);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const getTargetId = useCallback((currentStep: number) => {
    switch (currentStep) {
      case 1: return "context-button";
      case 2: return "character-frame";
      case 3: return "pronunciation-column";
      case 4: return "record-button";
      case 5: return "feedback-button";
      case 6: return "user-guide-button";
      default: return null;
    }
  }, []);

  const updateTargetRect = useCallback(() => {
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
  }, [step, getTargetId]);

  useLayoutEffect(() => {
    if (isOpen) {
      const timer = setTimeout(updateTargetRect, 100);
      window.addEventListener("resize", updateTargetRect);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateTargetRect);
      };
    }
  }, [isOpen, step, updateTargetRect]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleFinish = () => {
    onClose();
    setTimeout(() => setStep(1), 300);
  };

  if (!isOpen) return null;

  const tooltipPosition = () => {
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    
    let top = targetRect.top + targetRect.height + 20;
    let left = targetRect.left + targetRect.width / 2;
    let transform = "translateX(-50%)";

    if (top + 280 > window.innerHeight) {
        top = targetRect.top - 300; 
    }

    return { top, left, transform };
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && handleFinish()}>
      <DialogPrimitive.Portal>
        {/* Transparent Overlay to handle clicks but avoid double darkening */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-transparent" />
        
        <DialogPrimitive.Content
          className={`fixed inset-0 z-[100] outline-none ${nunito.variable} pointer-events-none`}
        >
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
            <div className="bg-white rounded-[24px] shadow-2xl border-[1.5px] border-[#ECECEC] border-b-[4px] p-6 w-[340px] flex flex-col gap-5">
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
