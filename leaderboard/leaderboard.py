from db_client.db_client import supabase

def get_top_leaderboard_entries(count=5):
    """
    Fetch the top leaderboard entries for 'easy' and 'medium' columns,
    and return them in a simplified structure.
    
    :param count: Number of top entries to retrieve for each difficulty.
    :return: A dictionary with keys 'easy' and 'medium' containing lists of 
             dictionaries, each with 'display_name' and 'score'.
    """
    # Query for top entries based on 'easy' score (highest first)
    easy_query = (
        supabase.table("leaderboard")
        .select("display_name, easy")
        .order("easy", desc=True)
        .limit(count)
    )
    easy_response = easy_query.execute()
    easy_data = easy_response.dict()
    if easy_data.get("error"):
        error_msg = easy_data["error"].get("message", "Unknown error")
        raise RuntimeError(f"Error fetching 'easy' leaderboard: {error_msg}")
    easy_leaders = easy_data.get("data", [])

    # Query for top entries based on 'medium' score (highest first)
    medium_query = (
        supabase.table("leaderboard")
        .select("display_name, medium")
        .order("medium", desc=True)
        .limit(count)
    )
    medium_response = medium_query.execute()
    medium_data = medium_response.dict()
    if medium_data.get("error"):
        error_msg = medium_data["error"].get("message", "Unknown error")
        raise RuntimeError(f"Error fetching 'medium' leaderboard: {error_msg}")
    medium_leaders = medium_data.get("data", [])

    # Transform the data to a simplified format
    easy_results = [{"name": entry["display_name"], "score": entry["easy"]} for entry in easy_leaders]
    medium_results = [{"name": entry["display_name"], "score": entry["medium"]} for entry in medium_leaders]

    return {
        "easy": easy_results,
        "medium": medium_results,
    }
