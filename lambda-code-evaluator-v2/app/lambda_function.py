import json
import subprocess
import os
import tempfile
import asyncio
from glide import (
    ClosingError,
    ConnectionError,
    GlideClient,
    GlideClientConfiguration,
    Logger,
    LogLevel,
    NodeAddress,
    RequestError,
    TimeoutError
)
# from test_data_1 import TEST_DATA_1, SOLUTION_CODE_1
# from test_data_2 import TEST_DATA_2, SOLUTION_CODE_2

VALKEY_HOST = os.getenv("VALKEY_HOST")
VALKEY_PORT = os.getenv("VALKEY_PORT")


# ------------------------------
# Function to run user code.
# ------------------------------
def run_user_code(user_code, test_input):
    """
    Writes the user code to a temporary file and executes it using python3.
    The test_input is passed as JSON via stdin.
    Returns (stdout, stderr) from the execution.
    """
    # Create a temporary file to hold the user code.
    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False) as tmp:
        tmp.write(user_code)
        tmp_filename = tmp.name

    try:
        # Convert the test input (a Python object) to a JSON string.
        input_data = json.dumps(test_input)
        # Build the command to execute the Python code.
        cmd = ["/usr/bin/python3", tmp_filename]
        # Run the command, passing input_data to stdin.
        proc = subprocess.run(cmd, input=input_data, capture_output=True, text=True, timeout=35)
        return proc.stdout, proc.stderr
    except Exception as e:
        return "", str(e)
    finally:
        # Remove the temporary file.
        if os.path.exists(tmp_filename):
            os.remove(tmp_filename)

# ------------------------------
# Function to process the job across all test cases
# ------------------------------
def process_job(user_code, input_cases, expected_outputs):
    results = []
    for test_input, expected in zip(input_cases, expected_outputs):
        output, err = run_user_code(user_code, test_input)
        if err:
            result_data = {"error": err}
            passed = False
        else:
            try:
                result_data = json.loads(output)
            except Exception:
                result_data = output.strip()
            # Normalize: if result_data is not a list, wrap it
            if not isinstance(result_data, list):
                result_data = [result_data]
            passed = (result_data == expected)
        results.append({
            "test_input": test_input,
            "expected": expected,
            "actual": result_data,
            "passed": passed
        })
    return results


# ------------------------------
# Async function to store job result in Valkey
# ------------------------------
async def store_result_in_valkey(job_id, results):
    # Optional: set up logging
    Logger.set_logger_config(LogLevel.INFO)

    # Configure the Glide Cluster Client
    addresses = [NodeAddress(VALKEY_HOST, VALKEY_PORT)]
    config = GlideClientConfiguration(addresses=addresses, use_tls=True)
    client = None

    try:
        # Connect to Valkey
        client = await GlideClient.create(config)

        # Convert results to JSON string
        results_json = json.dumps({
            "status": "completed",
            "output": results
        })

        # Store with a TTL (e.g., 300 seconds)
        await client.set(f"job:{job_id}", results_json)
        await client.expire(f"job:{job_id}", 300)  # auto-expire in 5 minutes

    except (TimeoutError, RequestError, ConnectionError, ClosingError) as e:
        print(f"Valkey error: {e}")
    finally:
        if client:
            try:
                await client.close()
            except ClosingError as e:
                print(f"Error closing Valkey client: {e}")



# ------------------------------
# Main handler for Lambda
# ------------------------------
def lambda_handler(event, context):
    try:
        # If running via API Gateway, event may have a "body" field.
        if "body" in event:
            event = json.loads(event["body"])
        
        user_code = event.get("code")
        test_cases = event.get("test_cases")
        
        if not user_code:
            return {"statusCode": 400, "body": json.dumps("Missing user_code.")}
        
        input_cases = test_cases.get("inputs")
        expected_outputs = test_cases.get("outputs")
        
        if not input_cases or not expected_outputs:
            return {"statusCode": 400, "body": json.dumps("Missing test case data.")}
        
        results = process_job(user_code, input_cases, expected_outputs)
        return {
            "statusCode": 200,
            "body": json.dumps(results)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

# # ------------------------------
# # For local testing
# # ------------------------------
# if __name__ == '__main__':
#     # Create a test event containing the solution code and test data.
#     test_event_1 = {
#         "user_code": SOLUTION_CODE_1,
#         "test_cases": TEST_DATA_1
#     }
#     test_event_2 = {
#         "user_code": SOLUTION_CODE_2,
#         "test_cases": TEST_DATA_2
#     }
#     response = lambda_handler(test_event_1, None)
#     print("Response:", response)
#     print("\n\n")
#     response = lambda_handler(test_event_2, None)
#     print("Response:", response)
