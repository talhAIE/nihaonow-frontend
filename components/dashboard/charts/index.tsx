import React from 'react';

interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  label: string;
  nameColor?: string;
  labelColor?: string;
}

interface ArabicStatsChartProps {
  data?: ChartDataPoint[];
}

export default function ArabicStatsChart({ data: propData }: ArabicStatsChartProps) {
  const defaultData: ChartDataPoint[] = [
    { name: 'النطق', value: 0, color: '#FF9800', label: '0%', labelColor: '#FF9800' },
    { name: 'الطلاقة', value: 0, color: '#D05872', label: '0%', labelColor: '#00AEEF' },
    { name: 'الدقة', value: 0, color: '#8BD9B7', label: '0%', labelColor: '#35AB4E' }
  ];

  const data = propData || defaultData;

  return (
    <div className="flex bg-white h-full" dir="rtl">
      <div className="w-full p-2 sm:p-2 flex flex-col h-full min-h-0">
        <div className="flex-1 min-h-[200px] sm:min-h-0 flex items-end justify-center gap-4 px-6">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center w-16 max-w-[80px]">
              <div className="w-full h-40 flex items-end">
                <div 
                  className="w-full rounded-t-lg transition-all duration-300 ease-out"
                  style={{ 
                    height: `${item.value}%`,
                    minHeight: '4px',
                    backgroundColor: item.color,
                    maxHeight: '100%'
                  }}
                />
              </div>
              <div className="mt-2 text-center">
                <span className="text-xs sm:text-sm font-bold text-slate-500 mb-1 block">
                  {item.name}
                </span>
                <span
                  className="text-sm sm:text-lg lg:text-2xl font-black block"
                  style={{ color: item.labelColor || item.color }}
                >
                  %{Math.round(item.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}