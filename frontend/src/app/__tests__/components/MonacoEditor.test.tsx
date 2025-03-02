import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock MonacoEditor component
jest.mock("../../components/MonacoEditor", () => {
  return function MonacoEditorMock({ onSubmit }: { onSubmit: () => void }) {
    return (
      <div data-testid="monaco-mock">
        <button onClick={onSubmit}>Submit</button>
      </div>
    );
  };
});
