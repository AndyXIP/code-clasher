import random
from db_client.db_client import supabase

def generate_random_questions(count=5, difficulty='introductory'):
    """
    Fetch questions from Supabase, optionally filtering by difficulty,
    then randomly return `count` questions.
    
    :param count: The number of random questions to return.
    :param difficulty: If provided, filter questions by difficulty.
    :return: A list of random question dictionaries.
    """
    # Build the base query
    query = supabase.table("questions").select("*")
    
    # If a difficulty filter is provided, add a condition
    if difficulty:
        query = query.eq("difficulty", difficulty)
    
    response = query.execute()
    data = response.dict()

    if data.get("error"):
        error_msg = data["error"].get("message", "Unknown error")
        raise RuntimeError(f"Error fetching questions: {error_msg}")

    questions = data.get("data", [])
    if len(questions) < count:
        raise ValueError("Not enough questions available to generate the requested number of questions.")

    return random.sample(questions, count)
