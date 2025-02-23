from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

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

        # Print the submitted code and language to the console
        print(f"Submitted Code ({language}):")
        print(code)  # This will print the code in the server logs

        # Respond with success
        return jsonify({"message": "Code submitted successfully!"})

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
