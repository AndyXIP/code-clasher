import pytest
import datetime
import httpx
from unittest.mock import patch, MagicMock, AsyncMock

from get_questions import (
    get_questions,
    get_day_start,
    format_questions_data,
    WeeklyQuestionsError,
)


@pytest.mark.asyncio
async def test_get_questions_success(mocker):
    """
    Test that get_questions() returns the expected 'easy' and 'hard' lists
    when the external API responds with 200 status and valid JSON.
    """
    # Mock environment variable
    mocker.patch.dict(
        "os.environ", {"QUESTIONS_API_URL": "http://mockapi.com"}
    )

    # Create mock responses
    easy_data = [{"id": 1, "question": "Easy Q1"}]
    hard_data = [{"id": 2, "question": "Hard Q1"}]

    mock_easy_response = MagicMock(status_code=200)
    mock_easy_response.json.return_value = easy_data

    mock_hard_response = MagicMock(status_code=200)
    mock_hard_response.json.return_value = hard_data

    # Create an AsyncMock for the client and configure __aenter__ to return itself
    mock_async_client = AsyncMock()
    mock_async_client.__aenter__.return_value = mock_async_client
    mock_async_client.get.side_effect = [
        mock_easy_response,
        mock_hard_response,
    ]

    # Patch httpx.AsyncClient to return our mock client
    mocker.patch("httpx.AsyncClient", return_value=mock_async_client)

    result = await get_questions()
    assert result["easy"] == easy_data
    assert result["hard"] == hard_data


@pytest.mark.asyncio
async def test_get_questions_non_200_easy(mocker):
    """
    Test that get_questions() raises WeeklyQuestionsError if the 'easy' call
    returns a non-200 status code.
    """
    mocker.patch.dict(
        "os.environ", {"QUESTIONS_API_URL": "http://mockapi.com"}
    )

    mock_easy_response = MagicMock(status_code=404)
    mock_hard_response = MagicMock(status_code=200)
    mock_hard_response.json.return_value = [{"id": 2, "question": "Hard Q1"}]

    mock_async_client = AsyncMock()
    mock_async_client.__aenter__.return_value = mock_async_client
    # The first .get() -> easy_response, second -> hard_response
    mock_async_client.get.side_effect = [
        mock_easy_response,
        mock_hard_response,
    ]

    mocker.patch("httpx.AsyncClient", return_value=mock_async_client)

    with pytest.raises(WeeklyQuestionsError) as exc:
        await get_questions()
    assert "Error fetching easy questions. Status code: 404" in str(exc.value)


@pytest.mark.asyncio
async def test_get_questions_non_200_hard(mocker):
    """
    Test that get_questions() raises WeeklyQuestionsError if the 'hard' call
    returns a non-200 status code.
    """
    mocker.patch.dict(
        "os.environ", {"QUESTIONS_API_URL": "http://mockapi.com"}
    )

    mock_easy_response = MagicMock(status_code=200)
    mock_easy_response.json.return_value = [{"id": 1, "question": "Easy Q1"}]
    mock_hard_response = MagicMock(status_code=500)

    mock_async_client = AsyncMock()
    mock_async_client.__aenter__.return_value = mock_async_client
    mock_async_client.get.side_effect = [
        mock_easy_response,
        mock_hard_response,
    ]

    mocker.patch("httpx.AsyncClient", return_value=mock_async_client)

    with pytest.raises(WeeklyQuestionsError) as exc:
        await get_questions()
    assert "Error fetching hard questions. Status code: 500" in str(exc.value)


@pytest.mark.asyncio
async def test_get_questions_request_error(mocker):
    """
    Test that get_questions() raises WeeklyQuestionsError if there's a network or request error.
    """
    mocker.patch.dict(
        "os.environ", {"QUESTIONS_API_URL": "http://mockapi.com"}
    )

    mock_async_client = AsyncMock()
    mock_async_client.__aenter__.return_value = mock_async_client
    # Simulate a request error on the first get() call.
    mock_async_client.get.side_effect = httpx.RequestError("Connection failed")

    mocker.patch("httpx.AsyncClient", return_value=mock_async_client)

    with pytest.raises(WeeklyQuestionsError) as exc:
        await get_questions()
    assert "Failed to contact external API: Connection failed" in str(
        exc.value
    )


@pytest.mark.asyncio
async def test_get_questions_invalid_json(mocker):
    """
    Test that get_questions() raises WeeklyQuestionsError if the JSON cannot be decoded.
    """
    mocker.patch.dict(
        "os.environ", {"QUESTIONS_API_URL": "http://mockapi.com"}
    )

    mock_easy_response = MagicMock(status_code=200)
    mock_easy_response.json.side_effect = ValueError(
        "No JSON object could be decoded"
    )

    mock_hard_response = MagicMock(status_code=200)
    mock_hard_response.json.return_value = []

    mock_async_client = AsyncMock()
    mock_async_client.__aenter__.return_value = mock_async_client
    mock_async_client.get.side_effect = [
        mock_easy_response,
        mock_hard_response,
    ]

    mocker.patch("httpx.AsyncClient", return_value=mock_async_client)

    with pytest.raises(WeeklyQuestionsError) as exc:
        await get_questions()
    assert (
        "Invalid JSON response from external API: No JSON object could be decoded"
        in str(exc.value)
    )


def test_get_day_start_no_reference():
    """
    Test that get_day_start() returns today's 00:00 UTC if no reference is provided.
    """
    result = get_day_start()
    now_utc = datetime.datetime.utcnow()
    assert result.hour == 0
    assert result.minute == 0
    # The day_start should match today's date in UTC
    assert result.date() == now_utc.date()


def test_get_day_start_with_reference():
    """
    Test that get_day_start() correctly uses the provided reference date.
    """
    ref = datetime.datetime(2025, 3, 2, 15, 30, 0)
    result = get_day_start(ref)
    expected = datetime.datetime(2025, 3, 2, 0, 0, 0)
    assert result == expected


def test_format_questions_data():
    """
    Test that format_questions_data() returns the expected structure,
    including the correct timestamp.
    """
    # Sample input
    questions_data = {
        "easy": [{"id": 1, "question": "Easy Q1"}],
        "hard": [{"id": 2, "question": "Hard Q1"}],
    }

    # Patch get_day_start so we have a predictable timestamp
    with patch("get_questions.get_day_start") as mock_get_day_start:
        mock_get_day_start.return_value = datetime.datetime(
            2025, 3, 2, 0, 0, 0
        )

        result = format_questions_data(questions_data)

        assert result["timestamp"] == "2025-03-02T00:00:00"
        assert "questions" in result
        assert result["questions"]["easy"] == questions_data["easy"]
        assert result["questions"]["hard"] == questions_data["hard"]
