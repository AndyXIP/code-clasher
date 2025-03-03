'use client';

import { useAuth } from './contexts/AuthContext'; // Import the useAuth hook
import StatCard from './components/StatCard';
import CodeTracker from './components/CodeTracker';
import StreakBar from './components/StreakBar';
import HeroSection from './components/HeroSection';

export default function HomePage() {
  const { user, loading } = useAuth(); // Access the user data

  // Show loading while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(user)

  // If user is not logged in, show HeroSection
  if (!user) {
    return (
      <div>
        <HeroSection />
      </div>
    );
  }

  // If user is logged in, show the Dashboard
  return (
    <div className="py-5 ml-4 mr-4">
      <div className="text-1xl font-semibold mb-2">
        {/* Show user's full name or fallback to 'Username' */}
        Welcome back, {user.raw_user_meta_data?.fullName || user.email || 'Username'}!
      </div>
      <div className="flex gap-10">
        <div className="w-[25%]">
          <CodeTracker />
        </div>
        <div className="w-[70%]">
          <StatCard />
        </div>
      </div>
      <div className="w-[100%]">
        <StreakBar easyStreak={5} hardStreak={6} />
      </div>
    </div>
  );
}
