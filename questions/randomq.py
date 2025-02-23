import random
from .db_client.db_client import supabase

def generate_random_questions():
    """
    Fetch all questions from Supabase and randomly return 7 questions.
    """
    response = supabase.table("questions").select("*").execute()
    data = response.dict()

    if data.get("error"):
        error_msg = data["error"].get("message", "Unknown error")
        raise RuntimeError(f"Error fetching questions: {error_msg}")

    questions = data.get("data", [])
    if len(questions) < 7:
        raise ValueError("Not enough questions available to generate 7 random questions.")

    return random.sample(questions, 7)
