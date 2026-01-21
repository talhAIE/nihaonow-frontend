"use client";

export function LeaderboardTable() {
  const leaders = [
    { rank: 1, name: "Zaid Omar", points: 12500, accuracy: "98%" },
    { rank: 2, name: "Fatima Ali", points: 11200, accuracy: "95%" },
    { rank: 3, name: "Yousif Hassan", points: 10800, accuracy: "96%" },
    { rank: 4, name: "You", points: 10400, accuracy: "94%", isUser: true },
  ];

  return (
    <div className="w-full">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 uppercase">
          <tr>
            <th className="px-6 py-3">Rank</th>
            <th className="px-6 py-3">Player</th>
            <th className="px-6 py-3 text-right">Points</th>
            <th className="px-6 py-3 text-right">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((l) => (
            <tr key={l.rank} className={`border-b ${l.isUser ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
              <td className="px-6 py-4 font-bold text-gray-400">#{l.rank}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {l.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-gray-900">{l.name} {l.isUser && "(You)"}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right font-bold">{l.points.toLocaleString()}</td>
              <td className="px-6 py-4 text-right">{l.accuracy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
