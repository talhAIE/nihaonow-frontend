"use client";

import { Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { reportsApi } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import './StudentReport.css';
import jsPDF from 'jspdf';

export default function StudentReportContent() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get('studentId');

    const reportRef = useRef<HTMLDivElement | null>(null);

    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!studentId) {
            setIsLoading(false);
            return;
        }

        const fetchReportDetails = async () => {
            try {
                const data = await reportsApi.getStudentReportDetails(studentId);
                setReport(data);
            } catch (err) {
                console.error("Failed to fetch student report details:", err);
                setError("حدث خطأ أثناء تحميل بيانات التقرير.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportDetails();
    }, [studentId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-[#35AB4E] font-bold gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span>جاري تحميل التقرير...</span>
            </div>
        );
    }

    if (!studentId || error || !report) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-slate-500 font-bold space-y-4" dir="rtl">
                <p>{error || "لم يتم العثور على بيانات الطالب"}</p>
                <Link href="/teacher/students" className="px-6 py-2 bg-[#35AB4E] text-white rounded-xl hover:bg-[#2f9c46] transition-colors">
                    عودة لقائمة الطلاب
                </Link>
            </div>
        );
    }

    // Derived values (mimicking the template's logic)
    const totalPoints = report.totalPoints || 0;
    const usageHoursDisplay = `${report.usageHours || 0} ساعة`;
    const monthYear = report.period || 'ديسمبر 2023';
    const progressPercent = report.progressPercent || 0;
    const completedLectures = report.completedLectures || 0;
    const remainingLectures = report.remainingLectures || 0;
    const achievements = report.achievements || [];
    const certificates = report.certificates || [];

    const downloadPdf = async () => {
        if (!reportRef.current || isDownloading) return;
        setIsDownloading(true);

        // Small delay to ensure UI updates before canvas capture
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                compress: true,
            });

            const safeName = String(report.username || 'report').trim() || 'report';

            await new Promise<void>((resolve, reject) => {
                // jsPDF's TS types don't include some plugin options (e.g. pagebreak), so we keep the options typed as `any`.
                const htmlOptions: any = {
                    x: 8,
                    y: 8,
                    margin: [8, 8, 8, 8],
                    autoPaging: 'text',
                    html2canvas: {
                        useCORS: true,
                        backgroundColor: '#ffffff',
                        scrollX: 0,
                        scrollY: 0,
                        foreignObjectRendering: false,
                    },
                    pagebreak: {
                        mode: ['css', 'legacy'],
                        avoid: [
                            '.report-header',
                            '.header-top-left',
                            '.header-top-right',
                            '.white-card',
                            '.stats-row',
                            '.interaction-box',
                            '.certificate-card',
                            '.achievement-badge',
                        ],
                    },
                    callback: () => {
                        try {
                            pdf.save(`${safeName}-report.pdf`);
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    },
                };

                pdf.html(reportRef.current as HTMLElement, htmlOptions);
            });
        } catch (err) {
            console.error('Failed to generate PDF:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className={`report-container ${isDownloading ? 'is-exporting' : ''}`} dir="rtl" ref={reportRef}>
            {/* HEADER */}
            <div className="report-header">
                <div className="report-actions">
                    <button
                        type="button"
                        className="report-download-btn 5/6 h-full flex flex-row-reverse items-center justify-center gap-1.5 px-3 py-2 bg-[#FFFFFF] hover:bg-[#F9C3C2] text-[#8D1716] rounded-xl text-xs font-sans transition-all"
                        onClick={downloadPdf}
                        disabled={isDownloading}
                        aria-label="Download PDF"
                        title="تحميل PDF"
                    >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        <span>تحميل</span>
                    </button>
                </div>
                <img src="/images/report-user-icon.svg" alt="User Icon" width="84" height="84" />

                <h1 className="report-title">{report.username}</h1>

                <div className="report-header-row">
                    <div className="header-top-left">
                        <img src="/images/report-points-icon.svg" alt="Points Icon" width="24" height="24" className="ml-2" />
                        مجموع النقاط: {totalPoints}
                    </div>

                    <div className="header-top-right">
                        <img src="/images/report-time-icon.svg" alt="Time Icon" width="24" height="24" className="ml-2" />
                        وقت الاستخدام: {usageHoursDisplay}
                    </div>
                </div>
            </div>

            {/* STREAKS */}
            <div className="streaks-grid">
                <div className="max-streak-card">
                    <div className="card-label">أطول سلسلة</div>
                    <div className="streak-value-row">
                        <div className="big-number">{report.longestStreak || 0}</div>
                        <div className="small-text">يوم</div>
                    </div>
                </div>

                <div className="streak-card">
                    <div className="card-label">سلسلة انجازات حالية</div>
                    <div className="streak-value-row">
                        <div className="big-number">{report.currentStreak || 0}</div>
                        <div className="small-text">يوم</div>
                    </div>
                </div>
            </div>

            {/* PROGRESS */}
            <div className="white-card">
                <h2 className="section-title">{monthYear}</h2>
                <div className="stats-grid">
                    <div className="stats-row">
                        <div className="stat-label">نتيجة</div>
                        <div className="stat-value">{report.averagePronunciation || 0}</div>
                    </div>
                    <div className="stats-row">
                        <div className="stat-label">رشاقة</div>
                        <div className="stat-value">{report.averageAccuracy || 0}</div>
                    </div>
                    <div className="stats-row">
                        <div className="stat-label">طول</div>
                        <div className="stat-value">{report.averageFluency || 0}</div>
                    </div>
                    <div className="stats-row">
                        <div className="stat-label points-label">مجموع النقاط</div>
                        <div className="stat-value-green">{report.averageCompleteness || 0}</div>
                    </div>
                </div>
            </div>

            <div className="white-card">
                <div className="progress-container">
                    <div className="progress-header">
                        <div className="flex items-center gap-2">
                            <img src="/images/report-time-icon.svg" alt="Time Icon" width="24" height="24" className="ml-2" />
                            <span>تقدم المحاضرات</span>
                        </div>
                        <span>{progressPercent}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                {/* INTERACTIONS */}
                <div className="interaction-grid">
                    <div className="interaction-box pink-box">
                        <div className="interaction-value pink-text">{remainingLectures}</div>
                        <div className="interaction-label">محاضرات متبقية</div>
                    </div>
                    <div className="interaction-box green-box">
                        <div className="interaction-value green-text">{completedLectures}</div>
                        <div className="interaction-label">محاضرات مكتملة</div>
                    </div>
                </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="white-card">
                <h2 className="section-title">الإنجازات</h2>
                {achievements.length > 0 ? (
                    <div className="achievements-grid">
                        {achievements.map((achievement: any, idx: number) => (
                            <div key={idx} className="achievement-badge">
                                <img src="/images/report-achievement-icon.svg" alt="Achievement Icon" width="60" height="50" />
                                <div className="achievement-name">{achievement.name || 'إنجاز'}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-[#9ca3af] py-8">لا توجد إنجازات حتى الآن</div>
                )}
            </div>

            {/* CERTIFICATES */}
            <div className="white-card">
                <h2 className="section-title">الشهادات</h2>
                {certificates.length > 0 ? (
                    <div className="certificates-grid">
                        {certificates.map((cert: any, idx: number) => (
                            <div key={idx} className="certificate-card">
                                <div className="certificate-icon">
                                    <img src="/images/report-certificate-icon.svg" alt="Certificate Icon" width="48" height="48" />
                                </div>
                                <div className="certificate-name">{cert.name || 'شهادة'}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-[#9ca3af] py-8">لا توجد شهادات حتى الآن</div>
                )}
            </div>
        </div>
    );
}
