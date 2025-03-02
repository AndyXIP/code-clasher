'use client';

import { useAuth } from './contexts/AuthContext'; // Import the useAuth hook
import StatCard from './components/StatCard';
import CodeTracker from './components/CodeTracker';
import { ChevronRightIcon } from '@heroicons/react/20/solid'; // Import the ChevronRightIcon

export default function HomePage() {
  const { user, loading } = useAuth(); // Access the user data

  if (loading) {
    return <div>Loading...</div>; // Show loading while data is being fetched
  }

  if (!user) {
    // When the user is not logged in, show the Hero Section
    return (
      <div className="bg-white dark:bg-black">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
          <div className="mx-auto max-w-7xl pb-24 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-20">
            <div className="px-6 lg:px-0 lg:pt-4">
              <div className="mx-auto max-w-2xl">
                <div className="max-w-lg">
                  <div>
                    <a href="/problems" className="inline-flex space-x-6">
                      <span className="rounded-full bg-indigo-600/10 dark:bg-indigo-50/10 px-3 py-1 text-sm/6 font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-600/10 dark:ring-indigo-600">
                        Daily Questions
                      </span>
                      <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600 dark:text-gray-300">
                        <span>Just Updated</span>
                        <ChevronRightIcon className="size-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </a>
                  </div>
                  <h1 className="mt-10 text-pretty text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-200 sm:text-7xl">
                    Test your programming skills now
                  </h1>
                  <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                    Daily easy and hard questions for you to practice before taking on those interviews.
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <a
                      href="/signup"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Signup Now
                    </a>
                    <a href="https://github.com/AndyXIP/sse-team-project/" className="text-sm/6 font-semibold text-gray-900 dark:text-gray-100">
                      View on GitHub <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
              <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white dark:bg-black shadow-xl shadow-indigo-600/10 ring-1 ring-inset ring-indigo-50 md:-mr-20 lg:-mr-36" aria-hidden="true" />
              <div className="shadow-lg md:rounded-3xl">
                <div className="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                  <div className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" aria-hidden="true" />
                  <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                    <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                      <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                        <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                          <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                            <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                              Easy
                            </div>
                            <div className="border-r border-gray-600/10 px-4 py-2">main.cpp</div>
                          </div>
                        </div>
                        <div className="px-6 pb-14 pt-6 text-white">
                          {/* Your code example */}
                          <pre>
                            <code>
                              {`#include <iostream>
                              
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white dark:from-black sm:h-32" />
        </div>
      </div>
    );
  }

  // When the user is logged in, show the Dashboard
  return (
    <div className="py-5 ml-4 mr-4">
      <div className="text-2xl font-semibold mb-5">
        Welcome back, {user.email || 'User'}!
      </div>
      <div className="flex gap-10">
        <div className="w-[25%]">
          <CodeTracker />
        </div>
        <div className="w-[70%]">
          <StatCard />
        </div>
      </div>
    </div>
  );
}
