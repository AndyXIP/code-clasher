import os
import random
from db_client.db_client import supabase

def generate_random_questions(count=7, difficulty='introductory', source='leetcode'):
    print("DEBUG: SUPABASE_URL =", os.getenv("SUPABASE_URL"))
    print("DEBUG: SUPABASE_KEY =", os.getenv("SUPABASE_KEY"))  # optional, or mask if sensitive
    print(f"DEBUG: generate_random_questions called with count={count}, difficulty={difficulty}, source={source}")

    query = supabase.table("questions").select("*")
    if difficulty:
        query = query.eq("difficulty", difficulty)
    if source:
        query = query.eq("source", source)

    response = query.execute()
    print("DEBUG: supabase response =", response)

    data = response.dict()
    if data.get("error"):
        error_msg = data["error"].get("message", "Unknown error")
        raise RuntimeError(f"Error fetching questions: {error_msg}")

    questions = data.get("data", [])
    if len(questions) < count:
        raise ValueError("Not enough questions available.")

    result = random.sample(questions, count)
    print("DEBUG: returning questions =", result)
    return result
