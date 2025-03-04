'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../SupabaseClient';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface MonacoEditorComponentProps {
  onSubmit: (code: string, language: string, isSubmit: boolean) => void;
  starterCode: string;
  questionId: string;
}

const MonacoEditorComponent: React.FC<MonacoEditorComponentProps> = ({ onSubmit, starterCode, questionId }) => {
  const [value, setValue] = useState<string>(starterCode);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    setValue(starterCode);
  }, [starterCode]);

  useEffect(() => {
    const checkQuestionCompletion = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('completed_questions')
            .select('question_id')
            .eq('user_id', user.id)
            .eq('question_id', questionId)
            .single();  // Expect a single record
  
          // If there's an error, handle it (but don't treat missing data as an error)
          if (error) {
            console.error("Error fetching completed questions:", error);
            setIsSubmitDisabled(false);  // Enable submit button if there's an error
            return;  // Exit early if there's an error
          }
  
          // If data is not found, the user hasn't completed the question yet, so enable submit
          if (!data) {
            setIsSubmitDisabled(false);  
          } else {
            setIsSubmitDisabled(true);   // Question has been completed, disable submit
          }
  
        } catch (error) {
          // Catch any unexpected errors in the try block
          console.error("Unexpected error:", error);
          setIsSubmitDisabled(false); // Default to enabling submit on unexpected error
        }
      }
    };

    // Check if user is authenticated and `questionId` is available
    if (!loading && user && questionId) {
      checkQuestionCompletion();
    }
  }, [user, questionId, loading]); // Re-run when `user`, `questionId`, or `loading` state changes

  const handleSubmit = (isSubmit: boolean) => {
    if (!user) {
      alert("You need to be logged in to submit code!");
      return;
    }
    onSubmit(value, 'python', isSubmit);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Language Selector Dropdown */}
      <div className="mb-2 flex justify-between items-center">
        <div className="relative inline-block text-left">
          <div className="inline-flex w-[200px] justify-between gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
            Python
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="rounded-md bg-indigo-200 dark:bg-indigo-300 px-3.5 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
          >
            Run
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitDisabled} // Disable the Submit button based on state
            className={`rounded-md px-3.5 py-2 text-sm font-semibold shadow-sm ${
              isSubmitDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            Submit Code
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language="python"
          value={value}
          onChange={(newValue) => setValue(newValue || '')}
          options={{
            selectOnLineNumbers: true,
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            theme: 'vs-dark',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
};

export default MonacoEditorComponent;
