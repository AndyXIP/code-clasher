from flask import Flask, request, jsonify
from flask_cors import CORS
from compile_code import compile_code  # Your existing compile_code function

app = Flask(__name__)

# Enable CORS for the entire app
CORS(app)

@app.route('/api/submit-code', methods=['POST'])
def submit_code():
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Extract the code and language from the request body
        code = data.get('code')
        language = data.get('language')

        # Check if code and language are provided
        if not code:
            return jsonify({"message": "No code provided"}), 400
        if not language:
            return jsonify({"message": "No language provided"}), 400

        # Compile and run the code
        output, error = compile_code(language, code)

        # If there is an error during compilation or execution
        if error:
            return jsonify({"message": "Compilation or execution error", "error": error}), 400

        # Return the successful execution output
        return jsonify({"message": "Code executed successfully!", "output": output})

    except Exception as e:
        # Log unexpected errors
        print(f"Server Error: {str(e)}")
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route('/api/get-test-cases', methods=['GET'])
def get_test_cases():
    # Example test cases and their corresponding expected outputs
    test_cases = [
        {"testCase": "[1, 2, 5]", "expectedOutput": "8"},
        {"testCase": "[6, 1, -4, 1]", "expectedOutput": "4"}
    ]
    return jsonify({"testCases": test_cases})

if __name__ == "__main__":
    app.run(debug=True)
