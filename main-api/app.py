from fastapi import FastAPI, HTTPException, WebSocket, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import boto3
import os
import uuid
import json
import time
from dotenv import load_dotenv
from typing import List, Optional, Dict, Any
import asyncio
from glide import (
    GlideClient,
    GlideClientConfiguration,
    NodeAddress,
    TimeoutError,
    RequestError,
    ConnectionError,
    ClosingError,
    Logger,
    LogLevel
)
from questions_fns import get_day_index, parse_inputs_outputs
from leaderboard import format_leaderboard_data

load_dotenv()

app = FastAPI()
origins = ['https://sse-team-project.vercel.app', 'http://localhost:3000', 'http://127.0.0.1:3000']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
valkey_client = None

sqs = boto3.client('sqs', region_name=os.getenv('AWS_REGION', 'eu-north-1'))
SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL')

# class SubmitCodePayload(BaseModel):
#     code: str
#     problem_id: str
#     language: str
#     is_submit: bool

class DailyQuestion(BaseModel):
    problem_id: str
    description: str
    test_cases: list

@app.get("/")
async def index():
    return {"message": "Welcome to the Main API!"}

@app.on_event("startup")
async def startup_event():
    """
    Initializes the Valkey client once, when the FastAPI app starts.
    """
    global valkey_client
    Logger.set_logger_config(LogLevel.INFO)

    addresses = [
        NodeAddress("main-cache-mutbnm.serverless.eun1.cache.amazonaws.com", 6379)
    ]
    config = GlideClientConfiguration(addresses=addresses, use_tls=True)
    try:
        valkey_client = await GlideClient.create(config)
        print("Valkey client created successfully.")
    except Exception as e:
        print("Failed to create Valkey client:", e)
        raise e


@app.on_event("shutdown")
async def shutdown_event():
    """
    Gracefully close the Valkey client on shutdown.
    """
    global valkey_client
    if valkey_client:
        try:
            await valkey_client.close()
            print("Valkey client closed successfully.")
        except ClosingError as e:
            print("Error closing Valkey client:", e)

# ==== API Routes ====
# Daily Q Helper 
async def get_daily_questions():
    global valkey_client
    if not valkey_client:
        return {"error": "Valkey client not initialized."}

    key = "active_questions"
    try:
        cached_value = await valkey_client.get(key)
        if cached_value:
            active_questions_data = json.loads(cached_value)
        else:
            return {"error": "Could not find data in cache for key 'active_questions'."}
    except Exception as e:
        return {"error": str(e)}
    
    # Calculate the day index relative to the stored timestamp.
    ts = active_questions_data.get("timestamp")
    if not ts:
        return {"error": "Cache data missing timestamp."}

    day_index = get_day_index(ts)
    print(f"Day index: {day_index}")

    # Retrieve today's questions.
    questions = active_questions_data.get("questions", {})
    easy_section = questions.get("easy", {})
    hard_section = questions.get("hard", {})
    easy_qs = easy_section.get("questions", [])
    hard_qs = hard_section.get("questions", [])
    
    if not easy_qs or not hard_qs:
        return {"error": "No questions available in cache."}

    # If the day index is greater than or equal to the number of questions, use the last one.
    if day_index >= len(easy_qs):
        day_index = len(easy_qs) - 1

    easy = easy_qs[day_index]
    hard = hard_qs[day_index]
    print(f"Today's easy Q: {easy}")
    print(f"Today's hard Q: {hard}")

    # Remove the "solutions" key from both question objects, if present.
    easy.pop("solutions", None)
    hard.pop("solutions", None)

    # Parse stringified arrays for I/O keys back into arrays
    easy = parse_inputs_outputs(easy)
    hard = parse_inputs_outputs(hard)

    # Return the selected questions as a JSON object.
    return {"easy": easy, "hard": hard}

