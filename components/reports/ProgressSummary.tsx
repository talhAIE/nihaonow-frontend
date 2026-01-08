"use client";

interface ProgressSummaryProps {
  summary?: any;
  className?: string;
}

export function ProgressSummary({ summary, className }: ProgressSummaryProps) {
  const stats = [
    { label: "ساعات التعلم", value: summary?.totalUsageHours ? `${summary.totalUsageHours}س` : "24.5س", color: "text-[#35AB4E]", bg: "bg-green-50/50", border: 'border-green-100' },
    { label: "المفردات", value: summary?.totalVocabulary || "342", color: "text-emerald-600", bg: "bg-emerald-50/50", border: 'border-emerald-100' },
    { label: "دقة النطق", value: summary?.averageScore ? `${summary.averageScore}%` : "92%", color: "text-amber-600", bg: "bg-amber-50/50", border: 'border-amber-100' },
    { label: "الرتبة الكلية", value: summary?.rank || "#42", color: "text-violet-600", bg: "bg-violet-50/50", border: 'border-violet-100' },
  ];

  return (
    <div className={className} dir="rtl">
      <h3 className="text-xl font-black mb-8 text-gray-900 font-almarai-extrabold">ملخص الأداء العام</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.bg} ${stat.border} p-6 rounded-[24px] border border-white/50 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-95 group`}>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 group-hover:text-gray-500 transition-colors">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color} transition-transform`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
