'use client'; // Ensures this file runs in the client

import { useState, useEffect } from "react"; // Import useState and useEffect hooks
import Link from "next/link"; // Import Link for client-side navigation
import { usePathname } from "next/navigation"; // Use Next.js's built-in pathname hook
import Image from 'next/image';
import { MoonIcon } from '@heroicons/react/24/solid';
import { supabase } from '../SupabaseClient'; // Import Supabase client to handle authentication

export default function Navbar() {
  const pathname = usePathname(); // Get the current URL path
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const [user, setUser] = useState<any>(null); // State for the user (to check if logged in)

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "About", href: "/about" },
    { name: "Leader Board", href: "/leaderboard" },
    { name: "Problems", href: "/problems" },
  ];

  // Check if dark mode preference is stored in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark"); // Apply dark mode on load
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark"); // Ensure light mode is applied
    }

    // Fetch the session safely
    const fetchSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setUser(data.session.user); // Set user if logged in
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    // Cleanup the listener on unmount
    return () => {
      // Correct way to unsubscribe: access `subscription` and call `unsubscribe()`
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Toggle dark mode and store preference in localStorage
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null); // Clear user state on sign out
  };

  return (
    <nav className="bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between w-full">
          {/* Left Side (Logo + Navigation Links) */}
          <div className="flex items-center">
            <div className="shrink-0">
              <Image 
                alt="Logo" 
                src="/favicon.ico" 
                className="h-8 w-auto" 
                width={32} 
                height={32} 
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      pathname === link.href
                        ? "bg-gray-300 text-black dark:bg-gray-700 dark:text-white" 
                        : "text-gray-600 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side (Sign In/Sign Out + Dark Mode Toggle) */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="text-gray-800 dark:text-white">
              <MoonIcon className="h-6 w-6" />
            </button>

            {/* Sign In/Sign Out Button */}
            {user ? (
              <button
                onClick={handleSignOut}
                type="button"
                className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/login">
                <button
                  type="button"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
