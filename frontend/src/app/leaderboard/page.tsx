'use client';

import { useState, useEffect } from 'react';

interface LeaderBoardEntry {
  name: string;
  score: number;
}

function getMedal(rank: number): { medal: string; borderColor: string } | null {
  if (rank === 1) return { medal: '🥇', borderColor: 'border-yellow-400' };
  if (rank === 2) return { medal: '🥈', borderColor: 'border-gray-400' };
  if (rank === 3) return { medal: '🥉', borderColor: 'border-orange-500' };
  return null;
}

function getInitials(name: string): string {
  return name.split(' ').map((word) => word.charAt(0).toUpperCase()).join('');
}

function getMotivationalMessage(rank: number): string {
  switch (rank) {
    case 1:
      return "You're on fire!";
    case 2:
      return 'So close to the top!';
    case 3:
      return 'Great hustle!';
    case 4:
      return 'Keep pushing!';
    case 5:
      return 'Stay in the game!';
    default:
      return 'Keep rocking it!';
  }
}

function LeaderBoardCard({ entry, rank }: { entry: LeaderBoardEntry; rank: number }) {
  const medalInfo = getMedal(rank);
  const motivationalMessage = getMotivationalMessage(rank);
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow-md transition transform hover:-translate-y-1 ${
        medalInfo ? `border-2 ${medalInfo.borderColor}` : 'border border-gray-200'
      } bg-white dark:bg-gray-800`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            {getInitials(entry.name)}
          </div>
          {medalInfo && (
            <div className="absolute -bottom-1 -right-1 text-xl">
              {medalInfo.medal}
            </div>
          )}
        </div>
        <div>
          <div className="text-lg font-bold">
            {rank}. <span className="ml-1">{entry.name}</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Points: {entry.score}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500">{motivationalMessage}</div>
        </div>
      </div>
      <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
        {entry.score}
      </div>
    </div>
  );
}

function LeaderBoardList({ data }: { data: LeaderBoardEntry[] }) {
  return (
    <div className="mt-4 space-y-4">
      {data.map((item, index) => (
        <LeaderBoardCard key={item.name} entry={item} rank={index + 1} />
      ))}
    </div>
  );
}

export default function LeaderBoard() {
  const [easyData, setEasyData] = useState<LeaderBoardEntry[]>([]);
  const [hardData, setHardData] = useState<LeaderBoardEntry[]>([]);
  const [view, setView] = useState<'easy' | 'hard'>('easy');

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
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
    <div className="px-4 sm:px-6 lg:px-8 py-5 text-gray-900 dark:text-gray-200">
      <div className="mb-4 text-center">
        <p className="text-lg font-medium">Top Code Clashers of All Time</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Zero Bugs, Maximum Bragging Rights!</p>
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setView('easy')}
            className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition ${
              view === 'easy'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Easy Level
          </button>
          <button
            onClick={() => setView('hard')}
            className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition ${
              view === 'hard'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Hard Level
          </button>
        </nav>
      </div>
      <LeaderBoardList data={view === 'easy' ? easyData : hardData} />
    </div>
  );
}
