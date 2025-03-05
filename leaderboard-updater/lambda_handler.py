import os
import json
from datetime import datetime
from db_client import supabase

def lambda_handler(event, context):
    """
    Lambda handler to take JSON data from API Gateway, either from the request body
    or query string parameters, parse it, and insert the record into the 
    'completed_questions' table in Supabase.
    Expected fields: user_id, question_id, difficulty, and optionally completed_at.
    """
    print("DEBUG: Received event:", json.dumps(event))

    # 1. Attempt to get the body from the event
    body_str = event.get("body", "")
    if body_str:
        print("DEBUG: Found request body, attempting to parse it.")
        try:
            data = json.loads(body_str)
            print("DEBUG: Parsed data from body:", data)
        except json.JSONDecodeError as e:
            error_msg = f"Invalid JSON in body: {str(e)}"
            print("DEBUG:", error_msg)
            return {
                "statusCode": 400,
                "body": json.dumps({"error": error_msg})
            }
    else:
        # 2. If no body is provided, try to use query string parameters
        qs = event.get("queryStringParameters")
        if qs:
            print("DEBUG: No body found; using query string parameters:", qs)
            data = qs  # data is already a dictionary containing user_id, question_id, difficulty, etc.
        else:
            error_msg = "No input data provided (neither body nor query parameters)."
            print("DEBUG:", error_msg)
            return {
                "statusCode": 400,
                "body": json.dumps({"error": error_msg})
            }
    
    # 3. Validate required fields
    required_fields = ["user_id", "question_id", "difficulty"]
    for field in required_fields:
        if field not in data or not data[field]:
            error_msg = f"Missing required field: {field}"
            print("DEBUG:", error_msg)
            return {
                "statusCode": 400,
                "body": json.dumps({"error": error_msg})
            }
    
    # 4. Validate and process completed_at if provided
    if "completed_at" in data and data["completed_at"]:
        try:
            datetime.fromisoformat(data["completed_at"])
            print("DEBUG: 'completed_at' is valid ISO 8601.")
        except Exception as e:
            error_msg = "Invalid 'completed_at' format. Must be ISO 8601."
            print("DEBUG:", error_msg, e)
            return {
                "statusCode": 400,
                "body": json.dumps({"error": error_msg})
            }
    
    print("DEBUG: Final input data to be inserted:", data)
    
    # 5. Insert data into Supabase 'completed_questions' table.
    try:
        print("DEBUG: Inserting data into Supabase table 'completed_questions'...")
        response = supabase.table("completed_questions").insert(data).execute()
        print("DEBUG: Raw response from Supabase:", response)
        result = response.dict()
        if result.get("error"):
            error_msg = result["error"].get("message", "Unknown error")
            print("DEBUG: Supabase returned error:", error_msg)
            return {
                "statusCode": 500,
                "body": json.dumps({"error": error_msg})
            }
    except Exception as e:
        error_msg = f"Failed to insert data: {str(e)}"
        print("DEBUG:", error_msg)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": error_msg})
        }
    
    success_msg = "Data inserted successfully"
    print("DEBUG:", success_msg, "Inserted data:", result.get("data"))
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": success_msg,
            "data": result.get("data")
        })
    }

