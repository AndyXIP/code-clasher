'use client';

import { useAuth } from './contexts/AuthContext';
import StatCard from './components/StatCard';
import CodeTracker from './components/CodeTracker';
import StreakBar from './components/StreakBar';
import HeroSection from './components/HeroSection';
import { CalendarIcon, ChartBarIcon, FireIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-700 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  // If user is not logged in, show HeroSection
  if (!user) {
    return <HeroSection />;
  }

  // If user is logged in, show the Dashboard
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-200">
      {/* Top-level Dashboard Heading */}
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      {/* Welcome Message */}
      <div className="mb-6 text-lg font-semibold">
        Welcome back, {user.user_metadata?.fullName || user.email || 'Username'}!
      </div>

      {/* Row 1: Today's Progress (CodeTracker) & Weekly Stats (StatCard) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Today’s Progress */}
        <section className="col-span-1 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center space-x-2 text-lg font-bold">
            <CalendarIcon className="h-5 w-5 text-indigo-500" />
            <span>Today’s Progress</span>
          </div>
          <CodeTracker />
        </section>

        {/* Right: Weekly Stats */}
        <section className="col-span-1 lg:col-span-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center space-x-2 text-lg font-bold">
            <ChartBarIcon className="h-5 w-5 text-indigo-500" />
            <span>Weekly Stats</span>
          </div>
          <StatCard />
        </section>
      </div>

      {/* Row 2: Streak Bar */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-2 flex items-center space-x-2 text-lg font-bold">
          <FireIcon className="h-5 w-5 text-indigo-500" />
          <span>Streaks</span>
        </div>
        <StreakBar />
      </div>
    </div>
  );
}
