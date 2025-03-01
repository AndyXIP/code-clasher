// src/app/page.tsx (or the file where Home component is located)
'use client';

import { useAuth } from "./contexts/AuthContext";  // Import the useAuth hook
import StatCard from "./components/StatCard";
import CodeTracker from "./components/CodeTracker";
import { AuthProvider } from './contexts/AuthContext';  // Import the AuthProvider

export default function Home() {
  const { user, loading } = useAuth();  // Access the user data

  if (loading) {
    return <div>Loading...</div>;  // Show loading while data is being fetched
  }

  return (
    <div className="py-5 ml-4 mr-4">
      <AuthProvider>
      {/* Display Welcome message if user is available */}
      {user ? (
        <div className="text-2xl font-semibold mb-5">
          Welcome back, {user.email || "User"}!
        </div>
      ) : (
        <div className="text-2xl font-semibold mb-5">
          Welcome, please sign in to continue.
        </div>
      )}

      <div className="flex gap-10">
        {/* CodeTracker takes up 25% of the screen width */}
        <div className="w-[25%]">
          <CodeTracker />
        </div>
        {/* StatCard takes up 70% */}
        <div className="w-[70%]">
          <StatCard />
        </div>
      </div>
      </AuthProvider>
    </div>
  );
}
