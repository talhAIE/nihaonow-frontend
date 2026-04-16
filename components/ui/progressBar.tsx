import React, { useEffect, useState } from 'react';
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
    lesson = '',
    progress = 0,
    dir,
    onClick,
    onBackClick,
    title = 'تخطي',
    actionSlot,
}: ProgressBarProps) {
    const [effectiveDir, setEffectiveDir] = useState<'ltr' | 'rtl'>(dir ?? 'rtl');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!dir && typeof document !== 'undefined') {
            const d = (document.documentElement?.dir as 'ltr' | 'rtl') || 'rtl';
            setEffectiveDir(d);
        }
    }, [dir]);

    const isRtl = effectiveDir === 'rtl';
    const transformOrigin = isRtl ? 'right center' : 'left center';
    const progressText = isRtl ? `تم إنجاز %${progress}` : `${progress}% complete`;
    const headerTitle = mounted ? `${unit} ${lesson}`.trim() : '\u00A0';
    const backHandler = onBackClick || onClick;

    return (
        <div dir={effectiveDir}>
            <div className="mx-auto">
                {isRtl ? (
                    <div className="mb-6 flex w-full items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap" dir="ltr">
                        <div className="flex items-center shrink-0">
                            {actionSlot}
                        </div>
                        <div className="ml-auto flex flex-row-reverse items-center gap-2 sm:gap-4">
                            <button
                                onClick={backHandler}
                                className="inline-flex items-center h-[33px] py-[6px] px-[10px] sm:px-[16px] rounded-[32px] bg-[#E5E5E5] border-b-2 border-b-[#636363] text-gray-600 whitespace-nowrap flex-shrink-0 text-sm sm:text-base transition-colors"
                                dir="rtl"
                            >
                                <ChevronRight className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                <span>{title}</span>
                            </button>
                            <div className="text-right text-xs sm:text-sm md:text-base break-words" dir="rtl">
                                {headerTitle}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 flex w-full items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap" dir="ltr">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                            <button
                                onClick={backHandler}
                                className="inline-flex items-center h-[33px] py-[6px] px-[10px] sm:px-[16px] rounded-[32px] bg-[#E5E5E5] border-b-2 border-b-[#636363] text-gray-600 whitespace-nowrap flex-shrink-0 text-sm sm:text-base transition-colors"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                <span>{title}</span>
                            </button>
                            <div className="text-left text-xs sm:text-sm md:text-base break-words min-w-0">
                                {headerTitle}
                            </div>
                        </div>
                        <div className="flex items-center shrink-0">
                            {actionSlot}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm p-1">
                    <div className="relative">
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-orange-500 rounded-full ${isRtl ? 'transition-transform' : 'transition-[width]'} duration-500`}
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
                            <div className="mt-3 flex items-center justify-between text-center" dir="rtl">
                                <span className="text-gray-800 font-bold" style={{ fontSize: '14px' }}>{progressText}</span>
                                <span className="text-sm text-gray-600 mr-2">100%</span>
                            </div>
                        ) : (
                            <div className="mt-3 flex items-center justify-between text-center" dir="ltr">
                                <span className="text-gray-800 font-semibold" style={{ fontSize: '14px' }}>{progressText}</span>
                                <span className="text-sm text-gray-600 ml-2">100%</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
