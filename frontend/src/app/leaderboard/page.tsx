'use client';

import { useState, useEffect } from 'react';

export default function LeaderBoard() {
  const [easyData, setEasyData] = useState<any[]>([]);
  const [hardData, setHardData] = useState<any[]>([]);
  const [view, setView] = useState<'easy' | 'hard'>('easy');  // State for toggle between easy and hard

  useEffect(() => {
    const fetchTestCasesAndPrompt = async () => {
      try {
        const response = await fetch(`/api/leaderboard`);
        if (!response.ok) {
          throw new Error('Failed to fetch question data');
        }
        const data = await response.json();

        // Get both easy and hard question data
        const easy = data.easy;
        const hard = data.hard;

        // Set the easy and hard data
        setEasyData(easy);
        setHardData(hard);
      } catch (error) {
        console.error('Error fetching question data:', error);
      }
    };

    // Fetch data once on mount
    fetchTestCasesAndPrompt();
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div className="py-5 ml-4 mr-4">
      <h2 className="px-4 text-2xl font-semibold dark:text-gray-200 sm:px-6 lg:px-8">
        Leaderboard
      </h2>

      {/* Toggle Buttons */}
      <div className="mt-6 flex justify-center gap-6">
        <button
          className={`px-4 py-2 text-sm text-white font-medium rounded-md ${view === 'easy' ? 'bg-indigo-600' : 'bg-gray-500'}`}
          onClick={() => setView('easy')}
        >
          Easy Level
        </button>
        <button
          className={`px-4 py-2 text-sm text-white font-medium rounded-md ${view === 'hard' ? 'bg-indigo-600' : 'bg-gray-500'}`}
          onClick={() => setView('hard')}
        >
          Hard Level
        </button>
      </div>

      {/* Conditional Rendering Based on Toggle */}
      {view === 'easy' ? (
        <div className="mt-8">
          <table className="mt-6 w-full whitespace-nowrap text-left">
            <thead className="border-b border-white/10 dark:border-gray-600 text-sm dark:text-gray-300">
              <tr>
                <th
                  scope="col"
                  className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
                >
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 dark:divide-gray-600">
              {easyData.map((item, index) => (
                <tr
                  key={item.name}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                    <div className="flex items-center gap-x-4">
                      <div className="truncate text-sm font-medium dark:text-gray-200">
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                    <div className="flex gap-x-3">
                      <div className="truncate text-sm font-medium dark:text-gray-200">
                        {item.name}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pl-0 pr-4 text-sm sm:pr-8 lg:pr-20">
                    <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                      <div className="dark:text-gray-200">{item.score}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8">
          <table className="mt-6 w-full whitespace-nowrap text-left">
            <thead className="border-b border-white/10 dark:border-gray-600 text-sm dark:text-gray-300">
              <tr>
                <th
                  scope="col"
                  className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
                >
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 dark:divide-gray-600">
              {hardData.map((item, index) => (
                <tr
                  key={item.name}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                    <div className="flex items-center gap-x-4">
                      <div className="truncate text-sm font-medium dark:text-gray-200">
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                    <div className="flex gap-x-3">
                      <div className="truncate text-sm font-medium dark:text-gray-200">
                        {item.name}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pl-0 pr-4 text-sm sm:pr-8 lg:pr-20">
                    <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                      <div className="dark:text-gray-200">{item.score}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
