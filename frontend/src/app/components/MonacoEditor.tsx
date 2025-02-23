'use client'

import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface MonacoEditorComponentProps {
  darkMode: boolean;
  onSubmit: (code: string) => void;
}

const MonacoEditorComponent: React.FC<MonacoEditorComponentProps> = ({ darkMode, onSubmit }) => {
  const [value, setValue] = useState('// Write your code here');
  const [theme, setTheme] = useState<'vs' | 'vs-dark'>('vs-dark'); // Default to dark mode
  const [language, setLanguage] = useState<'python' | 'cpp' | 'java'>('python'); // Default to Python

  // Update theme based on darkMode prop
  useEffect(() => {
    setTheme(darkMode ? 'vs-dark' : 'vs');
  }, [darkMode]);

  const handleSubmit = () => {
    onSubmit(value); // Pass the code to parent onSubmit function
  };

  return (
    <div>
      {/* Language Selector */}
      <div className="mb-4">
        <label htmlFor="language-select" className="block text-lg">Choose a language:</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'python' | 'cpp' | 'java')}
          className="px-4 py-2 border rounded"
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
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
          theme,
        }}
      />

      <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Submit Code
      </button>
    </div>
  );
};

export default MonacoEditorComponent;