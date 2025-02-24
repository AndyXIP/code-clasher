import requests
import json
import re

# API Gateway Invoke URL
api_url = "https://32wbvia4kh.execute-api.eu-north-1.amazonaws.com/evaluate"

# Exact input string
input_string = "4\n4\n0001\n1000\n0011\n0111\n3\n010\n101\n0\n2\n00000\n00001\n4\n01\n001\n0001\n00001\n"

# Expected output string
expected_output = "1\n3 \n-1\n0\n\n2\n1 2 \n"

# Prepare payload
payload = {
    "input": input_string,
    "expected_output": expected_output
}

# Headers for the request
headers = {
    "Content-Type": "application/json"
}

# Helper function for flexible output comparison
def normalize_output(output):
    # Remove trailing and leading whitespaces from each line
    lines = [line.strip() for line in output.strip().splitlines()]
    # Remove empty lines from the end and reduce multiple empty lines to one
    normalized = "\n".join(lines)
    # Remove any consecutive newlines
    normalized = re.sub(r'\n+', '\n', normalized)
    return normalized

# Execute the test
response = requests.post(api_url, headers=headers, json=payload)

# 🎨 Print Output in a Nicely Formatted Way
if response.status_code == 200:
    result = response.json()

    actual_output = result['actual_output']
    normalized_actual = normalize_output(actual_output)
    normalized_expected = normalize_output(expected_output)

    # Display outputs visually with visible whitespace markers
    def visualize_output(text):
        return text.replace("\n", "\\n↵\n")

    print("\n====================== 📊 TEST RESULT SUMMARY 📊 ======================\n")

    # Display Actual Output with whitespace markers
    print("🔍 **Actual Output (Normalized):**\n")
    print(visualize_output(normalized_actual))

    # Display Expected Output with whitespace markers
    print("✅ **Expected Output (Normalized):**\n")
    print(visualize_output(normalized_expected))

    # Compare normalized outputs
    if normalized_actual == normalized_expected:
        print("🎉 **Result:** Test Passed ✅")
    else:
        print("❌ **Result:** Test Failed ❌")
        print("\n🛠️  Outputs do not match. Please review the formatting or logic.")

    # Footer
    print("\n=======================================================================\n")

else:
    print(f"🚨 **Error:** {response.status_code} - {response.text}")
