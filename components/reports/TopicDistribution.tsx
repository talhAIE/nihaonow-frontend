"use client";

export function TopicDistribution({ className }: { className?: string }) {
  const topics = [
    { name: "التحيات", original: "Greetings", score: 95, color: 'bg-[#35AB4E]' },
    { name: "العائلة", original: "Family", score: 82, color: 'bg-emerald-500' },
    { name: "الطعام", original: "Food", score: 74, color: 'bg-amber-500' },
    { name: "السفر", original: "Travel", score: 91, color: 'bg-violet-500' },
  ];

  return (
    <div className={className} dir="rtl">
      <h3 className="text-xl font-black mb-6 text-gray-900 font-almarai-extrabold">توزيع المواضيع</h3>
      <div className="space-y-6">
        {topics.map((t) => (
          <div key={t.original} className="group">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-slate-600 group-hover:text-slate-900 transition-colors font-bold">{t.name}</span>
              <span className="text-slate-900 font-black">{t.score}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-50 shadow-inner">
              <div 
                className={`${t.color} h-full rounded-full transition-all duration-700 shadow-sm`} 
                style={{ width: `${t.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
