"use client";

import { Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { reportsApi } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import './StudentReport.css';
import html2canvas from 'html2canvas';
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

        const reportElement = reportRef.current;
        const originalWidth = reportElement.style.width;
        const originalHeight = reportElement.style.height;

        setIsDownloading(true);

        // Force desktop width for consistent PDF output
        reportElement.style.width = '1024px';
        reportElement.style.height = 'auto';

        // Wait for styles to apply before capturing
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            // Find the achievements section
            const achievementsSection = reportElement.querySelector('[data-page-section="page2"]');

            if (!achievementsSection) {
                // Fallback to original method if section not found
                const canvas = await html2canvas(reportRef.current, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pageHeight;
                while (heightLeft > 0) {
                    position -= pageHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
                    heightLeft -= pageHeight;
                }
                const safeName = String(report.username || 'report').trim() || 'report';
                pdf.save(`${safeName}-report.pdf`);
                return;
            }

            // Temporarily hide page 2 content
            const page2Elements = reportElement.querySelectorAll('[data-page-section="page2"]');
            page2Elements.forEach((el: any) => el.style.display = 'none');

            // Capture page 1
            const canvas1 = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            });

            // Show page 2, hide page 1
            page2Elements.forEach((el: any) => el.style.display = '');
            const page1Elements = reportElement.querySelectorAll('[data-page-section="page1"]');
            page1Elements.forEach((el: any) => el.style.display = 'none');

            // Capture page 2
            const canvas2 = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            });

            // Restore all elements
            page1Elements.forEach((el: any) => el.style.display = '');

            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Add page 1
            const imgData1 = canvas1.toDataURL('image/png');
            const imgWidth1 = pageWidth;
            const imgHeight1 = (canvas1.height * imgWidth1) / canvas1.width;
            pdf.addImage(imgData1, 'PNG', 0, 0, imgWidth1, imgHeight1, undefined, 'FAST');

            // Add page 2
            pdf.addPage();
            const imgData2 = canvas2.toDataURL('image/png');
            const imgWidth2 = pageWidth;
            const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
            pdf.addImage(imgData2, 'PNG', 0, 0, imgWidth2, imgHeight2, undefined, 'FAST');

            const safeName = String(report.username || 'report').trim() || 'report';
            pdf.save(`${safeName}-report.pdf`);
        } catch (err) {
            console.error('Failed to generate PDF:', err);
        } finally {
            // Restore original styles
            reportElement.style.width = originalWidth;
            reportElement.style.height = originalHeight;
            setIsDownloading(false);
        }
    };

    return (
        <div className={`report-container ${isDownloading ? 'is-exporting' : ''}`} dir="rtl" ref={reportRef}>
            <div data-page-section="page1">
                {/* HEADER */}
                <div className="report-header">
                    <div className="report-actions">
                        <button
                            type="button"
                            className="report-download-btn"
                            onClick={downloadPdf}
                            disabled={isDownloading}
                            aria-label="Download PDF"
                            title="تحميل PDF"
                        >
                            {isDownloading ? (
                                <>
                                    <span className="mr-1">جاري التحميل...</span>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </>
                            ) : (
                                <>
                                    <span className="mr-1">تحميل</span>
                                    <Download className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="84" height="84" rx="42" fill="#DF929C" />
                        <path d="M51.6497 50.6251C51.5838 50.7391 51.4891 50.8338 51.3751 50.8997C51.261 50.9655 51.1316 51.0001 51 51.0001H33C32.8684 51 32.7391 50.9652 32.6252 50.8993C32.5113 50.8335 32.4168 50.7388 32.351 50.6248C32.2853 50.5108 32.2507 50.3815 32.2507 50.2499C32.2508 50.1183 32.2854 49.9891 32.3512 49.8751C33.779 47.4067 35.9793 45.6367 38.5472 44.7976C37.277 44.0415 36.2902 42.8893 35.7382 41.518C35.1862 40.1468 35.0997 38.6322 35.4918 37.207C35.8839 35.7818 36.733 34.5247 37.9087 33.6287C39.0845 32.7328 40.5218 32.2476 42 32.2476C43.4781 32.2476 44.9155 32.7328 46.0912 33.6287C47.2669 34.5247 48.116 35.7818 48.5081 37.207C48.9003 38.6322 48.8137 40.1468 48.2617 41.518C47.7098 42.8893 46.7229 44.0415 45.4528 44.7976C48.0206 45.6367 50.2209 47.4067 51.6487 49.8751C51.7147 49.989 51.7495 50.1183 51.7497 50.25C51.7498 50.3816 51.7153 50.511 51.6497 50.6251Z" fill="#F4DBDE" />
                    </svg>

                    <h1 className="report-title">{report.username}</h1>

                    <div className="report-header-row">
                        <div className="header-top-left">
                            <svg className="ml-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.75 6H19.5V4.5C19.5 4.30109 19.421 4.11032 19.2803 3.96967C19.1397 3.82902 18.9489 3.75 18.75 3.75H5.25C5.05109 3.75 4.86032 3.82902 4.71967 3.96967C4.57902 4.11032 4.5 4.30109 4.5 4.5V6H2.25C1.85218 6 1.47064 6.15804 1.18934 6.43934C0.908035 6.72064 0.75 7.10218 0.75 7.5V9C0.75 9.99456 1.14509 10.9484 1.84835 11.6517C2.19657 11.9999 2.60997 12.2761 3.06494 12.4645C3.51991 12.653 4.00754 12.75 4.5 12.75H4.84219C5.28398 14.1501 6.12634 15.39 7.26516 16.3166C8.40398 17.2431 9.78933 17.8157 11.25 17.9634V20.25H9C8.80109 20.25 8.61032 20.329 8.46967 20.4697C8.32902 20.6103 8.25 20.8011 8.25 21C8.25 21.1989 8.32902 21.3897 8.46967 21.5303C8.61032 21.671 8.80109 21.75 9 21.75H15C15.1989 21.75 15.3897 21.671 15.5303 21.5303C15.671 21.3897 15.75 21.1989 15.75 21C15.75 20.8011 15.671 20.6103 15.5303 20.4697C15.3897 20.329 15.1989 20.25 15 20.25H12.75V17.9606C15.7444 17.6578 18.2288 15.5569 19.1325 12.75H19.5C20.4946 12.75 21.4484 12.3549 22.1516 11.6517C22.8549 10.9484 23.25 9.99456 23.25 9V7.5C23.25 7.10218 23.092 6.72064 22.8107 6.43934C22.5294 6.15804 22.1478 6 21.75 6ZM4.5 11.25C3.90326 11.25 3.33097 11.0129 2.90901 10.591C2.48705 10.169 2.25 9.59674 2.25 9V7.5H4.5V10.5C4.5 10.75 4.51219 11 4.53656 11.25H4.5ZM21.75 9C21.75 9.59674 21.5129 10.169 21.091 10.591C20.669 11.0129 20.0967 11.25 19.5 11.25H19.4531C19.4839 10.9729 19.4995 10.6944 19.5 10.4156V7.5H21.75V9Z" fill="#0B2210" />
                            </svg>
                            مجموع النقاط: {totalPoints}
                        </div>

                        <div className="header-top-right">
                            <svg className="ml-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.75 6.75V10.7869L16.1644 9.07875C16.2525 9.03468 16.3485 9.0084 16.4468 9.00141C16.5451 8.99443 16.6438 9.00687 16.7373 9.03804C16.8308 9.0692 16.9173 9.11848 16.9917 9.18305C17.0662 9.24762 17.1272 9.32623 17.1713 9.41438C17.2153 9.50253 17.2416 9.5985 17.2486 9.6968C17.2556 9.79511 17.2431 9.89383 17.212 9.98733C17.1808 10.0808 17.1315 10.1673 17.067 10.2417C17.0024 10.3162 16.9238 10.3772 16.8356 10.4213L12.3356 12.6713C12.2212 12.7285 12.0941 12.7555 11.9663 12.7498C11.8386 12.744 11.7144 12.7057 11.6056 12.6385C11.4968 12.5712 11.407 12.4772 11.3448 12.3655C11.2825 12.2537 11.2499 12.1279 11.25 12V6.75C11.25 6.55109 11.329 6.36033 11.4697 6.21967C11.6103 6.07902 11.8011 6 12 6C12.1989 6 12.3897 6.07902 12.5303 6.21967C12.671 6.36033 12.75 6.55109 12.75 6.75ZM12 20.25C10.3683 20.25 8.77326 19.7661 7.41655 18.8596C6.05984 17.9531 5.00242 16.6646 4.378 15.1571C3.75358 13.6497 3.5902 11.9909 3.90853 10.3905C4.22685 8.79017 5.01259 7.32016 6.16637 6.16637C7.32016 5.01259 8.79017 4.22685 10.3905 3.90853C11.9909 3.5902 13.6497 3.75358 15.1571 4.378C16.6646 5.00242 17.9531 6.05984 18.8596 7.41655C19.7661 8.77326 20.25 10.3683 20.25 12C20.25 12.1989 20.329 12.3897 20.4697 12.5303C20.6103 12.671 20.8011 12.75 21 12.75C21.1989 12.75 21.3897 12.671 21.5303 12.5303C21.671 12.3897 21.75 12.1989 21.75 12C21.75 10.0716 21.1782 8.18657 20.1068 6.58319C19.0355 4.97982 17.5127 3.73013 15.7312 2.99218C13.9496 2.25422 11.9892 2.06114 10.0979 2.43735C8.20656 2.81355 6.46928 3.74215 5.10571 5.10571C3.74215 6.46928 2.81355 8.20656 2.43735 10.0979C2.06114 11.9892 2.25422 13.9496 2.99218 15.7312C3.73013 17.5127 4.97982 19.0355 6.58319 20.1068C8.18657 21.1782 10.0716 21.75 12 21.75C12.1989 21.75 12.3897 21.671 12.5303 21.5303C12.671 21.3897 12.75 21.1989 12.75 21C12.75 20.8011 12.671 20.6103 12.5303 20.4697C12.3897 20.329 12.1989 20.25 12 20.25ZM20.1206 18.6206C20.5404 18.2011 20.8263 17.6666 20.9422 17.0846C21.0581 16.5026 20.9988 15.8993 20.7718 15.351C20.5448 14.8027 20.1603 14.3341 19.6669 14.0043C19.1735 13.6746 18.5934 13.4986 18 13.4986C17.4066 13.4986 16.8265 13.6746 16.3331 14.0043C15.8397 14.3341 15.4552 14.8027 15.2282 15.351C15.0012 15.8993 14.9419 16.5026 15.0578 17.0846C15.1737 17.6666 15.4596 18.2011 15.8794 18.6206C15.0896 19.1251 14.5173 19.9071 14.2753 20.8125C14.2467 20.9232 14.2438 21.039 14.2669 21.151C14.2899 21.263 14.3382 21.3682 14.4081 21.4587C14.478 21.5492 14.5677 21.6224 14.6703 21.6729C14.7729 21.7234 14.8857 21.7498 15 21.75H21C21.115 21.75 21.2284 21.7236 21.3315 21.6728C21.4346 21.622 21.5247 21.5481 21.5947 21.457C21.6647 21.3658 21.7129 21.2598 21.7354 21.1471C21.758 21.0343 21.7543 20.918 21.7247 20.8069C21.4814 19.9036 20.9093 19.1238 20.1206 18.6206Z" fill="#0B2210" />
                            </svg>
                            وقت الاستخدام: {usageHoursDisplay}
                        </div>
                    </div>
                </div>

                {/* STREAKS */}
                <div className="streaks-grid">
                    <div className="max-streak-card">
                        <div className="card-label">🔥 أطول سلسلة</div>
                        <div className="streak-value-row">
                            <div className="big-number">{report.longestStreak || 0}</div>
                            <div className="small-text">يوم</div>
                        </div>
                    </div>

                    <div className="streak-card">
                        <div className="card-label">⭐ سلسلة انجازات حالية</div>
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
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.5 5.25V18.75C22.5 18.9489 22.421 19.1397 22.2803 19.2803C22.1397 19.421 21.9489 19.5 21.75 19.5H15C14.4042 19.5 13.8328 19.7363 13.411 20.157C12.9892 20.5778 12.7515 21.1486 12.75 21.7444C12.753 21.8975 12.7085 22.0478 12.6225 22.1746C12.5365 22.3013 12.4134 22.3983 12.27 22.4522C12.1562 22.4961 12.0334 22.5116 11.9122 22.4973C11.791 22.483 11.6752 22.4394 11.5747 22.3702C11.4742 22.3011 11.3921 22.2084 11.3355 22.1003C11.279 21.9923 11.2496 21.872 11.25 21.75C11.25 21.1533 11.0129 20.581 10.591 20.159C10.169 19.7371 9.59674 19.5 9 19.5H2.25C2.05109 19.5 1.86032 19.421 1.71967 19.2803C1.57902 19.1397 1.5 18.9489 1.5 18.75V5.25C1.5 5.05109 1.57902 4.86032 1.71967 4.71967C1.86032 4.57902 2.05109 4.5 2.25 4.5H8.25C9.04565 4.5 9.80871 4.81607 10.3713 5.37868C10.9339 5.94129 11.25 6.70435 11.25 7.5V15.7247C11.2474 15.9182 11.3182 16.1056 11.4481 16.2491C11.578 16.3926 11.7575 16.4816 11.9503 16.4981C12.0529 16.5049 12.1558 16.4906 12.2526 16.456C12.3494 16.4213 12.4381 16.3672 12.5131 16.2968C12.5881 16.2265 12.6478 16.1415 12.6885 16.0471C12.7293 15.9527 12.7502 15.8509 12.75 15.7481V7.5C12.75 6.70435 13.0661 5.94129 13.6287 5.37868C14.1913 4.81607 14.9544 4.5 15.75 4.5H21.75C21.9489 4.5 22.1397 4.57902 22.2803 4.71967C22.421 4.86032 22.5 5.05109 22.5 5.25Z" fill="#454545" />
                                </svg>
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
            </div>

            {/* ACHIEVEMENTS */}
            <div className="white-card page-break-before" data-page-section="page2">
                <h2 className="section-title">الإنجازات</h2>
                {achievements.length > 0 ? (
                    <div className="achievements-grid">
                        {achievements.map((achievement: any, idx: number) => (
                            <div key={idx} className="achievement-badge">
                                <svg width="83" height="74" viewBox="0 0 83 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 36.9768V44.0727C0 60.5883 18.5802 73.9768 41.5 73.9768C64.4198 73.9768 83 60.5883 83 44.0727V37.4837L0 36.9768Z" fill="#B69001" />
                                    <ellipse cx="41.5" cy="35.9768" rx="41.5" ry="29" fill="#F0BD00" />
                                    <ellipse cx="42" cy="35.4768" rx="38" ry="26.5" fill="#FFB300" />
                                    <path d="M42 9.10581C36.7586 8.57333 30.7774 9.81578 28.3023 10.5258C21.8962 16.383 4 33.3878 4 36.7956C4 41.0546 7.09302 46.3944 8.86047 47.9768L42 9.10581Z" fill="#FFD539" />
                                    <path d="M71.4999 19.4768C66.9999 12.9771 50.2277 8.3202 47.8047 9.04716C41.5335 15.0446 11.8756 50.1374 13.5 52.9768C15.6628 56.7575 31.5 61.977 39.1257 61.977C39.1257 61.977 45.6785 49.2755 51.9999 40.9768C58.3214 32.6781 71.4999 19.4768 71.4999 19.4768Z" fill="#FFD539" />
                                    <path d="M41.5 13L45 24L56 24L47.5 31L50.5 43L41.5 35L32.5 43L35.5 31L26 24L37 24L41.5 13Z" fill="#FFFFFF" stroke="#FF8C00" strokeWidth="2" />
                                </svg>
                                <div className="achievement-name">{achievement.name || 'إنجاز'}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-[#9ca3af] py-8">لا توجد إنجازات حتى الآن</div>
                )}
            </div>

            {/* CERTIFICATES */}
            <div className="white-card" data-page-section="page2">
                <h2 className="section-title">شهادات</h2>
                {certificates.length > 0 ? (
                    <div className="certificates-list">
                        {certificates.map((cert: any, idx: number) => (
                            <div key={idx} className="certificate-card">
                                <div className="certificate-icon">
                                    <svg width="30" height="30" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M30.5794 19.5808V19.5679C30.5771 19.5582 30.5741 19.5487 30.5703 19.5395C30.4848 19.306 30.3853 19.0779 30.2726 18.8563L24.9139 6.67724C24.8623 6.55993 24.7893 6.45326 24.6987 6.36271C24.3156 5.97957 23.8608 5.67564 23.3603 5.46828C22.8598 5.26092 22.3233 5.15419 21.7815 5.15419C21.2397 5.15419 20.7032 5.26092 20.2027 5.46828C19.7022 5.67564 19.2474 5.97957 18.8644 6.36271C18.6716 6.55564 18.5632 6.81705 18.5627 7.08974V10.3124H14.4377V7.08974C14.4378 6.95427 14.4112 6.82011 14.3595 6.69492C14.3077 6.56974 14.2318 6.45597 14.1361 6.36013C13.753 5.97699 13.2982 5.67306 12.7977 5.4657C12.2972 5.25834 11.7607 5.15161 11.2189 5.15161C10.6771 5.15161 10.1407 5.25834 9.64014 5.4657C9.13961 5.67306 8.68483 5.97699 8.30178 6.36013C8.2111 6.45069 8.13809 6.55735 8.0865 6.67466L2.73303 18.8563C2.62026 19.0779 2.52083 19.306 2.43525 19.5395C2.43167 19.5483 2.42865 19.5574 2.42623 19.5666C2.42623 19.5666 2.42623 19.5769 2.42623 19.5808C1.89383 21.1191 1.98908 22.8052 2.69134 24.2738C3.39359 25.7423 4.64628 26.875 6.17791 27.4263C7.70954 27.9776 9.39673 27.9031 10.8738 27.219C12.3509 26.5349 13.4989 25.2962 14.069 23.7715C14.3201 23.0866 14.4467 22.3624 14.4429 21.6329V12.3749H18.5679V21.6342C18.5641 22.3637 18.6907 23.0879 18.9417 23.7728C19.5118 25.2975 20.6598 26.5362 22.1369 27.2203C23.614 27.9044 25.3012 27.9789 26.8328 27.4276C28.3645 26.8763 29.6171 25.7436 30.3194 24.275C31.0217 22.8065 31.1169 21.1203 30.5845 19.582L30.5794 19.5808ZM12.1264 23.0612C11.7456 24.0773 10.9798 24.9024 9.99482 25.3578C9.00987 25.8132 7.88516 25.8621 6.8644 25.494C5.84363 25.1259 5.00903 24.3703 4.54143 23.3911C4.07383 22.412 4.0109 21.2879 4.36627 20.2627L4.59959 19.7303C5.02843 18.9151 5.71774 18.267 6.55771 17.889C7.39767 17.5111 8.33996 17.4252 9.23443 17.645C10.1289 17.8647 10.9241 18.3775 11.4933 19.1017C12.0625 19.8258 12.3729 20.7196 12.3752 21.6407V21.6561C12.3751 22.1371 12.2909 22.6144 12.1264 23.0664V23.0612ZM26.1682 25.5324C25.5446 25.7606 24.8752 25.835 24.2168 25.7491C23.5584 25.6632 22.9304 25.4197 22.3863 25.0392C21.8421 24.6586 21.3979 24.1524 21.0913 23.5634C20.7847 22.9744 20.6248 22.3201 20.6252 21.6561V21.642C20.6286 20.7213 20.9399 19.8283 21.5095 19.105C22.0791 18.3818 22.8743 17.8699 23.7685 17.6508C24.6627 17.4317 25.6044 17.518 26.4439 17.896C27.2833 18.274 27.9722 18.922 28.4008 19.7367L28.6342 20.2691C29.0009 21.2943 28.9475 22.4229 28.4856 23.4088C28.0237 24.3948 27.1906 25.1581 26.1682 25.5324Z" fill="#38501B" />
                                    </svg>
                                </div>
                                <div className="certificate-title">{cert.name || 'شهادة'}</div>
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
