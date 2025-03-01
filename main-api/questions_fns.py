import httpx
from fastapi import HTTPException, status

BASE_URL = "https://byspc9u2xa.execute-api.eu-north-1.amazonaws.com/random-questions"

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
