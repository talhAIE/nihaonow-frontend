"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { useTopics } from "@/hooks/useTopics";
import { useSession } from "@/hooks/useSession";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import TopicMap from "@/components/TopicMap";

export default function TopicsPage() {
  useAuthProtection();

  const searchParams = useSearchParams();
  const router = useRouter();
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
        router.push("/introduction");
      } catch (err) {
        console.error("Failed to start session:", err);
      }
    }
  };



  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Content Section */}
      <div className="space-y-4">
        {(loading || sessionLoading) && (
          <div className="flex flex-col items-center justify-center py-20 bg-white min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-[#35AB4E] mb-4" />
            <span className="text-gray-600 font-bold">
              {loading ? "جاري تحميل الدروس..." : "جاري بدء الجلسة..."}
            </span>
          </div>
        )}

        {(error || sessionError) && (
          <div className="flex items-center justify-center py-20 bg-white min-h-screen">
            <div className="text-center px-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-6 font-bold">{error || sessionError}</p>
              <button
                onClick={refetch}
                className="px-8 py-3 bg-[#35AB4E] text-white rounded-xl font-bold hover:bg-[#2f9c46] transition-colors shadow-lg"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {!loading && !error && !sessionLoading && topics.length === 0 && (
          <div className="text-center py-20 bg-white min-h-screen">
            <p className="text-gray-600 font-bold text-lg">لا توجد دروس متاحة لهذه الوحدة</p>
          </div>
        )}

        {/* Gamified Topic Map */}
        {!loading && !error && !sessionLoading && topics.length > 0 && (
        <TopicMap 
            topics={topics as any} 
            onTopicClick={handleTopicClick} 
          />
        )}
      </div>
    </div>
  );
}

