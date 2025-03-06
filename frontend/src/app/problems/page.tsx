'use client';

import React, { useState, useEffect } from 'react';
import { XCircleIcon, CheckCircleIcon, EllipsisHorizontalCircleIcon } from '@heroicons/react/20/solid'; // Import CircleIcon for neutral state
import MonacoEditorComponent from '../components/MonacoEditor';
import { useAuth } from '../contexts/AuthContext';
import QuestionPrompt from '../components/QuestionPrompt';
import TestCase from '../components/TestCase';

const EditorPage = () => {
  const { user } = useAuth(); // Get authenticated user
  const [easyData, setEasyData] = useState<any>(null);
  const [hardData, setHardData] = useState<any>(null);
  const [questionPrompt, setQuestionPrompt] = useState<string>('');
  const [problemId, setProblemId] = useState<string>('');
  const [apiTestCases, setApiTestCases] = useState<(string | number | (string | number)[])[]>([]);
  const [apiTestResults, setApiTestResults] = useState<(string | number)[]>([]);
  const [starterCode, setStarterCode] = useState<string | null>(null);

  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'testCases'>('console');
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [passedValues, setPassedValues] = useState<boolean>(false);
  const [passedPerCase, setPassedPerCase] = useState<boolean[]>([]);
  const [actualValues, setActualValues] = useState<(string | number)[]>([]);

  // Use useEffect to fetch data once on initial mount
  useEffect(() => {
    const fetchTestCasesAndPrompt = async () => {
      try {
        const response = await fetch(`/api/daily-question`);
        if (!response.ok) {
          throw new Error('Failed to fetch question data');
        }
        const data = await response.json();

        // Get both easy and hard question data
        const easy = data.easy;
        const hard = data.hard;

        // Update the state with both easy and hard data
        setEasyData(easy);
        setHardData(hard);

        setDifficulty('easy');

        // Set default test case for the selected difficulty
        if (easy && easy.inputs && easy.inputs.length > 0) {
          setSelectedTestCaseIndex(0);
        }

        // Set the question prompt and problem ID based on selected difficulty
        if (easy) {
          setQuestionPrompt(easy.question || '');
          setProblemId(easy.id || '');
          setApiTestCases(easy.inputs || []);
          setApiTestResults(easy.outputs || []);
          setStarterCode(easy.starter_code || '');
        }

      } catch (error) {
        console.error('Error fetching question data:', error);
        setError('An error occurred while fetching question data');
      }
    };

    // Fetch data once on mount
    fetchTestCasesAndPrompt();
  }, []); // Empty dependency array ensures it runs only once on mount

  // Handle difficulty change without fetching data again
  useEffect(() => {
    if (difficulty === 'easy' && easyData) {
      setQuestionPrompt(easyData.question || '');
      setProblemId(easyData.id || '');
      setApiTestCases(easyData.inputs || []);
      setApiTestResults(easyData.outputs || []);
      setStarterCode(easyData.starter_code || '');
    } else if (difficulty === 'hard' && hardData) {
      setQuestionPrompt(hardData.question || '');
      setProblemId(hardData.id || '');
      setApiTestCases(hardData.inputs || []);
      setApiTestResults(hardData.outputs || []);
      setStarterCode(hardData.starter_code || '');
    }
  }, [difficulty, easyData, hardData]); // Only run this when difficulty changes

  // Handle code submission to the API (for both Run and Submit)
  const handleCodeSubmission = async (code: string, language: string, isSubmit: boolean) => {
    try {
      if (!user || !user.id) {
        throw new Error('User is not authenticated');
      }

      if (!problemId) {
        throw new Error('Problem ID is missing');
      }

      const response = await fetch('/api/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id, // User ID
          problem_id: problemId, // Send the problem ID
          language, // Programming language
          code, // The code submitted by the user
          is_submit: isSubmit, // Whether it's a submission
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit code');
      }

      const result = await response.json();

      // WebSocket connection for job status
      if (!result.job_id) {
        throw new Error('Job ID is missing in response');
      }

      const jobId = result.job_id;

      const ws = new WebSocket(`wss://main-api.click/ws/job-status/${jobId}`);

      ws.onopen = () => {
        console.log("WebSocket connected for job:", jobId);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Handle "done" status
        if (data.status === "done") {
          if (data.job_result.output) {
            setOutput(data.job_result.output);
          }

          setActualValues(data.job_result.output.actual_outputs || []); // Ensure actual_outputs is an array
          setPassedPerCase(data.job_result.output.passed_per_case || []);
          setPassedValues(data.job_result.output.passed || false); // Default to false if not available
          setError(data.job_result.output.error || null); // Default to null error if none
          ws.close(); // Close the WebSocket after receiving data
        }
        // Handle timeout case
        else if (data.status === "timeout") {
          setError("Job took too long to execute");
          ws.close(); // Close WebSocket if the job times out
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket error occurred");
        ws.close(); // Ensure WebSocket is closed on error
      };

      ws.onclose = () => {
        console.log("WebSocket closed for job:", jobId);
      };

      if (isSubmit) {
        console.log("Code submitted successfully!");
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while submitting the code.');
      if (!user || !user.id) {
        setError('Please sign in first');
      }
      setOutput(null);
    }
  };

  const tabs = [
    { name: 'Console', value: 'console', current: activeTab === 'console' },
    { name: 'Test Cases', value: 'testCases', current: activeTab === 'testCases' },
  ];

  const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

  const handleTestCaseSelection = (index: number) => {
    setSelectedTestCaseIndex(index);
  };

  return (
    <div
      style={{ height: 'calc(100vh - 60px)' }}
      className="flex flex-col md:flex-row w-full"
    >
      {/* Left Side: Question & Test Cases */}
      <div className="w-full md:w-1/2 p-4 border-r border-gray-300 dark:border-gray-600 overflow-y-auto" style={{ maxHeight: '100vh' }}>
        {/* Difficulty Selection */}
        <div className="mt-4 mb-4 flex gap-2 justify-center">
          {['Easy', 'Hard'].map((level) => (
            <button
              key={level}
              className={`px-4 py-2 text-sm text-white font-medium rounded-md ${
                difficulty === level.toLowerCase() ? 'bg-indigo-600' : 'bg-gray-500'
              }`}
              onClick={() => setDifficulty(level.toLowerCase() as 'easy' | 'hard')}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="text-lg mb-4">
          <p>{passedValues}</p>
          {questionPrompt ? <QuestionPrompt text={questionPrompt} /> : 'Loading question...'}
        </div>

        {/* Tab Navigation */}
        <div className="mt-4">
          <nav aria-label="Tabs" className="isolate flex divide-x divide-gray-200 dark:divide-gray-600 rounded-lg shadow dark:bg-black">
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

        {/* Display Test Cases */}
        {activeTab === 'testCases' && (
          <>
            <div className="mt-4 flex space-x-4 justify-center">
              {apiTestCases.map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {/* Conditionally render icons based on passedPerCase[index] */}
                  {passedPerCase[index] === false ? (
                    <XCircleIcon className="h-6 w-6 text-red-500" />
                  ) : passedPerCase[index] === true ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    // Neutral icon if value is undefined or null
                    <EllipsisHorizontalCircleIcon className="h-6 w-6 text-orange-400" /> // Neutral circle outline
                  )}

                  <button
                    key={index}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      selectedTestCaseIndex === index
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : 'bg-gray-500 text-gray-200 hover:bg-gray-400'
                    }`}
                    onClick={() => handleTestCaseSelection(index)}
                  >
                    Case {index + 1}
                  </button>
                </div>
              ))}
            </div>

            {/* Selected Test Case Details */}
            {selectedTestCaseIndex !== null && (
              <div>
                <TestCase
                  input={apiTestCases[selectedTestCaseIndex]}
                  expected_output={apiTestResults[selectedTestCaseIndex]}
                  actual_output={actualValues[selectedTestCaseIndex]}
                  passed={passedPerCase[selectedTestCaseIndex]}
                />
              </div>
            )}
          </>
        )}
        {activeTab === 'console' && (
          <div className="dark:bg-slate-800 mt-5 mb-5 p-4 border border-gray-300 dark:border-gray-600 rounded-md min-h-[100px]">
            {output?.error ? (
              <pre className="text-red-500">{output.error}</pre>
            ) : output?.console ? (
              <pre className="whitespace-pre-wrap">
                {Array.isArray(output.console)
                  ? output.console.join('').replace(/\\n/g, '\n')
                  : output.console.replace(/\\n/g, '\n')}
              </pre>
            ) : error ? (
              <pre className="text-red-500">{error}</pre>
            ) : (
              <p>No output yet</p>
            )}
          </div>
        )}
      </div>

      {/* Right Side: Code Editor */}
      <div className="w-full md:w-1/2 p-4 flex flex-col justify-between space-y-4">
        <MonacoEditorComponent
          questionId={problemId} 
          starterCode={starterCode ?? 'no code found'} 
          onSubmit={handleCodeSubmission}
        />
      </div>
    </div>
  );
};

export default EditorPage;
