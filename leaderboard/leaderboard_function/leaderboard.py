import os
from db_client.db_client import supabase


def get_top_leaderboard_entries(count=5, difficulty="introductory"):
    # Optionally override count from an environment variable, if set.
    count = int(os.getenv("LEADERBOARD_COUNT", count))

    # Debug: log the environment variables (mask sensitive info if needed)
    print("DEBUG: SUPABASE_URL =", os.getenv("SUPABASE_URL"))
    # Note: You might not want to print the key in production!
    print("DEBUG: SUPABASE_KEY =", os.getenv("SUPABASE_KEY"))
    print(
        f"DEBUG: get_top_leaderboard_entries called with count={count}, difficulty={difficulty}"
    )

    # Query for top entries based on 'introductory' score (highest first)
    introductory_query = (
        supabase.table("leaderboard")
        .select("display_name, introductory")
        .order("introductory", desc=True)
        .limit(count)
    )
    introductory_response = introductory_query.execute()
    print("DEBUG: introductory_response =", introductory_response)
    introductory_data = introductory_response.dict()
    if introductory_data.get("error"):
        error_msg = introductory_data["error"].get("message", "Unknown error")
        raise RuntimeError(
            f"Error fetching 'introductory' leaderboard: {error_msg}"
        )
    introductory_leaders = introductory_data.get("data", [])

    # Query for top entries based on 'interview' score (highest first)-
    interview_query = (
        supabase.table("leaderboard")
        .select("display_name, interview")
        .order("interview", desc=True)
        .limit(count)
    )
    interview_response = interview_query.execute()
    print("DEBUG: interview_response =", interview_response)
    interview_data = interview_response.dict()
    if interview_data.get("error"):
        error_msg = interview_data["error"].get("message", "Unknown error")
        raise RuntimeError(
            f"Error fetching 'interview' leaderboard: {error_msg}"
        )
    interview_leaders = interview_data.get("data", [])

    # Transform the data into a simplified format
    introductory_results = [
        {"name": entry["display_name"], "score": entry["introductory"]}
        for entry in introductory_leaders
    ]
    interview_results = [
        {"name": entry["display_name"], "score": entry["interview"]}
        for entry in interview_leaders
    ]

    result = {
        "introductory": introductory_results,
        "interview": interview_results,
    }
    print("DEBUG: returning result =", result)
    return result
