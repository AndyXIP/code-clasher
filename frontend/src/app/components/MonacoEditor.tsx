'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface MonacoEditorComponentProps {
  onSubmit: (code: string, language: string, isSubmit: boolean) => void;
  starterCode: string;
}

const MonacoEditorComponent: React.FC<MonacoEditorComponentProps> = ({ onSubmit, starterCode}) => {
  const [value, setValue] = useState<string>(starterCode);

  useEffect(() => {
    setValue(starterCode)
  }, [starterCode]);

  const handleSubmit = (isSubmit: boolean) => {
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
            className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Submit Code
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language='python'
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
