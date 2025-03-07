import subprocess
import json
import tempfile
import os
import resource


def limit_resources():
    # Limit the address space to 256MB
    resource.setrlimit(
        resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024)
    )
    # Limit CPU time to 5 seconds (this is in addition to the timeout)
    resource.setrlimit(resource.RLIMIT_CPU, (5, 5))


def execute_user_code_subprocess(user_code: str, test_cases: dict):
    print("Entering execute_user_code_subprocess()...")
    """Executes user code inside a subprocess efficiently by processing all test cases in one run."""
    input_cases = test_cases["inputs"]

    # Write user code to a temporary script file
    with tempfile.NamedTemporaryFile(
        delete=False, suffix=".py", mode="w"
    ) as temp_script:
        temp_script_name = temp_script.name

        # Write imports needed for user code before writing user code
        temp_script.write(
            """
import json                          
import math
import collections
import heapq
import queue as q
import itertools
import functools
import bisect
import re
import string
import datetime
import statistics
import random
import typing
from typing import List, Tuple, Dict, Set, Optional
from collections import defaultdict, deque, Counter
"""
        )
        # THEN write user code
        temp_script.write(user_code + "\n\n")

        # Append wrapper code to process all test cases at once, capturing prints and errors separately
        temp_script.write(
            """
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
"""
        )

    try:
        result = subprocess.run(
            ["python3", temp_script_name],
            input=json.dumps(input_cases),
            capture_output=True,
            text=True,
            timeout=5,
            preexec_fn=limit_resources,
        )
    except subprocess.TimeoutExpired as e:
        return {"error": "Time limit exceeded."}
    finally:
        os.remove(temp_script_name)  # Clean up temp file

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
    print("Entering evaluate_results()...")
    """Compares actual and expected outputs, formats final JSON response."""

    # Extract actual outputs and console logs
    actual_outputs = execution_result.get("outputs", [])
    console_logs = execution_result.get("print_logs", [])
    error_logs = execution_result.get("errors", [])

    expected_outputs = test_cases["outputs"]

    # Build a boolean array for pass/fail per test case
    passed_per_case = []
    for i in range(len(expected_outputs)):
        # If actual_outputs is shorter than expected_outputs, handle gracefully
        actual = actual_outputs[i] if i < len(actual_outputs) else None
        expected = expected_outputs[i]
        passed_per_case.append(actual == expected)

    # Overall pass/fail is true if all test cases passed
    passed = all(passed_per_case)

    # If errors occurred, store the first one
    error_message = error_logs[0] if error_logs else None

    # Format final response
    return {
        "passed": passed,
        "passed_per_case": passed_per_case,
        "error": error_message,
        "console": console_logs if console_logs else None,
        "inputs": test_cases["inputs"],
        "expected_outputs": expected_outputs,
        "actual_outputs": actual_outputs,
    }
