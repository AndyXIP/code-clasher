import React from "react";
import StreakBadge from "./StreakBadges";

// Define types for the props
interface StreakBarProps {
  easyStreak: number;
  hardStreak: number;
}

const StreakBar: React.FC<StreakBarProps> = ({ easyStreak, hardStreak }) => {
  // Calculate the total streak (easy + hard)
  const totalStreak = easyStreak + hardStreak;
  const totalMaxStreak = 14; // Total max streak is 14 (7 for easy + 7 for hard)

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200">
        Weekly Streaks
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Easy Streak */}
        <div className="overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-5 shadow-sm dark:shadow-md sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="mb-3"><StreakBadge streak={easyStreak} /></div>
            Easy Streak
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {easyStreak}
          </dd>
        </div>

        {/* Hard Streak */}
        <div className="overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-5 shadow-sm dark:shadow-md sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="mb-3"><StreakBadge streak={hardStreak} /></div>
            Hard Streak
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {hardStreak}
          </dd>
        </div>

        {/* Total Streak */}
        <div className="overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-5 shadow-sm dark:shadow-md sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="mb-3"><StreakBadge streak={totalStreak} /></div>
            Total Streak
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {totalStreak}
          </dd>
        </div>
      </dl>

      {/* Total Streak (Easy + Hard) */}
      <div className="mt-5">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Total Streak: {totalStreak} / {totalMaxStreak}
            </span>
          </div>
          <div className="flex mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${(totalStreak / totalMaxStreak) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakBar;
