import httpx
import os

BASE_URL = os.getenv('LEADERBOARD_API_URL')

class DailyLeaderboardError(Exception):
    pass

async def get_leaderboard(count=5,difficulty_easy="introductory", difficulty_hard="interview"):
    print("Entering get_questions()...")
    """
    Fetches two sets of questions (easy & hard) from the external API..
    Raises a DailyLeaderboardError for network, status, or JSON errors.
    Returns a dict with keys 'easy' and 'hard' containing lists of questions.
    """
    query_string = f"/lambda-leaderboard?count={count}&difficulty="
    url_easy = f"{BASE_URL}{query_string}{difficulty_easy}"
    url_hard = f"{BASE_URL}{query_string}{difficulty_hard}"
    print("Constructed URLs for easy and hard calls")
    try:
        print("Enterying try block to make call...")
        async with httpx.AsyncClient(timeout=72.0) as client:
            print("Making calls")
            easy_response = await client.get(url_easy)
            print("First call made")
            hard_response = await client.get(url_hard)
            print("Second call made")
    except httpx.RequestError as exc:
        raise DailyLeaderboardError(f"Failed to contact external API: {str(exc)}") from exc

    if easy_response.status_code != 200:
        raise DailyLeaderboardError(f"Error fetching easy questions. Status code: {easy_response.status_code}")
    if hard_response.status_code != 200:
        raise DailyLeaderboardError(f"Error fetching hard questions. Status code: {hard_response.status_code}")

    try:
        easy_leaderboard = easy_response.json()
        hard_leaderboard = hard_response.json()
    except ValueError as exc:
        raise DailyLeaderboardError(f"Invalid JSON response from external API: {str(exc)}") from exc

    return {
        "easy": easy_leaderboard,
        "hard": hard_leaderboard
    }
