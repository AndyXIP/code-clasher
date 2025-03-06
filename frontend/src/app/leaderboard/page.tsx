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
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

function getMotivationalMessage(rank: number): string {
  // Customize messages based on rank
  switch (rank) {
    case 1:
      return "You're on fire!";
    case 2:
      return "So close to the top!";
    case 3:
      return "Great hustle!";
    case 4:
      return "Keep pushing!";
    case 5:
      return "Stay in the game!";
    default:
      return "Keep rocking it!";
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
        {/* Avatar with medal overlay */}
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
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Points: {entry.score}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {motivationalMessage}
          </div>
        </div>
      </div>
      {/* Display the numeric score prominently */}
      <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
        {entry.score}
      </div>
    </div>
  );
}

interface LeaderBoardListProps {
  data: LeaderBoardEntry[];
}

function LeaderBoardList({ data }: LeaderBoardListProps) {
  return (
    <div className="mt-6 space-y-4">
      {data.map((item, index) => (
        <LeaderBoardCard key={item.name} entry={item} rank={index + 1} />
      ))}
    </div>
  );
}

export default function LeaderBoard() {
  const [easyData, setEasyData] = useState<LeaderBoardEntry[]>([]);
  const [hardData, setHardData] = useState<LeaderBoardEntry[]>([]);
  const [view, setView] = useState<'easy' | 'hard'>('easy'); // Toggle between easy & hard

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
    <div className="py-5 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6">Leaderboard</h2>

      {/* Toggle Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          className={`px-6 py-2 rounded-md text-sm font-medium transition ${
            view === 'easy'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-300 dark:bg-gray-600 dark:text-gray-200'
          }`}
          onClick={() => setView('easy')}
        >
          Easy Level
        </button>
        <button
          className={`px-6 py-2 rounded-md text-sm font-medium transition ${
            view === 'hard'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-300 dark:bg-gray-600 dark:text-gray-200'
          }`}
          onClick={() => setView('hard')}
        >
          Hard Level
        </button>
      </div>

      {/* Leaderboard List */}
      <LeaderBoardList data={view === 'easy' ? easyData : hardData} />
    </div>
  );
}
