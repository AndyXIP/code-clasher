import inspect

def extract_method_signature(starter_code: str):
    # Execute the starter code in a controlled environment
    exec(starter_code, globals())

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
    # Extract expected method details from the starter code
    expected_signature = extract_method_signature(starter_code)

    # Extract the user’s method details
    try:
        user_signature = extract_method_signature(user_code)
    except Exception as e:
        return {"valid": False, "error": f"Invalid user code: {str(e)}"}

    # Compare method names
    if user_signature["method_name"] != expected_signature["method_name"]:
        return {"valid": False, "error": "Incorrect method name in user code."}

    # Compare parameter count
    if user_signature["param_count"] != expected_signature["param_count"]:
        return {"valid": False, "error": "Incorrect number of parameters in user code."}

    # (Optional) Compare parameter types
    expected_types = expected_signature["param_types"]
    user_types = user_signature["param_types"]

    if expected_types != user_types:
        return {"valid": False, "error": "Parameter types do not match the starter code."}

    # If everything passes:
    return {"valid": True, "message": "User code is valid!"}



if __name__ == '__main__':
    # Example Starter Code
    starter_code = """
    class Solution:
        def evaluate(self, expression: str) -> int:
            pass
    """

    # Example User Code (Correct)
    user_code_correct = """
    class Solution:
        def evaluate(self, expression: str) -> int:
            return len(expression)
    """

    # Example User Code (Incorrect Method Name)
    user_code_wrong_name = """
    class Solution:
        def compute(self, expression: str) -> int:
            return len(expression)
    """

    # Example User Code (Incorrect Parameter Count)
    user_code_wrong_params = """
    class Solution:
        def evaluate(self, expression: str, extra: int) -> int:
            return len(expression) + extra
    """

    # Tests
    # Example Starter Code
    starter_code = """
    class Solution:
        def evaluate(self, expression: str) -> int:
            pass
    """

    # Test
    print(extract_method_signature(starter_code))

    print(validate_user_code(starter_code, user_code_correct))  # Should be valid
    print(validate_user_code(starter_code, user_code_wrong_name))  # Method name mismatch
    print(validate_user_code(starter_code, user_code_wrong_params))  # Parameter count mismatch
