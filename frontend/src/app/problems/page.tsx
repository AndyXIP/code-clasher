'use client';

import React, { useState, useEffect } from 'react';
import MonacoEditorComponent from '../components/MonacoEditor';

const EditorPage = () => {
  const [easyData, setEasyData] = useState<any>(null);
  const [hardData, setHardData] = useState<any>(null);
  const [questionPrompt, setQuestionPrompt] = useState<string>('');
  const [problemId, setProblemId] = useState<string>('');
  const [apiTestCases, setApiTestCases] = useState<(string | number | (string | number)[])[][]>([]);
  const [apiTestResults, setApiTestResults] = useState<(string | number | (string | number)[])[][]>([]);
  
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number | string | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'testCases'>('console');
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [passedValues, setPassedValues] = useState<boolean[]>([]);
  const [actualValues, setActualValues] = useState<string[]>([]);

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

        // Set default test case for the selected difficulty
        if (easy && easy.input && easy.input.length > 0) {
          setSelectedTestCaseIndex(0);
        }

        // Set the question prompt and problem ID based on selected difficulty
        if (difficulty === 'easy' && easy) {
          setQuestionPrompt(easy.question || '');
          setProblemId(easy.id || '');
          setApiTestCases(easy.inputs || '');
          setApiTestResults(easy.outputs || '');
        } else if (difficulty === 'hard' && hard) {
          setQuestionPrompt(hard.question || '');
          setProblemId(hard.id || '');
          setApiTestCases(hard.inputs || '');
          setApiTestResults(hard.outputs || '');
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
      setApiTestCases(easyData.input || []);
      setApiTestResults(easyData.output || []);
    } else if (difficulty === 'hard' && hardData) {
      setQuestionPrompt(hardData.question || '');
      setProblemId(hardData.id || '');
      setApiTestCases(hardData.input || []);
      setApiTestResults(hardData.output || []);
    }
  }, [difficulty, easyData, hardData]); // Only run this when difficulty changes

  // Handle code submission to the API (for both Run and Submit)
  const handleCodeSubmission = async (code: string, language: string, isSubmit: boolean = false) => {
    try {
      if (!problemId) {
        throw new Error('Problem ID is missing');
      }

      const response = await fetch('/api/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem_id: problemId,  // Send the problem ID
          language,               // Programming language
          code,                   // The code submitted by the user
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

        if (data.status === "done") {
          setOutput(data.job_result);
          const actualValues = extractActualValues(data.job_result);
          const passedValues = extractPassedValues(data.job_result);
          setActualValues(actualValues);
          setPassedValues(passedValues);
          setError(null);
          ws.close();
        } else if (data.status === "timeout") {
          setError("Job took too long to execute");
          ws.close();
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket error occurred");
        ws.close();
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
      setOutput(null);
    }
  };

  const tabs = [
    { name: 'Console', value: 'console', current: activeTab === 'console' },
    { name: 'Test Cases', value: 'testCases', current: activeTab === 'testCases' },
  ];

  const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

  const flattenArray = (arr: (string | number | (string | number)[])[]): string => {
    return arr
      .map(item => {
        if (Array.isArray(item)) {
          return flattenArray(item);
        }
        return String(item);
      })
      .join(', ');
  };

  const handleTestCaseSelection = (index: number) => {
    setSelectedTestCaseIndex(index);
  };

  const extractActualValues = (data: any) => {
    if (data && Array.isArray(data.output)) {
      return data.output.map((testCase: any) => testCase.actual).flat();
    }
    return [];
  };

  const extractPassedValues = (data: any) => {
    if (data && Array.isArray(data.output)) {
      return data.output.map((testCase: any) => testCase.passed);
    }
    return [];
  };

  return (
    <div
      style={{ height: 'calc(100vh - 60px)' }}
      className="flex flex-col md:flex-row w-full"
    >
      {/* Left Side: Question & Test Cases */}
      <div className="w-full md:w-1/2 p-4 border-r border-gray-300 dark:border-gray-600">
        <h1 className="text-lg font-bold mb-4">{questionPrompt || 'Loading question...'}</h1>

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

        {/* Tab Navigation */}
        <div className="mt-4">
          <nav aria-label="Tabs" className="isolate flex divide-x divide-gray-200 rounded-lg shadow dark:bg-black">
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
              {/* Conditional rendering based on the selected difficulty */}
              {Array.isArray(difficulty === 'easy' ? easyData?.inputs : hardData?.inputs) &&
              (difficulty === 'easy' ? easyData?.inputs : hardData?.inputs).length > 0 ? (
                // Normalize inputs in case it's an array of arrays or a single array
                (Array.isArray(difficulty === 'easy' ? easyData?.inputs : hardData?.inputs[0])
                  ? (difficulty === 'easy' ? easyData?.inputs : hardData?.inputs)
                  : [(difficulty === 'easy' ? easyData?.inputs : hardData?.inputs)]).map((testCase, index) => (
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
                ))
              ) : (
                <p>No test cases available</p>
              )}
            </div>

            {selectedTestCaseIndex !== null && (
              <div className="mt-4">
                <div className="mt-2 p-4 bg-gray-100 dark:bg-slate-800 rounded-md border border-gray-300">
                  <strong>Input:</strong>
                  <p>{flattenArray(difficulty === 'easy' ? easyData?.inputs[selectedTestCaseIndex] : hardData?.inputs[selectedTestCaseIndex])}</p>
                </div>

                <div className="mt-2 p-4 bg-gray-100 dark:bg-slate-800 rounded-md border border-gray-300">
                  <strong>Expected Output:</strong>
                  <pre>{JSON.stringify(difficulty === 'easy' ? easyData?.outputs[selectedTestCaseIndex] : hardData?.outputs[selectedTestCaseIndex], null, 2)}</pre>
                </div>

                <div className="mt-2 p-4 bg-gray-100 dark:bg-slate-800 rounded-md border border-gray-300">
                  <strong>Id:</strong>
                  <pre>{JSON.stringify(difficulty === 'easy' ? easyData?.id[selectedTestCaseIndex] : hardData?.id[selectedTestCaseIndex], null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'console' && (
          <div className="dark:bg-slate-800 mt-5 mb-5 p-4 border border-gray-300 rounded-md min-h-[100px]">
            {output ? <pre className="whitespace-pre-wrap">{JSON.stringify(output.status, null, 2)}</pre> : error ? <pre className="text-red-500">{error}</pre> : <p>No output yet</p>}
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
