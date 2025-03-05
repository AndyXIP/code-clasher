import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CodeTracker from "../../components/CodeTracker"; 
import { useAuth } from "../../contexts/AuthContext"; 
import { supabase } from "../../SupabaseClient.js";


// Mocking the AuthContext
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mocking Supabase
jest.mock("../../SupabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
    })),
  },
}));

describe("CodeTracker Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the default state when user is not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

    render(<CodeTracker />);

    expect(screen.getByText("Last 24 Hours")).toBeInTheDocument();
    expect(screen.getByText("Daily Code Completions")).toBeInTheDocument();
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
  });

  test("displays 'Complete' when both easy and hard problems are done", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: "123" }, loading: false });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockResolvedValue({
        data: [
          { difficulty: "introductory", completed_at: new Date().toISOString() },
          { difficulty: "interview", completed_at: new Date().toISOString() },
        ],
        error: null,
      }),
    });

    render(<CodeTracker />);

    await waitFor(() => expect(screen.getByText("Complete")).toBeInTheDocument());
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  test("displays 'Incomplete' when only one type of problem is done", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: "123" }, loading: false });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockResolvedValue({
        data: [{ difficulty: "introductory", completed_at: new Date().toISOString() }], // Only "Easy" completed
        error: null,
      }),
    });

    render(<CodeTracker />);

    await waitFor(() => expect(screen.getByText("Incomplete")).toBeInTheDocument());
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  test("displays 'Incomplete' when no problems are completed", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: "123" }, loading: false });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockResolvedValue({
        data: [], // No completed problems
        error: null,
      }),
    });

    render(<CodeTracker />);

    await waitFor(() => expect(screen.getByText("Incomplete")).toBeInTheDocument());
  });

  test("handles API error gracefully", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: "123" }, loading: false });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockResolvedValue({
        data: null,
        error: "Database error",
      }),
    });

    render(<CodeTracker />);

    await waitFor(() => expect(screen.getByText("Incomplete")).toBeInTheDocument());
  });
});
