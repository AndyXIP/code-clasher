'use client'

import React from 'react';
import MonacoEditorComponent from '../../components/MonacoEditor';

const EditorPage = () => {
  const handleCodeSubmission = async (code: string, language: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }), // Sending both code and language
      });

      if (!response.ok) {
        throw new Error('Failed to submit code');
      }

      const result = await response.json();
      alert('Code submitted successfully: ' + result.message);
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting the code');
    }
  };

  return (
    <div className="ml-4 mr-4">
      <h1>Hard Question - question</h1>

      {/* Monaco Editor with Language Selector */}
      <MonacoEditorComponent onSubmit={handleCodeSubmission} />
    </div>
  );
};

export default EditorPage;
