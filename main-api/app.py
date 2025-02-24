from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import boto3
import os
import uuid
import json
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
)

load_dotenv()

app = FastAPI()

sqs = boto3.client('sqs', region_name=os.getenv('AWS_REGION', 'eu-north-1'))
SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL')

class SubmitCodePayload(BaseModel):
    code: str
    problem_id: str
    language: str



@app.get("/")
def index():
    return {"message": "Welcome to the Main API!"}

@app.get("/api/daily-question")
def daily_qustion(difficulty: str = 'easy'):
    # Temporary fake data:
    return {
        'description': 'Define a function which adds 10 to the inputted integer and returns the result.',
        'problem_id': '123',
        'test_cases': [[-10], [10], [7]]
    }
    """
    Check Valkey cache: if miss, get new set of questions from Questions API
    and store in cache, and use #1; otherwise use today's Q from cache

    Return the Q as json to frontend
    """

@app.post("/api/submit-code")
def submit_code(payload: SubmitCodePayload):
    job_id = str(uuid.uuid4())

    job_payload = {
        'job_id': job_id,
        'problem_id': payload.problem_id,
        'language': payload.language,
        'code': payload.code,
        'status': 'queued',
    }

    try:
        response = sqs.send_message(
            QueueUrl=SQS_QUEUE_URL,
            MessageBody=json.dumps(job_payload),
            MessageGroupId='default'
        )
        return {
            "message_id": response.get('MessageId'), 
            "status": "queued"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

