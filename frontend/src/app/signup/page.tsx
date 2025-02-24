"use client";

import { FormEvent, useState } from 'react';
import { supabase } from '../SupabaseClient';
import Image from 'next/image';

export default function SignUp() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Use FormData to extract form values without changing your HTML
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const password = formData.get('password');

    // Call Supabase's signUp method
    const { error: signUpError } = await supabase.auth.signUp(
      { email, password },
      { data: { fullName } }
    );

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMessage('Sign up successful! Please check your email to confirm your account.');
    }
  };

  return (
    <>
      {/*
        This example requires updating your template:
        ```
        <html class="h-full bg-gray-900">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
        alt="Your Company"
        src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
        className="mx-auto"
        width={40}  // Specify the width
        height={40} // Specify the height
        />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign up for your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm/6 font-medium text-white">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>

          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
          {message && <p className="mt-4 text-center text-green-500">{message}</p>}

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Already a member?{' '}
            <a href="/signin" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Sign in to your account
            </a>
          </p>
        </div>
      </div>
    </>
  );
}