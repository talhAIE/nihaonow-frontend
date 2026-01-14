"use client";

export function UsageChart() {
  return (
    <div className="h-64 flex items-end justify-between gap-2 pt-4">
      {[45, 60, 30, 80, 55, 90, 70, 85, 40, 50, 65, 75].map((h, i) => (
        <div key={i} className="flex-1 group relative">
          <div 
            className="bg-slate-100 group-hover:bg-[#35AB4E] transition-all duration-300 rounded-t-sm shadow-sm" 
            style={{ height: `${h}%` }}
          ></div>
          <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded">
            {h}m
          </div>
        </div>
      ))}
    </div>
  );
}
