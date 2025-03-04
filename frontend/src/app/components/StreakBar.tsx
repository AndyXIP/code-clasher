import React, { useState, useEffect } from "react";
import { supabase } from '../SupabaseClient'; // Import your Supabase client
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook
import { subDays } from 'date-fns'; // To calculate 7 days ago

import StreakBadge from "./StreakBadges";

const StreakBar: React.FC = () => {
  const { user, loading } = useAuth(); // Get the user from the context
  const [userStreaks, setUserStreaks] = useState({
    easyStreak: 0,
    hardStreak: 0,
  });
  const totalMaxStreak = 14; // Total max streak is 14 (7 for easy + 7 for hard)

  useEffect(() => {
    const fetchStreaks = async () => {
      if (user && user.id) {
        try {
          // Calculate the date 7 days ago
          const sevenDaysAgo = subDays(new Date(), 7).toISOString();

          // Fetch completed questions for the user within the last 7 days
          const { data, error } = await supabase
            .from('completed_questions')
            .select('difficulty, completed_at')
            .eq('user_id', user.id)
            .gte('completed_at', sevenDaysAgo); // Filter by date

          if (error) throw error;

          // Filter for easy and hard streaks
          const easyStreaks = data.filter((item: any) => item.difficulty === 'introductory');
          const hardStreaks = data.filter((item: any) => item.difficulty === 'interview');

          // Update the streaks state
          setUserStreaks({
            easyStreak: easyStreaks.length,
            hardStreak: hardStreaks.length,
          });
        } catch (error) {
          console.error('Error fetching streaks:', error);
        }
      }
    };

    if (!loading && user) {
      fetchStreaks();
    }
  }, [user, loading]); // Fetch streaks when the user is available

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate the total streak (easy + hard)
  const totalStreak = userStreaks.easyStreak + userStreaks.hardStreak;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200">
        Weekly Streaks
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Easy Streak */}
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow dark:shadow-md sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="mb-3"><StreakBadge streak={userStreaks.easyStreak} /></div>
            Easy Streak
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {userStreaks.easyStreak}
          </dd>
        </div>

        {/* Hard Streak */}
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow dark:shadow-md sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="mb-3"><StreakBadge streak={userStreaks.hardStreak} /></div>
            Hard Streak
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {userStreaks.hardStreak}
          </dd>
        </div>

        {/* Total Streak */}
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow dark:shadow-md sm:p-6">
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
