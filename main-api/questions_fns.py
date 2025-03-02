import httpx
from fastapi import HTTPException, status
from datetime import datetime, timezone
import json

BASE_URL = "https://byspc9u2xa.execute-api.eu-north-1.amazonaws.com/random-questions"

def get_day_index(timestamp_str: str) -> int:
    """
    Computes the number of days between the provided timestamp (assumed to be the day start)
    and the current day (UTC). Returns 0 if the result would be negative.
    """
    try:
        # Parse the timestamp; ensure it is treated as UTC.
        day_start = datetime.fromisoformat(timestamp_str)
        if day_start.tzinfo is None:
            day_start = day_start.replace(tzinfo=timezone.utc)
    except Exception as e:
        raise Exception("Invalid timestamp format: " + str(e))
    
    # Get today's day start in UTC.
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    delta_days = (today - day_start).days
    return max(delta_days, 0)


def parse_inputs_outputs(data):
    """Parses 'inputs' and 'outputs' fields from stringified lists into actual lists."""
    for key in ["inputs", "outputs"]:
        if key in data and isinstance(data[key], str):
            try:
                data[key] = json.loads(data[key])  # Convert stringified list to actual list
            except json.JSONDecodeError:
                pass  # Leave it unchanged if it fails
    return data