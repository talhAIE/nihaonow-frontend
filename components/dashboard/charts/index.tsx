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
    <div className="flex bg-white h-full" dir="rtl">
      <div className="w-full p-2 sm:p-2 flex flex-col h-full min-h-0">
        <div className="flex-1 min-h-[200px] sm:min-h-0 flex items-end justify-center gap-4 px-6">
          {animatedData.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center w-16 max-w-[80px] relative">
              {/* Percentage label on top of bar */}
              <div 
                className="absolute -top-6 text-sm sm:text-base lg:text-lg font-black transition-all duration-300 ease-out"
                style={{ 
                  color: item.labelColor || item.color,
                  transform: `translateY(${item.animatedValue > 0 ? '0px' : '10px'})`,
                  opacity: item.animatedValue > 0 ? 1 : 0
                }}
              >
                %{Math.round(item.animatedValue)}
              </div>
              
              <div className="w-full h-40 flex items-end relative">
                <div 
                  className="w-full rounded-t-lg transition-all duration-500 ease-out relative"
                  style={{ 
                    height: `${item.animatedValue}%`,
                    minHeight: '4px',
                    backgroundColor: item.color,
                    maxHeight: '100%'
                  }}
                >
                  {/* Add a subtle glow effect when value is high */}
                  {item.animatedValue > 70 && (
                    <div 
                      className="absolute inset-0 rounded-t-lg opacity-30"
                      style={{ 
                        backgroundColor: item.color,
                        boxShadow: `0 0 20px ${item.color}`
                      }}
                    />
                  )}
                </div>
              </div>
              
              <div className="mt-2 text-center">
                <span className="text-xs sm:text-sm font-bold text-slate-500 mb-1 block">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}