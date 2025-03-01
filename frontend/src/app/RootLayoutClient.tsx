'use client';

import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';  // Import AuthProvider and useAuth hook

export default function RootLayoutClient({
  children,
}: { children: React.ReactNode }) {
  const { user, loading } = useAuth();  // Access the user and loading state from AuthContext

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme if it exists
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
    } else {
      // If no theme saved, check for system preference (dark mode)
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }

    // Listen for system theme changes and update the theme accordingly
    const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const theme = e.matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', e.matches);
      localStorage.setItem('theme', theme); // Save the theme to localStorage
    };

    themeMediaQuery.addEventListener('change', handleThemeChange);

    // Cleanup the listener when component unmounts
    return () => {
      themeMediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Display loading state until authentication info is loaded
  if (loading) {
    <AuthProvider>
      return <div>Loading...</div>; // You can add a loading spinner or other loading UI here
    </AuthProvider>
  }

  return (
    <AuthProvider>
      <div>
        <main>{children}</main>
        {/* Conditionally render UI elements based on whether the user is authenticated */}
        {user ? (
          <div>Welcome, {user.email}!</div>  // Display the authenticated user's email
        ) : (
          <div>Please log in</div>  // If not logged in, show login prompt
        )}
      </div>
    </AuthProvider>
  );
}
