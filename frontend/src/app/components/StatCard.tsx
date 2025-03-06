import { useState, useEffect } from 'react';
import { supabase } from '../SupabaseClient';  // Import your Supabase client
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook
import { subDays } from 'date-fns'; // Import subDays to calculate 7 days ago

export default function StatCard() {
  const { user, loading } = useAuth(); // Get the user from the context
  const [stats, setStats] = useState({
    easyCompleted: 0,
    hardCompleted: 0,
    totalCompleted: 0,
    easyCompletionRate: '0%',
    hardCompletionRate: '0%',
    totalCompletionRate: '0%',
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (user && user.id) {
        try {
          // Calculate the date 7 days ago
          const sevenDaysAgo = subDays(new Date(), 7).toISOString();

          const { data, error } = await supabase
            .from('completed_questions')
            .select('difficulty, completed_at')
            .eq('user_id', user.id)
            .gte('completed_at', sevenDaysAgo);

          if (error) throw error;

          // Calculate the number of easy and hard questions completed
          const easyQuestions = data.filter((item: any) => item.difficulty === 'introductory');
          const hardQuestions = data.filter((item: any) => item.difficulty === 'interview');

          const totalQuestions = data.length;

          // Total days in the past 7 days
          const daysInPast7Days = 7;

          // Calculate completion rates
          const easyCompletionRate = totalQuestions > 0
            ? ((easyQuestions.length / daysInPast7Days) * 100).toFixed(0) + '%'
            : '0%';

          const hardCompletionRate = totalQuestions > 0
            ? ((hardQuestions.length / daysInPast7Days) * 100).toFixed(0) + '%'
            : '0%';

          // For total, assume 2 possible questions per day (easy + hard)
          const totalCompletionRate = totalQuestions > 0
            ? ((totalQuestions / (daysInPast7Days * 2)) * 100).toFixed(0) + '%'
            : '0%';

          // Update stats
          setStats({
            easyCompleted: easyQuestions.length,
            hardCompleted: hardQuestions.length,
            totalCompleted: totalQuestions,
            easyCompletionRate,
            hardCompletionRate,
            totalCompletionRate,
          });
        } catch (error) {
          console.error('Error fetching completed questions:', error);
        }
      }
    };

    if (!loading && user) {
      fetchStats();
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200">
        Last 7 days
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Easy Questions Completed */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 shadow-md
                        dark:border-gray-600 dark:bg-gray-800
                        transition transform hover:scale-105 hover:shadow-lg duration-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Easy Questions Completed
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.easyCompleted} / 7
          </dd>
        </div>

        {/* Hard Questions Completed */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 shadow-md
                        dark:border-gray-600 dark:bg-gray-800
                        transition transform hover:scale-105 hover:shadow-lg duration-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Hard Questions Completed
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.hardCompleted} / 7
          </dd>
        </div>

        {/* Total Questions Completed */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 shadow-md
                        dark:border-gray-600 dark:bg-gray-800
                        transition transform hover:scale-105 hover:shadow-lg duration-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Questions Completed
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.totalCompleted} / 14
          </dd>
        </div>

        {/* Easy Completion Rate */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 shadow-md
                        dark:border-gray-600 dark:bg-gray-800
                        transition transform hover:scale-105 hover:shadow-lg duration-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Easy Questions Completion Rate
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.easyCompletionRate}
          </dd>
        </div>

        {/* Hard Completion Rate */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 shadow-md
                        dark:border-gray-600 dark:bg-gray-800
                        transition transform hover:scale-105 hover:shadow-lg duration-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Hard Questions Completion Rate
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.hardCompletionRate}
          </dd>
        </div>

        {/* Total Completion Rate */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 shadow-md
                        dark:border-gray-600 dark:bg-gray-800
                        transition transform hover:scale-105 hover:shadow-lg duration-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Questions Completion Rate
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.totalCompletionRate}
          </dd>
        </div>
      </dl>
    </div>
  );
}
