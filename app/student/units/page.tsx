"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Lock, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useNavigation } from '@/lib/navigation';
import { useChapters } from "@/hooks/useChapters";
import { ChapterUI } from "@/lib/api";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import { useAppContext } from "@/context/AppContext";
import AuthLanguageToggle from "@/components/auth/AuthLanguageToggle";

export default function UnitsPage() {
  useAuthProtection();

  const { goToStudentTopics } = useNavigation();
  const { chapters, loading, error, refetch } = useChapters();
  const { dir } = useAppContext();
  const isAr = dir === "rtl";

  const copy = {
    ar: {
      loading: "جاري تحميل الوحدات...",
      retry: "إعادة المحاولة",
      empty: "لا توجد وحدات متاحة حالياً",
    },
    en: {
      loading: "Loading units...",
      retry: "Try again",
      empty: "No units available right now",
    },
  } as const;

  const t = isAr ? copy.ar : copy.en;

  const handleUnitClick = (chapter: ChapterUI) => {
    if (chapter.status === "active") {
      goToStudentTopics(chapter.id);
    }
  };

  // Colors provided by the user
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
    <div className={`min-h-screen w-[90%] mx-auto ${isAr ? "font-almarai" : "font-nunito"}`} dir={dir} lang={isAr ? "ar" : "en"}>

      {/* Content Section */}
      <div className="px-4 py-6 space-y-4">
        <div className={`flex ${isAr ? "justify-start" : "justify-end"} mb-2`}>
          <AuthLanguageToggle />
        </div>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <span className={`${isAr ? "mr-2" : "ml-2"} text-gray-600`}>{t.loading}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
              >
                {t.retry}
              </button>
            </div>
          </div>
        )}

        {!loading && !error && chapters.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">{t.empty}</p>
          </div>
        )}

        {/* Dynamic Units from API */}
        {!loading &&
          !error &&
          chapters.map((chapter, idx) => {
            const color = colors[idx % colors.length];
            const light = isLight(color);
            return (
              <Card
                key={chapter.id}
                className={`shadow-lg py-2 h-auto rounded-lg border border-[#E5E5E5] ${chapter.status === "active"
                  ? "cursor-pointer hover:shadow-xl transition-shadow"
                  : "cursor-not-allowed"
                  }`}
                style={{ backgroundColor: color }}
                onClick={() => handleUnitClick(chapter)}
              >
                <CardContent className="p-0">
                  <div className="h-auto md:h-auto md:py-4 px-3 flex items-center justify-between">
                    {/* Content */}
                    <div className={`flex-1 ${isAr ? "text-right" : "text-left"}`}>
                      <h3 className={`text-xl font-bold mb-1 ${light ? 'text-gray-900' : 'text-white'}`}>
                        {chapter.title}
                      </h3>
                      <p className={`${light ? 'text-gray-700' : 'text-white'} text-sm`}>
                        {chapter.subtitle}
                      </p>
                    </div>
                    {/* Status Icon */}
                    <div className={isAr ? "mr-4" : "ml-4"}>
                      {chapter.status === "active" ? (
                        <CheckCircle className={`h-6 w-6 ${light ? 'text-gray-700' : 'text-white'}`} />
                      ) : (
                        <Lock className={`h-6 w-6 ${light ? 'text-gray-400' : 'text-white'}`} />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
