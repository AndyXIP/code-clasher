import json
import pytest
import asyncio
from fastapi.testclient import TestClient
from app import app  # This imports the FastAPI instance

# --- Fake Valkey Client ---
class FakeValkeyClient:
    def __init__(self):
        self.store = {}

    async def get(self, key):
        # Return the value if present.
        value = self.store.get(key)
        if value is not None:
            # In our app, the code expects a bytes object so we encode if it's a str.
            return value.encode('utf-8') if isinstance(value, str) else value
        return None

    async def set(self, key, value):
        # Store the value as a string.
        if isinstance(value, bytes):
            value = value.decode('utf-8')
        self.store[key] = value

    async def close(self):
        pass

# --- Pytest Fixtures ---
@pytest.fixture
def fake_valkey_client():
    return FakeValkeyClient()

@pytest.fixture
def client(fake_valkey_client, monkeypatch):
    # Patch GlideClient.create so it returns our fake_valkey_client
    from glide import GlideClient

    async def fake_create(config):
        return fake_valkey_client

    monkeypatch.setattr(GlideClient, "create", fake_create)
    # Also, patch the global valkey_client in the app (if needed)
    app.valkey_client = fake_valkey_client

    # Now, when TestClient(app) starts up, the startup event will call fake_create
    with TestClient(app) as test_client:
        yield test_client


# --- Test Cases ---
def test_job_result_websocket(client, fake_valkey_client):
    """
    Simulate storing a job result in the cache (as a JSON string),
    then connect to the websocket endpoint to verify that the
    cached result is decoded and sent back to the client.
    """
    job_id = "testjob"
    job_result = {
        "status": "completed",
        "output": [
            {
                "test_input": [-10],
                "expected": [0],
                "actual": {"error": "NameError: name 'fortnite' is not defined"},
                "passed": False
            },
            {
                "test_input": [10],
                "expected": [20],
                "actual": {"error": "NameError: name 'fortnite' is not defined"},
                "passed": False
            },
            {
                "test_input": [7],
                "expected": [17],
                "actual": {"error": "NameError: name 'fortnite' is not defined"},
                "passed": False
            }
        ]
    }
    # Set the job result in the fake cache under the key "job:{job_id}"
    asyncio.run(fake_valkey_client.set(f"job:{job_id}", json.dumps(job_result)))

    # Connect to the websocket endpoint.
    with client.websocket_connect(f"/ws/job-status/{job_id}") as websocket:
        data = websocket.receive_json()
        # Assert that the response indicates the job is done and contains the correct result.
        assert data["status"] == "done"
        assert data["job_result"] == job_result
