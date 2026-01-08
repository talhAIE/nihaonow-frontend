"use client";

export function AnalyticsOverview({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 text-right">نظرة عامة على التحليلات</h3>
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg text-gray-400 italic">
        [Analytics Graph Placeholder]
      </div>
    </div>
  );
}
