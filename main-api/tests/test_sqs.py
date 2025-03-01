import json
import pytest
from fastapi.testclient import TestClient
from moto import mock_aws  
import boto3

from app import app

# Fake Valkey client for testing purposes.
class FakeValkeyClient:
    async def close(self):
        pass

@pytest.fixture
def sqs_client_and_queue():
    with mock_aws():
        client = boto3.client('sqs', region_name='eu-north-1')
        # Create a FIFO queue with ContentBasedDeduplication enabled.
        queue = client.create_queue(
            QueueName='test-queue.fifo',
            Attributes={
                'FifoQueue': 'true',
                'ContentBasedDeduplication': 'true'
            }
        )
        queue_url = queue['QueueUrl']
        
        # Override the app's SQS client and queue URL with our mocked objects.
        import app
        app.sqs = client
        app.SQS_QUEUE_URL = queue_url
        
        yield client, queue_url



@pytest.fixture
def client(sqs_client_and_queue, monkeypatch):
    # Monkey-patch GlideClient.create so that it returns a fake client
    from glide import GlideClient

    async def fake_create(config):
        return FakeValkeyClient()

    monkeypatch.setattr(GlideClient, "create", fake_create)

    # Now when the TestClient starts up and calls the startup event,
    # it won't try to create a real connection.
    with TestClient(app) as test_client:
        yield test_client

def test_submit_code_enqueues_message(client, sqs_client_and_queue):
    """
    Test that the /api/submit-code endpoint enqueues a job into SQS.
    """
    client_payload = {
        'problem_id': "42",
        'language': "python",
        'code': "print('Hello hello to the world')"
    }

    # Send a POST request to the /api/submit-code endpoint.
    response = client.post("/api/submit-code", json=client_payload)
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
    assert body["problem_id"] == client_payload["problem_id"]
    assert body["language"] == client_payload["language"]
    # Additional asserts can be added to validate other parts of the payload.
