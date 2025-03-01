# tests/test_sqs.py
import json
import uuid
import pytest
from fastapi.testclient import TestClient
from moto import mock_sqs
import boto3

# Import your FastAPI app; make sure the file name matches your actual implementation
import myapp

@pytest.fixture
def sqs_client_and_queue():
    with mock_sqs():
        # Create a fake SQS client and queue for testing.
        client = boto3.client('sqs', region_name='eu-north-1')
        queue = client.create_queue(QueueName='test-queue')
        queue_url = queue['QueueUrl']

        # Override the app's SQS client and queue URL with our mocked objects.
        myapp.sqs = client
        myapp.SQS_QUEUE_URL = queue_url

        yield client, queue_url

@pytest.fixture
def client(sqs_client_and_queue):
    # Create a TestClient instance to test our FastAPI app.
    with TestClient(myapp.app) as client:
        yield client

def test_submit_code_enqueues_message(client, sqs_client_and_queue):
    """
    Test that the /api/submit-code endpoint enqueues a job into SQS.
    """
    payload = {
        "code": "print('Hello World')",
        "problem_id": "prob-001",
        "language": "python"
    }

    # Send a POST request to the /api/submit-code endpoint.
    response = client.post("/api/submit-code", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Check that we received a 'queued' status and a job_id.
    assert data["status"] == "queued"
    assert "job_id" in data

    # Now, check that a message was enqueued in our fake SQS.
    sqs_client, queue_url = sqs_client_and_queue
    messages = sqs_client.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=1)
    assert "Messages" in messages, "No messages found in the queue"
    message = messages["Messages"][0]

    # The message body should be valid JSON containing the job details.
    body = json.loads(message["Body"])
    assert body["job_id"] == data["job_id"]
    assert body["problem_id"] == payload["problem_id"]
    assert body["language"] == payload["language"]
    # Additional asserts can be added to validate other parts of the payload.
