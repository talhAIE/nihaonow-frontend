"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Lock, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useTopics } from "@/hooks/useTopics";
import { useSession } from "@/hooks/useSession";
import { useSearchParams } from 'next/navigation';
import { useNavigation } from '@/lib/navigation';
import { useAuthProtection } from "@/hooks/useAuthProtection";

export default function TopicsPage() {
  useAuthProtection();

  const searchParams = useSearchParams();
  const { goToStudentIntroduction } = useNavigation();
  const chapterId = searchParams.get("chapterId")
    ? parseInt(searchParams.get("chapterId")!)
    : null;
  const { topics, loading, error, refetch } = useTopics(chapterId);
  const {
    startSession,
    loading: sessionLoading,
    error: sessionError,
  } = useSession();

  const handleTopicClick = async (topic: any) => {
    if (topic.status === "active") {
      try {
        await startSession(topic.id);
        goToStudentIntroduction();
      } catch (err) {
        console.error("Failed to start session:", err);
      }
    }
  };

  // Colors provided by the user (matching UnitsPage)
  const colors = ['#F98D00', '#8DC743', '#CA495A', '#9CEDBC'];

  // Simple luminance check to decide whether to use light or dark text on a color
  const isLight = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.7;
  };

  return (
    <div className="min-h-screen w-[90%] mx-auto" dir="rtl">
      {/* Content Section */}
      <div className="px-4 py-6 space-y-4">
        {(loading || sessionLoading) && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-brand mb-4" />
            <span className="text-gray-600 font-bold">
              {loading ? "جاري تحميل الدروس..." : "جاري بدء الجلسة..."}
            </span>
          </div>
        )}

        {(error || sessionError) && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center px-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-6 font-bold">{error || sessionError}</p>
              <button
                onClick={refetch}
                className="px-8 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-colors shadow-lg"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {!loading && !error && !sessionLoading && topics.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 font-bold text-lg">لا توجد دروس متاحة لهذه الوحدة</p>
          </div>
        )}

        {/* Dynamic Topics as Cards */}
        {!loading && !error && !sessionLoading && topics.length > 0 && (
          topics.map((topic, idx) => {
            const color = colors[idx % colors.length];
            const light = isLight(color);
            return (
              <Card
                key={topic.id}
                className={`shadow-lg py-2 h-auto rounded-lg border border-[#E5E5E5] ${topic.status === "active"
                  ? "cursor-pointer hover:shadow-xl transition-shadow"
                  : "cursor-not-allowed opacity-75"
                  }`}
                style={{ backgroundColor: color }}
                onClick={() => handleTopicClick(topic)}
              >
                <CardContent className="p-0">
                  <div className="h-auto md:h-auto md:py-4 px-3 flex items-center justify-between">
                    {/* Content */}
                    <div className="flex-1 text-right">
                      <h3 className={`text-xl font-bold mb-1 ${light ? 'text-gray-900' : 'text-white'}`}>
                        {topic.title}
                      </h3>
                      <p className={`${light ? 'text-gray-700' : 'text-white'} text-sm`}>
                        {topic.subtitle}
                      </p>
                    </div>
                    {/* Status Icon */}
                    <div className="mr-4">
                      {topic.status === "active" ? (
                        <CheckCircle className={`h-6 w-6 ${light ? 'text-gray-700' : 'text-white'}`} />
                      ) : (
                        <Lock className={`h-6 w-6 ${light ? 'text-gray-400' : 'text-white'}`} />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

