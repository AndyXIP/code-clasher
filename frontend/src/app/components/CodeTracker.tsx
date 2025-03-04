'use client'

import { useState, useEffect } from "react";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { supabase } from '../SupabaseClient';  // Import your Supabase client
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook
import { subHours } from 'date-fns';

export default function CodeTracker() {
  const { user, loading } = useAuth();
  // Track completion status for each difficulty
  const [easyDone, setEasyDone] = useState(false);
  const [hardDone, setHardDone] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (user && user.id) {
        try {
          // Get the current timestamp (now) and calculate 24 hours ago
          const twentyFourHoursAgo = subHours(new Date(), 24).toISOString();

          // Fetch completed questions for the user with a completed_at field (ensure you have this field in your table)
          const { data, error } = await supabase
            .from('completed_questions') // replace with your actual table name
            .select('difficulty, completed_at')
            .eq('user_id', user.id) // Assuming you have a user_id field
            .gte('completed_at', twentyFourHoursAgo); // Filter questions completed in the last 24 hours

          if (error) throw error;

          // Check for "easy" and "hard" completions
          const easyCompleted = data.filter((item: any) => item.difficulty === 'introductory').length > 0;
          const hardCompleted = data.filter((item: any) => item.difficulty === 'interview').length > 0;

          // Set the state based on whether there are any completed "easy" or "hard" questions in the last 24 hours
          setEasyDone(easyCompleted);
          setHardDone(hardCompleted);
        } catch (error) {
          console.error('Error fetching completed questions:', error);
        }
      }
    };

    // Only run the fetchStats function if user is loaded and authenticated
    if (!loading && user) {
      fetchStats();
    }
  }, [user, loading]); // Run the effect when the user is available

  return (
    <div className="lg:col-start-3 lg:row-end-1">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200">
        Last 24 Hours
      </h3>
      <div className="rounded-lg mt-5 bg-white dark:bg-gray-800 shadow ring-1 ring-gray-900/5 dark:ring-gray-700">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm/6 font-semibold text-gray-900 dark:text-gray-200">
              Daily Code Completions
            </dt>
          </div>
          <div className="flex-none self-end px-6 pt-4">
            <dd
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                easyDone && hardDone
                  ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-500/30"
                  : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-500/30"
              }`}
            >
              {easyDone && hardDone ? "Complete" : "Incomplete"}
            </dd>
          </div>

          {/* Easy */}
          <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 dark:border-gray-700 px-6 pt-6 cursor-pointer">
            <dt className="flex-none">
              {easyDone ? (
                <CheckCircleIcon aria-hidden="true" className="h-6 w-5 text-green-700 dark:text-green-400" />
              ) : (
                <XCircleIcon aria-hidden="true" className="h-6 w-5 text-red-700 dark:text-red-400" />
              )}
            </dt>
            <dd className="text-sm/6 font-medium text-gray-900 dark:text-gray-200">Easy</dd>
          </div>

          {/* Hard */}
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6 pb-6 cursor-pointer">
            <dt className="flex-none">
              {hardDone ? (
                <CheckCircleIcon aria-hidden="true" className="h-6 w-5 text-green-700 dark:text-green-400" />
              ) : (
                <XCircleIcon aria-hidden="true" className="h-6 w-5 text-red-700 dark:text-red-400" />
              )}
            </dt>
            <dd className="text-sm/6 font-medium text-gray-900 dark:text-gray-200">Hard</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
