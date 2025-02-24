import requests
import json

# API Gateway Invoke URL
api_url = "https://32wbvia4kh.execute-api.eu-north-1.amazonaws.com/evaluate"

# Input test case for Mikhail's movement problem
input_string = "3\n2 2 3\n4 3 7\n10 1 9\n"
expected_output = "1\n6\n-1\n"

# Prepare payload for Lambda
payload = {
    "input": input_string,
    "expected_output": expected_output
}

# Headers for the request
headers = {
    "Content-Type": "application/json"
}

# Visualize whitespace differences for better debugging
def visualize_output(text):
    return text.replace("\n", "\\n↵\n")

# Execute the test
response = requests.post(api_url, headers=headers, json=payload)

# 🎨 Print Output in a Nicely Formatted Way
if response.status_code == 200:
    result = response.json()

    actual_output = result['actual_output'].strip()
    normalized_expected = expected_output.strip()

    print("\n====================== 📊 TEST RESULT SUMMARY 📊 ======================\n")
    
    # Display Actual Output with visible whitespace
    print("🔍 **Actual Output (Visible Whitespace):**\n")
    print(visualize_output(actual_output))

    # Display Expected Output with visible whitespace
    print("✅ **Expected Output (Visible Whitespace):**\n")
    print(visualize_output(normalized_expected))

    # Comparison and result message
    if actual_output == normalized_expected:
        print("🎉 **Result:** Test Passed ✅")
    else:
        print("❌ **Result:** Test Failed ❌")
        print("\n🛠️  Please review the differences between actual and expected outputs.")

    print("\n=======================================================================\n")
else:
    print(f"🚨 **Error:** {response.status_code} - {response.text}")
