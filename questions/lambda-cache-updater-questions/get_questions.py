import httpx
import json

BASE_URL = "https://byspc9u2xa.execute-api.eu-north-1.amazonaws.com/random-questions"

class WeeklyQuestionsError(Exception):
    """Custom exception for errors fetching weekly questions."""
    pass

async def get_questions(count=5, source='leetcode', difficulty_easy = "introductory", difficulty_hard = "interview"):
    """
    Fetches two sets of weekly questions (easy & hard) from the external API.
    Raises a WeeklyQuestionsError if there's a network error, non-200 response,
    or JSON parsing error.
    Returns a dict with keys 'easy' and 'hard' containing lists of questions.
    """

    query_string = f"?count={count}&source={source}&difficulty="
    url_easy = f"{BASE_URL}{query_string}{difficulty_easy}"
    url_hard = f"{BASE_URL}{query_string}{difficulty_hard}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            easy_response = await client.get(url_easy)
            hard_response = await client.get(url_hard)
    except httpx.RequestError as exc:
        raise WeeklyQuestionsError(f"Failed to contact external API: {str(exc)}") from exc

    if easy_response.status_code != 200:
        raise WeeklyQuestionsError(f"Error fetching easy questions. Status code: {easy_response.status_code}")
    if hard_response.status_code != 200:
        raise WeeklyQuestionsError(f"Error fetching hard questions. Status code: {hard_response.status_code}")

    try:
        easy_questions = easy_response.json()
        hard_questions = hard_response.json()
    except ValueError as exc:
        raise WeeklyQuestionsError(f"Invalid JSON response from external API: {str(exc)}") from exc

    return {
        "easy": easy_questions,
        "hard": hard_questions
    }