# Route now checks for errors before returning response
@app.get("/api/daily-question")
async def daily_question(difficulty: str = "easy"):
    daily_qs = await get_daily_questions()

    # If an error occurred in the helper, return it as a 500 response
    if "error" in daily_qs:
        raise HTTPException(status_code=500, detail=daily_qs["error"])

    return daily_qs

    

@app.post("/api/submit-code")
async def submit_code(payload: Dict[str, Any]):
    daily_qs = await get_daily_questions()
    # If an error occurred in the helper, return it as a 500 response
    if "error" in daily_qs:
        raise HTTPException(status_code=500, detail=daily_qs["error"])

    easy_q = daily_qs["easy"]
    hard_q = daily_qs["hard"]
    problem_id = payload["problem_id"]  # problem_id from frontend
    question = None

    if problem_id == easy_q["id"]:      # just 'id' from cache
        question = easy_q
    elif problem_id == hard_q["id"]:
        question = hard_q
    
    if question is None:
        return {
            "status": "failed to find matching problem_id in cache",
            "job_id": None
        }

    job_id = str(uuid.uuid4())
    test_cases = {
        'inputs': question["inputs"],
        'outputs': question["outputs"]
    } 
    starter_code = question["starter_code"]

    job_payload = {
        'job_id': job_id,
        'problem_id': problem_id,
        'language': payload["language"],
        'code': payload["code"],
        'test_cases': test_cases,
        'starter_code': starter_code
    }
    print(f"Job payload: {job_payload}")

    try:
        response = sqs.send_message(
            QueueUrl=SQS_QUEUE_URL,
            MessageBody=json.dumps(job_payload),
            MessageGroupId='default'
        )
        return {
            "status": "queued",
            "job_id": job_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@app.get("/api/leaderboard")
async def leaderboard():
    global valkey_client
    if not valkey_client:
        raise HTTPException(status_code=500, detail="Valkey client not initialized")

    key = "active_leaderboard"
    try:
        cached_value = await valkey_client.get(key)
        if cached_value:
            leaderboard_data = json.loads(cached_value)
        else:
            raise Exception("Could not find data in cache for key 'active_leaderboard'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # Return the cached leaderboard data as-is
    data = format_leaderboard_data(leaderboard_data)
    return data



@app.get("/api/leaderboard-testing")
async def leaderboard_testing():
    global valkey_client
    if not valkey_client:
        raise HTTPException(status_code=500, detail="Valkey client not initialized")

    test_key = "active_leaderboard_testing"
    try:
        cached_value = await valkey_client.get(test_key)
        if cached_value:
            leaderboard_data = json.loads(cached_value)
        else:
            raise Exception("Could not find data in cache for key 'active_leaderboard_testing'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    data = format_leaderboard_data(leaderboard_data)
    return data



# ==== WEBSOCKET for job results ===

@app.websocket("/ws/job-status/{job_id}")
async def websocket_job_status(websocket: WebSocket, job_id: str):
    print(f"Entering websocket for job_id: {job_id}")
    await websocket.accept()
    print("Websocket accepted.")

    # Set max time to wait for job result (seconds)
    timeout = 30 
    # Set time to wait in between cache polls
    poll_interval = 0.5
    start_time = time.time()

    try:
        cache_polled = False
        while True:
            job_result = await valkey_client.get(f"job:{job_id}")
            if not cache_polled:
                print("Cache being polled.")
                cache_polled = True

            if job_result:
                # Turn 'JSON string' cache data into JSON object
                json_job_result = json.loads(job_result.decode('utf-8'))
                print("> Cache hit!", json_job_result)
                # Send back to client
                await websocket.send_json({"status": "done", "job_result": json_job_result})
                break  # Stop polling once result is available

            elif time.time() - start_time > timeout:
                print(">> Time ran out!")
                error_msg = f"Job timed out after {timeout} seconds"
                await websocket.send_json({"status": "timeout", "error": error_msg})
                break  # Timeout; notify client and close websocket

            print("> Cache miss.")
            await asyncio.sleep(poll_interval)  # wait before next poll.
    finally:
        await websocket.close()