import httpx
import os
import json

BASE_URL = os.getenv('LEADERBOARD_API_URL')

class DailyLeaderboardError(Exception):
    pass

async def get_leaderboard(count=5):
    print(f"DEBUG: LEADERBOARD_API_URL = {BASE_URL}")

    url = f"{BASE_URL}/lambda-leaderboard"
    print(f"DEBUG: Constructed URL = {url}")

    try:
        async with httpx.AsyncClient(timeout=72.0) as client:
            print("DEBUG: About to make GET request for leaderboard data...")
            response = await client.get(url)
            print(f"DEBUG: Response received. Status code = {response.status_code}")
            print(f"DEBUG: Response body (truncated to 300 chars): {response.text[:300]}")
    except httpx.RequestError as exc:
        raise DailyLeaderboardError(f"Failed to contact external API: {str(exc)}") from exc
    
    if response.status_code != 200:
        raise DailyLeaderboardError(f"Error fetching leaderboard data. Status code: {response.status_code}")

    try:
        data = json.loads(response.text)
        print(f"DEBUG: Successfully parsed JSON. Number of top-level keys = {len(data)}")
    except ValueError as exc:
        raise DailyLeaderboardError(f"Invalid JSON response from external API: {str(exc)}") from exc

    # Extract the lists for each category
    introductory_list = data.get("introductory", [])
    interview_list = data.get("interview", [])

    # Sort for easy (introductory) descending
    easy_sorted = sorted(introductory_list, key=lambda x: x.get("score", 0), reverse=True)
    easy_top = easy_sorted[:count]

    # Sort for hard (interview) descending
    hard_sorted = sorted(interview_list, key=lambda x: x.get("score", 0), reverse=True)
    hard_top = hard_sorted[:count]

    print("DEBUG: Returning top records for easy & hard.")
    return {
        "easy": easy_top,
        "hard": hard_top
    }
