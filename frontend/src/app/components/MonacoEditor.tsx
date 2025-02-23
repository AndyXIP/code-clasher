'use client'

import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface MonacoEditorComponentProps {
  onSubmit: (code: string) => void;
}

const MonacoEditorComponent: React.FC<MonacoEditorComponentProps> = ({ onSubmit }) => {
  const [value, setValue] = useState('// Write your code here');
  const [language, setLanguage] = useState<'python' | 'cpp' | 'java'>('python'); // Default to Python
  const [theme, setTheme] = useState<'vs' | 'vs-dark'>('vs-dark'); // Default to dark theme

  // Force Monaco Editor to update theme immediately
  useEffect(() => {
    setTheme('vs-dark'); // Apply dark mode explicitly
  }, []);

  const handleSubmit = () => {
    onSubmit(value); // Pass the code to parent onSubmit function
  };

  return (
    <div>
      {/* Language Selector Dropdown */}
      <div className="mb-4">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-[200px] justify-between gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
              {language.charAt(0).toUpperCase() + language.slice(1)}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-[200px] origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 transition focus:outline-none"
            style={{ left: 0 }}
          >
            <div className="py-1">
              <MenuItem>
                <button
                  onClick={() => setLanguage('python')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  Python
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => setLanguage('cpp')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  Cpp/C++
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => setLanguage('java')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  Java
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>

      {/* Monaco Editor */}
      <MonacoEditor
        height="500px"
        language={language} // Dynamically set the language
        value={value}
        onChange={(newValue) => setValue(newValue || '')}
        options={{
          selectOnLineNumbers: true,
          fontSize: 14,
          lineNumbers: 'on',
          minimap: {
            enabled: false,
          },
          theme: theme, // Apply the theme (which is always vs-dark)
        }}
      />
      <button
        type="button"
        className="rounded-md bg-indigo-200 dark:bg-indigo-300 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
      >
        Run
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Submit Code
      </button>
    </div>
  );
};

export default MonacoEditorComponent;
