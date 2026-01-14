import { Suspense } from 'react';
import StudentReportContent from './ReportContent';

export default function StudentReportPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-slate-500 font-bold">جاري التحميل...</div>}>
      <StudentReportContent />
    </Suspense>
  );
}
