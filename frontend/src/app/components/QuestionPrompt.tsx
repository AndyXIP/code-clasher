import React from "react";

/**
 * Takes an array of lines and reduces consecutive blank lines by half.
 * For example:
 * - 2 consecutive blank lines => 1 blank line
 * - 4 consecutive blank lines => 2 blank lines
 * - 3 consecutive blank lines => 1 blank line (since floor(3/2) = 1)
 */
function reduceConsecutiveBlankLines(lines: string[]): string[] {
  const result: string[] = [];
  let blankCount = 0;

  for (const line of lines) {
    const isBlank = line.trim() === "";

    if (isBlank) {
      blankCount++;
    } else {
      // Output half of the blank lines (rounded down)
      const half = Math.floor(blankCount / 2);
      for (let i = 0; i < half; i++) {
        result.push("");
      }
      blankCount = 0;
      // Then output the current (non-blank) line
      result.push(line);
    }
  }

  // If trailing blank lines at the end, produce half of them
  const half = Math.floor(blankCount / 2);
  for (let i = 0; i < half; i++) {
    result.push("");
  }

  return result;
}

export function parseAndFormatPrompt(multilineText: string): React.ReactNode[] {
  // Split into raw lines
  const rawLines = multilineText.split(/\r?\n/);

  // Halve consecutive blank lines
  const lines = reduceConsecutiveBlankLines(rawLines);

  // Find the first index of a line that starts with "Example N:"
  const firstExampleIndex = lines.findIndex((line) =>
    /^Example\s+\d+:/i.test(line.trim())
  );

  // Separate description (everything before the first example) and examples (rest)
  const descriptionLines =
    firstExampleIndex >= 0 ? lines.slice(0, firstExampleIndex) : lines;
  const exampleLines =
    firstExampleIndex >= 0 ? lines.slice(firstExampleIndex) : [];

  // Render description lines
  const renderedDescription = descriptionLines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      // Blank line => small vertical space
      return <div key={`desc-${idx}`} style={{ margin: "0.5em 0" }} />;
    }
    return (
      <p key={`desc-${idx}`} style={{ margin: "0.5em 0" }}>
        {trimmed}
      </p>
    );
  });

  // Render example lines
  const renderedExamples = exampleLines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={`ex-${index}`} style={{ margin: "0.5em 0" }} />;
    }

    // Detect lines like "Example 1:", "Example 2:", etc.
    const exampleMatch = trimmed.match(/^Example\s+(\d+):/i);
    if (exampleMatch) {
      return (
        <div
          key={`ex-${index}`}
          style={{
            marginTop: "1em",
            marginBottom: "1em"
          }}
        >
          <strong>{trimmed}</strong>
        </div>
      );
    }

    // Detect lines like "Input: ...", "Output: ...", "Explanation: ..."
    const prefixRegex = /^(Input|Output|Explanation):\s*(.*)$/i;
    const prefixMatch = trimmed.match(prefixRegex);
    if (prefixMatch) {
      const prefix = prefixMatch[1];
      const rest = prefixMatch[2];
      return (
        <pre
          key={`ex-${index}`}
          style={{
            borderLeft: "4px solid #ccc",
            paddingLeft: "12px",
            backgroundColor: "#f5f5f5",
            padding: "0.5em",
            margin: "0.0em 0",
            borderRadius: "2px",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap"
          }}
        >
          <strong>{prefix}:</strong>{" "}
          <span className="text-gray-600 dark:text-gray-300">{rest}</span>
        </pre>
      );
    }

    // Default line
    return <div key={`ex-${index}`}>{trimmed}</div>;
  });

  // Combine description and examples
  return [...renderedDescription, ...renderedExamples];
}

interface QuestionPromptProps {
  text: string;
}

export default function QuestionPrompt({ text }: QuestionPromptProps): JSX.Element {
  const formattedElements = parseAndFormatPrompt(text);
  return <div>{formattedElements}</div>;
}
