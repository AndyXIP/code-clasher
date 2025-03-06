'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../SupabaseClient'; // Ensure Supabase is imported

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth(); // Get user from AuthContext
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { name: 'Dashboard', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Problems', href: '/problems' },
  ];

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());

    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 🔹 Fix: Ensure sign out properly updates user state
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.reload(); // Ensure full state reset
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Side: Logo & Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/favicon.ico" alt="Logo" width={32} height={32} className="h-8 w-auto"/>
            </Link>
          </div>

          {/* Desktop Menu (Hidden on Small Screens) */}
          <div className="hidden md:flex space-x-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  pathname === link.href
                    ? 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side: Dark Mode & Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="text-gray-800 dark:text-white">
              <MoonIcon className="h-6 w-6" />
            </button>

            {/* Auth Buttons */}
            {user ? (
              <button
                type="button"
                className="hidden md:block rounded-md px-4 py-2 border-gray-400 border-2 text-sm font-semibold hover:bg-red-500 hover:text-white"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            ) : (
              <Link href="/login">
                <button
                  type="button"
                  className="hidden md:block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Sign In
                </button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-800 dark:text-white focus:outline-none"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Visible When Open) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-800 shadow-lg z-50">
          <div className="flex flex-col space-y-2 p-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Buttons in Mobile Menu */}
            {user ? (
              <button
                type="button"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            ) : (
              <Link href="/login">
                <button
                  type="button"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
