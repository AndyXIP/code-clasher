import subprocess
import json
import tempfile
import os


def execute_user_code_subprocess(user_code: str, test_cases: dict):
    """Executes user code inside a subprocess efficiently by processing all test cases in one run."""

    input_cases = test_cases["inputs"]

    # Write user code to a temporary script file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".py", mode="w") as temp_script:
        temp_script_name = temp_script.name
        temp_script.write(user_code + "\n\n")

        # Append wrapper code to process all test cases at once, capturing prints and errors separately
        temp_script.write("""
import sys
import json
import traceback
import io

if __name__ == "__main__":
    # Read all test cases from stdin
    test_cases = json.loads(sys.stdin.read())

    # Instantiate Solution and retrieve method dynamically
    solution_instance = Solution()
    method_name = [m for m in dir(solution_instance) if callable(getattr(solution_instance, m)) and not m.startswith("__")][0]
    user_method = getattr(solution_instance, method_name)

    results = []
    print_logs = []
    error_logs = []

    for case in test_cases:
        try:
            # Capture print statements
            stdout_buffer = io.StringIO()
            sys.stdout = stdout_buffer  # Redirect stdout

            # Execute function
            result = user_method(*case)

            # Restore stdout and capture prints
            sys.stdout = sys.__stdout__
            print_logs.append(stdout_buffer.getvalue())

            results.append(result)

        except Exception as e:
            sys.stdout = sys.__stdout__  # Restore stdout on error
            error_message = traceback.format_exc()
            error_logs.append(error_message)
            results.append(None)  # Placeholder for failed cases

    # Print final output as JSON
    print(json.dumps({"outputs": results, "print_logs": print_logs, "errors": error_logs}))
""")

    # Run the user script in a single subprocess
    try:
        result = subprocess.run(
            ["python3", temp_script_name],
            input=json.dumps(input_cases),  # Pass all test cases at once
            capture_output=True,
            text=True,
            timeout=5
        )
    finally:
        os.remove(temp_script_name)  # Clean up temp file

    # Process output
    stdout_output = result.stdout.strip()
    stderr_output = result.stderr.strip()

    if stderr_output:
        return {"error": stderr_output}

    try:
        execution_result = json.loads(stdout_output)
        return execution_result  # {"outputs": [...], "print_logs": [...], "errors": [...]}
    except json.JSONDecodeError:
        return {"error": "Failed to parse execution output."}




def evaluate_results(test_cases, execution_result):
    """Compares actual and expected outputs, formats final JSON response."""

    # Extract actual outputs and console logs
    actual_outputs = execution_result.get("outputs", [])
    console_logs = execution_result.get("print_logs", [])
    error_logs = execution_result.get("errors", [])

    expected_outputs = test_cases["outputs"]

    # Determine pass/fail
    passed = actual_outputs == expected_outputs

    # If errors occurred, store the first one
    error_message = error_logs[0] if error_logs else None

    # Format final response
    return {
        "passed": passed,
        "error": error_message,
        "console": console_logs if console_logs else None,
        "inputs": test_cases["inputs"],
        "expected_outputs": expected_outputs,
        "actual_outputs": actual_outputs
    }



if __name__ == '__main__':
    from test_data_1 import SOLUTION_CODE_1, TEST_DATA_1
    # Run execution with the provided test data
    print("\nEXECUTION:")
    response = execute_user_code_subprocess(SOLUTION_CODE_1, TEST_DATA_1)
    print(json.dumps(response, indent=2))
    # Example Usage
    print("\nEVALUATION:")
    final_result = evaluate_results(TEST_DATA_1, response)
    print(json.dumps(final_result, indent=2))



