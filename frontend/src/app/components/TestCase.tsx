interface TestCaseProps {
  input: any;
  expected_output: any;
  actual_output: any;
  passed: boolean;
}

export default function TestCase({ input, expected_output, actual_output, passed }: TestCaseProps) {
  if (!input) return null;

  const formatData = (data: any) => {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return data;
  };

  const testCaseSections = [
    { title: "Input:", data: input },
    { title: "Expected Output:", data: expected_output },
    { title: "Actual Output:", data: actual_output },
    { title: "Passed:", data: passed }
  ];

  return (
    <div>
      {testCaseSections.map(({ title, data }, idx) => (
        <div key={idx} className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800">
          <h2 className="text-md font-bold">{title}</h2>
          <pre className="whitespace-pre-wrap break-words text-sm text-gray-700 dark:text-gray-200">
            {formatData(data)}
          </pre>
        </div>
      ))}
    </div>
  );
}
