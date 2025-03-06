'use client';

import { useAuth } from './contexts/AuthContext';
import StatCard from './components/StatCard';
import CodeTracker from './components/CodeTracker';
import StreakBar from './components/StreakBar';
import HeroSection from './components/HeroSection';
import MyMonthlyCalendar from './components/calendarHeatmap'; 
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

  if (!user) return <HeroSection />;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-200">
      {/* Welcome & Tagline */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome back, {user.user_metadata?.fullName || user.email || 'Username'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ready to level up your code?
        </p>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Progress */}
        <section className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-2 mb-2">
            <CalendarIcon className="h-5 w-5 text-indigo-500" />
            <span className="text-lg font-bold">Today&apos;s Progress</span>
          </div>
          <CodeTracker />
        </section>

        {/* Weekly Stats */}
        <section className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="h-5 w-5 text-indigo-500" />
            <span className="text-lg font-bold">Weekly Stats</span>
          </div>
          <StatCard />
        </section>
      </div>

      {/* Streaks and Monthly Calendar - Displayed side by side on larger screens, stacked on mobile */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* StreakBar Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-2 mb-2">
            <FireIcon className="h-5 w-5 text-indigo-500" />
            <span className="text-lg font-bold">Streaks</span>
          </div>
          <StreakBar />
        </div>

        {/* Monthly Calendar Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-2 mb-2">
            <CalendarIcon className="h-5 w-5 text-indigo-500" />
            <span className="text-lg font-bold">Monthly Calendar</span>
          </div>
          <MyMonthlyCalendar />
        </div>
      </div>
    </div>
  );
}
