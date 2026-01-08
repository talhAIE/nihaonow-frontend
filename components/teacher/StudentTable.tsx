"use client";

interface StudentTableProps {
  students?: any[];
}

export function StudentTable({ students }: StudentTableProps) {
  const displayStudents = students || [
    { id: 1, name: "علي أحمد", progress: "85%", status: "نشط" },
    { id: 2, name: "سارة خان", progress: "92%", status: "نشط" },
    { id: 3, name: "عمر زيد", progress: "45%", status: "أوفلاين" },
  ];

  return (
    <div className="w-full" dir="rtl">
      <table className="w-full text-sm text-right">
        <thead className="bg-gray-50 text-gray-700 uppercase">
          <tr>
            <th className="px-6 py-3 font-bold">اسم الطالب</th>
            <th className="px-6 py-3 font-bold">التقدم</th>
            <th className="px-6 py-3 font-bold">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {displayStudents.map((s) => (
            <tr key={s.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-[100px]">
                        <div className="bg-[#35AB4E] h-1.5 rounded-full" style={{ width: s.progress }} />
                    </div>
                    <span>{s.progress}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.status === 'نشط' || s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {s.status === 'active' ? 'نشط' : (s.status === 'inactive' ? 'غير نشط' : s.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
