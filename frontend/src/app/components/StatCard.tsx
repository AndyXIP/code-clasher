import { useState, useEffect } from 'react';
import { supabase } from '../SupabaseClient';  // Import your Supabase client
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

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
          // Fetch completed questions for the user
          const { data, error } = await supabase
            .from('completed_questions')
            .select('difficulty')
            .eq('user_id', user.id);

          if (error) throw error;

          // Calculate the number of easy and hard questions
          const easyQuestions = data.filter((item: any) => item.difficulty === 'introductory');
          const hardQuestions = data.filter((item: any) => item.difficulty === 'interview');
          
          const totalQuestions = data.length;

          // Calculate completion rates
          const easyCompletionRate = totalQuestions > 0 ? ((easyQuestions.length / 7) * 100).toFixed(0) + '%' : '0%';
          const hardCompletionRate = totalQuestions > 0 ? ((hardQuestions.length / 7) * 100).toFixed(0) + '%' : '0%';
          const totalCompletionRate = totalQuestions > 0 ? ((totalQuestions / 14) * 100).toFixed(0) + '%' : '0%';

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
  }, [user, loading]); // Run the effect when the user is available

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200">
        Last 7 days
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow dark:shadow-md sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Easy Questions Completed
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.easyCompleted}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow dark:shadow-md sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Hard Questions Completed
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.hardCompleted}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow dark:shadow-md sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Questions Completed
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.totalCompleted}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow dark:shadow-md sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Easy Questions Completion Rate
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.easyCompletionRate}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow dark:shadow-md sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Hard Questions Completion Rate
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {stats.hardCompletionRate}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow dark:shadow-md sm:p-6">
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
