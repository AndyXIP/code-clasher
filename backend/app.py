from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from compile_code import compile_code  # Import the compile_code function

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

        if not code:
            return jsonify({"message": "No code provided"}), 400
        if not language:
            return jsonify({"message": "No language provided"}), 400

        # Print the submitted code and language to the console for debugging
        print(f"Submitted Code ({language}):\n{code}")

        # Compile and run the code
        output, error = compile_code(language, code)
        print(f"Output: {output}")
        print(f"Error: {error}")

        # Check for errors
        if error:
            return jsonify({"message": "Error occurred", "error": error}), 400
        
        return jsonify({"message": "Code executed successfully!", "output": output})

    except Exception as e:
        print(f"Server Error: {str(e)}")  # Log the error
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)