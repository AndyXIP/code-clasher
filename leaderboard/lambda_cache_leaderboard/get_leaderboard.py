import httpx
import os

BASE_URL = os.getenv('LEADERBOARD_API_URL')

class DailyLeaderboardError(Exception):
    pass

async def get_leaderboard(count=5):
    """
    Fetches all leaderboard data from the external API, then returns the
    top `count` entries for each difficulty (introductory & interview).
    
    Returns a dict with keys 'easy' and 'hard', each containing a list
    of top users sorted by their respective score in descending order.
    """
    # Debugging environment variable
    print(f"DEBUG: LEADERBOARD_API_URL = {BASE_URL}")

    url = f"{BASE_URL}/lambda-leaderboard"  # Single endpoint returning all data
    print(f"DEBUG: Constructed URL = {url}")

    try:
        async with httpx.AsyncClient(timeout=72.0) as client:
            print("DEBUG: About to make GET request for leaderboard data...")
            response = await client.get(url)
            print(f"DEBUG: Response received. Status code = {response.status_code}")
            # Optionally, you can print partial body for debugging (be mindful of large payloads)
            print(f"DEBUG: Response body (truncated to 300 chars): {response.text[:300]}")
    except httpx.RequestError as exc:
        raise DailyLeaderboardError(f"Failed to contact external API: {str(exc)}") from exc
    
    if response.status_code != 200:
        raise DailyLeaderboardError(f"Error fetching leaderboard data. "
                                   f"Status code: {response.status_code}")

    try:
        data = response.json()  # Expecting a list of rows
        print(f"DEBUG: Successfully parsed JSON. Number of records = {len(data)}")
    except ValueError as exc:
        raise DailyLeaderboardError(f"Invalid JSON response from external API: {str(exc)}") from exc

    # Sort for easy (introductory) descending
    easy_sorted = sorted(data, key=lambda x: x.get("introductory", 0), reverse=True)
    easy_top = easy_sorted[:count]

    # Sort for hard (interview) descending
    hard_sorted = sorted(data, key=lambda x: x.get("interview", 0), reverse=True)
    hard_top = hard_sorted[:count]

    print("DEBUG: Returning top records for easy & hard.")
    return {
        "easy": easy_top,
        "hard": hard_top
    }
