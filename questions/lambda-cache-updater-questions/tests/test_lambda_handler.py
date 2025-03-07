import json
import pytest
from unittest.mock import AsyncMock

# Import functions from your lambda file.
from lambda_handler import async_handler, lambda_handler


# --- Fake Valkey Client ---
class FakeValkeyClient:
    def __init__(self):
        self.store = {}

    async def get(self, key):
        value = self.store.get(key)
        if value is not None:
            # The code expects a bytes object, so if it's a str, encode it.
            return value.encode("utf-8") if isinstance(value, str) else value
        return None

    async def set(self, key, value):
        if isinstance(value, bytes):
            value = value.decode("utf-8")
        self.store[key] = value

    async def close(self):
        pass


# --- Pytest Fixtures ---
@pytest.fixture
def fake_valkey_client():
    return FakeValkeyClient()


@pytest.fixture(autouse=True)
def patch_valkey_client(mocker, fake_valkey_client):
    """
    Patch GlideClient.create in the lambda_handler module so that it returns
    our fake_valkey_client. Also reset the global valkey_client before each test.
    """
    mocker.patch(
        "lambda_handler.GlideClient.create", return_value=fake_valkey_client
    )
    import lambda_handler

    lambda_handler.valkey_client = None  # Reset global state if present


# --- Async Handler Tests ---
@pytest.mark.asyncio
async def test_async_handler_success(mocker, fake_valkey_client):
    """
    Test that async_handler successfully initializes the client,
    retrieves questions, formats the data, and updates the cache.
    """
    # Fake data for get_questions and format_questions_data.
    fake_questions = {
        "easy": [{"id": 1, "question": "Easy Q1"}],
        "hard": [{"id": 2, "question": "Hard Q1"}],
    }
    fake_payload = {
        "timestamp": "2025-03-02T00:00:00",
        "questions": fake_questions,
    }

    # Patch the helper functions.
    mocker.patch(
        "lambda_handler.get_questions",
        new=AsyncMock(return_value=fake_questions),
    )
    mocker.patch(
        "lambda_handler.format_questions_data", return_value=fake_payload
    )

    result = await async_handler({}, {})
    assert result["statusCode"] == 200
    body = json.loads(result["body"])
    assert body == fake_payload

    # Verify that the fake client's set method stored the payload.
    stored = await fake_valkey_client.get("active_questions")
    # stored is bytes; decode before comparing.
    assert stored.decode("utf-8") == json.dumps(fake_payload)


@pytest.mark.asyncio
async def test_async_handler_get_questions_failure(mocker, fake_valkey_client):
    """
    Test that if get_questions fails, async_handler returns a 500 status.
    """
    # Patch get_questions to raise an exception.
    mocker.patch(
        "lambda_handler.get_questions",
        new=AsyncMock(side_effect=Exception("Get questions error")),
    )

    result = await async_handler({}, {})
    assert result["statusCode"] == 500
    body = json.loads(result["body"])
    assert "Get questions error" in body["error"]


@pytest.mark.asyncio
async def test_async_handler_initialization_failure(mocker):
    """
    Test that if initializing the Valkey client fails, async_handler returns a 500 status.
    """
    # Patch GlideClient.create to raise an exception.
    mocker.patch(
        "lambda_handler.GlideClient.create",
        side_effect=Exception("Init failure"),
    )
    result = await async_handler({}, {})
    assert result["statusCode"] == 500
    body = json.loads(result["body"])
    assert "Valkey initialization failed" in body["error"]


# --- Synchronous Lambda Handler Test ---
def test_lambda_handler(mocker):
    """
    Test that the synchronous lambda_handler wrapper returns the expected result.
    """
    expected = {"statusCode": 200, "body": json.dumps({"dummy": "payload"})}
    # Patch async_handler to return our expected result.
    async_handler_patch = AsyncMock(return_value=expected)
    mocker.patch("lambda_handler.async_handler", new=async_handler_patch)
    # Patch asyncio.run to simulate calling the async_handler.
    mocker.patch("lambda_handler.asyncio.run", return_value=expected)
    result = lambda_handler({}, {})
    assert result == expected
