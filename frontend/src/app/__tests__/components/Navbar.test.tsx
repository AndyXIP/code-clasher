import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../../components/Navbar";
import { supabase } from "../../SupabaseClient";
import { usePathname } from "next/navigation";

// Mocking Supabase Auth
jest.mock("../../SupabaseClient", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      signOut: jest.fn().mockResolvedValue(null),
    },
  },
}));

// Mocking usePathname from Next.js
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders navbar with navigation links", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<Navbar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Leader Board")).toBeInTheDocument();
    expect(screen.getByText("Problems")).toBeInTheDocument();
  });

  test("applies active styles to the current page link", () => {
    (usePathname as jest.Mock).mockReturnValue("/about");

    render(<Navbar />);
    
    const activeLink = screen.getByText("About");
    expect(activeLink).toHaveClass("bg-gray-300 text-black dark:bg-gray-700 dark:text-white");
  });

  test("shows Sign In button when no user is logged in", () => {
    render(<Navbar />);

    const signInButton = screen.getByText("Sign In");
    expect(signInButton).toBeInTheDocument();
  });

  test("shows Sign Out button when user is logged in", async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: "user1", email: "test@example.com" } } },
    });

    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });
  });

  test("logs out user when Sign Out button is clicked", async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: "user1" } } },
    });

    render(<Navbar />);

    await waitFor(() => {
      const signOutButton = screen.getByText("Sign Out");
      fireEvent.click(signOutButton);
    });

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });
  });
});
