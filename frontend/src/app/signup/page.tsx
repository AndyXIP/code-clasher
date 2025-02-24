"use client";
import { useState } from 'react';
import { supabase } from '../SupabaseClient';

export default function SignUp() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Use FormData to extract form values
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string | null;
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    // Call Supabase's signUp method with additional user metadata (username)
    const { data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { fullName } },
    });


    if (data?.user) {
      // Insert a profile row using the new user’s UUID
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: data.user.id,
            display_name: data.user.user_metadata.fullName, // or fullName
          },
        ]);

      if (profileError) {
        setError(`Profile creation error: ${profileError.message}`);
        return;
      }

      // Insert a new row into the leaderboard with default values
      const { error: leaderboardError } = await supabase
        .from('leaderboard')
        .insert([
          {
            user_id: data.user.id,
            display_name: fullName || '',
            easy: 0,
            medium: 0,
            hard: 0,
          },
        ]);

      if (leaderboardError) {
        setError(`Leaderboard error: ${leaderboardError.message}`);
        return;
      }

      setMessage('Sign up successful! Please check your email to confirm your account.');
      setError(null);
    } else {
      setError('Unexpected error: User not created.');
    }
  };

  return (
    <>
      {/*
        Ensure your template reflects light mode correctly:
        <html class="h-full bg-white dark:bg-gray-900">
        <body class="h-full">
      */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-900">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
            Sign up for your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>

          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
          {message && <p className="mt-4 text-center text-green-600">{message}</p>}

          <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
            Already a member?{' '}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign in to your account
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
