'use client'

import React from 'react';
import MonacoEditorComponent from '../../components/MonacoEditor';

const EditorPage = () => {
  const handleCodeSubmission = async (code: string) => {
    try {
      const response = await fetch('/api/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // Sending the code in the body
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
      <h1>Easy Question - question</h1>

      {/* Monaco Editor with Language Selector */}
      <MonacoEditorComponent onSubmit={handleCodeSubmission} />
    </div>
  );
};

export default EditorPage;
