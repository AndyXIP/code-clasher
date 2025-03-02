import httpx
from fastapi import HTTPException, status
from datetime import datetime, timezone

BASE_URL = "https://byspc9u2xa.execute-api.eu-north-1.amazonaws.com/random-questions"

def get_day_index(timestamp_str: str) -> int:
    """
    Computes the number of days between the provided timestamp (assumed to be the day start)
    and the current day (UTC). Returns 0 if the result would be negative.
    """
    try:
        # Parse the timestamp; ensure it is treated as UTC.
        day_start = datetime.fromisoformat(timestamp_str)
        if day_start.tzinfo is None:
            day_start = day_start.replace(tzinfo=timezone.utc)
    except Exception as e:
        raise Exception("Invalid timestamp format: " + str(e))
    
    # Get today's day start in UTC.
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    delta_days = (today - day_start).days
    return max(delta_days, 0)


async def get_weekly_questions():
    """
    Fetches two sets of weekly questions (easy & hard) from the external API.
    Raises an HTTPException if there's a network error or non-200 response.
    Returns a dict with keys 'easy' and 'hard' containing lists of questions.
    """
    count = 7
    source = "leetcode"
    difficulty_easy = "introductory"
    difficulty_hard = "interview"

    query_string = f"?count={count}&source={source}&difficulty="
    url_easy = f"{BASE_URL}{query_string}{difficulty_easy}"
    url_hard = f"{BASE_URL}{query_string}{difficulty_hard}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            easy_response = await client.get(url_easy)
            hard_response = await client.get(url_hard)
    except httpx.RequestError as exc:
        # Network or connection error
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Failed to contact external API: {str(exc)}"
        ) from exc

    # Check HTTP status codes
    if easy_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error fetching easy questions. Status code: {easy_response.status_code}"
        )
    if hard_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error fetching hard questions. Status code: {hard_response.status_code}"
        )

    # Parse JSON
    try:
        easy_questions = easy_response.json()
        hard_questions = hard_response.json()
    except ValueError as exc:
        # JSON parse error
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Invalid JSON response from external API: {str(exc)}"
        ) from exc

    return {
        "easy": easy_questions,
        "hard": hard_questions
    }
