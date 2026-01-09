
import ReportContent from './ReportContent';

export async function generateStaticParams() {
  return [];
}

export default function StudentReportPage({ params }: { params: { studentId: string } }) {
  return <ReportContent studentId={params.studentId} />;
}

