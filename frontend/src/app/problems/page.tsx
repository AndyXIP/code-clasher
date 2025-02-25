'use client'

import React, { useState, useEffect } from 'react';
import MonacoEditorComponent from '../components/MonacoEditor';

const EditorPage = () => {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number | null>(null);
  const [apiTestCases, setApiTestCases] = useState<(string | number | (string | number)[])[][]>([]); // Store test cases as mixed types
  const [activeTab, setActiveTab] = useState<'console' | 'testCases'>('console');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionPrompt, setQuestionPrompt] = useState<string>('');

  useEffect(() => {
    const fetchTestCasesAndPrompt = async () => {
      try {
        const response = await fetch(`/api/daily-question?difficulty=${difficulty}`);
        if (!response.ok) {
          throw new Error('Failed to fetch test cases');
        }
        const data = await response.json();
        setApiTestCases(data.test_cases || []); // API returns test_cases with mixed types (strings, numbers, arrays)
        setQuestionPrompt(data.description || '');

        // If test cases are fetched, set the default to the first test case
        if (data.test_cases && data.test_cases.length > 0) {
          setSelectedTestCaseIndex(0);
        }
      } catch (error) {
        console.error('Error fetching test cases:', error);
        setError('An error occurred while fetching test cases');
      }
    };

    fetchTestCasesAndPrompt();
  }, [difficulty]);

  const handleCodeSubmission = async (code: string, language: string) => {
    try {
      const response = await fetch('/api/submit-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code, // The code that was submitted
          language, // The programming language
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit code');
      }

      const result = await response.json();

      if (result.output) {
        setOutput(result.output);
        setError(null);
      } else if (result.error) {
        setError(result.error);
        setOutput(null);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while submitting the code.');
      setOutput(null);
    }
  };

  const tabs = [
    { name: 'Console', value: 'console', current: activeTab === 'console' },
    { name: 'Test Cases', value: 'testCases', current: activeTab === 'testCases' },
  ];

  const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

  // Utility function to recursively flatten arrays
  const flattenArray = (arr: (string | number | (string | number)[])[]): string => {
    return arr
      .map(item => {
        if (Array.isArray(item)) {
          return flattenArray(item); // Recursively flatten nested arrays
        }
        return String(item); // Convert numbers and strings to string
      })
      .join(', ');
  };

  return (
    <div
      style={{ height: 'calc(100vh - 60px)' }} // 60px is the approximate height of your navbar
      className="flex flex-col md:flex-row w-full"
    >
      {/* Left Side: Question & Test Cases */}
      <div className="w-full md:w-1/2 p-4 border-r border-gray-300 dark:border-gray-600">
        <h1 className="text-lg font-bold mb-4">{questionPrompt || 'Loading question...'}</h1>

        {/* Difficulty Selection */}
        <div className="mt-4 mb-4 flex gap-2 justify-center">
          {['easy', 'medium', 'hard'].map((level) => (
            <button
              key={level}
              className={`px-4 py-2 text-sm text-white font-medium rounded-md ${
                difficulty === level ? 'bg-indigo-600' : 'bg-gray-500'
              }`}
              onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="mt-4">
          <nav
            aria-label="Tabs"
            className="isolate flex divide-x divide-gray-200 rounded-lg shadow dark:bg-black"
          >
            {tabs.map((tab, tabIdx) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.value as 'console' | 'testCases')}
                aria-current={tab.current ? 'page' : undefined}
                className={classNames(
                  tab.current ? 'text-gray-900 dark:text-white dark:bg-gray-800' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 dark:bg-gray-800',
                  tabIdx === 0 ? 'rounded-l-lg' : '',
                  tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                  'group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-10',
                )}
              >
                <span>{tab.name}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    tab.current ? 'bg-indigo-500' : 'bg-transparent',
                    'absolute inset-x-0 bottom-0 h-0.5',
                  )}
                />
              </button>
            ))}
          </nav>
        </div>

        {/* Display Tab Content */}
        {activeTab === 'testCases' && (
          <div className="mt-4 space-y-4">
            <div className="flex space-x-4 justify-center">
              {apiTestCases.length > 0 ? (
                apiTestCases.map((testCase, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      selectedTestCaseIndex === index
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : 'bg-gray-500 text-gray-200 hover:bg-gray-400'
                    }`}
                    onClick={() => {
                      setSelectedTestCaseIndex(index);
                    }}
                  >
                    Case {index + 1}
                  </button>
                ))
              ) : (
                <p>No test cases available</p>
              )}
            </div>

            {selectedTestCaseIndex !== null && apiTestCases[selectedTestCaseIndex] && (
              <div className="mt-4">
                <div className="mt-2 p-4 bg-gray-100 dark:bg-slate-800 rounded-md border border-gray-300">
                  <strong>Input:</strong>
                  {/* Display input for the selected test case using flattenArray */}
                  <p>{flattenArray(apiTestCases[selectedTestCaseIndex])}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'console' && (
          <div className="dark:bg-slate-800 mt-5 mb-5 p-4 border border-gray-300 rounded-md min-h-[100px] whitespace-pre-wrap">
            {output ? <pre>{output}</pre> : error ? <pre style={{ color: 'red' }}>{error}</pre> : <p>No output yet</p>}
          </div>
        )}
      </div>

      {/* Right Side: Code Editor */}
      <div className="w-full md:w-1/2 p-4 flex flex-col">
        <MonacoEditorComponent onSubmit={handleCodeSubmission} />
      </div>
    </div>
  );
};

export default EditorPage;
