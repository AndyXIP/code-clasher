'use client'; // Ensures this file runs in the client

import { useState, useEffect } from "react"; // Import useState and useEffect hooks
import Link from "next/link"; // Import Link for client-side navigation
import { usePathname } from "next/navigation"; // Use Next.js's built-in pathname hook
import Dropdown from "./Dropdown"; // Import your Dropdown component
import Image from 'next/image';
import { MoonIcon} from '@heroicons/react/24/solid';

export default function Navbar() {
  const pathname = usePathname(); // Get the current URL path
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Leader Board", href: "/leaderboard" },
  ];

  // Check if dark mode preference is stored in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setIsDarkMode(savedMode === "true");
    }
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

  return (
    <nav className="bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <Image 
                alt="Your Company" 
                src="/favicon.ico" 
                className="h-8 w-auto" 
                width={32} // Provide the width
                height={32} // Provide the height
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
                        ? "bg-gray-900 text-white dark:bg-gray-700 dark:text-white" // Active link styling
                        : "text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" // Default styling
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Dropdown Component */}
                <Dropdown />
              </div>
            </div>
          </div>
          
          {/* Buttons - Sign In and Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle Button */}
            <button onClick={toggleDarkMode} className="text-gray-800 dark:text-white">
              <MoonIcon className="h-6 w-6" />
            </button>

            {/* Link wrapper for the Sign In button */}
            <Link href="/login">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
