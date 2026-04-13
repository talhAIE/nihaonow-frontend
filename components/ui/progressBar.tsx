import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProgressBarProps {
    unit?: string;
    lesson?: string;
    progress?: number;
    dir?: 'ltr' | 'rtl';
    onClick?: () => void;
    onBackClick?: () => void;
    title?: string;
    actionSlot?: React.ReactNode;
}

export default function ProgressBar({
    unit = '',
    lesson = "",
    progress = 0,
    dir,
    onClick,
    onBackClick,
    title = "تخطي",
    actionSlot
}: ProgressBarProps) {
    const [effectiveDir, setEffectiveDir] = useState<'ltr' | 'rtl'>(dir ?? 'rtl');
    const [mounted, setMounted] = useState(false);
    const router = useRouter();


    useEffect(() => {
        setMounted(true);
        if (!dir && typeof document !== 'undefined') {
            const d = (document.documentElement?.dir as 'ltr' | 'rtl') || 'rtl';
            setEffectiveDir(d);
        }
    }, [dir]);

    // Use transform scaleX to fill the bar instead of absolute positioning.
    const isRtl = effectiveDir === 'rtl';
    const transformOrigin = isRtl ? 'right center' : 'left center';
    const progressText = isRtl ? `تم إنجاز %${progress}` : `${progress}% complete`;

    return (
        <div className="" dir={effectiveDir}>
            <div className="mx-auto">
                {isRtl ? (
                    <div className="flex w-full items-center gap-2 sm:gap-4 mb-6 flex-wrap sm:flex-nowrap justify-between">
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
                            <button
                                onClick={onBackClick || onClick}
                                className="inline-flex items-center gap-[4px] h-[33px] py-[6px] px-[10px] sm:px-[16px] opacity-100 rounded-[32px] bg-[#E5E5E5] border-b-2 border-b-[#636363] text-gray-600 transition-colors whitespace-nowrap flex-shrink-0 text-sm sm:text-base"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                {title}
                            </button>
                            <div className="text-semibold-16 align-middle text-xs sm:text-sm md:text-base break-words">
                                {mounted ? `${unit} ${lesson}` : "\u00A0"}
                            </div>
                        </div>
                        {actionSlot && <div className="flex items-center">{actionSlot}</div>}
                    </div>
                ) : (
                    <div className="flex w-full items-center gap-2 sm:gap-4 mb-6 flex-wrap sm:flex-nowrap justify-between">
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
                            <div className="text-semibold-16 align-middle text-xs sm:text-sm md:text-base break-words">
                                {mounted ? `${unit} ${lesson}` : "\u00A0"}
                            </div>
                            <button
                                onClick={onBackClick || onClick}
                                className="inline-flex items-center gap-[4px] h-[33px] py-[6px] px-[10px] sm:px-[16px] opacity-100 rounded-[32px] bg-[#E5E5E5] border-b-2 border-b-[#636363] text-gray-600 transition-colors whitespace-nowrap flex-shrink-0 text-sm sm:text-base"
                            >
                                {title}
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                            </button>
                        </div>
                        {actionSlot && <div className="flex items-center">{actionSlot}</div>}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm p-1">
                    <div className="relative">
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-orange-500 rounded-full ${isRtl ? "transition-transform" : "transition-[width]"} duration-500`}
                                style={
                                    isRtl
                                        ? ({ width: '100%', transformOrigin, transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` } as React.CSSProperties)
                                        : ({ width: `${Math.max(0, Math.min(100, progress))}%` } as React.CSSProperties)
                                }
                                aria-valuenow={progress}
                                role="progressbar"
                            />
                        </div>

                        {isRtl ? (
                            <div className="mt-3 text-center flex items-center justify-between">
                                <span className="text-gray-800 font-bold" style={{ fontSize: '14px' }}>{progressText}</span>
                                <span className="text-sm text-gray-600 mr-2">{`100%`}</span>
                            </div>
                        ) : (
                            <div className="mt-3 text-center flex items-center justify-between">
                                <span className="text-gray-800 font-semibold" style={{ fontSize: '14px' }}>{progressText}</span>
                                <span className="text-sm text-gray-600 ml-2">{`100%`}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
