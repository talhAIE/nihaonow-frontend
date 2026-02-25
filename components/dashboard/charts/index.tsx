import React, { useState, useEffect } from 'react';

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
  const [animatedData, setAnimatedData] = useState(data.map(item => ({ ...item, animatedValue: 0 })));

  useEffect(() => {
    // Animate values when data changes
    const timer = setTimeout(() => {
      setAnimatedData(data.map(item => ({ ...item, animatedValue: item.value })));
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="flex bg-white h-full w-full" dir="rtl">
      <div className="w-full p-2 flex flex-col h-full min-h-0">
        {/* Bars Container - Aligns all bars to a common bottom baseline */}
        <div className="flex-1 flex items-end justify-center gap-6 sm:gap-8 px-4 h-[180px] sm:h-[220px]">
          {animatedData.map((item, index) => (
            <div key={index} className="flex-1 max-w-[56px] sm:max-w-[70px] flex flex-col items-center relative group h-full justify-end">
              {/* Percentage label on top of bar */}
              <div 
                className="mb-2 text-sm sm:text-base lg:text-lg font-black transition-all duration-300 ease-out"
                style={{ 
                  color: item.labelColor || item.color,
                  opacity: item.animatedValue > 0 ? 1 : 0,
                  transform: `translateY(${item.animatedValue > 0 ? '0' : '10px'})`
                }}
              >
                %{Math.round(item.animatedValue)}
              </div>
              
              <div className="w-full relative flex items-end justify-center h-[70%]">
                <div 
                  className="w-full rounded-t-xl transition-all duration-700 ease-out relative shadow-sm"
                  style={{ 
                    height: `${item.animatedValue}%`,
                    minHeight: '6px',
                    backgroundColor: item.color,
                  }}
                >
                  {/* Subtle highlight effect on high values */}
                  {item.animatedValue > 70 && (
                    <div 
                      className="absolute inset-x-0 top-0 h-4 bg-white/20 rounded-t-xl"
                    />
                  )}
                  
                  {/* Outer Glow */}
                  <div 
                    className="absolute inset-0 rounded-t-xl -z-10 blur-md opacity-20 transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Horizontal Baseline Divider */}
        <div className="w-full h-[1.5px] bg-[#F2F2F2] mt-0 mb-3 mx-auto max-w-[90%]"></div>

        {/* Labels Container - Aligns all labels to a common top baseline */}
        <div className="flex justify-center gap-6 sm:gap-8 px-4">
          {animatedData.map((item, index) => (
            <div key={index} className="flex-1 max-w-[56px] sm:max-w-[70px] text-center">
              <span className="text-[10px] sm:text-[12px] lg:text-[13px] font-bold text-[#4B4B4B] leading-tight block">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}