import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { ChevronRight } from 'lucide-react';

interface ProgressBarProps {
    unit?: string;
    lesson?: string;
    progress?: number;
    dir?: 'ltr' | 'rtl';
    onClick?: () => void;
    title?: string;
}

export default function ProgressBar({
    unit = '',
    lesson = "",
    progress = 0,
    dir,
    onClick,
    title = "تخطي"
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
    const transformOrigin = effectiveDir === 'rtl' ? 'right center' : 'left center';

    return (
        <div className="" dir={effectiveDir}>
            <div className="mx-auto">
                <div className={`flex gap-2 sm:gap-4 items-center mb-6 flex-wrap sm:flex-nowrap ${effectiveDir === 'rtl' ? 'flex-row' : ''}`}>
                    <button
                        onClick={onClick}
                        className="inline-flex items-center gap-[4px] h-[33px] py-[6px] px-[10px] sm:px-[16px] opacity-100 rounded-[32px] bg-[#E5E5E5] border-b-2 border-b-[#636363] text-gray-600 transition-colors whitespace-nowrap flex-shrink-0 text-sm sm:text-base"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {title}
                    </button>
                    <div className="text-semibold-16 align-middle text-xs sm:text-sm md:text-base break-words">
                        {mounted ? `${unit} ${lesson}` : "\u00A0"}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-1">
                    <div className="relative">
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 rounded-full transition-transform duration-500"
                                style={{ width: '100%', transformOrigin, transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` } as React.CSSProperties}
                                aria-valuenow={progress}
                                role="progressbar"
                            />
                        </div>

                        <div className="mt-3 text-center flex items-center justify-between">
                            <span className="text-gray-800 font-bold" style={{ fontSize: '14px' }}>{`تم إنجاز %${progress}`}</span>
                            <span className="text-sm text-gray-600 mr-2">{`100%`}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}