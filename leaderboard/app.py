from flask import Flask, jsonify
from leaderboard import get_top_leaderboard_entries

app = Flask(__name__)

@app.route("/leaderboard", methods=["GET"])
def leaderboard_route():
    try:
        leaderboard = get_top_leaderboard_entries()
        return jsonify(leaderboard), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def lambda_handler(event, context):
    return awsgi.response(app, event, context)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)

