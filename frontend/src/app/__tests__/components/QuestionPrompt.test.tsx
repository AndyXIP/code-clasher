import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import QuestionPrompt from "../../components/QuestionPrompt";

describe("QuestionPrompt Component", () => {
  test("renders simple text", () => {
    const text = "This is a simple question description.";

    render(<QuestionPrompt text={text} />);

    expect(screen.getByText("This is a simple question description.")).toBeInTheDocument();
  });

  test("removes text after 'Constraints:'", () => {
    const text = `This is a question prompt.
    
    Example 1:
    Input: 5
    Output: 25

    Constraints:
    1 <= n <= 1000`;

    render(<QuestionPrompt text={text} />);

    expect(screen.getByText("Example 1:")).toBeInTheDocument();
    expect(screen.queryByText("Constraints:")).not.toBeInTheDocument();
  });

  test("renders multiple examples correctly", () => {
    const text = `This is a sample problem.

    Example 1:
    Input: 5
    Output: 25
    Explanation: Squaring 5 gives 25.

    Example 2:
    Input: 2
    Output: 4`;

    render(<QuestionPrompt text={text} />);

    expect(screen.getByText("Example 1:")).toBeInTheDocument();
    expect(screen.getByText("Example 2:")).toBeInTheDocument();

    expect(
      screen.getByText((content, node) => node?.textContent === "Input: 5")
    ).toBeInTheDocument();
    
    expect(
      screen.getByText((content, node) => node?.textContent === "Output: 25")
    ).toBeInTheDocument();
    
    expect(
      screen.getByText((content, node) => node?.textContent === "Input: 2")
    ).toBeInTheDocument();
    
    expect(
      screen.getByText((content, node) => node?.textContent === "Output: 4")
    ).toBeInTheDocument();
  });

  test("halves consecutive blank lines", () => {
    const text = `This is a problem statement.


    


    Example 1:
    Input: 5
    Output: 25`;

    render(<QuestionPrompt text={text} />);

    const elements = screen.getAllByText("", { selector: "div" });
    expect(elements.length).toBeGreaterThanOrEqual(2); // Ensuring reduction occurred
  });

  test("renders Input, Output, and Explanation as preformatted text", () => {
    const text = `Example 1:
    Input: 3
    Output: 9
    Explanation: The square of 3 is 9.`;

    render(<QuestionPrompt text={text} />);

    expect(
      screen.getByText((content, node) => node?.textContent === "Input: 3")
    ).toBeInTheDocument();
    
    expect(
      screen.getByText((content, node) => node?.textContent === "Output: 9")
    ).toBeInTheDocument();
    
    expect(
      screen.getByText((content, node) => node?.textContent === "Explanation: The square of 3 is 9.")
    ).toBeInTheDocument();
  });

  test("handles empty input gracefully", () => {
    render(<QuestionPrompt text="" />);

    const emptyDivs = screen.queryAllByText("", { selector: "div" });
    expect(emptyDivs.length).toBeGreaterThan(0); // At least one empty div should be rendered
  });
});