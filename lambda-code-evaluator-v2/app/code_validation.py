import inspect
import re
import textwrap

# FOR THE exec() ENVIRONMENT:
import math
import collections
import heapq
import queue as q
import itertools
import functools
import bisect
import re
import json
import string
import datetime
import statistics
import random
import typing
from typing import List, Tuple, Dict, Set, Optional
from collections import defaultdict, deque, Counter


def add_pass_to_starter_method_body(starter_code: str) -> str:
    lines = starter_code.splitlines()
    new_lines = []
    for i, line in enumerate(lines):
        new_lines.append(line)
        # Check if the line ends with ':' (indicating a block start)
        if line.rstrip().endswith(":"):
            current_indent = len(line) - len(line.lstrip())
            expected_body_indent = current_indent + 4  # one extra indent level
            # If there's no next line or the next line is only whitespace, insert 'pass'
            if i + 1 >= len(lines) or not lines[i+1].strip():
                new_lines.append(" " * expected_body_indent + "pass")
    return "\n".join(new_lines)


def extract_method_signature(starter_code: str):
    print("Entering extract_method_signature()...")

    # Define a safe execution environment with required imports
    exec_globals = {
        "__builtins__": __builtins__,  # Safe built-in functions
        "math": math,
        "collections": collections,
        "heapq": heapq,
        "queue": q,
        "itertools": itertools,
        "functools": functools,
        "bisect": bisect,
        "re": re,
        "json": json,
        "string": string,
        "datetime": datetime,
        "statistics": statistics,
        "random": random,
        "typing": typing,  # Ensure typing module is available
        "List": List,
        "Tuple": Tuple,
        "Dict": Dict,
        "Set": Set,
        "Optional": Optional,
        "defaultdict": defaultdict,
        "deque": deque,
        "Counter": Counter,
    }
    exec_locals = {}  # Keeps execution isolated

    print("Running exec() in a sandbox environment...")

    try:
        exec(starter_code, exec_globals, exec_locals)  # Isolated execution
    except Exception as e:
        raise ValueError(f"Failed to execute starter code: {str(e)}")

    print("exec() completed!")

    # Ensure the Solution class exists
    if "Solution" not in exec_locals:
        raise ValueError("Starter code must define a class named 'Solution'.")

    # Get the class reference from the sandbox
    solution_class = exec_locals["Solution"]

    # Retrieve all methods inside the class
    methods = inspect.getmembers(solution_class, inspect.isfunction)

    # Ensure exactly one method exists
    if len(methods) != 1:
        raise ValueError("Starter code must contain exactly one method inside 'Solution'.")

    # Extract method details
    method_name, method_ref = methods[0]
    method_signature = inspect.signature(method_ref)

    # Extract parameter details (excluding 'self')
    param_names = list(method_signature.parameters.keys())[1:]  # Skip 'self'
    param_types = [param.annotation for param in list(method_signature.parameters.values())[1:]]  # Skip 'self'

    return {
        "method_name": method_name,
        "param_count": len(param_names),
        "param_types": param_types
    }


def validate_user_code(starter_code: str, user_code: str):
    print("Entering validate_user_code()...")

    # Add 'pass' to method body in starter code
    starter_code = add_pass_to_starter_method_body(starter_code)
    print(f"NEW STARTER CODE WITH PASS: {starter_code}")
    print("Added 'pass' to starter_code method body")

    # Extract expected method details from the starter code
    expected_signature = extract_method_signature(starter_code)
    print("Signature extracted")

    # Extract the user’s method details
    try:
        user_signature = extract_method_signature(user_code)
    except Exception as e:
        print(f"Invalid user code: {str(e)}")
        return {"valid": False, "error": f"Invalid user code: {str(e)}"}

    # Compare method names
    if user_signature["method_name"] != expected_signature["method_name"]:
        print("Incorrect method name in user code.")
        return {"valid": False, "error": "Incorrect method name in user code."}

    # Compare parameter count
    if user_signature["param_count"] != expected_signature["param_count"]:
        print("Incorrect number of parameters in user code.")
        return {"valid": False, "error": "Incorrect number of parameters in user code."}

    # (Optional) Compare parameter types
    expected_types = expected_signature["param_types"]
    user_types = user_signature["param_types"]

    if expected_types != user_types:
        print("Parameter types do not match the starter code.")
        return {"valid": False, "error": "Parameter types do not match the starter code."}

    # If everything passes:
    print("Validation success!")
    return {"valid": True, "message": "User code is valid!"}




if __name__ == '__main__':
    from pprint import pprint
    starter_code_test = '\nclass Solution:\n    def minDeletionSize(self, A: List[str]) -> int:\n        '
    code_test = '\nclass Solution:\n    def minDeletionSize(self, A: List[str]) -> int:\n        return 10000'

    test_payload = {
        "job_id": "4ce96567-2739-4a01-aea0-2e73af90c0dc",
        "problem_id": 3835,
        "language": "python",
        "code": code_test,
        "test_cases": {
            "inputs": [["Hello, my name is John"]],
            "outputs": ['500']
        },
        "starter_code": starter_code_test
    }


    pprint(test_payload)  # Pretty-print for debugging

    starter_code = test_payload["starter_code"]
    user_code = test_payload["code"]

    # Run validation
    validation_result = validate_user_code(starter_code, user_code)
    print("Validation Result:", validation_result)
