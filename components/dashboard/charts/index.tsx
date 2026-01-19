import React from 'react';
import { BarChart, Bar, Cell, XAxis, ResponsiveContainer } from 'recharts';

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
        <div className="flex-1 min-h-[140px] sm:min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                hide
              />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-1 px-2 sm:px-4 mt-2 sm:mt-3">
          {data.map((item, index) => (
            <div key={index} className="text-center flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-slate-500 mb-1">
                {item.name}
              </span>
              <span
                className="text-sm sm:text-lg lg:text-2xl font-black"
                style={{ color: item.labelColor || item.color }}
              >
                %{Math.round(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}