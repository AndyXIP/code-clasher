import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import MonacoEditor from "../../components/MonacoEditor";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../SupabaseClient";

// 🛠️ Mocking Monaco Editor
jest.mock("@monaco-editor/react", () => ({
  __esModule: true,
  default: () => <textarea data-testid="monaco-editor" />, // Simulating an editable textarea
}));

// 🛠️ Mocking the AuthContext
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// 🛠️ Mocking Supabase Client
jest.mock("../../SupabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  },
}));

describe("MonacoEditor", () => {
  const mockSubmit = jest.fn();
  const starterCode = "print('Hello, World!')";
  const questionId = "12345";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls onSubmit when Run button is clicked", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: "user1" }, loading: false });

    await act(async () => {
      render(<MonacoEditor onSubmit={mockSubmit} starterCode={starterCode} questionId={questionId} />);
    });

    const runButton = screen.getByText("Run");
    fireEvent.click(runButton);

    expect(mockSubmit).toHaveBeenCalledWith(starterCode, "python", false);
  });

  test("calls onSubmit when Submit button is clicked", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: "user1" }, loading: false });

    await act(async () => {
      render(<MonacoEditor onSubmit={mockSubmit} starterCode={starterCode} questionId={questionId} />);
    });

    const submitButton = screen.getByText("Submit Code");
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith(starterCode, "python", true);
  });

  test("alerts user if they try to submit code without logging in", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

    window.alert = jest.fn(); // Mock alert

    await act(async () => {
      render(<MonacoEditor onSubmit={mockSubmit} starterCode={starterCode} questionId={questionId} />);
    });

    const submitButton = screen.getByText("Submit Code");
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith("You need to be logged in to submit code!");
  });
});