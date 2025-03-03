import inspect
import re


def add_pass_to_starter_method_body(starter_code: str) -> str:
    print("Entering add_pass_to_starter_method_body()...")
    """
    Ensures that the starter code contains a valid function body.
    If the function is empty (just ends with ':'), this adds 'pass'
    with the correct indentation.
    """
    # Match functions that end with just a colon and possible spaces
    pattern = r"(def\s+\w+\s*\(.*\):\s*)$"

    # Add a properly indented 'pass' on a new line
    code_with_pass = re.sub(pattern, r"\1\n        pass", starter_code)  # 8 spaces (4 for method indent, 4 extra for body)

    return code_with_pass



def extract_method_signature(starter_code: str):
    print("Entering extract_method_signature()...")
    # Execute the starter code in a controlled environment
    print("Running: 'exec(starter_code, globals())'")
    exec(starter_code, globals())
    print("exec() completed!")

    # Ensure the Solution class exists
    if "Solution" not in globals():
        raise ValueError("Starter code must define a class named 'Solution'.")

    # Get the class reference
    solution_class = globals()["Solution"]

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

    test_payload = {
        "job_id": "4ce96567-2739-4a01-aea0-2e73af90c0dc",
        "problem_id": 3835,
        "language": "python",
        "code": """
class Solution:
    def countSegments(self, s: str) -> int:
        return 15""",
        "test_cases": {
            "inputs": [["Hello, my name is John"]],
            "outputs": [5]
        },
        "starter_code": """
class Solution:
    def countSegments(self, s: str) -> int:
        pass"""  # Fix: Added 'pass' to prevent exec() errors
    }


    pprint(test_payload)  # Pretty-print for debugging

    starter_code = test_payload["starter_code"]
    user_code = test_payload["code"]

    # Now call your function
    result = extract_method_signature(starter_code)
    print("Extracted Signature:", result)

    # Run validation
    validation_result = validate_user_code(starter_code, user_code)
    print("Validation Result:", validation_result)
