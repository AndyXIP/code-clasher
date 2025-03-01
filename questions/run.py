import json
from randomq import generate_random_questions  # Adjust if your file is named differently

def lambda_handler(event, context):
    try:
        print("DEBUG: Received event:", event)
        
        count = 5
        difficulty = 'introductory'
        if event.get("queryStringParameters"):
            qs = event["queryStringParameters"]
            print("DEBUG: queryStringParameters:", qs)
            if "count" in qs:
                count = int(qs["count"])
            if "difficulty" in qs:
                difficulty = qs["difficulty"]

        print(f"DEBUG: Attempting to fetch {count} questions with difficulty='{difficulty}'")
        
        questions = generate_random_questions(count=count, difficulty=difficulty)
        print("DEBUG: questions returned:", questions)

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"questions": questions})
        }
    except Exception as e:
        print("ERROR:", str(e))
        import traceback
        traceback.print_exc()
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }
