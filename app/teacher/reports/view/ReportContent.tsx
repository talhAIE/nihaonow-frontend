"use client";

import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { reportsApi } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { Document, Page, pdfjs } from 'react-pdf';

// Core styles for react-pdf
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;

export default function StudentReportContent() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get('studentId');

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial load
    useEffect(() => {
        if (!studentId) {
            setIsLoading(false);
            return;
        }

        const fetchReportUrl = async () => {
            try {
                const { url } = await reportsApi.getStudentReportUrl(studentId);
                if (url) {
                    setPdfUrl(url);
                } else {
                    setError("تعذر الحصول على رابط التقرير.");
                }
            } catch (err) {
                console.error("Failed to fetch student report URL:", err);
                setError("حدث خطأ أثناء تحميل التقرير.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportUrl();
    }, [studentId]);

    // Handle resize
    const onResize = useCallback(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth);
        }
    }, []);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(onResize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, [onResize]);

    // Document callbacks
    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-[#35AB4E] font-bold gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span>جاري تحميل التقرير...</span>
            </div>
        );
    }

    if (!studentId || error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-slate-500 font-bold space-y-4" dir="rtl">
                <p>{error || "لم يتم العثور على بيانات الطالب"}</p>
                <Link href="/teacher/students" className="px-6 py-2 bg-[#35AB4E] text-white rounded-xl hover:bg-[#2f9c46] transition-colors">
                    عودة لقائمة الطلاب
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen flex flex-col" dir="rtl">
            {/* Content Area */}
            <div
                className="flex-1 w-full bg-slate-100 flex justify-center py-8 px-4 min-h-[500px]"
                ref={containerRef}
            >
                {/* PDF Document */}
                {pdfUrl && (
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(error) => console.error('Error loading PDF:', error)}
                        loading={
                            <div className="flex items-center gap-2 text-slate-400 font-bold">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>جاري تحضير المستند...</span>
                            </div>
                        }
                        className="flex flex-col gap-0 shadow-xl" // gap-0 for no page break feeling, shadow for depth
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                width={containerWidth > 0 ? Math.min(containerWidth - 32, 1000) : 600} // Fallback width
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="border-none"
                            />
                        ))}
                    </Document>
                )}
            </div>
        </div>
    );
}
