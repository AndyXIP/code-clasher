from flask import Flask, jsonify
from randomq import generate_random_questions

app = Flask(__name__)

@app.route('/random-questions', methods=['GET'])
def random_questions():
    try:
        questions = generate_random_questions()
        return jsonify({"questions": questions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the questions microservice on a separate port (e.g., 5001)
    app.run(debug=True, host='0.0.0.0', port=5001)
