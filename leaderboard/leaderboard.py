from db_client.db_client import supabase

def get_top_leaderboard_entries(count=5):
    """
    Fetch the top leaderboard entries for 'introductory' and 'interview' columns,
    and return them in a simplified structure.
    
    :param count: Number of top entries to retrieve for each difficulty.
    :return: A dictionary with keys 'introductory' and 'interview' containing lists of 
             dictionaries, each with 'display_name' and 'score'.
    """
    # Query for top entries based on 'introductory' score (highest first)
    introductory_query = (
        supabase.table("leaderboard")
        .select("display_name, introductory")
        .order("introductory", desc=True)
        .limit(count)
    )
    introductory_response = introductory_query.execute()
    introductory_data = introductory_response.dict()
    if introductory_data.get("error"):
        error_msg = introductory_data["error"].get("message", "Unknown error")
        raise RuntimeError(f"Error fetching 'introductory' leaderboard: {error_msg}")
    introductory_leaders = introductory_data.get("data", [])

    # Query for top entries based on 'interview' score (highest first)
    interview_query = (
        supabase.table("leaderboard")
        .select("display_name, interview")
        .order("interview", desc=True)
        .limit(count)
    )
    interview_response = interview_query.execute()
    interview_data = interview_response.dict()
    if interview_data.get("error"):
        error_msg = interview_data["error"].get("message", "Unknown error")
        raise RuntimeError(f"Error fetching 'interview' leaderboard: {error_msg}")
    interview_leaders = interview_data.get("data", [])

    # Transform the data to a simplified format-
    introductory_results = [{"name": entry["display_name"], "score": entry["introductory"]} for entry in introductory_leaders]
    interview_results = [{"name": entry["display_name"], "score": entry["interview"]} for entry in interview_leaders]

    return {
        "introductory": introductory_results,
        "interview": interview_results,
    }
