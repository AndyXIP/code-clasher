import json
from randomq import generate_random_questions  # Adjust if your file is named differently

def lambda_handler(event, context):
    try:
        # Optionally, extract query parameters from event["queryStringParameters"]
        count = 5  # default value
        difficulty = 'introductory'
        if event.get("queryStringParameters"):
            qs = event["queryStringParameters"]
            if "count" in qs:
                count = int(qs["count"])
            if "difficulty" in qs:
                difficulty = qs["difficulty"]

        questions = generate_random_questions(count=count, difficulty=difficulty)
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"questions": questions})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }
