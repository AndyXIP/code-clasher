'use client'

import { useState } from "react";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";

export default function CodeTracker() {
  // Track completion status for each difficulty
  const [easyDone, setEasyDone] = useState(false);
  const [mediumDone, setMediumDone] = useState(false);
  const [hardDone, setHardDone] = useState(false);

  return (
    <div className="lg:col-start-3 lg:row-end-1">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200">
        Last 24 Hours
      </h3>
      <div className="rounded-lg mt-5 bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm/6 font-semibold text-gray-900 dark:text-gray-200">
              Daily Code Completions
            </dt>
          </div>
          <div className="flex-none self-end px-6 pt-4">
            <dd
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                easyDone && mediumDone && hardDone
                  ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-500/30"
                  : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-500/30"
              }`}
            >
              {easyDone && mediumDone && hardDone ? "Complete" : "Incomplete"}
            </dd>
          </div>

          {/* Easy */}
          <div
            className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 dark:border-gray-700 px-6 pt-6 cursor-pointer"
            onClick={() => setEasyDone(!easyDone)}
          >
            <dt className="flex-none">
              {easyDone ? (
                <CheckCircleIcon aria-hidden="true" className="h-6 w-5 text-green-700 dark:text-green-400" />
              ) : (
                <XCircleIcon aria-hidden="true" className="h-6 w-5 text-red-700 dark:text-red-400" />
              )}
            </dt>
            <dd className="text-sm/6 font-medium text-gray-900 dark:text-gray-200">Easy</dd>
          </div>

          {/* Medium */}
          <div
            className="mt-4 flex w-full flex-none gap-x-4 px-6 cursor-pointer"
            onClick={() => setMediumDone(!mediumDone)}
          >
            <dt className="flex-none">
              {mediumDone ? (
                <CheckCircleIcon aria-hidden="true" className="h-6 w-5 text-green-700 dark:text-green-400" />
              ) : (
                <XCircleIcon aria-hidden="true" className="h-6 w-5 text-red-700 dark:text-red-400" />
              )}
            </dt>
            <dd className="text-sm/6 font-medium text-gray-900 dark:text-gray-200">Medium</dd>
          </div>

          {/* Hard */}
          <div
            className="mt-4 flex w-full flex-none gap-x-4 px-6 pb-6 cursor-pointer"
            onClick={() => setHardDone(!hardDone)}
          >
            <dt className="flex-none">
              {hardDone ? (
                <CheckCircleIcon aria-hidden="true" className="h-6 w-5 text-green-700 dark:text-green-400" />
              ) : (
                <XCircleIcon aria-hidden="true" className="h-6 w-5 text-red-700 dark:text-red-400" />
              )}
            </dt>
            <dd className="text-sm/6 font-medium text-gray-900 dark:text-gray-200">Hard</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
