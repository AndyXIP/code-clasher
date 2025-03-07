import random
from db_client.db_client import supabase


def generate_random_questions(
    count=7, difficulty="introductory", source="leetcode"
):
    print((
        f"DEBUG: generate_random_questions called with count={count}, "
        f"difficulty={difficulty}, source={source}"
    ))

    # Build the query for questions that haven't been seen
    query = supabase.table("questions_generated").select("*")
    if difficulty:
        query = query.eq("difficulty", difficulty)
    if source:
        query = query.eq("source", source)
    query = query.eq("seen", False)

    response = query.execute()
    print("DEBUG: supabase response =", response)
    data = response.dict()
    if data.get("error"):
        error_msg = data["error"].get("message", "Unknown error")
        raise RuntimeError(f"Error fetching questions: {error_msg}")

    questions = data.get("data", [])

    # If there are not enough unseen questions, reset the seen flag and update id for all rows
    if len(questions) < count:
        print((
            "DEBUG: Not enough unseen questions; "
            "resetting seen status and incrementing id for all rows."
        ))
        # Get all questions (ignoring seen flag)
        all_response = supabase.table("questions_test").select("*").execute()
        all_data = all_response.dict()
        if all_data.get("error"):
            error_msg = all_data["error"].get("message", "Unknown error")
            raise RuntimeError(f"Error fetching all questions: {error_msg}")
        all_questions = all_data.get("data", [])

        # For each question, update: set seen=False and add 1000 to its id
        for q in all_questions:
            new_id = q["id"] + 1000
            print(f"DEBUG: Updated question id {q['id']} to new id {new_id}, set seen to False.")

        # Re-run the query to get unseen questions (with filters)
        query = supabase.table("questions_generated").select("*")
        if difficulty:
            query = query.eq("difficulty", difficulty)
        if source:
            query = query.eq("source", source)
        query = query.eq("seen", False)
        response = query.execute()
        data = response.dict()
        if data.get("error"):
            error_msg = data["error"].get("message", "Unknown error")
            raise RuntimeError(
                f"Error fetching questions after update: {error_msg}"
            )
        questions = data.get("data", [])
        if len(questions) < count:
            raise ValueError(
                "Still not enough questions available even after resetting seen status."
            )

    # Randomly sample the desired count of questions
    result = random.sample(questions, count)

    # Drop the columns "inpputs" and "outputs" (if present)
    # and rename "generated_inputs" to "inputs" and "generated_outputs" to "outputs"
    for question in result:
        if "inpputs" in question:
            del question["inpputs"]
        if "outputs" in question:
            del question["outputs"]
        if "generated_inputs" in question:
            question["inputs"] = question.pop("generated_inputs")
        if "generated_outputs" in question:
            question["outputs"] = question.pop("generated_outputs")

    print("DEBUG: returning questions =", result)
    return result
