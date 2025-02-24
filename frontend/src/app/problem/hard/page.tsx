'use client'

import React, { useState, useEffect } from 'react';
import MonacoEditorComponent from '../../components/MonacoEditor';

const EditorPage = () => {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<string>('');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number | null>(null);
  const [apiTestCases, setApiTestCases] = useState<{ testCase: string, expectedOutput: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'console' | 'testCases'>('testCases');

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/get-test-cases');
        if (!response.ok) {
          throw new Error('Failed to fetch test cases');
        }
        const data = await response.json();
        setApiTestCases(data.testCases || []); // Ensure you're setting the correct data structure
      } catch (error) {
        console.error('Error fetching test cases:', error);
        setError('An error occurred while fetching test cases');
      }
    };

    fetchTestCases();
  }, []); // Empty dependency array means it will run once when the component mounts

  const handleCodeSubmission = async (code: string, language: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
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
      setError("An error occurred while submitting the code.");
      setOutput(null);
    }
  };

  const tabs = [
    { name: 'Console', value: 'console', current: activeTab === 'console' },
    { name: 'Test Cases', value: 'testCases', current: activeTab === 'testCases' },
  ];

  const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

  return (
    <div className="ml-4 mr-4">
      <h1>Easy Question - question</h1>

      <MonacoEditorComponent onSubmit={handleCodeSubmission} />

      {/* Tab Navigation */}
      <div className="hidden sm:block mt-4 mx-auto max-w-4xl">
        <nav aria-label="Tabs" className="isolate flex divide-x divide-gray-200 rounded-lg shadow dark:bg-black">
          {tabs.map((tab, tabIdx) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.value as 'console' | 'testCases')}
              aria-current={tab.current ? 'page' : undefined}
              className={classNames(
                tab.current ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700',
                tabIdx === 0 ? 'rounded-l-lg' : '',
                tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                'group relative min-w-0 flex-1 overflow-hidden bg-whitepx-4 py-4 text-center text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-10',
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
          <div className="flex space-x-4">
            {apiTestCases.length > 0 ? (
              apiTestCases.map((testCase, index) => (
                <button
                  key={index}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={() => {
                    setTestCases(testCase.testCase);
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
                <strong>Entered Test Case:</strong>
                <p>{testCases}</p>
              </div>
              <div className="mt-2 p-4 bg-gray-100 dark:bg-slate-800 rounded-md border border-gray-300">
                <strong>Expected Output:</strong>
                <p>{apiTestCases[selectedTestCaseIndex]?.expectedOutput}</p> {/* Display expected output directly */}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'console' && (
        <div className="dark:bg-slate-800 mt-5 mb-5 p-4 border border-gray-300 rounded-md min-h-[100px] whitespace-pre-wrap">
          {output ? (
            <pre>{output}</pre>
          ) : error ? (
            <pre style={{ color: 'red' }}>{error}</pre> // This is where you are using `error`
          ) : (
            <p>No output yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EditorPage;
