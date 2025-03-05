'use client';

import { useState, useEffect } from 'react';

export default function LeaderBoard() {
  const [easyData, setEasyData] = useState<any[]>([]);
  const [hardData, setHardData] = useState<any[]>([]);
  const [view, setView] = useState<'easy' | 'hard'>('easy'); // Toggle between easy & hard

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      try {
        const response = await fetch(`/api/leaderboard`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard data');
        const data = await response.json();

        setEasyData(data.easy);
        setHardData(data.hard);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderBoard();
  }, []);

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 text-center">
        Leaderboard
      </h2>

      {/* Toggle Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            view === 'easy' ? 'bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-600 dark:text-gray-200'
          }`}
          onClick={() => setView('easy')}
        >
          Easy Level
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            view === 'hard' ? 'bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-600 dark:text-gray-200'
          }`}
          onClick={() => setView('hard')}
        >
          Hard Level
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[300px] border-collapse">
          <thead className="border-b dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
            <tr>
              <th className="py-2 px-3 text-left font-semibold">Rank</th>
              <th className="py-2 px-3 text-left font-semibold">User</th>
              <th className="py-2 px-3 text-right font-semibold">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-600">
            {(view === 'easy' ? easyData : hardData).map((item, index) => (
              <tr
                key={item.name}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <td className="py-3 px-3 text-sm font-medium">{index + 1}</td>
                <td className="py-3 px-3 text-sm font-medium">{item.name}</td>
                <td className="py-3 px-3 text-sm font-medium text-right">{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
