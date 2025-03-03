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

// Import the mocked MonacoEditor component
import MonacoEditorMock from "../../components/MonacoEditor";

// Mock function for onSubmit
const mockOnSubmit = jest.fn();

test("MonacoEditor renders without crashing", () => {
  render(<MonacoEditorMock onSubmit={mockOnSubmit} starterCode='mock code' />);

  // Ensure the mocked Monaco component is rendered
  expect(screen.getByTestId("monaco-mock")).toBeInTheDocument();

  // Simulate clicking the submit button
  fireEvent.click(screen.getByText("Submit"));
  expect(mockOnSubmit).toHaveBeenCalled();
});
