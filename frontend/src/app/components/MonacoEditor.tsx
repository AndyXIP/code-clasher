'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface MonacoEditorComponentProps {
  onSubmit: (code: string, language: string, isSubmit: boolean) => void;
}

const MonacoEditorComponent: React.FC<MonacoEditorComponentProps> = ({ onSubmit }) => {
  const [value, setValue] = useState('// Write your code here');
  const [language, setLanguage] = useState<'python' | 'cpp' | 'java'>('python');
  const [theme, setTheme] = useState<'vs' | 'vs-dark'>('vs');

  useEffect(() => {
    // Get the stored theme or default to 'vs-dark'
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;

    setTheme(isDarkMode ? 'vs-dark' : 'vs');
  }, []);
 
  const handleSubmit = (isSubmit: boolean) => {
    onSubmit(value, language, isSubmit);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Language Selector Dropdown */}
      <div className="mb-2 flex justify-between items-center">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="inline-flex w-[200px] justify-between gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
            {language.charAt(0).toUpperCase() + language.slice(1)}
            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
          </MenuButton>

          <MenuItems className="absolute left-0 z-10 mt-2 w-[200px] rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5">
            <div className="py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => setLanguage('python')}
                    className={`block w-full px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-700 dark:text-white'
                    } text-left`}
                  >
                    Python
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => setLanguage('cpp')}
                    className={`block w-full px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-700 dark:text-white'
                    } text-left`}
                  >
                    Cpp/C++
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => setLanguage('java')}
                    className={`block w-full px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-700 dark:text-white'
                    } text-left`}
                  >
                    Java
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>

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
          language={language}
          value={value}
          onChange={(newValue) => setValue(newValue || '')}
          options={{
            selectOnLineNumbers: true,
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            theme: theme, // Set theme dynamically based on the mode
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
};

export default MonacoEditorComponent;
