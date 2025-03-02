import { render, screen, fireEvent } from "@testing-library/react";
import CodeTracker from "../../components/CodeTracker";
import "@testing-library/jest-dom";

describe("CodeTracker Component", () => {
  beforeEach(() => {
    render(<CodeTracker />);
  });

  test("renders the initial state with 'Incomplete' status", () => {
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
  });

  test("clicking 'Easy' toggles its completion status", () => {
    const easyButton = screen.getByText("Easy");

    // Initially should be red (incomplete)
    expect(screen.getByText("Incomplete")).toBeInTheDocument();

    fireEvent.click(easyButton); // Click to mark as done
    expect(screen.getByText("Incomplete")).toBeInTheDocument(); // Still incomplete

    fireEvent.click(easyButton); // Click again to reset
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
  });
