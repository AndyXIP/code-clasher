import json
from leaderboard import get_top_leaderboard_entries

def lambda_handler(event, context):
    try:
        # Extract any query parameters (if needed)
        qs = event.get("queryStringParameters") or {}
        
        # For example, let’s see if the user can pass 'count' via ?count=10
        count = int(qs["count"]) if "count" in qs else 5

        # Call your leaderboard function with that count
        leaderboard = get_top_leaderboard_entries(count=count)

        # Return an HTTP 200 with JSON
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(leaderboard)
        }
    except Exception as e:
        # If something goes wrong, log and return a 500
        print("Error in lambda_handler:", str(e))
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }
