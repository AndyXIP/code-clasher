'use client';

import { useEffect } from 'react';

export default function RootLayoutClient({
  children,
}: { children: React.ReactNode }) {
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

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
