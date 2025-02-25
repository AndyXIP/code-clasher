from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import boto3
import os
import uuid
import json
import time
from dotenv import load_dotenv
from typing import List, Optional
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

class SubmitCodePayload(BaseModel):
    code: str
    problem_id: str
    language: str

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

@app.get("/api/daily-question")
async def daily_qustion(difficulty: str = 'easy'):
    # # Temporary fake data:
    # return {
    #     'description': 'Define a function which adds 10 to the inputted integer and returns the result.',
    #     'problem_id': '123',
    #     'test_cases': [[-10], [10], [7]]
    # }
    """
    Check Valkey cache: if miss, get new set of questions from Questions API
    and store in cache, and use #1; otherwise use today's Q from cache

    Return the Q as json to frontend
    """
    global valkey_client
    if not valkey_client:
        raise HTTPException(status_code=500, detail="Valkey client not initialized")

    key = "daily_question"
    try:
        cached_value = await valkey_client.get(key)
        if cached_value:
            # Convert string back to JSON
            daily_q = json.loads(cached_value)
            return daily_q
        else:
            # If cache miss, store a default daily question
            default_question = {
                "problem_id": "123",
                "description": "Define a function which adds 10 to the inputted integer and returns the result.",
                "test_cases": [[-10], [10], [7000]]
            }

            await valkey_client.set(key, json.dumps(default_question))
            # Optionally set a TTL (e.g., 24 hours = 86400 seconds)
            # await valkey_client.expire(key, 86400)

            return default_question
        
    except (TimeoutError, RequestError, ConnectionError, ClosingError) as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/submit-code")
async def submit_code(payload: SubmitCodePayload):
    job_id = str(uuid.uuid4())

    job_payload = {
        'job_id': job_id,
        'problem_id': payload.problem_id,
        'language': payload.language,
        'code': payload.code,
        'test_cases': {
            'inputs': [[-10], [10], [7]],
            'outputs': [[0], [20], [17]]
        }
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


# ==== WEBSOCKET for job results ===

@app.websocket("/ws/job-status/{job_id}")
async def websocket_job_status(websocket: WebSocket, job_id: str):
    await websocket.accept()

    timeout = 300
    start_time = time.time()
    poll_interval = 1  # seconds

    try:
        while True:
            job_result = await valkey_client.get(f"job:{job_id}")
            
            if job_result:
                await websocket.send_json({"status": "done", "job_result": job_result})
                break  # Stop polling once result is available
            elif time.time() - start_time > timeout:
                error_msg = f"Job timed out after {timeout} seconds"
                await websocket.send_json({"status": "timeout", "error": error_msg})
                break  # Timeout; notify client and close websocket

            await asyncio.sleep(poll_interval)  # wait before next poll
    finally:
        await websocket.close()