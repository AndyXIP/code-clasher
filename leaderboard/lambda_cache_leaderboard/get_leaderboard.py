import httpx
import os

BASE_URL = os.getenv('LEADERBOARD_API_URL')

class DailyLeaderboardError(Exception):
    pass

async def get_leaderboard(count=5):
    """
    Fetches the entire leaderboard (with 'introductory' and 'interview' lists),
    sorts each by 'score', and returns the top `count` items for each difficulty.
    """
    url = f"{BASE_URL.rstrip('/')}/lambda-leaderboard"  # ensure no trailing slash

    try:
        async with httpx.AsyncClient(timeout=72.0) as client:
            response = await client.get(url)
    except httpx.RequestError as exc:
        raise DailyLeaderboardError(f"Failed to contact external API: {str(exc)}") from exc
    
    if response.status_code != 200:
        raise DailyLeaderboardError(f"Error fetching leaderboard data. "
                                   f"Status code: {response.status_code}")

    try:
        data = response.json()
    except ValueError as exc:
        raise DailyLeaderboardError(f"Invalid JSON response from external API: {str(exc)}") from exc

    # 'data' should be a dict with 'introductory' and 'interview' lists
    intro_list = data.get("introductory", [])
    interview_list = data.get("interview", [])

    # Sort each list by score descending
    intro_sorted = sorted(intro_list, key=lambda x: x.get("score", 0), reverse=True)
    interview_sorted = sorted(interview_list, key=lambda x: x.get("score", 0), reverse=True)

    # Slice top N
    intro_top = intro_sorted[:count]
    interview_top = interview_sorted[:count]

    return {
        "easy": intro_top,
        "hard": interview_top
    }
